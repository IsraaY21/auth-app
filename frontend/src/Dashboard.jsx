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

  if (!username) return <p>Loading...</p>;

  return <h2>Welcome, {username}</h2>;
}

export default Dashboard;