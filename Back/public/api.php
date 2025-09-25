<?php

session_start();

$allowed_origins = [
  'http://localhost:4200',
  'http://192.168.0.135'
];

if(isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
  header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
}

header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

require __DIR__ . '/../vendor/autoload.php';

//---Router
use App\Router\Router;

//---Controllers
use App\Controller\AuthController;
use App\Controller\ReviewController;
use App\Controller\CommentController;
use App\Controller\FilmsController;
use App\Controller\ProfileController;

//---Middlewares
use App\Middleware\AuthMiddelware;
use App\Middleware\AdminMiddelware;




//---Router
$router = new Router();

//---Controllers
$reviewController = new ReviewController();
$commentController = new CommentController();
$filmsController = new FilmsController();
$profileController = new ProfileController();
$authController = new AuthController();


//---Middlewares
$authMiddelware = new AuthMiddelware();
$adminMiddelware = new AdminMiddelware();




$router->post('/checkCookie', fn() => $authController->checkcookie());
$router->post('/login', fn() => $authController->login());
$router->post('/register', fn() => $authController->register());
$router->post('/postMessage', fn() => $authController->postMessage());
$router->post('/authenticate', fn() => $authController->authenticate());
$router->get('/displayName', [$authMiddelware, fn() => $profileController->displayName()]);
$router->post('/changeusername', [$authMiddelware, fn() => $profileController->changeUsername()]);
$router->get('/displayAvatar', [$authMiddelware, fn() => $profileController->displayAvatar()]);
$router->get('/countReview', [$authMiddelware, fn() => $profileController->countReview()]);
$router->put('/uploadAvatar', [$authMiddelware, fn() => $profileController->uploadawatar()]);
$router->get('/userFilms', [$authMiddelware, fn() => $profileController->userFilms()]);
$router->put('/uploadFilm', [$adminMiddelware, fn() => $filmsController->uploadFilm()]);
$router->get('/loadfilm', [$authMiddelware, fn() => $filmsController->loadfilm()]);
$router->post('/searchfilm', [$authMiddelware, fn() => $filmsController->searchfilm()]);
$router->post('/addcomm', [$authMiddelware, fn() => $commentController->addcomm()]);
$router->get('/getcomment', [$authMiddelware, fn() => $commentController->getcomment()]);
$router->post('/searchCommentFromDelete', [$authMiddelware, fn() => $commentController->searchCommentFromDelete()]);
$router->post('/deleteComment', [$authMiddelware, fn() => $commentController->deleteComment()]);
$router->post('/addReview', [$authMiddelware, fn() => $reviewController->addReview()]);
$router->get('/getReview', [$authMiddelware, fn() => $reviewController->getReview()]);
$router->post('/searchReviewFromDelete', [$authMiddelware, fn() => $reviewController->searchReviewFromDelete()]);
$router->post('/deleteReview', [$authMiddelware, fn() => $reviewController->deleteReview()]);
$router->post('/logout', [$authMiddelware, fn() => $authController->logout()]);


$router->run();
