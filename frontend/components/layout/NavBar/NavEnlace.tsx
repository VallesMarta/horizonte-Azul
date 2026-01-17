'use client'

import Link from 'next/link'
import { FaPlaneDeparture } from 'react-icons/fa'
import { GrConfigure } from 'react-icons/gr'

interface NavEnlaceProps {
  irA: string
  textoAMostrar: string
  icono?: 'FaPlaneDeparture' | 'GrConfigure'
}

export default function NavEnlace({ irA, textoAMostrar, icono }: NavEnlaceProps) {
  const renderIcon = () => {
    switch (icono) {
      case 'FaPlaneDeparture':
        return <FaPlaneDeparture />
      case 'GrConfigure':
        return <GrConfigure />
      default:
        return null
    }
  }

  return (
    <li className="flex items-center gap-2 cursor-pointer hover:text-iconos hover:scale-110 transform transition duration-300">
      {renderIcon()}
      <Link href={`/${irA}`} className="font-bold text-lg">
        {textoAMostrar}
      </Link>
    </li>
  )
}
