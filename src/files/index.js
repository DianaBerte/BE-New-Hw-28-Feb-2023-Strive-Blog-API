import multer from "multer";
import Express from "express";
import { getBlogPosts, saveBlogPostsCovers } from "../lib/fs-tools.js";
import { extname } from 'path';
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { getPDFReadableStream } from "../lib/pdf-tools.js";
import { pipeline } from "stream";

//POST /blogPosts/:id/uploadCover, uploads a picture (save as idOfTheBlogPost.jpg in the public/img/blogPosts folder) for the blog post specified by the id. Store the newly created URL into the corresponding post in blogPosts.json

const filesRouter = Express.Router()

const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({ cloudinary, params: { folder: "blogposts/covers" } }),
}).single("cover")

filesRouter.post("/:id/single",
    // multer().single("cover"),
    cloudinaryUploader,
    async (req, res, next) => {
        try {
            console.log('FILE:', req.file.path);
            // const originalFileExtension = extname(req.file.originalname);
            // const coverName = req.params.id + originalFileExtension;
            // await saveBlogPostsCovers(coverName, req.file.buffer)
            res.send({ message: "Hello, file uploaded!" })
        } catch (error) {
            next(error)
        }
    })

filesRouter.get("/pdf", async (req, res, next) => {
    try {
        req.setHeader("Content-Disposition", "attachment; filename=homework.pdf")
        const blogPosts = await getBlogPosts()
        const source = getPDFReadableStream(blogPosts[0])
        const destination = res

        pipeline(source, destination, err => {
            if (err) console.log(err)
        })
    } catch (error) {
        next(error)
    }
})

export default filesRouter