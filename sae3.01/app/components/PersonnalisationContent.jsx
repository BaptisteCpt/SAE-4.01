'use client';
import { useState, useEffect } from 'react';
import Formsupplement from '../components/PersonnalisationSupplement';
import '../css/personnalisation.css';

export default function PersonnalisationContent() {

    const [numChantier, setNumChantier] = useState("");
    const [ChantierSelect, setChantierSelect] = useState([]);
    const [etapes, setEtapes] = useState([]); 
    const [EtapeCourrante, setEtapeCourrante] = useState(""); 
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");


    useEffect(() => { // Chargement des chantier de la base et récupération de leur numéro dans la liste ChantierSelect
        async function fetchChantiers() {
          const res = await fetch('/api/numero_chantier');
          setChantierSelect(await res.json());
        }
        fetchChantiers();
      }, []);

    useEffect(() => { // Chargement des étapes du chantier selectionner et récupération dans la liste etapes
        async function fetchEtapes() {
            if (!numChantier) return;
            try {
                const response = await fetch(`/api/etapes?chantier=${numChantier}`);
                const data = await response.json();
                if (response.ok) {
                    setEtapes(data);
                    if (data.length > 0) setEtapeCourrante(data[0].id); // si on a au moins une étapes on la séléctionne par défaut
                } else {
                    setEtapes([]);
                }
            } catch (err) { console.error(err); }
        }
        fetchEtapes();
    }, [numChantier]);

    const EtapeSelected = etapes.find(e => e.id === EtapeCourrante) || null; // récupération de l'objet étape correspondant à l'id EtapeCourrante

    // Inversion de la valeur de reservee de notre étape lorsque l'on coche / decoche
    const ReserverEtape = () => {
        if (!EtapeSelected) return;

        setEtapes(etapes.map(e => e.id === EtapeSelected.id ? { ...e, reservee: !e.reservee } : e));
    };

    // Ajouter un supplément ou une réduction 
    const handleAddSupplement = (name, priceStr, type) => {
        if (!EtapeSelected) return; // on verifie qu'on a bien une étape séléctionnée
        const newItem = { 
            id: Date.now(), label: name, price: parseFloat(priceStr), type: type 
        }; 
        setEtapes(etapes.map(e =>  // On parcourt nos etapes jusqu'à tomber sur celle sélectionnée puis on lui ajoute notre supplément/réduction
            e.id === EtapeSelected.id ? { ...e, supplements: [...e.supplements, newItem] } : e
        ));
    };

    // Supprimer un supplément ou une réduction
    const handleRemoveSupplement = (idToDelete) => {
        if (!EtapeSelected) return; // on verifie qu'on a bien une étape séléctionnée
        setEtapes(etapes.map(step => // On parcourt nos etapes jusqu'à tomber sur celle sélectionnée puis on filtre les suppléments/réductions pour enlever celui à l'id voulu
            step.id === EtapeSelected.id ? { ...step, supplements: step.supplements.filter(s => s.id !== idToDelete) } : step
        ));
    };

    // Sauvegarder dans la base de données
    const handleSave = async () => {
        if (!EtapeSelected) return; // on verifie qu'on a bien une étape séléctionnée

        try {
            const response = await fetch('/api/personnalisation_chantier', { // on envoie à l'API les données requises pour sauvegarder
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chantierId: numChantier,
                    etapeId: EtapeSelected.id,
                    reservee: EtapeSelected.reservee,
                    supplements: EtapeSelected.supplements
                })
            });

            const result = await response.json();

            if (!response.ok) {
                setPopupMessage("Erreur : " + result.error);
                setShowPopup(true);
            } else {
                setPopupMessage("Modifications enregistrées !");
                setShowPopup(true);
            }
        } catch (error) {
            console.error(error);
            setPopupMessage("Erreur réseau");
            setShowPopup(true);
        }
    };

    return (
        <>
            <header>
                <h1>Personnalisation Chantier N°</h1>
                <div>
                    <label>Identifiant</label>
                    <select value={numChantier} onChange={(e)=>setNumChantier(e.target.value)}>
                        <option value="" hidden>Choisir un chantier...</option>

                        {ChantierSelect.map(chantier => (
                            <option key={chantier.nochantier} value={chantier.nochantier}>
                                {chantier.nochantier} - {chantier.adressechantier}
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            <div className="card-container">
                <main>
                    {
                        EtapeSelected &&
                        <>
                        <section className="left-section">
                            <div>
                                <label>Étape à Modifier :</label>
                                <select 
                                    value={EtapeCourrante} 
                                    onChange={(e) => setEtapeCourrante(Number(e.target.value))}>
                                    {etapes.map(etape => (
                                        <option key={etape.id} value={etape.id}>
                                            Numéro {etape.id} - {etape.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="reserve-section">
                                <label>
                                    Réservé :
                                    <input 
                                        type="checkbox" 
                                        checked={EtapeSelected.reservee}
                                        onChange={ReserverEtape}
                                        hidden={!EtapeSelected.isReservable}
                                    />
                                </label>
                                
                                {!EtapeSelected.isReservable && (
                                    <span>Cette étape n'est pas réservable</span>
                                )}
                            </div>

                            
                            <Formsupplement
                                supplements={EtapeSelected.supplements}
                                onAdd={handleAddSupplement}
                                onRemove={handleRemoveSupplement}
                            />
                        </section>

                        <section className="right-section">
                            <h2>Description de ce modèle :</h2>
                            <p>{EtapeSelected.description || "Description des éléments qui composent cette étape."}</p>
                        </section>
                        </>
                    }
                        
                    <section className="button-section">
                        <button onClick={handleSave}>
                            Valider
                        </button>
                    </section>
                </main>
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <p>{popupMessage}</p>
                        <button onClick={() => setShowPopup(false)}>OK</button>
                    </div>
                </div>
            )}
        </>
    );
}
