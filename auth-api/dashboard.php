<?php
require 'guard.php';

echo json_encode(["username" => $_SESSION['username']]);
