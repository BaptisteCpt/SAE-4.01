'use client';
import { useState, useEffect } from 'react';


export default function PersonnalisationSupplement({ supplements, onAdd, onRemove }) {
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