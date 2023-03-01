import Express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import createHttpError from "http-errors";

const blogPostsRouter = Express.Router();

const blogpostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
);

const getBlogPosts = () => JSON.parse(fs.readFileSync(blogpostsJSONPath));
const writeBlogPosts = (blogPostsArray) =>
  fs.writeFileSync(blogpostsJSONPath, JSON.stringify(blogPostsArray));

//1. POST
blogPostsRouter.post("/", (req, res) => {
  const newBlogPost = {
    ...req.body,
    id: uniqid(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const blogPostsArray = getBlogPosts();
  blogPostsArray.push(newBlogPost);
  writeBlogPosts(blogPostsArray);

  res.status(201).send({ id: newBlogPost.id });
});

//2. GET
blogPostsRouter.get("/", (req, res) => {
  const blogPosts = getBlogPosts();
  res.send(blogPosts);
});

//3. GET WITH ID
blogPostsRouter.get("/:blogpostId", (req, res, next) => {
  try {
    const blogPostsArray = getBlogPosts();
    const foundBlogPost = blogPostsArray.find(
      (blogPost) => blogPost.id === req.params.blogpostId
    );
    if (foundBlogPost) {
      res.send(foundBlogPost);
    } else {
      next(
        createHttpError(
          404,
          `Blog post with id ${req.params.blogpostId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

//4. PUT
blogPostsRouter.put("/:blogpostId", (req, res, next) => {
  try {
    const blogPostsArray = getBlogPosts();
    const index = blogPostsArray.findIndex(
      (blogPost) => blogPost.id === req.params.blogpostId
    );
    if (index !== -1) {
      const oldBlogPost = blogPostsArray[index];
      const updatedBlogPost = {
        ...oldBlogPost,
        ...req.body,
        updatedAt: new Date(),
      };
      blogPostsArray[index] = updatedBlogPost;
      writeBlogPosts(blogPostsArray);
      res.send(updatedBlogPost);
    } else {
      next(
        createHttpError(
          404,
          `Blog post with id ${req.params.blogpostId} is not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

//5. DELETE
blogPostsRouter.delete("/:blogpostId", (req, res) => {});

export default blogPostsRouter;
