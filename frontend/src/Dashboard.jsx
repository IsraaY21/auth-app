import { useNavigate } from "react-router-dom";

function Dashboard({ user }) {
  const navigate = useNavigate();

  async function handleLogout() {
    await fetch("http://localhost/auth-api/logout.php", {
      method: "POST",
      credentials: "include",
    });

    navigate("/");
  }

  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
