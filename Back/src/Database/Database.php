<?php

namespace App\Database;

use PDO;
use PDOException;


class Database
{
    public static function connect(): PDO
    {
        $host = "localhost";
        $dbname = "filmosfera";
        $user = "root";
        $password = "";
        $port = 3306;

        try {
            $dns = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            return new PDO($dns, $user, $password, $options);

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database connection error:' . $e->getMessage()
            ]);
            exit;
        }
    }
}
