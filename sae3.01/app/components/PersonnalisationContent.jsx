'use client';
import { useState, useEffect } from 'react';
import Formsupplement from '../components/PersonnalisationSupplement'

export default function PersonnalisationContent() {

    const [numChantier, setNumChantier] = useState("");
    const [ChantierSelect, setChantierSelect] = useState([]);
    const [etapes, setEtapes] = useState([]); 
    const [EtapeCourrante, setEtapeCourrante] = useState(""); 


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
        // on arrête si ce n'est pas sélectionnable
        if (!EtapeSelected.isReservable) return;

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
                alert("Erreur : " + result.error);
            } else {
                alert("Modifications enregistrées !");
            }
        } catch (error) {
            console.error(error);
            alert("Erreur réseau");
        }
    };

    return (
        <div>
            <header>
                <h1>Personnalisation</h1>
                <div>
                    <label>Chantier N° </label>
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

            <main>
                {
                    EtapeSelected &&
                    <>
                    <section>
                        <div>
                            <label>Étape à personnaliser : </label>
                            <select 
                                value={EtapeCourrante} 
                                onChange={(e) => setEtapeCourrante(Number(e.target.value))}>
                                {etapes.map(etape => (
                                    <option key={etape.id} value={etape.id}>
                                        { etape.nom }
                                    </option>
                                ))}
                            </select>
                        </div>


                        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                            <label>
                                Reserver l'étape : 
                                <input 
                                    type="checkbox" 
                                    checked={EtapeSelected.reservee} // coche automatiquement si l'étape est déjà réservée
                                    onChange={ReserverEtape} // appel la fonction dans ReserverEtape a chaque changement d'état
                                    hidden={!EtapeSelected.isReservable} // si l'etape n'est pas réservable, on cache la case et on affiche le span présent en dessous
                                />
                            </label>
                            
                            {!EtapeSelected.isReservable && (
                                <span> Cette étape n'est pas réservable</span> // affiché uniquement quand l'étape n'est pas réservable
                            )}
                        </div>

                        <Formsupplement // affichage du sous composant PersonnalisationSupplement
                            supplements={EtapeSelected.supplements}
                            onAdd={handleAddSupplement}
                            onRemove={handleRemoveSupplement}
                        />
                    </section>

                    <section>
                            <h2>Description Du Modèle De Maison</h2>
                            <p>{EtapeSelected.description}</p>
                    </section>
                    </>
                }
                    
                <section>
                    <button onClick={handleSave}>
                        Valider
                    </button>
                </section>
            </main>
        </div>
    );
}