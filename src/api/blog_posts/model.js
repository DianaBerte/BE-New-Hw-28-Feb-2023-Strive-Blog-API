import mongoose from "mongoose";

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
        "authors": [{ type: Schema.Types.ObjectId, ref: "Author" }],
        "content": { type: String },
        "comments": [CommentSchema],
    },
    {
        timestamps: true,
    }
)

export default model("BlogPost", blogPostSchema)