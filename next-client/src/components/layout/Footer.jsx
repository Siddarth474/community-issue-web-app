"use client"

import React from 'react';
import { Map, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();

  return (
    <div className='flex md:hidden fixed bottom-0 z-99 bg-white text-black dark:bg-zinc-900
     dark:text-gray-100 p-3 w-full justify-evenly gap-10'>
        <button>
          <Link href='/map'
          className={`flex py-2 px-4 hover:bg-orange-100 hover:text-orange-500 
          rounded-lg gap-2 cursor-pointer ${
            pathname === "/map"
                ? "text-orange-600"
                : ""
          }`}>
              <Map />
              Map
          </Link>
        </button>
        <button>
          <Link href='/dashboard'
          className={`flex py-2 px-4 hover:bg-orange-100 hover:text-orange-500 
          rounded-lg gap-2 cursor-pointer ${
            pathname === "/dashboard"
                ? "text-orange-600"
                : ""
          }`}>
              <LayoutDashboard />
              Dashboard
          </Link>
        </button>
    </div>
  )
}

export default Footer