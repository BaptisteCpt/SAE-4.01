'use client'

import React from 'react'
import {useState} from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Image from 'next/image'
import '../css/login.css'

export default function LoginForm() {
    const [login,setlogin] = useState("")
    const [error,setError] = useState()
    const [mdp,setmdp] = useState("")
    const [success,setSuccess] = useState(false)
    const router = useRouter()

    async function check() {
        if(login.length == 0 || mdp.length == 0)
            {
                setError("Veuillez entrer un Login ou Mot de passe");
                return;
            }
      
        try {
          const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, mot_de_passe: mdp }),
          });
      
          const data = await res.json();
      
          if (!res.ok) {
            setError(data.error || 'Erreur de connexion');
            return;
          }

          if (res.ok) {
            localStorage.setItem("login", login);
            setSuccess(true);
          }
      
          setSuccess(true);
        } catch (err) {
          setError('Erreur Server');
        }
      }

    useEffect(() => { /* ici on evite le warning car next à le temps de charger le composants sans regarder le router.push */
        if (success) {
          router.push('/acceuil');
        }
      }, [success, router]); /* execute le useEffect à chauqe modif d'une de ces variables */

  return (
    <>
        {
            !success &&
            <div className="login-container">
                <div className="logo-container">
                    <img 
                        src="/img/logo.png" 
                        alt="Bâti'Parti" 
                        className="logo-image"
                    />
                </div>
                <h1 className="auth-title">Authentification</h1>
                
                <form className="login-form" onSubmit={(e)=>{e.preventDefault()}}>
                    <div className="form-group">
                        <label htmlFor="login">Identifiant</label>
                        <input 
                            id="login"
                            onChange={(e)=>setlogin(e.target.value)} 
                            type="text" 
                            name="login" 
                            placeholder="Votre Identifiant..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="mdp">Mot de passe</label>
                        <input 
                            id="mdp"
                            onChange={(e)=>setmdp(e.target.value)} 
                            type="password" 
                            name="mdp" 
                            placeholder="Votre mot de passe..." 
                            required
                        />
                    </div>

                    <button className="login-button" onClick={()=>{check()}}>
                        Connexion
                    </button>
                    {
                        error &&
                        <div className="error-message">{error}</div>
                    }
                </form>
            </div>
        }
    </>
  )
}
