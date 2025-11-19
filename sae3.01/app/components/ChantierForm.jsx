'use client'

import React from 'react'
import {useState} from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Image from 'next/image'
import '../css/login.css'

export default function ChantierForm() {
  return (
    <div className='BulleDuFormulaire'>
        <h1>Création d'un Chantier</h1>
                
        <p>
            Information sur le Chantier :
        </p>
        <form>
            <input type="date" name="current_date"/>
            // Date actuelle à remplir automatiquement
            <br />

            <label>
                Maître d'oeuvre:
                <input type="text" name="maitre_doeuvre" />
            </label>
            <br />
            <label>
                Modèle de maison:
                <select name="modele_maison" id="m_maison"></select>
                // A remplir dynamiquement avec les modèles de maison disponibles
            </label>
            <br />
            <label>
                Adresse du Chantier:
                <input type="text" name="Adresse_du_chantier" />
            </label>
            <br />
            <label>
                Ville:
                <input type="text" name="villechantier" />
            </label>
            <br />
            <label>
                Code Postal:
                <input type="text" name="Code_Postal_chantier" />
            </label>
            <br />
            <button type="submit">Finalisé la Création</button>
        </form>
    </div>
  )
}