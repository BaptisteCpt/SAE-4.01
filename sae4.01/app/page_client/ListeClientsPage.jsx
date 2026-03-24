'use client'
import Nav_commercial from '../components/Nav_commercial'
import Nav_admin from '../components/Nav_admin'
import Footer from '../components/Footer'
import Pclient from '../components/Pclient'

export default function ListeClientsPage({ role, login }) {
  // Le rôle arrive en prop depuis le serveur
  return (
    <div className="page-wrapper">
      {role === "admin"      && <Nav_admin login={login} />}
      {role === "commercial" && <Nav_commercial login={login} />}
      <Pclient />
      <Footer />
    </div>
  )
}