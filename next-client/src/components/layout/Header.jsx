"use client"
import React from 'react'
import { Map, LayoutDashboard  } from 'lucide-react';
import { UserMenu } from '../ui/User-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();

  return (
    <div className='w-full bg-orange-500 py-3 px-4 sm:px-6 flex justify-between items-center'>
        <h1 className='text-lg sm:text-2xl font-semibold text-white'>Community Issue Tracker</h1>
        <div className='flex items-center gap-3 text-white'>
          <Link
            href="/map"
            className={`hidden sm:flex items-center py-2 px-4 font-semibold rounded-full gap-2 cursor-pointer
               transition-colors duration-200 ${
              pathname === "/map"
                ? "bg-orange-600"
                : "hover:bg-orange-600 bg-transparent"
            }`}>
            <Map size={18} />
            Map
          </Link>

        <Link
          href="/dashboard"
          className={`hidden sm:flex items-center py-2 px-4 font-semibold rounded-full gap-2 cursor-pointer 
            transition-colors duration-200 ${
            pathname === "/dashboard"
              ? "bg-orange-600"
              : "hover:bg-orange-600 bg-transparent"
          }`}>
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
        <UserMenu />
        </div>  
    </div>
  )
}

export default Header 