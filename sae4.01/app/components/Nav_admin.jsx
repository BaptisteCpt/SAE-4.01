import React, { useState, useEffect, useRef } from 'react'
import "../css/navLogin.css";
import { useRouter } from 'next/navigation'


/**
 * Composant de barre de navigation pour les administrateurs
 * Affiche le menu de navigation avec les différentes sections accessibles
 * @returns {JSX.Element} La barre de navigation administrateur
 */
export default function Nav({ login }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();     

    /**
     * Bascule l'affichage du menu mobile
     */
    function toggleMobileMenu() {
        setMobileMenuOpen(!mobileMenuOpen);
    }
 
      
    /**
     * Déconnecte l'utilisateur 
     */
    async function logout() {
        router.push('/');
    }

    /**
     * Redirige vers la page d'accueil administrateur
     */
    function goAccAdmin() {
        router.push('/accueil_admin');
    }
      
    return (
    <nav className="Nav">
      <div className="logo-div" onClick={goAccAdmin} style={{cursor: 'pointer'}}>
        <img src="/img/logo.png" alt="Bâti'Parti" className="logo-img"/>
      </div>

      <button className="burger-menu" onClick={toggleMobileMenu}>
        ☰
      </button>

      <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="/accueil_admin">Accueil</a>

        <a href="/pageListeModel">Modèles</a>

        <a href="/pageAdminChantier">Chantiers</a>

        <a href="/pageListeUtilisateurs">Utilisateurs</a>

        <div className="profil-div">
            <div className='profil'>
            <img src="/img/photo_profil.png" alt="Bâti'Parti" className="profil-img"/>
            <input type='text' value={login} className='input-role' readOnly/>
            </div>
            <div className='logout'>
            <img src="/img/Logout.png" alt="Bâti'Parti" className="logout-img" onClick={()=>{logout()}} style={{cursor: 'pointer'}}/>
            </div>
        </div>
      </div>
    </nav>
  );
}
