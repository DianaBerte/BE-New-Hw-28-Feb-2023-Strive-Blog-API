import Express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const blogPostsRouter = Express.Router();

const blogpostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
);

const getBlogPosts = () => JSON.parse(fs.readFileSync(blogpostsJSONPath));
const writeBlogPosts = (blogPostsArray) =>
  fs.writeFileSync(blogpostsJSONPath, JSON.stringify(blogPostsArray));

//1.
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

//2.
blogPostsRouter.get("/", (req, res) => {
  const blogPosts = getBlogPosts();
  res.send(blogPosts);
});

//3.
blogPostsRouter.get("/:blogpostId", (req, res) => {});

//4.
blogPostsRouter.put("/:blogpostId", (req, res) => {});

//5.
blogPostsRouter.delete("/:blogpostId", (req, res) => {});

export default blogPostsRouter;
