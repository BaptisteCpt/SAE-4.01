import React from 'react'
import styles from "../css/navLogin.css";
import {useState} from 'react'


export default function nav() {
    const [openMenu, setOpenMenu] = useState(null);
    const [pageOne,setPage1] = useState("Page1 ▾")
    const [pageTwo,setPage2] = useState("Page2 ▾")

    const page1 = document.getElementById('page1')
    const page2 = document.getElementById('page2')

    /*page1.addEventListener("click",()=>{

        if (pageOne === "Page1 ▾"){
            setPage1("Page1 ")
        }
        else{
            setPage1("Page1 ▾")
        }
    })*/

    /*page2.addEventListener("click",()=>{

        if (pageTwo === "Page2 ▾"){
            setPage2("Page2 ")
        }
        else{
            setPage2("Page2 ▾")
        }
    })*/


    function toggleMenu(menu) {
        setOpenMenu(openMenu === menu ? null : menu);
      }      

    return (
    <nav className="Nav">
      <a href="#">Home</a>

      <div className="menuderoulant">
        <button id='page1' className="activemenuboutton" onClick={() => toggleMenu("page1")}>
          {pageOne}
        </button>
        {openMenu === "page1" && 
          <div className="menuderoulantcontent">
            <a href="#">A</a>
            <a href="#">B</a>
            <a href="#">C</a>
          </div>
        }
      </div>

      <div className="menuderoulant">
        <button id='page2' className="activemenuboutton" onClick={() => toggleMenu("page2")}>
          {pageTwo}
        </button>
        {openMenu === "page2" && (
          <div className="menuderoulantcontent">
            <a href="#">A</a>
            <a href="#">B</a>
          </div>
        )}
      </div>

      <a href="#">Page3</a>
    </nav>
  );
}
