import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
// console.log("DATA FOLDER:", dataFolderPath)
export const getBlogPosts = () => readJSON(blogpostsJSONPath);
export const writeBlogPosts = (blogPostsArray) => writeJSON(blogpostsJSONPath, blogPostsArray);
