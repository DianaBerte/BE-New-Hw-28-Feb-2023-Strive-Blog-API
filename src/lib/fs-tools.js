import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createReadStream } from "fs";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const blogpostsJSONPath = join(dataFolderPath, "blogposts.jSON")
// console.log("DATA FOLDER:", dataFolderPath)
const authorsJSONPath = join(dataFolderPath, "authors.JSON")
const blogPostsPublicFolderPath = join(process.cwd(), "./public/img/blogPosts")

export const getBlogPosts = () => readJSON(blogpostsJSONPath);
export const writeBlogPosts = blogPostsArray => writeJSON(blogpostsJSONPath, blogPostsArray);
export const getAuthors = () => readJSON(authorsJSONPath);
export const writeAuthors = authorsArray => writeJSON(authorsJSONPath, authorsArray);

export const saveBlogPostsCovers = (filename, fileContentAsBuffer) => writeFile(join(blogPostsPublicFolderPath, filename), fileContentAsBuffer)

export const getBlogPostsJSONReadableStream = () => createReadStream(blogpostsJSONPath)