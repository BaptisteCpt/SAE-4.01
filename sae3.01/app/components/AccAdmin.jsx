'use client' 
import "../css/accueil.css"; 
import { useState, useEffect } from 'react' 
import { useRouter } from 'next/navigation'

export default function AccAdmin() { 

    const [nom, setNom] = useState("");
    const router = useRouter();

    useEffect(() => {
        const nomStocke = localStorage.getItem("nom");
        if (nomStocke) {
            setNom(nomStocke);
        }
    }, []); 

    function pageEmploye(){
        router.push('/pageListeEmp')
    }

    function pageChantier(){
        router.push('/pageAdminChantier')
    }

    function pageModel(){
        router.push('/pageListeModel')
    }

    return (
        <div className="bulle_accueil">
            <h1>Bienvenue { nom }</h1> 
            <div className="boutons_accueil">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <img src="/img/maison-icone.png" className="modeles-img" alt="Modèles" onClick={pageModel}/>
                                <button className="but" type="button" onClick={pageModel}>
                                    Liste des modèles
                                </button>
                            </td>
                            <td>
                                <img src="/img/dossier.png" className="dossier-img" onClick={pageChantier} alt="Chantiers"/>
                                <button className="but" type="button" onClick={pageChantier}>
                                    Liste des chantiers
                                </button>
                            </td>
                            <td>
                                <img src="/img/client.png" className="clients-img" onClick={pageEmploye} alt="Employés"/>
                                <button className="but" type="button" onClick={pageEmploye}>
                                    Liste des employés
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}