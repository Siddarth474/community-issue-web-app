import { NextResponse } from "next/server";
import Vote from "@/models/votesModel";
import { connectDB } from "@/db/dbConfig";
import Issue from "@/models/issueModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import axios from "axios";

export const POST = async (req, {params}) => {
    try {
        await connectDB();
        const {type} = await req.json();
        const {issueId} = await params;

        const issue = await Issue.findById(issueId);
        if(!issue) {
            return NextResponse.json(
                {error: "Issue not found!", success: false},
                {status: 404}
            );
        }

        const userId = await getDataFromToken(req);
        if(!userId) {
            return NextResponse.json(
                { error: "Unauthorized", success: false },
                { status: 401 }
            );
        }
        
        const existingVote = await Vote.findOne({issue: issueId, voteBy: userId});

        if(existingVote) {
            if(existingVote.type === type) {
                const deletedVote = await Vote.findByIdAndDelete(existingVote._id);
                await Issue.findByIdAndUpdate(issueId, 
                    {$pull: {votes: existingVote._id}},
                    {new: true}
                );

                try {
                    await axios.post('http://localhost:3001/api/trigger-event', {
                        event: 'vote-removed',
                        data: deletedVote
                    });
                } catch (error) {
                    console.error('Failed to emit socket event:', error.message);
                }

                return NextResponse.json(
                    {message: 'Vote removed',type: 'remove', success: true},
                    {status: 200}
                );
            }
            else {
                existingVote.type = type;
                await existingVote.save();

                try {
                    await axios.post('http://localhost:3001/api/trigger-event', {
                        event: 'vote-changed',
                        data: existingVote
                    });
                } catch (error) {
                    console.error('Failed to emit socket event:', error.message);
                }

                return NextResponse.json(
                    {message: 'Vote changed',type: 'update', success: true},
                    {status: 200}
                );
            }
        }

        const addVote = await Vote.create({
            issue: issueId,
            voteBy: userId,
            type
        });

        await Issue.findByIdAndUpdate(issueId, 
            {$push: {votes: addVote._id}},
            {new: true}
        );

        try {
            await axios.post('http://localhost:3001/api/trigger-event', {
                event: 'vote-added',
                data: addVote
            });
        } catch (error) {
            console.error('Failed to emit socket event:', error.message);
        }

        return NextResponse.json(
            {message: 'Voted successfully', addVote, success: true, type: 'add'},
            {status: 200}
        );
        

    } catch (error) {
        console.error('Error while voting', error);
        return NextResponse.json(
            { error: error.message, success: false },
            { status: 500 }
        );
    }
}