import React, { useState, useEffect, useRef } from 'react'
import "../css/navLogin.css";
import { useRouter } from 'next/navigation'


/**
 * Composant de barre de navigation pour les administrateurs
 * Affiche le menu de navigation avec les différentes sections accessibles
 * @returns {JSX.Element} La barre de navigation administrateur
 */
export default function Nav() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [roleDisplay, setRoleDisplay] = useState("Admin");
    const router = useRouter();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role) {
            const roleMap = {
                "admin": "Administrateur",
                "commercial": "Commercial",
                "maitre Oeuvre": "Maître d'œuvre"
            };
            setRoleDisplay(roleMap[role] || role);
        }
    }, []);      

    /**
     * Bascule l'affichage du menu mobile
     */
    function toggleMobileMenu() {
        setMobileMenuOpen(!mobileMenuOpen);
    }
 
      
    /**
     * Déconnecte l'utilisateur en vidant le localStorage et redirige vers la page d'accueil
     */
    async function logout() {
        localStorage.clear()
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
            <input type='text' value={roleDisplay} className='input-role' readOnly/>
            </div>
            <div className='logout'>
            <img src="/img/Logout.png" alt="Bâti'Parti" className="logout-img" onClick={()=>{logout()}} style={{cursor: 'pointer'}}/>
            </div>
        </div>
      </div>
    </nav>
  );
}
