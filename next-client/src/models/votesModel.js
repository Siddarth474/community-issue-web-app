import mongoose, { Schema } from "mongoose";

const voteSchema = new Schema({
    issue: {
        type: Schema.Types.ObjectId,
        ref: "Issue",
        required: true,
    },
    voteBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["upvote", "downvote"],
        required: true,
    },
}, { timestamps: true });

export default mongoose.models.Vote || mongoose.model("Vote", voteSchema);
