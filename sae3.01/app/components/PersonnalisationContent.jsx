'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Formsupplement from '../components/PersonnalisationSupplement';
import '../css/personnalisation.css';
import Swal from 'sweetalert2';

export default function PersonnalisationContent() {

    const [numChantier, setNumChantier] = useState("");
    const [ChantierSelect, setChantierSelect] = useState([]);
    const [etapes, setEtapes] = useState([]);
    const [EtapeCourrante, setEtapeCourrante] = useState("");
    const router = useRouter();

    useEffect(() => { 
        async function fetchChantiers() {
          const res = await fetch('/api/numero_chantier');
          setChantierSelect(await res.json());
        }
        fetchChantiers();
      }, []);

    useEffect(() => { 
        async function fetchEtapes() {
            if (!numChantier) return;
            try {
                const response = await fetch(`/api/etapes?chantier=${numChantier}`);
                const data = await response.json();
                if (response.ok) {
                    setEtapes(data);
                    if (data.length > 0) setEtapeCourrante(data[0].id); 
                } else {
                    setEtapes([]);
                }
            } catch (err) { console.error(err); }
        }
        fetchEtapes();
    }, [numChantier]);

    const EtapeSelected = etapes.find(e => e.id === EtapeCourrante) || null; 

    const ReserverEtape = () => {
        if (!EtapeSelected) return;
        setEtapes(etapes.map(e => e.id === EtapeSelected.id ? { ...e, reservee: !e.reservee } : e));
    };

    const handleAddSupplement = (name, priceStr, type) => {
        if (!EtapeSelected) return; 
        const newItem = {
            id: Date.now(), label: name, price: parseFloat(priceStr), type: type
        };
        setEtapes(etapes.map(e =>  
            e.id === EtapeSelected.id ? { ...e, supplements: [...e.supplements, newItem] } : e
        ));
    };

    const handleRemoveSupplement = (idToDelete) => {
        if (!EtapeSelected) return; 
        setEtapes(etapes.map(step => 
            step.id === EtapeSelected.id ? { ...step, supplements: step.supplements.filter(s => s.id !== idToDelete) } : step
        ));
    };

    const handleSave = async () => {
        if (!EtapeSelected) return; 

        try {
            const response = await fetch('/api/personnalisation_chantier', { 
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
                Swal.fire({
                    title: 'Erreur',
                    text: "Le montant est supérieur au montant maximal de Réduction/Supplément",
                    icon: 'error',
                    confirmButtonText: 'Fermer'
                })
            } else {
                Swal.fire({
                    title: 'Succès !',
                    text: "Modifications enregistrées avec succès !",
                    icon: 'success',
                    confirmButtonText: 'Super'
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Erreur réseau',
                text: "Impossible de contacter le serveur.",
                icon: 'error',
                confirmButtonText: 'Fermer'
            });
        }
    };

    const finir = async () => {
        try {
            const response = await fetch('/api/finirperso', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chantierId: numChantier,
                    date: new Date()
                })
            });

            const result = await response.json();
            if (!response.ok) {
                Swal.fire({
                    title: 'Erreur',
                    text: "La personnalisation a échoué",
                    icon: 'error',
                    confirmButtonText: 'Fermer'
                })
            } else {
                Swal.fire({
                    title: 'Succès !',
                    text: "Modifications enregistrées avec succès !",
                    icon: 'success',
                    confirmButtonText: 'Super'
                }).then(
                    router.push('/accueil_maitre')
                );
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Erreur réseau',
                text: "Impossible de contacter le serveur.",
                icon: 'error',
                confirmButtonText: 'Fermer'
            });
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
            {
                EtapeSelected &&
                    <main>
                            <section className="left-section">
                                <div className="etape-select-card">
                                    <label>Étape à Modifier</label>
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
                                                <label htmlFor="reserve-checkbox" className="toggle-label">
                                                    <span className={EtapeSelected.reservee ? 'active' : ''}>
                                                        {EtapeSelected.reservee ? 'Réservé' : 'Disponible'}
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
                                <p>{EtapeSelected.description || "Description des éléments qui composent cette étape."}</p>
                            </section>
                          
                        <section className="button-section">
                            <button onClick={handleSave}>
                                Valider
                            </button>
                        </section>

                        <section className="button-section">
                            <button onClick={finir}>
                                Terminer la personnalisation
                            </button>
                        </section>
                    </main>
                }
            </div>
        </>
    );
}