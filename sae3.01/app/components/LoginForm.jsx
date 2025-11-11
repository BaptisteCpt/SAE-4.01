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

    function check(){
        if(login.length == 0 || mdp.length == 0)
        {
            setError("Veuillez entrer un Login ou Mot de passe");
            return;
        }
        setSuccess(true)
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

                <pre>
                    {login}
                    <br/>
                    {mdp}
                </pre>

                {
                    error &&
                    <h1>{error}</h1>
                }
                <button onClick={()=>{check()}}>
                    Envoi
                </button>
            </form>
        }
    </>
  )
}
