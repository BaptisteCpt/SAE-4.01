'use client';
import { useState } from 'react';


/**
 * Composant pour gérer les suppléments et réductions d'une étape
 * Affiche la liste des suppléments/réductions et permet d'en ajouter/supprimer
 * @param {number} montantmax - Le montant maximum autorisé pour les suppléments/réductions
 * @param {Array} supplements - La liste des suppléments/réductions actuels
 * @param {Function} onAdd - Fonction callback pour ajouter un supplément/réduction
 * @param {Function} onRemove - Fonction callback pour supprimer un supplément/réduction
 * @returns {JSX.Element} Le formulaire de gestion des suppléments/réductions
 */
export default function PersonnalisationSupplement({ montantmax, supplements, onAdd, onRemove }) {
    const [name, setName] = useState('');
    const [prix, setPrix] = useState('');

    /**
     * Calcule le total des suppléments/réductions
     * Additionne les suppléments (type 'plus') et soustrait les réductions (type 'moins')
     * Le résultat peut être positif (supplément net) ou négatif (réduction nette)
     */
    const total = supplements.reduce((acc, item) => {
        // Si c'est un supplément, on additionne, sinon on soustrait
        return item.type === 'plus' ? acc + item.price : acc - item.price;
    }, 0); // Valeur initiale à 0

    /**
     * Gère l'ajout d'un supplément ou d'une réduction
     * Vérifie que le nom et le prix sont remplis avant d'appeler la fonction parent
     * @param {Event} e - L'événement de clic sur le bouton
     * @param {string} type - Le type : 'plus' pour supplément, 'moins' pour réduction
     */
    const handleClickAdd = (e, type) => {
        e.preventDefault();
        // Vérifie que les champs sont remplis avant d'ajouter
        if (name && prix) {
            // Appelle la fonction parent pour ajouter le supplément/réduction
            onAdd(name, prix, type);
            // Réinitialise les champs du formulaire après l'ajout
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