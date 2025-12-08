import React, { useState } from 'react';
import "../css/navLogin.css";
import { useRouter } from 'next/navigation';

export default function Nav() {
  const [openMenu, setOpenMenu] = useState(null);
  const router = useRouter();

  function toggleMenu(menu) {
    setOpenMenu(openMenu === menu ? null : menu);
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
      <div className="logo-div">
        <img src="/img/logo.png" alt="Bâti'Parti" className="logo-img"/>
      </div>

      <a href="#" onClick={goToAccMaitre}>Accueil</a>

      <div className="menuderoulant">
        <p className="nav-item" onClick={() => toggleMenu("Chantier")}>
          Chantier {openMenu === "Chantier" ? "⮝  " : "⮟"}
        </p>

        {openMenu === "Chantier" && (
          <div className="menuderoulantcontent">
            <a href="#">Suivi</a>
            <a href="#">Personnalisation</a>
            <a href="#">Artisan</a>
          </div>
        )}
      </div>

      <a href="#">Appel de fond</a>

      <div className="profil-div">
        <div className='profil'>
          <img src="/img/photo_profil.png" alt="Bâti'Parti" className="profil-img"/>
          <input type='text' value="MaitreO" className='input-role' readOnly/>
        </div>
        <div className='logout'>
          <img src="/img/Logout.png" alt="Bâti'Parti" className="logout-img" onClick={()=>{logout()}}/>
        </div>
      </div>
    </nav>
  );
}
