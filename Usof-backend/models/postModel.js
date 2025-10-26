const BaseModel = require('./baseModel');
const db = require('../db');

class Posts extends BaseModel {
  constructor() {
    super('posts');
  }

  async findAllWithPaginationAndSorting(limit, offset, sort) {
    let orderBySql;

    switch (sort) {
      case 'likes_desc':
        orderBySql = 'ORDER BY likes_count DESC';
        break;
      case 'likes_asc':
        orderBySql = 'ORDER BY likes_count ASC';
        break;
      case 'date_asc':
        orderBySql = 'ORDER BY p.publishDate ASC';
        break;
      case 'date_desc':
      default:
        orderBySql = 'ORDER BY p.publishDate DESC';
        break;
    }

    const [rows] = await db.query(
      `
      SELECT 
        p.id,
        p.title,
        p.content,
        p.location,
        p.publishDate,
            u.id AS authorId,
            u.login AS authorName,
            u.fullName AS authorFullName,
            u.avatar AS authorAvatar,
            u.role AS authorRole,
            u.isOfficial AS authorIsOfficial,
  (SELECT COALESCE(JSON_ARRAYAGG(t.fileName), JSON_ARRAY())
   FROM (SELECT DISTINCT fileName FROM post_image WHERE postId = p.id) t
  ) AS images,
        COUNT(DISTINCT l.id) AS likes_count,
        COALESCE(SUM(ps.stars), 0) AS stars
      FROM posts p
      JOIN users u ON p.authorId = u.id
      LEFT JOIN post_image pi ON pi.postId = p.id
      LEFT JOIN likes l ON l.postId = p.id
      LEFT JOIN post_stars ps ON ps.postId = p.id
      GROUP BY p.id
      ${orderBySql}
      LIMIT ? OFFSET ?
      `,
      [limit, offset]
    );

    return rows;
  }

  async findAllWithPagination(limit, offset) {
    const [rows] = await db.query(
      `SELECT 
        p.*,
  (SELECT COALESCE(JSON_ARRAYAGG(t.fileName), JSON_ARRAY())
    FROM (SELECT DISTINCT fileName FROM post_image WHERE postId = p.id) t
  ) AS images,
        COALESCE(SUM(ps.stars), 0) AS stars
     FROM posts p
     LEFT JOIN post_image pi ON p.id = pi.postId
     LEFT JOIN post_stars ps ON p.id = ps.postId
     GROUP BY p.id
     ORDER BY p.publishDate DESC
     LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return rows;
  }

  async findPostWithFullData(postId) {
    const [rows] = await db.query(
      `
    SELECT 
      p.id,
      p.title,
      p.content,
      p.location,
      p.publishDate,
            u.id AS authorId,
            u.login AS authorName,
            u.fullName AS authorFullName,
            u.avatar AS authorAvatar,
            u.role AS authorRole,
            u.isOfficial AS authorIsOfficial,
  (SELECT COALESCE(JSON_ARRAYAGG(t.fileName), JSON_ARRAY())
    FROM (SELECT DISTINCT fileName FROM post_image WHERE postId = p.id) t
  ) AS images,
      COUNT(DISTINCT l.id) AS likes_count,
      COALESCE(SUM(ps.stars), 0) AS stars
    FROM posts p
    JOIN users u ON p.authorId = u.id
    LEFT JOIN post_image pi ON pi.postId = p.id
    LEFT JOIN likes l ON l.postId = p.id
    LEFT JOIN post_stars ps ON ps.postId = p.id
    WHERE p.id = ?
    GROUP BY p.id
    `,
      [postId]
    );

    return rows[0] || null;
  }

  async findFollowingPosts(userId, limit, offset, sort) {
    let orderBySql;

    switch (sort) {
      case 'likes_desc':
        orderBySql = 'ORDER BY likes_count DESC';
        break;
      case 'likes_asc':
        orderBySql = 'ORDER BY likes_count ASC';
        break;
      case 'date_asc':
        orderBySql = 'ORDER BY p.publishDate ASC';
        break;
      case 'date_desc':
      default:
        orderBySql = 'ORDER BY p.publishDate DESC';
        break;
    }

    const [rows] = await db.query(
      `
    SELECT 
      p.id,
      p.title,
      p.content,
      p.publishDate,
            u.id AS authorId,
            u.login AS authorName,
            u.fullName AS authorFullName,
            u.avatar AS authorAvatar,
            u.role AS authorRole,
            u.isOfficial AS authorIsOfficial,
  (SELECT COALESCE(JSON_ARRAYAGG(t.fileName), JSON_ARRAY())
    FROM (SELECT DISTINCT fileName FROM post_image WHERE postId = p.id) t
  ) AS images,
      COUNT(DISTINCT l.id) AS likes_count,
      COALESCE(SUM(ps.stars), 0) AS stars
    FROM posts p
    JOIN users u ON p.authorId = u.id
    INNER JOIN subscriptions s ON s.followingId = p.authorId
    LEFT JOIN post_image pi ON pi.postId = p.id
    LEFT JOIN likes l ON l.postId = p.id
    LEFT JOIN post_stars ps ON ps.postId = p.id
    WHERE s.followerId = ?
    GROUP BY p.id
    ${orderBySql}
    LIMIT ? OFFSET ?
    `,
      [userId, limit, offset]
    );

    return rows;
  }

  async countFollowingPosts(userId) {
    const [rows] = await db.query(
      `
    SELECT COUNT(*) AS count
    FROM posts p
    INNER JOIN subscriptions s ON s.followingId = p.authorId
    WHERE s.followerId = ?
    `,
      [userId]
    );
    return rows[0]?.count || 0;
  }

  async countAll() {
    const [[{ count }]] = await db.query(
      `SELECT COUNT(*) as count FROM ${this.tableName}`
    );
  }

  async findLikesWithUserInformation(post_id) {
    const [rows] = await db.query(
      `SELECT l.userId, u.fullName, u.login, u.avatar
      FROM likes l
      JOIN users u ON l.userId = u.id
      WHERE l.postId = ?
      ORDER BY l.createdAt DESC`,
      [post_id]
    );
    return rows;
  }

  async findFollowingPosts(userId) {
    const [rows] = await db.query(
      `SELECT 
        p.id,
        p.title,
        p.content,
        p.publishDate,
        u.id AS authorId,
        u.login AS authorName,
        u.fullName AS authorFullName,
        u.avatar AS authorAvatar,
   (SELECT COALESCE(JSON_ARRAYAGG(t.fileName), JSON_ARRAY())
     FROM (SELECT DISTINCT fileName FROM post_image WHERE postId = p.id) t
   ) AS images,
        COUNT(DISTINCT l.id) AS likes_count,
        COALESCE(SUM(ps.stars), 0) AS stars
       FROM posts p
       JOIN users u ON p.authorId = u.id
       LEFT JOIN post_image pi ON pi.postId = p.id
       LEFT JOIN likes l ON l.postId = p.id
       LEFT JOIN post_stars ps ON ps.postId = p.id
       INNER JOIN subscriptions s ON p.authorId = s.followingId
       WHERE s.followerId = ?
       GROUP BY p.id
       ORDER BY p.publishDate DESC`,
      [userId]
    );
    return rows;
  }

  async findPostWithImagesAndStars(postId) {
    const [rows] = await db.query(
      `SELECT 
  p.*,
  (SELECT COALESCE(JSON_ARRAYAGG(t.fileName), JSON_ARRAY())
    FROM (SELECT DISTINCT fileName FROM post_image WHERE postId = p.id) t
  ) AS images,
        COALESCE(SUM(ps.stars), 0) AS stars
     FROM posts p
     LEFT JOIN post_image pi ON p.id = pi.postId
     LEFT JOIN post_stars ps ON p.id = ps.postId
     WHERE p.id = ?
     GROUP BY p.id`,
      [postId]
    );

    return rows[0] || null;
  }

  async findByAuthorId(authorId) {
    const [rows] = await db.query(
      `
      SELECT 
        p.id,
        p.title,
        p.content,
        p.publishDate,
        u.login AS authorName,
        u.avatar AS authorAvatar,
  (SELECT COALESCE(JSON_ARRAYAGG(t.fileName), JSON_ARRAY())
    FROM (SELECT DISTINCT fileName FROM post_image WHERE postId = p.id) t
  ) AS images,
        COUNT(DISTINCT l.id) AS likes_count,
        COALESCE(SUM(ps.stars), 0) AS stars
      FROM posts p
      JOIN users u ON p.authorId = u.id
      LEFT JOIN post_image pi ON pi.postId = p.id
      LEFT JOIN likes l ON l.postId = p.id
      LEFT JOIN post_stars ps ON ps.postId = p.id
      WHERE p.authorId = ?
      GROUP BY p.id
      ORDER BY p.publishDate DESC
    `,
      [authorId]
    );

    return rows;
  }
}

module.exports = new Posts();
