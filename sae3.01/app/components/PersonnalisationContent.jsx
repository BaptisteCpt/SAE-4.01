'use client';
import { useState, useEffect } from 'react';

// --- COMPOSANT PRINCIPAL ---
export default function PersonnalisationContent() {

    // STATE
    const [numChantier, setNumChantier] = useState('1'); 
    const [etapes, setEtapes] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const [selectedStepId, setSelectedStepId] = useState(null); 

    // CHARGEMENT DES DONNÉES
    useEffect(() => {
        async function fetchEtapes() {
            if (!numChantier) return;
            setLoading(true);
            try {
                const response = await fetch(`/api/etapes?chantier=${numChantier}`);
                const data = await response.json();
                if (response.ok) {
                    setEtapes(data);
                    if (data.length > 0) setSelectedStepId(data[0].id);
                } else {
                    setEtapes([]);
                }
            } catch (err) { console.error(err); }
            setLoading(false);
        }
        fetchEtapes();
    }, [numChantier]);

    const activeStep = etapes.find(e => e.id === selectedStepId) || null;

    // LOGIQUE : Cocher / Décocher
    const toggleReserve = () => {
        if (!activeStep) return;
        // Sécurité JS : on arrête si ce n'est pas sélectionnable
        if (!activeStep.isSelectable) return;

        setEtapes(etapes.map(e => e.id === activeStep.id ? { ...e, reserve: !e.reserve } : e));
    };

    // LOGIQUE : Ajouter un supplément
    const handleAddSupplement = (name, priceStr, type) => {
        if (!activeStep) return;
        const newItem = { 
            id: Date.now(), label: name, price: parseFloat(priceStr), type: type 
        }; 
        setEtapes(etapes.map(step => 
            step.id === activeStep.id ? { ...step, supplements: [...step.supplements, newItem] } : step
        ));
    };

    // LOGIQUE : Supprimer un supplément
    const handleRemoveSupplement = (idToDelete) => {
        if (!activeStep) return;
        setEtapes(etapes.map(step => 
            step.id === activeStep.id ? { ...step, supplements: step.supplements.filter(s => s.id !== idToDelete) } : step
        ));
    };

    // LOGIQUE : Sauvegarder en base (Appel API)
    const handleSave = async () => {
        if (!activeStep) return;

        try {
            const response = await fetch('/api/etapes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chantierId: numChantier,
                    etapeId: activeStep.id,
                    reserve: activeStep.reserve,
                    supplements: activeStep.supplements
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

    // AFFICHAGE (HTML BRUT)
    return (
        <div>
            <header>
                <h1>Personnalisation</h1>
                <div>
                    <label>Chantier N° </label>
                    <input 
                        type="text" 
                        value={numChantier} 
                        onChange={(e) => setNumChantier(e.target.value)} 
                    />
                </div>
            </header>

            <main>
                {loading && <p>Chargement...</p>}
                
                {!loading && activeStep && (
                    <>
                        <section>
                            <div>
                                <label>Étape à Modifier : </label>
                                <select 
                                    value={selectedStepId} 
                                    onChange={(e) => setSelectedStepId(Number(e.target.value))}
                                >
                                    {etapes.map(etape => (
                                        <option key={etape.id} value={etape.id}>
                                            {etape.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                                <label>
                                    <input 
                                        type="checkbox" 
                                        checked={activeStep.reserve} 
                                        onChange={toggleReserve} 
                                        disabled={!activeStep.isSelectable} 
                                    />
                                    <strong> Réservé par le client</strong>
                                </label>
                                
                                {!activeStep.isSelectable && (
                                    <span> (Cette étape n'est pas modifiable)</span>
                                )}
                            </div>

                            <SupplementsForm 
                                supplements={activeStep.supplements}
                                onAdd={handleAddSupplement}
                                onRemove={handleRemoveSupplement}
                            />
                        </section>

                        <section>
                            <h3>Description</h3>
                            <p>{activeStep.description}</p>
                            
                            <button onClick={handleSave}>
                                Valider les modifications
                            </button>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

// --- SOUS-COMPOSANT LOCAL ---
function SupplementsForm({ supplements, onAdd, onRemove }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    const total = supplements.reduce((acc, item) => {
        return item.type === 'plus' ? acc + item.price : acc - item.price;
    }, 0);

    const handleClickAdd = (e, type) => {
        e.preventDefault();
        if (name && price) {
            onAdd(name, price, type);
            setName('');
            setPrice('');
        }
    };

    return (
        <div>
            <h3>Ajustements</h3>
            <p>Impact total : {total} €</p>
            
            <ul>
                {supplements.map(s => (
                    <li key={s.id}>
                        [{s.type === 'plus' ? '+' : '-'}] {s.label} ({s.price} €)
                        <button onClick={() => onRemove(s.id)}> Effacer </button>
                    </li>
                ))}
            </ul>

            <form>
                <input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Nom" 
                />
                <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    placeholder="Prix" 
                />
                <button onClick={(e) => handleClickAdd(e, 'plus')}>+ Ajouter</button>
                <button onClick={(e) => handleClickAdd(e, 'moins')}>- Réduire</button>
            </form>
        </div>
    );
}