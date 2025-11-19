"use client"
import { IssueContext } from '@/context/IssueContext';
import { CheckCircle, Clock, Hammer } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'

const Stats = () => {
    const {allIssuesList} = useContext(IssueContext);

    const [numberOf, setNumberOf] = useState({
        openIssues: 0,
        inProgressIssues: 0,
        solvedIssues: 0
    });

    const findNumberOfIssues = () => {
        const counts = allIssuesList.reduce(
            (acc, issue) => {
                if (issue.Status === "open") acc.openIssues++;
                else if (issue.Status === "in-progress") acc.inProgressIssues++;
                else acc.solvedIssues++;
                return acc;
            },
            { openIssues: 0, inProgressIssues: 0, solvedIssues: 0 }
        );

        setNumberOf(counts);
    };


    useEffect(() => {
        findNumberOfIssues();
    }, [allIssuesList])

  return (
    <div className='w-full h-auto p-2 grid grid-cols-3 gap-2 md:gap-4'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-2 bg-white
         dark:bg-zinc-900 dark:text-white rounded-xl shadow-lg p-3 md:p-4 '>
            <Hammer strokeWidth={1.5} className='text-orange-500 w-11 h-11 md:w-15 md:h-15 bg-orange-100 rounded-xl p-2' />
            <p className='flex flex-col items-center text-xs md:text-[16px] whitespace-nowrap'>Open Issues
                <span className='text-lg md:text-2xl font-bold'>{numberOf.openIssues}</span>
            </p>
        </div> 

        <div className='flex flex-col md:flex-row items-center justify-between gap-2 bg-white 
        rounded-xl shadow-lg dark:bg-zinc-900 dark:text-white p-3 md:p-4'>
            <Clock strokeWidth={1.5} className='text-yellow-500 w-11 h-11 md:w-15 md:h-15 bg-yellow-100 rounded-xl p-2' />
            <p className='flex flex-col items-center flex-wrap justify-center text-xs md:text-[16px]'>In-progress Issues
                <span className='text-lg md:text-2xl font-bold'>{numberOf.inProgressIssues}</span>
            </p>
        </div>

        <div className='flex flex-col md:flex-row items-center justify-between gap-2 bg-white 
        dark:bg-zinc-900 dark:text-white rounded-xl shadow-lg p-3 md:p-4 '>
            <CheckCircle strokeWidth={1.5} className='text-green-500 w-11 h-11 md:w-15 md:h-15 bg-green-100 rounded-xl p-2' />
            <p className='flex flex-col items-center text-xs md:text-[16px] whitespace-nowrap'>Solved Issues
                <span className='text-lg md:text-2xl font-bold'>{numberOf.solvedIssues}</span>
            </p>
        </div>
    </div>
  )
}

export default Stats