import Issue from '@/models/issueModel';
import { connectDB } from '@/db/dbConfig';
import { NextResponse } from 'next/server';

export const GET = async (req) => {
    try {
        await connectDB();

        const {searchParams} = new URL(req.url);
        const type = searchParams.get('type');

        if(!type || !['upvote', 'downvote'].includes(type)) {
            return NextResponse.json(
                { error: "Invalid or missing 'type' parameter", success: false },
                { status: 400 }
            );
        }
        const issues = await Issue.aggregate([
            {
                $lookup:{
                    from: 'votes',
                    localField: 'votes',
                    foreignField: '_id',
                    as: 'voteDetails'
                }
            },
            {
                $addFields: {
                    voteCount: {
                        $size: {
                            $filter: {
                                input: '$voteDetails',
                                as: 'v',
                                cond: {$eq: ['$$v.type', type]}
                            }
                        }
                    }
                }
            },
            {
                $sort: { voteCount: -1}
            }
        ]);

        return NextResponse.json(
            {message: 'Sorted', issues, success: true},
            {status: 200}
        );

    } catch (error) {
        console.error("Error in getting issues", error);
        return NextResponse.json(
            { error: "Failed to fetch issue", details: error.message, success: false },
            { status: 500 }
        );
    }
}

