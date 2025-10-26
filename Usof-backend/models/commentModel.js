const BaseModel = require('./baseModel');
const db = require('../db');

class Comment extends BaseModel {
  constructor() {
    super('comments');
  }

  async findAllByPostId(postId, sort = 'publishDate', order = 'DESC') {
    const allowedSortFields = ['publishDate', 'login', 'id'];
    if (!allowedSortFields.includes(sort)) sort = 'publishDate';
    order = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Check if parentId column exists
    const [columns] = await db.query(
      `SHOW COLUMNS FROM comments LIKE 'parentId'`
    );

    const hasParentId = columns.length > 0;

    const sortColumn = sort === 'login' ? 'u.login' : `c.${sort}`;

    let query, params;

    if (hasParentId) {
      query = `
      SELECT 
        c.id,
        c.content,
        c.publishDate,
        c.parentId,
        u.login,
        u.avatar,
        u.role,
        u.isOfficial,
        u.id AS authorId,
        p.title AS postTitle,
        p.content AS postContent,
        (SELECT COUNT(*) FROM comments WHERE parentId = c.id) AS repliesCount
      FROM comments c
      JOIN users u ON c.authorId = u.id
      JOIN posts p ON c.postId = p.id
      WHERE c.postId = ? AND c.parentId IS NULL
      ORDER BY ${sortColumn} ${order}
      `;
      params = [postId];
    } else {
      query = `
      SELECT 
        c.id,
        c.content,
        c.publishDate,
        u.login,
        u.avatar,
        u.role,
        u.isOfficial,
        u.id AS authorId,
        p.title AS postTitle,
        p.content AS postContent,
        0 AS repliesCount
      FROM comments c
      JOIN users u ON c.authorId = u.id
      JOIN posts p ON c.postId = p.id
      WHERE c.postId = ?
      ORDER BY ${sortColumn} ${order}
      `;
      params = [postId];
    }

    const [rows] = await db.query(query, params);
    return rows;
  }

  async findAllByUserId(userId) {
    const [rows] = await db.query(
      `
      SELECT 
        c.id,
        c.content,
        c.publishDate,
        c.postId,
        u.login,
        u.avatar,
        u.role,
        u.isOfficial,
        u.id AS authorId,
        p.title AS postTitle,
        p.content AS postContent,
        p.authorId AS postAuthorId,
        (SELECT login FROM users WHERE id = p.authorId) AS postAuthorLogin,
        (SELECT avatar FROM users WHERE id = p.authorId) AS postAuthorAvatar
      FROM comments c
      JOIN users u ON c.authorId = u.id
      JOIN posts p ON c.postId = p.id
      WHERE c.authorId = ?
      ORDER BY c.publishDate DESC
      `,
      [userId]
    );

    return rows;
  }

  async findRepliesByCommentId(commentId) {
    // Check if parentId column exists
    const [columns] = await db.query(
      `SHOW COLUMNS FROM comments LIKE 'parentId'`
    );

    if (columns.length === 0) {
      // If parentId doesn't exist, return empty array
      return [];
    }

    const [rows] = await db.query(
      `
      SELECT 
        c.id,
        c.content,
        c.publishDate,
        c.parentId,
        u.login,
        u.avatar,
        u.role,
        u.isOfficial,
        u.id AS authorId,
        parent.authorId AS parentAuthorId,
        (SELECT login FROM users WHERE id = parent.authorId) AS parentAuthorLogin,
        (SELECT COUNT(*) FROM comments WHERE parentId = c.id) AS repliesCount
      FROM comments c
      JOIN users u ON c.authorId = u.id
      LEFT JOIN comments parent ON c.parentId = parent.id
      WHERE c.parentId = ?
      ORDER BY c.publishDate ASC
      `,
      [commentId]
    );

    return rows;
  }

  async findRepliesRecursive(commentId) {
    // Check if parentId column exists
    const [columns] = await db.query(
      `SHOW COLUMNS FROM comments LIKE 'parentId'`
    );

    if (columns.length === 0) {
      return [];
    }

    // Get direct replies
    const replies = await this.findRepliesByCommentId(commentId);

    // Recursively get replies for each reply
    for (let reply of replies) {
      reply.replies = await this.findRepliesRecursive(reply.id);
    }

    return replies;
  }
}

module.exports = new Comment();
