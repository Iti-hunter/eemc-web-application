import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const Auth = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const auth = getAuth();

  useEffect(() => {
    // Vérifie si l'utilisateur est déjà connecté
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, [auth, setUser]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // 🔥 Convertir "cdl" en email pour Firebase
    const email = username === "cdl" ? "cdl@example.com" : username;

    if (email !== "cdl@eemc.com" || password !== "vivredanslunité") {
      setError("Identifiant ou mot de passe incorrect");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUser(auth.currentUser);
      setError("");
    } catch (error) {
      setError("Problème de connexion");
      console.error("Erreur Firebase :", error.message);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
  };

  return (
    <div>
      {auth.currentUser ? (
        <>
          <p>✅ Connecté en tant que CDL</p>
          <button onClick={handleLogout}>🚪 Déconnexion</button>
        </>
      ) : (
        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Identifiant" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          <button type="submit">🔑 Connexion</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default Auth;

