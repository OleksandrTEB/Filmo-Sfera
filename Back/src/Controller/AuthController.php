<?php

namespace App\Controller;

use App\Database\Database;
use App\Token\FunctionGenerateToken;

use DateTime;
use PHPMailer\PHPMailer\PHPMailer;


class AuthController
{

//------------------------------checkcookie---------------------------

    public function checkcookie(): void
    {
        $pdo = Database::connect();

        $cookieName = null;
        if (isset($_COOKIE['admincookie'])) {
            $cookieName = 'admincookie';
        }
        if (isset($_COOKIE['cookietoken'])) {
            $cookieName = 'cookietoken';
        }

        if (!$cookieName) {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'message' => 'You must be logged in to access this page!'
            ]);
            return;
        }


        $token = $_COOKIE[$cookieName];
        $_SESSION['token'] = $token;

        $stmt = $pdo->prepare("SELECT * FROM users");
        $stmt->execute();
        $users = $stmt->fetchAll();

        $currentUser = null;
        foreach ($users as $user) {
            $tokenString = $user['token'] ?? '';

            if (!is_string($tokenString) || empty($tokenString)) {
                continue;
            }

            $tokens = json_decode($user['token'], true);
            if (!is_array($tokens)) continue;
            if (in_array($token, $tokens)) {
                $currentUser = $user;
                break;
            }
        }

        if (!$currentUser) {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid user token'
            ]);
            return;
        }


        if ($currentUser['verified'] === 0 || $currentUser['verified'] === null) {
            echo json_encode([
                'verified' => false
            ]);

            return;
        }


        if (!$currentUser) {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid user token'
            ]);
            return;
        }

        $_SESSION['avatar'] = $currentUser['avatar'];
        $_SESSION['email'] = $currentUser['email'];
        $_SESSION['username'] = $currentUser['username'];
        $_SESSION['user_id'] = $currentUser['id'];

        $this->checkActualCode();


        if (empty($_SESSION['avatar'])) {
            $stmt = $pdo->prepare('SELECT base_avatar FROM baza');
            $stmt->execute();
            $result = $stmt->fetch();

            $stmt = $pdo->prepare('UPDATE users SET avatar = :avatar WHERE id = :id');
            $stmt->execute([
                'avatar' => $result['base_avatar'],
                'id' => $_SESSION['user_id']
            ]);

            $_SESSION['avatar'] = $result['base_avatar'];
        }


        if (isset($_COOKIE['admincookie'])) {
            $admin = true;

        } else {
            $admin = false;
        }

        echo json_encode([
            'success' => true,
            'admin' => $admin
        ]);
    }

//------------------------------register---------------------------

    public function register(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);


        $email = $input['email'];
        $_SESSION['email'] = $email;

        $password = $input['password'];
        $username = $input['username'];
        $_SESSION['username'] = $username;

        $country = $input['country'];
        $license = $input['checkboxStatus'];


        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'messageEmail' => 'Invalid email address',
                'isErrorEmail' => true,
            ]);
            return;
        }

        $pdo = Database::connect();

        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
        $stmt->execute(['email' => $email]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode([
                'success' => false,
                'messageAlready' => 'A user with this email already exists.',
                'isErrorAlready' => true,
            ]);
            return;
        }

        if (!preg_match('/^.{8,}$/', $password)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'messagePassword' => 'Password must be at least 8 characters.',
                'isErrorPassword' => true,
            ]);
            return;
        }

        if (!preg_match('/\d/', $password)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'messagePassword' => 'The password must contain at least one digit.',
                'isErrorPassword' => true,
            ]);
            return;
        }

        if (!preg_match('/^(?=.*[a-z]).+$/', $password)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'messagePassword' => 'The password must contain at least one lowercase letter.',
                'isErrorPassword' => true,
            ]);
            return;
        }

        if (!preg_match('/^(?=.*[A-Z]).+$/', $password)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'messagePassword' => 'The password must contain at least one uppercase letter.',
                'isErrorPassword' => true,
            ]);
            return;
        }

        if (!preg_match('/^(?=.*[^A-Za-z\d])/', $password)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'messagePassword' => 'The password must contain at least one special character.',
                'isErrorPassword' => true,
            ]);
            return;
        }

        if (strlen($username) < 3 || strlen($username) > 50) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'messageUsername' => 'Username must be between 3 and 50 characters long.',
                'isErrorUsername' => true,
            ]);
            return;
        }

        $stmt = $pdo->prepare('SELECT * FROM users WHERE username = :username');
        $stmt->execute([
            'username' => $username
        ]);

        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'messageUsername' => 'Username already taken.',
                'isErrorUsername' => true,
            ]);

            return;
        }


        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);


        $stmt = $pdo->prepare('INSERT INTO users (email, password, username, country, license) VALUES (:email, :password, :username,  :country, :license)');
        $stmt->execute([
            'email' => $email,
            'password' => $hashedPassword,
            'username' => $username,
            'country' => $country,
            'license' => $license
        ]);


        http_response_code(201);
        echo json_encode([
            'success' => true,
        ]);

    }

    //---------------------postMessage----------------------

    public function postMessage(): void
    {
        $pdo = Database::connect();
        $mail = new PHPMailer(true);
        $email = $_SESSION['email'] ?? null;
        $username = $_SESSION['username'] ?? null;

        $code = random_int(100000, 999999);
        $stmt = $pdo->prepare('UPDATE users SET code = :code WHERE email = :email');
        $stmt->execute([
            'code' => $code,
            'email' => $email,
        ]);


        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = "agencjafilmosfera@gmail.com";
            $mail->Password = "yjkz rung xtsl woow";
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            $mail->setFrom('agencjafilmosfera@gmail.com', 'Filmo-Sfera');
            $mail->addAddress($email, $username);

            $mail->CharSet = 'UTF-8';
            $mail->isHTML(true);
            $mail->Subject = 'Vryfikacja do Filmo-Sfera';
            $mail->Body = '
                      <!DOCTYPE html>
                      <html lang="pl">
                      <body style="background-color: black; color: white; margin: 0; padding: 0; font-family: Arial, sans-serif; text-align: center;">
                          <div class="form" style="
                                  color: white;
                                  font-size: 15px;
                                  margin: 1rem 0;
                                  border: 1px solid #3d444db3;
                                  background-color: #2128306e;
                                  padding: 0 1rem 1rem 1rem;
                                  border-radius: 5px;">
                              <div class="title" style="margin-top: 1rem; color: white;">
                                  <h1>Weryfikacja konta do Filmo-Sfera</h1>
                              </div>
                              <div class="text" style="margin-bottom: .8rem; color: white;">
                                  Kod weryfikacyjny
                              </div>
                              <div class="code"
                                   style="
                                   margin: 5px 0 0;
                                   padding: 8px 16px;
                                   background-color: #238636;
                                   border-radius: 5px;
                                   font-weight: 600;
                                   letter-spacing: 5px;
                                   font-size: 1.8rem;
                                   width: 150px;
                                   color: white;
                                   display: inline-block;
                              ">
                                  ' . $code . '
                              </div>
                          </div>
                      </body>
                      </html>
                      ';

            $mail->send();

            echo json_encode([
                'success' => true,
            ]);
        } catch (\Exception $e) {
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }

        $created_at = date('Y-m-d H:i:s');
        $stmt = $pdo->prepare('UPDATE users SET verified = 1, verified_at = :created_at WHERE email = :email');
        $stmt->execute([
            'email' => $email,
            'created_at' => $created_at,
        ]);
    }

    //---------------------authenticate----------------------

    public function authenticate(): void
    {
        $pdo = Database::connect();
        $input = json_decode(file_get_contents('php://input'), true);

        $userCode = $input['code'];

        $stmt = $pdo->prepare('SELECT * FROM users WHERE code = :code LIMIT 1');
        $stmt->execute(['code' => $userCode]);

        if ($stmt->fetch()) {
            echo json_encode([
                'success' => true,
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Wrong code'
            ]);
        }
    }

    //---------------------checkActualCode----------------------

    private function checkActualCode(): void
    {
        $email = $_SESSION['email'];
        $pdo = Database::connect();

        $stmt = $pdo->prepare('SELECT verified_at FROM users WHERE email = :email AND verified = 1');
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        if ($user) {
            $date = $user['verified_at'];

            $verified_at = new DateTime($date ?? 'now');
            $now = new DateTime();

            $diff = $now->getTimestamp() - $verified_at->getTimestamp();

            if ($diff > 60) {
                $stmt = $pdo->prepare('UPDATE users SET code = 0, verified_at = NULL WHERE email = :email');
                $stmt->execute(['email' => $email]);
            }

        }
    }

//------------------------------login---------------------------

    public function login(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        $email = $input['email'];
        $_SESSION['email'] = $email;
        $password = $input['password'];

        $pdo = Database::connect();
        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {

            if ($user['verified'] === 0 || $user['verified'] === null) {
                echo json_encode([
                    'verified' => false
                ]);

                return;
            }

            $genToken = new FunctionGenerateToken();
            $token = $genToken->generateToken($email);

            if ($user['is_admin'] === 1) {
                setcookie("admincookie", $token, time() + 3600 * 24 * 365, "/");
                $isAdmin = true;
            } else {
                setcookie("cookietoken", $token, time() + 3600 * 24 * 365, "/");
                $isAdmin = false;
            }

            $userToken = $user['token'] ?? '';
            $tokens = json_decode($userToken, true);
            if (!is_array($tokens)) {
                $tokens = [];
            }

            $currentToken = $token;

            if (!in_array($currentToken, $tokens)) {
                $tokens[] = $token;
            }
            $updateTokens = json_encode($tokens);


            $stmt = $pdo->prepare('UPDATE users SET token = :token WHERE email = :email');
            $stmt->execute([
                'token' => $updateTokens,
                'email' => $email
            ]);

            echo json_encode([
                'success' => true,
                'admin' => $isAdmin
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid email or password.'
            ]);
        }
    }

//------------------------------logout---------------------------

    public function logout(): void
    {
        $pdo = Database::connect();
        $stmt = $pdo->prepare('SELECT token FROM users WHERE email = :email');
        $stmt->execute([
            'email' => $_SESSION['email'],
        ]);
        $user = $stmt->fetch();

        $tokensRaw = $user['token'];
        if (is_array($tokensRaw)) {
            $tokens = $tokensRaw;
        } else {
            $tokens = json_decode($tokensRaw, true);;
        }

        if (!is_array($tokens)) {
            $tokens = [];
        }


        $currenToken = null;
        if (isset($_COOKIE['cookietoken'])) {
            $currenToken = $_COOKIE['cookietoken'];
        } elseif (isset($_COOKIE['admincookie'])) {
            $currenToken = $_COOKIE['admincookie'];
        }

        $key = array_search($currenToken, $tokens);
        if ($key !== false) {
            unset($tokens[$key]);
            $tokens = array_values($tokens);
        }

        $stmt = $pdo->prepare('UPDATE users SET token = :token WHERE email = :email');
        $stmt->execute([
            'token' => json_encode($tokens),
            'email' => $_SESSION['email'],
        ]);


        session_destroy();
        setcookie('cookietoken', '', time() - 1, '/');
        setcookie('admincookie', '', time() - 1, '/');

        http_response_code(200);
        echo json_encode([
            'success' => true,
        ]);
    }
}
