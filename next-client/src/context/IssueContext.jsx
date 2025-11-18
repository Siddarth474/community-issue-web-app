"use client"
import { createContext, useState } from "react";

export const IssueContext = createContext();

const IssueContextProvider = (props) => {
    

    const [allIssuesList, setAllIssuesList] = useState([]);
    const [issueDetails, setIssueDetails] = useState({
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
    const [editId, setEditId] = useState("");

    const contextValue = {
        issueDetails, setIssueDetails,
        allIssuesList, setAllIssuesList,
        editId, setEditId
    }

    return (
        <IssueContext.Provider value={contextValue}>
            {props.children}
        </IssueContext.Provider>
    )
}


export default IssueContextProvider;