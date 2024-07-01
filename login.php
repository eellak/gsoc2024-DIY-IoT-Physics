<?php
session_start();

$servername = "localhost";
$dbname = "id22209619_gfoss_lab";
$username = "id22209619_root";
$password = "Root123@";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $username = test_input($_POST["username"]);
    $password = test_input($_POST["password"]);
    $passwordHash = hash('sha256', $password);

    $sql = "SELECT * FROM Users WHERE Username='$username' AND PasswordHash='$passwordHash' AND IsApproved=1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Login successful
        $_SESSION["username"] = $username;
        header("Location: index.php");
        exit(); // Always exit after a redirect to prevent further script execution
    } else {
        $error_message = "Invalid username or password, or account not approved.";
    }

    $conn->close();
}

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
    <link rel="stylesheet" type="text/css" href="gsoc2024-DIY-IoT-Physics/css/style.css">
</head>
<body>
<div class="container">
    <h2>Login</h2>
    <?php if (isset($error_message)): ?>
        <div class='error'><?php echo $error_message; ?></div>
    <?php endif; ?>
    <form method="post" action="login.php">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <input type="submit" value="Login">
    </form>
    <a href="signup.php">Don't have an account? Sign up</a>
</div>
</body>
</html>
