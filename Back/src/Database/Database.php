<?php

namespace App\Database;

use PDO;
use PDOException;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

class Database {
  public static function connect(): PDO {
    try {
      $dns = "mysql:host={$_ENV['DB_HOST']};port={$_ENV['DB_PORT']};dbname={$_ENV['DB_NAME']};charset=utf8mb4";
      $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
      ];

      return new PDO($dns, $_ENV['DB_USER'], $_ENV['DB_PASS'], $options);

    } catch (PDOException $e) {
      http_response_code(500);
      echo  json_encode([
        'success' => false,
        'message' => 'Database connection error:' . $e->getMessage()
      ]);
      exit;
    }
  }
}
