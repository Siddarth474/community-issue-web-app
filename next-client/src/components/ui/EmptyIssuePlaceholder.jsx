import React from 'react';
import { BoxIcon, PlusCircle } from 'lucide-react';
import Link from 'next/link';

const EmptyIssuesPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center
      p-10 md:p-12 lg:p-16 shadow-lg bg-gray-50 dark:bg-zinc-900 dark:text-gray-100 
      rounded-xl text-gray-700
      max-w-xl mx-auto mb-5
    ">
      <div className="text-5xl md:text-6xl text-gray-400 mb-5">
        <BoxIcon size={68} strokeWidth={1.5} /> 
      </div>
      <h4 className="
        text-2xl md:text-3xl font-semibold
        text-black dark:text-white mb-3
      ">
        No Community Issues Reported Yet
      </h4>
      <p className="
        text-lg md:text-xl text-gray-500
        mb-8 leading-relaxed max-w-md
      ">
        It looks like everything is in order! If you spot something, be the first to report it.
      </p>
      <Link
        href='/map'
        className="
          inline-flex items-center space-x-2
          bg-orange-600 text-white
          font-medium py-3 px-7
          rounded-lg text-lg
          shadow-md hover:bg-orange-700
          transition-all duration-200 ease-in-out
          hover:-translate-y-1 hover:shadow-lg
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50
        "
      >
        <PlusCircle size={20} /> 
        <span>Report a New Issue</span>
      </Link>
    </div>
  );
};

export default EmptyIssuesPlaceholder;