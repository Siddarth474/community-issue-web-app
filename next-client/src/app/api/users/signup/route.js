import { NextResponse } from "next/server";
import { connectDB } from "@/db/dbConfig";
import User from "@/models/userModel";

export const POST = async (request) => {
    try {
        await connectDB();
        const {username, email, password} = await request.json();
    
        if(!username || !email || !password) {
            return NextResponse.json({error: 'All fields are required', success: false}, {status: 400});
        }
    
        const existingVerifiedUser = await User.findOne({
            username,
            isVerified: true
        });

        if(existingVerifiedUser) {
            return NextResponse.json(
                {error: 'User already exist with this username', success: false}, 
                {status: 400}
            );
        }

        const existingVerifiedEmail = await User.findOne({email});

        if(existingVerifiedEmail) {
            if(existingVerifiedEmail.isVerified) {
                return NextResponse.json({
                    error: 'User already exist with this email', success: false
                }, {status: 400});
            }
            else {
                existingVerifiedEmail.password = password;
                existingVerifiedEmail.username = username;
                await existingVerifiedEmail.save();
            }
        }
        else {
            const newUser = new User({
                username,
                email,
                password,
                isVerified: true
            });
        
            await newUser.save();
        }
    
        return NextResponse.json({
            message: 'User signed up successfully!',
            success: true,
        }, {status: 201});
        
    } catch (error) {
        console.error('Something went wrong while signup: ', error);
        return NextResponse.json({error: error.message, success: false}, {status: 500});
    }
}

