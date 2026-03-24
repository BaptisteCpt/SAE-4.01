"use client";

import React, { useState } from 'react';
import "../css/footer.css";
import { useRouter } from 'next/navigation';

/**
 * Composant de pied de page
 * Affiche le copyright avec l'année actuelle
 * @returns {JSX.Element} Le footer de l'application
 */
export default function Foot() {
    // Récupère l'année actuelle pour l'afficher dans le copyright
    const year = new Date().getFullYear()

    return (
        <footer className='foot'>
            © 2025 - {year} | Tous droits réservés.
        </footer>
    );
}
