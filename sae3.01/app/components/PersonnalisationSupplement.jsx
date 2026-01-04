'use client';
import { useState } from 'react';


export default function PersonnalisationSupplement({ supplements, onAdd, onRemove }) {
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
        <div>
            <h2>Supplément(s) / Réduction(s)</h2>
            <p> Total des modifications : {total} €</p>
            
            <ul>
                <h4>Ajouter une modifications</h4>
                {supplements.map(s => ( // Pour chaque supplément trouvé, on regarde si son type est plus ou moins pour écrire le bon signe
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
                    placeholder="Description modification" 
                />
                <input 
                    type="number" 
                    value={prix} 
                    onChange={(e) => setPrix(e.target.value)} 
                    placeholder="Prix modification" 
                />
                <button onClick={(e) => handleClickAdd(e, 'plus')}>Ajouter +</button>
                <button onClick={(e) => handleClickAdd(e, 'moins')}>Enlever -</button>
            </form>
        </div>
    );
}