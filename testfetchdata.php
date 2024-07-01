<?php
$servername = "localhost";
$dbname = "id22209619_gfoss_lab";
$username = "id22209619_root";
$password = "Root123@";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}

// Validate and sanitize input
if ((!isset($_POST['deviceId']) || !is_numeric($_POST['deviceId'])) && (!isset($_GET['deviceId']) || !is_numeric($_GET['deviceId']))) {
    die(json_encode(['error' => 'Invalid Device ID']));
}

$deviceId = isset($_POST['deviceId']) ? (int)$_POST['deviceId'] : (int)$_GET['deviceId'];

// Query to fetch sensor data
$sql = "SELECT value, timestamp FROM DeviceData WHERE DeviceID='$deviceId' ORDER BY timestamp DESC LIMIT 100";

error_log("Device ID: $deviceId");
$result = $conn->query($sql);

if (!$result) {
    die(json_encode(['error' => 'Query failed: ' . $conn->error]));
}
error_log("Number of rows fetched: " . $result->num_rows);

$values = [];
$timestamps = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $values[] = is_numeric($row['value']) ? (float)$row['value'] : $row['value']; // Convert to float if numeric
        $timestamps[] = $row['timestamp'];
    }
}

$data = [
    'values' => $values,
    'labels' => $timestamps
];

echo json_encode($data);

$conn->close();
?>
