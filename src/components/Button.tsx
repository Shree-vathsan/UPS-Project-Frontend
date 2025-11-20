import React from 'react'

type T = {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

export const Btn: React.FC<T> = ({ children, onClick, variant = 'primary' }) => {
  const base = 'w-full px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2'
  const v =
    variant === 'primary'
      ? 'bg-gray-900 text-white hover:bg-black'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'

  return (
    <button onClick={onClick} className={`${base} ${v}`}>
      {children}
    </button>
  )
}
