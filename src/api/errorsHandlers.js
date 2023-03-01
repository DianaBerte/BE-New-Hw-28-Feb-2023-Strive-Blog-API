// export const badRequestHandler = (err, req, res, next)

export const genericErrorHandler = (err, req, res, next) => {
  console.log("ERROR:", err);
  res.status(500).send({ message: "Error hapened, will fix ASAP" });
};
