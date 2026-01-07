'use client'

import "../css/admin-list.css"; 
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminAdmin from '../components/AdminAdmin'
import Nav_Admin from '../components/Nav_admin'

export default function page() {

  return (
    <>
      <Nav_Admin/>
      <AdminAdmin/>
    </>
  )
}