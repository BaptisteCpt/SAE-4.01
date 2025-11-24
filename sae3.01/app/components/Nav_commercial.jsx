import React from 'react'
import styles from "../css/navLogin.css";
import {useState} from 'react'


export default function Nav() {
    const [openMenu, setOpenMenu] = useState(null);
    const [pageOne,setPage1] = useState("Page1 ▼")
    const [pageTwo,setPage2] = useState("Page2 ▼")

    function toggleMenu(menu) {
        setOpenMenu(openMenu === menu ? null : menu);
        switch(menu){
          case "page1" : 
            setPage1(pageOne === "Page1 ▼" ? "Page1 ▲" : "Page1 ▼")
            break;
          case "page2" : 
            setPage2(pageTwo === "Page2 ▼" ? "Page2 ▲" : "Page2 ▼")
            break;
        }
      }      

    return (
    <nav className="Nav">
      <div className="logo-container">
        <img src="/img/logo.png" alt="Bâti'Parti" className="logo-image"/>
      </div>

      <a href="#">Home</a>

      <div className="menuderoulant">
        <button id='Chantier' className="activemenuboutton" onClick={() => toggleMenu("page1")}>
          {pageOne}
        </button>
        {openMenu === "Chantier" && 
          <div className="menuderoulantcontent">
            <a href="#">Voir un Chantier</a>
            <a href="#">Création d'un chantier</a>
          </div>
        }
      </div>

      <a href="#">Catalogue</a>

      <div className="profil-container">
        <img src="/img/photo_profil.png" alt="Bâti'Parti" className="profil-image"/>
        <input type='text' value="Admin" className='input-role' readOnly/>
      </div>

    </nav>
  );
}
