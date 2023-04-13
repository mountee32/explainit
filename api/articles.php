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
  $articles = array();
  while ($row = mysqli_fetch_assoc($result)) {
    $article = array(
      'id' => $row['id'],
      'title' => $row['title'],
      'category' => $row['category'],
      'tags' => $row['tags'],
      'content' => $row['content'],
      'created_at' => $row['created_at'],
      'updated_at' => $row['updated_at']
    );
    $articles[] = $article;
  }
  header('Content-Type: application/json');
  echo json_encode($articles);
} else {
  echo json_encode(array('message' => 'No articles found.'));
}
