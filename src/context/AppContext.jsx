import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { initialData, ADMIN_CREDENTIALS } from "../data/initialData";

const STORAGE_KEY = "karusda_data_v2";
const SESSION_KEY = "karusda_admin_session";

const AppContext = createContext(null);

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...initialData,
        ...parsed,
        choir: {
          ...initialData.choir,
          ...(parsed.choir || {})
        },
        events: {
          ...initialData.events,
          ...(parsed.events || {})
        },
        missions: {
          ...initialData.missions,
          ...(parsed.missions || {})
        }
      };
    }
  } catch (e) {
    console.warn("Could not read stored data, falling back to seed data.", e);
  }
  return initialData;
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function AppProvider({ children }) {
  const [data, setData] = useState(loadData);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(SESSION_KEY) === "true");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // ---- Auth ----
  const login = useCallback((username, password) => {
    const ok =
      username.trim() === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
    if (ok) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setIsAdmin(true);
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAdmin(false);
  }, []);

  // ---- Announcements ----
  const likeAnnouncement = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      announcements: prev.announcements.map((a) =>
        a.id === id ? { ...a, likes: a.likes + 1 } : a
      ),
    }));
  }, []);

  const addAnnouncement = useCallback((announcement) => {
    setData((prev) => ({
      ...prev,
      announcements: [
        { ...announcement, id: uid("a"), likes: 0 },
        ...prev.announcements,
      ],
    }));
  }, []);

  const deleteAnnouncement = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      announcements: prev.announcements.filter((a) => a.id !== id),
    }));
  }, []);

  // ---- Events (category: services | gatherings | volunteer) ----
  const addEvent = useCallback((category, event) => {
    setData((prev) => ({
      ...prev,
      events: {
        ...prev.events,
        [category]: [...prev.events[category], { ...event, id: uid("e") }],
      },
    }));
  }, []);

  const deleteEvent = useCallback((category, id) => {
    setData((prev) => ({
      ...prev,
      events: {
        ...prev.events,
        [category]: prev.events[category].filter((e) => e.id !== id),
      },
    }));
  }, []);

  // ---- Gallery ----
  const addGalleryItem = useCallback((item) => {
    setData((prev) => ({
      ...prev,
      gallery: [{ ...item, id: uid("p") }, ...prev.gallery],
    }));
  }, []);

  const deleteGalleryItem = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((g) => g.id !== id),
    }));
  }, []);

  // ---- Ministries ----
  const updateMinistry = useCallback((id, patch) => {
    setData((prev) => ({
      ...prev,
      ministries: prev.ministries.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));
  }, []);

  // ---- Choir ----
  const updateChoir = useCallback((patch) => {
    setData((prev) => ({ ...prev, choir: { ...prev.choir, ...patch } }));
  }, []);

  const addChoirVideo = useCallback((video) => {
    setData((prev) => ({
      ...prev,
      choir: {
        ...prev.choir,
        videos: [...(prev.choir.videos || []), { ...video, id: uid("cv") }],
      },
    }));
  }, []);

  const deleteChoirVideo = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      choir: {
        ...prev.choir,
        videos: (prev.choir.videos || []).filter((v) => v.id !== id),
      },
    }));
  }, []);

  // ---- Sermons ----
  const addSermon = useCallback((sermon) => {
    setData((prev) => ({
      ...prev,
      sermons: [{ ...sermon, id: uid("sermon") }, ...(prev.sermons || [])],
    }));
  }, []);

  const deleteSermon = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      sermons: (prev.sermons || []).filter((s) => s.id !== id),
    }));
  }, []);

  // ---- Leadership ----
  const addLeader = useCallback((leader) => {
    setData((prev) => ({
      ...prev,
      leadership: [...prev.leadership, { ...leader, id: uid("l") }],
    }));
  }, []);

  const deleteLeader = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      leadership: prev.leadership.filter((l) => l.id !== id),
    }));
  }, []);

  // ---- Missions ----
  const addMission = useCallback((kind, mission) => {
    setData((prev) => ({
      ...prev,
      missions: {
        ...prev.missions,
        [kind]: [...prev.missions[kind], { ...mission, id: uid("ms") }],
      },
    }));
  }, []);

  const deleteMission = useCallback((kind, id) => {
    setData((prev) => ({
      ...prev,
      missions: {
        ...prev.missions,
        [kind]: prev.missions[kind].filter((m) => m.id !== id),
      },
    }));
  }, []);

  const contributeToMission = useCallback((id, amountKes) => {
    setData((prev) => ({
      ...prev,
      missions: {
        ...prev.missions,
        upcoming: prev.missions.upcoming.map((m) =>
          m.id === id ? { ...m, raisedKes: (m.raisedKes || 0) + amountKes } : m
        ),
      },
    }));
  }, []);

  const value = {
    data,
    isAdmin,
    login,
    logout,
    likeAnnouncement,
    addAnnouncement,
    deleteAnnouncement,
    addEvent,
    deleteEvent,
    addGalleryItem,
    deleteGalleryItem,
    updateMinistry,
    updateChoir,
    addChoirVideo,
    deleteChoirVideo,
    addSermon,
    deleteSermon,
    addLeader,
    deleteLeader,
    addMission,
    deleteMission,
    contributeToMission,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within an AppProvider");
  return ctx;
}
