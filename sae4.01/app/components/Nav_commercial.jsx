import React, { useState, useEffect, useRef } from 'react'
import "../css/navLogin.css";
import { useRouter } from 'next/navigation'


/**
 * Composant de barre de navigation pour les commerciaux
 * Affiche le menu de navigation avec les différentes sections accessibles
 * @returns {JSX.Element} La barre de navigation commercial
 */
export default function Nav({ login }) {
    const [openMenu, setOpenMenu] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [pageOne,setPage1] = useState("Chantier ⮟");
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
     * Bascule l'affichage du menu mobile (hamburger)
     */
    function toggleMobileMenu() {
        setMobileMenuOpen(!mobileMenuOpen);
    }

    /**
     * Bascule l'affichage d'un menu déroulant spécifique
     * Met à jour le texte du bouton avec une flèche pour indiquer l'état (ouvert/fermé)
     * @param {string} menu - Le nom du menu à basculer
     */
    function toggleMenu(menu) {
        // Si le menu est déjà ouvert, on le ferme, sinon on l'ouvre
        setOpenMenu(openMenu === menu ? null : menu);
        // Mise à jour du texte du bouton avec une flèche selon l'état
        switch(menu){
          case "Chantier" : 
            // Change la flèche : ⮟ (bas) quand fermé, ⮝ (haut) quand ouvert
            setPage1(pageOne === "Chantier ⮟" ? "Chantier ⮝" : "Chantier ⮟")
            break;
        }
      }   
      
      /**
       * Déconnecte l'utilisateur en vidant le localStorage et redirige vers la page d'accueil
       */
      async function logout() {
        localStorage.clear()
        router.push('/');
      }
      
      /**
       * Redirige vers la page d'accueil commercial
       */
      async function goAcc() {
        router.push('/accueil_commerciale')
      }

      /**
       * Redirige vers la page de liste des clients
       */
      async function goListeClient() {
        router.push('/page_client')
      }

      /**
       * Redirige vers la page de création de chantier
       */
      async function goStartChantier() {
        router.push('/creation_de_chantier')
      }

      /**
       * Redirige vers la page de catalogue des modèles
       */
      async function goModel() {
        router.push('/page_model')
      }

    return (
    <nav className="Nav">
      <div className="logo-div" onClick={goAcc} style={{cursor: 'pointer'}}>
        <img src="/img/logo.png" alt="Bâti'Parti" className="logo-img"/>
      </div>

      <button className="burger-menu" onClick={toggleMobileMenu}>
        ☰
      </button>

      <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#" onClick={goAcc}>Accueil</a>

        <div className="menuderoulant" ref={dropdownRef}>
            <button className="nav-item" onClick={() => toggleMenu("Chantier")}>
            {pageOne}
            </button>
            {openMenu === "Chantier" && 
            <div className="menuderoulantcontent">
                <a href="#"onClick={goListeClient}>Liste clients</a>
                <a href="#"onClick={goStartChantier}>Création d'un chantier</a>
            </div>
            }
        </div>

        <a href="#" onClick={goModel}>Catalogue</a>

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
