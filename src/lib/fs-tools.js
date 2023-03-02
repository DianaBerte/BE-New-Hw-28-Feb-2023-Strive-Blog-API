import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON } = fs;

export const getBlogPosts = () => readJSON(blogpostsJSONPath);
export const writeBlogPosts = (blogPostsArray) =>
  writeJSON(blogpostsJSONPath, blogPostsArray);
