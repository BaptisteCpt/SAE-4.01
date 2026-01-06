import React, { useState } from 'react';
import "../css/footer.css";
import { useRouter } from 'next/navigation';

export default function Foot() {
    const year = new Date().getFullYear()

    return (
        <footer className='foot'>
            © 2025 - {year} Tout droits réservées.
        </footer>
    );
}
