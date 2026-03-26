'use client'

import Reset from "../components/ResetPassWord";
import "../css/profil.css";

export default function ReinitialiserMdp() {
    return (
        <div className="bulle_login">
            <h1>Réinitialiser votre mot de passe</h1>
            <Reset />
        </div>
    );
}