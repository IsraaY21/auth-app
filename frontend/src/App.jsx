import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

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
      <p>{user ? `Logged in as ${user.username}` : "Not logged in"}</p>
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
