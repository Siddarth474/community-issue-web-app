import mongoose, {Schema} from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    issue: {
        type: Schema.Types.ObjectId,
        ref: "Issue",
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {timestamps: true});

export default mongoose.models.Comment || mongoose.model("Comment", commentSchema);