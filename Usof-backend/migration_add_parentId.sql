-- Міграція для додавання підтримки відповідей на коментарі
-- Виконайте цей скрипт в MySQL

ALTER TABLE comments 
ADD COLUMN parentId INT DEFAULT NULL AFTER postId,
ADD CONSTRAINT fk_comment_parent FOREIGN KEY (parentId) REFERENCES comments(id) ON DELETE CASCADE;
