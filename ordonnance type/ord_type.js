// Gestion des ordonnances types - ord_type.js

// === Configuration Supabase ===
let supabaseConfig = {
    url: '',
    key: ''
};

// Variable de session pour le mot de passe d'ecriture
let sessionPassword = null;

// Charger la config depuis le serveur
async function loadConfig() {
    try {
        const response = await fetch('/api/config.js');
        const script = await response.text();
        const match = script.match(/window\.ENV\s*=\s*(\{[^}]+\})/);
        if (match) {
            const env = JSON.parse(match[1]);
            console.log('Config chargee:', { SUPABASE_URL: env.SUPABASE_URL, configured: env.configured });
            
            if (env.configured) {
                supabaseConfig = {
                    url: env.SUPABASE_URL || '',
                    key: 'configured'
                };
            }
        }
    } catch (err) {
        console.log('Config non chargee:', err);
    }
}

// Fonction pour obtenir la config
function getSupabaseConfig() {
    return supabaseConfig;
}

// Variables globales
let ordonnanceEnEdition = null;
let medicamentsTemp = [];
let listeMedicaments = [];
let data = {};

// === Initialisation ===
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📌 Initialisation de ord_type.html');
    
    // Charger la config du serveur
    await loadConfig();
    
    // Charger la liste des médicaments
    await chargerListeMedicaments();
    
    // Charger les ordonnances
    await chargerOrdonnancesTypes();
    
    // Initialiser les événements
    initialiserEvenements();
    
    // Mettre à jour les statistiques
    mettreAJourStats();
});

// === Chargement de la liste des médicaments ===
async function chargerListeMedicaments() {
    try {
        const response = await fetch('medicaments.json');
        listeMedicaments = await response.json();
        console.log(`📋 ${listeMedicaments.length} médicaments chargés`);
        
        // Créer la datalist
        creerDatalistMedicaments();
    } catch (error) {
        console.error('Erreur lors du chargement de la liste des médicaments:', error);
    }
}

function creerDatalistMedicaments() {
    let datalist = document.getElementById('liste-medicaments');
    if (!datalist) {
        datalist = document.createElement('datalist');
        datalist.id = 'liste-medicaments';
        document.body.appendChild(datalist);
    }
    
    datalist.innerHTML = listeMedicaments
        .map(med => `<option value="${med.replace(/"/g, '&quot;')}">`)
        .join('');
}

// === Gestion des événements ===
function initialiserEvenements() {
    // Boutons principaux
    const btnEnregistrer = document.getElementById('btn-enregistrer');
    if (btnEnregistrer) btnEnregistrer.addEventListener('click', enregistrerOrdonnance);
    
    const btnAnnuler = document.getElementById('btn-annuler');
    if (btnAnnuler) btnAnnuler.addEventListener('click', annulerEdition);
    
    const btnAjouterMed = document.getElementById('btn-ajouter-medicament');
    if (btnAjouterMed) btnAjouterMed.addEventListener('click', ajouterMedicamentForm);
    
    const btnExporter = document.getElementById('btn-exporter');
    if (btnExporter) btnExporter.addEventListener('click', exporterOrdonnances);
    
    const btnImporter = document.getElementById('btn-importer');
    if (btnImporter) btnImporter.addEventListener('click', () => document.getElementById('input-import').click());
    
    const btnFermer = document.getElementById('btn-fermer');
    if (btnFermer) btnFermer.addEventListener('click', () => window.close());
    
    const btnActualiser = document.getElementById('btn-actualiser');
    if (btnActualiser) btnActualiser.addEventListener('click', actualiserDepuisJSONBin);
    
    const btnTelecharger = document.getElementById('btn-telecharger');
    if (btnTelecharger) btnTelecharger.addEventListener('click', telechargerFichierJSON);
    
    // Import
    const inputImport = document.getElementById('input-import');
    if (inputImport) inputImport.addEventListener('change', importerOrdonnances);
    
    // Recherche - avec vérification de sécurité
    const searchOrdonnances = document.getElementById('search-ordonnances');
    if (searchOrdonnances) {
        searchOrdonnances.addEventListener('input', filtrerOrdonnances);
    }
}

// === Chargement des données ===
async function chargerOrdonnancesTypesDepuisFichier() {
    // Essayer d'abord Supabase (source principale)
    try {
        const supabaseData = await chargerDepuisSupabase();
        if (supabaseData && Object.keys(supabaseData).length > 0) {
            console.log('✅ Charge depuis Supabase:', Object.keys(supabaseData).length, 'ordonnances');
            return supabaseData;
        }
    } catch (e) {
        console.log('Supabase non accessible:', e);
    }
    
    // Fallback: fichier local
    try {
        const response = await fetch('./ordonnances-types.json');
        if (response.ok) {
            const data = await response.json();
            if (data && Object.keys(data).length > 0) {
                console.log('✅ Charge depuis fichier local:', Object.keys(data).length, 'ordonnances');
                return data;
            }
        }
    } catch (e) {
        console.log('Fichier local non accessible');
    }
    
    return {};
}

// === Chargement depuis Supabase ===
async function chargerDepuisSupabase() {
    const config = getSupabaseConfig();
    console.log('=== Chargement Supabase ===');
    console.log('Config:', config);
    
    if (!config.url || !config.key) {
        console.log('Supabase config non configuree');
        return JSON.parse(localStorage.getItem('ordonnancesTypes') || '{}');
    }
    
    try {
        console.log('Appel API /api/save-supabase...');
        const response = await fetch('/api/save-supabase', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error('Erreur HTTP: ' + response.status);
        }
        
        const result = await response.json();
        console.log('Result:', result);
        
        if (result.success && result.data) {
            console.log('=== Succes: ', Object.keys(result.data).length, 'ordonnances chargees');
            return result.data;
        }
        return {};
    } catch (error) {
        console.error('Erreur chargement Supabase:', error);
        return JSON.parse(localStorage.getItem('ordonnancesTypes') || '{}');
    }
}

async function chargerOrdonnancesTypes() {
    // Charger uniquement depuis le fichier JSON
    data = await chargerOrdonnancesTypesDepuisFichier();
    
    // Sauvegarder dans localStorage pour compatibilite
    if (Object.keys(data).length > 0) {
        localStorage.setItem('ordonnancesTypesPourOrd', JSON.stringify(data));
        localStorage.setItem('ordonnancesTypes', JSON.stringify(data));
    }
    
    afficherOrdonnances(data);
    mettreAJourStats();
}

// === Affichage ===
function afficherOrdonnances(data) {
    const container = document.getElementById('liste-ordonnances');
    // Trier par ordre alphabétique français (majuscule = minuscule)
    const noms = Object.keys(data).sort((a, b) => 
        a.toLowerCase().localeCompare(b.toLowerCase(), 'fr')
    );
    
    if (noms.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p>Aucune ordonnance type enregistrée</p>
                <p style="font-size: 0.9rem;">Cliquez sur "Nouvelle ordonnance" pour commencer</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = noms.map(nom => {
        const medicaments = data[nom];
        return `
            <div class="ordonnance-item" data-nom="${nom}">
                <div class="ordonnance-header">
                    <span class="ordonnance-nom">${nom}</span>
                    <span style="color: #6c757d; font-size: 0.85rem;">${medicaments.length} médicament(s)</span>
                </div>
                <div class="ordonnance-medicaments">
                    ${medicaments.map(med => `
                        <div class="medicament-ligne">
                            <span><strong>${med.medicament}</strong></span>
                            <span>${med.posologie}</span>
                            <span>Qté: ${med.quantite}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="ordonnance-actions">
                    <button class="btn btn-secondary btn-editer" data-nom="${nom}">✏️ Modifier</button>
                    <button class="btn btn-danger btn-supprimer" data-nom="${nom}">🗑️ Supprimer</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Ajouter les événements après avoir inséré le HTML
    container.querySelectorAll('.btn-editer').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nom = e.target.dataset.nom;
            editerOrdonnance(nom);
        });
    });
    
    container.querySelectorAll('.btn-supprimer').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nom = e.target.dataset.nom;
            supprimerOrdonnance(nom);
        });
    });
}

function mettreAJourStats() {
    const totalOrdonnances = Object.keys(data).length;
    document.getElementById('stat-total').textContent = totalOrdonnances;
}

// === Gestion du formulaire ===
function nouvelleOrdonnance() {
    ordonnanceEnEdition = null;
    medicamentsTemp = [];
    
    document.getElementById('nom-ordonnance').value = '';
    document.getElementById('medicaments-container').innerHTML = '';
    
    document.getElementById('nom-ordonnance').focus();
    cacherMessage();
}

function ajouterMedicamentForm() {
    const index = medicamentsTemp.length;
    const container = document.getElementById('medicaments-container');
    
    const div = document.createElement('div');
    div.className = 'medicament-form';
    div.dataset.index = index;
    div.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Médicament</label>
                <input type="text" class="input-medicament" placeholder="Nom du médicament" list="liste-medicaments">
            </div>
            <div class="form-group">
                <label>Posologie</label>
                <input type="text" class="input-posologie" placeholder="Ex: 1 comprimé matin et soir">
            </div>
            <div class="form-group">
                <label>Quantité</label>
                <input type="text" class="input-quantite" placeholder="Ex: 10">
            </div>
            <button class="btn btn-danger btn-suppr-med">✕</button>
        </div>
    `;
    
    // Ajouter l'événement avec addEventListener
    const btnSuppr = div.querySelector('.btn-suppr-med');
    btnSuppr.addEventListener('click', () => supprimerMedicamentForm(index));
    
    container.appendChild(div);
    medicamentsTemp.push({ medicament: '', posologie: '', quantite: '' });
}

function supprimerMedicamentForm(index) {
    const container = document.getElementById('medicaments-container');
    const element = container.querySelector(`[data-index="${index}"]`);
    if (element) {
        element.remove();
    }
    // Réindexer
    const forms = container.querySelectorAll('.medicament-form');
    forms.forEach((form, i) => {
        form.dataset.index = i;
        const btn = form.querySelector('.btn-suppr-med');
        // Supprimer l'ancien listener et en ajouter un nouveau
        btn.replaceWith(btn.cloneNode(true));
        const newBtn = form.querySelector('.btn-suppr-med');
        newBtn.addEventListener('click', () => supprimerMedicamentForm(i));
    });
}

function editerOrdonnance(nom) {
    const ordonnance = data[nom];
    if (!ordonnance) return;
    
    ordonnanceEnEdition = nom;
    medicamentsTemp = [...ordonnance];
    
    document.getElementById('nom-ordonnance').value = nom;
    
    // Afficher les médicaments
    const container = document.getElementById('medicaments-container');
    container.innerHTML = '';
    
    ordonnance.forEach((med, index) => {
        const div = document.createElement('div');
        div.className = 'medicament-form';
        div.dataset.index = index;
        div.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Médicament</label>
                    <input type="text" class="input-medicament" value="${med.medicament}" placeholder="Nom du médicament">
                </div>
                <div class="form-group">
                    <label>Posologie</label>
                    <input type="text" class="input-posologie" value="${med.posologie}" placeholder="Ex: 1 comprimé matin et soir">
                </div>
                <div class="form-group">
                    <label>Quantité</label>
                    <input type="text" class="input-quantite" value="${med.quantite}" placeholder="Ex: 10">
                </div>
                <button class="btn btn-danger btn-suppr-med">✕</button>
            </div>
        `;
        
        // Ajouter l'événement avec addEventListener
        const btnSuppr = div.querySelector('.btn-suppr-med');
        btnSuppr.addEventListener('click', () => supprimerMedicamentForm(index));
        
        container.appendChild(div);
    });
    
    cacherMessage();
}

async function enregistrerOrdonnance() {
    const nom = document.getElementById('nom-ordonnance').value.trim();
    
    if (!nom) {
        afficherMessage('Veuillez saisir un nom pour l\'ordonnance.', 'error');
        return;
    }
    
    // Récupérer les médicaments
    const container = document.getElementById('medicaments-container');
    const forms = container.querySelectorAll('.medicament-form');
    const medicaments = [];
    
    for (const form of forms) {
        const medicament = form.querySelector('.input-medicament').value.trim();
        const posologie = form.querySelector('.input-posologie').value.trim();
        const quantite = form.querySelector('.input-quantite').value.trim();
        
        if (!medicament || !posologie || !quantite) {
            afficherMessage('Veuillez remplir tous les champs pour chaque médicament.', 'error');
            return;
        }
        
        medicaments.push({ medicament, posologie, quantite });
    }
    
    if (medicaments.length === 0) {
        afficherMessage('Veuillez ajouter au moins un médicament.', 'error');
        return;
    }
    
    // Supprimer l'ancienne entrée si modification
    if (ordonnanceEnEdition && ordonnanceEnEdition !== nom) {
        delete data[ordonnanceEnEdition];
    }
    
    // Ajouter/Mise à jour
    data[nom] = medicaments;
    
    // Sauvegarder vers JSONBin.io
    await sauvegarderVersFichier(data);
    
    // Afficher
    afficherOrdonnances(data);
    mettreAJourStats();
    
    // Réinitialiser
    nouvelleOrdonnance();
    
    afficherMessage(`Ordonnance "${nom}" enregistrée avec succès !`, 'success');
}

function annulerEdition() {
    nouvelleOrdonnance();
    cacherMessage();
}

async function supprimerOrdonnance(nom) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'ordonnance "${nom}" ?`)) {
        return;
    }
    
    delete data[nom];
    
    // Sauvegarder vers JSONBin.io
    await sauvegarderVersFichier(data);
    
    afficherOrdonnances(data);
    mettreAJourStats();
    
    if (ordonnanceEnEdition === nom) {
        nouvelleOrdonnance();
    }
    
    afficherMessage(`Ordonnance "${nom}" supprimée.`, 'success');
}

// === Export/Import ===
async function exporterOrdonnances() {
    if (Object.keys(data).length === 0) {
        afficherMessage('Aucune ordonnance à exporter.', 'error');
        return;
    }
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    try {
        // Utiliser l'API downloads pour afficher la boîte de dialogue "Enregistrer sous"
        await browser.downloads.download({
            url: url,
            filename: 'ordonnances-types.json',
            saveAs: true  // Affiche la boîte de dialogue
        });
        
        afficherMessage(`${Object.keys(data).length} ordonnance(s) exportée(s).`, 'success');
    } catch (error) {
        console.error('Erreur lors de l\'export:', error);
        // Fallback sur la méthode standard si l'API n'est pas disponible
        const link = document.createElement('a');
        link.href = url;
        link.download = 'ordonnances-types.json';
        link.click();
        afficherMessage(`${Object.keys(data).length} ordonnance(s) exportée(s).`, 'success');
    }
}

async function importerOrdonnances(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            
            if (typeof imported !== 'object' || Array.isArray(imported)) {
                afficherMessage('Format de fichier invalide.', 'error');
                return;
            }
            
            // Demander confirmation pour remplacer ou fusionner
            const action = confirm('Voulez-vous REMPLACER toutes les donnees existantes ?\n\nOK = Remplacer tout\nAnnuler = Fusionner avec les donnees existantes');
            
            if (action) {
                data = imported; // Remplacer
            } else {
                data = { ...data, ...imported }; // Fusionner
            }
            
            // Fusionner
            const nbAjoutes = Object.keys(imported).length;
            
            // Sauvegarder vers JSONBin.io
            await sauvegarderVersFichier(data);
            
            // TELECHARGER le fichier JSON pour remplacer le local
            const dataStr = JSON.stringify(data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'ordonnances-types.json';
            link.click();
            URL.revokeObjectURL(url);
            
            afficherOrdonnances(data);
            mettreAJourStats();
            
            if (action) {
                afficherMessage(`${nbAjoutes} ordonnance(s) importee(s) - Fichier telecharge !`, 'success');
            } else {
                afficherMessage(`${nbAjoutes} nouvelle(s) ordonnance(s) ajoutee(s) - Fusion !`, 'success');
            }
            event.target.value = '';
        } catch (error) {
            afficherMessage('Erreur lors de l\'import : ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
}

// === Recherche ===
function filtrerOrdonnances(event) {
    const recherche = event.target.value.toLowerCase();
    const items = document.querySelectorAll('.ordonnance-item');
    
    items.forEach(item => {
        const nom = item.dataset.nom.toLowerCase();
        const visible = nom.includes(recherche);
        item.style.display = visible ? 'block' : 'none';
    });
}

// === Messages ===
function afficherMessage(message, type) {
    const container = document.getElementById('message');
    container.textContent = message;
    container.className = `message ${type}`;
    container.style.display = 'block';
    
    setTimeout(() => {
        container.style.display = 'none';
    }, 5000);
}

function cacherMessage() {
    const container = document.getElementById('message');
    container.style.display = 'none';
}

// === Sauvegarde vers JSONBin.io ===
function showSyncIndicator(message) {
    const indicator = document.getElementById('sync-indicator');
    const msgElement = document.getElementById('sync-message');
    msgElement.innerHTML = message;
    indicator.classList.add('show');
    setTimeout(() => indicator.classList.remove('show'), 5000);
}

async function sauvegarderVersFichier(data) {
    const config = getSupabaseConfig();
    console.log('=== Sauvegarde Supabase ===');
    console.log('Config:', config);
    console.log('Data:', Object.keys(data).length, 'ordonnances');
    
    // Sauvegarder dans localStorage (pour compatibilite)
    localStorage.setItem('ordonnancesTypes', JSON.stringify(data));
    
    if (!config.url || !config.key) {
        showSyncIndicator('💾 Sauvegarde locale effectué.');
        return;
    }
    
    // Demander le mot de passe OU le nom d'utilisateur
    if (!sessionPassword) {
        const choix = confirm('Voulez-vous saisir le mot de passe admin?\n\nOK = Mot de passe\nAnnuler = Nom d\'utilisateur');
        
        if (choix) {
            // Avec mot de passe → sauvegarde directe
            sessionPassword = prompt('Entrez le mot de passe pour sauvegarder dans le cloud:');
            if (!sessionPassword) {
                showSyncIndicator('💾 Sauvegarde locale uniquement.');
                return;
            }
            
            try {
                const response = await fetch('/api/save-supabase', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: data, password: sessionPassword })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showSyncIndicator('✅ Sauvegarde cloud réussie !');
                    afficherMessage('Ordonnance sauvegardée sur le cloud !', 'success');
                } else {
                    alert('Mot de passe incorrect.');
                    sessionPassword = null;
                    showSyncIndicator('❌ Mot de passe incorrect.');
                }
            } catch (e) {
                showSyncIndicator('❌ Erreur sauvegarde.');
            }
        } else {
            // Sans mot de passe → demander nom d'utilisateur
            const username = prompt('Entrez votre nom:');
            if (!username) {
                showSyncIndicator('💾 Sauvegarde annulée.');
                return;
            }
            
            try {
                const response = await fetch('/api/save-supabase', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: data, username: username })
                });
                
                const result = await response.json();
                
                if (result.success && result.message === 'pending') {
                    showSyncIndicator('⏳ En attente de confirmation admin');
                    afficherMessage('Votre enregistrement sera pris en consideration apres la confirmation de l\'admin', 'info');
                } else {
                    throw new Error(result.message || 'Erreur');
                }
            } catch (e) {
                showSyncIndicator('❌ Erreur sauvegarde.');
            }
        }
    }
}

// === Actualiser depuis Supabase ===
async function actualiserDepuisJSONBin() {
    try {
        const nouvelleData = await chargerDepuisSupabase();
        
        if (Object.keys(nouvelleData).length > 0) {
            data = nouvelleData;
            localStorage.setItem('ordonnancesTypes', JSON.stringify(data));
            afficherOrdonnances(data);
            mettreAJourStats();
            
            showSyncIndicator('✅ Donnees actualisees depuis Supabase !');
            afficherMessage('Donnees actualisees depuis le cloud !', 'success');
        } else {
            showSyncIndicator('⚠️Aucune donnee sur Supabase.');
        }
    } catch (error) {
        console.error('Erreur actualisation:', error);
        showSyncIndicator('❌ Erreur lors de l\'actualisation.');
    }
}

// === Telecharger fichier JSON ===
function telechargerFichierJSON() {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ordonnances-types.json';
    link.click();
    URL.revokeObjectURL(url);
    
    showSyncIndicator('📥 Fichier ordonnances-types.json telecharge !');
    afficherMessage('Fichier JSON telecharge !', 'success');
}
