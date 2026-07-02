import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Ministries from "./pages/Ministries";
import Missions from "./pages/Missions";
import Admin from "./pages/Admin";
import { supabase } from "./lib/supabaseClient";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/ministries" element={<Ministries />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}
