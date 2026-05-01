<?php
header('Content-Type: application/json');

// Recevoir les données JSON
$jsonData = file_get_contents('php://input');

if (empty($jsonData)) {
    echo json_encode(['success' => false, 'message' => 'Aucune donnée reçue']);
    exit;
}

// Decoder les données
$data = json_decode($jsonData, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'JSON invalide']);
    exit;
}

// Sauvegarder dans le fichier
$filePath = 'ordonnances-types.json';
$result = file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

if ($result !== false) {
    echo json_encode(['success' => true, 'message' => 'Fichier mis à jour']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erreur d\'écriture']);
}
