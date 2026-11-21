import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  useEffect(() => {
    async function restoreSession() {
      try {
        const res = await fetch("http://localhost/auth-api/whoami.php", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.ok) {
          setUser({ id: data.user_id, username: data.username });
        }
      } catch {
      } finally {
        setChecking(false);
      }
    }

    restoreSession();
  }, []);

  if (checking) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <header className="topbar">
        <span>{user ? `Logged in as ${user.username}` : "Not logged in"}</span>
        <button onClick={toggleTheme}>
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
      </header>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Register />
              <Login setUser={setUser} />
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
