<?php
// Connect to your database (replace hostname, username, password, and dbname with your actual database credentials)
$conn = new mysqli("localhost", "root", "", "a_n_insurance");
// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch data from the database using JOIN
$sql = "SELECT signin.name, signin.password, customer.cname
        FROM signin
        JOIN customer ON signin.name = customer.cname";
$result = $conn->query($sql);

// Check if any rows are returned
if ($result->num_rows > 0) {
    // Start creating the HTML table
    echo "<table>
            <tr>
                <th>signin name</th>
                <th>signpassword</th>
                <th>customername</th>
            </tr>";

    // Loop through the rows of data
    while ($row = $result->fetch_assoc()) {
        // Extract the values from the row
        $orderId = $row["name"];
        $orderDate = $row["password"];
        $customerName = $row["cname"];

        // Display the row in the HTML table
        echo "<tr>
                <td>$orderId</td>
                <td>$orderDate</td>
                <td>$customerName</td>
            </tr>";
    }

    // Close the HTML table
    echo "</table>";
} else {
    echo "No data available.";
}

// Close the database connection
$conn->close();
?>