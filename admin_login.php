
<?php
require_once 'config.php';

// Check if admin is already logged in
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header("Location: admin.php");
    exit;
}

$error = '';

// Process login
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = sanitize_input($_POST['username']);
    $password = sanitize_input($_POST['password']);
    
    // Check credentials
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
    $stmt->execute([$username]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin && password_verify($password, $admin['password_hash'])) {
        // Set admin session
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $admin['username'];
        
        // Update last login time
        $stmt = $pdo->prepare("UPDATE admins SET last_login = NOW() WHERE id = ?");
        $stmt->execute([$admin['id']]);
        
        // Redirect to admin panel
        header("Location: admin.php");
        exit;
    } else {
        $error = "Geçersiz kullanıcı adı veya parola.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Girişi</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #1b2838;
            color: white;
            font-family: Arial, sans-serif;
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">
    <div class="bg-[#2a475e]/80 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 class="text-2xl font-bold text-center mb-6">Admin Girişi</h1>
        
        <?php if ($error): ?>
        <div class="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            <?php echo $error; ?>
        </div>
        <?php endif; ?>
        
        <form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
            <div class="space-y-4">
                <div>
                    <label for="username" class="block text-sm font-medium">Kullanıcı Adı</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        class="mt-1 block w-full bg-[#32353c] border border-[#32353c] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                </div>
                
                <div>
                    <label for="password" class="block text-sm font-medium">Parola</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        class="mt-1 block w-full bg-[#32353c] border border-[#32353c] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                </div>
                
                <div>
                    <button 
                        type="submit" 
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Giriş Yap
                    </button>
                </div>
            </div>
        </form>
        
        <div class="mt-6 text-center">
            <a href="index.php" class="text-sm text-blue-400 hover:underline">Ana Sayfaya Dön</a>
        </div>
    </div>
</body>
</html>
