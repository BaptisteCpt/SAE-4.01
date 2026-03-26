import ProfilUser from "../components/ProfilComp";
import "../css/profil.css";

export default function ProfilPage({ login }) {
    return (
        <main>
            <ProfilUser login={login}/>
        </main>
    );
}