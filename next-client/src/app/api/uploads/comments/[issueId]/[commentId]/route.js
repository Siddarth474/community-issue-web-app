import { NextResponse } from "next/server";
import Comment from "@/models/commentModel";
import { connectDB } from "@/db/dbConfig";
import Issue from "@/models/issueModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export const DELETE = async (req, {params}) => {
    try {
        await connectDB();
        const {commentId, issueId} = await params;

        if (!commentId || !issueId) {
            return NextResponse.json(
                { error: "Comment ID and Issue ID are required", success: false },
                { status: 400 }
            );
        }
    
        const userId = await getDataFromToken(req);        
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized", success: false },
                { status: 401 }
            );
        }
    
        const deleteComment = await Comment.findOneAndDelete({_id: commentId, user: userId}); 
    
        if(!deleteComment) {
            return NextResponse.json(
                { error: "Not allowed to delete or comment not exist", success: false },
                { status: 403 }
            );
        }

        await Issue.findByIdAndUpdate(issueId, 
            {$pull: {comments: commentId}},
            {new: true}
        ); 
    
        return NextResponse.json(
            {message: "Comment deletd successfully!", success: true},
            {status: 200}
        ); 

    } catch (error) {
        console.error('Error while comment delete', error);
        return NextResponse.json(
            { error: error.message, success: false },
            { status: 500 }
        );
    }
}