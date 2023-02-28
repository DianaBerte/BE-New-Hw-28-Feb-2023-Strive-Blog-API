//****** authors related endpoints ********/
//****authors CRUD endpoints******/

//1. POST --> http://localhost:3001/authors/ => (+ body) create a new author
//2. GET --> http://localhost:3001/authors/ => returns the list of authors
//3. GET (sg user) --> http://localhost:3001/authors/:userId => returns a single author

import Express from "express";

const authorsRouter = Express.Router();

//1
authorsRouter.post("/", (req, res) => {
  res.send({ message: "Hello I'm the POST ENDPOINT" });
  // const newAuthor = {...req.body, createdAt: new Date(), updatedAt: new Date(), id: uniqid()}
});

//2
authorsRouter.get("/", (req, res) => {
  //1 read content of authors.json
  //2 send array of authors back as response
  res.send([
    {
      name: "someName",
      surname: "someSurname",
      ID: "id",
      email: "someEmail@gmail.com",
      "date of birth": "01-01-1970",
      avatar: "https://ui-avatars.com/api/?name=John+Doe",
    },
  ]);
});

//3
authorsRouter.get("/:userId", () => {});

export default authorsRouter;
