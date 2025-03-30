
# Steam Login Helper - PHP Version

This is a modern PHP implementation of the Steam Login Helper application with MySQL database integration for XAMPP.

## Setup Instructions

1. Install XAMPP if you haven't already
2. Clone or download this repository to your XAMPP htdocs folder (e.g., `C:\xampp\htdocs\steam-login-helper`)
3. Start Apache and MySQL services in XAMPP control panel
4. Create the database by importing the `setup.sql` file:
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Click on "Import" tab
   - Select the `setup.sql` file and click "Go"
5. Make sure you have added the required images in the `assets` directory:
   - `assets/steam-bg.jpg`
   - `assets/steam-logo.png`
6. Visit the application in your browser: http://localhost/steam-login-helper

## Default Admin Login

- Username: admin
- Password: admin123

## Security Notes

This project is for demonstration purposes. In a production environment, you should:

1. Use stronger password hashing
2. Implement rate limiting for login attempts
3. Use HTTPS
4. Set up proper MySQL user permissions
5. Remove any debugging information
6. Configure proper error logging

## Directory Structure

- `/` - Root directory containing the main application files
- `/assets` - Static assets (images)
- `setup.sql` - Database setup script
- `config.php` - Database and application configuration
- `index.php` - Steam login page
- `loading.php` - Loading screen
- `steam-guard.php` - Steam Guard verification page
- `admin.php` - Admin panel
- `admin_login.php` - Admin login page
- Various API endpoints for handling application logic
