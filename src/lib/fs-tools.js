import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const blogpostsJSONPath = join(dataFolderPath, "blogposts.jSON")
// console.log("DATA FOLDER:", dataFolderPath)
const blogPostsPublicFolderPath = join(process.cwd(), "./public/img/blogPosts")

export const getBlogPosts = () => readJSON(blogpostsJSONPath);
export const writeBlogPosts = blogPostsArray => writeJSON(blogpostsJSONPath, blogPostsArray);

export const saveBlogPostsCovers = (filename, fileContentAsBuffer) => writeFile(join(blogPostsPublicFolderPath, filename), fileContentAsBuffer)

