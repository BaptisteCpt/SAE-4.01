"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Formsupplement from "../components/PersonnalisationSupplement";
import "../css/personnalisation.css";
import Swal from "sweetalert2";
import SearchableSelect from "./SearchableSelect";

/**
 * Composant principal pour la personnalisation des étapes d'un chantier
 * Permet de réserver des étapes et d'ajouter des suppléments/réductions
 * @returns {JSX.Element} Le formulaire de personnalisation des étapes
 */
export default function PersonnalisationContent() {
  const [numChantier, setNumChantier] = useState("");
  const [ChantierSelect, setChantierSelect] = useState([]);
  const [etapes, setEtapes] = useState([]);
  const [EtapeCourrante, setEtapeCourrante] = useState("");
  const router = useRouter();

  /**
   * Charge la liste de tous les chantiers disponibles au chargement du composant
   */
  useEffect(() => {
    async function fetchChantiers() {
      const res = await fetch("/api/numero_chantier");
      setChantierSelect(await res.json());
    }
    fetchChantiers();
  }, []);

  /**
   * Charge les étapes du chantier sélectionné
   * Se déclenche automatiquement quand un chantier est sélectionné
   * Sélectionne automatiquement la première étape si disponible
   */
  useEffect(() => {
    async function fetchEtapes() {
      if (!numChantier) return; // Ne fait rien si aucun chantier n'est sélectionné
      try {
        const response = await fetch(`/api/etapes?chantier=${numChantier}`);
        const data = await response.json();
        if (response.ok) {
          setEtapes(data);
          // Sélectionne automatiquement la première étape pour faciliter l'utilisation
          if (data.length > 0) setEtapeCourrante(data[0].id);
        } else {
          setEtapes([]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchEtapes();
  }, [numChantier]); // Se déclenche à chaque changement de numChantier

  // Trouve l'étape actuellement sélectionnée dans la liste des étapes
  const EtapeSelected = etapes.find((e) => e.id === EtapeCourrante) || null;

  /**
   * Bascule le statut de réservation de l'étape sélectionnée
   * Utilise map pour créer un nouveau tableau avec l'étape modifiée (pattern immutabilité)
   */
  const ReserverEtape = () => {
    if (!EtapeSelected) return;
    // Crée un nouveau tableau où seule l'étape sélectionnée voit son statut de réservation inversé
    setEtapes(
      etapes.map((e) =>
        e.id === EtapeSelected.id ? { ...e, reservee: !e.reservee } : e,
      ),
    );
  };

  /**
   * Ajoute un supplément ou une réduction à l'étape sélectionnée
   * @param {string} name - Le nom/description du supplément
   * @param {string} priceStr - Le prix en string (sera converti en nombre)
   * @param {string} type - Le type : 'plus' pour supplément, 'moins' pour réduction
   */
  const handleAddSupplement = (name, priceStr, type) => {
    if (!EtapeSelected) return;
    // Crée un nouvel objet avec un ID unique basé sur le timestamp
    const newItem = {
      id: Date.now(), // Utilise le timestamp comme ID unique
      label: name,
      price: parseFloat(priceStr), // Convertit la string en nombre décimal
      type: type,
    };
    // Ajoute le nouveau supplément à la liste des suppléments de l'étape sélectionnée
    setEtapes(
      etapes.map((e) =>
        e.id === EtapeSelected.id
          ? { ...e, supplements: [...e.supplements, newItem] }
          : e,
      ),
    );
  };

  /**
   * Supprime un supplément/réduction de l'étape sélectionnée
   * @param {number} idToDelete - L'ID du supplément à supprimer
   */
  const handleRemoveSupplement = (idToDelete) => {
    if (!EtapeSelected) return;
    // Filtre le tableau des suppléments pour retirer celui avec l'ID correspondant
    setEtapes(
      etapes.map((step) =>
        step.id === EtapeSelected.id
          ? {
              ...step,
              supplements: step.supplements.filter((s) => s.id !== idToDelete),
            }
          : step,
      ),
    );
  };

  /**
   * Sauvegarde les modifications de l'étape (réservation et suppléments/réductions)
   * Envoie les données à l'API qui valide que le montant total ne dépasse pas le maximum autorisé
   */
  const handleSave = async () => {
    if (!EtapeSelected) return;

    try {
      const response = await fetch("/api/personnalisation_chantier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chantierId: numChantier,
          etapeId: EtapeSelected.id,
          reservee: EtapeSelected.reservee,
          supplements: EtapeSelected.supplements, // Tableau des suppléments/réductions
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // L'API retourne une erreur si le montant total dépasse 30% du montant théorique
        Swal.fire({
          title: "Erreur",
          text: "Le montant est supérieur au montant maximal de Réduction/Supplément",
          icon: "error",
          confirmButtonText: "Fermer",
        });
      } else {
        Swal.fire({
          title: "Succès !",
          text: "Modifications enregistrées avec succès !",
          icon: "success",
          confirmButtonText: "Super",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Erreur réseau",
        text: "Impossible de contacter le serveur.",
        icon: "error",
        confirmButtonText: "Fermer",
      });
    }
  };

  const finir = async () => {
    try {
      const response = await fetch("/api/finirperso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chantierId: numChantier,
          date: new Date(),
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        Swal.fire({
          title: "Erreur",
          text: "La personnalisation a échoué",
          icon: "error",
          confirmButtonText: "Fermer",
        });
      } else {
        Swal.fire({
          title: "Succès !",
          text: "Modifications enregistrées avec succès !",
          icon: "success",
          confirmButtonText: "Super",
        }).then(router.push("/accueil_maitre"));
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Erreur réseau",
        text: "Impossible de contacter le serveur.",
        icon: "error",
        confirmButtonText: "Fermer",
      });
    }
  };

  return (
    <>
      <header>
        <h1>Personnalisation Chantier N°</h1>
        <div>
          <label>Identifiant</label>
          <SearchableSelect
            options={ChantierSelect}
            value={numChantier}
            onChange={(value) => setNumChantier(value)}
            getOptionValue={(chantier) => chantier.nochantier}
            getOptionLabel={(chantier) =>
              `${chantier.nochantier} - ${chantier.adressechantier}`
            }
            placeholder="Choisir un chantier..."
          />
        </div>
      </header>

      <div className="card-container">
        {EtapeSelected && (
          <main>
            <h2 style={{ color: "#333" }}>Chantier n°{numChantier}</h2>
            <section className="left-section">
              <div className="etape-select-card">
                <label>Étape à Modifier</label>
                <SearchableSelect
                  options={etapes}
                  value={EtapeCourrante}
                  onChange={(value) => setEtapeCourrante(Number(value))}
                  getOptionValue={(etape) => etape.id}
                  getOptionLabel={(etape) =>
                    `Numéro ${etape.id} - ${etape.nom}`
                  }
                  placeholder="Choisir une étape..."
                />
              </div>

              <div className="reserve-card">
                <div className="reserve-header">
                  <label>Statut de réservation</label>
                  {EtapeSelected.isReservable ? (
                    <div className="reserve-toggle">
                      <input
                        type="checkbox"
                        id="reserve-checkbox"
                        checked={EtapeSelected.reservee}
                        onChange={ReserverEtape}
                      />
                      <label
                        htmlFor="reserve-checkbox"
                        className="toggle-label"
                      >
                        <span
                          className={EtapeSelected.reservee ? "active" : ""}
                        >
                          {EtapeSelected.reservee ? "Réservé" : "Disponible"}
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div className="reserve-info">
                      <span className="info-badge">Non réservable</span>
                    </div>
                  )}
                </div>
              </div>

              <Formsupplement
                montantmax={EtapeSelected.montantmax}
                supplements={EtapeSelected.supplements}
                onAdd={handleAddSupplement}
                onRemove={handleRemoveSupplement}
              />
            </section>

            <section className="right-section">
              <h2>Description de ce modèle :</h2>
              <p>
                {EtapeSelected.description ||
                  "Description des éléments qui composent cette étape."}
              </p>
            </section>

            <section className="button-section">
              <button onClick={handleSave}>Valider</button>
            </section>

            <section className="button-section">
              <button onClick={finir}>Terminer la personnalisation</button>
            </section>
          </main>
        )}
      </div>
    </>
  );
}
