<?php
// Connect to the database
$host = "localhost";
$user = 'u383132761_GG78';
$password = 'Jump6565%True';
$database = 'u383132761_explaint';
$connection = mysqli_connect($host, $user, $password, $database);
if (!$connection) {
  die("Connection failed: " . mysqli_connect_error());
}

// Define the number of articles per page and the current page
$articlesPerPage = 10;
if (isset($_GET["page"])) {
  $currentPage = $_GET["page"];
} else {
  $currentPage = 1;
}

// Retrieve the total number of articles
$sql = "SELECT COUNT(*) AS num_articles FROM articles WHERE status = 'Published'";
$result = mysqli_query($connection, $sql);
$row = mysqli_fetch_assoc($result);
$numArticles = $row["num_articles"];

// Calculate the total number of pages
$numPages = ceil($numArticles / $articlesPerPage);

// Calculate the offset of the current page
$offset = ($currentPage - 1) * $articlesPerPage;

// Retrieve the articles for the current page
$sql = "SELECT * FROM articles WHERE status = 'Published' ORDER BY created_at DESC LIMIT $offset, $articlesPerPage";
$result = mysqli_query($connection, $sql);
if (mysqli_num_rows($result) > 0) {
  echo "<ul>";
  while ($row = mysqli_fetch_assoc($result)) {
    echo "<li><a href=\"article.php?id=" . $row["id"] . "\">" . $row["title"] . "</a></li>";
  }
  echo "</ul>";
} else {
  echo "<p>No articles found.</p>";
}

// Display the pagination links
echo "<div class=\"pagination\">";
echo "<span>Page $currentPage of $numPages:</span>";
if ($currentPage > 1) {
  echo "<a href=\"?page=" . ($currentPage - 1) . "\">Prev</a>";
}
for ($i = 1; $i <= $numPages; $i++) {
  if ($i == $currentPage) {
    echo "<span>$i</span>";
  } else {
    echo "<a href=\"?page=$i\">$i</a>";
  }
}
if ($currentPage < $numPages) {
  echo "<a href
