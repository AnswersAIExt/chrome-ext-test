<?php
// verify_token.php

require_once 'config.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Only POST allowed');
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['credential'])) {
    http_response_code(400);
    exit('Missing credential');
}

$idToken = $input['credential'];

// Verify ID Token via Google
$tokenInfo = json_decode(file_get_contents("https://oauth2.googleapis.com/tokeninfo?id_token={$idToken}"), true);

if (!isset($tokenInfo['email']) || $tokenInfo['aud'] !== GOOGLE_CLIENT_ID) {
    http_response_code(401);
    exit('Invalid ID token');
}

// Set session
$_SESSION['user'] = [
    'email' => $tokenInfo['email'],
    'name' => $tokenInfo['name'] ?? '',
    'picture' => $tokenInfo['picture'] ?? '',
    'sub' => $tokenInfo['sub'], // Unique Google user ID
];
$_SESSION['request_count'] = 0; // start fresh
$_SESSION['created_at'] = time();

// Return success
echo json_encode(['success' => true]);
?>
