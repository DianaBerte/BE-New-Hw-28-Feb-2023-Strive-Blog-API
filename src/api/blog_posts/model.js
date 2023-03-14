import mongoose from "mongoose";

const { Schema, model } = mongoose

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
    },
    {
        timestamps: true,
    }
)

export default model("BlogPost", blogPostSchema)