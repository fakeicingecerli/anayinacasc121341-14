
<?php
require_once 'config.php';
header('Content-Type: application/json');

if (isset($_SESSION['credential_id'])) {
    $credential_id = $_SESSION['credential_id'];
    
    // Update the record
    $stmt = $pdo->prepare("UPDATE credentials SET online = 0 WHERE id = ?");
    $stmt->execute([$credential_id]);
    
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'No active session']);
}
?>
