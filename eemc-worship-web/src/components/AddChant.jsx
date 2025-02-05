import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AddChant = () => {
  const [titre, setTitre] = useState("");
  const [lead, setLead] = useState("");
  const [note, setNote] = useState("Do");
  const [category, setCategory] = useState("Adoration");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titre || !lead || !note || !category) {
      setErrorMessage("Tous les champs obligatoires doivent être remplis.");
      return;
    }

    try {
      await addDoc(collection(db, "chants"), {
        titre,
        lead,
        note,
        category,
        youtubeLink,
        lyrics,
        timestamp: new Date(),
      });
      navigate("/"); // Retour à la liste des chants
    } catch (error) {
      console.error("Erreur lors de l'ajout du chant :", error);
    }
  };

  return (
    <div className="add-chant-container">
      <h1>➕ Ajouter un Chant</h1>
      <form onSubmit={handleSubmit} className="add-chant-form">
        <div className="form-group">
          <label>Titre :</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Leader :</label>
          <input
            type="text"
            value={lead}
            onChange={(e) => setLead(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Note :</label>
          <select
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          >
            {["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"].map(
              (note) => (
                <option key={note} value={note}>
                  {note}
                </option>
              )
            )}
          </select>
        </div>

        <div className="form-group">
          <label>Catégorie :</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {["Adoration", "Prélude", "Louange", "Dévotion"].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Lien YouTube :</label>
          <input
            type="text"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Paroles :</label>
          <textarea
            rows="6"
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
          ></textarea>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className="save-button">💾 Ajouter</button>
      </form>
    </div>
  );
};

export default AddChant;

