import Issue from '@/models/issueModel';
import { connectDB } from '@/db/dbConfig';
import { NextResponse } from 'next/server';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import Vote from '@/models/votesModel';
import Comment from '@/models/commentModel';
import cloudinary from '@/lib/cloudinary';
import axios from 'axios';

export const DELETE = async (req, {params}) => {
    try {
        await connectDB();
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
    
        if(issue.reporter.toString() !== userId.toString()) {
            return NextResponse.json(
                { error: "You can delete only your own issue", success: false },
                { status: 403 }
          );
        }

        if(issue.comments) {
            await Comment.deleteMany({issue: issueId });
        }
        if(issue.votes) {
            await Vote.deleteMany({issue: issueId });
        }

        await cloudinary.uploader.destroy(issue.imagePublicId);
        const deletedIssue = await Issue.findByIdAndDelete(issueId);

        try {
            await axios.post('http://localhost:3001/api/trigger-event', {
                data: deletedIssue,
                event: 'delete-issue'
            });

        } catch (error) {
            console.error('Failed to emit socket event:', error.message);
        }

        return NextResponse.json(
            { message: "Issue deleted successfully!", success: true, data: deletedIssue },
            { status: 200 }
        );

    } catch (error) {
        console.error("Issue delete error:", error);
        return NextResponse.json(
            { error: "Failed to delete issue", details: error.message, success: false },
            { status: 500 }
        );
    }
}

const parseAndValidateLocation = (rawLocation) => {
    try {
        const location = JSON.parse(rawLocation);
        if (typeof location.latitude !== "number" || 
            typeof location.longitude !== "number" ||
            !location.address || typeof location.address !== "string"
        ) return null;
        return location;

    } catch (error) {
        return null;
    }
}

export const PATCH = async (req, {params}) => {
    try {
        await connectDB();
        const {issueId} = await params;
        
        const userId = await getDataFromToken(req);
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized", success: false },
                { status: 401 }
            );
        }

        const issue = await Issue.findById(issueId);
        if (!issue) {
            return NextResponse.json(
                { error: "Issue not found", success: false },
                { status: 404 }
            );
        }

        if(issue.reporter.toString() !== userId.toString()) {
            return NextResponse.json(
                { error: "You can only edit your own issue", success: false },
                { status: 403 }
            );
        }
        
        const formData = await req.formData();
        const fields = ['title', 'category', 'Status', 'description'];
        const data = Object.fromEntries(fields.map((key) => [key, formData.get(key)]));

        const imageFile = formData.get("myImage");
        const location = formData.get('location');

        const {title, category, Status, description} = data;

        const updatedData = {};
        if(title) updatedData.title = title;
        if(category) updatedData.category = category;
        if(Status) updatedData.Status = Status;
        if(description) updatedData.description = description;

        if(location) {
            const parsedlocation = parseAndValidateLocation(location);
           
            if(!parsedlocation) {
                return NextResponse.json(
                    { error: "Location must be valid with latitude,longitude and address", success: false },
                    { status: 400 }
                );
            }
            updatedData.location = parsedlocation;
        }
        
        if(imageFile && imageFile.size > 0) {
            if(issue.imagePublicId) {
                await cloudinary.uploader.destroy(issue.imagePublicId);
            }

            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
    
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'issue-uploads',
                        public_id: `${issueId}-${Date.now()}`,
                        overwrite: true,
                        invalidate: true
                    },
                    (error, result) => {
                        if(error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(buffer);
            });

            updatedData.image = uploadResult.secure_url;
            updatedData.imagePublicId = uploadResult.public_id;
        }

        const updatedIssue = await Issue.findByIdAndUpdate(
            issueId,
            {$set: updatedData},
            {new: true}
        );

        try {
            await axios.post('http://localhost:3001/api/trigger-event', {
                data: updatedIssue,
                event: 'update-issue'
            });
            
        } catch (error) {
            console.error('Failed to emit socket event:', error.message);
        }

        return NextResponse.json({
            message: "Issue updated successfully",
            issue: updatedIssue,
            success: true,
        });
        
    } catch (error) {
        console.error("Issue update error:", error);
        return NextResponse.json(
            { error: "Failed to update issue", details: error.message, success: false },
            { status: 500 }
        );
    }
}