import Express from "express";
import authorsRouter from "./api/authors/index.js";
import listEndpoints from "express-list-endpoints";
import blogPostsRouter from "./api/blog_posts/index.js";
import cors from "cors";
import { genericErrorHandler } from "./api/errorsHandlers.js";
import filesRouter from "./files/index.js";

const server = Express();
const port = 3004;

server.use(Express.json());
server.use(cors());

//*********endpoints******/
server.use("/authors", authorsRouter);
server.use("/blogposts", blogPostsRouter);
server.use("/files", filesRouter)

//****************error handlers*************/
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`The server is running on port ${port}`);
});
