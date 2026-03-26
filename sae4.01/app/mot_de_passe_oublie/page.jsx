'use client'

import EmailForm from "../components/EmailForm";
import "../css/profil.css";

export default function MotDePasseOublie() {
    return (
        <div className="bulle_login">
            <h1>Mot de passe oublié</h1>
            <EmailForm />
        </div>
    );
}