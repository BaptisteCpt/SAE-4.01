'use client'

import React from 'react'
import {useState} from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

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
      
          setError('');
          setSuccess(true);
        } catch (err) {
          setError('Erreur serveur');
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
            <form onSubmit={(e)=>{e.preventDefault()}}>
                <input onChange={(e)=>setlogin(e.target.value)} type="text" name="login" placeholder="Login"/>

                <input onChange={(e)=>setmdp(e.target.value)} type="password" name="mdp" placeholder="Mot de passe" required/>

                <button onClick={()=>{check()}}>
                    Envoi
                </button>
                {
                    error &&
                    <h1>{error}</h1>
                }
            </form>
        }
    </>
  )
}
