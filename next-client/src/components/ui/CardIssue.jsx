"use client";

import React, { useContext, useEffect, useState } from 'react';
import { Edit, Loader2, MapPin, Trash2 } from 'lucide-react';
import { statusIcons, issueIcons } from '@/helpers/Data';
import axios from 'axios';
import { handleFailure, handleSuccess } from '@/lib/notification';
import DeleteConfirmCard from './DeletePopUpCard';
import { IssueContext } from '@/context/IssueContext';
import { BiDownvote, BiSolidDownvote, BiSolidUpvote, BiUpvote } from "react-icons/bi";
import { MdComment } from "react-icons/md";
import { useSocket } from '@/context/SocketProvider';
import CommentBox from './CommentBox';

const CardIssue = ({ issue, activeTab, setShowPopUp }) => {

  const socket = useSocket();
  const { setIssueDetails, allIssuesList, setAllIssuesList, setEditId} = useContext(IssueContext)
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [voteCounts, setVoteCounts] = useState({
    upvote: 0,
    downvote: 0
  });
  const [commentsCount, setCommentsCount] = useState(issue.comments.length);
    
  const statusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-orange-500";
      case "in-progress":
        return "bg-yellow-500";
      case "resolved":
        return "bg-green-500";  
      default:
        return "bg-gray-500";
    }
  }

  const deleteIssues = async (issueId) => {
    try {
      setLoading(true);
      const url =  `/api/uploads/issues/${issueId}`;
      const response = await axios.delete(url);
      const {success, message, data} = response.data;

      if(success) {
        const updatedList = allIssuesList.filter((prev) => prev._id !== data._id);
        setAllIssuesList(updatedList);
        handleSuccess(message);
        setShowDeletePopUp(false);
      }

    } catch (err) {
      if(err.response) {
        console.log('Something went wrong while delete', err.response);
        const data = err.response.data;
        handleFailure(data.error || 'Something went wrong while delete');
      }
      else {
        console.log('Network problem ', err);
        handleFailure(err.message || 'Network Problem');
      }

    }finally{
      setLoading(false);
    }
  }

  const handleEdit = () => {
    setShowPopUp(true); 
    setIssueDetails({
      title: issue.title,
      description: issue.description,
      category: issue.category,
      issue: issue.image,
      imageFile: null,
      Status: issue.Status,
      location: {
        latitude: issue.location?.latitude,
        longitude: issue.location?.longitude,
        address: issue.location?.address,
      }
    });
    setEditId(issue._id);
  }

  const handleVote = async (voteType) => {
    try {
      setLoading(true)
      const response = await axios.post(`/api/uploads/votes/${issue._id}`, {type: voteType});

    } catch (error) {
      if(error.response) {
        console.log('Something went wrong while delete', error.response);
        const data = error.response.data;
        handleFailure(data.error || 'Something went wrong while delete');
      }
      else {
        console.log('Network problem ', error);
        handleFailure(error.message || 'Network Problem');
      }
      
    } finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!socket || !issue?._id) return;

    if (!socket.connected) {
      socket.connect();
    }

    const handleVoteAdded = (data) => {
      if (data.issue === issue._id) {
        setVoteCounts((prev) => ({
          ...prev,
          [data.type]: prev[data.type] + 1,
        }));
      }
    };

    const handleVoteRemoved = (data) => {
      if (data.issue === issue._id) {
        setVoteCounts((prev) => ({
          ...prev,
          [data.type]: Math.max(prev[data.type] - 1, 0),
        }));
      }
    };

    const handleVoteChanged = (data) => {
      if (data.issue === issue._id) {
        setVoteCounts((prev) => ({
          upvote: prev.upvote + (data.type === "upvote" ? 1 : -1),
          downvote: prev.downvote + (data.type === "downvote" ? 1 : -1),
        }));
      }
    };

    socket.on("vote-added", handleVoteAdded);
    socket.on("vote-removed", handleVoteRemoved);
    socket.on("vote-changed", handleVoteChanged);

    return () => {
      socket.off("vote-added", handleVoteAdded);
      socket.off("vote-removed", handleVoteRemoved);
      socket.off("vote-changed", handleVoteChanged);
    };
  }, [issue?._id, socket]);


  const calculateVotes = () => {
    const counts = issue?.votes?.reduce(
      (acc, vote) => {
        if(vote.type === 'upvote') acc.upvote++;
        else acc.downvote++;
        return acc;
      }, {upvote: 0, downvote: 0}
    );

    setVoteCounts(counts);
  }

  useEffect(() => {
    calculateVotes();
  }, [issue?.votes]);

      
  return (
   <div>
    {showDeletePopUp && 
    (<DeleteConfirmCard
    onConfirm={() => deleteIssues(issue._id) }
    onCancel={() => setShowDeletePopUp(false)}
    loading={loading} 
    />)}

    {imageUrl === issue.image && 
    (<>
      <div onClick={() => setImageUrl('')} className='fixed inset-0 bg-black transition opacity-50 z-[9999]'/>
      <img src={issue.image} alt={issue.title} 
        className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[50vw] max-h-[50vh]
        sm:max-w-[40vw] sm:max-h-[40vh] object-contain rounded-xl border border-gray-500
        bg-gray-950 p-px shadow-xl z-[10000]' />
    </>)}

    {showComments && 
    
    <CommentBox
     title={issue.title}
     location={issue.location.address}
     issueId={issue._id}
     onCommentsChange={(newCount) => setCommentsCount(newCount)}
     setShowComments={setShowComments}
    />
    }

     <div className='bg-white dark:bg-zinc-900 p-5 flex flex-col items-start gap-7 relative rounded-xl shadow-lg overflow-hidden
     hover:-translate-y-1 duration-200 hover:shadow-xl'>
        <div className='flex flex-wrap items-start gap-5 w-full'>
            <div className='w-max flex flex-col justify-center gap-3'>
              <img onClick={() => setImageUrl(issue.image)}
              src={issue.image}
              alt={issue.title}
              className="w-32 h-32 sm:w-36 sm:h-36 object-cover border rounded-xl flex-shrink-0"
            />
              <div className='flex  gap-2'>
                <button
                  onClick={() => handleVote('upvote')}
                  className=' bg-gray-200 hover:bg-gray-300 dark:bg-zinc-800 dark:text-white 
                  rounded-full px-3 py-1 transition cursor-pointer shadow active:scale-95'
                >
                  {loading ? <Loader2 size={12} className='animate-spin' /> : 
                  (<span className='flex items-center justify-center gap-1'>
                    {voteCounts.upvote ? <BiSolidUpvote className='w-4 h-4' /> : <BiUpvote />  }
                  <span className='text-sm font-medium'>{voteCounts.upvote}</span>
                  </span>)}
                </button>
                <button
                  onClick={() => handleVote('downvote')}
                  className=' bg-gray-200 hover:bg-gray-300 dark:bg-zinc-800 dark:text-white
                  rounded-full px-3 py-1 transition cursor-pointer shadow active:scale-95'
                >
                  {loading ? <Loader2 size={12} className='animate-spin' /> : 
                  (<span className='flex items-center justify-center gap-1'>
                    {voteCounts.downvote ? <BiSolidDownvote className='w-4 h-4' /> : <BiDownvote />  }
                  <span className='text-sm font-medium'>{voteCounts.downvote}</span>
                  </span>)}
                </button>
              </div>
            </div>
            
            <div className='flex flex-col gap-1 flex-1 min-w-0'>
              <h1 className='text-xl sm:text-2xl font-bold text-gray-700 dark:text-white capitalize'>
                  {issue.title}
              </h1>
              <div className='flex flex-col lg:items-center lg:flex-row gap-1 text-gray-600 dark:text-white text-sm'>
                  <span className='flex gap-1 capitalize items-center'>
                    <MapPin size={15} className='text-blue-500' />
                    {issue.location.address}
                  </span>
                  <p className='flex text-xs gap-1'>
                    (<span>{(issue.location.latitude).toFixed(3)}</span>,
                    <span>{(issue.location.longitude).toFixed(3)}</span>)
                  </p>
              </div>
              <p className='text-sm flex items-center text-gray-700 dark:text-white mt-1'>
                {issueIcons[issue.category]}
                <span>{issue.category}</span>
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-100 break-words italic whitespace-normal mt-3 overflow-hidden'>
                  "{issue.description}"
              </p>
            </div>
            
        </div>

        <div className='flex justify-between w-full items-center gap-2 border-t pt-3'>
          <div className='flex flex-col gap-1 text-gray-600 dark:text-white'>
            <p className='text-sm '>
              <span className='font-semibold mr-1'>Reported on: </span>
              {issue.createdAt.split('T')[0]}
            </p>
            {issue.createdAt !== issue.updatedAt && (
              <p className='text-xs italic'>
                Last updated: {issue.updatedAt.split('T')[0]}
              </p>
            )}
            <p className='text-sm text-black dark:text-white'>
              <span className='font-semibold mr-1 '>Posted by: </span>
              {issue.reporter.username}
            </p>
          </div>
          <div className='flex flex-col sm:flex-row items-center gap-3 sm:gap-5'>
            <button 
              onClick={() => setShowComments(true)}
              className='text-orange-500 text-sm flex gap-1 items-center py-1 px-2 rounded cursor-pointer'>
                <MdComment size={21} />
                  ({commentsCount || 0})
            </button>
            {activeTab !== 'all' && (
              <div className='flex items-center gap-3'>
                <Edit onClick={handleEdit} className='w-5 h-5 text-blue-500 cursor-pointer' />
                <Trash2 onClick={() => setShowDeletePopUp(true)} className='w-5 h-5 text-red-500 cursor-pointer' />
              </div>
            )}
          </div>
        </div>
        
        <p
            className={`absolute top-0 right-0 w-8 h-8 p-2 ${statusColor(
            issue.Status
            )} rounded-tr-xl rounded-bl-xl text-white flex items-center justify-center`}
        >
            {statusIcons[issue.Status]}
        </p>
    </div>
   </div>
  )
}

export default CardIssue