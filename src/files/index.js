import multer from "multer";
import Express from "express";
import { saveBlogPostsCovers } from "../lib/fs-tools.js";
import { extname } from 'path';

//POST /blogPosts/:id/uploadCover, uploads a picture (save as idOfTheBlogPost.jpg in the public/img/blogPosts folder) for the blog post specified by the id. Store the newly created URL into the corresponding post in blogPosts.json

const filesRouter = Express.Router()

filesRouter.post("/:id/single", multer().single("cover"), async (req, res, next) => {
    try {
        console.log('FILE:', req.file);
        const originalFileExtension = extname(req.file.originalname);
        const coverName = req.params.id + originalFileExtension;
        await saveBlogPostsCovers(coverName, req.file.buffer)
        res.send({ message: "Hello, file uploaded!" })
    } catch (error) {
        next(error)
    }
})

export default filesRouter