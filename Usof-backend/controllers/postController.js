const ApiError = require('../error/ApiError');

const Post = require('../models/postModel');
const Categories = require('../models/categoriesModel');
const PostCategories = require('../models/postCategoriesModel');
const PostImage = require('../models/postImageModel');
const Comment = require('../models/commentModel');
const Like = require('../models/likeModel');
const Repost = require('../models/repostModel');

const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

class PostControllers {
  async getAllPosts(req, res, next) {
    try {
      let { limit, page, sort = 'date_desc' } = req.query;

      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      let offset = page * limit - limit;

      // const posts = await Post.findAllWithPagination(limit, offset);
      const posts = await Post.findAllWithPaginationAndSorting(
        limit,
        offset,
        sort
      );
      const total = await Post.countAll();

      return res.json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: posts,
      });
    } catch (err) {
      console.error(err);
      return next(ApiError.internal('Failed to fetch posts'));
    }
  }
  async getPost(req, res, next) {
    try {
      const { post_id } = req.params;

      const post = await Post.findPostWithFullData(post_id);
      if (!post) {
        return next(ApiError.badRequest('Post not found'));
      }

      return res.json(post);
    } catch (err) {
      console.error(err);
    }
  }
  async getAllCommentsForPost(req, res, next) {
    try {
      const { post_id } = req.params;
      const { sort, order } = req.query;

      const comments = await Comment.findAllByPostId(post_id, sort, order);
      return res.json(comments);
    } catch (err) {
      console.error(err);
      next(ApiError.internal('Failed to fetch comments'));
    }
  }
  async createCommentForPost(req, res, next) {
    try {
      const { post_id } = req.params;
      const { content, parentId } = req.body;
      const authorId = req.user.id;

      const post = await Post.findById(post_id);
      if (!post) {
        return next(ApiError.badRequest('Post not found'));
      }

      if (post.status === 'INACTIVE') {
        return next(ApiError.badRequest('Cannot comment on inactive post'));
      }

      if (!content) {
        return next(ApiError.badRequest('Content is required'));
      }

      // Check if parentId column exists
      const db = require('../db');
      const [columns] = await db.query(
        `SHOW COLUMNS FROM comments LIKE 'parentId'`
      );
      const hasParentId = columns.length > 0;

      // If parentId is provided and column exists, verify the parent comment exists
      if (parentId && hasParentId) {
        const parentComment = await Comment.findById(parentId);
        if (!parentComment) {
          return next(ApiError.badRequest('Parent comment not found'));
        }
        if (parentComment.postId !== parseInt(post_id)) {
          return next(
            ApiError.badRequest('Parent comment does not belong to this post')
          );
        }
      }

      const commentData = {
        postId: post_id,
        authorId,
        content,
      };

      // Only add parentId if the column exists
      if (hasParentId && parentId) {
        commentData.parentId = parentId;
      }

      await Comment.create(commentData);

      res.json({ message: 'Comment created successfully' });
    } catch (err) {
      console.error(err);
      next(ApiError.badRequest('Failed to create comment'));
    }
  }
  async getAllCategories(req, res, next) {
    try {
      const { post_id } = req.params;

      const post = await Post.findById(post_id);
      if (!post) {
        return next(ApiError.badRequest('Post not found'));
      }

      const categories = await PostCategories.findCategoriesByPostId(post_id);
      return res.json(categories);
    } catch (err) {
      console.error(err);
      return next(ApiError.internal('Failed to fetch categories'));
    }
  }
  async getAllLikesForPost(req, res, next) {
    try {
      const { post_id } = req.params;

      const post = await Post.findById(post_id);
      if (!post) {
        return next(ApiError.badRequest('Post not found'));
      }

      const likes = await Post.findLikesWithUserInformation(post_id);

      const result = {
        count: likes.length,
        users: likes,
      };

      return res.json(result);
    } catch (err) {
      console.error(err);
      return next(ApiError.internal('Failed to fetch likes'));
    }
  }
  async createPost(req, res, next) {
    try {
      const { title, content, location } = req.body;
      const authorId = req.user.id;

      let categories = Array.isArray(req.body.categories)
        ? req.body.categories
        : [req.body.categories];

      if (!title || !content) {
        return next(ApiError.badRequest('Title and content are required'));
      }

      let images = [];

      if (req.files && req.files.image) {
        images = Array.isArray(req.files.image)
          ? req.files.image
          : [req.files.image];
      }

      const post = await Post.create({
        title,
        content,
        location,
        authorId,
      });

      await Promise.all(
        images.map(async (img) => {
          const fileName = uuid.v4() + '.webp';
          const filePath = path.resolve(__dirname, '..', 'static', fileName);

          await sharp(img.data).webp({ quality: 80 }).toFile(filePath);
          await PostImage.create({ postId: post.id, fileName });
        })
      );

      if (!Array.isArray(categories) || categories.length === 0) {
        return next(
          ApiError.badRequest('Post must have at least one category')
        );
      }

      if (Array.isArray(categories) && categories.length > 0) {
        const validCategories = await Categories.checkCategories(categories);
        if (validCategories.length !== categories.length) {
          return next(
            ApiError.badRequest('One or more categories do not exists')
          );
        }
        await PostCategories.addCategories(post.id, categories);
      }

      res.json({ message: 'Post created successfully' });
    } catch (err) {
      console.error(err);
    }
  }
  async createLike(req, res, next) {
    try {
      const { post_id } = req.params;
      const userId = req.user.id;

      const post = await Post.findById(post_id);
      if (!post) {
        return next(ApiError.badRequest('Posts not found'));
      }

      const existing = await Like.findOne({ userId, postId: post_id });
      if (existing) {
        return next(ApiError.badRequest('You already liked this post'));
      }

      await Like.create({ userId, postId: post_id });
      return res.json({ message: 'Like added successfully' });
    } catch (err) {
      console.error(err);
      return next(ApiError.internal('Failed to add like'));
    }
  }
  async updatePost(req, res, next) {
    try {
      const { post_id } = req.params;
      let { title, content, status } = req.body;

      // DEBUG: log incoming categories and files for troubleshooting
      try {
        console.log(
          'updatePost request - categories type:',
          typeof req.body.categories
        );
        console.log(
          'updatePost request - categories value:',
          req.body.categories
        );
        console.log(
          'updatePost request - files keys:',
          req.files ? Object.keys(req.files) : null
        );
      } catch (e) {
        console.error('Failed to log debug info in updatePost', e);
      }

      const post = await Post.findById(post_id);
      if (!post) {
        return next(ApiError.badRequest('Post not found'));
      }

      if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
        return next(
          ApiError.forbidden('You do not have permission to edit this post')
        );
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (status !== undefined) updateData.status = status;

      if (status !== 'ACTIVE' && status !== 'INACTIVE') {
        return next(ApiError.badRequest('Invalid role (ACTIVE or INACTIVE)'));
      }

      if (Object.keys(updateData).length > 0) {
        await Post.update(post_id, updateData);
      }

      // normalize categories: accept arrays, repeated form fields, JSON strings, or comma-separated values
      let categories = null;
      if (req.body.categories !== undefined) {
        const raw = req.body.categories;

        if (Array.isArray(raw)) {
          categories = raw;
        } else if (typeof raw === 'string') {
          // try JSON array (e.g. '[1,2]')
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              categories = parsed;
            } else {
              categories = [raw];
            }
          } catch (e) {
            // not JSON, maybe comma-separated like '1,2'
            if (raw.includes(',')) {
              categories = raw.split(',');
            } else {
              categories = [raw];
            }
          }
        } else {
          categories = [raw];
        }

        // normalize values to strings/numbers and filter out empty
        categories = categories
          .map((c) => (typeof c === 'string' ? c.trim() : c))
          .filter((c) => c !== undefined && c !== null && c !== '');

        if (categories.length === 0) {
          return next(
            ApiError.badRequest('Post must have at least one category')
          );
        }

        const validCategories = await Categories.checkCategories(categories);
        if (validCategories.length !== categories.length) {
          return next(
            ApiError.badRequest('One or more categories do not exist')
          );
        }

        await PostCategories.deleteByPostId(post_id);
        await PostCategories.addCategories(post_id, categories);
      }

      // handle explicit removal of some existing images
      let removedImages = Array.isArray(req.body.removedImages)
        ? req.body.removedImages
        : req.body.removedImages
        ? [req.body.removedImages]
        : [];

      if (removedImages && removedImages.length > 0) {
        try {
          const existingImages = await PostImage.findAll({ postId: post_id });
          const toDelete = existingImages.filter((img) =>
            removedImages.includes(img.fileName)
          );
          await Promise.all(
            toDelete.map(async (img) => {
              const filePath = path.resolve(
                __dirname,
                '..',
                'static',
                img.fileName
              );
              try {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                await PostImage.delete(img.id);
              } catch (err) {
                console.error(`Failed to delete image ${img.fileName}:`, err);
              }
            })
          );
        } catch (err) {
          console.error('Failed to process removedImages', err);
        }
      }

      if (req.files && req.files.image) {
        let images = Array.isArray(req.files.image)
          ? req.files.image
          : [req.files.image];

        const oldImages = await PostImage.findAll({ postId: post_id });

        try {
          await Promise.all(
            images.map(async (img) => {
              const fileName = uuid.v4() + '.webp';
              const filePath = path.resolve(
                __dirname,
                '..',
                'static',
                fileName
              );

              await sharp(img.data).webp({ quality: 80 }).toFile(filePath);
              await PostImage.create({ postId: post_id, fileName });
            })
          );

          await Promise.all(
            oldImages.map(async (img) => {
              const filePath = path.resolve(
                __dirname,
                '..',
                'static',
                img.fileName
              );
              try {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                await PostImage.delete(img.id);
              } catch (err) {
                console.error(`Failed to delete image ${img.fileName}:`, err);
              }
            })
          );
        } catch (err) {
          console.error('Failed to save new images', err);
          return next(ApiError.internal('Failed to update post images'));
        }
      }

      return res.json({ message: 'Post updated successfully' });
    } catch (err) {
      console.error(err);
      return next(ApiError.internal('Failed to update post'));
    }
  }
  async deletePost(req, res, next) {
    try {
      const { post_id } = req.params;

      const post = await Post.findById(post_id);
      if (!post) {
        return next(ApiError.badRequest('Post not found'));
      }

      if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
        return next(
          ApiError.forbidden('You do not have permission to delete this post')
        );
      }

      if (post.image) {
        const img = path.resolve(__dirname, '..', 'static', post.image);
        if (fs.existsSync(img)) {
          fs.unlinkSync(img);
        }
      }

      await Post.delete(post_id);
      return res.json('Post deleted successfully');
    } catch (err) {
      console.error(err);
      return next(ApiError.internal('Failed to delete post'));
    }
  }
  async deleteLike(req, res, next) {
    try {
      const { post_id } = req.params;
      const userId = req.user.id;

      const like = await Like.findOne({ userId, postId: post_id });
      if (!like) {
        return next(
          ApiError.badRequest('Like not found for this post by this user')
        );
      }

      await Like.delete(like.id);
      return res.json({ message: 'Like removed successfully' });
    } catch (err) {
      console.error(err);
      return next(ApiError.badRequest('Failed to remove like'));
    }
  }
  async findFollowingPosts(req, res, next) {
    try {
      const userId = req.user.id;
      let { limit, page, sort = 'date_desc' } = req.query;

      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      const offset = page * limit - limit;

      const posts = await Post.findFollowingPosts(userId, limit, offset, sort);
      const total = await Post.countFollowingPosts(userId);

      return res.json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: posts,
      });
    } catch (err) {
      console.error(err);
      return next(
        ApiError.internal('Failed to fetch posts from followed users')
      );
    }
  }

  async getAllPostsByUser(req, res, next) {
    try {
      const { user_id } = req.params;

      const posts = await Post.findByAuthorId(user_id);

      return res.json({
        page: 1,
        limit: posts.length,
        total: posts.length,
        totalPages: 1,
        data: posts,
      });
    } catch (err) {
      console.error(err);
      return next(ApiError.internal('Failed to fetch user posts'));
    }
  }

  async getLikeStatus(req, res, next) {
    try {
      const { post_id } = req.params;
      const userId = req.user.id;

      const like = await Like.findOne({ userId, postId: post_id });
      return res.json({ liked: !!like });
    } catch (err) {
      console.error(err);
      return next(ApiError.internal('Failed to fetch like status'));
    }
  }

  async createRepost(req, res, next) {
    try {
      const { post_id } = req.params;
      const userId = req.user.id;

      const post = await Post.findById(post_id);
      if (!post) {
        return next(ApiError.badRequest('Post not found'));
      }

      const existingRepost = await Repost.checkRepost(userId, post_id);
      if (existingRepost) {
        return next(ApiError.badRequest('You already reposted this post'));
      }

      await Repost.create({ userId, postId: post_id });
      return res.json({ message: 'Repost created successfully' });
    } catch (err) {
      console.error(err);
      return next(ApiError.internal('Failed to create repost'));
    }
  }

  async deleteRepost(req, res, next) {
    try {
      const { post_id } = req.params;
      const userId = req.user.id;

      const repost = await Repost.checkRepost(userId, post_id);
      if (!repost) {
        return next(ApiError.badRequest('Repost not found'));
      }

      await Repost.deleteRepost(userId, post_id);
      return res.json({ message: 'Repost removed successfully' });
    } catch (err) {
      console.error(err);
      return next(ApiError.internal('Failed to remove repost'));
    }
  }

  async getRepostStatus(req, res, next) {
    try {
      const { post_id } = req.params;
      const userId = req.user.id;

      const repost = await Repost.checkRepost(userId, post_id);
      return res.json({ reposted: !!repost });
    } catch (err) {
      console.error(err);
      return next(ApiError.internal('Failed to fetch repost status'));
    }
  }

  async getUserReposts(req, res, next) {
    try {
      const { user_id } = req.params;

      const reposts = await Repost.findByUserId(user_id);

      return res.json({
        page: 1,
        limit: reposts.length,
        total: reposts.length,
        totalPages: 1,
        data: reposts,
      });
    } catch (err) {
      console.error(err);
      return next(ApiError.internal('Failed to fetch user reposts'));
    }
  }
}

module.exports = new PostControllers();
