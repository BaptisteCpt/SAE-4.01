import React, { useState, useEffect, useRef } from 'react';
import "../css/navLogin.css";
import { useRouter } from 'next/navigation';

/**
 * Composant de barre de navigation pour les maîtres d'œuvre
 * Affiche le menu de navigation avec les différentes sections accessibles
 * @returns {JSX.Element} La barre de navigation maître d'œuvre
 */
export default function Nav({ login }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
  /**
   * Ferme automatiquement le menu deroulant si l'utilisateur clique
   * en dehors de sa zone d'affichage 
   * @param {*} e - L'evenement qui est associé aux infos du clic
   */
  function handleClickOutside(e) {
    if (openMenu && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpenMenu(null);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  /**
   * Bascule l'affichage d'un menu déroulant spécifique
   * @param {string} menu - Le nom du menu à basculer
   */
  function toggleMenu(menu) {
    // Si le menu est déjà ouvert, on le ferme, sinon on l'ouvre
    setOpenMenu(openMenu === menu ? null : menu);
  }

  /**
   * Bascule l'affichage du menu mobile (hamburger)
   */
  function toggleMobileMenu() {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  /**
   * Déconnecte l'utilisateur
   */
  function logout() {
    router.push('/');
  }

  /**
   * Redirige vers la page d'accueil maître d'œuvre
   */
  function goToAccMaitre() {
    router.push('/accueil_maitre');
  }

  return (
    <nav className="Nav">
      <div className="logo-div" onClick={goToAccMaitre} style={{cursor: 'pointer'}}>
        <img src="/img/logo.png" alt="Bâti'Parti" className="logo-img"/>
      </div>

      <button className="burger-menu" onClick={toggleMobileMenu}>
        ☰
      </button>

      <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#" onClick={goToAccMaitre}>Accueil</a>

        <div className="menuderoulant" ref={dropdownRef}>
          <p className="nav-item" onClick={() => toggleMenu("Chantier")}>
            Chantier {openMenu === "Chantier" ? "⮝  " : "⮟"}
          </p>

          {openMenu === "Chantier" && (
            <div className="menuderoulantcontent">
              <a href="/suivi">Suivi</a>
              <a href="/personnalisation">Personnalisation</a>
              <a href="/artisan">Artisan</a>
              <a href="/AnalyseEtapes">Analyse Des Etapes</a>
            </div>
          )}
        </div>

        <div className="menuderoulant">
              <a href="/appel">Appel de fond</a>
        </div>

        <div className="profil-div">
          <div className='profil'>
            <img src="/img/photo_profil.png" alt="Bâti'Parti" className="profil-img"/>
            <input type='text' value={login} className='input-role' readOnly/>
          </div>
          <div className='logout'>
            <img src="/img/Logout.png" alt="Bâti'Parti" className="logout-img" onClick={()=>{logout()}}/>
          </div>
        </div>
      </div>
    </nav>
  );
}
