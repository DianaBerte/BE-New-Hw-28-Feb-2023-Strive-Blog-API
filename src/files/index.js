import multer from "multer";
import Express from "express";

//POST /blogPosts/:id/uploadCover, uploads a picture (save as idOfTheBlogPost.jpg in the public/img/blogPosts folder) for the blog post specified by the id. Store the newly created URL into the corresponding post in blogPosts.json

const filesRouter = Express.Router()

filesRouter.post("/single", multer().single("cover"), async (req, res, next) => {
    try {
        console.log('FILE:', req.file)
        res.send({ message: "Hello, file uploaded!" })
    } catch (error) {
        next(error)
    }
})

export default filesRouter