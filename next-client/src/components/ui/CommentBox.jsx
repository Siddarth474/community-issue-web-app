import React, { useEffect, useState } from 'react';
import { Loader2, SendHorizonal, UserCircle2Icon, X } from 'lucide-react';
import { IoTrashBin } from "react-icons/io5";
import { motion } from 'framer-motion';
import axios from 'axios';
import { handleFailure, handleSuccess } from '@/lib/notification';
import { useSession } from 'next-auth/react';

const CommentBox = ({ title, location, setShowComments, issueId, onCommentsChange }) => {
  const {data: session} = useSession();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false); 
  const [postingComment, setPostingComment] = useState(false); 

  const postComments = async () => {
    try {
      setPostingComment(true);
      const response = await axios.post(`api/uploads/comments/${issueId}`, {content: newComment});
      const {message, comment} = response.data;
      handleSuccess(message);
      setComments(prev => {
        const updated = [...prev, comment];
        onCommentsChange(updated.length);
        return updated;
      });
      setNewComment('');

    } catch (error) {
      if(error.response) {
        console.log('Something went wrong while posting', error.response);
        const data = error.response.data;
        handleFailure(data.error || 'Something went wrong while posting');
      }
      else {
        console.log('Network problem ', error);
        handleFailure(error.message || 'Network Problem');
      }
      
    } finally{
      setPostingComment(false);
    }
  }
  
  const deleteComment = async (commentId) => {
    try {
      setLoadingComments(true);
      const response = await axios.delete(`/api/uploads/comments/${issueId}/${commentId}`);
      const {message} = response.data;
      handleSuccess(message);
      setComments(prev => {
        const updated = prev.filter(c => c._id !== commentId.toString());
        onCommentsChange(updated.length);
        return updated;
      });
      

    } catch (error) {
      if(error.response) {
        console.log('Something went wrong while deleting', error.response);
        const data = error.response.data;
        handleFailure(data.error || 'Something went wrong while delete');
      }
      else {
        console.log('Network problem ', error);
        handleFailure(error.message || 'Network Problem');
      }
    } finally{
      setLoadingComments(false);
    }
  }

  
  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true)
      const response = await axios.get(`/api/uploads/comments/${issueId}`);
      const {comments} = response.data;
      setComments(comments);
      onCommentsChange(comments.length)
      setLoadingComments(false);
    };
    fetchComments();
  }, [])


  return (
    <>
    <div className='fixed top-0 left-0 w-full h-full bg-black/40 z-999 backdrop-blur-xs' />
    <motion.div 
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      duration: 0.4,
      scale: { type: "spring", visualDuration: 0.3, bounce: 0.4 }
    }}
    className="w-[95%] sm:w-full max-w-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-9990 bg-gray-100 dark:bg-zinc-900 
   text-black dark:text-white rounded-xl shadow-xl p-6 mx-auto">
      <header className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-zinc-500">{location}</p>
          
        </div>
        <button onClick={() => setShowComments(false)}
        className="text-zinc-500 hover:text-orange-500 transition-colors">
          <X size={24} />
        </button>
      </header>
      
      <div className="border-t border-zinc-700 pt-4">
        
        <h3 className="text-xl font-semibold ">Comments</h3>

        <div className="space-y-4 my-5 max-h-55 overflow-y-auto pr-2">
          {loadingComments && (
            <div className="space-y-4 w-full">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-start space-x-3 animate-pulse"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-800"></div>

                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-28 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                    <div className="h-3 w-full bg-gray-200 dark:bg-zinc-800 rounded"></div>
                    <div className="h-3 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {comments.map((comment) => (
            <div key={comment._id} className="bg-white dark:bg-zinc-800 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold flex gap-2 items-center text-black dark:text-white">
                  <UserCircle2Icon size={18} />
                  {comment.user.username}
                </span>
                <span className="text-xs text-zinc-600 dark:text-gray-100">{comment.createdAt.split('T')[0]}</span>
              </div>
              <p className="text-zinc-600 dark:text-gray-100 text-sm">"{comment.content}"</p>
              {comment.user._id === session?.user?.id && 
              <div className='flex justify-end mt-2'>
                <IoTrashBin onClick={() => deleteComment(comment._id)} size={19} className='text-red-500' />
              </div>}
            </div>
          ))}
          {!loadingComments && comments.length < 1 && 
        <p className='text-zinc-900 dark:text-gray-50 text-2xl text-center italic'>No Comments</p>}
        </div>
        
        <div className="space-y-4">
          <textarea
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full bg-gray-200 dark:bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm placeholder-zinc-500 
            focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            placeholder="Add a comment..."
          />
          <div className="flex justify-end">
            <button 
              onClick={postComments}
              disabled={postingComment}
              className="bg-orange-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-orange-700 transition-colors 
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer"
            >
              {postingComment ? <Loader2 className='animate-spin' /> : <SendHorizonal />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
    </>
  );
};

export default CommentBox;
