import Express from "express";
import authorsRouter from "./api/authors/index.js";
import listEndpoints from "express-list-endpoints";
import blogPostsRouter from "./api/blog_posts/index.js";
import cors from "cors";
// import { genericErrorHandler } from "./api/errorsHandlers.js";
import { forbiddenErrorHandler, genericErroHandler, notFoundErrorHandler, unauthorizedErrorHandler } from "./errorHandlers.js";
import filesRouter from "./files/index.js";
import createHttpError from "http-errors";
import { join } from 'path';
import mongoose from "mongoose";

const server = Express();
const port = process.env.PORT || 3004
const publicFolderPath = join(process.cwd(), "./public")

// console.log("Hello:", process.env.MONGO_URL)

//*****************************************cors*****************************************/

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL, process.env.MONGO_URL]

server.use(Express.static(publicFolderPath))
server.use(
  cors({
    origin: (currentOrigin, corsNext) => {
      console.log("Current origin:", currentOrigin)
      if (!currentOrigin || whitelist.indexOf(currentOrigin) !== -1) {
        corsNext(null, true)
      } else {
        corsNext(createHttpError(400, `Origin ${currentOrigin} is not in the whitelist!`))
      }
    }
  })
)
server.use(Express.json());

//******************************************endpoints*****************************************/
server.use("/authors", authorsRouter);
server.use("/blogposts", blogPostsRouter);
server.use("/files", filesRouter)

//*******************************************error handlers*********************************************/
server.use(unauthorizedErrorHandler)
server.use(forbiddenErrorHandler)
server.use(notFoundErrorHandler)
server.use(genericErroHandler)

mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to MONGO!")
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`The server is running on port ${port}`);
  })
})