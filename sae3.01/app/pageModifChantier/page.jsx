'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Modif from '../components/AdminModifChantier'
import Nav_Admin from '../components/Nav_admin'

export default function page() {

  return (
    <>
      <Nav_Admin/>
      <Modif/>
    </>
  )
}