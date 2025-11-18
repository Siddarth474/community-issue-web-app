"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import { handleFailure, handleSuccess } from "@/lib/notification";
import { FaGoogle } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import { LuLoaderCircle } from "react-icons/lu";
import Image from "next/image";

export default function Page() {
  
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  }); 
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const {name, value} = e.target;
    const copyLoginInfo = {...loginInfo};
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  }

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    const response = await signIn('credentials', {
      email: loginInfo.email,
      password: loginInfo.password,
      redirect: false
    });

    if(response?.error) {
      handleFailure(response.error);
    }
    else{ 
      router.push('/map');
      handleSuccess('Login Successfully');
    }
    setLoading(false);
  }

  return (
    <div className="grid lg:grid-cols-2 items-center min-h-screen font-sans">
      <div className="hidden lg:block bg-orange-100 dark:bg-blue-950 w-full h-full">
        <Image src={'/Website-logo.png'}  width={800} height={800} alt="website-logo" />
      </div>
      <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-black ">
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg m-4">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-orange-600">Welcome back</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-100">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">

          <div >
            <label htmlFor="email" className="font-medium text-black dark:text-gray-100">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <MdOutlineMail className="w-5 h-5 text-gray-400" />
              </span>
              <input onChange={handleChange}
                id="email"
                name="email"
                type="email"
                value={loginInfo.email}
                autoComplete="email"
                required
                className="w-full py-2 pl-10 pr-4 text-black dark:text-gray-100 bg-gray-100 dark:bg-zinc-800 border border-transparent rounded-lg 
                focus:outline-none focus:ring-3 focus:border-orange-500 focus:ring-orange-400"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className=" font-medium text-black dark:text-gray-100">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <CiLock className="w-5 h-5 text-gray-400" />
              </span>
              <input onChange={handleChange}
                id="password"
                name="password"
                value={loginInfo.password}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="w-full py-2 pl-10 pr-10 text-black dark:text-gray-100 bg-gray-100 dark:bg-zinc-800 border border-transparent rounded-lg 
                focus:outline-none focus:ring-3 focus:border-orange-500 focus:ring-orange-400"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <LuEyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <LuEye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm 
              text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              {loading ? <LuLoaderCircle size={20} className=" animate-spin text-white" /> : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-zinc-900 text-gray-500 dark:text-gray-100">Or continue with</span>
          </div>
        </div>

        <div className="w-full">
          <button onClick={() => signIn('google')}
            type="button"
            className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg
             shadow-sm bg-white text-sm font-medium text-gray-600 hover:bg-gray-200  cursor-pointer
             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
             ">
            <FaGoogle className="w-5 h-5 mr-2 text-orange-600" />
            Google
          </button>
        </div>

        <p className="mt-8 text-sm text-center text-gray-500 dark:text-gray-100">
          Don't have an account? 
          <Link href="/signup" className="ml-2 font-bold text-gray-900 dark:text-gray-100 hover:underline">
            Sign up
          </Link>
        </p>

      </div>
      </div>
    </div>
  )
}