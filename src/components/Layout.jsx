import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <header>
        <nav>
          {/* Add navigation here */}
          <h1>KARUSDA</h1>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>&copy; 2024 KARUSDA</p>
      </footer>
    </div>
  );
}
