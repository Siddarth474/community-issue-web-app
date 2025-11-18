"use client"

import { signIn } from "next-auth/react"
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleFailure, handleSuccess } from "@/lib/notification";

import { FaGoogle } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { LuEye, LuLoaderCircle } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import { CiUser } from "react-icons/ci";
import axios from "axios";
import Image from "next/image";

export default function Page() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  const [signupInfo, setSignupInfo] = useState({
    username: '',
    email: '',
    password: ''
  }); 
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const {name, value} = e.target;
    const copySignupInfo = {...signupInfo};
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('/api/users/signup', signupInfo);
      const {message, success} = response.data;

      if(success) {
        handleSuccess(message);
        setTimeout(() => {
          router.push('/login');
        }, 1000);
      }

    } catch (error) {
      if(error.response) {
        setLoading(false);
        const data = error.response.data;
        handleFailure(data.error || 'Invalid Email & password');
      }
      else {
        handleFailure('Network error. Please check your connection.', error.message);
      }
    } finally{
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 items-center">
      <div className="hidden lg:block w-full h-full bg-orange-100 dark:bg-blue-950">
        <Image src={'/Website-logo.png'}  width={800} height={800} alt="website-logo" />
      </div>
      <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-black">
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg m-4">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-orange-600">Create an Account</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-100">Get started with your free account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="username" className="font-medium text-black mb-1 dark:text-gray-100">
                Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <CiUser strokeWidth={1} className="w-5 h-5 text-gray-400" />
                  </span>
                  <input onChange={handleChange}
                      id="username"
                      name="username"
                      type="username"
                      value={signupInfo.username}
                      autoComplete="username"
                      required
                      className="w-full py-2 pl-10 pr-4 text-black dark:text-gray-100 bg-gray-100 dark:bg-zinc-800 
                      border border-transparent rounded-lg focus:outline-none focus:ring-3 focus:border-orange-500 focus:ring-orange-400"
                      placeholder="Enter your username"
                  />
                </div>
          </div>

          <div>
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
                value={signupInfo.email}
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
                type={showPassword ? 'text' : 'password'}
                value={signupInfo.password}
                autoComplete="current-password"
                required
                className="w-full py-2 pl-10 pr-10 text-gray-700 bg-gray-100 dark:bg-zinc-800 dark:text-gray-100 border border-transparent rounded-lg 
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
              className="w-full flex mt-2 justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm 
              font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              {loading ? <LuLoaderCircle size={20} className=" animate-spin text-white" /> : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-zinc-900 dark:text-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="w-full">
          <button onClick={() => signIn('google')}
            type="button"
            className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg
             shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-200  cursor-pointer
             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
             ">
            <FaGoogle className="w-5 h-5 mr-2 text-orange-600" />
            Google
          </button>
        </div>

        <p className="mt-8 text-sm text-center text-gray-500 dark:text-gray-100">
          Already have an account? 
          <Link href="/login" className="ml-2 font-bold text-gray-900 dark:text-gray-100 hover:underline">
            Sign in
          </Link>
        </p>

      </div>
      </div>
    </div>
  )
}