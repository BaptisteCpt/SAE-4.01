'use client'

import React from 'react'
import {useState} from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Nav from '../components/Nav'
import '../css/creation_chantier.css'

export default function page() {
  return (
    <>
        {
            <div>
                <Nav/>
                <h1>Création d'un Chantier</h1>
                <form>
                    <label>
                        Profil du Client:
                    </label>
                    <br />
                    <label>
                        Nom:
                        <input type="text" name="Nom" />
                    </label>
                    <br />
                    <label>
                        Prénom:
                        <input type="text" name="Prenom" />
                    </label>
                    <br />
                    <label>
                        Adresse:
                        <input type="text" name="Adresse" />
                    </label>
                    <br />
                    <label>
                        Ville:
                        <input type="text" name="Ville" />
                    </label>
                    <br />
                    <label>
                        Code Postal:
                        <input type="text" name="CodePostal" />
                    </label>
                    <br />
                    <button type="submit">Continuer</button>
                </form>
            </div>
        }
    </>
  )
}