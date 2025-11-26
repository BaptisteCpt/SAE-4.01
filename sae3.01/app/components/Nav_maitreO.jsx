import React from 'react'
import styles from "../css/navLogin.css";
import {useState} from 'react' 
import { useRouter } from 'next/navigation'


export default function Nav() {
    const [openMenu, setOpenMenu] = useState(null);
    const [pageOne,setPage1] = useState("Chantier ▼")
    const [pageTwo,setPage2] = useState("Page2 ▼")
    const router = useRouter()

    function toggleMenu(menu) {
        setOpenMenu(openMenu === menu ? null : menu);
        switch(menu){
          case "Chantier" : 
            setPage1(pageOne === "Chantier ▼" ? "Chantier ▲" : "Chantier ▼")
            break;
          case "page2" : 
            setPage2(pageTwo === "Page2 ▼" ? "Page2 ▲" : "Page2 ▼")
            break;
        }
      }   
      
      async function logout() {
        localStorage.clear()
        router.push('/');
        }    

    return (
    <nav className="Nav">
      <div className="logo-div">
        <img src="/img/logo.png" alt="Bâti'Parti" className="logo-img"/>
      </div>

      <a href="#">Home</a>

      <div className="menuderoulant">
        <button id='Chantier' className="activemenuboutton" onClick={() => toggleMenu("Chantier")}>
          {pageOne}
        </button>
        {openMenu === "Chantier" && 
          <div className="menuderoulantcontent">
            <a href="#">Suivie</a>
            <a href="#">Personnalisation</a>
            <a href="#">Artisant</a>
          </div>
        }
      </div>

      <a href="#">Appel de fond</a>

      <div className="profil-div">
        <img src="/img/photo_profil.png" alt="Bâti'Parti" className="profil-img"/>
        <input type='text' value="MaitreO" className='input-role' readOnly/>
      </div>

      <div className='logout-div'>
        <img src="/img/Logout.png" alt="Bâti'Parti" className="logout-img" onClick={()=>{logout()}}/>
      </div>
      
    </nav>
  );
}
