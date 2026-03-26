"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import "../css/profil.css";

export default function ProfilUser({ login }) {
    const router = useRouter();
    const [user, setUser] = useState(null);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        
        if (!login) {
            router.push('/'); 
            return;
        }

        async function fetchUser() {
            try {
                const response = await fetch(`/api/get_profil?login=${login}`);
                const data = await response.json();
                if (response.ok) {
                    setUser(data);
                } else {
                    Swal.fire('Erreur', data.error, 'error');
                }
            } catch (error) {
                console.error("Erreur de récupération:", error);
            }
        }
        fetchUser();
    }, [router]);

    async function handleSubmit(e) {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Attention',
                text: "Les nouveaux mots de passe ne correspondent pas.",
                confirmButtonColor: '#f8bb86'
            });
            return;
        }

        try {
            const response = await fetch("/api/update_password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    login: user.login, 
                    oldPassword: oldPassword, 
                    newPassword: newPassword 
                }),
            });
            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Succès !',
                    text: 'Votre mot de passe a été mis à jour.',
                    confirmButtonColor: '#3085d6'
                });
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: data.error || "Impossible de changer le mot de passe",
                    confirmButtonColor: '#d33'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur serveur',
                text: "Impossible de joindre le serveur.",
                confirmButtonColor: '#d33'
            });
        }
    }

    if (!user) return <div className="profil-loading">Chargement du profil...</div>;

    return (
        <div className="bulle_login">
            <h1>Mon Profil</h1>

            <div className="profil-infos">
                <p><strong>Nom :</strong> {user.nom}</p>
                <p><strong>Prénom :</strong> {user.prenom}</p>
                <p><strong>Identifiant :</strong> {user.login}</p>
                <p><strong>Email :</strong> {user.mail || "Non renseigné"}</p>
                <p><strong>Rôle :</strong> {user.role}</p>
            </div>

            <br />
            <h2>Changer mon mot de passe</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Ancien mot de passe"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirmer le nouveau mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Valider la modification</button>
            </form>
            
            <button type="button" className="btn-secondary" onClick={() => router.back()}>
                Retour
            </button>
        </div>
    );
}