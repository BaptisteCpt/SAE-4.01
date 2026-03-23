'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2';

export default function PageListUtilisateurs() {

    const router = useRouter();
    const [liste, setListe] = useState([]);

    useEffect(() => {
        /**
         * Charge et uniformise la liste de tous les utilisateurs depuis les APIs
         */
        async function ChargerListe() {
            try {
                // Exécution des 4 requêtes en parallèle pour un chargement plus rapide
                const [resAdmin, resArti, resCom, resMoe] = await Promise.all([
                    fetch('/api/recup_admin'),
                    fetch('/api/recup_arti_bis'),
                    fetch('/api/recup_commerciale'),
                    fetch('/api/recup_moe')
                ]);

                if (resAdmin.ok && resArti.ok && resCom.ok && resMoe.ok) {
                    
                    const dataAdmin = await resAdmin.json();
                    const dataArti = await resArti.json();
                    const dataCom = await resCom.json();
                    const dataMoe = await resMoe.json();

                    // 1. Uniformisation des administrateurs
                    const admins = dataAdmin.map(user => ({
                        uniqueKey: `admin_${user.id}`,
                        id: user.id,
                        login: user.login,
                        role: user.role || 'admin'
                    }));

                    // 2. Uniformisation des artisans
                    const artisans = dataArti.map(user => ({
                        uniqueKey: `arti_${user.noartisan}`,
                        id: user.noartisan,
                        login: `${user.prenomartisan.trim()} ${user.nomartisan.trim()}`,
                        role: 'artisan'
                    }));

                    // 3. Uniformisation des commerciaux
                    const commerciaux = dataCom.map(user => ({
                        uniqueKey: `com_${user.id}`,
                        id: user.id,
                        login: user.login,
                        role: user.role || 'commercial'
                    }));

                    // 4. Uniformisation des MOE
                    const moes = dataMoe.map(user => ({
                        uniqueKey: `moe_${user.nomoe}`,
                        id: user.nomoe,
                        // Utilise le login s'il existe, sinon Prénom + Nom
                        login: user.login ? user.login.trim() : `${user.prenommoe.trim()} ${user.nommoe.trim()}`,
                        role: 'moe'
                    }));

                    // 5. Fusion et mise à jour de l'état
                    setListe([...admins, ...artisans, ...commerciaux, ...moes]);
                }
            } catch (err) { 
                console.error("Erreur lors du chargement des données :", err); 
            }
        }
        ChargerListe();
    }, []);

    /**
     * Redirige vers la bonne page de modification selon le rôle
     */
    const allerVersModification = (id, role) => {
        switch (role) {
            case 'admin': router.push(`/pageModifAdmin?id=${id}`); break;
            case 'artisan': router.push(`/pageModifArti?id=${id}`); break;
            case 'commercial': router.push(`/pageModifCom?id=${id}`); break;
            case 'moe': router.push(`/pageModifMoe?id=${id}`); break;
            default: console.error("Rôle inconnu pour la modification");
        }
    };

    /**
     * Supprime un utilisateur après confirmation, en appelant la bonne API
     */
    async function Suppr(id, login, role, uniqueKey) {
        const monLoginActuel = localStorage.getItem("nom");
        
        // Empêche un admin de supprimer son propre compte
        if (role === 'admin' && monLoginActuel && login) {
            if (monLoginActuel.toLowerCase() === login.toLowerCase()) {
                Swal.fire({
                    title: 'Action impossible',
                    text: "Vous ne pouvez pas supprimer votre propre compte !",
                    icon: 'error',
                    confirmButtonText: 'Compris'
                });
                return; 
            }
        }

        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Voulez-vous vraiment supprimer le profil ${role} "${login}" ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            // Définition de la bonne route API en fonction du rôle
            let apiUrl = '';
            switch (role) {
                case 'admin': apiUrl = '/api/suppradmin'; break;
                case 'artisan': apiUrl = '/api/supprartisant'; break; // Gardé tel quel selon ton code précédent
                case 'commercial': apiUrl = '/api/supprcommercial'; break;
                case 'moe': apiUrl = '/api/supprmoe'; break;
                default:
                    Swal.fire('Erreur', "Rôle inconnu", 'error');
                    return;
            }

            try {
                const res = await fetch(apiUrl, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: id }),
                });

                if (res.ok) {
                    // Retrait de l'utilisateur de l'affichage grâce à sa clé unique
                    setListe(prevListe => prevListe.filter(user => user.uniqueKey !== uniqueKey));
                    Swal.fire('Supprimé !', 'L\'utilisateur a bien été supprimé !', 'success');
                } else {
                    const info = await res.json();
                    Swal.fire('Erreur', info.error || "Impossible de supprimer", 'error');
                }
            } catch (err) {
                console.error(err);
                Swal.fire('Erreur', "Erreur de connexion serveur", 'error');
            }
        }
    }

    return (
        <div className="bulle">
            <h1>Liste des Utilisateurs</h1>
            
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Login / Nom</th>
                            <th>Rôle</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {liste.map((user) => (
                            <tr key={user.uniqueKey}>
                                <td data-label="ID">{user.id}</td>
                                <td data-label="Login">{user.login}</td>
                                {/* On met une majuscule au rôle pour faire plus propre à l'affichage */}
                                <td data-label="Rôle" style={{ textTransform: 'capitalize' }}>{user.role}</td>
                                <td data-label="Action">
                                    <button 
                                        className='but' 
                                        onClick={() => allerVersModification(user.id, user.role)}
                                    >
                                        Modifier
                                    </button>
                                    <button 
                                        className='but' 
                                        onClick={() => Suppr(user.id, user.login, user.role, user.uniqueKey)}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {liste.length === 0 && <p>Aucun utilisateur trouvé.</p>}
        </div>
    )
}