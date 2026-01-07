'use client'

import React from 'react'
import Suivi from '../components/Suivi'
import Nav from '../components/Nav_maitreO'
import Footer from '../components/Footer'

export default function page() {
  return (
    <div className='Main'>
        <Nav/>
        <Suivi/>
        <Footer/>
    </div>
  )
}
