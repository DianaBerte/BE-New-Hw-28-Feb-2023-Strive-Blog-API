import createHttpError from "http-errors";

export const adminOnlyMiddleware = (request, response, next) => {
    if (request.author.role === "Admin") {
        next()
    } else {
        next(createHttpError(403, "This endpoint is for Admins only!"))
    }
}