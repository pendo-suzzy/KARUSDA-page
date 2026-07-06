import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";

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

const buildDataFromRows = (rows) => {
  const data = { ...DEFAULT_DATA };

  rows.forEach((row) => {
    switch (row.table_name) {
      case "announcements":
        data.announcements.push(row.payload);
        break;
      case "gallery":
        data.gallery.push(row.payload);
        break;
      case "ministries":
        data.ministries.push(row.payload);
        break;
      case "leadership":
        data.leadership.push(row.payload);
        break;
      case "sermons":
        data.sermons.push(row.payload);
        break;
      case "choir_videos":
        data.choir.videos.push(row.payload);
        break;
      case "missions":
        if (row.payload.upcoming) {
          data.missions.upcoming.push(row.payload);
        } else {
          data.missions.past.push(row.payload);
        }
        break;
      case "events":
        data.events[row.payload.category] = [
          ...(data.events[row.payload.category] || []),
          row.payload,
        ];
        break;
      case "stats":
        data.stats = row.payload;
        break;
      case "contact":
        data.contact = row.payload;
        break;
      default:
        break;
    }
  });

  return data;
};

const fetchAppData = async () => {
  const { data: rows, error } = await supabase
    .from("app_data")
    .select("table_name, payload");

  if (error) {
    throw error;
  }

  return buildDataFromRows(rows || []);
};

const upsertRow = async ({ table_name, id, payload }) => {
  const { data, error } = await supabase
    .from("app_data")
    .upsert({ table_name, id, payload }, { onConflict: ["table_name", "id"] });

  if (error) {
    throw error;
  }

  return data;
};

const deleteRow = async ({ table_name, id }) => {
  const { error } = await supabase
    .from("app_data")
    .delete()
    .eq("table_name", table_name)
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
    const realtimeChannel = supabase
      .channel("public:app_data")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "app_data" },
        async () => {
          try {
            const fetched = await fetchAppData();
            setData(fetched);
          } catch (err) {
            console.error("Supabase realtime refresh failed:", err);
          }
        }
      )
      .subscribe();
  }, []);

  const syncItem = async ({ table_name, item }) => {
    const payload = buildItemPayload(item, table_name);
    const row = {
      table_name,
      id: item.id,
      payload,
    };

    await upsertRow(row);
  };

  const removeItem = async ({ table_name, id }) => {
    await deleteRow({ table_name, id });
  };

  const getUniqueId = (prefix) => `${prefix}-${Date.now()}`;

  const actions = useMemo(() => ({
    fetchAppData,
    syncItem,
    removeItem,
    getUniqueId,
  }), []);

  return (
    <AppContext.Provider value={{ data, setData, loading, error, ...actions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
