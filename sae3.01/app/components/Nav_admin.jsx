import React from 'react'
import styles from "../css/navLogin.css";
import {useState} from 'react' 
import { useRouter } from 'next/navigation'


export default function Nav() {
    const [openMenu, setOpenMenu] = useState(null);
    const [pageOne,setPage1] = useState("Page1 ▼")
    const [pageTwo,setPage2] = useState("Page2 ▼")
    const router = useRouter()

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

      <a href="#">Administrer</a>

      <div className="profil-div">
        <div className='profil'>
          <img src="/img/photo_profil.png" alt="Bâti'Parti" className="profil-img"/>
          <input type='text' value="Admin" className='input-role' readOnly/>
        </div>
        <div className='logout'>
          <img src="/img/Logout.png" alt="Bâti'Parti" className="logout-img" onClick={()=>{logout()}}/>
        </div>
      </div>
    </nav>
  );
}
