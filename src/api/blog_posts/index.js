import Express from "express";

const blogPostsRouter = Express.Router();

blogPostsRouter.post("/", (req, res) => {
  res.send();
});

blogPostsRouter.get("/", (req, res) => {});

blogPostsRouter.get("/:blogpostId", (req, res) => {});

blogPostsRouter.put("/:blogpostId", (req, res) => {});

blogPostsRouter.delete("/:blogpostId", (req, res) => {});

export default blogPostsRouter;
