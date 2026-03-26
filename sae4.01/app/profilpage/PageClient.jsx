import ProfilUser from "../components/ProfilComp";
import "../css/profil.css";

export default function ProfilPage({ login }) {
    return (
        <main className="profil-page">
            <ProfilUser login={login}/>
        </main>
    );
}