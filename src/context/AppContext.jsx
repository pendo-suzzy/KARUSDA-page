import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import { normalizeUrl } from "../lib/urlHelpers";

export const AppContext = createContext();

const DEFAULT_DATA = {
  announcements: [],
  events: { services: [], gatherings: [], volunteer: [] },
  gallery: [],
  ministries: [],
  choir: { name: "KARUSDA Grand Choir", members: 62, practiceTimes: [], description: "", videos: [] },
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

  // Map internal camelCase properties to exactly match the lowercase columns added to Supabase
  if (normalizedItem.documentUrl !== undefined) {
    normalizedItem.documenturl = normalizedItem.documentUrl;
    delete normalizedItem.documentUrl;
  }

  if (normalizedItem.imageUrl !== undefined) {
    normalizedItem.imageurl = normalizedItem.imageUrl;
    if (["announcements", "events", "gallery"].includes(table_name)) {
      normalizedItem.imageupload = normalizedItem.imageUrl;
    }
    delete normalizedItem.imageUrl;
  }

  if (table_name === "gallery" && normalizedItem.src !== undefined) {
    if (!normalizedItem.imageupload) {
      normalizedItem.imageupload = normalizedItem.src;
    }
    if (!normalizedItem.imageurl) {
      normalizedItem.imageurl = normalizedItem.src;
    }
    delete normalizedItem.src;
  }

  if (table_name === "events" || table_name === "ministries") {
    if (normalizedItem.dateTime !== undefined) {
      if (!normalizedItem.dateTime) {
        throw new Error(`"Date & Time" is required and cannot be empty for ${table_name}. Please select a date and time.`);
      }
      normalizedItem["date/time"] = normalizedItem.dateTime;
      delete normalizedItem.dateTime;
    }
    delete normalizedItem.date;
    delete normalizedItem.time;
    delete normalizedItem.meetingDay;
    delete normalizedItem.meetingTime;
  }

  return normalizedItem;
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

const mapRowFromDb = (row) => ({
  ...row,
  documentUrl: row.documenturl || row.documentUrl || "",
  imageUrl: row.imageurl || row.imageupload || row.imageUrl || "",
  src: row.imageurl || row.imageupload || row.src || "",
  youtubeUrl: row.youtubeurl || row.youtubeUrl || "",
  dateTime: row["date/time"] || row.dateTime || (row.date && row.time ? `${row.date}T${row.time}` : "") || (row.meetingDay && row.meetingTime ? `${row.meetingDay} ${row.meetingTime}` : ""),
});

const buildDataFromRows = ({ announcements, events, gallery, leadership, ministries, choir, missions, sermon }) => {
  const data = { ...DEFAULT_DATA };

  data.announcements = (announcements || []).map(mapRowFromDb);
  data.gallery = (gallery || []).map(mapRowFromDb);
  data.ministries = (ministries || []).map(mapRowFromDb);
  data.leadership = (leadership || []).map(mapRowFromDb);
  data.sermons = (sermon || []).map(mapRowFromDb);
  data.choir = {
    ...data.choir,
    videos: (choir || []).map(mapRowFromDb),
  };

  data.events = {
    services: [],
    gatherings: [],
    volunteer: [],
  };
  (events || []).forEach((e) => {
    const event = mapRowFromDb(e);
    const category = event.category || "services";
    data.events[category] = [...(data.events[category] || []), event];
  });

  data.missions = {
    past: [],
    upcoming: [],
  };
  (missions || []).forEach((m) => {
    const mission = mapRowFromDb(m);
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
  
  let currentItem = { ...normalizedItem };
  let droppedColumns = [];
  let attempt = 0;

  while (attempt < 5) {
    const { data, error } = await supabase
      .from(table)
      .upsert(currentItem, { onConflict: ["id"] });

    if (error && error.code === 'PGRST204') {
      const match = error.message.match(/'([^']+)' column/);
      if (match && match[1]) {
        const missingColumn = match[1];
        console.warn(`Column '${missingColumn}' is missing in Supabase. Retrying without it...`);
        delete currentItem[missingColumn];
        droppedColumns.push(missingColumn);
        attempt++;
        continue;
      }
    }

    if (error) {
      throw error;
    }

    if (droppedColumns.length > 0) {
      alert(`Saved successfully, but the following fields were lost because they don't exist as columns in your Supabase database: ${droppedColumns.join(", ")}. Please add them as text columns!`);
    }

    return data;
  }
  
  throw new Error("Too many missing columns, aborting save.");
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
