'use client'

import React from 'react'
import ArtisantForm from '../components/ArtisantForm'
import Nav from '../components/Nav_maitreO'
import Footer from '../components/Footer'

export default function page() {
  return (
    <div className='Main'>
        <Nav/>
        <ArtisantForm/>
        <Footer/>
    </div>
  )
}
