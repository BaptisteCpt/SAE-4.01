'use client';
import { useState } from 'react';


export default function PersonnalisationSupplement({ montantmax, supplements, onAdd, onRemove }) {
    const [name, setName] = useState('');
    const [prix, setPrix] = useState('');

    const total = supplements.reduce((acc, item) => {
        return item.type === 'plus' ? acc + item.price : acc - item.price;
    }, 0);

    const handleClickAdd = (e, type) => { // Fonction appelé au click d'un bouton (ajouter / enlever) qui vérifie si un prix et un nom on était entré
                                          // Si oui alors elle appel la fonction handleAddSupplement du composant PersonnalisationContent
        e.preventDefault();
        if (name && prix) {
            onAdd(name, prix, type);
            setName('');
            setPrix('');
        }
    };

    return (
        <div className="supplement-container">
            <div className="supplement-header">
                <h2>Supplément(s) / Réduction(s)</h2>
                <div className="total-badge">
                    <span className="total-label">Total :</span>
                    <span className={`total-amount ${total >= 0 ? 'positive' : 'negative'}`}>
                        {total >= 0 ? '+' : ''}{total.toFixed(2)} €
                    </span>
                </div>
                <div className="total-badge">
                    <span className="total-label">Montant Autorisé :</span>
                    <span className={`total-amount ${total >= 0 ? 'positive' : 'negative'}`}>
                        {montantmax}
                    </span>
                </div>
            </div>
            
            {supplements.length > 0 && (
                <div className="supplements-list">
                    <h4>Modifications enregistrées</h4>
                    <ul>
                        {supplements.map(s => (
                            <li key={s.id} className="supplement-item">
                                <span className={`supplement-type ${s.type === 'plus' ? 'type-plus' : 'type-minus'}`}>
                                    {s.type === 'plus' ? '+' : '−'}
                                </span>
                                <span className="supplement-label">{s.label}</span>
                                <span className="supplement-price">{s.price.toFixed(2)} €</span>
                                <button className="btn-remove" onClick={() => onRemove(s.id)}>
                                    <span>×</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="supplement-form">
                <h4>Ajouter une modification</h4>
                <div className="form-inputs">
                    <input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Description de la modification" 
                        className="input-description"
                    />
                    <input 
                        type="number" 
                        step="0.01"
                        value={prix} 
                        onChange={(e) => setPrix(e.target.value)} 
                        placeholder="Montant (€)" 
                        className="input-price"
                    />
                </div>
                <div className="form-buttons-supplement">
                    <button 
                        className="btn-add" 
                        onClick={(e) => handleClickAdd(e, 'plus')}
                        disabled={!name || !prix}
                    >
                        <span>+</span> Ajouter
                    </button>
                    <button 
                        className="btn-subtract" 
                        onClick={(e) => handleClickAdd(e, 'moins')}
                        disabled={!name || !prix}
                    >
                        <span>−</span> Enlever
                    </button>
                </div>
            </div>
        </div>
    );
}