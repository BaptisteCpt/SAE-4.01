"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import "../css/login.css";

export default function EmailForm() {
    const [email, setEmail] = useState("");
    const router = useRouter(); 

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch("/api/send_email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }), 
            });
            const data = await response.json();
            
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Email envoyé !',
                    text: 'Si cet email existe, un lien vous a été envoyé.',
                    timer: 3000,
                    showConfirmButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Retour à la connexion'
                }).then(() => {
                    router.push('/'); 
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: data.error || "Erreur lors de l'envoi de l'email",
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
            <h2>Entrez votre email</h2> 
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Entrez votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Envoyer</button>
            </form>
            <button type="button" onClick={() => router.push('/')} style={{ marginTop: "10px" }}>
                Retour
            </button>
        </div>
    );
}