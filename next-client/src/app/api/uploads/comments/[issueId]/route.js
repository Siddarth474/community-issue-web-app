import { NextResponse } from "next/server";
import Comment from "@/models/commentModel";
import { connectDB } from "@/db/dbConfig";
import Issue from "@/models/issueModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export const POST = async (req, {params}) => {
    try {
        await connectDB();
        const {content} = await req.json();
        const {issueId} = await params;

        if(!content) {
            return NextResponse.json(
                {error: "Content is empty", success: false},
                {status: 400}
            );
        }

        const issue = await Issue.findById(issueId);
        if(!issue) {
            return NextResponse.json(
                {error: "Issue not found!", success: false},
                {status: 404}
            );
        }

        const userId = await getDataFromToken(req);        
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized", success: false },
                { status: 401 }
            );
        }

        let newComment = await Comment.create({
            content,
            issue: issueId,
            user: userId
        });

        await newComment.populate('user', 'username');

        await Issue.findByIdAndUpdate(issueId,
            {$push: {comments: newComment._id}},
            {new: true}
        );

        return NextResponse.json(
            {message: "Comment added successfully!", comment: newComment, success: true},
            {status: 201}
        );
    
    } catch (error) {
        console.error('Error while commenting', error);
        return NextResponse.json(
            { error: error.message, success: false },
            { status: 500 }
        );
    }

}

export const GET = async (req, { params }) => {
  try {
    await connectDB();
    const { issueId } = await params;

    if (!issueId) {
      return NextResponse.json(
        { error: "Issue not found", success: false },
        { status: 404 }
      );
    }

    const userId = await getDataFromToken(req);        
    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized", success: false },
            { status: 401 }
        );
    }
    
    const allComments = await Comment.find({ issue: issueId })
      .populate("user", "username")
      .sort({ createdAt: -1 });


    return NextResponse.json(
      {
        success: true,
        comments: allComments
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
};
