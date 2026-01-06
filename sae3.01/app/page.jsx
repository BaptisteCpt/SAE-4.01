'use client'

import Image from "next/image";
import styles from "./css/login.css";
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
