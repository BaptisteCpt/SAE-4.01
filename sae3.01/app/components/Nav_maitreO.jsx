import React, { useState, useEffect } from 'react';
import "../css/navLogin.css";
import { useRouter } from 'next/navigation';

export default function Nav() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDisplay, setRoleDisplay] = useState("Maître d'œuvre");
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

  function toggleMenu(menu) {
    setOpenMenu(openMenu === menu ? null : menu);
  }

  function toggleMobileMenu() {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  function logout() {
    localStorage.clear();
    router.push('/');
  }

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

        <div className="menuderoulant">
          <p className="nav-item" onClick={() => toggleMenu("Chantier")}>
            Chantier {openMenu === "Chantier" ? "⮝  " : "⮟"}
          </p>

          {openMenu === "Chantier" && (
            <div className="menuderoulantcontent">
              <a href="/suivi">Suivi</a>
              <a href="/personnalisation">Personnalisation</a>
              <a href="/artisan">Artisan</a>
            </div>
          )}
        </div>

        <a href="/appel">Appel de fond</a>

        <div className="profil-div">
          <div className='profil'>
            <img src="/img/photo_profil.png" alt="Bâti'Parti" className="profil-img"/>
            <input type='text' value={roleDisplay} className='input-role' readOnly/>
          </div>
          <div className='logout'>
            <img src="/img/Logout.png" alt="Bâti'Parti" className="logout-img" onClick={()=>{logout()}}/>
          </div>
        </div>
      </div>
    </nav>
  );
}
