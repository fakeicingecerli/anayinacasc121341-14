
<?php
$error_msg = isset($_GET['msg']) ? $_GET['msg'] : 'unknown';
$error_message = '';

switch ($error_msg) {
    case 'blocked':
        $error_message = 'Bu IP adresi engellenmiştir.';
        break;
    case 'db_error':
        $error_message = 'Veritabanı hatası oluştu.';
        break;
    default:
        $error_message = 'Bilinmeyen bir hata oluştu.';
        break;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hata</title>
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
    <div class="bg-[#1b2838]/70 backdrop-blur-sm p-8 rounded-md shadow-lg max-w-md w-full text-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-red-500 mx-auto mb-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <h1 class="text-xl font-bold text-white mb-2">Hata</h1>
        <p class="text-white/70 mb-6"><?php echo $error_message; ?></p>
        
        <a href="index.php" class="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
            Ana Sayfaya Dön
        </a>
    </div>
</body>
</html>
