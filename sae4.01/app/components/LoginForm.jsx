"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "../css/login.css";

/**
 * Composant de formulaire de connexion
 * Gère l'authentification des utilisateurs et redirige selon leur rôle
 * @returns {JSX.Element} Le formulaire de connexion
 */
export default function LoginForm() {
  const [login, setlogin] = useState("");
  const [error, setError] = useState();
  const [mdp, setmdp] = useState("");
  const [role, setRole] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  /**
   * Vérifie les identifiants de connexion et authentifie l'utilisateur
   * et redirige selon le rôle
   */
  async function check() {
    if (login.length == 0 || mdp.length == 0) {
      setError("Veuillez entrer un Login ou Mot de passe");
      return;
    }

    try {
      /* Appel à l'Api */
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, mot_de_passe: mdp }),
      });
      /* récupération des infos liées au login et mot de passe */
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur de connexion");
        return;
      }

      /* Enregistrement du role et du nom prénom de l'utilisateur */
      if (res.ok) {
        setRole(data.role); // on stock le role dans notre variable
        setSuccess(true); // Déclenche la redirection via useEffect
      }
    } catch (err) {
      setError("Erreur serveur");
    }
  }

  useEffect(() => {
    if (success) {
      const redirects = {
        admin: "/accueil_admin",
        commercial: "/accueil_commerciale",
        "maitre Oeuvre": "/accueil_maitre",
        artisan: "/accueil_artisan",
      };
      router.push(redirects[role] ?? "/");
    }
  }, [
    success,
    router,
    role,
  ]); /* execute le useEffect à chauqe modif d'une de ces variables */

  return (
    <>
      {
        /* Affichage du formulaire si on n'est pas login, sinon redirige sur la page d'accueil */
        !success && (
          <div className="login-container">
            <div className="logo-container">
              <img
                src="/img/logo.png"
                alt="Bâti'Parti"
                className="logo-image"
              />
            </div>
            <h1 className="auth-title">Authentification</h1>

            <form
              className="login-form"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="form-group">
                <label htmlFor="login">Identifiant</label>
                <input
                  id="login"
                  onChange={(e) => setlogin(e.target.value)}
                  type="text"
                  name="login"
                  placeholder="Votre Identifiant..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="mdp">Mot de passe</label>
                <input
                  id="mdp"
                  onChange={(e) => setmdp(e.target.value)}
                  type="password"
                  name="mdp"
                  placeholder="Votre mot de passe..."
                  required
                />
              </div>

              <button
                className="login-button"
                onClick={() => {
                  check();
                }}
              >
                Connexion
              </button>
              {error && <div className="error-message">{error}</div>}
            </form>
          </div>
        )
      }
    </>
  );
}
