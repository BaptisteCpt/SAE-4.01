import React from 'react'
import {useState} from 'react'

export default function LoginForm() {
    const [login,setlogin] = useState("")
    const [error,setError] = useState()
    const [mdp,setmdp] = useState("")
    const [success,setSuccess] = useState(false)

    function check(){
        if(login.length == 0 || mdp.length == 0)
        {
            setError("c'est vide");
            return;
        }
        setSuccess(true)
    }

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
        {
            success&&
            <h1>Logged</h1>
        }
    </>
  )
}
