"use client"

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import IssueForm from '@/components/ui/IssueForm';
import MapView from '@/components/ui/MapView';
import { IssueContext } from '@/context/IssueContext';
import { useSocket } from '@/context/SocketProvider';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useContext, useEffect, useMemo, useState } from 'react';

const page = () => {

  const socket = useSocket();
  const [showPopUp, setShowPopUp] = useState(false);
  const {setIssueDetails , setAllIssuesList, allIssuesList} = useContext(IssueContext);
  const [mapLoading, setMapLoading] = useState(false);

  const issuesMemo = useMemo(() => allIssuesList, [allIssuesList]);

  const getIssuesList = async () => {
      try {
        setMapLoading(true);
        const url = `/api/uploads/issues`;
        const response = await axios.get(url);
  
        const {issues} = response.data;
        setAllIssuesList(issues);

      } catch (error) {
        if(error.response) {
          console.log('Error on frontend while get issues', error.response);
        }
        else {
          console.log('Error in issue get', error.message); 
        }
      }finally{
        setMapLoading(false);
      }
    }
    
  useEffect(() => {
    getIssuesList();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("new-issue", (issue) => {
        console.log("🆕 New issue received", issue);
        setAllIssuesList((prev) => [...prev, issue]);
    });

    return () => {
        socket.off("new-issue");
    };
  }, [socket]);
  
  return (
    <div className='w-full relative h-[calc(100vh-70px)] bg-gray-200 dark:bg-zinc-950'>
        <Header />
        <div className="p-2 relative h-full w-full sm:px-5 sm:py-3 my-3">
          {!mapLoading && (<div className='relative h-full w-full'>
            <MapView 
            onLocationSelect={(lat, lng) => {
              setIssueDetails(prev => ({
                ...prev,
                location: {
                  ...prev.location,
                  latitude: lat,
                  longitude: lng
                }
              }));
            }}
            issues={issuesMemo}
            /> 
            <button onClick={() => setShowPopUp(true)}
            className='absolute bg-transparent text-white bg-gradient-to-r from-orange-500 to-orange-700
            shadow-lg hover:from-orange-600 hover:to-orange-800 text-[26px] sm:text-3xl font-semibold py-3 px-6 rounded-full
            bottom-[calc(6rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-[9990] cursor-pointer'>
               Report 
            </button>
          </div>)}
        </div>

        {mapLoading && (
          <div className='flex items-center gap-2 justify-center w-full'>
            <Loader2 size={50} strokeWidth={2.2} className='animate-spin text-blue-600 ' />
            <p className='text-gray-600 text-lg'>Loading Map</p>
          </div>
        )}

        {showPopUp && <IssueForm showPopUp={showPopUp} setShowPopUp={setShowPopUp} />}
        <Footer />
    </div>
  )
}

export default page