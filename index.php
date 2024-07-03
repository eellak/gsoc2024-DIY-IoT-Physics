<?php
session_start();
if (!isset($_SESSION["username"])) {
    header("Location: login.php");
    exit();
}

$servername = "localhost";
$dbname = "id22209619_gfoss_lab";
$username = "id22209619_root";
$password = "Root123@";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$current_username = $_SESSION["username"];

// Fetch user and access data
$user_sql = "SELECT u.*, ua.AccessType FROM Users u
             JOIN UserAccess ua ON u.UserID = ua.UserID
             WHERE u.Username = '$current_username'";
$user_result = $conn->query($user_sql);
$user_data = $user_result->fetch_assoc();

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="gsoc2024-DIY-IoT-Physics/css/style.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>
    <div class="dashboard">
        <aside class="sidebar">
            <div class="user-details">
                <h3><?php echo htmlspecialchars($user_data['Username']); ?></h3>
                <p><?php echo htmlspecialchars($user_data['AccessType']); ?></p>
            </div>
        </aside>
        <main class="main-content">
            <div class="content-header">
                <h2>Dashboard</h2>
                <button id="theme-toggle">Toggle Theme</button>
            </div>
        </main>
    </div>
    <script src="dashboard.js"></script>
</body>

</html>