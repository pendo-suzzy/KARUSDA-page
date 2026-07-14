import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import { normalizeUrl } from "../lib/urlHelpers";

export const AppContext = createContext();

const DEFAULT_DATA = {
  announcements: [],
  events: { services: [], gatherings: [], volunteer: [] },
  gallery: [],
  ministries: [],
  choir: { name: "KARUSDA Grand Choir", members: 62, leadName: "Bro. Daniel Mwangi", practiceTimes: [], description: "", videos: [] },
  leadership: [],
  sermons: [],
  missions: { past: [], upcoming: [] },
  stats: { yearsActive: 0, members: 0, ministries: 0, choirVoices: 0 },
  contact: { address: "", email: "", facebook: "", instagram: "", youtube: "" },
};

const normalizeItemForTable = ({ table_name, item }) => {
  const normalizedItem = { ...item };

  if (!normalizedItem) return normalizedItem;

  if (table_name === "gallery") {
    normalizedItem.src = normalizeUrl(normalizedItem.src || normalizedItem.url || normalizedItem.photoUrl);
  }

  if (table_name === "leadership") {
    normalizedItem.photo = normalizeUrl(normalizedItem.photo);
  }

  if (table_name === "sermons" || table_name === "sermon") {
    normalizedItem.youtubeUrl = normalizeUrl(normalizedItem.youtubeUrl || normalizedItem.youtube_url);
  }

  if (table_name === "announcements") {
    normalizedItem.likes = Number(normalizedItem.likes || 0);
  }

  return normalizedItem;
};

const buildItemPayload = (item, table) => {
  const common = { ...item };

  if (table === "events") {
    return {
      id: item.id,
      category: item.category || "services",
      title: item.title,
      date: item.date,
      time: item.time,
      location: item.location,
      description: item.description,
      isSabbathEve: item.isSabbathEve || false,
    };
  }

  if (table === "missions") {
    return {
      id: item.id,
      title: item.title,
      year: item.year,
      summary: item.summary,
      goalKes: item.goalKes || 0,
      raisedKes: item.raisedKes || 0,
    };
  }

  return common;
};

const TABLE_NAMES = [
  "announcements",
  "events",
  "gallery",
  "leadership",
  "ministries",
  "choir",
  "missions",
  "sermon",
];

const normalizeTableName = (tableName) => {
  if (tableName === "sermons") return "sermon";
  if (tableName === "choir_videos") return "choir";
  return tableName;
};

const buildDataFromRows = ({ announcements, events, gallery, leadership, ministries, choir, missions, sermon }) => {
  const data = { ...DEFAULT_DATA };

  data.announcements = announcements || [];
  data.gallery = gallery || [];
  data.ministries = ministries || [];
  data.leadership = leadership || [];
  data.sermons = sermon || [];
  data.choir = {
    ...data.choir,
    videos: choir || [],
  };

  data.events = {
    services: [],
    gatherings: [],
    volunteer: [],
  };
  (events || []).forEach((event) => {
    const category = event.category || "services";
    data.events[category] = [...(data.events[category] || []), event];
  });

  data.missions = {
    past: [],
    upcoming: [],
  };
  (missions || []).forEach((mission) => {
    if (mission.upcoming === false) {
      data.missions.past.push(mission);
    } else {
      data.missions.upcoming.push(mission);
    }
  });

  return data;
};

const fetchTable = async (table) => {
  const { data, error } = await supabase
    .from(table)
    .select("*");

  if (error) {
    throw error;
  }

  return data || [];
};

const fetchAppData = async () => {
  const [announcements, events, gallery, leadership, ministries, choir, missions, sermon] = await Promise.all(
    TABLE_NAMES.map(fetchTable)
  );

  return buildDataFromRows({ announcements, events, gallery, leadership, ministries, choir, missions, sermon });
};

const upsertRow = async ({ table_name, item }) => {
  const table = normalizeTableName(table_name);
  const normalizedItem = normalizeItemForTable({ table_name, item });
  const { data, error } = await supabase
    .from(table)
    .upsert(normalizedItem, { onConflict: ["id"] });

  if (error) {
    throw error;
  }

  return data;
};

const deleteRow = async ({ table_name, id }) => {
  const table = normalizeTableName(table_name);
  const { error } = await supabase
    .from(table)
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
};

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const fetched = await fetchAppData();
        setData(fetched);
      } catch (err) {
        console.error("Unable to fetch Supabase data:", err);
        setError(err.message || "Failed to fetch app data");
      } finally {
        setLoading(false);
      }
    };

    load();

    const realtimeChannel = supabase.channel("public:supabase-data");
    TABLE_NAMES.forEach((table) => {
      realtimeChannel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        async () => {
          try {
            const fetched = await fetchAppData();
            setData(fetched);
          } catch (err) {
            console.error("Supabase realtime refresh failed:", err);
          }
        }
      );
    });
    realtimeChannel.subscribe();

    return () => {
      realtimeChannel.unsubscribe();
    };
  }, []);

  const syncItem = async ({ table_name, item }) => {
    await upsertRow({ table_name, item });
  };

  const removeItem = async ({ table_name, id }) => {
    await deleteRow({ table_name, id });
  };

  const likeAnnouncement = async (id) => {
    let updatedItem = null;

    setData((current) => {
      const announcements = (current.announcements || []).map((item) => {
        if (item.id !== id) return item;
        updatedItem = { ...item, likes: (item.likes || 0) + 1 };
        return updatedItem;
      });

      return { ...current, announcements };
    });

    if (!updatedItem) return;

    try {
      const { data: existingRow, error: fetchError } = await supabase
        .from("announcements")
        .select("likes")
        .eq("id", id)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      const nextLikes = Number(existingRow?.likes || updatedItem.likes || 0) + 1;
      const { error: updateError } = await supabase
        .from("announcements")
        .update({ likes: nextLikes })
        .eq("id", id);

      if (updateError) {
        try {
          await supabase.rpc("increment_announcement_likes", {
            announcement_id: id,
          });
        } catch (rpcError) {
          console.warn("Announcement like RPC unavailable, falling back to upsert.", rpcError);
          await syncItem({ table_name: "announcements", item: { ...updatedItem, likes: nextLikes } });
        }
      }

      const refreshed = await fetchAppData();
      setData(refreshed);
    } catch (err) {
      console.error("Failed to persist announcement like:", err);
      const refreshed = await fetchAppData();
      setData(refreshed);
    }
  };

  const getUniqueId = (prefix) => `${prefix}-${Date.now()}`;

  const actions = useMemo(() => ({
    fetchAppData,
    syncItem,
    removeItem,
    getUniqueId,
    likeAnnouncement,
  }), []);

  return (
    <AppContext.Provider value={{ data, setData, loading, error, ...actions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
