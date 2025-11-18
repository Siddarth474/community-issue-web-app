"use client"

import { IssueContext } from '@/context/IssueContext';
import { BiSolidDownvote, BiSolidUpvote } from "react-icons/bi";
import React, { useContext, useEffect, useState } from 'react';
import StatusDropdown from './StatusDropdown';
import { status } from '@/helpers/Data';
import { RotateCw } from 'lucide-react';

const Tabs = ({ activeTab, setActiveTab, setFilteredList, setCurrentPage}) => {

  const { allIssuesList} = useContext(IssueContext);
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('');

  const votes = [
    {name: 'upvote', icon: <BiSolidUpvote />},
    {name: 'downvote', icon: <BiSolidDownvote />}
  ]
  

  useEffect(() => {
    let filtered = [...allIssuesList];
    if(filterStatus !== "") {
      filtered = allIssuesList.filter((issue) => issue.Status === filterStatus);
    }

    if(sortBy !== '') {
      filtered = [...filtered].sort((a, b) => 
        b.votes.filter(v => v.type === sortBy).length - 
        a.votes.filter(v => v.type === sortBy).length
      );
    }

    setFilteredList(filtered);
  }, [allIssuesList, filterStatus, sortBy])

  return (
    <div className='my-6 w-full flex flex-col sm:flex-row justify-between gap-2 sm:items-center'>
        <div className='bg-white relative dark:bg-zinc-800 dark:text-white p-2 text-xs sm:text-[16px] rounded-full shadow-lg 
        grid grid-cols-2 gap-3 font-semibold sm:w-max'>
          <button
            onClick={() => { setActiveTab('all'); setCurrentPage(1) }}
            className={`relative z-10 py-2 px-4 transition-colors rounded-full cursor-pointer
              ${activeTab === 'all' ? 'text-white bg-orange-500' : 'text-black dark:text-white'}`}>
            All Issues
          </button>

          <button
            onClick={() => { setActiveTab('mine'); setCurrentPage(1) }}
            className={`relative z-10 py-2 px-4 transition-colors rounded-full cursor-pointer
              ${activeTab !== 'all' ? 'text-white bg-orange-500' : 'text-black dark:text-white'}`}>
            My Issues
          </button>
        </div>
       
        <div className='flex flex-col sm:flex-row gap-2 ml-2'>
          <StatusDropdown 
            value={sortBy}
            onChange={(value) => setSortBy(value.name)}
            list={votes} 
            label={'Sort by Votes'} 
          />
          <div className='flex gap-2 items-center'>
            <StatusDropdown 
              value={filterStatus}
              onChange={(value) => setFilterStatus(value.name)}
              list={status} 
              label={'Filter by Status'}
            /> 
            <button onClick={() => {setFilterStatus(''); setSortBy('')}}
            className='w-10 h-9 rounded-lg text-gray-800 bg-white dark:bg-zinc-900 dark:text-white flex items-center
            justify-center border border-gray-400 cursor-pointer'>
              <RotateCw size={18}/>
            </button>
          </div>
        </div>
    </div>
  )
}

export default Tabs