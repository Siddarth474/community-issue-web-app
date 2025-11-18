"use client"

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"
import { LogOut, Sun, Moon, MoreVertical, UserCircle2 } from "lucide-react"
import {  handleSuccess } from "@/lib/notification"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function UserMenu() {
  const {data: session} = useSession();
  const {theme, setTheme} = useTheme('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if(!mounted) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({callbackUrl: '/login'});
    setTimeout(() => {
      handleSuccess("Logout Successfully");
    }, 1000);
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="hover" size="icon" className='hover:cursor-pointer'>
          <MoreVertical className="h-7 w-7" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40 z-[1000] dark:bg-zinc-900">
        <DropdownMenuItem className="flex relative items-center gap-2 ">
          <UserCircle2 className="text-blue-500" /> {session?.user?.username}
          <p className="absolute top-0 left-0 w-2 h-2 rounded-full bg-green-500"></p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="flex items-center gap-2"
        >
          {theme === "light" ? (
            <>
              <Moon className="h-4 w-4" /> Dark Mode
            </>
          ) : (
            <>
              <Sun className="h-4 w-4" /> Light Mode
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500"
        >
          <LogOut className="h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
