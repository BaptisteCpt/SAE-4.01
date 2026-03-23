import React, { useEffect, useState } from "react";
import "../css/navLogin.css";
import { useRouter } from "next/navigation";

/**
 * Composant de barre de navigation pour les artisans.
 * @returns {JSX.Element} La barre de navigation artisan
 */
export default function NavArtisan() {
  const [roleDisplay, setRoleDisplay] = useState("Artisan");
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      const roleMap = {
        admin: "Administrateur",
        commercial: "Commercial",
        "maitre Oeuvre": "Maître d'œuvre",
        artisan: "Artisan",
      };
      setRoleDisplay(roleMap[role] || role);
    }
  }, []);

  function logout() {
    localStorage.clear();
    router.push("/");
  }

  function goAccueilArtisan() {
    router.push("/accueil_artisan");
  }

  return (
    <nav className="Nav">
      <div className="logo-div" onClick={goAccueilArtisan} style={{ cursor: "pointer" }}>
        <img src="/img/logo.png" alt="Bâti'Parti" className="logo-img" />
      </div>

      <div className="nav-links">
        <a href="/accueil_artisan">Accueil</a>
        <a href="/liste_chantiers_artisan">Liste des chantiers</a>
        <a href="/generer_facture_artisan">Generer une facture</a>

        <div className="profil-div">
          <div className="profil">
            <img src="/img/photo_profil.png" alt="Bâti'Parti" className="profil-img" />
            <input type="text" value={roleDisplay} className="input-role" readOnly />
          </div>
          <div className="logout">
            <img
              src="/img/Logout.png"
              alt="Bâti'Parti"
              className="logout-img"
              onClick={logout}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
