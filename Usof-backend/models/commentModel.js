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

    const [rows] = await db.query(
      `
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
        p.content AS postContent
      FROM comments c
      JOIN users u ON c.authorId = u.id
      JOIN posts p ON c.postId = p.id
      WHERE c.postId = ?
      ORDER BY ${sort === 'login' ? 'u.login' : `c.${sort}`} ${order}
      `,
      [postId]
    );

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
}

module.exports = new Comment();
