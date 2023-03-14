import mongoose from "mongoose";

const { Schema, model } = mongoose

//Blog posts should contain the following information:
// {
//     "_id": "MONGO GENERATED ID",
//     "category": "ARTICLE CATEGORY",
//     "title": "ARTICLE TITLE",
//     "cover":"ARTICLE COVER (IMAGE LINK)",
//     "readTime": {
//       "value": Number,
//       "unit": "minute"
//     },
// "author": {
//   "name": "AUTHOR NAME",
//   "avatar":"AUTHOR AVATAR LINK"
// },
//     "content": "HTML",
//     "createdAt": "DATE",
//   "updatedAt": "DATE"           
// }

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
            // "avatar":"AUTHOR AVATAR LINK"
        },
        "content": { type: String },
    },
    {
        timestamps: true,
    }
)

export default model("BlogPost", blogPostSchema)