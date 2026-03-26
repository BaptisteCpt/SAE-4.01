"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; 
import Swal from 'sweetalert2';
import "../css/login.css";

export default function ResetPassWord() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter(); 

    async function handleSubmit(e) {
        e.preventDefault();
        
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Lien invalide',
                text: "Le lien de réinitialisation est manquant ou incorrect.",
                confirmButtonColor: '#d33'
            });
            return;
        }

        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Attention',
                text: "Les mots de passe ne correspondent pas.",
                confirmButtonColor: '#f8bb86'
            });
            return;
        }

        try {
            const response = await fetch("/api/reset_password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const data = await response.json();
            
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Mot de passe modifié !',
                    text: 'Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.',
                    timer: 3000,
                    showConfirmButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Se connecter'
                }).then(() => {
                    router.push('/'); 
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Échec',
                    text: data.error || "Erreur lors de la réinitialisation",
                    confirmButtonColor: '#d33'
                });
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur serveur',
                text: "Impossible de joindre le serveur pour le moment.",
                confirmButtonColor: '#d33'
            });
        }
    } 
    
    return (
        <div className="bulle_login">
            <h2>Nouveau mot de passe</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">
                    Valider le changement
                </button>
            </form>
        </div>
    );
}