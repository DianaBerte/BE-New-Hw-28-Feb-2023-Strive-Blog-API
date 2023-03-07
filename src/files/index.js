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

filesRouter.get("/:blogPostsId/pdf", async (req, res, next) => { //REMEMBER we're in FILES ROUTER so the url needs to be http://localhost:3004/files/1vhd9gglepyxc23/pdf
    try {
        const blogPosts = await getBlogPosts()
        const foundBlogPost = blogPosts.find((b) => b.id === req.params.blogPostsId)
        if (foundBlogPost) {
            res.setHeader("Content-Disposition", `attachment; filename=${foundBlogPost.id}.pdf`)
            const source = await getPDFReadableStream(foundBlogPost)
            const destination = res;
            pipeline(source, destination, (err) => {
                if (err) console.log(err)
            })
        }
    } catch (error) {
        next(error)
    }
})

export default filesRouter