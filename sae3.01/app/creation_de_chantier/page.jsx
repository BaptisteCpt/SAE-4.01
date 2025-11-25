'use client'

import React from 'react'
import {useState} from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Nav from '../components/Nav_commercial'
import ClientForm from '../components/ClientForm'
import '../css/creation_chantier.css'

export default function page() {
  return (
    <>
        <Nav/>
        <ClientForm/>

    </>
  )
}