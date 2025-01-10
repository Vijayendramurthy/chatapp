import React, { useState } from "react";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      {!user ? (
        <>
          <Login onLogin={setUser} />
          <Register />
        </>
      ) : (
        <Chat onLogout={() => setUser(null)} />
      )}
    </div>
  );
}

export default App;
