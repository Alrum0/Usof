const BaseModel = require('./baseModel');
const db = require('../db');

class Repost extends BaseModel {
  constructor() {
    super('reposts');
  }

  async findByUserId(userId) {
    const [rows] = await db.query(
      `SELECT 
        r.id as repostId,
        r.userId,
        r.postId,
        r.createdAt as repostedAt,
        p.id,
        p.title,
        p.content,
        p.location,
        p.publishDate,
        u.id AS authorId,
        u.login AS authorLogin,
        u.fullName AS authorFullName,
        u.avatar AS authorAvatar,
        u.role AS authorRole,
        u.isOfficial AS authorIsOfficial,
        (SELECT COALESCE(JSON_ARRAYAGG(t.fileName), JSON_ARRAY())
         FROM (SELECT DISTINCT fileName FROM post_image WHERE postId = p.id) t
        ) AS images,
        (SELECT COUNT(*) FROM likes WHERE postId = p.id) AS likes_count,
        COALESCE(SUM(ps.stars), 0) AS stars,
        (SELECT COUNT(*) FROM comments WHERE postId = p.id) AS commentsCount,
        (SELECT COUNT(*) FROM reposts WHERE postId = p.id) AS repostsCount
      FROM reposts r
      JOIN posts p ON r.postId = p.id
      JOIN users u ON p.authorId = u.id
      LEFT JOIN post_stars ps ON ps.postId = p.id
      WHERE r.userId = ?
      GROUP BY r.id, p.id
      ORDER BY r.createdAt DESC`,
      [userId]
    );
    return rows;
  }

  async checkRepost(userId, postId) {
    const [rows] = await db.query(
      `SELECT * FROM ${this.tableName} WHERE userId = ? AND postId = ?`,
      [userId, postId]
    );
    return rows[0] || null;
  }

  async deleteRepost(userId, postId) {
    await db.query(
      `DELETE FROM ${this.tableName} WHERE userId = ? AND postId = ?`,
      [userId, postId]
    );
    return true;
  }
}

module.exports = new Repost();
