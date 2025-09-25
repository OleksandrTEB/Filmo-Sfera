CREATE DATABASE filmosfera;

USE filmosfera;

CREATE TABLE users
(
  id       BIGINT AUTO_INCREMENT PRIMARY KEY,
  email    VARCHAR(250) NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(250) NOT NULL UNIQUE,
  country  VARCHAR(250),
  license  VARCHAR(250),
  token    VARCHAR(250),
  avatar   VARCHAR(250),
  code     BIGINT (6)   NOT NULL DEFAULT 0,
  verified INT    (1)   DEFAULT 0,
  verified_at DATETIME          NULL,
  is_admin INT    (1)   DEFAULT 0
);


INSERT INTO users (email, password, username, verified, is_admin)
VALUES ('admin', '$2y$10$evd45QEZnuoGprgPduthzOt5X1gOtt1irATKZMZ0qJY9rh4g2F9PG', 'Administrator', 1, 1);


CREATE TABLE baza
(
  base_avatar VARCHAR(200)
);

INSERT INTO baza (base_avatar)
VALUES ('../assets/avatars/defaultAvatar.png');


CREATE TABLE films (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(250),
  year         VARCHAR(250),
  genre     VARCHAR(250),
  description        TEXT,
  film_image VARCHAR(250),
  trailer     VARCHAR(250),
  video       VARCHAR(100),
  rating       VARCHAR(10)
);

INSERT INTO `films` (`id`, `title`, `year`, `genre`, `description`, `film_image`, `trailer`, `video`) VALUES
  (1, 'Pirates of the Caribbean', '2003', 'Pirats', 'The Curse of the Black Pearl', '../assets/films/piraty1.webp', 'https://www.youtube.com/embed/a27YX-ToMM4?si=mzkNkwNw_IzQDp19', 'https://www.youtube.com/embed/NrNejxB91bA?si=giRw0K2vmESkHgU_');


CREATE TABLE review (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  film_id     BIGINT NOT NULL,
  user_id     BIGINT NOT NULL,
  text        TEXT NOT NULL,
  rating      INT  NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT REVIEW_FILM FOREIGN KEY (film_id) REFERENCES films (id) ON DELETE CASCADE,
  CONSTRAINT REVIEW_USER FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE comments
(
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  film_id    BIGINT  NOT NULL,
  user_id    BIGINT  NOT NULL,
  text       TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT COMMENT_FILM FOREIGN KEY (film_id) REFERENCES films (id) ON DELETE CASCADE,
  CONSTRAINT COMMENT_USER FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
