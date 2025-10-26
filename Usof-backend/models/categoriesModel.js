const BaseModel = require('./baseModel');
const db = require('../db');

class Categories extends BaseModel {
  constructor() {
    super('categories');
  }

  // Helper to parse JSON fields from MySQL
  parseJsonFields(row) {
    if (!row) return null;
    return {
      ...row,
      images:
        typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
      categories:
        typeof row.categories === 'string'
          ? JSON.parse(row.categories)
          : row.categories,
    };
  }

  async checkCategories(categories) {
    const [rows] = await db.query(
      `SELECT id FROM ${this.tableName} WHERE id IN (?)`,
      [categories]
    );
    return rows.map((r) => r.id);
  }

  async findByCategoryPaginated(categoryId, limit, offset) {
    const [rows] = await db.query(
      `SELECT 
            p.id,
            p.authorId,
            p.title,
            p.publishDate,
            p.status,
            p.content,
            (SELECT COUNT(*) FROM likes WHERE postId = p.id) AS likes_count,
            u.login AS authorLogin,
            u.avatar AS authorAvatar,
            u.fullName AS authorFullName,
            u.role AS authorRole,
            u.isOfficial AS authorIsOfficial,
            (SELECT COALESCE(JSON_ARRAYAGG(t.fileName), JSON_ARRAY())
             FROM (SELECT DISTINCT fileName FROM post_image WHERE postId = p.id) t
            ) AS images,
            COALESCE(JSON_ARRAYAGG(c.title), JSON_ARRAY()) AS categories,
            (SELECT COUNT(*) FROM comments WHERE postId = p.id) AS commentsCount
     FROM posts p
     JOIN users u ON p.authorId = u.id
     JOIN post_categories pc ON p.id = pc.postId
     JOIN categories c ON pc.categoryId = c.id
     WHERE p.id IN (
       SELECT postId FROM post_categories WHERE categoryId = ?
     )
     GROUP BY p.id, p.authorId, p.title, p.publishDate, p.status, p.content,
              u.login, u.avatar, u.fullName, u.role, u.isOfficial
     ORDER BY p.publishDate DESC
     LIMIT ? OFFSET ?`,
      [categoryId, limit, offset]
    );
    return rows.map((row) => this.parseJsonFields(row));
  }
}

module.exports = new Categories();
