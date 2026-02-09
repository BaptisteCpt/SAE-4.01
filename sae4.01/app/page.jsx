'use client'

import LoginForm from "./components/LoginForm"; 
import Footer from './components/Footer'

/**
 * Page d'accueil principale de l'application
 * Affiche le formulaire de connexion et le footer
 * @returns {JSX.Element} La page d'accueil avec le formulaire de connexion
 */
export default function Home() {
  return (
    <div className="Main">
        <LoginForm/>
        <Footer/>
    </div>
  );
}
