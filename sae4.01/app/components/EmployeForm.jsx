'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2';
import SearchableSelect from './SearchableSelect';
import "../css/PageListUtilisateurs.css";

export default function PageListUtilisateurs({ login }) {

    const router = useRouter();
    const [recherche, setRecherche] = useState(""); 
    const [liste, setListe] = useState([]);
    
    useEffect(() => {
        async function ChargerListe() {
            try {

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

                    const formaterNom = (user) => {
                        const prenom = user.prenom || user.prenomartisan || user.prenommoe || "";
                        const nom = user.nom || user.nomartisan || user.nommoe || "";
                        const nomComplet = `${prenom.trim()} ${nom.trim()}`.trim();

                        return nomComplet !== "" ? nomComplet : user.login;
                    };

                    const admins = dataAdmin.map(user => ({
                        uniqueKey: `admin_${user.id}`, 
                        id: user.id, 
                        nomComplet: formaterNom(user),
                        originalLogin: user.login, 
                        role: user.role || 'admin'
                    }));

                    const artisans = dataArti.map(user => ({
                        uniqueKey: `arti_${user.noartisan}`, 
                        id: user.noartisan, 
                        nomComplet: formaterNom(user),
                        originalLogin: null, 
                        role: 'artisan'
                    }));

                    const commerciaux = dataCom.map(user => ({
                        uniqueKey: `com_${user.id}`, 
                        id: user.id, 
                        nomComplet: formaterNom(user),
                        originalLogin: user.login, 
                        role: user.role || 'commercial'
                    }));

                    const moes = dataMoe.map(user => ({
                        uniqueKey: `moe_${user.nomoe}`, 
                        id: user.nomoe, 
                        nomComplet: formaterNom(user),
                        originalLogin: user.login, 
                        role: 'moe'
                    }));

                    setListe([...admins, ...artisans, ...commerciaux, ...moes]);
                }
            } catch (err) { 
                console.error("Erreur lors du chargement des données :", err); 
            }
        }
        ChargerListe();
    }, []);

    const AjouterEmploye = async () => {
        const { value: roleChoisi } = await Swal.fire({
            title: 'Créer un profil',
            text: 'Quel type d\'employé souhaitez-vous ajouter ?',
            input: 'select',
            inputOptions: {
                admin: 'Administrateur',
                commercial: 'Commercial',
                artisan: 'Artisan',
                moe: 'Maître d\'Œuvre (MOE)'
            },
            inputPlaceholder: 'Sélectionnez un rôle',
            showCancelButton: true,
            confirmButtonText: 'Suivant',
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#28a745',
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (value) resolve();
                    else resolve('Vous devez sélectionner un rôle !');
                });
            }
        });

        if (roleChoisi) {
            switch (roleChoisi) {
                case 'admin': router.push('/pageAjoutAdmin'); break;
                case 'commercial': router.push('/pageAjoutCom'); break;
                case 'artisan': router.push('/pageAjoutArti'); break;
                case 'moe': router.push('/pageAjoutMoe'); break;
            }
        }
    };

    const allerVersModification = (id, role) => {
        switch (role) {
            case 'admin': router.push(`/pageModifAdmin?id=${id}`); break;
            case 'artisan': router.push(`/pageModifArti?id=${id}`); break;
            case 'commercial': router.push(`/pageModifCom?id=${id}`); break;
            case 'moe': router.push(`/pageModifMoe?id=${id}`); break;
            default: console.error("Rôle inconnu");
        }
    };

    async function Suppr(id, nomComplet, role, uniqueKey, originalLogin) {
        
        if (role === 'admin' && login && originalLogin) {
            if (login.toLowerCase() === originalLogin.toLowerCase()) {
                Swal.fire({ title: 'Action impossible', text: "Vous ne pouvez pas supprimer votre propre compte !", icon: 'error', confirmButtonText: 'Compris' });
                return; 
            }
        }

        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?', 
            text: `Voulez-vous vraiment supprimer le profil ${role} "${nomComplet}" ?`, 
            icon: 'warning', 
            showCancelButton: true, 
            confirmButtonColor: '#3085d6', 
            cancelButtonColor: '#d33', 
            confirmButtonText: 'Oui, supprimer !', 
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            let apiUrl = '';
            let payload = { id: id };

            switch (role) {
                case 'admin': apiUrl = '/api/suppradmin'; break;
                case 'artisan': apiUrl = '/api/supprartisant'; break;
                case 'commercial': apiUrl = '/api/supprcom'; break;
                case 'moe': 
                    apiUrl = '/api/supprmoe'; 
                    payload = { id: id, login: originalLogin };
                    break;
                default: Swal.fire('Erreur', "Rôle inconnu", 'error'); return;
            }

            try {
                const res = await fetch(apiUrl, {
                    method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
                });

                if (res.ok) {
                    setListe(prevListe => prevListe.filter(user => user.uniqueKey !== uniqueKey));
                    if (recherche === uniqueKey) setRecherche("");
                    Swal.fire('Supprimé !', 'Le profil a bien été supprimé !', 'success');
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

    const listeAffichee = recherche 
        ? liste.filter(user => user.uniqueKey === recherche) 
        : liste;

    return (
        <div className="bulle">
            <h1>Liste des Utilisateurs</h1>

            <div>
                <button 
                    className="but" 
                    onClick={AjouterEmploye}>
                    Ajouter un employé
                </button>
                <div ></div>
                <div >
                    <SearchableSelect
                        options={liste}
                        value={recherche}
                        onChange={(value) => setRecherche(value)} 
                        getOptionValue={(user) => user.uniqueKey} 
                        getOptionLabel={(user) => `${user.nomComplet} (${user.role})`} 
                        placeholder="Rechercher un employé..."
                    />
                </div>
                {recherche && (
                    <button className="but" onClick={() => setRecherche("")}>
                        Réinitialiser
                    </button>
                )}
            </div>
            
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nom et Prénom</th>
                            <th>Rôle</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listeAffichee.map((user) => (
                            <tr key={user.uniqueKey}>
                                <td data-label="Nom/Prénom">{user.nomComplet}</td>
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
                                        onClick={() => Suppr(user.id, user.nomComplet, user.role, user.uniqueKey, user.originalLogin)}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {listeAffichee.length === 0 && <p>Aucun utilisateur trouvé.</p>}
        </div>
    )
}