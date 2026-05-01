
// Fonction pour mettre à jour la taille de police dans le certificat
function updateFontSizeInCertificat(fontSize, certificatType) {
    // Mettre à jour la taille de police dans le style CSS du certificat
    const styleElement = document.createElement('style');
    // Ne modifier que la version à imprimer, laisser la version HTML inchangée
    styleElement.textContent = "@media print { body { font-size: " + fontSize + "pt !important; } " +
                               ".certificat { font-size: " + fontSize + "pt !important; } " +
                               "h1 { font-size: " + (parseInt(fontSize) + 4) + "pt !important; } " +
                               "p { font-size: " + fontSize + "pt !important; } " +
                               "input[type=text], input[type=date], textarea { font-size: " + fontSize + "pt !important; } " +
                               ".print-button { display: none !important; } }";

    // Supprimer l'ancien style s'il existe
    const oldStyle = document.getElementById(certificatType + 'FontSizeStyle');
    if (oldStyle) {
        oldStyle.remove();
    }

    // Ajouter le nouveau style
    styleElement.id = certificatType + 'FontSizeStyle';
    document.head.appendChild(styleElement);

    // Stocker la taille de police dans localStorage
    localStorage.setItem(certificatType + 'FontSize', fontSize);
}

// Fonction pour mettre à jour la taille de police spécifique aux lésions
function updateFontSizeForLesions(fontSize) {
    // Mettre à jour la taille de police dans le style CSS du certificat
    const styleElement = document.createElement('style');
    // Ne modifier que la version à imprimer, laisser la version HTML inchangée
    styleElement.textContent = "@media print { " +
                               "body { font-size: " + fontSize + "pt !important; } " +
                               ".certificat { font-size: " + fontSize + "pt !important; } " +
                               "h1 { font-size: " + (parseInt(fontSize) + 4) + "pt !important; } " +
                               "p { font-size: " + fontSize + "pt !important; } " +
                               "input[type=text], input[type=date], textarea { font-size: " + fontSize + "pt !important; } " +
                               "strong { font-size: " + fontSize + "pt !important; } " +
                               ".docteur { font-size: " + fontSize + "pt !important; } " +
                               ".print-button { display: none !important; } " +
                               "}";

    // Supprimer l'ancien style s'il existe
    const oldStyle = document.getElementById('lesionsFontSizeStyle');
    if (oldStyle) {
        oldStyle.remove();
    }

    // Ajouter le nouveau style
    styleElement.id = 'lesionsFontSizeStyle';
    document.head.appendChild(styleElement);

    // Stocker la taille de police dans localStorage
    localStorage.setItem('lesionsFontSize', fontSize);
}

// Attendre que le document soit chargé
document.addEventListener('DOMContentLoaded', () => {
    // Déterminer le type de certificat
    const title = document.title;
    let certificatType = 'certificat'; // Type par défaut

    if (title.includes('Justification')) {
        certificatType = 'justification';
    } else if (title.includes('Inaptitude')) {
        certificatType = 'inaptSport';
} else if (title.includes('arrêt')) {
        certificatType = 'arretTravail';
    } else if (title.includes('descriptif') || title.includes('Radiox') || title.includes('CBV')) {
        certificatType = 'cbv';
    }

    // Charger la taille de police sauvegardée
    const savedFontSize = localStorage.getItem(certificatType + 'FontSize') || '14';
    const fontSizeInput = document.getElementById('fontSize');

    if (fontSizeInput) {
        fontSizeInput.value = savedFontSize;

        // Ajouter un écouteur pour sauvegarder la taille de police quand elle change
        fontSizeInput.addEventListener('input', () => {
            const fontSize = fontSizeInput.value;
            updateFontSizeInCertificat(fontSize, certificatType);
        });

        // Appliquer la taille de police initiale
        updateFontSizeInCertificat(savedFontSize, certificatType);
    }

    // Gérer les cases de taille de police pour les lésions
    const fontSize1Input = document.getElementById('fontSize1');
    const fontSize2Input = document.getElementById('fontSize2');

    // Charger la taille de police sauvegardée pour les lésions
    const savedLesionsFontSize = localStorage.getItem('lesionsFontSize') || '14';

    if (fontSize1Input) {
        fontSize1Input.value = savedLesionsFontSize;
        fontSize1Input.addEventListener('input', () => {
            const fontSize = fontSize1Input.value;
            updateFontSizeForLesions(fontSize);
        });
    }

    if (fontSize2Input) {
        fontSize2Input.value = savedLesionsFontSize;
        fontSize2Input.addEventListener('input', () => {
            const fontSize = fontSize2Input.value;
            updateFontSizeForLesions(fontSize);
        });
    }

    // Appliquer la taille de police initiale pour les lésions
    updateFontSizeForLesions(savedLesionsFontSize);
});

// Appliquer la taille de police quand la page est chargée
window.addEventListener('load', () => {
    // Déterminer le type de certificat
    const title = document.title;
    let certificatType = 'certificat'; // Type par défaut

    if (title.includes('Justification')) {
        certificatType = 'justification';
    } else if (title.includes('Inaptitude')) {
        certificatType = 'inaptSport';
} else if (title.includes('arrêt')) {
        certificatType = 'arretTravail';
    } else if (title.includes('descriptif') || title.includes('Radiox') || title.includes('CBV')) {
        certificatType = 'cbv';
    }

    const savedFontSize = localStorage.getItem(certificatType + 'FontSize') || '14';
    updateFontSizeInCertificat(savedFontSize, certificatType);
});
