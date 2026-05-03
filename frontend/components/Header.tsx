import React from 'react'

export default function Header(){
  return (
    <header className="w-full bg-white border-b">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <div className="text-xl font-semibold">KirtiBuildWell</div>
        <nav>
          <a className="mr-4 text-sm text-slate-700" href="#">Listings</a>
          <a className="mr-4 text-sm text-slate-700" href="#">Leads</a>
          <a className="text-sm text-slate-700" href="#">Admin</a>
        </nav>
      </div>
    </header>
  )
}
