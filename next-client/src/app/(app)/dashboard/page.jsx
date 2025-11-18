"use client";

import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useSocket } from '@/context/SocketProvider';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Stats from '@/components/ui/Stats';
import Tabs from '@/components/ui/Tabs';
import { handleFailure, handleSuccess } from '@/lib/notification';
import CardIssue from '@/components/ui/CardIssue';
import { Loader2 } from 'lucide-react';
import { IssueContext } from '@/context/IssueContext';
import IssueForm from '@/components/ui/IssueForm';
import EmptyIssuesPlaceholder from '@/components/ui/EmptyIssuePlaceholder';
import { PaginationButtons } from '@/components/ui/PaginationButtons';


const DashBoard = () => {
  const {allIssuesList, setAllIssuesList} = useContext(IssueContext);
  const socket = useSocket();

  const [loading, setLoading] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [filteredList, setFilteredList] = useState(allIssuesList);

  const [activeTab, setActiveTab] = useState("all"); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPages] = useState(1);

  const getAllIssuesList = async () => {
    try {
      setLoading(true);
      const url = `/api/uploads/issues?page=${currentPage}&limit=7`;
      const response = await axios.get(url);

      const {issues, pagination} = response.data;
    
      const { totalPages } = pagination;
      setAllIssuesList(issues);
      setTotalPages(totalPages);

    } catch (error) {
      if(error.response) {
        setLoading(false);
        const data = error.response.data;
        handleFailure(data.error);
      }
      else {
        handleFailure("Network error something went wrong" || error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const getMyIssuesList = async () => {
    try {
      setLoading(true);
      const url = `/api/uploads/issues?mine=true&page=${currentPage}&limit=7`;
      const response = await axios.get(url);

      const {issues, pagination} = response.data;
      const {totalPages} = pagination;
      setAllIssuesList(issues);
      setTotalPages(totalPages);

    } catch (error) {
      if(error.response) {
        const data = error.response.data;
        handleFailure(data.error);
      }
      else {
        handleFailure("Network error something went wrong" || error.message);
      }
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    activeTab === 'all' ? getAllIssuesList() : getMyIssuesList();
  }, [currentPage, activeTab]);


  useEffect(() => {
    if (!socket) return;

    socket.on("new-issue", (issue) => {
        console.log("🆕 New issue received");
        setAllIssuesList((prev) => [...prev, issue]);
        setTimeout(() => handleSuccess('New Issue Reported'), 100);
    });

    return () => {
        socket.off("new-issue");
    };
  }, [socket]);

  useEffect(() => {
    if(!socket) return;

    socket.on("delete-issue", (issue) => {
      console.log("Issue deleted");
      setAllIssuesList((prev) => 
        prev.filter((i) => i._id !== issue._id)
      );
    });

    return () => {
      socket.off("delete-issue");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("update-issue", (issue) => {
        console.log("Issue Updated", issue);
        setAllIssuesList((prev) => 
          prev.map((i) => i._id === issue._id ? {...i, ...issue} : i)
        );
    });

    return () => {
        socket.off("update-issue");
    };
  }, [socket]);

  return (
    <div className='w-full flex flex-col relative h-[89vh] md:h-screen bg-gray-200 dark:bg-black dark:text-gray-700 overflow-auto'>
        <div className='shrink-0'><Header /></div>
        {showPopUp && <IssueForm setShowPopUp={setShowPopUp} />}
        <div className='w-full h-full flex justify-center'>
            <div className='w-full md:w-[90%] my-5 px-3 py-3'>
              <Stats />
              <Tabs 
              activeTab ={activeTab}
              setActiveTab={setActiveTab}
              setCurrentPage={setCurrentPage}
              setFilteredList={setFilteredList}
              />

              {loading && (
                <div className='w-full flex flex-col justify-center items-center gap-2'>
                  <Loader2 strokeWidth={2.2} className='w-12 h-12 animate-spin text-blue-600' />
                  <p className='text-gray-600 font-semibold'>Loading Issues</p>
                </div>
              )}

              {!loading && (<div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5 '>
                {filteredList.map((issue, ind) => (
                  <CardIssue
                  key={ind} 
                  issue={issue} 
                  activeTab={activeTab}
                  setShowPopUp={setShowPopUp}
                  
                  />
                ))}
              </div>)}
              {!loading && !filteredList.length && <EmptyIssuesPlaceholder />}
              
              {!loading && filteredList.length > 0 && <PaginationButtons 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage}
                totalPages={totalPage} 
              />}
              
            </div>
        </div>
        <div className='shrink-0'>
          <Footer />
        </div>
    </div>
  )
}

export default DashBoard