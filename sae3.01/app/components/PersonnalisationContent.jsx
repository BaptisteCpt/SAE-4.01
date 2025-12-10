'use client';
import { useState, useEffect } from 'react';
import Formsupplement from '../components/PersonnalisationSupplement'

export default function PersonnalisationContent() {

    const [numChantier, setNumChantier] = useState("");
    const [ChantierSelect, setChantierSelect] = useState([]);
    const [etapes, setEtapes] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const [selectedStepId, setSelectedStepId] = useState(""); 


    useEffect(() => {
        async function fetchChantiers() {
          const res = await fetch('/api/numero_chantier');
          setChantierSelect(await res.json());
        }
        fetchChantiers();
        console.log(ChantierSelect);
      }, []);

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
            const response = await fetch('/api/personnalisation_chantier', {
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
                    <select value={numChantier} onChange={(e)=>setNumChantier(e.target.value)}>
                        <option value="" hidden>Choisir un chantier...</option>

                        {ChantierSelect.map(chantier => (
                            <option key={chantier.nochantier} value={chantier.nochantier}>
                                { chantier.nochantier }
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            <main>
                <section>
                    <div>
                        <label>Étape à Modifier : </label>
                        <select 
                            value={selectedStepId} 
                            onChange={(e) => setSelectedStepId(Number(e.target.value))}>
                            {etapes.map(etape => (
                                <option key={etape.id} value={etape.id}>
                                    { etape.nom }
                                </option>
                            ))}
                        </select>
                    </div>
                {
                    activeStep &&


                    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={activeStep.reserve} 
                                onChange={toggleReserve} 
                                disabled={!activeStep.isSelectable} 
                            />
                        </label>
                        
                        {!activeStep.isSelectable && (
                            <span> (Cette étape n'est pas modifiable)</span>
                        )}
                    </div>
                    }

                { activeStep &&
                    <Formsupplement 
                        supplements={activeStep.supplements}
                        onAdd={handleAddSupplement}
                        onRemove={handleRemoveSupplement}
                    />
                }
                </section>

                <section>
                    <h3>Description</h3>
                    { activeStep &&
                        <p>{activeStep.description}</p>
                    }
                    <button onClick={handleSave}>
                        Valider les modifications
                    </button>
                </section>
            </main>
        </div>
    );
}