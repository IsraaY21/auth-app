function Dashboard({ user, setUser }) {
  async function handleLogout() {
    await fetch("http://localhost/auth-api/logout.php", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
  }

  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
