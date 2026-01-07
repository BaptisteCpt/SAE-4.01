'use client'

import "../css/admin-list.css"; 
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Liste from '../components/ListeAdmin'
import Nav_Admin from '../components/Nav_admin'

export default function page() {

  return (
    <>
      <Nav_Admin/>
      <Liste/>
    </>
  )
}