DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    firstname VARCHAR(255),
    email VARCHAR(320),
    password CHAR(60)
);

DROP TABLE IF EXISTS boards;
CREATE TABLE IF NOT EXISTS boards(
    id INT AUTO_INCREMENT PRIMARY KEY,
    board_name VARCHAR(20),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

DROP TABLE IF EXISTS slots;
CREATE TABLE IF NOT EXISTS slots(
    id UUID PRIMARY KEY,
    slot_name VARCHAR(20),
    board_id INT,
    FOREIGN KEY (board_id) REFERENCES boards(id)
);

DROP TABLE IF EXISTS tasks;
CREATE TABLE IF NOT EXISTS tasks(
    id UUID PRIMARY KEY,
    content VARCHAR(20),
    positionIndex INT,
    slot_id UUID,
    FOREIGN KEY (slot_id) REFERENCES slots(id)
);