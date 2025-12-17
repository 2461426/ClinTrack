
import React from "react";

const Home = () => {
  const raw = localStorage.getItem("logged_in_user");
  let user = null;
  try {
    user = raw ? JSON.parse(raw) : null;
  } catch (e) {
    user = null;
  }

  // Prefer a name field if available, else use email
  const displayName = user && (user.name || user.username || user.email || user.id || "User");

  return (
    <section>
      <h2>Welcome, {displayName}</h2>
      <p>This is your home page. From here, you can navigate to About, Trials, and Contact.</p>
    </section>
  );
};

export default Home;