<?php

namespace App\Controller;

use App\Database\Database;
use App\BaseUrl\BaseUrlFunction;

class FilmsController
{
  public function uploadFilm(): void
  {
    $input = json_decode(file_get_contents('php://input'), true);

    $imageFilm = $input['imageFilm'];
    $imageBase64 = base64_decode($imageFilm);
    $name = $input['name'];
    $title = $input['title'];
    $genre = $input['genre'];
    $year = $input['year'];
    $description = $input['description'];
    $trailer = $input['trailer'];
    $video = $input['video'];

    $path = BaseUrlFunction::$baseUrl . "films/";
    $imageName = $name;
    $filmPath = $path . $imageName;

    file_put_contents($path . $imageName, $imageBase64);

    $pdo = Database::connect();

    $stmt = $pdo->prepare('INSERT INTO films (title, year, genre, description, film_image, trailer, video) VALUES (:title, :year, :genre, :description, :film_image, :trailer, :video)');
    $stmt->execute([
      'title' => $title,
      'year' => $year,
      'genre' => $genre,
      'description' => $description,
      'film_image' => $filmPath,
      'trailer' => $trailer,
      'video' => $video,
    ]);

    http_response_code(201);
    echo json_encode([
      'success' => true,
    ]);
  }


  public function loadFilm(): void
  {

    $pdo = Database::connect();

    $stmt = $pdo->prepare('SELECT * FROM films');
    $stmt->execute();
    $films = $stmt->fetchAll();

    foreach ($films as &$film) {
      $imageData = file_get_contents($film['film_image']);
      $base64 = base64_encode($imageData);
      $film_image = 'data:image/*;base64,' . $base64;

      $film['film_image'] = $film_image;
    }
    unset($film);

    http_response_code(200);
    echo json_encode([
      'success' => true,
      'films' => $films,
    ]);
  }


  public function searchFilm(): void
  {
    $input = json_decode(file_get_contents('php://input'), true);

    $film_id = $input['filmId'];

    $pdo = Database::connect();

    $stmt = $pdo->prepare('SELECT * FROM films WHERE id = :id');
    $stmt->execute(['id' => $film_id]);
    $film = $stmt->fetch();

    $film_id = $film['id'];
    $_SESSION['film_id'] = $film_id;
    $title = $film['title'];
    $year = $film['year'];
    $genre = $film['genre'];
    $description = $film['description'];
    $film_image = $film['film_image'];


    $imageData = file_get_contents($film_image);
    $base64 = base64_encode($imageData);
    $film_image = 'data:image/*;base64,' . $base64;


    $trailer = $film['trailer'];
    $video = $film['video'];
    $rating = $film['rating'];

    http_response_code(200);
    echo json_encode([
      'success' => true,
      'id' => $film_id,
      'title' => $title,
      'year' => $year,
      'genre' => $genre,
      'description' => $description,
      'film_image' => $film_image,
      'trailer' => $trailer,
      'video' => $video,
      'rating' => $rating,
    ]);
  }
}
