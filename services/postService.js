const Post = require("../models/Post");
const Like = require("../models/Like");
const Share = require("../models/Share");
const Comment = require("../models/Comment");

const createPost = async (userId, content, files) => {
  const imageUrls =
    files && files.length > 0 ? files.map((file) => file.path) : [];

  const postData = {
    user: userId,
    content,
    images: imageUrls,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await Post.collection.insertOne(postData);
  const post = await Post.findById(result.insertedId).lean();
  return post;
};

const getAllPosts = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const posts = await Post.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const [likeCount, shareCount, commentCount] = await Promise.all([
          Like.countDocuments({ target: post._id, targetModel: "Post" }),
          Share.countDocuments({ target: post._id, targetModel: "Post" }),
          Comment.countDocuments({ targetId: post._id, targetType: "Post" }),
        ]);
        return {
          ...post,
          likeCount,
          shareCount,
          commentCount,
        };
      })
    );

    const total = await Post.countDocuments();
    return {
      posts: postsWithCounts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }
};
const getPostsById = async (id, page = 1, limit = 10) => {
  try {
    console.log(id);

    const skip = (page - 1) * limit;
    const posts = await Post.find({ user: id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
    console.log(posts);

    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const [likeCount, shareCount, commentCount] = await Promise.all([
          Like.countDocuments({ target: post._id, targetModel: "Post" }),
          Share.countDocuments({ target: post._id, targetModel: "Post" }),
          Comment.countDocuments({ targetId: post._id, targetType: "Post" }),
        ]);
        return {
          ...post,
          likeCount,
          shareCount,
          commentCount,
        };
      })
    );

    const total = await Post.countDocuments();
    return {
      posts: postsWithCounts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }
};
const getBonusPoint = async (userId) => {
  const posts = await Post.countDocuments({ user: userId });
  const likes = await Like.countDocuments({
    user: userId,
    targetModel: "Post",
  });
  const shares = await Share.countDocuments({
    user: userId,
    targetModel: "Post",
  });
  const comments = await Comment.countDocuments({
    user: userId,
    targetType: "Post",
  });

  const points = posts * 10 + likes * 5 + shares * 8 + comments * 3;
  return { userId, points, posts, likes, shares, comments };
};

module.exports = { createPost, getAllPosts, getBonusPoint, getPostsById };
