import { createContext, useContext, useEffect, useState } from "react";
import { initialData } from "../data/initialData";

export const AppContext = createContext();

const getStoredData = () => {
  if (typeof window === "undefined") return initialData;

  try {
    const stored = window.localStorage.getItem("karusda-data");
    return stored ? JSON.parse(stored) : initialData;
  } catch {
    return initialData;
  }
};

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(getStoredData);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("karusda-data", JSON.stringify(data));
    }
  }, [data]);

  const likeAnnouncement = (id) => {
    setData((prev) => ({
      ...prev,
      announcements: prev.announcements.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      ),
    }));
  };

  return (
    <AppContext.Provider value={{ data, setData, likeAnnouncement }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
