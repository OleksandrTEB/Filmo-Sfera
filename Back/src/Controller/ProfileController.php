<?php

namespace App\Controller;

use App\Database\Database;
use App\BaseUrl\BaseUrlFunction;
use PDO;

class ProfileController
{
    public function displayName(): void
    {
        http_response_code(200);
        echo json_encode([
            'username' => $_SESSION['username'],
        ]);
    }

    public function changeUsername(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        $username = $input['username'];
        $email = $_SESSION['email'];

        $pdo = Database::connect();

        $stmt = $pdo->prepare('UPDATE users SET username = :username WHERE email = :email');
        $stmt->execute([
            'username' => $username,
            'email' => $email,
        ]);

        http_response_code(201);
        echo json_encode([
            'success' => true,
        ]);
    }


    public function uploadawatar(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $email = $_SESSION['email'];

        $imageBase64 = $input['image'];
        $name = $input['name'];
        $image = base64_decode($imageBase64);


        $path = BaseUrlFunction::$baseUrl . "avatars/";
        $imageName = $_SESSION['token'] . $name;
        $avatarPath = $path . $imageName;

        $pdo = Database::connect();

        $stmt = $pdo->prepare('SELECT avatar FROM users WHERE email = :email');
        $stmt->execute([
            'email' => $email,
        ]);
        $oldAvatar = $stmt->fetchColumn();


        if ($oldAvatar && file_exists($oldAvatar)) {
            if ($oldAvatar === BaseUrlFunction::$baseUrl . "avatars/defaultAvatar.png") {
            } else {
                unlink($oldAvatar);
            }
        }


        file_put_contents($path . $imageName, $image);

        $stmt = $pdo->prepare('UPDATE users SET avatar = :avatar WHERE email = :email');
        $stmt->execute([
            'avatar' => $avatarPath,
            'email' => $email,
        ]);
        $_SESSION['avatar'] = $avatarPath;

        http_response_code(200);
        echo json_encode([
            'success' => true,
        ]);
    }

    public function displayAvatar(): void
    {
        $imageData = file_get_contents($_SESSION['avatar']);
        $base64 = base64_encode($imageData);
        $fullAvatar = $base64;

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'avatar' => $fullAvatar
        ]);
    }


    public function countReview(): void
    {

        $pdo = Database::connect();
        $stmt = $pdo->prepare('SELECT * FROM review WHERE user_id = :id');
        $stmt->execute([
            'id' => $_SESSION['user_id'],
        ]);
        $count = $stmt->fetchAll();

        $reviews = 0;
        $checked = [];
        foreach ($count as $review) {
            if (!in_array($review['film_id'], $checked)) {
                $reviews += 1;
                $checked[] = $review['film_id'];
            }
        }

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'count_reviews' => $reviews
        ]);
    }

    public function userFilms(): void
    {
        $pdo = Database::connect();
        $user_id = $_SESSION['user_id'];

        $stmtComments = $pdo->prepare("
        SELECT f.id AS film_id, f.title AS film_title, f.film_image AS film_image, c.text AS comment_text, DATE(c.created_at) AS comment_date
        FROM comments c
        JOIN films f ON f.id = c.film_id
        WHERE c.user_id = :user_id
        ORDER BY c.created_at DESC
    ");
        $stmtComments->execute([
            'user_id' => $user_id
        ]);
        $comments = $stmtComments->fetchAll();


        $stmtReviews = $pdo->prepare("
        SELECT f.id AS film_id, f.title AS film_title, f.film_image AS film_image, r.text AS review_text, r.rating AS review_rating, DATE(r.created_at) AS review_date
        FROM review r
        JOIN films f ON f.id = r.film_id
        WHERE r.user_id = :user_id
        ORDER BY r.created_at DESC
    ");
        $stmtReviews->execute([
            'user_id' => $user_id
        ]);
        $reviews = $stmtReviews->fetchAll();

        $films = [];

        foreach ($comments as $comment) {
            $filmId = $comment['film_id'];
            if (!isset($films[$filmId])) {
                $films[$filmId] = [
                    'film_id' => $filmId,
                    'film_title' => $comment['film_title'],
                    'film_image' => $comment['film_image'],
                    'comments' => [],
                ];
            }
            $films[$filmId]['comments'][] = [
                'text' => $comment['comment_text'],
                'date' => $comment['comment_date'],
            ];
        }


        foreach ($reviews as $review) {
            $filmId = $review['film_id'];
            if (!isset($films[$filmId])) {
                $films[$filmId] = [
                    'film_id' => $filmId,
                    'film_title' => $review['film_title'],
                    'film_image' => $review['film_image'],
                    'reviews' => []
                ];
            }
            $films[$filmId]['reviews'][] = [
                'text' => $review['review_text'],
                'date' => $review['review_date'],
                'rating' => $review['review_rating'],
            ];
        }

        $result = array_values($films);

        usort($result, function ($a, $b) {
            return $b['film_id'] <=> $a['film_id'];
        });

        foreach ($result as &$film) {
            $film_image = $film['film_image'];
            $imageData = file_get_contents($film_image);
            $base64 = base64_encode($imageData);
            $film['film_image'] = 'data:image/*;base64,' . $base64;

        }
        unset($film);

        $success = false;
        if (count($films) > 0) {
            $success = true;
        }

        http_response_code(200);
        echo json_encode([
            'success' => $success,
            'films' => $result
        ]);
    }
}
