import mongoose, { Schema } from "mongoose";

const issueSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title']
    },
    category: {
        type: String,
        required: [true, 'Add a category']
    },
    description: {
        type: String,
        required: [true, 'Provide a relevant description']
    },
    image: {
        type: String,
        required: true
    },
    imagePublicId: {
        type: String,
    },
    location: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    Status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved'],
        default: 'open',
        lowercase: true
    },
    votes:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Vote',
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        }
    ],
    reporter: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }

}, {timestamps: true});

export default mongoose.models.Issue || mongoose.model("Issue", issueSchema);