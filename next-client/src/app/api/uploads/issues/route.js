import Issue from '@/models/issueModel';
import Vote from '@/models/votesModel';
import Comment from '@/models/commentModel';
import { connectDB } from '@/db/dbConfig';
import { NextResponse } from 'next/server';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import User from '@/models/userModel';
import cloudinary from '@/lib/cloudinary';
import axios from 'axios';


const parseAndValidateLocation = (rawLocation) => {
    try {
        const location = typeof rawLocation === 'string' ? JSON.parse(rawLocation) : rawLocation;
        
        if (typeof location.latitude !== "number" || 
            typeof location.longitude !== "number" || 
            !location.address || typeof location.address !== "string"
        ) return null;
        
        return location;

    } catch (error) {
        console.error('Parse Error: ', error);
        return null;
    }
}

export const POST = async (req) => { 
    try {
        await connectDB();

        const formData = await req.formData();
        const fields = ['title', 'category', 'Status', 'description'];
        const data = Object.fromEntries(fields.map((key) => [key, formData.get(key)]));

        const imageFile = formData.get('myImage');
        const rawLocation = formData.get('location');
        
        const {title, category, Status, description} = data;

        if([title, category, Status, description, rawLocation, imageFile].some((field) => !field)) {
            return NextResponse.json(
                { error: "All fields are required", success: false },
                { status: 400 }
            ); 
        }

        const location = parseAndValidateLocation(rawLocation);

        if(!location) {
            return NextResponse.json(
                { error: "Location must be valid with latitude, longitude & address", success: false },
                { status: 400 }
            ); 
        }

        const userId = await getDataFromToken(req);
        const user = await User.findById(userId).select("-password");
        if(!user) {
            return NextResponse.json(
                { error: "User not found!", success: false },
                { status: 404 }
            ); 
        }

        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {folder: 'issue-uploads'},
                (error, result) => {
                    if(error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(buffer);
        });
        
        const newIssue = await Issue.create({
            title,
            category,
            description,
            Status,
            location,
            image: uploadResult.secure_url,
            imagePublicId: uploadResult.public_id,
            reporter: userId.toString()
        });

        try {
            await axios.post('http://localhost:3001/api/trigger-event', {
                event: 'new-issue',
                data: newIssue
            });
        } catch (error) {
            console.error('Failed to emit socket event:', error.message);
        }

        return NextResponse.json(
            { message: "Issue posted successfully", issue:newIssue, success: true },
            { status: 201 } 
        );

    } catch (error) {
        console.error("Issue upload error:", error);
        return NextResponse.json(
            { error: "Failed to create issue", details: error.message, success: false },
            { status: 500 }
        );
    }
}

export const GET = async (req) => {
    try {
        await connectDB();

        const {searchParams} = new URL(req.url);
        const mine = searchParams.get('mine') === 'true';
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;

        const query = {};
        const skip = (page - 1) * limit;

        if(mine) {
            const userId = await getDataFromToken(req);
            if(!userId) {
                return NextResponse.json(
                    { error: "Unauthorized", success: false },
                    { status: 401 }
                );
            }     
            query.reporter = userId;                 
        }
    
        const issues = await Issue.find(query)
                    .sort({ updatedAt: -1 })
                    .populate('votes')
                    .populate('reporter', 'username')
                    .skip(skip).limit(limit);     

        const totalCounts = await Issue.countDocuments(query);
        const hasMore = totalCounts > page * limit;

        return NextResponse.json(
            { 
                success: true,
                message: "Issue fetched successfully!", 
                issues,
                pagination: {
                    page,
                    limit,
                    totalCounts,
                    totalPages: Math.ceil(totalCounts / limit),
                    hasMore,
                },
            },
            { status: 200 }
        );
         
    } catch (error) {
        console.error("Error in getting issues", error);
        return NextResponse.json(
            { error: "Failed to fetch issue", details: error.message, success: false },
            { status: 500 }
        );
    }
} 






