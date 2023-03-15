import mongoose from "mongoose";

const { Schema, model } = mongoose

const commentsSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
    },
    { timestamps: true }
)

export default model("Comment", commentsSchema)