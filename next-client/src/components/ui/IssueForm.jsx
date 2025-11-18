"use client"

import React, { useContext, useEffect, useState } from 'react';
import StatusDropdown from './StatusDropdown';
import { Camera, CirclePlus, CircleX, Loader2, LoaderCircle } from 'lucide-react';
import { RiGeminiFill } from "react-icons/ri";
import FormStepper from './FormStepper';
import { commonIssues, status } from '@/helpers/Data';
import { handleFailure, handleSuccess } from '@/lib/notification';
import axios from 'axios';
import { motion } from 'framer-motion';
import { IssueContext } from '@/context/IssueContext';
import getAISuggestions from '@/lib/gemini';

const IssueForm = ({ setShowPopUp }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const {issueDetails, setIssueDetails, editId, setEditId, setAllIssuesList} = useContext(IssueContext);   

    const handleLocation = (e) => {
        const {name, value} = e.target;
        setIssueDetails((prev) => ({
            ...prev,
            location: {
                ...prev.location, [name]: value
            },
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {title, description, Status, category, imageFile} = issueDetails;
        try {
            setLoading(true);
            const data = {
                title,
                category,
                description,
                Status,
            };
            const formData = new FormData();

            for(const i in data) {
                formData.append(i, data[i]);
            }

            formData.append('location', JSON.stringify({
                latitude: parseFloat(issueDetails.location.latitude),
                longitude: parseFloat(issueDetails.location.longitude),
                address: issueDetails.location.address,
            }));

            if(imageFile) formData.append("myImage", imageFile);
            
            let response;
            if(editId) {
                response = await axios.patch(`/api/uploads/issues/${editId}`, formData, {
                    headers: {'Content-Type': 'multipart/form-data'}
                });
                
                setAllIssuesList((prev) => 
                    prev.map((I) => I._id === editId ? {...I, ...response.data.issue} : I)
                );
            }
            else {
                response = await axios.post('/api/uploads/issues', formData, {
                    headers: {'Content-Type': 'multipart/form-data'}
                });
            }

            const {message, success, issue} = response.data;
             
            if(success) {
                handleSuccess(message);
                setShowPopUp(false);   
                setIssueDetails({
                    title: '',
                    category: '',
                    image: null,
                    image: null,
                    description: '',
                    Status: '',
                    location: {
                        latitude: '',
                        longitude: '',
                        address: '',
                    }
                }); 
                setLoading(false);
                setEditId('');
            }

        } catch (error) {
            setLoading(false);
            if(error.response) {
                console.log('Error in issue submit', error.response);
                const data = error.response.data;
                handleFailure(data.error || 'Error in issue submit');
            }
            else {
                console.log('Error in issue submit', error.message);
                handleFailure("Network error something went wrong" || error.message);
            }            
        }
    }

    const getAIHelp = async (topic) => {
        try {
            setLoading(true);
            const response = await axios.post('/api/summarize', {topic});
            console.log('AI RESPONSE: ', response.data);
            const {summary} = response.data;
            setIssueDetails({...issueDetails, description: summary});
        } catch (error) {
           if(error.response) {
                console.log("Failed to generate text:", error.message);
                const data = error.response.data;
                handleFailure(data.error || 'Error in model');
            }
            else {
                console.log('Error in issue submit', error.message);
                handleFailure("Network error something went wrong" || error.message);
            }   
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        return () => URL.revokeObjectURL(issueDetails.image);
    }, [issueDetails.image]);
    
  return (
    <>
        <div className='w-full h-full fixed bg-black/50 backdrop-blur-xs top-0 left-1/2 transform
        -translate-x-1/2 z-[9999]' />

        <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
            duration: 0.4,
            scale: { type: "spring", visualDuration: 0.3, bounce: 0.4 },
        }}
        className='bg-white dark:bg-zinc-900 dark:text-white max-w-[400px] w-[95%] sm:w-full h-auto rounded-xl absolute shadow-lg
        top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999]'>
            <section className='border-b border-gray-300 relative mb-5 p-5'>
                <h1 className='text-3xl font-bold text-orange-500 text-left'>📍Report</h1>
                <CircleX size={20} onClick={() => {
                    setShowPopUp(false);
                    setIssueDetails({
                        title: '',
                        category: '',
                        image: null,
                        imageFile: null,
                        description: '',
                        Status: '',
                        location: {
                            latitude: '',
                            longitude: '',
                            address: '',
                        }
                    });
                    setEditId(''); 
                }}
                className='absolute top-4 right-5 text-gray-500 cursor-pointer hover:text-orange-500'/>
            </section>

                <form onSubmit={handleSubmit} className='px-5'>
                    {step === 1 && (<div>
                        <div className='flex flex-col mb-3'>
                            <label htmlFor='title' className='font-semibold mb-1'>Title</label>
                            <input 
                            onChange={(e) => setIssueDetails({...issueDetails, title: e.target.value})}
                            id='title'
                            name='title'
                            autoFocus 
                            autoComplete='true'
                            value={issueDetails.title}
                            type='text' 
                            placeholder='Enter issue name' 
                            className='outline p-2 rounded-lg focus:ring-2 focus:outline-0 focus:ring-orange-500' />
                        </div>
                        <div className=' mb-3'>
                            <p 
                            className='font-semibold mb-2'>Category</p>
                            <StatusDropdown value={issueDetails.category}
                            onChange={(value) => setIssueDetails((prev) => ({
                                ...prev,
                                category: value.name
                            }))}
                            list={commonIssues} 
                            label={'Select Category'} />
                        </div>
                    </div>)}

                    {step === 2 && (<div className='mb-3'>
                        <label className='font-semibold'>Upload Image
                            <span className='text-red-500 ml-2'>(* Required)</span>
                        </label>
                        <div className="flex flex-col items-center mt-3">
                            <input
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if(file) {
                                    setIssueDetails({
                                        ...issueDetails,
                                        image: URL.createObjectURL(file),
                                        imageFile: file
                                    })
                                }
                            }}
                            id="imageUpload"
                            name='imageUpload'
                            type="file"
                            accept="image/*"
                            className="hidden"
                            
                            />
                            <label
                                htmlFor="imageUpload"
                                className={`max-w-[350px] flex items-center justify-center w-full h-40 
                                    ${issueDetails.image ? 'border-2' : 'border-2 border-dashed border-orange-500'}  
                                    rounded-xl text-gray-500 cursor-pointer hover:bg-orange-50 dark:hover:bg-zinc-800 transition`}
                            >
                                {!issueDetails.image && (<p className='flex flex-col justify-center items-center'>
                                    <Camera size={50} strokeWidth={1.3} className="mb-2 text-orange-400" />
                                    <span className="flex items-center gap-1 text-sm">
                                        <CirclePlus size={16} /> Click to add
                                    </span>
                                </p>)}
                                {issueDetails.image && 
                                (<img src={issueDetails.image} className='max-w-[350px] w-full h-40 rounded-xl object-contain' />)}
                            </label>
                        </div>
                    </div>)}

                    {step === 3 && (<div>
                        <div className='flex flex-col mb-3 relative'>
                            <label htmlFor='description' className='font-semibold mb-1'>Description</label>
                            <button onClick={() => getAIHelp(issueDetails.title)}
                            disabled={loading}
                            className="absolute -top-1 flex gap-1 text-sm rounded-full right-0 group w-max px-2 py-1">
                                <RiGeminiFill
                                    size={20}
                                    className={`text-blue-500 cursor-pointer ${loading ? 'animate-pulse' : ''}`}
                                />
                                Help
                                <span
                                    className="
                                    absolute right-0 top-6
                                    opacity-0 group-hover:opacity-100 
                                    transition-all duration-200
                                    bg-zinc-800 text-white text-xs
                                    px-2 py-1 rounded-md
                                    whitespace-nowrap
                                    z-20
                                    ">
                                    AI Help
                                </span>
                            </button>
                            {loading ? 
                            <div className='w-full text-center'>
                                <p className='w-full mt-2 flex justify-center items-center'>
                                    <Loader2 strokeWidth={2} size={25} className='animate-spin text-blue-600' /> 
                                </p>
                            </div> : 
                            (<textarea 
                            onChange={(e) => setIssueDetails({...issueDetails, description: e.target.value})}
                            id='description'
                            name='description'
                            value={issueDetails.description}
                            type='text' 
                            autoFocus
                            placeholder='Describe issue...' 
                            className='outline p-2 rounded-lg focus:ring-2 focus:outline-0 focus:ring-orange-500' />)}
                        </div>

                        <div className='mb-3'>
                            <p className='font-semibold mb-1'>Status: </p>
                            <StatusDropdown value={issueDetails.Status}
                            onChange={(value) => setIssueDetails((prev) => ({
                                ...prev,
                                Status: value.name
                            }))}
                            list={status} 
                            label={' Select Status'} />
                        </div>
                    </div>)}

                    {step === 4 && (<div> 
                        <div className='grid grid-cols-2 gap-2 mb-3'>
                            <div className='flex flex-col'>
                                <label htmlFor='latitude' className='font-semibold mb-1'>Lat</label>
                                <input
                                onChange={handleLocation}
                                value={issueDetails.location.latitude}
                                id='latitude'
                                name='latitude'                               
                                type='number' 
                                step="any"
                                autoFocus
                                placeholder='Enter latitude...' 
                                className='outline p-2 rounded-lg focus:ring-2 focus:outline-0 focus:ring-orange-500' />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor='longitude' className='font-semibold mb-1'>Lng</label>
                                <input 
                                onChange={handleLocation}
                                value={issueDetails.location.longitude}
                                id='longitude'
                                name='longitude'                
                                type='number' 
                                step="any"
                                placeholder='Enter longitude...' 
                                className='outline p-2 rounded-lg focus:ring-2 focus:outline-0 focus:ring-orange-500' />
                            </div>
                            <p className='text-xs text-orange-500 col-span-2'>* Place the marker on the map & get the Lat, Lng automatically.</p>
                        </div>

                        <div className='flex flex-col mb-5'>
                            <label htmlFor='address' className='font-semibold mb-1'>Address 
                                <span className='text-red-500 ml-1'> (*Required)</span>
                            </label>
                            <input 
                            onChange={handleLocation}
                            value={issueDetails.location.address}
                            id='address'
                            name='address'
                            type='text' 
                            placeholder='Describe issue...' 
                            className='outline p-2 rounded-lg focus:ring-2 focus:outline-0 focus:ring-orange-500' />
                        </div>
                        
                        <button 
                        type='submit'
                        className='flex justify-center py-3 px-5 rounded-full w-full text-white font-semibold 
                        bg-orange-500 hover:bg-orange-600 cursor-pointer'>
                            {loading ? <LoaderCircle size={20} className=" animate-spin text-white" />
                             : editId ? 'Update Details' : 'Submit'}
                        </button>
                    </div> )}

                    <FormStepper setStep={setStep} step={step} />
                </form>
        </motion.div>
    </>
  )
}

export default IssueForm;