// Script pour charger la bibliothèque XLSX
function loadXLSX() {
    if (typeof XLSX !== 'undefined') {
        console.log('Bibliothèque XLSX déjà chargée');
        return;
    }
    
    console.log('Chargement de la bibliothèque XLSX...');
    // La bibliothèque est déjà chargée via le tag script dans le HTML
}

// Charger au démarrage
document.addEventListener('DOMContentLoaded', loadXLSX);