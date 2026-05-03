import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {children?: React.ReactNode}

export default function Button({ children, ...rest }: Props){
  return (
    <button className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700" {...rest}>
      {children}
    </button>
  )
}
