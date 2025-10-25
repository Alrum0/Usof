const BaseModel = require('./baseModel');
const db = require('../db');

class Categories extends BaseModel {
  constructor() {
    super('categories');
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
      `SELECT p.*, 
            (SELECT COALESCE(JSON_ARRAYAGG(t.fileName), JSON_ARRAY())
             FROM (SELECT DISTINCT fileName FROM post_image WHERE postId = p.id) t
            ) AS images,
            COALESCE(JSON_ARRAYAGG(c.title), JSON_ARRAY()) AS categories
     FROM posts p
     JOIN post_categories pc ON p.id = pc.postId
     JOIN categories c ON pc.categoryId = c.id
     WHERE p.id IN (
       SELECT postId FROM post_categories WHERE categoryId = ?
     )
     GROUP BY p.id
     ORDER BY p.publishDate DESC
     LIMIT ? OFFSET ?`,
      [categoryId, limit, offset]
    );
    return rows;
  }
}

module.exports = new Categories();
