import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Ministries from "./pages/Ministries";
import Missions from "./pages/Missions";
import Give from "./pages/Give";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/ministries" element={<Ministries />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/give" element={<Give />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
    </>
  );
}
