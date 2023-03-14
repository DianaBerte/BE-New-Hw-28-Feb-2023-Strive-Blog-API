// import fs from "fs";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";
import Express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { getBlogPosts, writeBlogPosts, getBlogPostsJSONReadableStream } from "../../lib/fs-tools.js";
import { Transform } from "@json2csv/node";
import blogPostsModel from "./model.js";

const blogPostsRouter = Express.Router();

// const blogpostsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogPosts.json");
// const getBlogPosts = () => JSON.parse(fs.readFileSync(blogpostsJSONPath));
// const writeBlogPosts = (blogPostsArray) => fs.writeFileSync(blogpostsJSONPath, JSON.stringify(blogPostsArray));

//1. POST the old way
// blogPostsRouter.post("/", async (req, res) => {
//   const newBlogPost = {
//     ...req.body, id: uniqid(), createdAt: new Date(), updatedAt: new Date(),
//   };
//   const blogPostsArray = await getBlogPosts();
//   blogPostsArray.push(newBlogPost);
//   writeBlogPosts(blogPostsArray);
//   res.status(201).send({ id: newBlogPost.id });
// });

//1. POST the MONGO way
blogPostsRouter.post("/", async (req, res, next) => {
  try {
    const newBlogPost = new blogPostsModel(req.body)
    const { _id } = await newBlogPost.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

//2. GET
blogPostsRouter.get("/", async (req, res) => {
  const blogPosts = await getBlogPosts();
  res.send(blogPosts);
});

//3. GET WITH ID the lod way
// blogPostsRouter.get("/:blogpostId", async (req, res, next) => {
//   try {
//     const blogPostsArray = await getBlogPosts();
//     const foundBlogPost = blogPostsArray.find(
//       (blogPost) => blogPost.id === req.params.blogpostId
//     );
//     if (foundBlogPost) {
//       res.send(foundBlogPost);
//     } else {
//       next(
//         createHttpError(
//           404,
//           `Blog post with id ${req.params.blogpostId} was not found!`
//         )
//       );
//     }
//   } catch (error) {
//     next(error);
//   }
// });

//3. GET WITH ID the MONGO way
blogPostsRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    const blogPost = await blogPostsModel.findById(req.params.blogPostId)
    if (blogPost) {
      res.send(blogPost)
    } else {
      next(createHttpError(404, `Blog post with id ${req.params.blogPostId} not found :(`))
    }
  } catch (error) {
    next(error)
  }
})

//4. PUT
blogPostsRouter.put("/:blogpostId", async (req, res, next) => {
  try {
    const blogPostsArray = await getBlogPosts();
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
blogPostsRouter.delete("/:blogpostId", async (req, res, next) => {
  try {
    const blogPostsArray = await getBlogPosts();
    const remainingBlogPosts = blogPostsArray.filter(
      (blogPost) => blogPost.id !== req.params.blogpostId
    );
    if (blogPostsArray.length !== remainingBlogPosts.length) {
      writeBlogPosts(remainingBlogPosts);
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Blog post with id ${req.params.blogpostId} was not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

//endpoint for exporting a CSV file for blog posts
// blogPostsRouter.get("/blogPostsCSV", (req, res, next) => {
//   try {
//     setHeader("Content-Disposition", "attachment; filename=blogPosts.csv")
//     const source = getBlogPostsJSONReadableStream()
//     const transform = new Transform({ fields: ["category", "title", "content", "id"] })
//     const destination = res
//     pipeline(source, transform, destination, err => {
//       if (err) console.log(err)
//     })
//   } catch (error) {
//     next(error)
//   }
// })

export default blogPostsRouter;
