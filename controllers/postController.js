const Post = require("../models/Post");
const {
  createPost,
  getBonusPoint,
  getAllPosts,
  getPostsById,
} = require("../services/postService");
const paginate = require("../utils/paginate");

const createPostSocial = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }
    const post = await createPost(req.user.id, content, req.files);
    console.log("đăng bài thành công");
    return res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getPointBonus = async (req, res) => {
  try {
    const pointData = await getBonusPoint(req.user.id);
    return res
      .status(200)
      .json({ message: "Point bonus retrieved", data: pointData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { results, total, totalPages } = await paginate(
      Post,
      {},
      page,
      limit
    );
    res.status(200).json({
      message: "lấy danh sách bài viết thành công",
      data: results,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostsByIds = async (req, res) => {
  try {
    const user = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const postsData = await getPostsById(user, parseInt(page), parseInt(limit));
    return res
      .status(200)
      .json({ message: "Posts retrieved successfully", ...postsData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPostSocial,
  getPointBonus,
  getPosts,
  getPostsByIds,
};
