import React, { useState, useEffect } from 'react'
import "../css/navLogin.css";
import { useRouter } from 'next/navigation'


export default function Nav() {
    const [openMenu, setOpenMenu] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [employeMenuText, setEmployeMenuText] = useState("Employés ▼");
    const [roleDisplay, setRoleDisplay] = useState("Admin");
    const router = useRouter()

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

    function toggleMobileMenu() {
        setMobileMenuOpen(!mobileMenuOpen);
    }

    function toggleMenu(menu) {
        if (openMenu === menu) {
            setOpenMenu(null);
            if (menu === "employes") setEmployeMenuText("Employés ▼");
        } else {
            setOpenMenu(menu);
            if (menu === "employes") setEmployeMenuText("Employés ▲");
        }
    }   
      
    async function logout() {
        localStorage.clear()
        router.push('/');
    }

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

        <div className="menuderoulant" onClick={() => toggleMenu("employes")}>
            <span className="nav-item">{employeMenuText}</span>
            {openMenu === "employes" && (
                <div className="menuderoulantcontent">
                    <a href="/pageCommerciale">Commercial</a>
                    <a href="/pageArtisant">Artisan</a>
                    <a href="/pageMoe">Maître d'Œuvre</a>
                    <a href="/pageAdmin">Administrateur</a>
                </div>
            )}
        </div>

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
