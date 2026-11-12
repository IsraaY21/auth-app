import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function checkLogin() {
      const res = await fetch("http://localhost/auth-api/dashboard.php", {
        credentials: "include",
      });

      if (res.status === 401) {
        navigate("/");
        return;
      }

      const data = await res.json();
      setUsername(data.username);
    }

    checkLogin();
  }, [navigate]);

  async function handleLogout() {
    await fetch("http://localhost/auth-api/logout.php", {
      method: "POST",
      credentials: "include",
    });

    setUsername("");
    navigate("/");
  }

  if (!username) return <p>Loading...</p>;

  return (
    <div>
      <h2>Welcome, {username}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;