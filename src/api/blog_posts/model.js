import mongoose from "mongoose";
import commentsModel from "../comments/model.js";

const { Schema, model } = mongoose

const CommentSchema = new Schema(
    {
        author: {
            name: { type: String },
        },
        text: { type: String },
    },
    {
        timestamps: true,
    }
);

const blogPostSchema = new Schema(
    {
        "category": { type: String, required: true },
        "title": { type: String, required: true },
        "readTime": {
            "value": { type: Number },
            "unit": { type: String },
        },
        "author": {
            "name": { type: String, required: true },
        },
        "content": { type: String },
        "comments": [CommentSchema],
    },
    {
        timestamps: true,
    }
)

export default model("BlogPost", blogPostSchema)