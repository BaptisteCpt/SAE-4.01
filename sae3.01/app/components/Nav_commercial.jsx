import React from 'react'
import "../css/navLogin.css";
import {useState} from 'react' 
import { useRouter } from 'next/navigation'


export default function Nav() {
    const [openMenu, setOpenMenu] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [pageOne,setPage1] = useState("Chantier ⮟")
    const router = useRouter()

    function toggleMobileMenu() {
        setMobileMenuOpen(!mobileMenuOpen);
    }

    function toggleMenu(menu) {
        setOpenMenu(openMenu === menu ? null : menu);
        switch(menu){
          case "Chantier" : 
            setPage1(pageOne === "Chantier ⮟" ? "Chantier ⮝" : "Chantier ⮟")
            break;
        }
      }   
      
      async function logout() {
        localStorage.clear()
        router.push('/');
      }
      
      async function goAcc() {
        router.push('/accueil_commerciale')
      }

      async function goListeClient() {
        router.push('/page_client')
      }

      async function goStartChantier() {
        router.push('/creation_de_chantier')
      }

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

        <div className="menuderoulant">
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
            <input type='text' value="Commercial" className='input-role' readOnly/>
            </div>
            <div className='logout'>
            <img src="/img/Logout.png" alt="Bâti'Parti" className="logout-img" onClick={()=>{logout()}}/>
            </div>
        </div>
      </div>

    </nav>
  );
}
