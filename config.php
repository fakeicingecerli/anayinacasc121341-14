
<?php
// Database configuration
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'steam_login_helper');

// Session management
session_start();

// Security functions
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function generate_csrf_token() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// Check if database exists, if not, try to create it
try {
    // First connect without specifying database
    $temp_pdo = new PDO("mysql:host=" . DB_SERVER, DB_USERNAME, DB_PASSWORD);
    $temp_pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if database exists
    $stmt = $temp_pdo->query("SELECT COUNT(*) FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '" . DB_NAME . "'");
    $dbExists = (bool)$stmt->fetchColumn();
    
    if (!$dbExists) {
        // Create database
        $temp_pdo->exec("CREATE DATABASE `" . DB_NAME . "`");
        
        // Select the database
        $temp_pdo->exec("USE `" . DB_NAME . "`");
        
        // Run setup script
        $sql = file_get_contents('setup.sql');
        $temp_pdo->exec($sql);
        
        // Add notice for first-time setup
        $_SESSION['db_setup_notice'] = true;
    }
    
    // Now connect to the specific database
    $pdo = new PDO("mysql:host=" . DB_SERVER . ";dbname=" . DB_NAME, DB_USERNAME, DB_PASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
} catch(PDOException $e) {
    // Display a more user-friendly message
    die("<div style='font-family: Arial, sans-serif; background-color: #f8d7da; color: #721c24; padding: 20px; margin: 20px; border-radius: 5px; border: 1px solid #f5c6cb;'>
        <h2>Veritabanı Hatası</h2>
        <p><strong>Hata:</strong> Veritabanına bağlanılamadı.</p>
        <p><strong>Ayrıntılar:</strong> " . $e->getMessage() . "</p>
        <p><strong>Çözümler:</strong></p>
        <ol>
            <li>XAMPP'in MySQL servisinin çalıştığından emin olun.</li>
            <li>Komut satırında bu komutu çalıştırın: <code>mysql -u root -p</code> ve enter'a basın.</li>
            <li>Şifre sorulursa boş bırakıp enter'a basın (varsayılan XAMPP kurulumunda şifre yoktur).</li>
            <li>Şu komutu girin: <code>CREATE DATABASE steam_login_helper;</code></li>
            <li>Çıkmak için <code>exit</code> yazın.</li>
            <li>Sayfayı yenileyin.</li>
        </ol>
        <p>Ya da veritabanını kurmak için <a href='install.php' style='color: #721c24; text-decoration: underline;'>otomatik kurulum</a> sayfasını kullanabilirsiniz.</p>
      </div>");
}
?>
