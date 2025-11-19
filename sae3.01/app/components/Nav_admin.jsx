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
