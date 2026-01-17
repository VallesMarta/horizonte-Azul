'use client'

import Link from 'next/link'

interface NavButtonProps {
  irA: string
  textoAMostrar: string
  color: 'primario' | 'secundario'
}

export default function NavButton({ irA, textoAMostrar, color }: NavButtonProps) {
  const colorClass =
    color === 'primario' ? 'bg-texto' : 'bg-secundario'

  return (
    <li>
      <Link
        href={`/${irA}`}
        className={`${colorClass} font-bold px-4 py-2 rounded 
                    hover:text-texto hover:bg-iconos
                    hover:scale-105 transform transition duration-300`}
      >
        {textoAMostrar}
      </Link>
    </li>
  )
}
