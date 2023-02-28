import Express from "express";

const server = Express();
const port = 3001;

server.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
