
<?php
// Database configuration
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'steam_login_helper');

$success = false;
$error = null;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        // Connect without database
        $conn = new PDO("mysql:host=" . DB_SERVER, DB_USERNAME, DB_PASSWORD);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Create database
        $conn->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "`");
        $conn->exec("USE `" . DB_NAME . "`");
        
        // Import SQL from setup.sql
        $sql = file_get_contents('setup.sql');
        $conn->exec($sql);
        
        $success = true;
    } catch(PDOException $e) {
        $error = $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Steam Login Helper - Kurulum</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #171a21;
            color: white;
            font-family: Arial, sans-serif;
        }
    </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-4">
    <div class="bg-[#1b2838]/70 backdrop-blur-sm p-8 rounded-md shadow-lg max-w-md w-full">
        <h1 class="text-2xl font-bold text-white mb-6">Steam Login Helper Kurulumu</h1>
        
        <?php if ($success): ?>
        <div class="bg-green-500/20 border border-green-500 text-green-500 rounded p-4 mb-6">
            <p class="font-bold">Kurulum Başarılı!</p>
            <p>Veritabanı başarıyla oluşturuldu ve tablo yapısı kuruldu.</p>
        </div>
        
        <a href="index.php" class="block text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition-colors">
            Ana Sayfaya Git
        </a>
        
        <?php elseif ($error): ?>
        <div class="bg-red-500/20 border border-red-500 text-red-500 rounded p-4 mb-6">
            <p class="font-bold">Kurulum Başarısız!</p>
            <p><?php echo $error; ?></p>
        </div>
        
        <form method="post" class="mt-6">
            <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition-colors">
                Tekrar Dene
            </button>
        </form>
        
        <?php else: ?>
        <p class="text-white/70 mb-6">
            Bu kurulum sihirbazı, veritabanını oluşturacak ve gerekli tabloları kuracaktır. 
            Devam etmek için aşağıdaki düğmeye tıklayın.
        </p>
        
        <form method="post" class="mt-6">
            <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition-colors">
                Kurulumu Başlat
            </button>
        </form>
        <?php endif; ?>
    </div>
    
    <div class="mt-8 text-white/50 text-sm">
        <p>Bu sayfa sadece ilk kurulum içindir. Kurulum tamamlandıktan sonra güvenlik için kaldırılabilir.</p>
    </div>
</body>
</html>
