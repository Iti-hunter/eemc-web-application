import React, { useEffect, useState, memo, useRef } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ChantItem = memo(({ chant, onClick, onOptionsClick, showOptions, onDelete, onEdit }) => {
  return (
    <li className="chant-item">
      <span onClick={() => onClick(chant)}>{chant.titre}</span>
      <div className="options">
        <button className="options-btn" onClick={(e) => onOptionsClick(e, chant.id)}>
          ⋮
        </button>
        {showOptions === chant.id && (
          <div className="dropdown">
            <button onClick={() => onEdit(chant)}>✏️ Modifier</button>
            <button onClick={() => onDelete(chant.id)}>🗑️ Supprimer</button>
          </div>
        )}
      </div>
    </li>
  );
});

const ChantList = () => {
  const [chants, setChants] = useState([]);
  const [selectedChant, setSelectedChant] = useState(null);
  const [editChant, setEditChant] = useState(null);
  const [showOptions, setShowOptions] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [errorMessage, setErrorMessage] = useState("");

  const optionsRef = useRef(null);
  const navigate = useNavigate();

  // Gestion des clics en dehors du menu pour le fermer
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Récupérer les chants depuis Firebase
  useEffect(() => {
    const fetchChants = async () => {
      const querySnapshot = await getDocs(collection(db, "chants"));
      const chantsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sortedChants = chantsList.sort((a, b) => a.timestamp - b.timestamp);
      setChants(sortedChants);
    };

    fetchChants();
  }, []);

  // Supprimer un chant
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce chant ?")) {
      await deleteDoc(doc(db, "chants", id));
      setChants(chants.filter((chant) => chant.id !== id));
      setSelectedChant(null); // Fermer la modale si elle est ouverte
    }
  };

  // Passer en mode édition
  const handleEdit = (chant) => {
    setEditChant(chant);
    setSelectedChant(null); // Fermer la modale des détails
  };

  // Sauvegarder les modifications
  const saveEdit = async () => {
    if (!editChant.lyrics) {
      setErrorMessage("Les paroles ne peuvent pas être vides.");
      return;
    }

    const cleanedChant = {
      ...editChant,
      youtubeLink: editChant.youtubeLink || "",
      category: editChant.category || "Adoration",
      note: editChant.note || "Do",
    };

    try {
      const chantDoc = doc(db, "chants", cleanedChant.id);
      await updateDoc(chantDoc, cleanedChant);
      setChants((prev) =>
        prev.map((chant) => (chant.id === cleanedChant.id ? cleanedChant : chant))
      );
      setEditChant(null);
      setErrorMessage(""); // Réinitialiser le message d'erreur
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
    }
  };

  const handleOptionsClick = (e, id) => {
    e.stopPropagation(); // Empêche la propagation du clic
    setShowOptions((prev) => (prev === id ? null : id));
  };

  const filteredChants = chants.filter((chant) => {
    const matchesSearch = chant.titre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tous" || chant.category?.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="chant-container" ref={optionsRef}>
      <h1>📜 Liste des Chants</h1>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher un chant..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {/* Filtre par catégorie */}
      <div className="filter">
        <label>Filtrer par :</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-filter"
        >
          <option value="Tous">Tous</option>
          <option value="Adoration">Adoration</option>
          <option value="Louange">Louange</option>
          <option value="Dévotion">Dévotion</option>
          <option value="Prélude">Prélude</option>
        </select>
      </div>

      {/* Bouton ajouter */}
      <button
        className="add-button"
        onClick={() => navigate("/add-chant")}
      >
        ➕ Ajouter un chant
      </button>

      {/* Liste des chants */}
      <ul className="chant-list">
        {filteredChants.map((chant) => (
          <ChantItem
            key={chant.id}
            chant={chant}
            onClick={setSelectedChant}
            onOptionsClick={handleOptionsClick}
            showOptions={showOptions}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </ul>

      {/* Modale pour les détails du chant */}
      {selectedChant && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedChant.titre}</h2>
            <p><strong>🎤 Leader :</strong> {selectedChant.lead}</p>
            <p><strong>🎵 Note :</strong> {selectedChant.note}</p>
            <p><strong>📂 Catégorie :</strong> {selectedChant.category}</p>
            <p>
              {selectedChant.youtubeLink ? (
                <a
                  href={selectedChant.youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ▶️ Écouter sur YouTube
                </a>
              ) : (
                "Lien YouTube absent ou manquant"
              )}
            </p>
            <p>
              <strong>📜 Paroles :</strong>{" "}
              {selectedChant.lyrics ? selectedChant.lyrics : "Aucune parole disponible"}
            </p>
            <div className="button-group">
              <button onClick={() => handleEdit(selectedChant)}>✏️ Modifier</button>
              <button onClick={() => handleDelete(selectedChant.id)}>🗑️ Supprimer</button>
            </div>
            <button onClick={() => setSelectedChant(null)}>❌ Fermer</button>
          </div>
        </div>
      )}

      {/* Modale pour modifier un chant */}
      {editChant && (
        <div className="modal">
          <div className="modal-content">
            <h2>Modifier le Chant</h2>
            <div className="form-group">
              <label>Titre :</label>
              <input
                type="text"
                value={editChant.titre}
                onChange={(e) => setEditChant({ ...editChant, titre: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Leader :</label>
              <input
                type="text"
                value={editChant.lead}
                onChange={(e) => setEditChant({ ...editChant, lead: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Catégories :</label>
              <select
                value={editChant.category || "Adoration"}
                onChange={(e) => setEditChant({ ...editChant, category: e.target.value })}
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
              <label>Note :</label>
              <select
                value={editChant.note || "Do"}
                onChange={(e) => setEditChant({ ...editChant, note: e.target.value })}
                required
              >
                {["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"].map((note) => (
                  <option key={note} value={note}>
                    {note}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Lien YouTube :</label>
              <input
                type="text"
                value={editChant.youtubeLink}
                onChange={(e) =>
                  setEditChant({ ...editChant, youtubeLink: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Paroles :</label>
              <textarea
                rows="6"
                value={editChant.lyrics}
                onChange={(e) => setEditChant({ ...editChant, lyrics: e.target.value })}
              ></textarea>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
            <button onClick={saveEdit}>💾 Sauvegarder</button>
            <button onClick={() => setEditChant(null)}>❌ Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChantList;

