'use client'

import React from 'react'
import {useState} from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Nav from '../components/Nav'
import '../css/creation_chantier.css'

export default function page_de_creation_de_chantier() {
  return (
    <>
        {
            <div>
                <Nav/>
                <h1>Création d'un Chantier</h1>
                <form>
                    <label>
                        Information sur le Chantier :
                    </label>
                    <br />

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
        }
    </>
  )
}