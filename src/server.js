import Express from "express";
import authorsRouter from "./api/authors/index.js";
import listEndpoints from "express-list-endpoints";

const server = Express();
server.use(Express.json());
const port = 3001;

server.use("/authors", authorsRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`The server is running on port ${port}`);
});
