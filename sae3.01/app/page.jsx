'use client'

import LoginForm from "./components/LoginForm"; 
import Footer from './components/Footer'

export default function Home() {
  return (
    <div className="Main">
        <LoginForm/>
        <Footer/>
    </div>
  );
}
