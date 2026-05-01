/*
╔══════════════════════════════════════════════════════════════════════╗
║  GENERATE-INDEX.JS                                                    ║
║  Script pour générer l'index de recherche des pages                 ║
║                                                                      ║
║  UTILISATION:                                                         ║
║  1. Ajouter de nouveaux fichiers HTML dans les dossiers spécialités  ║
║  2. Exécuter: node generate-index.js                                 ║
║  3. Les nouvelles pages seront automatiquement incluses              ║
╚══════════════════════════════════════════════════════════════════════╝
*/

const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

// Liste des spécialités (dossiers)
const specialties = [
    'cardiologie', 'endocrinologie', 'dermatologie', 'urologie', 
    'infectiologie', 'ophtalmologie', 'medecine-interne', 'pneumologie',
    'gastrologie', 'gynecologie', 'pediatrie', 'hematologie', 
    'orl', 'rhumatologie', 'ecg', 'neurologie', 'autres',
    'medicaments-urgence', 'urgence', 'ordonnances', 'cat-consultation', 'reanimation'
];

let pages = [];

console.log('\n📁 Scan des dossiers...\n');

specialties.forEach(specialty => {
    const dirPath = path.join(baseDir, specialty);
    
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        
        files.forEach(file => {
            if (file.endsWith('.html') && file !== 'index.html') {
                // Formater le titre nicely: hyphen -> espace, capitalize
                let title = file.replace('.html', '')
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase());
                
                pages.push({
                    title: title,
                    path: `${specialty}/${file}`,
                    specialty: specialty
                });
            }
        });
    }
});

// Trier alphabetically
pages.sort((a, b) => a.title.localeCompare(b.title, 'fr'));

// Écrire dans le fichier JSON
fs.writeFileSync(
    path.join(baseDir, 'pages-index.json'), 
    JSON.stringify(pages, null, 2)
);

console.log(`✅ Index généré: ${pages.length} pages\n`);

// Afficher un résumé par spécialité
const countBySpecialty = {};
pages.forEach(p => {
    countBySpecialty[p.specialty] = (countBySpecialty[p.specialty] || 0) + 1;
});

console.log('📊 Résumé par spécialité:');
Object.entries(countBySpecialty).forEach(([spec, count]) => {
    console.log(`   ${spec}: ${count} pages`);
});

console.log('\n✨ Pour mettre à jour l\'index après ajout de fichiers: node generate-index.js\n');