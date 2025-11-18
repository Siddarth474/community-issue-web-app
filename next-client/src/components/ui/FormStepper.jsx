"use client"

import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const FormStepper = ({setStep, step}) => {
  return (
    <div className='my-6 flex justify-between items-center'>
        <button type='button'
        onClick={() => setStep(prev => prev - 1)}
        disabled={step === 1}
        className={`flex items-center gap-2 py-2 px-3 border text-xs rounded-full text-black dark:text-gray-100 cursor-pointer transition
        ${step === 1 ? 'text-gray-500 bg-gray-200 dark:bg-zinc-800' : 
        'border-orange-500 hover:bg-orange-50 dark:hover:bg-zinc-700'}`}>
            <ArrowLeft size={17} strokeWidth={1.3} />
            Back
        </button>
        
        <div className='flex gap-2 mt-4'>
            <p className={`w-2 h-2 rounded-full border-gray-400
            ${step === 1 ? 'bg-orange-400 ': 'bg-transparent border'}`}></p>
            <p className={`w-2 h-2 rounded-full border border-gray-400
            ${step === 2 ? 'bg-orange-400 ': 'bg-transparent border'}`}></p>
            <p className={`w-2 h-2 rounded-full border border-gray-400
            ${step === 3 ? 'bg-orange-400 ': 'bg-transparent border'}`}></p>
            <p className={`w-2 h-2 rounded-full border border-gray-400
            ${step === 4 ? 'bg-orange-400 ': 'bg-transparent border'}`}></p>
        </div>

        <button type='button'
        onClick={() => setStep(prev => prev + 1)}
        disabled={step === 4}
        className={`flex items-center gap-2 py-2 px-3 border text-xs rounded-full text-black dark:text-gray-100 cursor-pointer transition
            ${step === 4 ? 'text-gray-500 bg-gray-200 dark:bg-zinc-800' : 
            'border-orange-500 hover:bg-orange-50 dark:hover:bg-zinc-700'}`}>
            Next
            <ArrowRight size={17} strokeWidth={1.3} />
        </button>
    </div>
  )
}

export default FormStepper