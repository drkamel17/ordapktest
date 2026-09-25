// Style pour forcer la taille de police des champs date à 11px
const style = document.createElement('style');
style.textContent = `
    input[type="date"] {
        font-size: 11px !important;
    }
`;
document.head.appendChild(style);

// Fonction personnalisée pour conserver les retours à la ligne
function trimPreserveNewlines(text) {
    return text.replace(/^\s+|\s+$/g, '');
}

// Fonction pour sauvegarder les modifications des champs
function sauvegarderModifications() {
    const textInputs = document.querySelectorAll('.full-width-input');
    textInputs.forEach(input => {
        input.addEventListener('input', () => {
            input.setAttribute('value', input.value);
        });
    });
}

// Convertir une date ISO (AAAA-MM-JJ, format des inputs date) en format français (JJ/MM/AAAA)
function convertirDateFr(isoDate) {
    if (!isoDate) return '';
    const m = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
    return isoDate;
}

// Fonction pour charger les données
function loadData() {
    const polyclinique = localStorage.getItem('polyclinique') || '';
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || '';
    const docteur = localStorage.getItem('docteur') || '';

    // Charger les données du patient
    let patientNomPrenom = localStorage.getItem('patientNomPrenom') || '';
    let patientAge = localStorage.getItem('patientAge') || '';
    let patientDateNaissance = localStorage.getItem('patientDateNaissance') || '';
    let dateCertificat = localStorage.getItem('dateCertificat') || '';
    let patientNumero = localStorage.getItem('patientNumero') || '';

    // Pré-remplir par défaut depuis les valeurs saisies dans ord.html
    const nomOrd = localStorage.getItem('nom') || '';
    const prenomOrd = localStorage.getItem('prenom') || '';
    const ageOrd = localStorage.getItem('age') || '';
    const dateNaissanceOrd = localStorage.getItem('dateNaissance') || '';
    const numeroOrd = localStorage.getItem('numero') || '';
    const dateConsultationOrd = localStorage.getItem('date-consultation') || '';

    if (nomOrd || prenomOrd) patientNomPrenom = `${nomOrd} ${prenomOrd}`.trim();
    if (ageOrd) patientAge = ageOrd;
    if (dateNaissanceOrd) patientDateNaissance = convertirDateFr(dateNaissanceOrd);
    if (numeroOrd) patientNumero = numeroOrd;
    if (dateConsultationOrd) dateCertificat = convertirDateFr(dateConsultationOrd);

    document.getElementById('polyclinique').value = polyclinique;
    document.getElementById('polyclinique-ar').value = polycliniqueAr;
    document.getElementById('docteur').value = docteur;

    // Remplir les champs du patient
    document.getElementById('patientNomPrenom').value = patientNomPrenom;
    document.getElementById('patientAge').value = patientAge;
    document.getElementById('patientDateNaissance').value = patientDateNaissance;
    document.getElementById('dateCertificat').value = dateCertificat;

    // Vérifier si l'élément patientNumero existe avant de lui assigner une valeur
    const patientNumeroElement = document.getElementById('patientNumero');
    if (patientNumeroElement) {
        patientNumeroElement.value = patientNumero;
    }

    // Si aucune date n'est définie, utiliser la date du jour
    if (!dateCertificat) {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        document.getElementById('dateCertificat').value = formattedDate;
    }

    // Initialiser l'état des boutons de format
    const format = localStorage.getItem('certificatFormat');
    if (format === 'sansEntete') {
        document.getElementById('formatSansEntete').classList.add('selected-format');
    } else {
        // Par défaut, on utilise avec en-tête
        document.getElementById('formatAvecEntete').classList.add('selected-format');
    }
}

// Fonction pour calculer l'âge à partir de la date de naissance
function calculerAge(dateNaissance) {
    if (!dateNaissance) return '';

    const today = new Date();
    const birthDate = new Date(dateNaissance);

    // Calculer la différence en millisecondes
    const diffTime = Math.abs(today - birthDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Si moins de 30 jours, afficher en jours
    if (diffDays < 30) {
        return diffDays + ' jours';
    }

    // Si moins de 2 ans, afficher en mois
    if (diffDays < 730) { // ~2 ans
        const diffMonths = Math.floor(diffDays / 30.44);
        return diffMonths + ' mois';
    }

    // Sinon, afficher en années
    const diffYears = Math.floor(diffDays / 365.25);
    return diffYears + ' ans';
}

// Fonction pour sauvegarder les données
function saveData() {
    const polyclinique = document.getElementById('polyclinique').value;
    const polycliniqueAr = document.getElementById('polyclinique-ar').value;
    const docteur = document.getElementById('docteur').value;

    // Sauvegarder les données du patient
    const patientNomPrenom = document.getElementById('patientNomPrenom').value;
    const patientAge = document.getElementById('patientAge').value;
    const patientDateNaissance = document.getElementById('patientDateNaissance').value;
    const dateCertificat = document.getElementById('dateCertificat').value;
    const patientNumero = document.getElementById('patientNumero').value;

    localStorage.setItem('polyclinique', polyclinique);
    localStorage.setItem('polyclinique-ar', polycliniqueAr);
    localStorage.setItem('docteur', docteur);

    // Sauvegarder les données du patient
    localStorage.setItem('patientNomPrenom', patientNomPrenom);
    localStorage.setItem('patientAge', patientAge);
    localStorage.setItem('patientDateNaissance', patientDateNaissance);
    localStorage.setItem('dateCertificat', dateCertificat);
    localStorage.setItem('patientNumero', patientNumero);

    alert('Informations sauvegardées avec succès!');
}

// Fonction pour générer l'en-tête
function generateHeader() {
    const polyclinique = localStorage.getItem('polyclinique') || '';
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || '';

    return `
    <div id="head" style="border: 1px solid #000; padding: 10px; margin-bottom: 20px;">
        <table style="width: 100%;">
            <tbody>
                <tr>
                    <td colspan="4">
                        <div style="text-align: center; width: 100%; font-size: 12px;">REPUBLIQUE ALGERIENNE DEMOCRATIQUE ET POPULAIRE</div>
                    </td>
                </tr>
                <tr>
                    <td colspan="4">
                        <div style="text-align: center; width: 100%; font-size: 12px;">MINISTERE DE LA SANTE</div>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div style="text-align: left; width: 100%; font-size: 12px; white-space: pre-wrap;">${polyclinique}</div>
                    </td>
                    <td colspan="2" style="text-align: right;">
                        <div style="text-align: right; width: 100%; font-size: 12px; white-space: pre-wrap;" class="arabic-text">${polycliniqueAr}</div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <style>
        /* Forcer l'utilisation de chiffres européens (latins) dans tous les éléments */
        * {
            font-variant-numeric: tabular-nums;
            unicode-bidi: plaintext;
        }
        body {
            font-variant-numeric: tabular-nums;
            unicode-bidi: plaintext;
        }
        input[type="date"] {
            font-variant-numeric: tabular-nums;
        }
        /* S'assurer que les dates sont affichées en français */
        input[type="date"]::-webkit-datetime-edit {
            font-variant-numeric: tabular-nums;
        }
    </style>
    <script>
        (function() {
            // Convertir les inputs de type date en inputs de type texte avec format français
            function convertDateInputsToFrench() {
                const dateInputs = document.querySelectorAll('input[type="date"]');
                dateInputs.forEach(function(input) {
                    if (input.value) {
                        const date = new Date(input.value);
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        const frenchDate = day + '/' + month + '/' + year;
                        
                        // Créer un nouveau input de type texte
                        const textInput = document.createElement('input');
                        textInput.type = 'text';
                        textInput.value = frenchDate;
                        textInput.readOnly = true;
                        textInput.style.fontFamily = 'Arial, sans-serif';
                        textInput.style.fontVariantNumeric = 'tabular-nums';
                        
                        // Copier tous les attributs
                        Array.from(input.attributes).forEach(function(attr) {
                            if (attr.name !== 'type' && attr.name !== 'value') {
                                textInput.setAttribute(attr.name, attr.value);
                            }
                        });
                        
                        // Remplacer l'input original
                        input.parentNode.replaceChild(textInput, input);
                    }
                });
            }
            
            // Exécuter la conversion au chargement
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', convertDateInputsToFrench);
            } else {
                convertDateInputsToFrench();
            }
        })();
    </script>
    `;
}

// Fonction pour configurer les gestionnaires d'événements des boutons de format
function setupFormatButtons() {
    const formatAvecEnteteBtn = document.getElementById('formatAvecEntete');
    const formatSansEnteteBtn = document.getElementById('formatSansEntete');

    if (formatAvecEnteteBtn) {
        formatAvecEnteteBtn.addEventListener('click', function () {
            // Mettre à jour le localStorage
            localStorage.setItem('certificatFormat', 'avecEntete');

            // Mettre à jour l'interface utilisateur
            formatAvecEnteteBtn.classList.add('selected-format');
            formatSansEnteteBtn.classList.remove('selected-format');
        });
    }

    if (formatSansEnteteBtn) {
        formatSansEnteteBtn.addEventListener('click', function () {
            // Mettre à jour le localStorage
            localStorage.setItem('certificatFormat', 'sansEntete');

            // Mettre à jour l'interface utilisateur
            formatSansEnteteBtn.classList.add('selected-format');
            formatAvecEnteteBtn.classList.remove('selected-format');
        });
    }
}

function genererCatAntiRabique() {
    const classe02 = document.getElementById('classe02');
    const classe03 = document.getElementById('classe03');
    const prex = document.getElementById('prex');

    // Supprimer la classe 'hidden' pour les rendre visibles
    if (classe02) classe02.classList.remove('hidden');
    if (classe03) classe03.classList.remove('hidden');
    if (prex) prex.classList.remove('hidden');
}

// Configurer les gestionnaires d'événements lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', function () {
    loadData();
    setupFormatButtons();

    // Ecouteur pour le bouton de catégorie de leishmaniose
    document.getElementById('catLeishmaniose').addEventListener('click', () => {
        console.log("Bouton Catégorie de Leishmaniose cliqué");
        const container = document.getElementById('leishmanioseButtons');
        container.innerHTML = '';

        const buttonInf = document.createElement('button');
        buttonInf.textContent = 'Inférieur ou égal à  3 lésions';
        buttonInf.addEventListener('click', () => {
            ouvrirCertificatLeishmanioseDetail();
        });

        const buttonSup = document.createElement('button');
        buttonSup.textContent = 'Plus de 3 lésions et à  proximité des zones sensibles';
        buttonSup.addEventListener('click', () => {
            catLeishmanioseplus3();
        });

        container.appendChild(buttonInf);
        container.appendChild(buttonSup);
    });

    // Ecouteur pour le bouton Catégorie Anti-Rabique
    // This will make the classe02, classe03, and prex buttons visible when clicked
    document.getElementById('genererCatAntiRabique').addEventListener('click', genererCatAntiRabique);

    // Ecouteur pour le bouton de requisition
    document.getElementById('requisition').addEventListener('click', function () {
        console.log('Bouton Requisition cliqué');
        const modal = document.createElement('div');
        modal.className = 'modal';
        // Récupérer les informations du patient à partir des champs du formulaire
        const patientNumero = document.getElementById('patientNumero') ? document.getElementById('patientNumero').value : '';
        
        modal.innerHTML = `
        <div class="modal-content">
            <h3>Requisition Médicale</h3>
            <div class="info barcode" style="height: 80px;">
                <svg id="barcode" data-numero="${patientNumero || ''}" style="height: 100%;"></svg>
            </div>
            <div class="button-group">
				 <button class="modal-button" id="requisitionApte">Apte pour garde à  vue</button>
				 <button class="modal-button" id="requisitionInapte">Inapte pour garde à  vue</button>
				
            </div>
        </div>
    `;

        document.body.appendChild(modal);
        console.log('Modal ajouté au DOM');
        
        // Utiliser la délégation d'événements sur le conteneur du modal
        modal.addEventListener('click', function(event) {
            // Vérifier si le clic est sur un bouton spécifique
            if (event.target.id === 'requisitionApte') {
                console.log('Bouton Apte cliqué (délégation)');
                event.stopPropagation();
                requisitionApte();
            } else if (event.target.id === 'requisitionInapte') {
                console.log('Bouton Inapte cliqué (délégation)');
                event.stopPropagation();
                requisitionInapte();
            }
        });
        
        // Vérification après un court délai
        setTimeout(() => {
            console.log('Timeout de 100ms terminé');
            const btnApte = document.getElementById('requisitionApte');
            const btnInapte = document.getElementById('requisitionInapte');
            console.log('Bouton Apte trouvé:', btnApte);
            console.log('Bouton Inapte trouvé:', btnInapte);
            
            // Tentative d'attachement direct aussi
            if (btnApte) {
                btnApte.addEventListener('click', function(e) {
                    console.log('Bouton Apte cliqué (direct)');
                    e.stopPropagation();
                    requisitionApte();
                });
            }
            if (btnInapte) {
                btnInapte.addEventListener('click', function(e) {
                    console.log('Bouton Inapte cliqué (direct)');
                    e.stopPropagation();
                    requisitionInapte();
                });
            }
        }, 100);

        // Ajouter un écouteur de clic pour fermer la modale
        modal.addEventListener('click', function (event) {
            // Si l'utilisateur clique en dehors du contenu de la modale
            if (event.target === modal) {
                modal.remove();
                // Rafraîchir la page
                window.location.reload();
            }
        });

        // Ajouter le style pour la popup
        const style = document.createElement('style');
        style.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        .modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .button-group {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;
        }
        .modal-button {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        .modal-button:first-child {
            background-color: #4CAF50;
            color: white;
            z-index: 1000;
        }
        .modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            max-width: 400px;
            width: 90%;
            text-align: center;
        }
        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        .button-group button {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        .button-group button:hover {
            background-color: #f0f0f0;
        }
    `;
        document.head.appendChild(style);
    });

    // Ecouteurs pour les classes
    document.getElementById('classe02').addEventListener('click', function () {
        ouvrirModalClasse02();
    });

    document.getElementById('classe03').addEventListener('click', function () {
        ouvrirModalClasse03();
    });

    document.getElementById('prex').addEventListener('click', function () {
        ouvrirModalPrex();
    });
});

// Fonction pour générer un certificat d'éviction scolaire
function genererCertificat() {
    const polyclinique = document.getElementById('polyclinique').value;
    const docteur = document.getElementById('docteur').value;

    // Get patient information from the form fields
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '[Nom de l\'élève]';
    const patientAge = document.getElementById('patientAge').value;
    const patientDateNaissance = document.getElementById('patientDateNaissance').value;
    const dateCertificat = document.getElementById('dateCertificat').value || new Date().toISOString().split('T')[0];

    // Construire la partie de l'âge/date de naissance
    let ageInfo = '';
    if (patientAge) {
        ageInfo = 'né(e) le ' + patientAge;
    } else if (patientDateNaissance) {
        ageInfo = 'né(e) le ' + patientDateNaissance;
    } else {
        ageInfo = 'né(e) le [Date de naissance]';
    }

    // Format the date for display
    const formattedDate = new Date(dateCertificat).toLocaleDateString('fr-FR');

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    const certificatHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Certificat médical d'éviction scolaire</title>
<style>
body {
font-family: Arial, sans-serif;
padding: 20px;
background-color: #f9f9f9;
}
.certificat {
background-color: white;
border: 1px solid #ddd;
padding: 20px 40px;
max-width: 600px;
margin: 0 auto;
margin-top: 60px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
padding-top: 30px;
}
h1 {
text-align: center;
color: #333;
text-decoration: underline;
font-size: 20px;
margin-top: 15px;
margin-bottom: 25px;
}
p {
line-height: 1.5;
color: #555;
}
.editable-field {
border-bottom: 1px dashed #666;
display: inline-block;
min-width: 50px;
min-height: 20px;
padding: 2px 4px;
margin: 0 3px;
}
.editable-area {
border: 1px solid #ddd;
border-radius: 4px;
padding: 8px;
margin: 5px 0;
width: 100%;
min-height: 20px;
resize: vertical;
overflow: hidden;
font-family: inherit;
font-size: inherit;
line-height: inherit;
}
.editable-area:focus {
outline: none;
border-color: #007bff;
}
#head {
margin-bottom: 20px;
}
#head table {
width: 100%;
border: 0px solid #000000;
padding: 4px;
margin-bottom: 15px;
}
#head td {
text-align: center;
}
.print-button {
text-align: center;
margin-top: 20px;
}
.print-button button {
padding: 10px 20px;
font-size: 16px;
background-color: #007bff;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
}
.print-button button:hover {
background-color: #0056b3;
}
@media print {
@page {
    size: A5;
    margin: 0.2cm 0.2cm 0.2cm 0.2cm;
}

body {
    margin: 0 !important;
    padding: 0 !important;
    font-size: 10pt !important;
    line-height: 1.2 !important;
    background-color: white;
}

.certificat {
    border: none;
    box-shadow: none;
    margin: 0 !important;
    padding: 2px 8px !important;
    max-width: 100% !important;
}

h1 {
    font-size: 14pt !important;
    margin: 5px 0 !important;
    margin-top: 2cm !important;
}

input[type="text"],
input[type="date"],
textarea {
    border: none !important;
    background: none !important;
    box-shadow: none !important;
    outline: none !important;
    font-size: 9pt !important;
}

input[type="text"]:focus,
input[type="date"]:focus,
textarea:focus {
    border: none !important;
    outline: none !important;

}

.print-button {
    display: none;
}

.editable-field, .editable-area {
    border: none !important;
}

/* Additional space optimization */
* {
    margin-top: 0 !important;
    margin-bottom: 2px !important;
}

p {
    margin: 2px 0 !important;
    font-size: 9pt !important;
}
}
</style>
</head>
<body>
${enteteContent}
<div class="certificat">
<h1>Certificat médical d'éviction/arret scolaire</h1>
<br><br><br>
<p>
Je soussigné, Dr <input type="text" id="docteur" value="${docteur}" placeholder="">, certifie avoir examiné ce jour
<strong><input type="text" value="${patientNomPrenom}" style="width: 150px;"></strong>,
<span class="editable-field" contenteditable="true" style="min-width: 100px; display: inline-block;">${ageInfo}</span>.
</p>
<p>
déclare que son état de santé nécessite une éviction scolaire de
<input type="text" value="1 (un)" style="width: 80px;"> Jour(s)
à daté du <span class="editable-field" contenteditable="true" style="min-width: 120px; display: inline-block;">${dateCertificat}</span> <br>
sauf complication.
</p>
<p>
<textarea placeholder=" " style="width: 450px;"></textarea>
</p>
<p style="text-align: right; margin-top: 30px;">
Dont certificat&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<br>
<span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp;
</p>
</div>
    <div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">
    <div style="display: flex; align-items: center; gap: 8px;">
        <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:</label>
        <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">
    </div>
    <button id="printButton">Imprimer le Certificat</button>
</div>

<script src="certificat-unified-font-size.js"></script>
<script>
    // Appliquer la taille de police sauvegardée et masquer les éléments non désirés à l'impression
    document.addEventListener('DOMContentLoaded', () => {
        const savedFontSize = localStorage.getItem('certificatFontSize') || '14';
        const styleElement = document.createElement('style');
        styleElement.textContent = "@media print { .print-button { display: none !important; } }";
        styleElement.id = 'certificatFontSizeStyle';
        document.head.appendChild(styleElement);
                 
    });
</script>
</body>
</html>
    `;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatHtml);
        newWindow.document.close();

        // Attacher l'événement d'impression directement après la fermeture du document
        newWindow.onload = function () {
            const printButton = newWindow.document.getElementById('printButton');
            if (printButton) {
                printButton.addEventListener('click', function () {
                    newWindow.print();
                });
            }
        };
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

// Fonction pour générer un certificat d'inaptitude sportive
function inaptitudeSport() {
    // Ajouter le style pour déplacer le titre lors de l'impression
    const style = document.createElement('style');
    style.textContent = `
    @media print {
      .certificat h1 {
        margin-top: 2cm !important;
      }
    }
  `;
    document.head.appendChild(style);

    // Get patient information from the form fields
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '[Nom du patient]';
    const patientAge = document.getElementById('patientAge').value;
    const patientDateNaissance = document.getElementById('patientDateNaissance').value;
    const dateCertificat = document.getElementById('dateCertificat').value || new Date().toISOString().split('T')[0];

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const docteur = document.getElementById('docteur').value || localStorage.getItem('docteur') || "";

    // Construire la partie de l'âge/date de naissance
    let ageInfo = '';
    if (patientAge) {
        ageInfo = patientAge;
    } else if (patientDateNaissance) {
        ageInfo = patientDateNaissance;
    } else {
        ageInfo = '[Date de naissance]';
    }

    // Format the date for display
    const formattedDate = new Date(dateCertificat).toLocaleDateString('fr-FR');

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    const certificatHtml = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CERTIFICAT MEDICAL D'INAPTITUDE AU SPORT</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f9f9f9;
    }
    .certificat {
        background-color: white;
        border: 1px solid #ddd;
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        margin-top: 60px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        text-align: center;
        color: #333;
        text-decoration: underline;
        font-size: 14pt !important;
        margin: 5px 0 !important;
    }
    h2 {
        text-align: center;
        color: #555;
        font-size: 16px;
        margin-top: 5px;
        margin-bottom: 15px;
    }
    p {
        line-height: 1.5;
        color: #555;
    }
	
    .editable-field {
        border-bottom: 1px dashed #666;
        display: inline-block;
        min-width: 50px;
        min-height: 20px;
        padding: 2px 4px;
        margin: 0 3px;
    }
    .editable-area {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 8px;
        margin: 5px 0;
        width: 100%;
        min-height: 20px;
        resize: vertical;
        overflow: hidden;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
    }
    .editable-area:focus {
        outline: none;
        border-color: #007bff;
    }
    #head {
        margin-bottom: 20px;
    }
    #head table {
        width: 100%;
        border: 0px solid #000000;
        padding: 4px;
        margin-bottom: 15px;
    }
    #head td {
        text-align: center;
    }
    .print-button {
        text-align: center;
        margin-top: 20px;
    }
    .print-button button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .print-button button:hover {
        background-color: #0056b3;
    }
    @media print {
        @page {
            size: A5;
            margin: 0.2cm 0.2cm 0.2cm 0.2cm;
        }

        body {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10pt !important;
            line-height: 1.2 !important;
            background-color: white;
        }

        .certificat {
            border: none;
            box-shadow: none;
            margin: 0 !important;
            padding: 2px 8px !important;
            max-width: 100% !important;
        }

        h1 {
            font-size: 14pt !important;
            margin: 5px 0 !important;
            margin-top: 2cm !important;
        }

        input[type="text"],
        input[type="date"],
        textarea {
            border: none !important;
            background: none !important;
            box-shadow: none !important;
            outline: none !important;
            font-size: 9pt !important;
        }

        input[type="text"]:focus,
        input[type="date"]:focus,
        textarea:focus {
            border: none !important;
            outline: none !important;
        }

        /* Rendre le placeholder transparent lors de l'impression */
        input::placeholder,
        textarea::placeholder {
            color: transparent; /* Masquer le placeholder */
        }

/* Styles existants */
.print-button {
                display: none;
            }

            /* Masquer les contrôles d'impression et de sauvegarde */
            .print-button div[style*="align-items: center"],
            .print-button button {
                display: none !important;
            }

            /* Masquer les contrôles d'impression et de sauvegarde */
            .print-button div[style*="align-items: center"],
            .print-button button {
                display: none !important;
            }

/* Masquer les contrôles d'impression et de sauvegarde */
.print-button div[style*="align-items: center"],
.print-button button {
    display: none !important;
}
        .editable-field, .editable-area {
            border: none !important;
        }

        /* Additional space optimization */
        * {
            margin-top: 0 !important;
            margin-bottom: 2px !important;
        }

        p {
            margin: 2px 0 !important;
            font-size: 9pt !important;
        }
        
        .contenu-certificat {
            margin-top: 1.5cm !important;
        }
        
    }
    </style>
    </head>
    <body>
    ${enteteContent}
  <div class="certificat">
    <h1>CERTIFICAT MEDICAL D'INAPTITUDE AU SPORT</h1>
    <div class="contenu-certificat" style="margin-top: 1.5cm !important;">
      <p>
        Je soussigné(e), Dr <input type="text" id="docteur" value="${docteur}" placeholder="Medecin">, certifie avoir examiné ce jour :<br>
    <strong><input type="text" value="${patientNomPrenom}" style="width: 180px;"></strong>
    <br>
    née le : <strong><input type="text" value="${ageInfo}" style="width: 120px;"></strong>
    <br> met en évidence des contre-indications à  la pratique de sports<br>
        <textarea class="editable-area" style="width: 90%;" placeholder=" "></textarea>
      </p>
      <p style="text-align: right;">
        Le  : ${dateCertificat} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
        <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </p>
    </div>
    <div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">
        <div style="display: flex; align-items: center; gap: 8px;">
            <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:</label>
            <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">
        </div>
        <button id="printButton">Imprimer le Certificat</button>
    </div>
	<script src="certificat-unified-font-size.js"></script>
	
    <script>
    // Sauvegarder les modifications dans le localStorage
    function sauvegarderModifications() {
        const polycliniqueInput = document.getElementById('polyclinique');
        const polycliniqueArInput = document.getElementById('polyclinique-ar');
        const docteurInput = document.getElementById('docteur');
        
        if (polycliniqueInput && polycliniqueInput.value) {
            localStorage.setItem('polyclinique', polycliniqueInput.value);
        }
        
        if (polycliniqueArInput && polycliniqueArInput.value) {
            localStorage.setItem('polyclinique-ar', polycliniqueArInput.value);
        }
        
        if (docteurInput && docteurInput.value) {
            localStorage.setItem('docteur', docteurInput.value);
        }
    }

    // Ecouteur pour le bouton d'impression
    document.getElementById('printButton').addEventListener('click', function() {
        sauvegarderModifications();
        window.print();
    });
    </script>
    </body>
    </html>
    `;

    // Ouvrir le certificat dans un nouvel onglet
    const newTab = window.open('', '_blank');
    newTab.document.write(certificatHtml);
    newTab.document.close();
}

// Fonction pour générer une justification de présence
function justification() {
    // Get patient information from the form fields
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '[Nom du patient]';
    const patientAge = document.getElementById('patientAge').value;
    const patientDateNaissance = document.getElementById('patientDateNaissance').value;
    const dateCertificat = document.getElementById('dateCertificat').value || new Date().toISOString().split('T')[0];

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const docteur = document.getElementById('docteur').value || localStorage.getItem('docteur') || "";

    // Construire la partie de l'âge/date de naissance
    let ageInfo = '';
    if (patientAge) {
        ageInfo = 'agé(e) de ' + patientAge;
    } else if (patientDateNaissance) {
        ageInfo = 'né(e) le ' + patientDateNaissance;
    } else {
        ageInfo = 'né(e) le [Date de naissance]';
    }

    // Format the date for display
    const formattedDate = new Date(dateCertificat).toLocaleDateString('fr-FR');

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    const certificatHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Justification</title>
    <style>
body {
font-family: Arial, sans-serif;
padding: 20px;
background-color: #f9f9f9;
}
.certificat {
background-color: white;
border: 1px solid #ddd;
padding: 20px;
max-width: 600px;
margin: 0 auto;
margin-top: 60px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h1 {
text-align: center;
color: #333;
text-decoration: underline;
font-size: 20px;
}
p {
line-height: 1.5;
color: #555;
}
.editable-field {
border-bottom: 1px dashed #666;
display: inline-block;
min-width: 50px;
min-height: 20px;
padding: 2px 4px;
margin: 0 3px;
}
.editable-area {
border: 1px solid #ddd;
border-radius: 4px;
padding: 8px;
margin: 5px 0;
width: 100%;
min-height: 20px;
resize: vertical;
overflow: hidden;
font-family: inherit;
font-size: inherit;
line-height: inherit;
}
.editable-area:focus {
outline: none;
border-color: #007bff;
}
#head {
margin-bottom: 20px;
}
#head table {
width: 100%;
border: 0px solid #000000;
padding: 4px;
margin-bottom: 15px;
}
#head td {
text-align: center;
}
.print-button {
text-align: center;
margin-top: 20px;
}
.print-button button {
padding: 10px 20px;
font-size: 16px;
background-color: #007bff;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
}
.print-button button:hover {
background-color: #0056b3;
}
#head .arabic-text {
font-size: 12px;
text-align: right;
}
#head div {
font-size: 12px;
white-space: pre-wrap;
text-align: left;
}
#head td:first-child {
text-align: left !important;
padding-left: 0 !important;
margin-left: 0 !important;
}
@media print {
@page {
    size: A5;
    margin: 0.2cm 0.2cm 0.2cm 0.2cm;
}

body {
    margin: 0 !important;
    padding: 0 !important;
    font-size: 10pt !important;
    line-height: 1.2 !important;
    background-color: white;
}

.certificat {
    border: none;
    box-shadow: none;
    margin: 0 !important;
    padding: 2px 8px !important;
    max-width: 100% !important;
}

h1 {
    font-size: 14pt !important;
    margin: 5px 0 !important;
    margin-top: 2cm !important;
}

input[type="text"],
input[type="date"],
textarea {
    border: none !important;
    background: none !important;
    box-shadow: none !important;
    outline: none !important;
    font-size: 9pt !important;
}

input[type="text"]:focus,
input[type="date"]:focus,
textarea:focus {
    border: none !important;
    outline: none !important;
}


/* Styles existants */
.print-button {
    display: none;
}

/* Masquer les contrôles d'impression et de sauvegarde */
.print-button div[style*="align-items: center"],
.print-button button {
    display: none !important;
}
.editable-field, .editable-area {
    border: none !important;
}

/* Additional space optimization */
* {
    margin-top: 0 !important;
    margin-bottom: 2px !important;
}

p {
    margin: 2px 0 !important;
    font-size: 9pt !important;
}
}
</style>
</head>
<body>
${enteteContent}
    <div class="certificat">
        <h1>Justification de présence</h1>
        <div class="contenu-certificat" style="margin-top: 1.5cm !important;">
        <p>
            Je soussigné, Dr <input type="text" id="docteur" value="${docteur}" placeholder="" style="width: 120px;">, 
            certifie avoir examiné ce jour le(la) susnommé(e) 
            <strong><input type="text" value="${patientNomPrenom}" style="width: 180px;"></strong>,
            <span class="editable-field" contenteditable="true" style="min-width: 100px; display: inline-block;">${ageInfo}</span>.
        </p>
        <p>
            est présenter pour la consultation ce jour le 
             <span class="editable-field" contenteditable="true" style="min-width: 120px; display: inline-block;">${dateCertificat}</span> à  l'heure:<input type="time" style="font-size: 11px !important;"> <br> 
            <div style="direction: rtl; text-align: right;">
                 تم فحص المعني يوم :   <span class="editable-field" contenteditable="true" style="min-width: 120px; display: inline-block; margin-left: 10px;">${dateCertificat}</span>   <br>
                على الساعة : <input type="time" > 
            </div>
        </p>
        <p style="text-align: right; margin-top: 30px;">
            Dont certificat<br>
            <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>
        </p>
    </div>
  <div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">
        <div style="display: flex; align-items: center; gap: 8px;">
            <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:</label>
            <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">
        </div>
        <button id="printButton">Imprimer le Certificat</button>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const printButton = document.getElementById('printButton');
            if (printButton) {
                printButton.addEventListener('click', function () {
                    window.print();
                });
            }
        });
    </script>
</body>
</html>
    `;

    const newWindow = window.open();
    newWindow.document.write(certificatHtml);
    newWindow.document.close();
}

// Fonction pour générer un certificat de non-grossesse
function genererNonGrossesse() {
    const { nom, prenom, dob } = patientInfo;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    const certificatContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificat de Non-Grossesse</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f9f9f9;
    }
    .certificat {
        background-color: white;
        border: 1px solid #ddd;
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        margin-top: 60px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        text-align: center;
        color: #333;
        text-decoration: underline;
        font-size: 20px;
    }
    h2 {
        text-align: center;
        color: #555;
        font-size: 16px;
        margin-top: 5px;
        margin-bottom: 15px;
    }
    p {
        line-height: 1.5;
        color: #555;
    }
    .editable-field {
        border-bottom: 1px dashed #666;
        display: inline-block;
        min-width: 50px;
        min-height: 20px;
        padding: 2px 4px;
        margin: 0 3px;
    }
    .editable-area {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 8px;
        margin: 5px 0;
        width: 100%;
        min-height: 20px;
        resize: vertical;
        overflow: hidden;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
    }
    .editable-area:focus {
        outline: none;
        border-color: #007bff;
    }
    #head {
        margin-bottom: 20px;
    }
    #head table {
        width: 100%;
        border: 0px solid #000000;
        padding: 4px;
        margin-bottom: 15px;
    }
    #head td {
        text-align: center;
    }
    .print-button {
        text-align: center;
        margin-top: 20px;
    }
    .print-button button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .print-button button:hover {
        background-color: #0056b3;
    }
    @media print {
        @page {
            size: A5;
            margin: 0.2cm 0.2cm 0.2cm 0.2cm;
        }
        body {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10pt !important;
            background-color: white;
        }
        .certificat {
            padding: 2px 8px !important;
            max-width: 100% !important;
            border: none;
            box-shadow: none;
            margin-top: 0;
        }
        h1 {
            font-size: 14pt !important;
            margin: 5px 0 !important;
            margin-top: 2cm !important;
        }
        h2 {
            font-size: 12pt !important;
            margin: 3px 0 !important;
        }
        p {
            font-size: 9pt !important;
            margin: 2px 0 !important;
            line-height: 1.2 !important;
        }
        input[type="text"],
        input[type="date"],
        textarea {
            border: none !important;
            background: none !important;
            box-shadow: none !important;
            outline: none !important;
            font-size: 9pt !important;
        }
        input[type="text"]:focus,
        input[type="date"]:focus,
        textarea:focus {
            border: none !important;
            outline: none !important;
        }
        /* Rendre le placeholder transparent lors de l'impression */
        input::placeholder,
        textarea::placeholder {
            color: transparent;
}
.print-button {
display: none;
}

/* Masquer les contrôles d'impression et de sauvegarde */
.print-button div[style*="align-items: center"],
.print-button button {
    display: none !important;
}

.editable-field, .editable-area {
border: none !important;
}
}

        /* Masquer les contrôles d'impression et de sauvegarde */
        .print-button div[style*="align-items: center"],
        .print-button button {
            display: none !important;
        }
        
        .editable-field, .editable-area {
            border: none !important;
        }
    }
    </style>
    </head>
    <body>
    ${enteteContent}
    <div class="certificat">
    <h1>CERTIFICAT MEDICAL DE NON-GROSSESSE</h1>
    <div class="contenu-certificat" style="margin-top: 1cm !important;">
    <p>
    Je soussigné(e), Dr <input type="text" id="docteur" value="${docteur}" placeholder="Medecin">, certifie avoir examiné ce jour :<br>
    <strong><input type="text" value="${nom} ${prenom}" style="width: 180px;"></strong>
    <br>
    née le : <strong><input type="text" value="${dob}" style="width: 120px;"></strong>
    <br>
    Je n'ai constaté aucun signe clinique évocateur d'une grossesse en cours à  la date du présent certificat.<br>
    Ce certificat est délivré à  la demande de l'intéressée et remis en main propre pour servir et valoir ce que de droit.<br>
    </p>
    <p style="text-align: right;">Signature :<br>
    <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </p>
    </div>
    </div>
    <div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">
        <div style="display: flex; align-items: center; gap: 8px;">
            <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:</label>
            <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">
        </div>
        <button id="printButton">Imprimer le Certificat</button>
    </div>
    <script src="print.js"></script>
    <script src="certificat-unified-font-size.js"></script>
    <script>
    // Sauvegarder les modifications dans le localStorage
    function sauvegarderModifications() {
        const polycliniqueInput = document.getElementById('polyclinique');
        const polycliniqueArInput = document.getElementById('polyclinique-ar');
        const docteurInput = document.getElementById('docteur');
        
        if (polycliniqueInput && polycliniqueInput.value) {
            localStorage.setItem('polyclinique', polycliniqueInput.value);
        }
        
        if (polycliniqueArInput && polycliniqueArInput.value) {
            localStorage.setItem('polyclinique-ar', polycliniqueArInput.value);
        }
        
        if (docteurInput && docteurInput.value) {
            localStorage.setItem('docteur', docteurInput.value);
        }
    }

    // Ecouteur pour le bouton d'impression
    document.getElementById('printButton').addEventListener('click', function() {
        sauvegarderModifications();
        window.print();
    });
    </script>
    </body>
    </html>
    `;

    // Ouvrir le certificat dans un nouvel onglet
    const newTab = window.open('', '_blank');
    newTab.document.write(certificatContent);
    newTab.document.close();
}

// Fonction pour générer un certificat de maladie chronique
function genererChronique() {
    const polyclinique = document.getElementById('polyclinique').value;
    const docteur = document.getElementById('docteur').value;

    // Get patient information from the form fields
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '[Nom du patient]';
    const patientAge = document.getElementById('patientAge').value;
    const patientDateNaissance = document.getElementById('patientDateNaissance').value;
    const dateCertificat = document.getElementById('dateCertificat').value || new Date().toISOString().split('T')[0];

    // Construire la partie de l'âge/date de naissance
    let ageInfo = '';
    if (patientAge) {
        ageInfo = 'âgé(e) de ' + patientAge;
    } else if (patientDateNaissance) {
        ageInfo = 'né(e) le ' + patientDateNaissance;
    } else {
        ageInfo = 'né(e) le [Date de naissance]';
    }

    // Format the date for display
    const formattedDate = new Date(dateCertificat).toLocaleDateString('fr-FR');

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    const certificatHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificat de Maladie Chronique</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .certificat {
            background-color: white;
            border: 1px solid #ddd;
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
            margin-top: 60px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            text-align: center;
            color: #333;
            text-decoration: underline;
            font-size: 20px;
        }
        h2 {
            text-align: center;
            color: #555;
            font-size: 16px;
            margin-top: 5px;
            margin-bottom: 15px;
        }
        p {
            line-height: 1.5;
            color: #555;
        }
        .editable-field {
            border-bottom: 1px dashed #666;
            display: inline-block;
            min-width: 50px;
            min-height: 20px;
            padding: 2px 4px;
            margin: 0 3px;
        }
        .editable-area {
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 8px;
            margin: 5px 0;
            width: 100%;
            min-height: 20px;
            resize: vertical;
            overflow: hidden;
            font-family: inherit;
            font-size: inherit;
            line-height: inherit;
        }
        .editable-area:focus {
            outline: none;
            border-color: #007bff;
        }
        #head {
            margin-bottom: 20px;
        }
        #head table {
            width: 100%;
            border: 0px solid #000000;
            padding: 4px;
            margin-bottom: 15px;
        }
        #head td {
            text-align: center;
        }
        .print-button {
            text-align: center;
            margin-top: 20px;
        }
        .print-button button {
            padding: 10px 20px;
            font-size: 16px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .print-button button:hover {
            background-color: #0056b3;
        }
        @media print {
            @page {
                size: A5;
                margin: 0.2cm 0.2cm 0.2cm 0.2cm;
            }
            body {
                margin: 0 !important;
                padding: 0 !important;
                font-size: 10pt !important;
                background-color: white;
            }
            .certificat {
                padding: 2px 8px !important;
                max-width: 100% !important;
                border: none;
                box-shadow: none;
                margin-top: 0;
            }
            h1 {
                font-size: 14pt !important;
                margin: 5px 0 !important;
                margin-top: 2cm !important;
            }
            h2 {
                font-size: 12pt !important;
                margin: 3px 0 !important;
            }
            p {
                font-size: 9pt !important;
                margin: 2px 0 !important;
                line-height: 1.2 !important;
            }
            input[type="text"],
            input[type="date"],
            textarea {
                border: none !important;
                background: none !important;
                box-shadow: none !important;
                outline: none !important;
                font-size: 9pt !important;
            }
            input[type="text"]:focus,
            input[type="date"]:focus,
            textarea:focus {
                border: none !important;
                outline: none !important;
            }
            /* Rendre le placeholder transparent lors de l'impression */
            input::placeholder,
            textarea::placeholder {
                color: transparent;
            }
            .print-button {
                display: none;
            }

            /* Masquer les contrôles d'impression et de sauvegarde */
            .print-button div[style*="align-items: center"],
            .print-button button {
                display: none !important;
            }

.editable-field, .editable-area {
border: none !important;
}
}

        /* Masquer les contrôles d'impression et de sauvegarde */
        .print-button div[style*="align-items: center"],
        .print-button button {
            display: none !important;
        }
        
        .editable-field, .editable-area {
            border: none !important;
        }
    }
    </style>
</head>
<body>
    ${enteteContent}
    <div class="certificat">
        <h1>CERTIFICAT DE MALADIE CHRONIQUE</h1>
        <div class="contenu-certificat" style="margin-top: 1cm !important;">
            <p>
                Je soussigné(e), Dr <input type="text" id="docteur" value="${docteur}" placeholder="Medecin">, certifie avoir examiné ce jour :<br>
                <strong><input type="text" value="${patientNomPrenom}" style="width: 180px;"></strong>
                <br>
                ${ageInfo}
                <br>
                Je constate que le patient souffre d'une maladie chronique.<br>
                Ce certificat est délivré à la demande de l'intéressée et remis en main propre pour servir et valoir ce que de droit.<br>
            </p>
            <p style="text-align: right;">Signature :<br>
                <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </p>
        </div>
    </div>
    <div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">
        <div style="display: flex; align-items: center; gap: 8px;">
            <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:</label>
            <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">
        </div>
        <button id="printButton">Imprimer le Certificat</button>
    </div>
    <script src="print.js"></script>
    <script src="certificat-unified-font-size.js"></script>
    <script>
    // Sauvegarder les modifications dans le localStorage
    function sauvegarderModifications() {
        const polycliniqueInput = document.getElementById('polyclinique');
        const polycliniqueArInput = document.getElementById('polyclinique-ar');
        const docteurInput = document.getElementById('docteur');
        
        if (polycliniqueInput && polycliniqueInput.value) {
            localStorage.setItem('polyclinique', polycliniqueInput.value);
        }
        
        if (polycliniqueArInput && polycliniqueArInput.value) {
            localStorage.setItem('polyclinique-ar', polycliniqueArInput.value);
        }
        
        if (docteurInput && docteurInput.value) {
            localStorage.setItem('docteur', docteurInput.value);
        }
    }

    // Ecouteur pour le bouton d'impression
    document.getElementById('printButton').addEventListener('click', function() {
        sauvegarderModifications();
        window.print();
    });
    </script>
</body>
</html>
    `;

    const newWindow = window.open();
    newWindow.document.write(certificatHtml);
    newWindow.document.close();
}


// Fonction pour générer un certificat de prolongation d'arrêt de travail
function genererProlongation() {
    // Get patient information from the form fields
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '[Nom du patient]';
    const patientAge = document.getElementById('patientAge').value;
    const patientDateNaissance = document.getElementById('patientDateNaissance').value;
    const dateCertificat = document.getElementById('dateCertificat').value || new Date().toISOString().split('T')[0];

    // Split patient name into first and last name
    let nom = '';
    let prenom = '';
    if (patientNomPrenom) {
        const parts = patientNomPrenom.split(' ');
        nom = parts[0] || '';
        prenom = parts.slice(1).join(' ') || '';
    }

    // Use date of birth if available
    const dob = patientDateNaissance || '[Date de naissance]';

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    const certificatContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' 'unsafe-eval'; object-src 'none';">
    <title>Certificat de prolongation d'arret de Travail</title>
    <style>
body {
font-family: Arial, sans-serif;
padding: 20px;
background-color: #f9f9f9;
}
.certificat {
background-color: white;
border: 1px solid #ddd;
padding: 20px;
max-width: 600px;
margin: 0 auto;
margin-top: 60px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h1 {
text-align: center;
color: #333;
text-decoration: underline;
font-size: 20px;
}
p {
line-height: 1.5;
color: #555;
}
.editable-field {
border-bottom: 1px dashed #666;
display: inline-block;
min-width: 50px;
min-height: 20px;
padding: 2px 4px;
margin: 0 3px;
}
.editable-area {
border: 1px solid #ddd;
border-radius: 4px;
padding: 8px;
margin: 5px 0;
width: 100%;
min-height: 20px;
resize: vertical;
overflow: hidden;
font-family: inherit;
font-size: inherit;
line-height: inherit;
}
.editable-area:focus {
outline: none;
border-color: #007bff;
}
#head {
margin-bottom: 20px;
}
#head table {
width: 100%;
border: 0px solid #000000;
padding: 4px;
margin-bottom: 15px;
}
#head td {
text-align: center;
}
.print-button {
text-align: center;
margin-top: 20px;
}
.print-button button {
padding: 10px 20px;
font-size: 16px;
background-color: #007bff;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
}
.print-button button:hover {
background-color: #0056b3;
}
@media print {
@page {
    size: A5;
    margin: 0.2cm 0.2cm 0.2cm 0.2cm;
}

body {
    margin: 0 !important;
    padding: 0 !important;
    font-size: 10pt !important;
    line-height: 1.2 !important;
    background-color: white;
}

.certificat {
    border: none;
    box-shadow: none;
    margin: 0 !important;
    padding: 2px 8px !important;
    max-width: 100% !important;
}

h1 {
    font-size: 14pt !important;
    margin: 5px 0 !important;
    margin-top: 2cm !important;
}

input[type="text"],
input[type="date"],
textarea {
    border: none !important;
    background: none !important;
    box-shadow: none !important;
    outline: none !important;
    font-size: 9pt !important;
}

input[type="text"]:focus,
input[type="date"]:focus,
textarea:focus {
    border: none !important;
    outline: none !important;
}


/* Styles existants */
.print-button {
    display: none;
}

/* Masquer les contrôles d'impression et de sauvegarde */
.print-button div[style*="align-items: center"],
.print-button button {
    display: none !important;
}
.editable-field, .editable-area {
    border: none !important;
}

/* Additional space optimization */
* {
    margin-top: 0 !important;
    margin-bottom: 2px !important;
}

p {
    margin: 2px 0 !important;
    font-size: 9pt !important;
}
}
</style>
</head>
<body>
${enteteContent}
    <div class="certificat">
        <h1>certificat de prolongation d'arret de travail</h1>
        <div class="contenu-certificat" style="margin-top: 1.5cm !important;">
        <p>
            Je soussigné, Dr <input type="text" id="docteur" value="${docteur}" placeholder="" style="width: 120px;">, 
            certifie avoir examiné ce jour le(la) susnommé(e) 
            <strong><input type="text" value="${nom} ${prenom}" style="width: 180px;"></strong>,
            <span class="editable-field" contenteditable="true" style="min-width: 100px; display: inline-block;">né(e) le ${dob}</span>.
        </p>
        <p>
            déclare que son état de santé nécessite une prolongation d'arret de travail de 
            <input type="text" value="07 (sept)" style="width: 70px;"> Jour(s)
            à  dater du <span class="editable-field" contenteditable="true" style="min-width: 120px; display: inline-block;">${dateCertificat}</span> sauf complication.
        </p>
        <p style="text-align: right; margin-top: 30px;">
            Dont certificat<br>
            <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>
        </p>
    </div>
    <div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">
        <div style="display: flex; align-items: center; gap: 8px;">
            <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:</label>
            <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">
        </div>
        <button id="printButton">Imprimer le Certificat</button>
		<button id="sauvegarderProl">sauvegarder</button>
    </div>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour imprimer le certificat
    document.getElementById('printButton').addEventListener('click', function() {
        window.print();
    });
    
    // Fonction pour ajuster la taille du texte
    document.getElementById('fontSize').addEventListener('change', function() {
        const fontSize = this.value;
        const style = document.createElement('style');
        style.textContent = '@media print { body { font-size: ' + fontSize + 'pt !important; } }';
        document.head.appendChild(style);
    });
});
</script>
</body>
</html>
    `;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        // Stocker la référence de la fenêtre pour le script de sauvegarde
        window.lastOpenedWindow = newWindow;

        // Définir manuellement window.opener pour permettre la communication
        try {
            Object.defineProperty(newWindow, 'opener', {
                value: window,
                writable: false,
                configurable: false
            });
        } catch (e) {
            // Si cela échoue, stocker la référence ailleurs
            newWindow._parentWindow = window;
        }

        newWindow.document.write(certificatContent);
        newWindow.document.close();

        // Fonction pour effectuer la sauvegarde de prolongation
        function effectuerSauvegardeProlongation(nombreJoursValue) {
            // Récupérer les données depuis les champs de la popup
            const docteurInput = newWindow.document.getElementById('docteur');
            const medecin = docteurInput ? docteurInput.value.trim() : '';

            // Récupérer le nom et prénom
            const nomPrenomInput = newWindow.document.querySelector('strong input[type="text"]');
            let nom = '', prenom = '';
            if (nomPrenomInput && nomPrenomInput.value) {
                const parts = nomPrenomInput.value.trim().split(' ');
                if (parts.length >= 2) {
                    nom = parts[0];
                    prenom = parts.slice(1).join(' ');
                }
            }

            // Vérifier les données
            if (!nom || !prenom) {
                alert('Erreur: Nom et prénom du patient requis.');
                return;
            }

            if (!medecin) {
                alert('Erreur: Nom du médecin requis.');
                return;
            }

            // Récupérer la date de naissance depuis le champ editable-field
            const editableFields = newWindow.document.querySelectorAll('.editable-field');
            let dateNaissance = '';
            for (let field of editableFields) {
                const text = field.textContent || field.innerText || '';
                const parentText = field.parentElement ? field.parentElement.textContent || '' : '';
                if (parentText.includes('né(e)') || parentText.includes('né') || parentText.includes('née')) {
                    dateNaissance = text.trim();
                    break;
                }
            }

            // Date du certificat depuis l'editable-field
            let dateCertificat = '';
            for (let field of editableFields) {
                const text = field.textContent || field.innerText || '';
                const parentText = field.parentElement ? field.parentElement.textContent || '' : '';
                if (parentText.includes('dater du') || parentText.includes('date')) {
                    dateCertificat = text.trim();
                    break;
                }
            }

            if (!dateCertificat) {
                const today = new Date();
                dateCertificat = today.toISOString().split('T')[0];
            }

            // Préparer le message
            const message = {
                action: "ajouter_prolongation",
                nom: nom,
                prenom: prenom,
                medecin: medecin,
                nombre_jours: parseInt(nombreJoursValue),
                date_certificat: dateCertificat,
                date_naissance: dateNaissance || null
            };

            console.log('Message prolongation à envoyer:', message);

            // Utiliser directement la fonction fetch de la fenêtre parente avec URL complète
            fetch('http://localhost:5000/api/ajouter_prolongation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message)
            })
                .then(response => response.json())
                .then(data => {
                    // Afficher les messages dans la fenêtre popup
                    if (newWindow && !newWindow.closed) {
                        if (data && data.success) {
                            newWindow.alert('Prolongation d\'arrêt de travail sauvegardée avec succès !');
                        } else {
                            const errorMsg = data ? data.error : 'Réponse invalide';
                            newWindow.alert('Erreur lors de la sauvegarde: ' + errorMsg);
                        }
                    }
                })
                .catch(error => {
                    console.error('❌ Erreur lors de la sauvegarde:', error);

                    // Afficher les messages dans la fenêtre popup
                    if (newWindow && !newWindow.closed) {
                        // Fallback: Afficher les données pour copie manuelle si l'API n'est pas accessible
                        if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
                            const fallbackMessage = `
API non accessible. Veuillez démarrer le serveur avec: python api_simple.py
Ou copiez ces données manuellement:

${JSON.stringify(message, null, 2)}
                        `;
                            newWindow.alert(fallbackMessage);
                        } else {
                            newWindow.alert('Erreur lors de la sauvegarde: ' + error.message);
                        }
                    }
                });
        }

        // Rendre la fonction accessible globalement
        window.sauvegarderProlongationDepuisPopup = effectuerSauvegardeProlongation;

        // Attacher l'événement de sauvegarde après le chargement de la fenêtre
        newWindow.onload = function () {
            const sauvegarderButton = newWindow.document.getElementById('sauvegarderProl');
            if (sauvegarderButton) {
                const newSauvegarderButton = sauvegarderButton.cloneNode(true);
                sauvegarderButton.parentNode.replaceChild(newSauvegarderButton, sauvegarderButton);

                newSauvegarderButton.addEventListener('click', function () {
                    // Récupérer le nombre de jours
                    const allInputs = newWindow.document.querySelectorAll('input[type="text"]');
                    let nombreJours = '';
                    for (let input of allInputs) {
                        const parentText = input.parentElement ? input.parentElement.textContent : '';
                        if (parentText.includes('Jour(s)') || parentText.includes('prolongation')) {
                            nombreJours = input.value.trim();
                            break;
                        }
                    }

                    if (!nombreJours) {
                        alert('Erreur: Nombre de jours requis.');
                        return;
                    }

                    // Appeler la fonction de sauvegarde
                    effectuerSauvegardeProlongation(nombreJours);
                });
            }
        };
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}



// Fonction pour générer une attestation de décès
function genererDeces() {
    // Get patient information from the form fields
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '[Nom du patient]';
    const patientAge = document.getElementById('patientAge').value;
    const patientDateNaissance = document.getElementById('patientDateNaissance').value;
    const patientDateDeces = document.getElementById('dateCertificat').value || new Date().toISOString().split('T')[0];

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const docteur = localStorage.getItem('docteur') || "";

    // Construire la partie de l'âge/date de naissance
    let ageInfo = '';
    if (patientAge) {
        ageInfo = 'âgé(e) de ' + patientAge;
    } else if (patientDateNaissance) {
        ageInfo = 'né(e) le ' + patientDateNaissance;
    } else {
        ageInfo = 'né(e) le [Date de naissance]';
    }

    // Format the date for display
    const formattedDate = new Date(patientDateDeces).toLocaleDateString('fr-FR');

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    const certificatHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attestation de Décès</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .certificat {
            background-color: white;
            border: 1px solid #ddd;
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
            margin-top: 60px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            text-align: center;
            color: #333;
            text-decoration: underline;
            font-size: 20px;
        }
        p {
            line-height: 1.5;
            color: #555;
        }
        .signature {
            text-align: right;
            margin-top: 50px;
        }
        @media print {
            body {
                background-color: white;
            }
            .certificat {
                border: none;
                box-shadow: none;
                margin-top: 0;
            }
            .print-button {
                display: none;
            }
        }
        .print-button {
            text-align: center;
            margin-top: 20px;
        }
        .print-button button {
            padding: 10px 20px;
            font-size: 16px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .print-button button:hover {
            background-color: #0056b3;
        }
        #head {
            margin-bottom: 20px;
        }
        #head table {
            width: 100%;
            border: 0px solid #000000;
            padding: 4px;
            margin-bottom: 15px;
        }
        #head td {
            text-align: center;
        }
    </style>
</head>
<body>
    ${enteteContent}
    <div class="certificat">
        <h1>ATTESTATION DE DÉCÈS</h1>
        <p>
            Je soussigné(e), Dr <strong>${docteur || '[Nom du docteur]'}</strong>, certifie avoir examiné ce jour :
            <strong>${patientNomPrenom}</strong>, ${ageInfo}.
        </p>
        <p>
            Je certifie que le décès de ce patient s'est produit le <strong>${formattedDate}</strong>.
        </p>
        <div class="signature">
            Fait à <strong>${polyclinique || '[Nom de la polyclinique]'}</strong>, le <strong>${formattedDate}</strong><br><br><br>
            Signature et cachet<br>
            Dr <strong>${docteur || '[Nom du docteur]'}</strong>
        </div>
    </div>
    <div class="print-button">
        <button onclick="window.print()">Imprimer le certificat</button>
    </div>
</body>
</html>
    `;

    const newWindow = window.open();
    newWindow.document.write(certificatHtml);
    newWindow.document.close();
}

// Fonction pour générer un certificat de reprise de travail
function genererReprise() {
    const { nom, prenom, dob } = patientInfo;


    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";


    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }



    const certificatContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>reprise de travail</title>
<style>
body {
font-family: Arial, sans-serif;
padding: 20px;
background-color: #f9f9f9;
}
.certificat {
background-color: white;
border: 1px solid #ddd;
padding: 20px;
max-width: 600px;
margin: 0 auto;
margin-top: 60px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h1 {
text-align: center;
color: #333;
text-decoration: underline;
font-size: 20px;
}
p {
line-height: 1.5;
color: #555;
}
.editable-field {
border-bottom: 1px dashed #666;
display: inline-block;
min-width: 50px;
min-height: 20px;
padding: 2px 4px;
margin: 0 3px;
}
.editable-area {
border: 1px solid #ddd;
border-radius: 4px;
padding: 8px;
margin: 5px 0;
width: 100%;
min-height: 20px;
resize: vertical;
overflow: hidden;
font-family: inherit;
font-size: inherit;
line-height: inherit;
}
.editable-area:focus {
outline: none;
border-color: #007bff;
}
#head {
margin-bottom: 20px;
}
#head table {
width: 100%;
border: 0px solid #000000;
padding: 4px;
margin-bottom: 15px;
}
#head td {
text-align: center;
}
.print-button {
text-align: center;
margin-top: 20px;
}
.print-button button {
padding: 10px 20px;
font-size: 16px;
background-color: #007bff;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
}
.print-button button:hover {
background-color: #0056b3;
}
@media print {
@page {
size: A5;
margin: 0.2cm 0.2cm 0.2cm 0.2cm;
}
body {
margin: 0 !important;
padding: 0 !important;
font-size: 10pt !important;
background-color: white;
}
.certificat {
padding: 2px 8px !important;
max-width: 100% !important;
border: none;
box-shadow: none;
margin-top: 0;
}
h1 {
font-size: 14pt !important;
margin: 5px 0 !important;
margin-top: 2cm !important;
}
p {
font-size: 9pt !important;
margin: 2px 0 !important;
line-height: 1.2 !important;
}
input[type="text"],
input[type="date"],
textarea {
border: none !important;
background: none !important;
box-shadow: none !important;
outline: none !important;
font-size: 9pt !important;
}
input[type="text"]:focus,
input[type="date"]:focus,
textarea:focus {
border: none !important;
outline: none !important;
}
.print-button {
display: none;
}
.editable-field, .editable-area {
border: none !important;
}
}
</style>
</head>
<body>
${enteteContent}
<div class="certificat">
<h1>Certificat médical de reprise de travail</h1>
<br><br><br>
<p>
Je soussigné, Dr <input type="text" id="docteur" value="${docteur}" placeholder="">, certifie avoir examiné ce jour
le(a) nommé(e) <strong><input type="text" value="${nom} ${prenom}" style="width: 180px;"></strong>,
<span class="editable-field" contenteditable="true" style="min-width: 100px; display: inline-block;">né(e) le ${dob}</span>.<br>
Déclare que son état de santé lui permet de reprendre son travail le : <span class="editable-field" contenteditable="true" style="min-width: 120px; display: inline-block;">${todayFormatted}</span><br>
Sauf complication.<br>

</p>
<p style="text-align: right;">DONT CERTIFICAT<br>
<span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp;
</p>
</div>
<div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">
    <div style="display: flex; align-items: center; gap: 8px;">
        <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:</label>
        <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">
    </div>
    <button id="printButton">Imprimer le Certificat</button>
</div>
<script src="print.js"></script>
<script src="certificat-unified-font-size.js"></script>
<script>
// Sauvegarder les modifications dans le localStorage
function sauvegarderModifications() {
const polycliniqueInput = document.getElementById('polyclinique');
const polycliniqueArInput = document.getElementById('polyclinique-ar');
const docteurInput = document.getElementById('docteur');

// Sauvegarder les valeurs dans le localStorage
polycliniqueInput.addEventListener('input', function () {
localStorage.setItem('polyclinique', this.value);
});

polycliniqueArInput.addEventListener('input', function () {
localStorage.setItem('polyclinique-ar', this.value);
});

docteurInput.addEventListener('input', function () {
localStorage.setItem('docteur', this.value);
});
}
sauvegarderModifications();
</script>
</body>
</html>
`;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(certificatContent);
    newWindow.document.close();
}




// Fonction pour générer un certificat de maladie chronique
function genererChronique() {
    const polyclinique = document.getElementById('polyclinique').value;
    const docteur = document.getElementById('docteur').value;

    // Get patient information from the form fields
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '[Nom du patient]';
    const patientAge = document.getElementById('patientAge').value;
    const patientDateNaissance = document.getElementById('patientDateNaissance').value;
    const dateCertificat = document.getElementById('dateCertificat').value || new Date().toISOString().split('T')[0];

    // Construire la partie de l'âge/date de naissance
    let ageInfo = '';
    if (patientAge) {
        ageInfo = 'âgé(e) de ' + patientAge;
    } else if (patientDateNaissance) {
        ageInfo = 'né(e) le ' + patientDateNaissance;
    } else {
        ageInfo = 'né(e) le [Date de naissance]';
    }

    // Format the date for display
    const formattedDate = new Date(dateCertificat).toLocaleDateString('fr-FR');

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    const certificatHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificat de Maladie Chronique</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .certificat {
            background-color: white;
            border: 1px solid #ddd;
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
            margin-top: 60px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            text-align: center;
            color: #333;
            text-decoration: underline;
            font-size: 20px;
        }
        p {
            line-height: 1.5;
            color: #555;
        }
        .signature {
            text-align: right;
            margin-top: 50px;
        }
        @media print {
            body {
                background-color: white;
            }
            .certificat {
                border: none;
                box-shadow: none;
                margin-top: 0;
            }
            .print-button {
                display: none;
            }
        }
        .print-button {
            text-align: center;
            margin-top: 20px;
        }
        .print-button button {
            padding: 10px 20px;
            font-size: 16px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .print-button button:hover {
            background-color: #0056b3;
        }
        #head {
            margin-bottom: 20px;
        }
        #head table {
            width: 100%;
            border: 0px solid #000000;
            padding: 4px;
            margin-bottom: 15px;
        }
        #head td {
            text-align: center;
        }
    </style>
</head>
<body>
    ${enteteContent}
    <div class="certificat">
        <h1>CERTIFICAT DE MALADIE CHRONIQUE</h1>
        <p>
            Je soussigné(e), Dr <strong>${docteur || '[Nom du docteur]'}</strong>, certifie avoir examiné 
            le patient <strong>${patientNomPrenom}</strong>, ${ageInfo}.
        </p>
        <p>
            À la suite de cet examen, je constate que le patient souffre d'une maladie chronique nécessitant 
            un suivi médical régulier et des soins continus.
        </p>
        <p>
            Cette affection chronique nécessite des consultations périodiques et un traitement adapté.
        </p>
        <div class="signature">
            Fait à <strong>${polyclinique || '[Nom de la polyclinique]'}</strong>, le <strong>${formattedDate}</strong><br><br><br>
            Signature et cachet<br>
            Dr <strong>${docteur || '[Nom du docteur]'}</strong>
        </div>
    </div>
    <div class="print-button">
        <button onclick="window.print()">Imprimer le certificat</button>
    </div>
</body>
</html>
    `;

    const newWindow = window.open();
    newWindow.document.write(certificatHtml);
    newWindow.document.close();
}



// Fonction pour générer une lettre médicale
function genererLettre() {
    const polyclinique = document.getElementById('polyclinique').value;
    const docteur = document.getElementById('docteur').value;

    // Get patient information from the form fields
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '[Nom du patient]';
    const patientAge = document.getElementById('patientAge').value;
    const patientDateNaissance = document.getElementById('patientDateNaissance').value;
    const dateCertificat = document.getElementById('dateCertificat').value || new Date().toISOString().split('T')[0];

    // Construire la partie de l'âge/date de naissance
    let ageInfo = '';
    if (patientAge) {
        ageInfo = 'âgé(e) de ' + patientAge;
    } else if (patientDateNaissance) {
        ageInfo = 'né(e) le ' + patientDateNaissance;
    } else {
        ageInfo = 'né(e) le [Date de naissance]';
    }

    // Format the date for display
    const formattedDate = new Date(dateCertificat).toLocaleDateString('fr-FR');

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    const certificatHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lettre Médicale</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .certificat {
            background-color: white;
            border: 1px solid #ddd;
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
            margin-top: 60px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            text-align: center;
            color: #333;
            text-decoration: underline;
            font-size: 20px;
        }
        p {
            line-height: 1.5;
            color: #555;
        }
        .signature {
            text-align: right;
            margin-top: 50px;
        }
        @media print {
            body {
                background-color: white;
            }
            .certificat {
                border: none;
                box-shadow: none;
                margin-top: 0;
            }
            .print-button {
                display: none;
            }
        }
        .print-button {
            text-align: center;
            margin-top: 20px;
        }
        .print-button button {
            padding: 10px 20px;
            font-size: 16px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .print-button button:hover {
            background-color: #0056b3;
        }
        #head {
            margin-bottom: 20px;
        }
        #head table {
            width: 100%;
            border: 0px solid #000000;
            padding: 4px;
            margin-bottom: 15px;
        }
        #head td {
            text-align: center;
        }
    </style>
</head>
<body>
    ${enteteContent}
    <div class="certificat">
        <h1>LETTRE MEDICALE</h1>
        <p>
            Je soussigné(e), Dr <strong>${docteur || '[Nom du docteur]'}</strong>, certifie avoir examiné 
            le patient <strong>${patientNomPrenom}</strong>, ${ageInfo}.
        </p>
        <p>
            [Contenu de la lettre médicale]
        </p>
        <p>
            Cette lettre est établie à la demande du patient pour servir et valoir ce que de droit.
        </p>
        <div class="signature">
            Fait à <strong>${polyclinique || '[Nom de la polyclinique]'}</strong>, le <strong>${formattedDate}</strong><br><br><br>
            Signature et cachet<br>
            Dr <strong>${docteur || '[Nom du docteur]'}</strong>
        </div>
    </div>
    <div class="print-button">
        <button onclick="window.print()">Imprimer la lettre</button>
    </div>
</body>
</html>
    `;

    const newWindow = window.open();
    newWindow.document.write(certificatHtml);
    newWindow.document.close();
}

// Fonction pour générer une lettre médicale
function genererLettre() {
    // Vider les champs de recherche dans le stockage local
    localStorage.removeItem('searchInput');
    localStorage.removeItem('searchInput2');
    localStorage.removeItem('searchInput3');
    localStorage.removeItem('searchInput4');

    // Get patient information from the form fields
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '[Nom du patient]';
    const patientAge = document.getElementById('patientAge').value;
    const patientDateNaissance = document.getElementById('patientDateNaissance').value;
    const dateCertificat = document.getElementById('dateCertificat').value || new Date().toISOString().split('T')[0];

    // Split patient name into first and last name
    let nom = '';
    let prenom = '';
    if (patientNomPrenom) {
        const parts = patientNomPrenom.split(' ');
        nom = parts[0] || '';
        prenom = parts.slice(1).join(' ') || '';
    }

    // Use date of birth if available
    const dob = patientDateNaissance || '[Date de naissance]';

    const docteur = localStorage.getItem('docteur') || "";
    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"><\/div>';
    }

    const certificatContent = [
        '<!DOCTYPE html>',
        '<html lang="fr">',
        '<head>',
        '<meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        '<title>Cher confrère<\/title>',
        '<style>',
        'body {',
        'font-family: Arial, sans-serif;',
        'padding: 20px;',
        'background-color: #f9f9f9;',
        '}',
        '.certificat {',
        'background-color: white;',
        'border: 1px solid #ddd;',
        'padding: 20px;',
        'max-width: 600px;',
        'margin: 0 auto;',
        'margin-top: 60px;',
        'box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);',
        '}',
        'h1 {',
        'text-align: center;',
        'color: #333;',
        'text-decoration: underline;',
        'font-size: 20px;',
        '}',
        'p {',
        'line-height: 1.5;',
        'color: #555;',
        '}',
        '.editable-field {',
        'border-bottom: 1px dashed #666;',
        'display: inline-block;',
        'min-width: 50px;',
        'min-height: 20px;',
        'padding: 2px 4px;',
        'margin: 0 3px;',
        '}',
        '.editable-area {',
        'border: 1px solid #ddd;',
        'border-radius: 4px;',
        'padding: 8px;',
        'margin: 5px 0;',
        'width: 100%;',
        'min-height: 20px;',
        'resize: vertical;',
        'overflow: hidden;',
        'font-family: inherit;',
        'font-size: inherit;',
        'line-height: inherit;',
        '}',
        '.editable-area:focus {',
        'outline: none;',
        'border-color: #007bff;',
        '}',
        '#head {',
        'margin-bottom: 20px;',
        '}',
        '#head table {',
        'width: 100%;',
        'border: 0px solid #000000;',
        'padding: 4px;',
        'margin-bottom: 15px;',
        '}',
        '#head td {',
        'text-align: center;',
        '}',
        '.print-button {',
        'text-align: center;',
        'margin-top: 20px;',
        '}',
        '.print-button button {',
        'padding: 10px 20px;',
        'font-size: 16px;',
        'background-color: #007bff;',
        'color: white;',
        'border: none;',
        'border-radius: 5px;',
        'cursor: pointer;',
        '}',
        '.print-button button:hover {',
        'background-color: #0056b3;',
        '}',
        '@media print {',
        '@page {',
        '    size: A5;',
        '    margin: 0.2cm 0.2cm 0.2cm 0.2cm;',
        '}',
        '',
        'body {',
        '    margin: 0 !important;',
        '    padding: 0 !important;',
        '    font-size: 10pt !important;',
        '    line-height: 1.2 !important;',
        '    background-color: white;',
        '}',
        '',
        '.certificat {',
        '    border: none;',
        '    box-shadow: none;',
        '    margin: 0 !important;',
        '    padding: 2px 8px !important;',
        '    max-width: 100% !important;',
        '}',
        '',
        'h1 {',
        '    font-size: 14pt !important;',
        '    margin: 5px 0 !important;',
        '    margin-top: 2cm !important;',
        '}',
        '',
        'input[type="text"],',
        'input[type="date"],',
        'textarea {',
        '    border: none !important;',
        '    background: none !important;',
        '    box-shadow: none !important;',
        '    outline: none !important;',
        '    font-size: 9pt !important;',
        '}',
        '',
        'input[type="text"]:focus,',
        'input[type="date"]:focus,',
        'textarea:focus {',
        '    border: none !important;',
        '    outline: none !important;',
        '}',
        '',
        '/* Styles existants */',
        '.print-button {',
        '    display: none;',
        '}',
        '.editable-field, .editable-area {',
        '    border: none !important;',
        '}',
        '',
        '/* Additional space optimization */',
        '* {',
        '    margin-top: 0 !important;',
        '    margin-bottom: 2px !important;',
        '}',
        '',
        'p {',
        '    margin: 2px 0 !important;',
        '    font-size: 9pt !important;',
        '}',
        '}',
        '<\/style>',
        '<\/head>',
        '<body>',
        enteteContent,
        '',
        '<div class="certificat">',
        '<h1>Cher confrère<\/h1>',
        '<p>',
        'Permettez-moi de vous adresser le(a) sus nommé(e)',
        '<strong><input type="text" value="' + nom + ' ' + prenom + '" class="editable-input"><\/strong>,',
        'né(e) le <strong><input type="text" value="' + dob + '" class="editable-input"><\/strong>,',
        'qui consulte chez nous pour :<br>',
        '<input type="text" id="searchInput" placeholder="Raison de la consultation" class="full-width-input">',
        '',
        '<div class="optional-field">',
        '<input type="text" value="Il(elle) a comme ATCD: " class="label-input">',
        '<input type="text" id="searchInput2" placeholder="Antécédents médicaux" class="full-width-input">',
        '<\/div>',
        '',
        '<div class="optional-field">',
        '<input type="text" value="L\'examen clinique présent: " class="label-input">',
        '<input type="text" id="searchInput3" placeholder="Examen clinique" class="full-width-input">',
        '<\/div>',
        '',
        '<div class="optional-field">',
        '<input type="text" value="Qui fait évoquer: " class="label-input">',
        '<input type="text" id="searchInput4" placeholder="Diagnostic" class="full-width-input">',
        '<\/div>',
        '',
        '<p>Je vous le(la) confie pour avis et éventuelle prise en charge spécialisée.<\/p>',
        '<\/p>',
        '<p style="text-align: right; margin-right: 50px;">',
        'Confraternellement<br>',
		'Dr docteur',
        '<\/p>',
        '<\/div>',
        '',
        '<style>',
        '.editable-input {',
        'border: 1px solid #ddd;',
        'padding: 2px 5px;',
        'margin: 0 3px;',
        'min-width: 100px;',
        '}',
        '.full-width-input {',
        'width: 100%;',
        'border: 1px solid #ddd;',
        'padding: 8px;',
        'margin: 5px 0;',
        'box-sizing: border-box;',
        '}',
        '.label-input {',
        'border: none;',
        'background: none;',
        'font-weight: bold;',
        'padding: 2px 5px;',
        'margin-right: 5px;',
        '}',
        '.optional-field {',
        'margin: 10px 0;',
        '}',
        '',
        '@media print {',
        'input {',
        'border: none !important;',
        'background: none !important;',
        '}',
        '.label-input {',
        'padding: 0 !important;',
        '}',
        'input::placeholder {',
        'color: transparent; /* Rendre le placeholder transparent lors de l\'impression */',
        '}',
        '}',
        '<\/style>',
        '<div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">',
        '    <div style="display: flex; align-items: center; gap: 8px;">',
        '        <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:<\/label>',
        '        <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">',
        '    <\/div>',
        '    <button id="printButton">Imprimer la lettre<\/button>',
        '<\/div>',
		'<script src="certificat-unified-font-size.js"><\/script>',
        '<script>',
        '// Initialisation des champs de la lettre',
        'document.addEventListener(\'DOMContentLoaded\', function() {',
        '    // Gestion des champs de la polyclinique et du docteur',
        '    const polycliniqueInput = document.getElementById(\'polyclinique\');',
        '    const polycliniqueArInput = document.getElementById(\'polyclinique-ar\');',
        '    const docteurInput = document.querySelector(\'[contenteditable]\');',
        '',
        '    if (polycliniqueInput) {',
        '        polycliniqueInput.addEventListener(\'input\', function() {',
        '            localStorage.setItem(\'polyclinique\', this.value);',
        '        });',
        '    }',
        '',
        '    if (polycliniqueArInput) {',
        '        polycliniqueArInput.addEventListener(\'input\', function() {',
        '            localStorage.setItem(\'polyclinique-ar\', this.value);',
        '        });',
        '    }',
        '',
        '    if (docteurInput) {',
        '        docteurInput.addEventListener(\'input\', function() {',
        '            localStorage.setItem(\'docteur\', this.textContent);',
        '        });',
        '    }',
        '',
        '    // Adaptation automatique de la hauteur',
        '    const editableAreas = document.querySelectorAll(\'.editable-area\');',
        '    editableAreas.forEach(area => {',
        '        area.style.height = \'auto\';',
        '        area.style.height = (area.scrollHeight) + \'px\';',
        '',
        '        area.addEventListener(\'input\', function() {',
        '            this.style.height = \'auto\';',
        '            this.style.height = (this.scrollHeight) + \'px\';',
        '        });',
        '    });',
        '',
        '    // Sauvegarder les champs de base',
        '    const fields = [\'searchInput\', \'searchInput2\', \'searchInput3\', \'searchInput4\'];',
        '    fields.forEach(id => {',
        '        const element = document.getElementById(id);',
        '        if (element) {',
        '            // Restaurer la valeur sauvegardée',
        '            const savedValue = localStorage.getItem(id);',
        '            if (savedValue) {',
        '                element.value = savedValue;',
        '            }',
        '            // Ajouter l\'écouteur d\'événement',
        '            element.addEventListener(\'input\', function() {',
        '                localStorage.setItem(id, this.value);',
        '            });',
        '        }',
        '    });',
        '',
        '    // Ajouter l\'écouteur d\'événement pour le bouton d\'impression',
        '    const printButton = document.getElementById(\'printButton\');',
        '    if (printButton) {',
        '        printButton.addEventListener(\'click\', function() {',
        '            window.print();',
        '        });',
        '    }',
        '});',
        '<\/script>',
        '<\/body>',
        '<\/html>'
    ].join('\n');

    const newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
    } else {
        console.error("Impossible d'ouvrir une nouvelle fenetre. Veuillez vérifier les paramètres de blocage des fenetres popup.");
    }
}

// Fonction pour générer un certificat Radiox
function genererRadiox() {
    // Vider uniquement les champs de consultation et type d'exploration
    localStorage.removeItem('raisonConsultation');
    localStorage.removeItem('typeExploration');

    // Get patient information from the form fields
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '[Nom du patient]';
    const patientAge = document.getElementById('patientAge').value;
    const patientDateNaissance = document.getElementById('patientDateNaissance').value;
    const dateCertificat = document.getElementById('dateCertificat').value || new Date().toISOString().split('T')[0];

    // Split patient name into first and last name
    let nom = '';
    let prenom = '';
    if (patientNomPrenom) {
        const parts = patientNomPrenom.split(' ');
        nom = parts[0] || '';
        prenom = parts.slice(1).join(' ') || '';
    }

    // Use date of birth if available
    const dob = patientDateNaissance || '[Date de naissance]';

    const docteur = localStorage.getItem('docteur') || "";

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';
    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    const certificatContent = [
        '<!DOCTYPE html>',
        '<html lang="fr">',
        '<head>',
        '<meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        '<title>Radiox</title>',
        '<style>',
        '/* Général */',
        'body {',
        '    font-family: Arial, sans-serif;',
        '    padding: 20px;',
        '    background-color: #f9f9f9;',
        '}',
        '.certificat {',
        '    background-color: white;',
        '    border: 1px solid #ddd;',
        '    padding: 20px;',
        '    max-width: 600px;',
        '    margin: 0 auto;',
        '    margin-top: 60px;',
        '    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);',
        '}',
        'h1 {',
        '    text-align: center;',
        '    color: #333;',
        '    text-decoration: underline;',
        '    font-size: 20px;',
        '}',
        'p {',
        '    line-height: 1.5;',
        '    color: #555;',
        '}',
        '.editable-area {',
        '    border: 1px solid #ddd;',
        '    border-radius: 4px;',
        '    padding: 8px;',
        '    margin: 5px 0;',
        '    width: 100%;',
        '    min-height: 20px;',
        '    resize: vertical;',
        '    overflow: hidden;',
        '    font-family: inherit;',
        '    font-size: inherit;',
        '    line-height: inherit;',
        '}',
        '.search-box {',
        '    width: 200px;',
        '    padding: 8px;',
        '    border: 1px solid #ddd;',
        '    border-radius: 4px;',
        '    margin-right: 10px;',
        '}',
        '.lock-button {',
        '    background: none;',
        '    border: none;',
        '    cursor: pointer;',
        '    padding: 0;',
        '    margin-left: 10px;',
        '}',
        '.lock-button:hover {',
        '    opacity: 0.8;',
        '}',
        '#suggestions {',
        '    position: absolute;',
        '    background: white;',
        '    border: 1px solid #ddd;',
        '    border-radius: 4px;',
        '    padding: 5px;',
        '    margin-top: 5px;',
        '    max-height: 200px;',
        '    overflow-y: auto;',
        '    width: 200px;',
        '    z-index: 1000;',
        '}',
        '.suggestion-item {',
        '    padding: 5px;',
        '    cursor: pointer;',
        '    border-bottom: 1px solid #eee;',
        '}',
        '.suggestion-item:hover {',
        '    background-color: #f0f0f0;',
        '}',
        '.print-button {',
        '    text-align: center;',
        '    margin-top: 20px;',
        '}',
        '.print-button button {',
        '    padding: 10px 20px;',
        '    font-size: 16px;',
        '    background-color: #007bff;',
        '    color: white;',
        '    border: none;',
        '    border-radius: 5px;',
        '    cursor: pointer;',
        '}',
        '.print-button button:hover {',
        '    background-color: #0056b3;',
        '}',
        '@media print {',
        '    @page {',
        '        size: A5;',
        '        margin: 0.2cm 0.2cm 0.2cm 0.2cm;',
        '    }',
        '',
        '    body {',
        '        margin: 0 !important;',
        '        padding: 0 !important;',
        '        font-size: 10pt !important;',
        '        line-height: 1.2 !important;',
        '        background-color: white;',
        '}',
        '',
        '.certificat {',
        '    padding: 2px 8px !important;',
        '    max-width: 100% !important;',
        '    border: none;',
        '    box-shadow: none;',
        '    margin-top: 0;',
        '}',
        '',
        'h1 {',
        '    font-size: 14pt !important;',
        '    margin: 5px 0 !important;',
        '    margin-top: 2cm !important;',
        '}',
        '',
        'p {',
        '    font-size: 9pt !important;',
        '    margin: 2px 0 !important;',
        '    line-height: 1.2 !important;',
        '}',
        '',
        'input[type="text"],',
        'input[type="date"],',
        'textarea {',
        '    border: none !important;',
        '    background: none !important;',
        '    box-shadow: none !important;',
        '    outline: none !important;',
        '    font-size: 9pt !important;',
        '}',
        '',
        'input[type="text"]:focus,',
        'input[type="date"]:focus,',
        'textarea:focus {',
        '    border: none !important;',
        '    outline: none !important;',
        '}',
        '',
        '/* Rendre le placeholder transparent lors de l\'impression */',
        'input::placeholder,',
        'textarea::placeholder {',
        '    color: transparent;',
        '}',
        '',
        '.print-button {',
        '    display: none;',
        '}',
        '',
        '.editable-area {',
        '    border: none !important;',
        '}',
        '',
        '/* Additional space optimization */',
        '* {',
        '    margin-top: 0 !important;',
        '    margin-bottom: 2px !important;',
        '}',
        '',
        'p {',
        '    margin: 2px 0 !important;',
        '    font-size: 9pt !important;',
        '}',
        '}',
        '<\/style>',
        '<\/head>',
        '<body>',
        enteteContent,
        '<div class="certificat">',
        '<h1>Cher confrère<\/h1>',
        '<div class="contenu-certificat" style="margin-top: 1.5cm !important;">',
        '<p>',
        'Permettez-moi de vous adresser le(a) nommé(e) <strong><input type="text" value="' + nom + ' ' + prenom + '" style="width: 180px;" id="patientNomPrenom"><\/strong>,',
        'né(e) le <strong><input type="text" value="' + dob + '" style="width: 120px;" id="patientDateNaissance"><\/strong>, qui consulte chez nous pour :<br>',
        '<textarea id="raisonConsultation" class="editable-area" placeholder="Raison de la consultation"><\/textarea>',
        '',
        'Pour faire un :<br>',
        '<textarea id="typeExploration" class="editable-area" placeholder="Type d\'exploration"><\/textarea>',
        '<\/p>',
        '<p style="text-align: right; margin-top: 30px;">',
        'Confraternellement<br>',
        '<span class="docteur" style="font-weight: bold;">Dr ' + docteur + '<\/span>',
        '<\/p>',

        '<\/div>',
        '<\/div>',
        '<div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">',
        '    <div style="display: flex; align-items: center; gap: 8px;">',
        '        <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:<\/label>',
        '        <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">',
        '    <\/div>',
        '    <button id="printButton">Imprimer la lettre<\/button>',
        '<\/div>',
        '<script src="print.js"><\/script>',
        '<script src="certificat-unified-font-size.js"><\/script>',
        '<script>',
        '// Sauvegarder les modifications dans le localStorage',
        'function sauvegarderModifications() {',
        'const polycliniqueInput = document.getElementById(\'polyclinique\');',
        'const polycliniqueArInput = document.getElementById(\'polyclinique-ar\');',
        'const docteurInput = document.getElementById(\'docteur\');',
        '',
        '// Sauvegarder les valeurs dans le localStorage',
        'polycliniqueInput.addEventListener(\'input\', function () {',
        'localStorage.setItem(\'polyclinique\', this.value);',
        '});',
        '',
        'polycliniqueArInput.addEventListener(\'input\', function () {',
        'localStorage.setItem(\'polyclinique-ar\', this.value);',
        '});',
        '',
        'docteurInput.addEventListener(\'input\', function () {',
        'localStorage.setItem(\'docteur\', this.value);',
        '});',
        '',
        '// Sauvegarder les champs de base',
        'const fields = [\'docteur\'];',
        'fields.forEach(id => {',
        '    const element = document.getElementById(id);',
        '    if (element) {',
        '        // Restaurer la valeur sauvegardée',
        '        const savedValue = localStorage.getItem(id);',
        '        if (savedValue) {',
        '            element.value = savedValue;',
        '        }',
        '        // Ajouter l\'écouteur d\'événement',
        '        element.addEventListener(\'input\', function() {',
        '            localStorage.setItem(id, this.value);',
        '        });',
        '    }',
        '});',
        '',
        '// Ajouter l\'écouteur d\'événement pour le bouton d\'impression',
        'document.addEventListener(\'DOMContentLoaded\', function() {',
        '    const printButton = document.getElementById(\'printButton\');',
        '    const fontSizeInput = document.getElementById(\'fontSize\');',
        '    ',
        '    if (fontSizeInput) {',
        '        // Charger la taille de police sauvegardée',
        '        const savedFontSize = localStorage.getItem(\'lettreFontSize\') || \'14\';',
        '        fontSizeInput.value = savedFontSize;',
        '        ',
        '        // Appliquer la taille de police',
        '        updateFontSizeInCertificat(savedFontSize, \'lettre\');',
        '        ',
        '        // Écouteur pour le changement de taille',
        '        fontSizeInput.addEventListener(\'input\', function() {',
        '            const fontSize = this.value;',
        '            updateFontSizeInCertificat(fontSize, \'lettre\');',
        '            localStorage.setItem(\'lettreFontSize\', fontSize);',
        '        });',
        '    }',
        '    ',
        '    if (printButton) {',
        '        printButton.addEventListener(\'click\', function() {',
        '            window.print();',
        '        });',
        '    }',
        '});',
        '}',
        'sauvegarderModifications();',
        '<\/script>',
        '<\/body>',
        '<\/html>'
    ].join('\n');

    const newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
    } else {
        console.error("Impossible d'ouvrir une nouvelle fenetre. Veuillez vérifier les paramètres de blocage des fenetres popup.");
    }
}

// Fonction pour générer un certificat de reprise de travail
function genererReprise() {
    // Get patient information from the form fields
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '[Nom du patient]';
    const patientAge = document.getElementById('patientAge').value;
    const patientDateNaissance = document.getElementById('patientDateNaissance').value;
    const dateCertificat = document.getElementById('dateCertificat').value || new Date().toISOString().split('T')[0];

    // Split patient name into first and last name
    let nom = '';
    let prenom = '';
    if (patientNomPrenom) {
        const parts = patientNomPrenom.split(' ');
        nom = parts[0] || '';
        prenom = parts.slice(1).join(' ') || '';
    }

    // Use date of birth if available
    const dob = patientDateNaissance || '[Date de naissance]';

    const docteur = localStorage.getItem('docteur') || "";
    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"><\/div>';
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${day}/${month}/${year}`;

    const certificatContent = [
        '<!DOCTYPE html>',
        '<html lang="fr">',
        '<head>',
        '<meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        '<title>Reprise de travail<\/title>',
        '<style>',
        'body {',
        '    font-family: Arial, sans-serif;',
        '    padding: 20px;',
        '    background-color: #f9f9f9;',
        '}',
        '.certificat {',
        '    background-color: white;',
        '    border: 1px solid #ddd;',
        '    padding: 20px;',
        '    max-width: 600px;',
        '    margin: 0 auto;',
        '    margin-top: 60px;',
        '    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);',
        '}',
        'h1 {',
        '    text-align: center;',
        '    color: #333;',
        '    text-decoration: underline;',
        '    font-size: 20px;',
        '}',
        'p {',
        '    line-height: 1.5;',
        '    color: #555;',
        '}',
        '.editable-field {',
        '    border-bottom: 1px dashed #666;',
        '    display: inline-block;',
        '    min-width: 50px;',
        '    min-height: 20px;',
        '    padding: 2px 4px;',
        '    margin: 0 3px;',
        '}',
        '.editable-area {',
        '    border: 1px solid #ddd;',
        '    border-radius: 4px;',
        '    padding: 8px;',
        '    margin: 5px 0;',
        '    width: 100%;',
        '    min-height: 20px;',
        '    resize: vertical;',
        '    overflow: hidden;',
        '    font-family: inherit;',
        '    font-size: inherit;',
        '    line-height: inherit;',
        '}',
        '.editable-area:focus {',
        '    outline: none;',
        '    border-color: #007bff;',
        '}',
        '#head {',
        '    margin-bottom: 20px;',
        '}',
        '#head table {',
        '    width: 100%;',
        '    border: 0px solid #000000;',
        '    padding: 4px;',
        '    margin-bottom: 15px;',
        '}',
        '#head td {',
        '    text-align: center;',
        '}',
        '.print-button {',
        '    text-align: center;',
        '    margin-top: 20px;',
        '}',
        '.print-button button {',
        '    padding: 10px 20px;',
        '    font-size: 16px;',
        '    background-color: #007bff;',
        '    color: white;',
        '    border: none;',
        '    border-radius: 5px;',
        '    cursor: pointer;',
        '}',
        '.print-button button:hover {',
        '    background-color: #0056b3;',
        '}',
        '@media print {',
        '    @page {',
        '        size: A5;',
        '        margin: 0.2cm 0.2cm 0.2cm 0.2cm;',
        '    }',
        '    body {',
        '        margin: 0 !important;',
        '        padding: 0 !important;',
        '        font-size: 10pt !important;',
        '        line-height: 1.2 !important;',
        '        background-color: white;',
        '    }',
        '    .certificat {',
        '        border: none;',
        '        box-shadow: none;',
        '        margin: 0 !important;',
        '        padding: 2px 8px !important;',
        '        max-width: 100% !important;',
        '    }',
        '    h1 {',
        '        font-size: 14pt !important;',
        '        margin: 5px 0 !important;',
        '        margin-top: 2cm !important;',
        '    }',
        '    p {',
        '        font-size: 9pt !important;',
        '        margin: 2px 0 !important;',
        '        line-height: 1.2 !important;',
        '    }',
        '    input[type="text"],',
        '    input[type="date"],',
        '    textarea {',
        '        border: none !important;',
        '        background: none !important;',
        '        box-shadow: none !important;',
        '        outline: none !important;',
        '        font-size: 9pt !important;',
        '    }',
        '    input[type="text"]:focus,',
        '    input[type="date"]:focus,',
        '    textarea:focus {',
        '        border: none !important;',
        '        outline: none !important;',
        '    }',
        '    input::placeholder,',
        '    textarea::placeholder {',
        '        color: transparent;',
        '    }',
        '    .print-button {',
        '        display: none;',
        '    }',
        '    .editable-field, .editable-area {',
        '        border: none !important;',
        '    }',
        '    /* Additional space optimization */',
        '    * {',
        '        margin-top: 0 !important;',
        '        margin-bottom: 2px !important;',
        '    }',
        '}',
        '<\/style>',
        '<\/head>',
        '<body>',
        enteteContent,
        '<div class="certificat">',
        '<h1>Certificat médical de reprise de travail<\/h1>',
        '<br><br><br>',
        '<p>',
        'Je soussigné, Dr <input type="text" id="docteur" value="' + docteur + '" placeholder="" style="min-width: 150px;">, certifie avoir examiné ce jour',
        'le(a) nommé(e) <strong><input type="text" value="' + nom + ' ' + prenom + '" style="width: 180px;"><\/strong>,',
        '<span class="editable-field" contenteditable="true" style="min-width: 100px; display: inline-block;">né(e) le ' + dob + '<\/span>.<br>',
        'Déclare que son état de santé lui permet de reprendre son travail le : <span class="editable-field" contenteditable="true" style="min-width: 120px; display: inline-block;">' + todayFormatted + '<\/span><br>',
        'Sauf complication.<br>',
        '<\/p>',
        '<p style="text-align: right;">DONT CERTIFICAT<br>',
        '<span class="docteur" style="font-weight: bold;">Dr ' + docteur + '<\/span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
        '<\/p>',
        '<\/div>',
        '<div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">',
        '    <div style="display: flex; align-items: center; gap: 8px;">',
        '        <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:<\/label>',
        '        <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">',
        '    <\/div>',
        '    <button id="printButton">Imprimer le Certificat<\/button>',
        '<\/div>',
		'<script src="certificat-unified-font-size.js"><\/script>',
        '<script>',
        '// Sauvegarder les modifications dans le localStorage',
        'function sauvegarderModifications() {',
        '    const docteurInput = document.getElementById(\'docteur\');',
        '',
        '    // Sauvegarder les valeurs dans le localStorage',
        '    if (docteurInput) {',
        '        docteurInput.addEventListener(\'input\', function () {',
        '            localStorage.setItem(\'docteur\', this.value);',
        '        });',
        '    }',
        '',
        '    // Sauvegarder les champs de base',
        '    const fields = [\'docteur\'];',
        '    fields.forEach(id => {',
        '        const element = document.getElementById(id);',
        '        if (element) {',
        '            // Restaurer la valeur sauvegardée',
        '            const savedValue = localStorage.getItem(id);',
        '            if (savedValue) {',
        '                element.value = savedValue;',
        '            }',
        '            // Ajouter l\'écouteur d\'événement',
        '            element.addEventListener(\'input\', function() {',
        '                localStorage.setItem(id, this.value);',
        '            });',
        '        }',
        '    });',
        '}',
        '',
        '// Ajouter l\'écouteur d\'événement pour le bouton d\'impression',
        'document.addEventListener(\'DOMContentLoaded\', function() {',
        '    const printButton = document.getElementById(\'printButton\');',
        '    if (printButton) {',
        '        printButton.addEventListener(\'click\', function() {',
        '            window.print();',
        '        });',
        '    }',
        '});',
        '<\/script>',
        '<\/body>',
        '<\/html>'
    ].join('\n');

    const newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
    } else {
        console.error("Impossible d'ouvrir une nouvelle fenetre. Veuillez vérifier les paramètres de blocage des fenetres popup.");
    }
}

// Fonction pour générer un certificat de non-grossesse
function genererNonGrossesse() {
    // Get patient information from the form fields
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '[Nom du patient]';
    const patientAge = document.getElementById('patientAge').value;
    const patientDateNaissance = document.getElementById('patientDateNaissance').value;
    const dateCertificat = document.getElementById('dateCertificat').value || new Date().toISOString().split('T')[0];

    // Split patient name into first and last name
    let nom = '';
    let prenom = '';
    if (patientNomPrenom) {
        const parts = patientNomPrenom.split(' ');
        nom = parts[0] || '';
        prenom = parts.slice(1).join(' ') || '';
    }

    // Use date of birth if available
    const dob = patientDateNaissance || '[Date de naissance]';

    const docteur = localStorage.getItem('docteur') || "";
    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"><\/div>';
    }

    const certificatContent = [
        '<!DOCTYPE html>',
        '<html lang="fr">',
        '<head>',
        '<meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        '<title>Certificat de Non-Grossesse<\/title>',
        '<style>',
        'body {',
        '    font-family: Arial, sans-serif;',
        '    padding: 20px;',
        '    background-color: #f9f9f9;',
        '}',
        '.certificat {',
        '    background-color: white;',
        '    border: 1px solid #ddd;',
        '    padding: 20px;',
        '    max-width: 600px;',
        '    margin: 0 auto;',
        '    margin-top: 60px;',
        '    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);',
        '}',
        'h1 {',
        '    text-align: center;',
        '    color: #333;',
        '    text-decoration: underline;',
        '    font-size: 20px;',
        '}',
        'h2 {',
        '    text-align: center;',
        '    color: #555;',
        '    font-size: 16px;',
        '    margin-top: 5px;',
        '    margin-bottom: 15px;',
        '}',
        'p {',
        '    line-height: 1.5;',
        '    color: #555;',
        '}',
        '.editable-field {',
        '    border-bottom: 1px dashed #666;',
        '    display: inline-block;',
        '    min-width: 50px;',
        '    min-height: 20px;',
        '    padding: 2px 4px;',
        '    margin: 0 3px;',
        '}',
        '.editable-area {',
        '    border: 1px solid #ddd;',
        '    border-radius: 4px;',
        '    padding: 8px;',
        '    margin: 5px 0;',
        '    width: 100%;',
        '    min-height: 20px;',
        '    resize: vertical;',
        '    overflow: hidden;',
        '    font-family: inherit;',
        '    font-size: inherit;',
        '    line-height: inherit;',
        '}',
        '.editable-area:focus {',
        '    outline: none;',
        '    border-color: #007bff;',
        '}',
        '#head {',
        '    margin-bottom: 20px;',
        '}',
        '#head table {',
        '    width: 100%;',
        '    border: 0px solid #000000;',
        '    padding: 4px;',
        '    margin-bottom: 15px;',
        '}',
        '#head td {',
        '    text-align: center;',
        '}',
        '.print-button {',
        '    text-align: center;',
        '    margin-top: 20px;',
        '}',
        '.print-button button {',
        '    padding: 10px 20px;',
        '    font-size: 16px;',
        '    background-color: #007bff;',
        '    color: white;',
        '    border: none;',
        '    border-radius: 5px;',
        '    cursor: pointer;',
        '}',
        '.print-button button:hover {',
        '    background-color: #0056b3;',
        '}',
        '@media print {',
        '    @page {',
        '        size: A5;',
        '        margin: 0.2cm 0.2cm 0.2cm 0.2cm;',
        '    }',
        '    body {',
        '        margin: 0 !important;',
        '        padding: 0 !important;',
        '        font-size: 10pt !important;',
        '        line-height: 1.2 !important;',
        '        background-color: white;',
        '    }',
        '    .certificat {',
        '        border: none;',
        '        box-shadow: none;',
        '        margin: 0 !important;',
        '        padding: 2px 8px !important;',
        '        max-width: 100% !important;',
        '    }',
        '    h1 {',
        '        font-size: 14pt !important;',
        '        margin: 5px 0 !important;',
        '        margin-top: 2cm !important;',
        '    }',
        '    h2 {',
        '        font-size: 12pt !important;',
        '        margin: 3px 0 !important;',
        '    }',
        '    input[type="text"],',
        '    input[type="date"],',
        '    textarea {',
        '        border: none !important;',
        '        background: none !important;',
        '        box-shadow: none !important;',
        '        outline: none !important;',
        '        font-size: 9pt !important;',
        '    }',
        '    input[type="text"]:focus,',
        '    input[type="date"]:focus,',
        '    textarea:focus {',
        '        border: none !important;',
        '        outline: none !important;',
        '    }',
        '    input::placeholder,',
        '    textarea::placeholder {',
        '        color: transparent;',
        '    }',
        '    .print-button {',
        '        display: none;',
        '    }',
        '    .editable-field, .editable-area {',
        '        border: none !important;',
        '    }',
        '    /* Additional space optimization */',
        '    * {',
        '        margin-top: 0 !important;',
        '        margin-bottom: 2px !important;',
        '    }',
        '    p {',
        '        margin: 2px 0 !important;',
        '        font-size: 9pt !important;',
        '    }',
        '}',
        '<\/style>',
        '<\/head>',
        '<body>',
        enteteContent,
        '<div class="certificat">',
        '<h1>CERTIFICAT MEDICAL DE NON-GROSSESSE<\/h1>',
        '<div class="contenu-certificat" style="margin-top: 1cm !important;">',
        '<p>',
        'Je soussigné(e), Dr <input type="text" id="docteur" value="' + docteur + '" placeholder="Medecin">, certifie avoir examiné ce jour :<br>',
        '<strong><input type="text" value="' + nom + ' ' + prenom + '" style="width: 180px;"><\/strong>',
        '<br>',
        'née le : <strong><input type="text" value="' + dob + '" style="width: 120px;"><\/strong>',
        '<br>',
        'Je n\'ai constaté aucun signe clinique évocateur d\'une grossesse en cours à  la date du présent certificat.<br>',
        'Ce certificat est délivré à  la demande de l\'intéressée et remis en main propre pour servir et valoir ce que de droit.<br>',
        '<\/p>',
        '<p style="text-align: right;">Signature :<br>',
        '<span class="docteur" style="font-weight: bold;">Dr ' + docteur + '<\/span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
        '<\/p>',
        '<\/div>',
        '<\/div>',
        '<div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">',
        '    <div style="display: flex; align-items: center; gap: 8px;">',
        '        <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:<\/label>',
        '        <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">',
        '    <\/div>',
        '    <button id="printButton">Imprimer le Certificat<\/button>',
        '<\/div>',
		'<script src="certificat-unified-font-size.js"><\/script>',
        '<script>',
        '// Sauvegarder les modifications dans le localStorage',
        'function sauvegarderModifications() {',
        '    const docteurInput = document.getElementById(\'docteur\');',
        '',
        '    // Sauvegarder les valeurs dans le localStorage',
        '    if (docteurInput) {',
        '        docteurInput.addEventListener(\'input\', function () {',
        '            localStorage.setItem(\'docteur\', this.value);',
        '        });',
        '    }',
        '',
        '    // Sauvegarder les champs de base',
        '    const fields = [\'docteur\'];',
        '    fields.forEach(id => {',
        '        const element = document.getElementById(id);',
        '        if (element) {',
        '            // Restaurer la valeur sauvegardée',
        '            const savedValue = localStorage.getItem(id);',
        '            if (savedValue) {',
        '                element.value = savedValue;',
        '            }',
        '            // Ajouter l\'écouteur d\'événement',
        '            element.addEventListener(\'input\', function() {',
        '                localStorage.setItem(id, this.value);',
        '            });',
        '        }',
        '    });',
        '}',
        '',
        '// Appeler la fonction de sauvegarde',
        'sauvegarderModifications();',
        '',
        '// Ajouter l\'écouteur d\'événement pour le bouton d\'impression',
        'document.addEventListener(\'DOMContentLoaded\', function() {',
        '    const printButton = document.getElementById(\'printButton\');',
        '    if (printButton) {',
        '        printButton.addEventListener(\'click\', function() {',
        '            window.print();',
        '        });',
        '    }',
        '});',
        '<\/script>',
        '<\/body>',
        '<\/html>'
    ].join('\n');

    const newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
    } else {
        console.error("Impossible d'ouvrir une nouvelle fenetre. Veuillez vérifier les paramètres de blocage des fenetres popup.");
    }
}

// Fonction pour générer un certificat de maladie chronique
function genererChronique() {
    // Get patient information from the form fields
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '[Nom du patient]';
    const patientAge = document.getElementById('patientAge').value;
    const patientDateNaissance = document.getElementById('patientDateNaissance').value;
    const dateCertificat = document.getElementById('dateCertificat').value || new Date().toISOString().split('T')[0];

    // Split patient name into first and last name
    let nom = '';
    let prenom = '';
    if (patientNomPrenom) {
        const parts = patientNomPrenom.split(' ');
        nom = parts[0] || '';
        prenom = parts.slice(1).join(' ') || '';
    }

    // Use date of birth if available
    const dob = patientDateNaissance || '[Date de naissance]';

    const docteur = localStorage.getItem('docteur') || "";
    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"><\/div>';
    }

    const certificatContent = [
        '<!DOCTYPE html>',
        '<html lang="fr">',
        '<head>',
        '<meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        '<title>Chronique<\/title>',
        '<style>',
        'body {',
        'font-family: Arial, sans-serif;',
        'padding: 20px;',
        'background-color: #f9f9f9;',
        '}',
        '.certificat {',
        'background-color: white;',
        'border: 1px solid #ddd;',
        'padding: 20px;',
        'max-width: 600px;',
        'margin: 0 auto;',
        'margin-top: 60px;',
        'box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);',
        '}',
        'h1 {',
        'text-align: center;',
        'color: #333;',
        'text-decoration: underline;',
        'font-size: 20px;',
        '}',

        'p {',
        'line-height: 1.5;',
        'color: #555;',
        '}',
        '.editable-field {',
        'border-bottom: 1px dashed #666;',
        'display: inline-block;',
        'min-width: 50px;',
        'min-height: 20px;',
        'padding: 2px 4px;',
        'margin: 0 3px;',
        '}',
        '.editable-area {',
        'border: 1px solid #ddd;',
        'border-radius: 4px;',
        'padding: 8px;',
        'margin: 5px 0;',
        'width: 100%;',
        'min-height: 20px;',
        'resize: vertical;',
        'overflow: hidden;',
        'font-family: inherit;',
        'font-size: inherit;',
        'line-height: inherit;',
        '}',
        '.editable-area:focus {',
        'outline: none;',
        'border-color: #007bff;',
        '}',
        '#head {',
        'margin-bottom: 20px;',
        '}',
        '#head table {',
        'width: 100%;',
        'border: 0px solid #000000;',
        'padding: 4px;',
        'margin-bottom: 15px;',
        '}',
        '#head td {',
        'text-align: center;',
        '}',
        '.print-button {',
        'text-align: center;',
        'margin-top: 20px;',
        '}',
        '.print-button button {',
        'padding: 10px 20px;',
        'font-size: 16px;',
        'background-color: #007bff;',
        'color: white;',
        'border: none;',
        'border-radius: 5px;',
        'cursor: pointer;',
        '}',
        '.print-button button:hover {',
        'background-color: #0056b3;',
        '}',
        '@media print {',
        '@page {',
        'size: A5;',
        'margin: 0.2cm 0.2cm 0.2cm 0.2cm;',
        '}',
        'body {',
        'margin: 0 !important;',
        'padding: 0 !important;',
        'font-size: 10pt !important;',
        'background-color: white;',
        '}',
        '.certificat {',
        'padding: 2px 8px !important;',
        'max-width: 100% !important;',
        'border: none;',
        'box-shadow: none;',
        'margin-top: 0;',
        '}',
        'h1 {',
        'font-size: 14pt !important;',
        'margin: 5px 0 !important;',
        'margin-top: 2cm !important;',
        '}',
        'p {',
        'font-size: 9pt !important;',
        'margin: 2px 0 !important;',
        'line-height: 1.2 !important;',
        '}',
        'input[type="text"],',
        'input[type="date"],',
        'textarea {',
        'border: none !important;',
        'background: none !important;',
        'box-shadow: none !important;',
        'outline: none !important;',
        'font-size: 9pt !important;',
        '}',
        'input[type="text"]:focus,',
        'input[type="date"]:focus,',
        'textarea:focus {',
        'border: none !important;',
        'outline: none !important;',
        '}',
        '/* Rendre le placeholder transparent lors de l\'impression */',
        'input::placeholder,',
        'textarea::placeholder {',
        'color: transparent;',
        '}',
        '.print-button {',
        'display: none;',
        '}',
        '.editable-field, .editable-area {',
        'border: none !important;',
        '}',
        '}',
        '<\/style>',
        '<\/head>',
        '<body>',
        enteteContent,
        '<div class="certificat">',
        '<h1>Certificat médical de maladie chronique<\/h1>',
        '<br>',
        '<p>',
        'Je soussigné, Dr <input type="text" id="docteur" value="' + docteur + '" placeholder="Medecin">, certifie que',
        'le(a) nommé(e) <strong><input type="text" value="' + nom + ' ' + prenom + '" style="width: 180px;"><\/strong>,',
        '<span class="editable-field" contenteditable="true" style="min-width: 100px; display: inline-block;">né(e) le ' + dob + '<\/span>.<br>',
        'Présente une maladie chronique de type :<br>',
        '<textarea placeholder="Type de maladie chronique" style="width: 100%;"><\/textarea><br>',
        'Depuis :<br>',
        '<input type="text" placeholder="Date de début"><br>',
        'Nécessitant un traitement à  long cours à  base de : <br>',
        '<textarea placeholder="Traitement" style="width: 100%;"><\/textarea><br>',
        'Ce certificat est établi sur les renseignements fournis par le(a) patient(e) et délivré à  la demande de l\'intéressé(e) pour servir et valoir ce que de droit.<br>',
        '<\/p>',
        '<p style="text-align: right;">DONT CERTIFICAT<br>',
        '<span class="docteur" style="font-weight: bold;">Dr ' + docteur + '<\/span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
        '<\/p>',
        '<\/div>',
        '<div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">',
        '    <div style="display: flex; align-items: center; gap: 8px;">',
        '        <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:<\/label>',
        '        <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">',
        '    <\/div>',
        '    <button id="printButton">Imprimer le Certificat<\/button>',
        '<\/div>',
		'<script src="certificat-unified-font-size.js"><\/script>',
        '<script>',
        '// Sauvegarder les modifications dans le localStorage',
        'function sauvegarderModifications() {',
        'const polycliniqueInput = document.getElementById(\'polyclinique\');',
        'const polycliniqueArInput = document.getElementById(\'polyclinique-ar\');',
        'const docteurInput = document.getElementById(\'docteur\');',
        '',
        '// Sauvegarder les valeurs dans le localStorage',
        'if (polycliniqueInput) {',
        '    polycliniqueInput.addEventListener(\'input\', function () {',
        '        localStorage.setItem(\'polyclinique\', this.value);',
        '    });',
        '}',
        '',
        'if (polycliniqueArInput) {',
        '    polycliniqueArInput.addEventListener(\'input\', function () {',
        '        localStorage.setItem(\'polyclinique-ar\', this.value);',
        '    });',
        '}',
        '',
        'if (docteurInput) {',
        '    docteurInput.addEventListener(\'input\', function () {',
        '        localStorage.setItem(\'docteur\', this.value);',
        '    });',
        '}',
        '',
        '// Sauvegarder les champs de base',
        'const fields = [\'docteur\'];',
        'fields.forEach(id => {',
        '    const element = document.getElementById(id);',
        '    if (element) {',
        '        // Restaurer la valeur sauvegardée',
        '        const savedValue = localStorage.getItem(id);',
        '        if (savedValue) {',
        '            element.value = savedValue;',
        '        }',
        '        // Ajouter l\'écouteur d\'événement',
        '        element.addEventListener(\'input\', function() {',
        '            localStorage.setItem(id, this.value);',
        '        });',
        '    }',
        '});',
        '}',
        '',
        '// Appeler la fonction de sauvegarde',
        'sauvegarderModifications();',
        '',
        '// Ajouter l\'écouteur d\'événement pour le bouton d\'impression',
        'document.addEventListener(\'DOMContentLoaded\', function() {',
        '    const printButton = document.getElementById(\'printButton\');',
        '    if (printButton) {',
        '        printButton.addEventListener(\'click\', function() {',
        '            window.print();',
        '        });',
        '    }',
        '});',
        '<\/script>',
        '<\/body>',
        '<\/html>'
    ].join('\n');

    const newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
    } else {
        console.error("Impossible d'ouvrir une nouvelle fenetre. Veuillez vérifier les paramètres de blocage des fenetres popup.");
    }
}

// Fonction pour générer un certificat CBV
function genererCvb() {
    // Get patient information from the form fields
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '[Nom du patient]';
    const patientAge = document.getElementById('patientAge').value;
    const patientDateNaissance = document.getElementById('patientDateNaissance').value;
    const dateCertificat = document.getElementById('dateCertificat').value || new Date().toISOString().split('T')[0];


    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }


    const certificatContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CBV</title>
    <style>
body {
font-family: Arial, sans-serif;
padding: 20px;
background-color: #f9f9f9;
}
.certificat {
background-color: white;
border: 1px solid #ddd;
padding: 20px;
max-width: 600px;
margin: 0 auto;
margin-top: 60px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h1 {
text-align: center;
color: #333;
text-decoration: underline;
font-size: 20px;
}
p {
line-height: 1.5;
color: #555;
}
.editable-field {
border-bottom: 1px dashed #666;
display: inline-block;
min-width: 50px;
min-height: 20px;
padding: 2px 4px;
margin: 0 3px;
}
.editable-area {
border: 1px solid #ddd;
border-radius: 4px;
padding: 8px;
margin: 5px 0;
width: 100%;
min-height: 20px;
resize: vertical;
overflow: hidden;
font-family: inherit;
font-size: inherit;
line-height: inherit;
}
.editable-area:focus {
outline: none;
border-color: #007bff;
}
#head {
margin-bottom: 20px;
}
#head table {
width: 100%;
border: 0px solid #000000;
padding: 4px;
margin-bottom: 15px;
}
#head td {
text-align: center;
}
.print-button {
text-align: center;
margin-top: 20px;
}
.print-button button {
padding: 10px 20px;
font-size: 16px;
background-color: #007bff;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
}
.print-button button:hover {
background-color: #0056b3;
}
@media print {
@page {
size: A5;
margin: 0.2cm 0.2cm 0.2cm 0.2cm;
}
body {
margin: 0 !important;
padding: 0 !important;
font-size: 10pt !important;
background-color: white;
}
.certificat {
padding: 2px 8px !important;
max-width: 100% !important;
border: none;
box-shadow: none;
margin-top: 0;
}
h1 {
font-size: 14pt !important;
margin: 5px 0 !important;
margin-top: 2cm !important;
}
p {
font-size: 9pt !important;
margin: 2px 0 !important;
line-height: 1.2 !important;
}
input[type="text"],
input[type="date"],
input[type="time"],
select,
textarea {
border: none !important;
background: none !important;
box-shadow: none !important;
outline: none !important;
font-size: 9pt !important;
}
input[type="text"]:focus,
input[type="date"]:focus,
input[type="time"]:focus,
select:focus,
textarea:focus {
border: none !important;
outline: none !important;
}
.print-button {
display: none;
}

/* Masquer les contrôles d'impression et de sauvegarde */
.print-button div[style*="align-items: center"],
.print-button button {
    display: none !important;
}

.editable-field, .editable-area {
border: none !important;
}
#btnCorriger, #correctionStatus, #correctionsContainer {
display: none !important;
}
}
</style>
</head>
<body>
${enteteContent}
    <div class="certificat">
        <h1>Certificat médical descriptif</h1>
        <p>
            Je soussigné, Dr <input type="text" id="docteur" value="${docteur}" placeholder="" style="width: 120px;">, 
            certifie avoir examiné ce jour le(la) susnommé(e) 
            <strong><input type="text" value="${patientNomPrenom}" style="width: 180px;"></strong>,          
			<span class="editable-field" contenteditable="true" data-field="date-naissance">né(e) le ${patientDateNaissance}</span>.
        </p>
        <p>
            qui m'a déclaré avoir été victime de 	<select id="typeAccident" style="
    width: 160px;
    padding: 5px;
    margin: 5px 0;
    border: none;
    background-color: transparent;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
"><option value="cbv">CBV</option>
        <option value="accident_at">Accident de travail</option>
        <option value="accident_circulation">Accident de circulation</option>
        <option value="accident_sportif">Accident sportif</option>
        <option value="autre">Autre</option>
    </select>
</strong>,
            
			 le <span class="editable-field" contenteditable="true" data-field="date-certificat">${todayFormatted}</span>
			 à l'heure :
<input type="time" id="heureAccident">
</p>

            L'examen clinique présente :<br> 
		

        <br>
    <input type="text" id="descriptionAccident" placeholder="" style="width: 180px; margin: 5px 0;" value=" ">
    </p>
        </p>
		<div>
              <div id="autocompleteWrapper" style="position:relative;display:inline-block;">
                <textarea id="texteDescription" lang="fr" spellcheck="true" placeholder="Décrivez ici l'état du patient..." style="width: 580px;height: 100px;"></textarea>
                <div id="autocompleteDropdown" style="display:none;position:absolute;left:0;top:100%;background:#fff;border:1px solid #2196F3;border-radius:4px;max-height:180px;overflow-y:auto;z-index:9999;width:580px;box-shadow:0 4px 12px rgba(0,0,0,0.15);"></div>
              </div><br>
              <div style="margin-top: 5px;">
                <button id="btnCorriger" type="button" style="padding: 5px 12px; font-size: 12px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 5px;">
                  <i class="fas fa-spell-check"></i> Corriger l'orthographe
                </button>
                <span id="correctionStatus" style="font-size: 12px; color: #666; margin-left: 8px;"></span>
              </div>
              <div id="correctionsContainer" style="margin-top: 5px; max-height: 200px; overflow-y: auto;"></div>
			   ce certificat est établi et remis en mains propre de l'intéressé(e) pour
 faire valoir ce que de droit .
        </div>
        <p style="text-align: right; margin-top: 30px;">
            Dont certificat<br>
            <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>
        </p>
    </div>
    <div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">
        <div style="display: flex; align-items: center; gap: 8px;">
            <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:</label>
            <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">
        </div>
        <button id="printButton">Imprimer le Certificat</button>
		<button id="saveButtoncbv">Sauvegarder</button>
    </div>
    

</body>
</html>
`;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();

        // Attacher l'événement d'impression directement après la fermeture du document
        newWindow.onload = function () {
            var doc = newWindow.document;

            // --- CHARGER LE SCRIPT FONT SIZE ---
            var fsScript = doc.createElement('script');
            fsScript.src = 'certificat-unified-font-size.js';
            doc.head.appendChild(fsScript);

            // --- CHARGER LES TERMES DEPUIS localStorage ---
            var TERMES = [];
            try {
                var termesData = localStorage.getItem('termesJuridiques');
                if (termesData) {
                    var parsed = JSON.parse(termesData);
                    for (var key in parsed) {
                        if (parsed.hasOwnProperty(key) && Array.isArray(parsed[key])) {
                            TERMES = TERMES.concat(parsed[key]);
                        }
                    }
                }
            } catch(e) {}

            var textarea = doc.getElementById('texteDescription');
            var btnCorriger = doc.getElementById('btnCorriger');
            var statusEl = doc.getElementById('correctionStatus');
            var correctionsContainer = doc.getElementById('correctionsContainer');
            var dropdown = doc.getElementById('autocompleteDropdown');

            if (textarea && dropdown) {
                textarea.addEventListener('input', function() {
                    var cursorPos = textarea.selectionStart;
                    var textBefore = textarea.value.substring(0, cursorPos);
                    var words = textBefore.split(/[\s\n]/);
                    var currentWord = words[words.length - 1];

                    if (currentWord.length < 2) { dropdown.style.display = 'none'; return; }

                    var search = currentWord.toLowerCase();
                    var matches = TERMES.filter(function(t) {
                        return t.toLowerCase().indexOf(search) !== -1;
                    }).slice(0, 8);

                    if (matches.length === 0) { dropdown.style.display = 'none'; return; }

                    dropdown.innerHTML = '';
                    matches.forEach(function(m) {
                        var item = doc.createElement('div');
                        item.textContent = m;
                        item.style.cssText = 'padding:6px 10px;cursor:pointer;font-size:12px;border-bottom:1px solid #eee;';
                        item.onmouseenter = function() { item.style.background = '#e3f2fd'; };
                        item.onmouseleave = function() { item.style.background = '#fff'; };
                        item.onclick = function() {
                            var after = textarea.value.substring(cursorPos);
                            var prefix = textarea.value.substring(0, cursorPos - currentWord.length);
                            textarea.value = prefix + m + after;
                            dropdown.style.display = 'none';
                            textarea.focus();
                            var newPos = prefix.length + m.length;
                            textarea.setSelectionRange(newPos, newPos);
                        };
                        dropdown.appendChild(item);
                    });
                    dropdown.style.display = 'block';
                });

                textarea.addEventListener('blur', function() {
                    setTimeout(function() { dropdown.style.display = 'none'; }, 200);
                });
            }

            if (btnCorriger && textarea && statusEl && correctionsContainer) {
                btnCorriger.addEventListener('click', function() {
                    var text = textarea.value.trim();
                    if (!text) {
                        statusEl.textContent = 'Veuillez saisir du texte a verifier.';
                        statusEl.style.color = '#e67e22';
                        return;
                    }

                    statusEl.textContent = 'Verification en cours...';
                    statusEl.style.color = '#2196F3';
                    correctionsContainer.innerHTML = '';

                    fetch('https://api.languagetool.org/v2/check', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: 'text=' + encodeURIComponent(text) + '&language=fr-FR&enabledOnly=false'
                    })
                    .then(function(response) {
                        if (!response.ok) throw new Error('API error');
                        return response.json();
                    })
                    .then(function(data) {
                        if (data.matches.length === 0) {
                            statusEl.textContent = 'Aucune erreur trouvee.';
                            statusEl.style.color = '#4CAF50';
                            return;
                        }

                        statusEl.textContent = data.matches.length + ' erreur(s) trouvee(s).';
                        statusEl.style.color = '#e74c3c';

                        data.matches.forEach(function(match) {
                            var div = doc.createElement('div');
                            div.style.cssText = 'background:#fff3cd;border:1px solid #ffc107;border-radius:4px;padding:8px;margin-bottom:5px;font-size:12px;';

                            var erroneousText = text.substring(match.offset, match.offset + match.length);
                            var suggestions = match.replacements.slice(0, 5);

                            var html = '<div style="margin-bottom:4px;"><strong style="color:#856404;">&#9888; ' +
                                match.message + '</strong></div>';

                            html += '<div style="margin-bottom:4px;">Texte : <span style="background:#ffc107;padding:1px 4px;border-radius:2px;">' +
                                erroneousText + '</span></div>';

                            if (suggestions.length > 0) {
                                html += '<div style="margin-bottom:2px;">Suggestions :</div>';
                                suggestions.forEach(function(rep) {
                                    html += '<button class="suggestion-btn" data-replacement="' +
                                        rep.value.replace(/"/g, '&quot;') +
                                        '" data-offset="' + match.offset +
                                        '" data-length="' + match.length +
                                        '" style="display:inline-block;padding:2px 8px;margin:2px;font-size:11px;background:#e3f2fd;border:1px solid #2196F3;border-radius:3px;cursor:pointer;">' +
                                        rep.value + '</button>';
                                });
                            }

                            div.innerHTML = html;
                            correctionsContainer.appendChild(div);
                        });

                        correctionsContainer.addEventListener('click', function(e) {
                            var btn = e.target.closest('.suggestion-btn');
                            if (!btn) return;

                            var replacement = btn.getAttribute('data-replacement');
                            var offset = parseInt(btn.getAttribute('data-offset'));
                            var length = parseInt(btn.getAttribute('data-length'));
                            var currentText = textarea.value;

                            textarea.value = currentText.substring(0, offset) + replacement + currentText.substring(offset + length);

                            statusEl.textContent = 'Correction appliquee.';
                            statusEl.style.color = '#4CAF50';

                            btn.parentElement.style.display = 'none';
                        });
                    })
                    .catch(function() {
                        statusEl.textContent = 'Erreur reseau. Reessayez.';
                        statusEl.style.color = '#e74c3c';
                    });
                });
            }

            // Impression
            var printButton = doc.getElementById('printButton');
            if (printButton) {
                printButton.addEventListener('click', function () {
                    newWindow.print();
                });
            }

            // Sauvegarde
            var saveButton = doc.getElementById('saveButtoncbv');
            if (saveButton) {
                saveButton.addEventListener('click', function () {
                    sauvegarderCBV(newWindow);
                });
            }
        };
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

// Fonction pour sauvegarder le certificat CBV
// =====================================================
// Fonction pour sauvegarder le certificat CBV
// =====================================================
async function sauvegarderCBV(certificatWindow) {
    try {

        // ================================
        // Nom et prénom du patient
        // ================================
        const nomPrenomInput = certificatWindow.document.querySelector(
            'input[type="text"]:not(#docteur)'
        );

        let nom = '';
        let prenom = '';

        if (nomPrenomInput && nomPrenomInput.value.trim()) {
            const parts = nomPrenomInput.value.trim().split(/\s+/);
            nom = parts.shift();
            prenom = parts.join(' ');
        }

        // ================================
        // Médecin
        // ================================
        const medecinInput = certificatWindow.document.getElementById('docteur');
        const medecin = medecinInput ? medecinInput.value.trim() : '';

        // ================================
        // Dates (fiables via data-field)
        // ================================
        const dateCertificatText = certificatWindow.document
            .querySelector('[data-field="date-certificat"]')
            ?.textContent.trim();

        const dateNaissanceText = certificatWindow.document
            .querySelector('[data-field="date-naissance"]')
            ?.textContent.trim();

        // ================================
        // Normalisation des dates
        // ================================
        function normalizeDate(text) {
            if (!text) return null;

            const match = text.match(/(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})/);
            if (!match) return null;

            let date = match[1];
            if (date.includes('/')) {
                const [d, m, y] = date.split('/');
                date = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
            }
            return date;
        }

        const dateCertificat =
            normalizeDate(dateCertificatText) ||
            new Date().toISOString().split('T')[0];

        const dateNaissance = normalizeDate(dateNaissanceText);

        // ================================
        // Type d'accident
        // ================================
        const typeAccidentSelect = certificatWindow.document.getElementById('typeAccident');
        const titre = typeAccidentSelect ? typeAccidentSelect.value : null;

        // ================================
        // Description / Examen
        // ================================
        const descriptionInput = certificatWindow.document.getElementById('descriptionAccident');
        const examen = descriptionInput ? descriptionInput.value.trim() : null;

        // ================================
        // Heure
        // ================================
        const heureInput = certificatWindow.document.getElementById('heureAccident');
        const heure = heureInput && heureInput.value ? heureInput.value : null;

        // ================================
        // Vérifications
        // ================================
        if (!nom || !prenom) {
            alert('❌ Nom et prénom du patient obligatoires.');
            return;
        }

        if (!medecin) {
            alert('❌ Nom du médecin obligatoire.');
            return;
        }

        // ================================
        // Message API
        // ================================
        const message = {
            nom,
            prenom,
            medecin,
            date_certificat: dateCertificat,
            date_naissance: dateNaissance,
            titre,
            examen,
            heure
        };

        console.log('📤 Envoi CBV API:', message);

        // ================================
        // Envoi à l'API
        // ================================
        const response = await fetch('http://localhost:5000/api/ajouter_cbv', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        });

        const data = await response.json();

        if (data && data.success) {
            certificatWindow.alert('✅ Certificat CBV sauvegardé avec succès.');
        } else {
            certificatWindow.alert('❌ Erreur sauvegarde : ' + (data?.error || 'Réponse invalide'));
        }

    } catch (error) {
        console.error('❌ Erreur sauvegarderCBV:', error);
        alert('Erreur lors de la sauvegarde : ' + error.message);
    }
}

// Fonction pour générer un certificat d'arrêt de travail
function genererArretTravail() {
    const polyclinique = document.getElementById('polyclinique').value;
    const docteur = document.getElementById('docteur').value;

    // Get patient information from the form fields
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '[Nom de l\'élève]';
    const patientAge = document.getElementById('patientAge').value;
    const patientDateNaissance = document.getElementById('patientDateNaissance').value;
    const dateCertificat = document.getElementById('dateCertificat').value || new Date().toISOString().split('T')[0];

    // Construire la partie de l'âge/date de naissance
    let ageInfo = '';
    if (patientAge) {
        ageInfo = 'agé(e) de ' + patientAge;
    } else if (patientDateNaissance) {
        ageInfo = 'né(e) le ' + patientDateNaissance;
    } else {
        ageInfo = 'né(e) le [Date de naissance]';
    }

    // Format the date for display
    const formattedDate = new Date(dateCertificat).toLocaleDateString('fr-FR');

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    const certificatHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' 'unsafe-eval'; object-src 'none';">
<title>Certificat d'arret de Travail</title>
<style>
body {
font-family: Arial, sans-serif;
padding: 20px;
background-color: #f9f9f9;
}
.certificat {
background-color: white;
border: 1px solid #ddd;
padding: 20px;
max-width: 600px;
margin: 0 auto;
margin-top: 60px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h1 {
text-align: center;
color: #333;
text-decoration: underline;
font-size: 20px;
}
p {
line-height: 1.5;
color: #555;
}
.editable-field {
border-bottom: 1px dashed #666;
display: inline-block;
min-width: 50px;
min-height: 20px;
padding: 2px 4px;
margin: 0 3px;
}
.editable-area {
border: 1px solid #ddd;
border-radius: 4px;
padding: 8px;
margin: 5px 0;
width: 100%;
min-height: 20px;
resize: vertical;
overflow: hidden;
font-family: inherit;
font-size: inherit;
line-height: inherit;
}
.editable-area:focus {
outline: none;
border-color: #007bff;
}
#head {
margin-bottom: 20px;
}
#head table {
width: 100%;
border: 0px solid #000000;
padding: 4px;
margin-bottom: 15px;
}
#head td {
text-align: center;
}
.print-button {
text-align: center;
margin-top: 20px;
}
.print-button button {
padding: 10px 20px;
font-size: 16px;
background-color: #007bff;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
}
.print-button button:hover {
background-color: #0056b3;
}
@media print {
@page {
    size: A5;
    margin: 0.2cm 0.2cm 0.2cm 0.2cm;
}

body {
    margin: 0 !important;
    padding: 0 !important;
    font-size: 10pt !important;
    line-height: 1.2 !important;
    background-color: white;
}

.certificat {
    border: none;
    box-shadow: none;
    margin: 0 !important;
    padding: 2px 8px !important;
    max-width: 100% !important;
}

h1 {
    font-size: 14pt !important;
    margin: 5px 0 !important;
    margin-top: 2cm !important;
}

input[type="text"],
input[type="date"],
textarea {
    border: none !important;
    background: none !important;
    box-shadow: none !important;
    outline: none !important;
    font-size: 9pt !important;
}

input[type="text"]:focus,
input[type="date"]:focus,
textarea:focus {
    border: none !important;
    outline: none !important;
}

.print-button {
    display: none;
}

.editable-field, .editable-area {
    border: none !important;
}

/* Additional space optimization */
* {
    margin-top: 0 !important;
    margin-bottom: 2px !important;
}

p {
    margin: 2px 0 !important;
    font-size: 9pt !important;
}
}
</style>
</head>
<body>
${enteteContent}
<div class="certificat">
<h1>CERTIFICAT MÉDICAL D'ARRÊT DE TRAVAIL</h1>
<br><br><br>
<p>
Je soussigné, Dr <input type="text" id="docteur" value="${docteur}" placeholder="">, certifie avoir examiné ce jour
<strong><input type="text" value="${patientNomPrenom}" style="width: 150px;"></strong>,
<span class="editable-field" contenteditable="true" style="min-width: 100px; display: inline-block;">${ageInfo}</span>.
</p>
<p>
déclare que son état de santé nécessite un arret de travail de
<input type="text" value="1 (un)" style="width: 80px;"> Jour(s)
à daté du <span class="editable-field" contenteditable="true" style="min-width: 120px; display: inline-block;">${dateCertificat}</span> <br>
sauf complication.
</p>
<p>
<textarea placeholder=" " style="width: 450px;"></textarea>
</p>
<p style="text-align: right; margin-top: 30px;">
Dont certificat&nbsp&nbsp&nbsp&nbsp&nbsp<br>
<span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp;
</p>
</div>
<div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">
    <div style="display: flex; align-items: center; gap: 8px;">
        <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:</label>
        <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">
    </div>
    <button id="printButton">Imprimer le Certificat</button>
</div>
<script src="print.js"></script>
<script src="certificat-unified-font-size.js"></script>
<script>
    // Appliquer la taille de police sauvegardée et masquer les éléments non désirés à l'impression
    document.addEventListener('DOMContentLoaded', () => {
        const savedFontSize = localStorage.getItem('certificatFontSize') || '14';
        const styleElement = document.createElement('style');
        styleElement.textContent = "@media print { .print-button { display: none !important; } }";
        styleElement.id = 'certificatFontSizeStyle';
        document.head.appendChild(styleElement);
        
        // Add print functionality
        document.getElementById('printButton').addEventListener('click', function() {
            window.print();
        });
    });
</script>
</body>
</html>
    `;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        // Stocker la référence de la fenêtre pour le script de sauvegarde
        window.lastOpenedWindow = newWindow;

        // Définir manuellement window.opener pour permettre la communication
        try {
            Object.defineProperty(newWindow, 'opener', {
                value: window,
                writable: false,
                configurable: false
            });
        } catch (e) {
            // Si cela échoue, stocker la référence ailleurs
            newWindow._parentWindow = window;
        }

        newWindow.document.write(certificatHtml);
        newWindow.document.close();

        // Fonction pour effectuer la sauvegarde
        function effectuerSauvegarde(nombreJoursValue) {
            // Récupérer les données depuis les champs de la popup
            const docteurInput = newWindow.document.getElementById('docteur');
            const medecin = docteurInput ? docteurInput.value.trim() : '';

            // Récupérer le nom et prénom
            const nomPrenomInput = newWindow.document.querySelector('strong input[type="text"]');
            let nom = '', prenom = '';
            if (nomPrenomInput && nomPrenomInput.value) {
                const parts = nomPrenomInput.value.trim().split(' ');
                if (parts.length >= 2) {
                    nom = parts[0];
                    prenom = parts.slice(1).join(' ');
                }
            }

            // Vérifier les données
            if (!nom || !prenom) {
                afficherMessageDansPopup('Erreur: Nom et prénom du patient requis.', 'error');
                return;
            }

            if (!medecin) {
                afficherMessageDansPopup('Erreur: Nom du médecin requis.', 'error');
                return;
            }

            // Récupérer la date de naissance depuis le champ editable-field
            const editableFields = newWindow.document.querySelectorAll('.editable-field');
            let dateNaissance = '';
            for (let field of editableFields) {
                const text = field.textContent || field.innerText || '';
                const parentText = field.parentElement ? field.parentElement.textContent || '' : '';
                if (parentText.includes('né(e)') || parentText.includes('né') || parentText.includes('née')) {
                    dateNaissance = text.trim();
                    break;
                }
            }

            if (!dateNaissance && editableFields.length > 0) {
                dateNaissance = (editableFields[0].textContent || editableFields[0].innerText || '').trim();
            }

            // Date du certificat depuis l'editable-field
            let dateCertificat = '';
            for (let field of editableFields) {
                const text = field.textContent || field.innerText || '';
                const parentText = field.parentElement ? field.parentElement.textContent || '' : '';
                if (parentText.includes('daté du') || parentText.includes('daté')) {
                    dateCertificat = text.trim();
                    break;
                }
            }

            if (!dateCertificat) {
                const today = new Date();
                dateCertificat = today.toISOString().split('T')[0];
            }

            // Préparer le message
            const message = {
                action: "ajouter_arret_travail",
                nom: nom,
                prenom: prenom,
                medecin: medecin,
                nombre_jours: parseInt(nombreJoursValue),
                date_certificat: dateCertificat,
                date_naissance: dateNaissance || null
            };

            console.log('📤 Message à envoyer:', message);

            // Utiliser directement la fonction stockée dans la popup
            const sauvegarderFn = window.sauvegarderArretTravailDepuisPopup;

            if (sauvegarderFn && typeof sauvegarderFn === 'function') {
                sauvegarderFn(message).then(response => {
                    if (response && response.success) {  // Changé de response.ok à response.success
                        afficherMessageDansPopup('Arrêt de travail sauvegardé avec succès !', 'success');
                    } else {
                        const errorMsg = response ? response.error : 'Réponse invalide';
                        afficherMessageDansPopup('Erreur lors de la sauvegarde: ' + errorMsg, 'error');
                    }
                }).catch(error => {
                    console.error('❌ Erreur lors de la sauvegarde:', error);
                    afficherMessageDansPopup('Erreur lors de la sauvegarde: ' + error.message, 'error');
                });
            } else {
                setTimeout(() => {
                    const fn = window.sauvegarderArretTravailDepuisPopup;
                    if (fn && typeof fn === 'function') {
                        fn(message).then(response => {
                            if (response && response.success) {  // Changé de response.ok à response.success
                                afficherMessageDansPopup('Arrêt de travail sauvegardé avec succès !', 'success');
                            } else {
                                const errorMsg = response ? response.error : 'Réponse invalide';
                                afficherMessageDansPopup('Erreur lors de la sauvegarde: ' + errorMsg, 'error');
                            }
                        }).catch(error => {
                            console.error('❌ Erreur lors de la sauvegarde:', error);
                            afficherMessageDansPopup('Erreur lors de la sauvegarde: ' + error.message, 'error');
                        });
                    } else {
                        afficherMessageDansPopup('Erreur: Fonction de sauvegarde non disponible. Rechargez la page et réessayez.', 'error');
                    }
                }, 500);
            }
        }

        // Attacher l'événement d'impression directement après la fermeture du document
        newWindow.onload = function () {
            const printButton = newWindow.document.getElementById('printButton');
            if (printButton) {
                const newPrintButton = printButton.cloneNode(true);
                printButton.parentNode.replaceChild(newPrintButton, printButton);

                newPrintButton.addEventListener('click', function () {
                    const joursInputs = newWindow.document.querySelectorAll('input[type="text"]');
                    let nombreJours = '';
                    for (let input of joursInputs) {
                        const parentText = input.parentElement ? input.parentElement.textContent : '';
                        if (parentText.includes('Jour(s)') || parentText.includes('arret de travail')) {
                            nombreJours = input.value.trim();
                            break;
                        }
                    }

                    if (nombreJours) {
                        effectuerSauvegarde(nombreJours);
                    }

                    setTimeout(() => {
                        newWindow.print();
                    }, 500);
                });
            }
        };

        // Fonction pour afficher un message personnalisé dans la popup
        function afficherMessageDansPopup(message, type = 'info') {
            if (newWindow && !newWindow.closed) {
                newWindow.focus();
                newWindow.alert(message);
            }
        }

        // Ajouter le bouton de sauvegarde après que le document soit chargé
        function ajouterBoutonSauvegarde() {
            try {
                const printButton = newWindow.document.getElementById('printButton');
                const saveButton = newWindow.document.getElementById('sauvegarderArretPopup');

                if (printButton && !saveButton) {
                    console.log('✅ Ajout du bouton de sauvegarde dans la popup');

                    const boutonSauvegarde = newWindow.document.createElement('button');
                    boutonSauvegarde.id = 'sauvegarderArretPopup';
                    boutonSauvegarde.innerHTML = '💾 Sauvegarder Arrêt';
                    boutonSauvegarde.style.cssText = 'background-color: #28a745; color: white; border: none; padding: 10px 20px; margin-left: 15px; border-radius: 5px; cursor: pointer; font-size: 16px; transition: background-color 0.3s;';

                    boutonSauvegarde.addEventListener('mouseenter', function () {
                        this.style.backgroundColor = '#218838';
                    });
                    boutonSauvegarde.addEventListener('mouseleave', function () {
                        this.style.backgroundColor = '#28a745';
                    });

                    printButton.parentNode.appendChild(boutonSauvegarde);

                    boutonSauvegarde.addEventListener('click', function () {
                        console.log('💾 Clic sur le bouton de sauvegarde');

                        const joursInputs = newWindow.document.querySelectorAll('input[type="text"]');
                        let nombreJours = '';
                        for (let input of joursInputs) {
                            const parentText = input.parentElement ? input.parentElement.textContent : '';
                            if (parentText.includes('Jour(s)') || parentText.includes('arret de travail')) {
                                nombreJours = input.value.trim();
                                break;
                            }
                        }

                        if (!nombreJours) {
                            const promptDiv = newWindow.document.createElement('div');
                            promptDiv.id = 'promptNombreJours';
                            promptDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10001; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); min-width: 300px;';
                            promptDiv.innerHTML = '<div style="margin-bottom: 15px; font-weight: bold; font-size: 16px;">Nombre de jours d\'arrêt de travail</div><input type="number" id="inputNombreJours" value="1" min="1" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; margin-bottom: 15px;"><div style="display: flex; gap: 10px; justify-content: flex-end;"><button id="btnPromptOk" style="padding: 8px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">OK</button><button id="btnPromptCancel" style="padding: 8px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Annuler</button></div>';

                            const overlay = newWindow.document.createElement('div');
                            overlay.id = 'promptOverlay';
                            overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 10000;';

                            newWindow.document.body.appendChild(overlay);
                            newWindow.document.body.appendChild(promptDiv);

                            setTimeout(() => {
                                const input = newWindow.document.getElementById('inputNombreJours');
                                if (input) {
                                    input.focus();
                                    input.select();
                                }
                            }, 100);

                            const btnOk = newWindow.document.getElementById('btnPromptOk');
                            const btnCancel = newWindow.document.getElementById('btnPromptCancel');

                            const cleanup = () => {
                                if (promptDiv.parentNode) promptDiv.parentNode.removeChild(promptDiv);
                                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                            };

                            btnOk.addEventListener('click', () => {
                                const value = newWindow.document.getElementById('inputNombreJours').value;
                                cleanup();
                                if (value && !isNaN(value) && parseInt(value) > 0) {
                                    effectuerSauvegarde(value);
                                } else {
                                    afficherMessageDansPopup('Veuillez entrer un nombre de jours valide', 'warning');
                                }
                            });

                            btnCancel.addEventListener('click', () => {
                                cleanup();
                            });

                            const input = newWindow.document.getElementById('inputNombreJours');
                            input.addEventListener('keydown', (e) => {
                                if (e.key === 'Enter') {
                                    btnOk.click();
                                } else if (e.key === 'Escape') {
                                    btnCancel.click();
                                }
                            });
                        } else {
                            if (!nombreJours || isNaN(nombreJours) || parseInt(nombreJours) <= 0) {
                                afficherMessageDansPopup('Veuillez entrer un nombre de jours valide', 'warning');
                                return;
                            }
                            effectuerSauvegarde(nombreJours);
                        }
                    });

                    console.log('✅ Bouton de sauvegarde ajouté avec succès');
                } else if (!printButton) {
                    console.log('⏳ Bouton printButton pas encore disponible, réessai...');
                    setTimeout(ajouterBoutonSauvegarde, 100);
                } else if (saveButton) {
                    console.log('ℹ️ Bouton de sauvegarde déjà présent');
                }
            } catch (e) {
                console.error('❌ Erreur lors de l\'ajout du bouton:', e);
            }
        }

        // Créer une fonction de sauvegarde dans la fenêtre parent
        const sauvegarderFn = async function (message) {
            console.log('🔗 Sauvegarde depuis popup, message:', message);

            try {
                // Appeler l'API locale Python
                const response = await fetch('http://localhost:5000/api/ajouter_arret_travail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(message)
                });

                const result = await response.json();

                if (result.success) {
                    console.log('✅ Arrêt de travail sauvegardé avec succès:', result.message);

                    // Afficher un message de succès discret
                    const successDiv = document.createElement('div');
                    successDiv.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: #4CAF50;
                        color: white;
                        padding: 12px 20px;
                        border-radius: 6px;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                        z-index: 10000;
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                    `;
                    successDiv.textContent = result.message;
                    document.body.appendChild(successDiv);

                    // Supprimer le message après 3 secondes
                    setTimeout(() => {
                        if (successDiv.parentNode) {
                            successDiv.parentNode.removeChild(successDiv);
                        }
                    }, 3000);

                    return { success: true, message: result.message };
                } else {
                    console.error('❌ Erreur lors de la sauvegarde:', result.error);
                    return { success: false, error: result.error };
                }

            } catch (error) {
                console.error('❌ Erreur réseau:', error);
                return { success: false, error: 'Erreur de connexion à l\'API locale. Vérifiez que le serveur Python est démarré.' };
            }
        };

        // Stocker la fonction de sauvegarde
        window.sauvegarderArretTravailDepuisPopup = sauvegarderFn;

        // Ajouter le bouton de sauvegarde après un léger délai
        setTimeout(ajouterBoutonSauvegarde, 200);
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

function setupFormatButtons() {
    const formatAvecEnteteBtn = document.getElementById("formatAvecEntete");
    const formatSansEnteteBtn = document.getElementById("formatSansEntete");

    if (formatAvecEnteteBtn) {
        formatAvecEnteteBtn.addEventListener("click", function () {
            localStorage.setItem('certificatFormat', 'avecEntete');
            this.classList.add('selected-format');
            if (formatSansEnteteBtn) {
                formatSansEnteteBtn.classList.remove('selected-format');
            }
        });
    }

    if (formatSansEnteteBtn) {
        formatSansEnteteBtn.addEventListener("click", function () {
            localStorage.setItem('certificatFormat', 'sansEntete');
            this.classList.add('selected-format');
            if (formatAvecEnteteBtn) {
                formatAvecEnteteBtn.classList.remove('selected-format');
            }
        });
    }
}

// Configurer les gestionnaires d'événements lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', function () {
    loadData();
    setupFormatButtons();

    // Initialiser le format au chargement
    const format = localStorage.getItem('certificatFormat');
    const formatAvecEnteteBtn = document.getElementById('formatAvecEntete');
    const formatSansEnteteBtn = document.getElementById('formatSansEntete');

    if (format === 'sansEntete' && formatSansEnteteBtn) {
        formatSansEnteteBtn.classList.add('selected-format');
    } else if (formatAvecEnteteBtn) {
        // Par défaut, on utilise avec en-tete
        formatAvecEnteteBtn.classList.add('selected-format');
    }

    // Écouteurs pour les boutons
    const saveBtn = document.getElementById("SavePolycliniqueDocteur");
    if (saveBtn) {
        saveBtn.addEventListener("click", saveData);
    }

    const certificatBtn = document.getElementById("genererCertificat");
    if (certificatBtn) {
        certificatBtn.addEventListener("click", genererCertificat);
    }

    const inaptSportBtn = document.getElementById("inaptSport");
    if (inaptSportBtn) {
        inaptSportBtn.addEventListener("click", inaptitudeSport);
    }

    const arretBtn = document.getElementById("genererArret");
    if (arretBtn) {
        arretBtn.addEventListener("click", genererArretTravail);
    }

    const radioxBtn = document.getElementById("genererRadiox");
    if (radioxBtn) {
        radioxBtn.addEventListener("click", genererRadiox);
    }

    // Écouteur pour le champ date de naissance - calcul automatique de l'âge
    const dateNaissanceInput = document.getElementById('patientDateNaissance');
    if (dateNaissanceInput) {
        dateNaissanceInput.addEventListener('change', function () {
            const dateNaissance = this.value;
            if (dateNaissance) {
                const ageCalcule = calculerAge(dateNaissance);
                const ageInput = document.getElementById('patientAge');
                if (ageInput) {
                    ageInput.value = ageCalcule;
                }
            }
        });
    }

    // Écouteur pour le champ âge - effacer la date de naissance si l'âge est modifié manuellement
    const ageInput = document.getElementById('patientAge');
    if (ageInput) {
        ageInput.addEventListener('input', function () {
            // Si l'utilisateur commence à taper dans le champ âge, on ne force plus le calcul automatique
            // Mais on ne vide la date de naissance que si l'âge est significativement différent
            // Pour permettre les deux modes de saisie
        });
    }
});

// bilan Leishmaniose
function ouvrirCertificatLeishmaniose() {
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientDateNaissance = document.getElementById('patientDateNaissance').value;

    // Extraire nom et prénom
    const nomPrenomArray = patientNomPrenom.split(' ');
    const nom = nomPrenomArray[nomPrenomArray.length - 1] || '';
    const prenom = nomPrenomArray.slice(0, -1).join(' ') || '';

    const patientInfo = {
        nom: nom,
        prenom: prenom,
        dob: patientDateNaissance
    };

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    const certificatContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Etude microscopique de leishmaniae</title>
<style>
body {
font-family: Arial, sans-serif;
padding: 20px;
background-color: #f9f9f9;
}
.certificat {
background-color: white;
border: 1px solid #ddd;
padding: 20px;
max-width: 600px;
margin: 0 auto;
margin-top: 60px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h1 {
text-align: center;
color: #333;
text-decoration: underline;
font-size: 20px;
}
p {
line-height: 1.5;
color: #555;
}
.editable-field {
border-bottom: 1px dashed #666;
display: inline-block;
min-width: 50px;
min-height: 20px;
padding: 2px 4px;
margin: 0 3px;
}
.editable-area {
border: 1px solid #ddd;
border-radius: 4px;
padding: 8px;
margin: 5px 0;
width: 100%;
min-height: 20px;
resize: vertical;
overflow: hidden;
font-family: inherit;
font-size: inherit;
line-height: inherit;
}
.editable-area:focus {
outline: none;
border-color: #007bff;
}
#head {
margin-bottom: 20px;
}
#head table {
width: 100%;
border: 0px solid #000000;
padding: 4px;
margin-bottom: 15px;
}
#head td {
text-align: center;
}
.print-button {
text-align: center;
margin-top: 20px;
}
.print-button button {
padding: 10px 20px;
font-size: 16px;
background-color: #007bff;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
}
.print-button button:hover {
background-color: #0056b3;
}
@media print {
@page {
size: A5;
margin: 0.2cm 0.2cm 0.2cm 0.2cm;
}
body {
margin: 0 !important;
padding: 0 !important;
font-size: 10pt !important;
background-color: white;
}
.certificat {
padding: 2px 8px !important;
max-width: 100% !important;
border: none;
box-shadow: none;
margin-top: 0;
}
h1 {
font-size: 14pt !important;
margin: 5px 0 !important;
margin-top: 2cm !important;
}
p {
font-size: 9pt !important;
margin: 2px 0 !important;
line-height: 1.2 !important;
}
input[type="text"],
input[type="date"],
textarea {
border: none !important;
background: none !important;
box-shadow: none !important;
outline: none !important;
font-size: 9pt !important;
}
input[type="text"]:focus,
input[type="date"]:focus,
textarea:focus {
border: none !important;
outline: none !important;
}
/* Rendre le placeholder transparent lors de l'impression */
input::placeholder,
textarea::placeholder {
color: transparent;
}
.print-button {
display: none;
}
.editable-field, .editable-area {
border: none !important;
}
.docteur {
font-weight: bold;
font-size: 14pt !important;
margin-right: 50px;
}
}
</style>
</head>
<body>
${enteteContent}
<div class="certificat">
<h1>Cher confrère.</h1>
<div class="contenu-certificat" style="margin-top: 1.5cm !important;">
<p>
<br>
Permettez-moi de vous adresser le(a) nommé(e) <br>
<strong><input type="text" value="${nom} ${prenom}" style="width: 400px;"></strong>, <br>
Pour étude microscopique à  la recherche du corps de leishmanies sur les lésions :<br>
<textarea placeholder="Description des lésions" style="width: 100%;"></textarea>
</p>
<p style="text-align: right;">
Confraternellement,<br>
<span class="docteur">Dr ${docteur}</span>&nbsp;
</p>
</div>
</div>
<div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">
    <div style="display: flex; align-items: center; gap: 8px;">
        <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:</label>
        <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">
    </div>
    <button id="printButton">Imprimer la lettre </button>
</div>
<script src="print.js"></script>
    <script src="certificat-unified-font-size.js"></script>

</body>
</html>
`;
    const newWindow = window.open("", "_blank");
    newWindow.document.write(certificatContent);
    newWindow.document.close();
}

// Fonction pour générer un certificat de bonne santé
function genererBonSante() {
    // Get patient information from the form fields
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '[Nom du patient]';
    const patientAge = document.getElementById('patientAge').value;
    const patientDateNaissance = document.getElementById('patientDateNaissance').value;
    const dateCertificat = document.getElementById('dateCertificat').value || new Date().toISOString().split('T')[0];

    // Construire la partie de l'âge/date de naissance
    let ageInfo = '';
    if (patientAge) {
        ageInfo = 'âgé(e) de ' + patientAge;
    } else if (patientDateNaissance) {
        ageInfo = 'né(e) le ' + patientDateNaissance;
    } else {
        ageInfo = 'né(e) le [Date de naissance]';
    }

    // Format the date for display
    const formattedDate = new Date(dateCertificat).toLocaleDateString('fr-FR');

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const docteur = localStorage.getItem('docteur') || "";

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    const certificatContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificat de Bonne Santé</title>
    <style>
body {
font-family: Arial, sans-serif;
padding: 20px;
background-color: #f9f9f9;
}
.certificat {
background-color: white;
border: 1px solid #ddd;
padding: 20px;
max-width: 600px;
margin: 0 auto;
margin-top: 60px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h1 {
text-align: center;
color: #333;
text-decoration: underline;
font-size: 20px;
}
p {
line-height: 1.5;
color: #555;
}
.editable-field {
border-bottom: 1px dashed #666;
display: inline-block;
min-width: 50px;
min-height: 20px;
padding: 2px 4px;
margin: 0 3px;
}
.editable-area {
border: 1px solid #ddd;
border-radius: 4px;
padding: 8px;
margin: 5px 0;
width: 100%;
min-height: 20px;
resize: vertical;
overflow: hidden;
font-family: inherit;
font-size: inherit;
line-height: inherit;
}
.editable-area:focus {
outline: none;
border-color: #007bff;
}
#head {
margin-bottom: 20px;
}
#head table {
width: 100%;
border: 0px solid #000000;
padding: 4px;
margin-bottom: 15px;
}
#head td {
text-align: center;
}
.print-button {
text-align: center;
margin-top: 20px;
}
.print-button button {
padding: 10px 20px;
font-size: 16px;
background-color: #007bff;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
}
.print-button button:hover {
background-color: #0056b3;
}
@media print {
@page {
    size: A5;
    margin: 0.2cm 0.2cm 0.2cm 0.2cm;
}

body {
    margin: 0 !important;
    padding: 0 !important;
    font-size: 10pt !important;
    line-height: 1.2 !important;
    background-color: white;
}

.certificat {
    border: none;
    box-shadow: none;
    margin: 0 !important;
    padding: 2px 8px !important;
    max-width: 100% !important;
}

h1 {
    font-size: 14pt !important;
    margin: 5px 0 !important;
    margin-top: 2cm !important;
}

input[type="text"],
input[type="date"],
textarea {
    border: none !important;
    background: none !important;
    box-shadow: none !important;
    outline: none !important;
    font-size: 9pt !important;
}

input[type="text"]:focus,
input[type="date"]:focus,
textarea:focus {
    border: none !important;
    outline: none !important;
}

/* Styles existants */
.print-button {
    display: none;
}
.editable-field, .editable-area {
    border: none !important;
}

/* Additional space optimization */
* {
    margin-top: 0 !important;
    margin-bottom: 2px !important;
}

p {
    margin: 2px 0 !important;
    font-size: 9pt !important;
}
}
</style>
</head>
<body>
${enteteContent}
    <div class="certificat">
        <h1>CERTIFICAT DE BONNE SANTÉ</h1>
        <div class="contenu-certificat" style="margin-top: 1.5cm !important;">
        <p>
            Je soussigné, Dr <input type="text" id="docteur" value="${docteur}" placeholder="" style="width: 120px;">, 
            certifie avoir examiné ce jour le(la) susnommé(e) 
            <strong><input type="text" value="${patientNomPrenom}" style="width: 180px;"></strong>,
            <span class="editable-field" contenteditable="true" style="min-width: 100px; display: inline-block;">${ageInfo}</span>.
        </p>
        <p>
            Déclare que son état de santé est bon et qu'il/elle est apte à exercer ses activités normales.
        </p>
        <p>
            Ce certificat est délivré à la demande de l'intéressé(e) et remis en main propre pour servir et valoir ce que de droit.
        </p>
        <p style="text-align: right; margin-top: 30px;">
            Fait à <strong>${polyclinique || '[Lieu]'}</strong>, le <strong>${formattedDate}</strong><br><br>
            Dont certificat<br>
            <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </p>
    </div>
    <div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">
        <div style="display: flex; align-items: center; gap: 8px;">
            <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:</label>
            <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">
        </div>
        <button id="printButton">Imprimer le Certificat</button>
    </div>
    <script>
    // Fonction pour imprimer le certificat
    document.getElementById('printButton').addEventListener('click', function() {
        window.print();
    });
    </script>
</body>
</html>
`;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(certificatContent);
    newWindow.document.close();
}

// Fonction pour générer une requisition
function genererRequisition() {
    console.log("Fonction genererRequisition appelée");

    // Récupérer les informations du patient
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value || '';
    const patientDateNaissance = document.getElementById('patientDateNaissance').value || '';

    // Créer les informations du patient
    const patientInfo = {
        nom: patientNomPrenom.split(' ')[0] || '',
        prenom: patientNomPrenom.split(' ').slice(1).join(' ') || '',
        age: patientAge,
        dateNaissance: patientDateNaissance,
        numero: Math.random().toString(36).substr(2, 9) // Générer un numéro aléatoire
    };

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
    <div class="modal-content">
        <h3>Requisition Médicale</h3>
        <div class="info barcode" style="height: 80px;">
            <svg id="barcode" data-numero="${patientInfo.numero || ''}" style="height: 100%;"></svg>
        </div>
        <div class="button-group">
            <button class="modal-button" id="requisitionApte">Apte pour garde à  vue</button>
            <button class="modal-button" id="requisitionInapte">Inapte pour garde à  vue</button>
        </div>
    </div>
    `;

    document.body.appendChild(modal);

    // Ecouteur pour le bouton requisitionApte
    document.querySelector('#requisitionApte').addEventListener('click', () => {
        requisitionApte(); 
    });

    // Ecouteur pour le bouton requisitionInapte
    document.querySelector('#requisitionInapte').addEventListener('click', () => {
        requisitionInapte(); 
    });

    // Ajouter un écouteur de clic pour fermer la modale
    modal.addEventListener('click', function (event) {
        // Si l'utilisateur clique en dehors du contenu de la modale
        if (event.target === modal) {
            modal.remove();
            // Rafraîchir la page
            window.location.reload();
        }
    });

    // Ajouter le style pour la popup
    const style = document.createElement('style');
    style.textContent = `
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        text-align: center;
    }
    .button-group {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 20px;
    }
    .modal-button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
    }
    .modal-button:first-child {
        background-color: #4CAF50;
        color: white;
        z-index: 1000;
    }
    .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        max-width: 400px;
        width: 90%;
        text-align: center;
    }
    .button-group {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }
    .button-group button {
        flex: 1;
        padding: 12px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s;
    }
    .button-group button:hover {
        background-color: #f0f0f0;
    }
    `;
    document.head.appendChild(style);
}

// Fonctions pour la requisition
function requisitionApte() {
    console.log('Fonction requisitionApte appelée');
    // Fermer la modale si elle existe
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Get patient information from the new fields
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value;
    const patientDateNaissance = document.getElementById('patientDateNaissance').value;
    const dateCertificat = document.getElementById('dateCertificat').value || new Date().toISOString().split('T')[0];

    // Construire la partie de l'âge/date de naissance
    let ageInfo = '';
    let dob = '';
    if (patientAge) {
        ageInfo = patientAge;
        dob = patientAge; // Utiliser l'âge si pas de date de naissance
    } else if (patientDateNaissance) {
        ageInfo = patientDateNaissance;
        dob = patientDateNaissance;
    } else {
        ageInfo = '[Date de naissance]';
        dob = '[Date de naissance]';
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';
    let enteteContent = avecEntete ? generateHeader() : '<div style="height: 155px;"></div>';

    const certificatContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Requisition Apte</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background-color: #f9f9f9;
    }
    .certificat {
      background-color: white;
      border: 1px solid #ddd;
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
      margin-top: 60px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      text-align: center;
      color: #333;
      text-decoration: underline;
      font-size: 20px;
    }
    p {
      line-height: 1.5;
      color: #555;
    }
    input[readonly] {
      border: none;
      background: transparent;
	  
    }
    textarea.auto-expand {
      overflow: hidden;
       border: none;
   
      transition: height 0.2s ease;
      min-height: 20px;
      width: 100%;
      font-family: inherit;
      font-size: 14px;
    }
    .print-button {
      text-align: center;
      margin-top: 20px;
    }
    .print-button button {
      padding: 10px 20px;
      font-size: 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .print-button button:hover {
      background-color: #0056b3;
    }
    @media print {
      @page {
        size: A5;
        margin: 0.2cm 0.2cm 0.2cm 0.2cm;
      }
      body {
        margin: 0 !important;
        padding: 0 !important;
        font-size: 10pt !important;
        background-color: white;
      }
      .certificat {
        padding: 2px 8px !important;
        max-width: 100% !important;
        border: none;
        box-shadow: none;
        margin-top: 0;
      }
      h1 {
        font-size: 14pt !important;
        margin: 2cm 0 5px 0 !important;
      }
      p {
        font-size: 9pt !important;
        margin: 2px 0 !important;
        line-height: 1.2 !important;
      }
      input[type="text"],
      input[type="date"],
      textarea {
        border: none !important;
        background: none !important;
        box-shadow: none !important;
        outline: none !important;
        font-size: 9pt !important;
      }
      input[type="text"]:focus,
      input[type="date"]:focus,
      textarea:focus {
        border: none !important;
        outline: none !important;
      }
      ::placeholder {
        color: transparent !important;
      }
      .print-button {
        display: none;
      }
      .docteur {
        font-weight: bold;
        font-size: 14pt !important;
        margin-right: 50px;
      }
      /* Additional space optimization */
      * {
        margin-top: 0 !important;
        margin-bottom: 2px !important;
      }
    }
  </style>
</head>
<body>
  ${enteteContent}
  <div class="certificat">
    <h1>CERTIFICAT MEDICAL</h1>
    <div class="contenu-certificat" style="margin-top: 1.5cm !important;">
    <p>
      Je soussigné(e), Dr 
      <input type="text" value="${docteur}" style="width: 120px; padding: 4px; border: 1px solid #ddd; border-radius: 4px; margin: 0 5px;">, 
      certifie avoir examiné ce jour le nomee 
      <strong><input type="text" value="${patientNomPrenom}" placeholder="Nom et prénom" style="width: 180px; padding: 4px; border: 1px solid #ddd; border-radius: 4px; margin: 0 5px;"></strong>
      <input type="text" value="né(e) le" placeholder="Statut" style="width: 70px; padding: 4px; border: 1px solid #ddd; border-radius: 4px; margin: 0 5px; color: #555;"> 
      <strong><input type="text" value="${dob}" placeholder="Date de naissance" style="width: 100px; padding: 4px; border: 1px solid #ddd; border-radius: 4px; margin: 0 5px;"></strong>, 
      suite à  la réquisition numéro 
      <input type="text" placeholder="Numéro de réquisition" style="width: 240px;">
    </p>
    <p>
      Après un examen médical :<br>
      <textarea class="auto-expand" placeholder=" "></textarea><br>
      Je déclare que le sus nommé est compatible avec les conditions de garde à  vue. Le présent certificat est remis à  l'autorité pour servir et valoir ce que de droit.
    </p>
    <p style="text-align: right; margin-top: 30px;">
      Dont certificat<br>
      <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>
    </p>
  </div>
 
  <div class="print-button">
  <div style="display: flex; align-items: center; gap: 8px;">
            <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:</label>
            <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">
        
<button id="printButton">Imprimer le Certificat</button>

</div>
 <script src="certificat-unified-font-size.js"></script>
<script src="print.js"></script>
</body>
</html>
`;

    const newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
        newWindow.onload = function () {
            const modal = document.querySelector('div[style*="position: fixed;"]');
            if (modal) document.body.removeChild(modal);

            const printButton = newWindow.document.getElementById('printButton');
            if (printButton) {
                printButton.addEventListener('click', function () {
                    newWindow.print();
                });
            }
        };
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
    window.location.reload();
}

function requisitionInapte() {
    console.log('Fonction requisitionInapte appelée');
    // Fermer la modale si elle existe
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Get patient information from the new fields
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value;
    const patientDateNaissance = document.getElementById('patientDateNaissance').value;
    const dateCertificat = document.getElementById('dateCertificat').value || new Date().toISOString().split('T')[0];

    // Construire la partie de l'âge/date de naissance
    let ageInfo = '';
    let dob = '';
    if (patientAge) {
        ageInfo = patientAge;
        dob = patientAge; // Utiliser l'âge si pas de date de naissance
    } else if (patientDateNaissance) {
        ageInfo = patientDateNaissance;
        dob = patientDateNaissance;
    } else {
        ageInfo = '[Date de naissance]';
        dob = '[Date de naissance]';
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';
    let enteteContent = avecEntete ? generateHeader() : '<div style="height: 155px;"></div>';

    const certificatContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Requisition Inapte</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background-color: #f9f9f9;
    }
    .certificat {
      background-color: white;
      border: 1px solid #ddd;
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
      margin-top: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      text-align: center;
      color: #333;
      text-decoration: underline;
      font-size: 20px;
    }
    p {
      line-height: 1.4;
      color: #555;
    }
    input[readonly] {
      border: none;
      background: transparent;
	  
    }
    textarea.auto-expand {
      overflow: hidden;
       border: none;
   
      transition: height 0.2s ease;
      min-height: 5px;
      width: 100%;
      font-family: inherit;
      font-size: 14px;
    }
    .print-button {
      text-align: center;
      margin-top: 20px;
    }
    .print-button button {
      padding: 10px 20px;
      font-size: 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .print-button button:hover {
      background-color: #0056b3;
    }
    @media print {
      @page {
        size: A5;
        margin: 0.2cm 0.2cm 0.2cm 0.2cm;
      }
      body {
        margin: 0 !important;
        padding: 0 !important;
        font-size: 10pt !important;
        background-color: white;
      }
      .certificat {
        padding: 2px 8px !important;
        max-width: 100% !important;
        border: none;
        box-shadow: none;
        margin-top: 0;
      }
      h1 {
        font-size: 14pt !important;
        margin: 5px 0 !important;
        margin-top: 2cm !important;
      }
      p {
        font-size: 9pt !important;
        margin: 2px 0 !important;
        line-height: 1.2 !important;
      }
      input[type="text"],
      input[type="date"],
      textarea {
        border: none !important;
        background: none !important;
        box-shadow: none !important;
        outline: none !important;
        font-size: 9pt !important;
      }
      input[type="text"]:focus,
      input[type="date"]:focus,
      textarea:focus {
        border: none !important;
        outline: none !important;
      }
      ::placeholder {
        color: transparent !important;
      }
      .print-button {
        display: none;
      }
      .docteur {
        font-weight: bold;
        font-size: 14pt !important;
        margin-right: 50px;
      }
      /* Additional space optimization */
      * {
        margin-top: 0 !important;
        margin-bottom: 2px !important;
      }
    }
  </style>
</head>
<body>
  ${enteteContent}
  <div class="certificat">
    <h1>Certificat medical d'inaptitude au garde-à-vue</h1>
    <div class="contenu-certificat" style="margin-top: 1.5cm !important;">
    <p>
      Je soussigné(e), Dr 
      <input type="text" value="${docteur}" style="width: 120px; padding: 4px; border: 1px solid #ddd; border-radius: 4px; margin: 0 5px;">, 
      certifie avoir examiné ce jour le nomee 
      <strong><input type="text" value="${patientNomPrenom}" placeholder="Nom et prénom" style="width: 180px; padding: 4px; border: 1px solid #ddd; border-radius: 4px; margin: 0 5px;"></strong>
      <input type="text" value="né(e) le" placeholder="Statut" style="width: 70px; padding: 4px; border: 1px solid #ddd; border-radius: 4px; margin: 0 5px; color: #555;"> 
      <strong><input type="text" value="${dob}" placeholder="Date de naissance" style="width: 100px; padding: 4px; border: 1px solid #ddd; border-radius: 4px; margin: 0 5px;"></strong>, 
      suite à  la réquisition numéro 
      <input type="text" placeholder="Numéro de réquisition" style="width: 240px;"><br>
    
              Après un examen clinique :<br>

Je déclare que le(a) susnommé(e) présente des contre-indications à  la garde à  vue pour les raisons suivantes :<br>

<textarea style="width: 100%;  margin-top: 10px;" placeholder="Décrire brièvement les contre-indications"></textarea><br>

En conséquence, je recommande qu'il/elle ne soit pas soumis(e) à  la garde à  vue.<br>

Le présent certificat est remis à  l'autorité compétente pour servir et valoir ce que de droit.


    </p>
    <p style="text-align: right; margin-top: 30px;">
      Dont certificat<br>
      <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>
    </p>
  </div>
 
  <div class="print-button">
  <div style="display: flex; align-items: center; gap: 8px;">
            <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:</label>
            <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">
        
<button id="printButton">Imprimer le Certificat</button>

</div>
 <script src="certificat-unified-font-size.js"></script>
<script src="print.js"></script>
</body>
</html>
`;

    const newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
        newWindow.onload = function () {
            const modal = document.querySelector('div[style*="position: fixed;"]');
            if (modal) document.body.removeChild(modal);

            const printButton = newWindow.document.getElementById('printButton');
            if (printButton) {
                printButton.addEventListener('click', function () {
                    newWindow.print();
                });
            }
        };
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
    window.location.reload();
}


//cat Leishmaniose inf a 03 lesions

function ouvrirCertificatLeishmanioseDetail() {
    const nom = document.getElementById('patientNomPrenom').value || '';
    const dob = document.getElementById('patientDateNaissance').value;


    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";


    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    const certificatContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cat de Leishmaniose</title>
<style>
body {
font-family: Arial, sans-serif;
padding: 20px;
background-color: #f9f9f9;
}
.certificat {
background-color: white;
border: 1px solid #ddd;
padding: 20px;
max-width: 600px;
margin: 0 auto;
margin-top: 60px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h1 {
text-align: center;
color: #333;
text-decoration: underline;
font-size: 20px;
}
p {
line-height: 1.5;
color: #555;
}
.editable-field {
border-bottom: 1px dashed #666;
display: inline-block;
min-width: 50px;
min-height: 20px;
padding: 2px 4px;
margin: 0 3px;
}
.editable-area {
border: 1px solid #ddd;
border-radius: 4px;
padding: 8px;
margin: 5px 0;
width: 100%;
min-height: 20px;
resize: vertical;
overflow: hidden;
font-family: inherit;
font-size: inherit;
line-height: inherit;
}
.editable-area:focus {
outline: none;
border-color: #007bff;
}
#head {
margin-bottom: 20px;
}
#head table {
width: 100%;
border: 0px solid #000000;
padding: 4px;
margin-bottom: 15px;
}
#head td {
text-align: center;
}
.print-button {
text-align: center;
margin-top: 20px;
}
.print-button button {
padding: 10px 20px;
font-size: 16px;
background-color: #007bff;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
}
.print-button button:hover {
background-color: #0056b3;
}
@media print {
@page {
size: A5;
margin: 0.2cm 0.2cm 0.2cm 0.2cm;
}
body {
margin: 0 !important;
padding: 0 !important;
font-size: 10pt !important;
background-color: white;
}
.certificat {
padding: 2px 8px !important;
max-width: 100% !important;
border: none;
box-shadow: none;
margin-top: 0;
}
h1 {
font-size: 14pt !important;
margin: 5px 0 !important;
}
p {
font-size: 9pt !important;
margin: 2px 0 !important;
line-height: 1.2 !important;
}
input[type="text"],
input[type="date"],
textarea {
border: none !important;
background: none !important;
box-shadow: none !important;
outline: none !important;
font-size: 9pt !important;
}
input[type="text"]:focus,
input[type="date"]:focus,
textarea:focus {
border: none !important;
outline: none !important;
}
.print-button {
display: none;
}
.editable-field, .editable-area {
border: none !important;
}
.docteur {
font-weight: bold;
font-size: 14pt !important;
margin-right: 50px;
}
}
</style>
</head>
<body>
${enteteContent}
<div class="certificat">
<h1>Prière de faire</h1>
<div class="contenu-certificat" style="margin-top: 1.5cm !important;">
<p>
Infiltrations locales pour le(a) nommé(e) <br><strong><input type="text" value="${nom}" style="width: 200px;"></strong>  de <input type="text" value="02" size="2" />cc du Glucantime<br>
(pour chaque lésion)<br>
<input type="text" value="02" size="1" /> fois par semaine à  01 cm de bords de(s) lésion(s)<br>
pendant <input type="text" value="04" size="2" /> semaines<br>
</p>
<p>
(selon l'instruction N06 du 16 oct 2011 relative à  la catégorie de leishmaniose cutanée)
</p>
<p style="text-align: right;">
Signature de médecin,<br>
<span class="docteur">Dr ${docteur}</span>&nbsp;
</p>
</div>
</div>
<div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">
    <div class="print-controls" style="display: flex; align-items: center; gap: 8px;">
        <label for="fontSize1" style="font-size: 14px; margin: 0;">Taille du texte:</label>
        <input type="number" id="fontSize1" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">
    </div>
    <button id="printButton">Imprimere la conduite </button>
</div>
<script src="print.js"></script>
<link rel="stylesheet" href="print-styles.css">
<script src="certificat-unified-font-size.js"></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
    // Charger la taille de police sauvegardée
    const savedLesionsFontSize = localStorage.getItem('lesionsFontSize') || '14';
    const fontSize1Input = document.getElementById('fontSize1');

    if (fontSize1Input) {
        fontSize1Input.value = savedLesionsFontSize;
        fontSize1Input.addEventListener('input', () => {
            const fontSize = fontSize1Input.value;
            updateFontSizeForLesions(fontSize);
        });
    }

    // Appliquer la taille de police initiale
    updateFontSizeForLesions(savedLesionsFontSize);
});
</script>
</body>
</html>
`;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(certificatContent);
    newWindow.document.close();
}

//cat Leishmaniose plus3

function catLeishmanioseplus3() {
    const nom = document.getElementById('patientNomPrenom').value || '';
    const dob = document.getElementById('patientDateNaissance').value;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";


    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }



    const certificatContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cat de Leishmaniose</title>
<style>
body {
font-family: Arial, sans-serif;
padding: 20px;
background-color: #f9f9f9;
}
.certificat {
background-color: white;
border: 1px solid #ddd;
padding: 20px;
max-width: 600px;
margin: 0 auto;
margin-top: 60px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h1 {
text-align: center;
color: #333;
text-decoration: underline;
font-size: 20px;
}
p {
line-height: 1.5;
color: #555;
}
.editable-field {
border-bottom: 1px dashed #666;
display: inline-block;
min-width: 50px;
min-height: 20px;
padding: 2px 4px;
margin: 0 3px;
}
.editable-area {
border: 1px solid #ddd;
border-radius: 4px;
padding: 8px;
margin: 5px 0;
width: 100%;
min-height: 20px;
resize: vertical;
overflow: hidden;
font-family: inherit;
font-size: inherit;
line-height: inherit;
}
.editable-area:focus {
outline: none;
border-color: #007bff;
}
#head {
margin-bottom: 20px;
}
#head table {
width: 100%;
border: 0px solid #000000;
padding: 4px;
margin-bottom: 15px;
}
#head td {
text-align: center;
}
.print-button {
text-align: center;
margin-top: 20px;
}
.print-button button {
padding: 10px 20px;
font-size: 16px;
background-color: #007bff;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
}
.print-button button:hover {
background-color: #0056b3;
}
@media print {
@page {
size: A5;
margin: 0.2cm 0.2cm 0.2cm 0.2cm;
}
body {
margin: 0 !important;
padding: 0 !important;
font-size: 10pt !important;
background-color: white;
}
.certificat {
padding: 2px 8px !important;
max-width: 100% !important;
border: none;
box-shadow: none;
margin-top: 0;
}
h1 {
font-size: 14pt !important;
margin: 5px 0 !important;
}
p {
font-size: 9pt !important;
margin: 2px 0 !important;
line-height: 1.2 !important;
}
input[type="text"],
input[type="date"],
textarea {
border: none !important;
background: none !important;
box-shadow: none !important;
outline: none !important;
font-size: 9pt !important;
}
input[type="text"]:focus,
input[type="date"]:focus,
textarea:focus {
border: none !important;
outline: none !important;
}
.print-button {
display: none;
}
.editable-field, .editable-area {
border: none !important;
}
.docteur {
font-weight: bold;
font-size: 14pt !important;
margin-right: 50px;
}
}
</style>
</head>
<body>
${enteteContent}
<div class="certificat" style="font-family: Arial, sans-serif; line-height: 1.6;">
<h1 style="text-align: center; color: #2c3e50;">Cher confrère</h1>
<div class="contenu-certificat" style="margin-top: 1.5cm !important;">
<p style="margin: 15px 0;">
Permettez moi de vous adresser le(a) nommé(e) <strong><input type="text" value="${nom}" style="width: 200px;"></strong>  <br>
qui consulte chez nous pour leishmaniose cutanée et qui présente<br>
<input type="text" value="plus de 03 lésions cutanées"
style="width: 100%; padding: 8px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px;" /><br>
(et selon l'instruction de leishmaniose N06 du 16 oct 2011)<br>
relative à  la catégorie de leishmaniose cutanée.<br><br>

Il(Elle) nécessite la voie IM selon ses fonctions vitales qui nécessitent<br>
l'avis et PEC spécialisée (et meme parfois l'hospitalisation).<br>
Je vous le(la) confie pour une prise en charge adéquate.
</p>
<p style="text-align: right; margin-top: 30px;">
Avec nos remerciements pour votre collaboration,<br>
<span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp;
</p>
</div>
<div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">
    <div class="print-controls" style="display: flex; align-items: center; gap: 8px;">
        <label for="fontSize2" style="font-size: 14px; margin: 0;">Taille du texte:</label>
        <input type="number" id="fontSize2" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">
    </div>
    <button id="printButton">Imprimer la lettre </button>
</div>
<script src="print.js"></script>
<link rel="stylesheet" href="print-styles.css">
<script src="certificat-unified-font-size.js"></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
    // Charger la taille de police sauvegardée
    const savedLesionsFontSize = localStorage.getItem('lesionsFontSize') || '14';
    const fontSize2Input = document.getElementById('fontSize2');

    if (fontSize2Input) {
        fontSize2Input.value = savedLesionsFontSize;
        fontSize2Input.addEventListener('input', () => {
            const fontSize = fontSize2Input.value;
            updateFontSizeForLesions(fontSize);
        });
    }

    // Appliquer la taille de police initiale
    updateFontSizeForLesions(savedLesionsFontSize);
});
</script>
</body>
</html>
`;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(certificatContent);
    newWindow.document.close();
}
function ouvrirCertificatMalVision() {
    // Récupérer les informations du patient depuis les champs du formulaire
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value || '';
    const patientDateNaissance = document.getElementById('patientDateNaissance').value || '';

    // Diviser le nom et prénom
    let nom = '';
    let prenom = '';
    if (patientNomPrenom) {
        const parts = patientNomPrenom.split(' ');
        nom = parts[0] || '';
        prenom = parts.slice(1).join(' ') || '';
    }

    // Utiliser la date de naissance si disponible
    const dob = patientDateNaissance || '';

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    const certificatContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificat de Mauvaise Vision</title>
    <style>
body {
font-family: Arial, sans-serif;
padding: 20px;
background-color: #f9f9f9;
}
.certificat {
background-color: white;
border: 1px solid #ddd;
padding: 20px;
max-width: 600px;
margin: 0 auto;
margin-top: 60px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h1 {
text-align: center;
color: #333;
text-decoration: underline;
font-size: 20px;
}
p {
line-height: 1.5;
color: #555;
}
.editable-field {
border-bottom: 1px dashed #666;
display: inline-block;
min-width: 50px;
min-height: 20px;
padding: 2px 4px;
margin: 0 3px;
}
.editable-area {
border: 1px solid #ddd;
border-radius: 4px;
padding: 8px;
margin: 5px 0;
width: 100%;
min-height: 20px;
resize: vertical;
overflow: hidden;
font-family: inherit;
font-size: inherit;
line-height: inherit;
}
.editable-area:focus {
outline: none;
border-color: #007bff;
}
#head {
margin-bottom: 20px;
}
#head table {
width: 100%;
border: 0px solid #000000;
padding: 4px;
margin-bottom: 15px;
}
#head td {
text-align: center;
}
.print-button {
text-align: center;
margin-top: 20px;
}
.print-button button {
padding: 10px 20px;
font-size: 16px;
background-color: #007bff;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
}
.print-button button:hover {
background-color: #0056b3;
}
@media print {
@page {
    size: A5;
    margin: 0.2cm 0.2cm 0.2cm 0.2cm;
}

body {
    margin: 0 !important;
    padding: 0 !important;
    font-size: 10pt !important;
    line-height: 1.2 !important;
    background-color: white;
}

.certificat {
    border: none;
    box-shadow: none;
    margin: 0 !important;
    padding: 2px 8px !important;
    max-width: 100% !important;
}

h1 {
    font-size: 14pt !important;
    margin: 5px 0 !important;
    margin-top: 2cm !important;
}

input[type="text"],
input[type="date"],
textarea {
    border: none !important;
    background: none !important;
    box-shadow: none !important;
    outline: none !important;
    font-size: 9pt !important;
}

input[type="text"]:focus,
input[type="date"]:focus,
textarea:focus {
    border: none !important;
    outline: none !important;
}

/* Styles existants */
.print-button {
    display: none;
}
.editable-field, .editable-area {
    border: none !important;
}

/* Additional space optimization */
* {
    margin-top: 0 !important;
    margin-bottom: 2px !important;
}

p {
    margin: 2px 0 !important;
    font-size: 9pt !important;
}
}
</style>
</head>
<body>
${enteteContent}
    <div class="certificat">
        <h1>CERTIFICAT MEDICAL</h1>
        <div class="contenu-certificat" style="margin-top: 1.5cm !important;">
        <p>
            Je soussigné, Dr <input type="text" id="docteur" value="${docteur}" placeholder="" style="width: 120px;">,
            certifie avoir examiné <strong><input type="text" value="${nom} ${prenom}" style="width: 180px;"></strong>,
            <span class="editable-field" contenteditable="true" style="min-width: 100px; display: inline-block;">né(e) le ${dob}</span> dont l'examen ce jour retrouve : <span class="editable-field" contenteditable="true" style="min-width: 300px; display: inline-block;">Une mal vision bilatérale nécessitant le port de lunettes</span> et d'être placé aux premiers rangs de la classe.
        </p>
        <p style="text-align: right; margin-top: 30px;">
            Le <span class="editable-field" contenteditable="true" style="min-width: 120px; display: inline-block;">${todayFormatted}</span>
        </p>
        <p style="text-align: right; margin-top: 30px;">
            Dont certificat<br>
            <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>
        </p>
    </div>
    <div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">
        <div style="display: flex; align-items: center; gap: 8px;">
            <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:</label>
            <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">
        </div>
        <button id="printButton">Imprimer le Certificat</button>
    </div>
    <script src="print.js"></script>
    <script src="certificat-unified-font-size.js"></script>

</body>
</html>
`;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();

        // Attacher l'événement d'impression directement après la fermeture du document
        newWindow.onload = function () {
            const printButton = newWindow.document.getElementById('printButton');
            if (printButton) {
                printButton.addEventListener('click', function () {
                    newWindow.print();
                });
            }
        };
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

// Fonction pour ouvrir une modale
function openModal(content) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.innerHTML = content;

    document.body.appendChild(modal);

    // Ajout des écouteurs pour les boutons
    // (Vous pouvez ajouter ici les écouteurs pour les autres boutons dans cette modal)

    // Fermer la modale si l'utilisateur clique en dehors
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Fonction pour demander le poids du patient
function demanderPoids() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const modalContent = `
                <div style="background: white; padding: 20px; border-radius: 5px; text-align: center;">
                    <h3>Poids du Patient</h3>
                    <p>Quel est le poids de votre patient en kg ?</p>
                    <input type="number" id="poidsPatient" style="padding: 8px; margin: 10px 0;">
                    <p>Date de la morsure :</p>
                    <input type="date" id="dateMorsure" value="${todayFormatted}" style="padding: 8px; margin: 10px 0;">
                    <div>
                        <button id="confirmPoids" style="padding: 8px 16px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Confirmer</button>
                    </div>
                </div>`;

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    modal.innerHTML = modalContent;

    document.body.appendChild(modal);

    modal.querySelector('#confirmPoids').addEventListener('click', function () {
        const poidsInput = modal.querySelector('#poidsPatient').value;
        const dateMorsure = modal.querySelector('#dateMorsure').value;

        if (!poidsInput || !dateMorsure) {
            alert("Veuillez remplir tous les champs.(valeur numérique dans la case de poids)");
            return;
        }

        document.body.removeChild(modal);
        // Ouvrir la modale de choix du schéma pour Vaccin C (sans Tissulaire avec SAR)
        ouvrirModalChoixSchemaVaccinC(dateMorsure, poidsInput);
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Fonction pour demander le poids du patient pour le vaccin T
function demanderPoidsT() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const modalContent = `
                <div style="background: white; padding: 20px; border-radius: 5px; text-align: center;">
                    <h3>Poids du Patient</h3>
                    <p>Quel est le poids de votre patient en kg ?</p>
                    <input type="number" id="poidsPatient" style="padding: 8px; margin: 10px 0;">
                    <p>Date de la morsure :</p>
                    <input type="date" id="dateMorsure" value="${todayFormatted}" style="padding: 8px; margin: 10px 0;">
                    <div>
                        <button id="confirmPoids" style="padding: 8px 16px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Confirmer</button>
                    </div>
                </div>`;

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    modal.innerHTML = modalContent;

    document.body.appendChild(modal);

    modal.querySelector('#confirmPoids').addEventListener('click', function () {
        const poidsInput = modal.querySelector('#poidsPatient').value;
        const dateMorsure = modal.querySelector('#dateMorsure').value;

        if (!poidsInput || !dateMorsure) {
            alert("Veuillez remplir tous les champs.(valeur numérique dans la case de poids)");
            return;
        }

        document.body.removeChild(modal);
        // Appeler directement le certificat Tissulaire avec SAR
        vaccint3(dateMorsure, poidsInput);
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Fonction pour demander la date pour les patients immunocompétents (sans poids)
function demanderDateImmunocompetent() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const modalContent = `
        <div style="background: white; padding: 20px; border-radius: 5px; text-align: center;">
            <h3>Prophylaxie Pré-exposition - Patient Immunocompétent</h3>
            <p>Date de début de la prophylaxie :</p>
            <input type="date" id="dateDebut" value="${todayFormatted}" style="padding: 8px; margin: 10px 0;">
            <div>
                <button id="confirmDate" style="padding: 8px 16px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Confirmer</button>
            </div>
        </div>`;

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    modal.innerHTML = modalContent;

    document.body.appendChild(modal);

    modal.querySelector('#confirmDate').addEventListener('click', function () {
        const dateDebut = modal.querySelector('#dateDebut').value;

        if (!dateDebut) {
            alert("Veuillez sélectionner une date.");
            return;
        }

        document.body.removeChild(modal);
        // Appeler la fonction pour générer le certificat de prophylaxie pré-exposition
        genererCertificatProphylaxieImmunocompetent(dateDebut);
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Fonction pour demander la date pour les patients immunodéprimés
function demanderDateImmunoDeprime() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const modalContent = `
        <div style="background: white; padding: 20px; border-radius: 5px; text-align: center;">
            <h3>Prophylaxie Pré-exposition - Patient Immunodéprimé</h3>
            <p>Date de début de la prophylaxie :</p>
            <input type="date" id="dateDebut" value="${todayFormatted}" style="padding: 8px; margin: 10px 0;">
            <div>
                <button id="confirmDate" style="padding: 8px 16px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Confirmer</button>
            </div>
        </div>`;

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    modal.innerHTML = modalContent;

    document.body.appendChild(modal);

    modal.querySelector('#confirmDate').addEventListener('click', function () {
        const dateDebut = modal.querySelector('#dateDebut').value;

        if (!dateDebut) {
            alert("Veuillez sélectionner une date.");
            return;
        }

        document.body.removeChild(modal);
        // Appeler la fonction pour générer le certificat de prophylaxie pré-exposition pour immunodéprimé
        genererCertificatProphylaxieImmunoDeprime(dateDebut);
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Fonction pour demander la date et le poids pour ATCD Prophylaxie Pré-exposition
function demanderDateATCDProphylaxie() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const modalContent = `
        <div style="background: white; padding: 20px; border-radius: 5px; text-align: center;">
            <h3>Avec ATCD Prophylaxie Pré-exposition</h3>
            <p>Date de la morsure :</p>
            <input type="date" id="dateMorsure" value="${todayFormatted}" style="padding: 8px; margin: 10px 0;">
            <div>
                <button id="confirmDate" style="padding: 8px 16px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Confirmer</button>
            </div>
        </div>`;

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    modal.innerHTML = modalContent;

    document.body.appendChild(modal);

    modal.querySelector('#confirmDate').addEventListener('click', function () {
        const dateMorsure = modal.querySelector('#dateMorsure').value;

        if (!dateMorsure) {
            alert("Veuillez sélectionner une date.");
            return;
        }

        document.body.removeChild(modal);
        // Appeler la fonction prophylaxiePreExpositionSchema3 avec seulement la date
        prophylaxiePreExpositionSchema3(dateMorsure);
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}


// Fonction pour ouvrir la modale pour Classe 02
function ouvrirModalClasse02() {
    const modalContent = `
        <div>
            <h3 style="color: green;">Choisissez un vaccin :</h3>
            <button id="vaccinCellulaire">Vaccin Cellulaire</button>
            <button id="vaccinTissulaire">Vaccin Tissulaire</button>
        </div>
    `;
    openModal(modalContent);

    // Ecouteur pour le bouton Vaccin Cellulaire
    document.querySelector('#vaccinCellulaire').addEventListener('click', () => {
        // Demander uniquement la date (le poids n'est pas nécessaire pour la classe 02)
        demanderDatePourClasse02();
    });

    // Ecouteur pour le bouton Vaccin Tissulaire
    document.querySelector('#vaccinTissulaire').addEventListener('click', () => {
        // Demander uniquement la date (le poids n'est pas nécessaire pour la classe 02)
        demanderDatePourClasse02Tissulaire();
    });
}

// Fonction pour ouvrir la modale pour Classe 03
function ouvrirModalClasse03() {
    const modalContent = `
<div>
<h3 style="color: green;">Choisissez un vaccin :</h3>
<button id="vaccinC">Vaccin C (Cellulaire)</button>
<button id="vaccinT">Vaccin T (Tissulaire)</button>
</div>
`;
    openModal(modalContent);
    // Ecouteur pour le bouton Vaccin C
    document.querySelector('#vaccinC').addEventListener('click', () => {
        demanderPoids(); // Demande le poids du patient
    });

    // Ecouteur pour le bouton Vaccin T
    document.querySelector('#vaccinT').addEventListener('click', () => {
        demanderPoidsT(); // Appelle la fonction qui ouvre la modale de choix de schéma
    });
}

// Fonction pour ouvrir la modale pour Prophylaxie Pré-exposition
function ouvrirModalPrex() {
    const modalContent = `
<div>
<h3 style="color: green;">Choisissez le type de patient :</h3>
<button id="immunocompetent">01 Immunocompétent</button>
<button id="immunodeprime">02 Immunodéprimé</button>
<button id="prophylaxiePreExpositionSchema3" style="padding: 8px 16px; margin: 5px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">03 Avec Risque Hemorragique</button>
</div>
`;
    openModal(modalContent);
    // Écouteur pour le bouton Immunocompétent
    document.querySelector('#immunocompetent').addEventListener('click', () => {
        // Demander uniquement la date (pas de poids nécessaire pour prophylaxie pré-exposition)
        demanderDateImmunocompetent();
    });

    // Écouteur pour le bouton Immunodéprimé
    document.querySelector('#immunodeprime').addEventListener('click', () => {
        // Demander uniquement la date (pas de poids nécessaire pour prophylaxie pré-exposition)
        demanderDateImmunoDeprime();
    });

    // Écouteur pour le bouton Avec ATCD Prophylaxie Pré-exposition
    document.querySelector('#prophylaxiePreExpositionSchema3').addEventListener('click', () => {
        // Demander uniquement la date (pas de poids nécessaire pour prophylaxie pré-exposition)
        demanderDateATCDProphylaxie();
    });
}

// Fonction pour demander la date pour la classe 02 (vaccin cellulaire)
function demanderDatePourClasse02() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const modalContent = `
                <div style="background: white; padding: 20px; border-radius: 5px; text-align: center;">
                    <h3>Date de la morsure</h3>
                    <p>Veuillez entrer la date du 01er jour de vaccination (Jour 0) :</p>
                    <input type="date" id="dateMorsure" value="${todayFormatted}" style="padding: 8px; margin: 10px 0;">
                    <div>
                        <button id="confirmDate" style="padding: 8px 16px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Confirmer</button>
                    </div>
                </div>`;

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    modal.innerHTML = modalContent;

    document.body.appendChild(modal);

    modal.querySelector('#confirmDate').addEventListener('click', function () {
        const dateMorsure = modal.querySelector('#dateMorsure').value;

        if (!dateMorsure) {
            alert("Veuillez entrer une date valide.");
            return;
        }

        document.body.removeChild(modal);
        // Ouvrir la modale de choix du schéma pour Vaccin Cellulaire
        openVaccinChoiceModal(dateMorsure, '');
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Fonction pour demander la date pour la classe 02 (vaccin tissulaire)
function demanderDatePourClasse02Tissulaire() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const modalContent = `
                <div style="background: white; padding: 20px; border-radius: 5px; text-align: center;">
                    <h3>Date de la morsure</h3>
                    <p>Veuillez entrer la date du 01er jour de vaccination (Jour 0) :</p>
                    <input type="date" id="dateMorsure" value="${todayFormatted}" style="padding: 8px; margin: 10px 0;">
                    <div>
                        <button id="confirmDate" style="padding: 8px 16px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Confirmer</button>
                    </div>
                </div>`;

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    modal.innerHTML = modalContent;

    document.body.appendChild(modal);

    modal.querySelector('#confirmDate').addEventListener('click', function () {
        const dateMorsure = modal.querySelector('#dateMorsure').value;

        if (!dateMorsure) {
            alert("Veuillez entrer une date valide.");
            return;
        }

        document.body.removeChild(modal);
        // Appeler directement la fonction Tissulairesanssar sans le poids
        Tissulairesanssar(dateMorsure, '');
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Fonction pour ouvrir une modale pour le choix entre Zagreb et Essens
function openVaccinChoiceModal(dateMorsure, poidsInput) {
    const modalContent = `
        <div>
            <h3 style="color: green;">Choisissez un schéma :</h3>
            <button id="zegreb">Zagreb</button>
            <button id="essens">Essen</button>
            <button id="risqueHemorragique" style="padding: 8px 16px; margin: 5px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Risque hémorragique/qte limitées</button>
            <button id="prophylaxiePreExpositionSchema1Classe2" style="padding: 8px 16px; margin: 5px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Avec ATCD Vaccinaux (Schéma 1)</button>
            <button id="prophylaxiePreExpositionSchema2Classe2" style="padding: 8px 16px; margin: 5px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Avec ATCD Vaccinaux (Schéma 2)</button>
        </div>
    `;

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.innerHTML = modalContent;

    document.body.appendChild(modal);

    // Ecouteurs pour les boutons dans la modale
    modal.querySelector('#zegreb').addEventListener('click', () => {
        zegreb(dateMorsure, poidsInput); // Pass the date and weight
        document.body.removeChild(modal);
    });

    modal.querySelector('#essens').addEventListener('click', () => {
        essens(dateMorsure, poidsInput); // Pass the date and weight
        document.body.removeChild(modal);
    });

    // Removed event listener for #avecATCDVaccinauxIM as this button was removed per user request

    modal.querySelector('#risqueHemorragique').addEventListener('click', () => {
        risqueHemorragiqueClasse2(dateMorsure, poidsInput); // Pass the date and weight
        document.body.removeChild(modal);
    });

    modal.querySelector('#prophylaxiePreExpositionSchema1Classe2').addEventListener('click', () => {
        prophylaxiePreExpositionSchema1Classe2(dateMorsure, poidsInput); // Pass the date and weight
        document.body.removeChild(modal);
    });

    modal.querySelector('#prophylaxiePreExpositionSchema2Classe2').addEventListener('click', () => {
        prophylaxiePreExpositionSchema2Classe2(dateMorsure); // Only pass the date, no weight needed
        document.body.removeChild(modal);
    });

    // Fermer la modale si l'utilisateur clique en dehors
    modal.addEventListener('click', (event) => {
        // Vérifier si le clic est sur la modal elle-même (et non sur un élément enfant)
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Nouvelle fonction pour ouvrir la modale de choix de schéma pour Vaccin C uniquement (sans Tissulaire avec SAR)
function ouvrirModalChoixSchemaVaccinC(dateMorsure, poidsInput) {
    const modalContent = `
    <div style="background: white; padding: 20px; border-radius: 5px; text-align: center;">
        <h3 style="color: green;">Choisissez un schéma :</h3>
        <button id="zegreb3" style="padding: 8px 16px; margin: 5px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Zagreb3</button>
        <button id="essen3" style="padding: 8px 16px; margin: 5px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Essen3</button>
        <button id="risqueHemorragique3" style="padding: 8px 16px; margin: 5px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Risque Hémorragique/Qte Limitées</button>
        <button id="prophylaxiePreExpositionSchema1Classe3" style="padding: 8px 16px; margin: 5px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Avec ATCD Vaccinaux (Schéma 1)</button>
        <button id="prophylaxiePreExpositionSchema2Classe3" style="padding: 8px 16px; margin: 5px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Avec ATCD Vaccinaux (Schéma 2)</button>
    </div>`;

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    modal.innerHTML = modalContent;

    document.body.appendChild(modal);

    // Ecouteur pour le bouton Zagreb3
    modal.querySelector('#zegreb3').addEventListener('click', () => {
        document.body.removeChild(modal);
        vaccinc3(dateMorsure, poidsInput);
    });

    // Ecouteur pour le bouton Essen3
    modal.querySelector('#essen3').addEventListener('click', () => {
        document.body.removeChild(modal);
        essen3(dateMorsure, poidsInput);
    });

    // Ecouteur pour le bouton Risque Hémorragique/Qte Limitées
    modal.querySelector('#risqueHemorragique3').addEventListener('click', () => {
        document.body.removeChild(modal);
        risqueHemorragique3(dateMorsure, poidsInput);
    });

    // Ecouteur pour le bouton Avec ATCD Vaccinaux (Schéma 1)
    modal.querySelector('#prophylaxiePreExpositionSchema1Classe3').addEventListener('click', () => {
        document.body.removeChild(modal);
        prophylaxiePreExpositionSchema1Classe3(dateMorsure, poidsInput);
    });

    // Ecouteur pour le bouton  Avec ATCD Vaccinaux (Schéma 2)
    modal.querySelector('#prophylaxiePreExpositionSchema2Classe3').addEventListener('click', () => {
        document.body.removeChild(modal);
        prophylaxiePreExpositionSchema2Classe3(dateMorsure, poidsInput);
    });

    // Fermer la modale si l'utilisateur clique en dehors
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Fonctions de schéma de vaccination (placeholders)
// Ces fonctions seront appelées avec dateMorsure et poidsInput comme paramètres
function zegreb(dateMorsure, poidsInput) {
    // Récupérer les informations du patient depuis le formulaire
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value || '';
    const patientDateNaissance = document.getElementById('patientDateNaissance').value || '';

    // Sauvegarder les informations du patient dans le localStorage pour la sauvegarde
    localStorage.setItem('patientNomPrenom', patientNomPrenom);
    localStorage.setItem('patientAge', patientAge);
    localStorage.setItem('patientDateNaissance', patientDateNaissance);

    // Utiliser la date de naissance si disponible, sinon l'âge
    let ageInfo = '';
    if (patientDateNaissance) {
        ageInfo = patientDateNaissance;
    } else if (patientAge) {
        ageInfo = patientAge;
    } else {
        ageInfo = '[Date de naissance]';
    }

    // Calculer les dates pour le schéma Zagreb (J0, J7, J21)
    const dateJour0 = new Date(dateMorsure);
    const datePlus7 = new Date(dateJour0);
    datePlus7.setDate(dateJour0.getDate() + 7);
    const datePlus21 = new Date(dateJour0);
    datePlus21.setDate(dateJour0.getDate() + 21);

    const dateFormattedJour0 = `${dateJour0.getFullYear()}-${String(dateJour0.getMonth() + 1).padStart(2, '0')}-${String(dateJour0.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus7 = `${datePlus7.getFullYear()}-${String(datePlus7.getMonth() + 1).padStart(2, '0')}-${String(datePlus7.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus21 = `${datePlus21.getFullYear()}-${String(datePlus21.getMonth() + 1).padStart(2, '0')}-${String(datePlus21.getDate()).padStart(2, '0')}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";
    const animal = "chien"; // Animal en cause (valeur par défaut)

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    // Générer le certificat Zagreb
    const certificatContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
    <meta charset="UTF-8">
    <title>Certificat Antirabique - Schéma Zagreb</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f9f9f9;
    }
    .certificat {
        background-color: white;
        border: 1px solid #ddd;
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        margin-top: 60px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        text-align: center;
        color: #333;
        text-decoration: underline;
        font-size: 16px;
    }
    h2 {
        text-align: center;
        color: #555;
        font-size: 10px;
        margin-top: 5px;
        margin-bottom: 15px;
    }
    p {
        line-height: 1.5;
        color: #555;
    }
    .small-text {
        font-size: 12px;
    }
    .print-button {
        text-align: center;
        margin-top: 20px;
    }
    .print-button button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .print-button button:hover {
        background-color: #0056b3;
    }
    @media print {
        @page {
            size: A5;
            margin: 0.2cm 0.2cm 0.2cm 0.2cm;
        }
        body {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10pt !important;
            background-color: white;
        }
        .certificat {
            padding: 2px 8px !important;
            max-width: 100% !important;
            border: none;
            box-shadow: none;
            margin-top: 0;
        }
        h1 {
            font-size: 14pt !important;
            margin: 5px 0 !important;
            margin-top: 2cm !important;
        }
        h2 {
            font-size: 12pt !important;
            margin: 3px 0 !important;
        }
        p {
            font-size: 9pt !important;
            margin: 2px 0 !important;
            line-height: 1.2 !important;
        }
        input[type="text"],
        input[type="date"],
        textarea {
            border: none !important;
            background: none !important;
            box-shadow: none !important;
            outline: none !important;
            font-size: 9pt !important;
        }
        input[type="text"]:focus,
        input[type="date"]:focus,
        textarea:focus {
            border: none !important;
            outline: none !important;
        }
        .print-button {
            display: none;
        }
        .docteur {
            font-weight: bold;
            font-size: 14pt !important;
            margin-right: 50px;
        }
        /* Additional space optimization */
        * {
            margin-top: 0 !important;
            margin-bottom: 2px !important;
        }
    }
    </style>
    </head>
    <body>
   ${enteteContent}

    <div class="certificat">
        <h1>Schéma Antirabique - Classe 02 (Zagreb)</h1>
        <h2>Selon l'instruction N16 du 15 Juillet 2024 relative à la conduite à tenir devant un risque rabique</h2>
        <p>
        NOM : <strong><input type="text" value="${patientNomPrenom}" style="width: auto;"></strong><br>
        Date de naissance : <strong><input type="text" value="${ageInfo}" style="width: auto;"></strong><br>
        Animal en cause : <strong><input type="text" value="${animal}" style="width: auto;"></strong><br>
        </p>
		<br><br>
      Classe 02, schéma choisi : vaccin cellulaire / schéma de Zagreb / sans SAR
       <br><br><br>
        <p>
          <br>
          <br><br>
          Jour 0 : <input type="date" id="dateJour0" value="${dateFormattedJour0}" readonly> ( 02 doses chacune dans un deltoïde ) <br>
          Jour 7 : <input type="date" id="datePlus7" value="${dateFormattedPlus7}" readonly> <br>
          Jour 21 : <input type="date" id="datePlus21" value="${dateFormattedPlus21}" readonly> <br>
         <br><br><br>
         <br><br>
           en cas d'âge <02 ans Face antérolatéral externe de la cuisse droite et gauche<br>
        </p>
        <p style="text-align: right; margin-top: 30px;">
        Medecin traitant <br>
        <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp&nbsp&nbsp&nbsp&nbsp;
        </p>
    </div>

    <div class="print-button">
        <button id="printButton">Imprimer le schéma</button>
		<button id="saveButtonZegr2">Sauvegarder</button>
    </div>
    

    <script>
    function sauvegarderCertificatAntirabique() {
        // Récupérer les informations du patient depuis les champs du certificat affiché
        const inputs = document.querySelectorAll('input[type="text"]');
        const patientNomPrenom = inputs[0] ? inputs[0].value : ''; // Premier input = NOM
        const patientDateNaissance = inputs[1] ? inputs[1].value : ''; // Deuxième input = Date de naissance
        const patientAnimal = inputs[2] ? inputs[2].value : 'chien'; // Troisième input = Animal
        const docteurSpan = document.querySelector('.docteur');
        const docteur = docteurSpan ? docteurSpan.textContent.replace('Dr ', '').trim() : '';
        
        // Préparer les données pour l'API
        const maintenant = new Date();
        const data = {
            nom: patientNomPrenom.split(' ').slice(0, -1).join(' ').trim() || patientNomPrenom, // Extraire le nom
            prenom: patientNomPrenom.split(' ').slice(-1).join(' ').trim() || '', // Extraire le prénom
            medecin: docteur,
            classe: "classe02",
            type_de_vaccin: "Cellulaire",
            shema: "Zagreb",
            date_de_certificat: maintenant.toISOString().split('T')[0], // Date d'aujourd'hui
            date_de_naissance: patientDateNaissance,
            animal: patientAnimal,
            heure_creation: maintenant.toTimeString().split(' ')[0] // Ajouter l'heure pour éviter les doublons
        };
        
        // Envoyer les données à l'API
        fetch('http://localhost:5000/api/ajouter_antirabique', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Certificat antirabique sauvegardé avec succès!');
            } else {
                alert('Erreur lors de la sauvegarde: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur de connexion au serveur');
        });
    }

    const polycliniqueInput = document.getElementById('polyclinique');
    if (polycliniqueInput) {
        polycliniqueInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique', this.value);
        });
    }

    const polycliniqueArInput = document.getElementById('polyclinique-ar');
    if (polycliniqueArInput) {
        polycliniqueArInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique-ar', this.value);
        });
    }

    document.getElementById('printButton').addEventListener('click', function () {
        window.print();
    });
    
    document.getElementById('saveButtonZegr2').addEventListener('click', function () {
        sauvegarderCertificatAntirabique();
    });
    </script>
    </body>
    </html>
    `;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

function essens(dateMorsure, poidsInput) {
    // Récupérer les informations du patient depuis le formulaire
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value || '';
    const patientDateNaissance = document.getElementById('patientDateNaissance').value || '';

    // Sauvegarder les informations du patient dans le localStorage pour la sauvegarde
    localStorage.setItem('patientNomPrenom', patientNomPrenom);
    localStorage.setItem('patientAge', patientAge);
    localStorage.setItem('patientDateNaissance', patientDateNaissance);

    // Utiliser la date de naissance si disponible, sinon l'âge
    let ageInfo = '';
    if (patientDateNaissance) {
        ageInfo = patientDateNaissance;
    } else if (patientAge) {
        ageInfo = patientAge;
    } else {
        ageInfo = '[Date de naissance]';
    }

    // Calculer les dates pour le schéma Essen (J0, J3, J7, J14)
    const dateJour0 = new Date(dateMorsure);
    const datePlus3 = new Date(dateJour0);
    datePlus3.setDate(dateJour0.getDate() + 3);
    const datePlus7 = new Date(dateJour0);
    datePlus7.setDate(dateJour0.getDate() + 7);
    const datePlus14 = new Date(dateJour0);
    datePlus14.setDate(dateJour0.getDate() + 14);

    const dateFormattedJour0 = `${dateJour0.getFullYear()}-${String(dateJour0.getMonth() + 1).padStart(2, '0')}-${String(dateJour0.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus3 = `${datePlus3.getFullYear()}-${String(datePlus3.getMonth() + 1).padStart(2, '0')}-${String(datePlus3.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus7 = `${datePlus7.getFullYear()}-${String(datePlus7.getMonth() + 1).padStart(2, '0')}-${String(datePlus7.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus14 = `${datePlus14.getFullYear()}-${String(datePlus14.getMonth() + 1).padStart(2, '0')}-${String(datePlus14.getDate()).padStart(2, '0')}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";
    const animal = "chien"; // Animal en cause (valeur par défaut)

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    // Générer le certificat Essen
    const certificatContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
    <meta charset="UTF-8">
    <title>Certificat Antirabique - Schéma Essen</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f9f9f9;
    }
    .certificat {
        background-color: white;
        border: 1px solid #ddd;
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        margin-top: 60px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        text-align: center;
        color: #333;
        text-decoration: underline;
        font-size: 16px;
    }
    h2 {
        text-align: center;
        color: #555;
        font-size: 10px;
        margin-top: 5px;
        margin-bottom: 15px;
    }
    p {
        line-height: 1.5;
        color: #555;
    }
    .small-text {
        font-size: 12px;
    }
    .print-button {
        text-align: center;
        margin-top: 20px;
    }
    .print-button button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .print-button button:hover {
        background-color: #0056b3;
    }
    @media print {
        @page {
            size: A5;
            margin: 0.2cm 0.2cm 0.2cm 0.2cm;
        }
        body {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10pt !important;
            background-color: white;
        }
        .certificat {
            padding: 2px 8px !important;
            max-width: 100% !important;
            border: none;
            box-shadow: none;
            margin-top: 0;
        }
        h1 {
            font-size: 14pt !important;
            margin: 5px 0 !important;
            margin-top: 2cm !important;
        }
        h2 {
            font-size: 12pt !important;
            margin: 3px 0 !important;
        }
        p {
            font-size: 9pt !important;
            margin: 2px 0 !important;
            line-height: 1.2 !important;
        }
        input[type="text"],
        input[type="date"],
        textarea {
            border: none !important;
            background: none !important;
            box-shadow: none !important;
            outline: none !important;
            font-size: 9pt !important;
        }
        input[type="text"]:focus,
        input[type="date"]:focus,
        textarea:focus {
            border: none !important;
            outline: none !important;
        }
        .print-button {
            display: none;
        }
        .docteur {
            font-weight: bold;
            font-size: 14pt !important;
            margin-right: 50px;
        }
        /* Additional space optimization */
        * {
            margin-top: 0 !important;
            margin-bottom: 2px !important;
        }
    }
    </style>
    </head>
    <body>
   ${enteteContent}

    <div class="certificat">
        <h1>Schéma Antirabique - Classe 02 (Essen)</h1>
        <h2>Selon l'instruction N16 du 15 Juillet 2024 relative à la conduite à tenir devant un risque rabique</h2>
        <p>
        NOM : <strong><input type="text" value="${patientNomPrenom}" style="width: auto;"></strong><br>
        Date de naissance : <strong><input type="text" value="${ageInfo}" style="width: auto;"></strong><br>
        Animal en cause : <strong><input type="text" value="${animal}" style="width: auto;"></strong><br>
		<br><br>
      Classe 02, schéma choisi : vaccin cellulaire / schéma de Essen / sans SAR
      <br><br><br>
        </p>
        <p>
          <br>
          <br><br>
          Jour 0 : <input type="date" id="dateJour0" value="${dateFormattedJour0}" readonly> ( dans le deltoïde )<br>
          Jour 3 : <input type="date" id="datePlus7" value="${dateFormattedPlus3}" readonly> <br>
          Jour 7 : <input type="date" id="datePlus21" value="${dateFormattedPlus7}" readonly><br>
          Jour 14 : <input type="date" id="datePlus28" value="${dateFormattedPlus14}" readonly> <br>
         <br><br>
        en cas d'âge <02 ans Face antérolatéral externe de la cuisse droite et gauche<br>
        </p>
        <p style="text-align: right; margin-top: 30px;">
        Medecin traitant <br>
        <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp&nbsp&nbsp&nbsp&nbsp;
        </p>
    </div>

    <div class="print-button">
        <button id="printButton">Imprimer le schéma</button>
		<button id="saveButtonEssen2">Sauvegarder</button>
    </div>
   


    <script>
    function sauvegarderCertificatAntirabique() {
        // Récupérer les informations du patient depuis les champs du certificat affiché
        const inputs = document.querySelectorAll('input[type="text"]');
        const patientNomPrenom = inputs[0] ? inputs[0].value : ''; // Premier input = NOM
        const patientDateNaissance = inputs[1] ? inputs[1].value : ''; // Deuxième input = Date de naissance
        const patientAnimal = inputs[2] ? inputs[2].value : 'chien'; // Troisième input = Animal
        const docteurSpan = document.querySelector('.docteur');
        const docteur = docteurSpan ? docteurSpan.textContent.replace('Dr ', '').trim() : '';
        
        // Préparer les données pour l'API
        const maintenant = new Date();
        const data = {
            nom: patientNomPrenom.split(' ').slice(0, -1).join(' ').trim() || patientNomPrenom, // Extraire le nom
            prenom: patientNomPrenom.split(' ').slice(-1).join(' ').trim() || '', // Extraire le prénom
            medecin: docteur,
            classe: "classe02",
            type_de_vaccin: "Cellulaire",
            shema: "Essen",
            date_de_certificat: maintenant.toISOString().split('T')[0], // Date d'aujourd'hui
            date_de_naissance: patientDateNaissance,
            animal: patientAnimal,
            heure_creation: maintenant.toTimeString().split(' ')[0] // Ajouter l'heure pour éviter les doublons
        };
        
        // Envoyer les données à l'API
        fetch('http://localhost:5000/api/ajouter_antirabique', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Certificat antirabique sauvegardé avec succès!');
            } else {
                alert('Erreur lors de la sauvegarde: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur de connexion au serveur');
        });
    }

    const polycliniqueInput = document.getElementById('polyclinique');
    if (polycliniqueInput) {
        polycliniqueInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique', this.value);
        });
    }

    const polycliniqueArInput = document.getElementById('polyclinique-ar');
    if (polycliniqueArInput) {
        polycliniqueArInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique-ar', this.value);
        });
    }

    document.getElementById('printButton').addEventListener('click', function () {
        window.print();
    });
    
    document.getElementById('saveButtonEssen2').addEventListener('click', function () {
        sauvegarderCertificatAntirabique();
    });
    </script>   
    </body>
    </html>
    `;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

function risqueHemorragiqueClasse2(dateMorsure, poidsInput) {
    // Récupérer les informations du patient depuis le formulaire
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value || '';
    const patientDateNaissance = document.getElementById('patientDateNaissance').value || '';

    // Utiliser la date de naissance si disponible, sinon l'âge
    let ageInfo = '';
    if (patientDateNaissance) {
        ageInfo = patientDateNaissance;
    } else if (patientAge) {
        ageInfo = patientAge;
    } else {
        ageInfo = '[Date de naissance]';
    }

    // Calculer les dates pour le schéma Risque Hémorragique (J0, J7, J21, J28)
    const dateJour0 = new Date(dateMorsure);
    const datePlus7 = new Date(dateJour0);
    datePlus7.setDate(dateJour0.getDate() + 7);
    const datePlus21 = new Date(dateJour0);
    datePlus21.setDate(dateJour0.getDate() + 21);
    const datePlus3 = new Date(dateJour0);
    datePlus3.setDate(dateJour0.getDate() + 3);

    const dateFormattedJour0 = `${dateJour0.getFullYear()}-${String(dateJour0.getMonth() + 1).padStart(2, '0')}-${String(dateJour0.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus3 = `${datePlus3.getFullYear()}-${String(datePlus3.getMonth() + 1).padStart(2, '0')}-${String(datePlus3.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus7 = `${datePlus7.getFullYear()}-${String(datePlus7.getMonth() + 1).padStart(2, '0')}-${String(datePlus7.getDate()).padStart(2, '0')}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";
    const animal = "chien"; // Animal en cause (valeur par défaut)

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    // Générer le certificat Risque Hémorragique
    const certificatContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
    <meta charset="UTF-8">
    <title>Certificat Antirabique - Risque Hémorragique/Qte Limitées</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f9f9f9;
    }
    .certificat {
        background-color: white;
        border: 1px solid #ddd;
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        margin-top: 60px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        text-align: center;
        color: #333;
        text-decoration: underline;
        font-size: 16px;
    }
    h2 {
        text-align: center;
        color: #555;
        font-size: 10px;
        margin-top: 5px;
        margin-bottom: 15px;
    }
    p {
        line-height: 1.5;
        color: #555;
    }
    .small-text {
        font-size: 12px;
    }
    .print-button {
        text-align: center;
        margin-top: 20px;
    }
    .print-button button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .print-button button:hover {
        background-color: #0056b3;
    }
    @media print {
        @page {
            size: A5;
            margin: 0.2cm 0.2cm 0.2cm 0.2cm;
        }
        body {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10pt !important;
            background-color: white;
        }
        .certificat {
            padding: 2px 8px !important;
            max-width: 100% !important;
            border: none;
            box-shadow: none;
            margin-top: 0;
        }
        h1 {
            font-size: 14pt !important;
            margin: 5px 0 !important;
            margin-top: 2cm !important;
        }
        h2 {
            font-size: 12pt !important;
            margin: 3px 0 !important;
        }
        p {
            font-size: 9pt !important;
            margin: 2px 0 !important;
            line-height: 1.2 !important;
        }
        input[type="text"],
        input[type="date"],
        textarea {
            border: none !important;
            background: none !important;
            box-shadow: none !important;
            outline: none !important;
            font-size: 9pt !important;
        }
        input[type="text"]:focus,
        input[type="date"]:focus,
        textarea:focus {
            border: none !important;
            outline: none !important;
        }
        .print-button {
            display: none;
        }
        .docteur {
            font-weight: bold;
            font-size: 14pt !important;
            margin-right: 50px;
        }
        /* Additional space optimization */
        * {
            margin-top: 0 !important;
            margin-bottom: 2px !important;
        }
    }
    </style>
    </head>
    <body>
   ${enteteContent}

    <div class="certificat">
        <h1>Schéma Antirabique - Classe 02 (Risque Hémorragique/Qte Limitées)</h1>
        <h2>Selon l'instruction N16 du 15 Juillet 2024 relative à la conduite à tenir devant un risque rabique</h2>
        <p>
        NOM : <strong><input type="text" value="${patientNomPrenom}" style="width: auto;"></strong><br>
        Date de naissance : <strong><input type="text" value="${ageInfo}" style="width: auto;"></strong><br>
        Animal en cause : <strong><input type="text" value="${animal}" style="width: auto;"></strong><br>
		<br>
     <span class="small-text">Schéma adapté pour patient à  risque hémorragique ou quantités limitées</span>
     <br>
        </p>
        <p>
         <br>
		 <strong>Personne sans antécédent de vaccination:</strong><br><br>
         Un total de six doses : 2 doses en deux [2] sites différents<br><br>
         Jour 0 : <input type="date" id="dateJour0" value="${dateFormattedJour0}" readonly> ( 2 doses en ID  ))<br>
         Jour 3 : <input type="date" id="datePlus3" value="${dateFormattedPlus3}" readonly> ( 2 doses en ID  )<br>
         Jour 7 : <input type="date" id="datePlus7" value="${dateFormattedPlus7}" readonly> ( 2 doses en ID  )<br>
       
         <br><br>
        NB: 01 dose=0,1mI (administration en ID)
        </p>
        <p style="text-align: right; margin-top: 30px;">
        Medecin traitant <br>
        <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp&nbsp&nbsp&nbsp&nbsp;
        </p>
    </div>

    <div class="print-button">
        <button id="printButton">Imprimer le schéma</button>
		<button id="saveButtonH2">Sauvegarder</button>
    </div>
    

    <script>
    function sauvegarderCertificatAntirabique() {
        // Récupérer les informations du patient depuis les champs du certificat affiché
        const inputs = document.querySelectorAll('input[type="text"]');
        const patientNomPrenom = inputs[0] ? inputs[0].value : ''; // Premier input = NOM
        const patientDateNaissance = inputs[1] ? inputs[1].value : ''; // Deuxième input = Date de naissance
        const patientAnimal = inputs[2] ? inputs[2].value : 'chien'; // Troisième input = Animal
        const docteurSpan = document.querySelector('.docteur');
        const docteur = docteurSpan ? docteurSpan.textContent.replace('Dr ', '').trim() : '';
        
        // Préparer les données pour l'API
        const maintenant = new Date();
        const data = {
            nom: patientNomPrenom.split(' ').slice(0, -1).join(' ').trim() || patientNomPrenom, // Extraire le nom
            prenom: patientNomPrenom.split(' ').slice(-1).join(' ').trim() || '', // Extraire le prénom
            medecin: docteur,
            classe: "classe02",
            type_de_vaccin: "Cellulaire",
            shema: "Risque Hémorragique",
            date_de_certificat: maintenant.toISOString().split('T')[0], // Date d'aujourd'hui
            date_de_naissance: patientDateNaissance,
            animal: patientAnimal,
            heure_creation: maintenant.toTimeString().split(' ')[0] // Ajouter l'heure pour éviter les doublons
        };
        
        // Envoyer les données à l'API
        fetch('http://localhost:5000/api/ajouter_antirabique', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Certificat antirabique sauvegardé avec succès!');
            } else {
                alert('Erreur lors de la sauvegarde: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur de connexion au serveur');
        });
    }

    const polycliniqueInput = document.getElementById('polyclinique');
    if (polycliniqueInput) {
        polycliniqueInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique', this.value);
        });
    }

    const polycliniqueArInput = document.getElementById('polyclinique-ar');
    if (polycliniqueArInput) {
        polycliniqueArInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique-ar', this.value);
        });
    }

    document.getElementById('printButton').addEventListener('click', function () {
        window.print();
    });
    
    document.getElementById('saveButtonH2').addEventListener('click', function () {
        sauvegarderCertificatAntirabique();
    });
    </script> 
    </body>
    </html>
    `;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

function prophylaxiePreExpositionSchema1Classe2(dateMorsure, poidsInput) {
    // Récupérer les informations du patient depuis le formulaire
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value || '';
    const patientDateNaissance = document.getElementById('patientDateNaissance').value || '';

    // Utiliser la date de naissance si disponible, sinon l'âge
    let ageInfo = '';
    if (patientDateNaissance) {
        ageInfo = patientDateNaissance;
    } else if (patientAge) {
        ageInfo = patientAge;
    } else {
        ageInfo = '[Date de naissance]';
    }

    // Calculer les dates pour le schéma ATCD Vaccinaux Schéma 1 (J0, J3)
    const dateJour0 = new Date(dateMorsure);
    const datePlus3 = new Date(dateJour0);
    datePlus3.setDate(dateJour0.getDate() + 3);

    const dateFormattedJour0 = `${dateJour0.getFullYear()}-${String(dateJour0.getMonth() + 1).padStart(2, '0')}-${String(dateJour0.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus3 = `${datePlus3.getFullYear()}-${String(datePlus3.getMonth() + 1).padStart(2, '0')}-${String(datePlus3.getDate()).padStart(2, '0')}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";
    const animal = "chien"; // Animal en cause (valeur par défaut)

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    // Générer le certificat ATCD Vaccinaux Schéma 1
    const certificatContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
    <meta charset="UTF-8">
    <title>Certificat Antirabique - Avec ATCD Vaccinaux (Schéma 1)</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f9f9f9;
    }
    .certificat {
        background-color: white;
        border: 1px solid #ddd;
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        margin-top: 60px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        text-align: center;
        color: #333;
        text-decoration: underline;
        font-size: 16px;
    }
    h2 {
        text-align: center;
        color: #555;
        font-size: 10px;
        margin-top: 5px;
        margin-bottom: 15px;
    }
    p {
        line-height: 1.5;
        color: #555;
    }
    .small-text {
        font-size: 12px;
    }
    .print-button {
        text-align: center;
        margin-top: 20px;
    }
    .print-button button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .print-button button:hover {
        background-color: #0056b3;
    }
    @media print {
        @page {
            size: A5;
            margin: 0.2cm 0.2cm 0.2cm 0.2cm;
        }
        body {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10pt !important;
            background-color: white;
        }
        .certificat {
            padding: 2px 8px !important;
            max-width: 100% !important;
            border: none;
            box-shadow: none;
            margin-top: 0;
        }
        h1 {
            font-size: 14pt !important;
            margin: 5px 0 !important;
            margin-top: 2cm !important;
        }
        h2 {
            font-size: 12pt !important;
            margin: 3px 0 !important;
        }
        p {
            font-size: 9pt !important;
            margin: 2px 0 !important;
            line-height: 1.2 !important;
        }
        input[type="text"],
        input[type="date"],
        textarea {
            border: none !important;
            background: none !important;
            box-shadow: none !important;
            outline: none !important;
            font-size: 9pt !important;
        }
        input[type="text"]:focus,
        input[type="date"]:focus,
        textarea:focus {
            border: none !important;
            outline: none !important;
        }
        .print-button {
            display: none;
        }
        .docteur {
            font-weight: bold;
            font-size: 14pt !important;
            margin-right: 50px;
        }
        /* Additional space optimization */
        * {
            margin-top: 0 !important;
            margin-bottom: 2px !important;
        }
    }
    </style>
    </head>
    <body>
   ${enteteContent}

    <div class="certificat">
        <h1>Schéma Antirabique - Avec ATCD Vaccinaux (Schéma 1)</h1>
        <h2>Selon l'instruction N16 du 15 Juillet 2024 relative à la conduite à tenir devant un risque rabique</h2>
        <p>
        NOM : <strong><input type="text" value="${patientNomPrenom}" style="width: auto;"></strong><br>
        Date de naissance : <strong><input type="text" value="${ageInfo}" style="width: auto;"></strong><br>
        Animal en cause : <strong><input type="text" value="${animal}" style="width: auto;"></strong><br>
        </p>
        <p>
         <strong style="font-size: 14px;">Personne ayant reçu une prophylaxie Pré-exPosition, ou (>= 02 doses):</strong><br>
         <br><br>
         Schéma 1 : Un total de deux (2) doses<br><br>
         Jour 0 : <input type="date" id="dateJour0" value="${dateFormattedJour0}" readonly> (une (1) dose ID en un seul site)<br>
         Jour 3 : <input type="date" id="datePlus3" value="${dateFormattedPlus3}" readonly> (une (1) dose ID en un seul site)<br>
         <br><br>
        NB: 01 dose=0,1mI
        </p>
        <p style="text-align: right; margin-top: 30px;">
        Medecin traitant <br>
        <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp&nbsp&nbsp&nbsp&nbsp;
        </p>
    </div>

    <div class="print-button">
        <button id="printButton">Imprimer le schéma</button>
		<button id="saveButtonAtcdv">Sauvegarder</button>
    </div>
    

    <script>
    function sauvegarderCertificatAntirabique() {
        // Récupérer les informations du patient depuis les champs du certificat affiché
        const inputs = document.querySelectorAll('input[type="text"]');
        const patientNomPrenom = inputs[0] ? inputs[0].value : ''; // Premier input = NOM
        const patientDateNaissance = inputs[1] ? inputs[1].value : ''; // Deuxième input = Date de naissance
        const patientAnimal = inputs[2] ? inputs[2].value : 'chien'; // Troisième input = Animal
        const docteurSpan = document.querySelector('.docteur');
        const docteur = docteurSpan ? docteurSpan.textContent.replace('Dr ', '').trim() : '';
        
        // Préparer les données pour l'API
        const maintenant = new Date();
        const data = {
            nom: patientNomPrenom.split(' ').slice(0, -1).join(' ').trim() || patientNomPrenom, // Extraire le nom
            prenom: patientNomPrenom.split(' ').slice(-1).join(' ').trim() || '', // Extraire le prénom
            medecin: docteur,
            classe: "classe02",
            type_de_vaccin: "Cellulaire",
            shema: " Avec ATCD 1",
            date_de_certificat: maintenant.toISOString().split('T')[0], // Date d'aujourd'hui
            date_de_naissance: patientDateNaissance,
            animal: patientAnimal,
            heure_creation: maintenant.toTimeString().split(' ')[0] // Ajouter l'heure pour éviter les doublons
        };
        
        // Envoyer les données à l'API
        fetch('http://localhost:5000/api/ajouter_antirabique', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Certificat antirabique sauvegardé avec succès!');
            } else {
                alert('Erreur lors de la sauvegarde: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur de connexion au serveur');
        });
    }

    const polycliniqueInput = document.getElementById('polyclinique');
    if (polycliniqueInput) {
        polycliniqueInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique', this.value);
        });
    }

    const polycliniqueArInput = document.getElementById('polyclinique-ar');
    if (polycliniqueArInput) {
        polycliniqueArInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique-ar', this.value);
        });
    }

    document.getElementById('printButton').addEventListener('click', function () {
        window.print();
    });
    
    document.getElementById('saveButtonAtcdv').addEventListener('click', function () {
        sauvegarderCertificatAntirabique();
    });
    </script> 
    </body>
    </html>
    `;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

function prophylaxiePreExpositionSchema2Classe2(dateMorsure) {
    // Récupérer les informations du patient depuis le formulaire
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value || '';
    const patientDateNaissance = document.getElementById('patientDateNaissance').value || '';

    // Utiliser la date de naissance si disponible, sinon l'âge
    let ageInfo = '';
    if (patientDateNaissance) {
        ageInfo = patientDateNaissance;
    } else if (patientAge) {
        ageInfo = patientAge;
    } else {
        ageInfo = '[Date de naissance]';
    }

    // Calculer les dates pour le schéma ATCD Vaccinaux Schéma 2 (J0 uniquement)
    const dateJour0 = new Date(dateMorsure);

    const dateFormattedJour0 = `${dateJour0.getFullYear()}-${String(dateJour0.getMonth() + 1).padStart(2, '0')}-${String(dateJour0.getDate()).padStart(2, '0')}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";
    const animal = "chien"; // Animal en cause (valeur par défaut)

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    // Générer le certificat ATCD Vaccinaux Schéma 2
    const certificatContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
    <meta charset="UTF-8">
    <title>Certificat Antirabique - Avec ATCD Vaccinaux (Schéma 2)</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f9f9f9;
    }
    .certificat {
        background-color: white;
        border: 1px solid #ddd;
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        margin-top: 60px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        text-align: center;
        color: #333;
        text-decoration: underline;
        font-size: 16px;
    }
    h2 {
        text-align: center;
        color: #555;
        font-size: 10px;
        margin-top: 5px;
        margin-bottom: 15px;
    }
    p {
        line-height: 1.5;
        color: #555;
    }
    .small-text {
        font-size: 12px;
    }
    .print-button {
        text-align: center;
        margin-top: 20px;
    }
    .print-button button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .print-button button:hover {
        background-color: #0056b3;
    }
    @media print {
        @page {
            size: A5;
            margin: 0.2cm 0.2cm 0.2cm 0.2cm;
        }
        body {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10pt !important;
            background-color: white;
        }
        .certificat {
            padding: 2px 8px !important;
            max-width: 100% !important;
            border: none;
            box-shadow: none;
            margin-top: 0;
        }
        h1 {
            font-size: 14pt !important;
            margin: 5px 0 !important;
            margin-top: 2cm !important;
        }
        h2 {
            font-size: 12pt !important;
            margin: 3px 0 !important;
        }
        p {
            font-size: 9pt !important;
            margin: 2px 0 !important;
            line-height: 1.2 !important;
        }
        input[type="text"],
        input[type="date"],
        textarea {
            border: none !important;
            background: none !important;
            box-shadow: none !important;
            outline: none !important;
            font-size: 9pt !important;
        }
        input[type="text"]:focus,
        input[type="date"]:focus,
        textarea:focus {
            border: none !important;
            outline: none !important;
        }
        .print-button {
            display: none;
        }
        .docteur {
            font-weight: bold;
            font-size: 14pt !important;
            margin-right: 50px;
        }
        /* Additional space optimization */
        * {
            margin-top: 0 !important;
            margin-bottom: 2px !important;
        }
    }
    </style>
    </head>
    <body>
   ${enteteContent}

    <div class="certificat">
        <h1>Schéma Antirabique - Avec ATCD Vaccinaux (Schéma 2)</h1>
        <h2>Selon l'instruction N16 du 15 Juillet 2024 relative à la conduite à tenir devant un risque rabique</h2>
        <p>
        NOM : <strong><input type="text" value="${patientNomPrenom}" style="width: auto;"></strong><br>
        Date de naissance : <strong><input type="text" value="${ageInfo}" style="width: auto;"></strong><br>
        Animal en cause : <strong><input type="text" value="${animal}" style="width: auto;"></strong><br>
        </p>
        <p>
         <strong>Personne ayant reçu une prophylaxie Pré-exPosition, ou (≥ 02 doses):</strong><br>
         Schéma 2 : Un total de quatre (4) doses<br><br>
         Jour 0 : <input type="date" id="dateJour0" value="${dateFormattedJour0}" readonly> (une dose en ID en quatre (4) sites différents)<br>
         <br><br>
        NB: 01 dose=0,1mI
        </p>
        <p style="text-align: right; margin-top: 30px;">
        Medecin traitant <br>
        <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp&nbsp&nbsp&nbsp&nbsp;
        </p>
    </div>

    <div class="print-button">
        <button id="printButton">Imprimer le schéma</button>
		<button id="saveButtonAtcdv2">Sauvegarder</button>
    </div>
  

    <script>
    function sauvegarderCertificatAntirabique() {
        // Récupérer les informations du patient depuis les champs du certificat affiché
        const inputs = document.querySelectorAll('input[type="text"]');
        const patientNomPrenom = inputs[0] ? inputs[0].value : ''; // Premier input = NOM
        const patientDateNaissance = inputs[1] ? inputs[1].value : ''; // Deuxième input = Date de naissance
        const patientAnimal = inputs[2] ? inputs[2].value : 'chien'; // Troisième input = Animal
        const docteurSpan = document.querySelector('.docteur');
        const docteur = docteurSpan ? docteurSpan.textContent.replace('Dr ', '').trim() : '';
        
        // Préparer les données pour l'API
        const maintenant = new Date();
        const data = {
            nom: patientNomPrenom.split(' ').slice(0, -1).join(' ').trim() || patientNomPrenom, // Extraire le nom
            prenom: patientNomPrenom.split(' ').slice(-1).join(' ').trim() || '', // Extraire le prénom
            medecin: docteur,
            classe: "classe02",
            type_de_vaccin: "Cellulaire",
            shema: " Avec ATCD 2",
            date_de_certificat: maintenant.toISOString().split('T')[0], // Date d'aujourd'hui
            date_de_naissance: patientDateNaissance,
            animal: patientAnimal,
            heure_creation: maintenant.toTimeString().split(' ')[0] // Ajouter l'heure pour éviter les doublons
        };
        
        // Envoyer les données à l'API
        fetch('http://localhost:5000/api/ajouter_antirabique', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Certificat antirabique sauvegardé avec succès!');
            } else {
                alert('Erreur lors de la sauvegarde: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur de connexion au serveur');
        });
    }

    const polycliniqueInput = document.getElementById('polyclinique');
    if (polycliniqueInput) {
        polycliniqueInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique', this.value);
        });
    }

    const polycliniqueArInput = document.getElementById('polyclinique-ar');
    if (polycliniqueArInput) {
        polycliniqueArInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique-ar', this.value);
        });
    }

    document.getElementById('printButton').addEventListener('click', function () {
        window.print();
    });
    
    document.getElementById('saveButtonAtcdv2').addEventListener('click', function () {
        sauvegarderCertificatAntirabique();
    });
    </script> 
    </body>
    </html>
    `;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

function vaccinc3(dateMorsure, poidsInput) {
    // Récupérer les informations du patient depuis le formulaire
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value || '';
    const patientDateNaissance = document.getElementById('patientDateNaissance').value || '';

    // Utiliser la date de naissance si disponible, sinon l'âge
    let ageInfo = '';
    if (patientDateNaissance) {
        ageInfo = patientDateNaissance;
    } else if (patientAge) {
        ageInfo = patientAge;
    } else {
        ageInfo = '[Date de naissance]';
    }

    // Calculer le SAR (Sérum Antirabique) en fonction du poids
    const poids = parseFloat(poidsInput) || 0;
    let sar = poids / 5;
    if (poids >= 75) {
        sar = 15;
    }
    sar = Math.round(sar * 100) / 100;

    // Calculer les dates pour le schéma Zagreb 3 (J0, J7, J21)
    const dateJour0 = new Date(dateMorsure);
    const datePlus7 = new Date(dateJour0);
    datePlus7.setDate(dateJour0.getDate() + 7);
    const datePlus21 = new Date(dateJour0);
    datePlus21.setDate(dateJour0.getDate() + 21);

    const dateFormattedJour0 = `${dateJour0.getFullYear()}-${String(dateJour0.getMonth() + 1).padStart(2, '0')}-${String(dateJour0.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus7 = `${datePlus7.getFullYear()}-${String(datePlus7.getMonth() + 1).padStart(2, '0')}-${String(datePlus7.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus21 = `${datePlus21.getFullYear()}-${String(datePlus21.getMonth() + 1).padStart(2, '0')}-${String(datePlus21.getDate()).padStart(2, '0')}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";
    const animal = "chien"; // Animal en cause (valeur par défaut)

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    // Générer le certificat Vaccin C Schema 3
    const certificatContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
    <meta charset="UTF-8">
    <title>Certificat Antirabique - Vaccin C Schema 3 (Zagreb)</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f9f9f9;
    }
    .certificat {
        background-color: white;
        border: 1px solid #ddd;
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        margin-top: 60px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        text-align: center;
        color: #333;
        text-decoration: underline;
        font-size: 16px;
    }
    h2 {
        text-align: center;
        color: #555;
        font-size: 10px;
        margin-top: 5px;
        margin-bottom: 15px;
    }
    p {
        line-height: 1.5;
        color: #555;
    }
    .small-text {
        font-size: 12px;
    }
    .print-button {
        text-align: center;
        margin-top: 20px;
    }
    .print-button button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .print-button button:hover {
        background-color: #0056b3;
    }
    @media print {
        @page {
            size: A5;
            margin: 0.2cm 0.2cm 0.2cm 0.2cm;
        }
        body {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10pt !important;
            background-color: white;
        }
        .certificat {
            padding: 2px 8px !important;
            max-width: 100% !important;
            border: none;
            box-shadow: none;
            margin-top: 0;
        }
        h1 {
            font-size: 14pt !important;
            margin: 5px 0 !important;
            margin-top: 2cm !important;
        }
        h2 {
            font-size: 12pt !important;
            margin: 3px 0 !important;
        }
        p {
            font-size: 9pt !important;
            margin: 2px 0 !important;
            line-height: 1.2 !important;
        }
        input[type="text"],
        input[type="date"],
        textarea {
            border: none !important;
            background: none !important;
            box-shadow: none !important;
            outline: none !important;
            font-size: 9pt !important;
        }
        input[type="text"]:focus,
        input[type="date"]:focus,
        textarea:focus {
            border: none !important;
            outline: none !important;
        }
        .print-button {
            display: none;
        }
        .docteur {
            font-weight: bold;
            font-size: 14pt !important;
            margin-right: 50px;
        }
        /* Additional space optimization */
        * {
            margin-top: 0 !important;
            margin-bottom: 2px !important;
        }
    }
    </style>
    </head>
    <body>
   ${enteteContent}

    <div class="certificat">
        <h1>Schéma Antirabique - Classe 03 (Vaccin C Schema 3)</h1>
        <h2>Selon l'instruction N16 du 15 Juillet 2024 relative à la conduite à tenir devant un risque rabique</h2>
        <p>
        NOM : <strong><input type="text" value="${patientNomPrenom}" style="width: auto;"></strong><br>
        Date de naissance : <strong><input type="text" value="${ageInfo}" style="width: auto;"></strong><br>
        Animal en cause : <strong><input type="text" value="${animal}" style="width: auto;"></strong><br>
        Poids : <strong><input type="text" value="${poidsInput} kg" style="width: auto;"></strong><br>
        SAR : <strong><input type="text" value="${sar} cc" style="width: auto;"></strong><br><br>		
        Classe 03, schéma choisi : vaccin cellulaire / schéma de Zagreb / avec SAR
        <br>
        </p>
        <p>
         <br><br>
         Jour 0 : <input type="date" id="dateJour0" value="${dateFormattedJour0}" readonly>( 02 doses chacune dans un deltoïde )<br>
         Jour 7 : <input type="date" id="datePlus7" value="${dateFormattedPlus7}" readonly> <br>
         Jour 21 : <input type="date" id="datePlus21" value="${dateFormattedPlus21}" readonly> <br>
         <br><br>
         en cas d'âge <02 ans Face antérolatéral externe de la cuisse droite et gauche<br>
        </p>
        <p style="text-align: right; margin-top: 30px;">
        Medecin traitant <br>
        <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp&nbsp&nbsp&nbsp&nbsp;
        </p>
    </div>

    <div class="print-button">
        <button id="printButton">Imprimer le schéma</button>
		<button id="saveButtonc3">Sauvegarder</button>
    </div>

    <script>
    function sauvegarderCertificatAntirabique() {
        // Récupérer les informations du patient depuis les champs du certificat affiché
        const inputs = document.querySelectorAll('input[type="text"]');
        const patientNomPrenom = inputs[0] ? inputs[0].value : ''; // Premier input = NOM
        const patientDateNaissance = inputs[1] ? inputs[1].value : ''; // Deuxième input = Date de naissance
        const patientAnimal = inputs[2] ? inputs[2].value : 'chien'; // Troisième input = Animal
        const docteurSpan = document.querySelector('.docteur');
        const docteur = docteurSpan ? docteurSpan.textContent.replace('Dr ', '').trim() : '';
        
        // Préparer les données pour l'API
        const maintenant = new Date();
        const data = {
            nom: patientNomPrenom.split(' ').slice(0, -1).join(' ').trim() || patientNomPrenom, // Extraire le nom
            prenom: patientNomPrenom.split(' ').slice(-1).join(' ').trim() || '', // Extraire le prénom
            medecin: docteur,
            classe: "classe03",
            type_de_vaccin: "Cellulaire",
            shema: "Zagreb",
            date_de_certificat: maintenant.toISOString().split('T')[0], // Date d'aujourd'hui
            date_de_naissance: patientDateNaissance,
            animal: patientAnimal,
            heure_creation: maintenant.toTimeString().split(' ')[0] // Ajouter l'heure pour éviter les doublons
        };
        
        // Envoyer les données à l'API
        fetch('http://localhost:5000/api/ajouter_antirabique', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Certificat antirabique sauvegardé avec succès!');
            } else {
                alert('Erreur lors de la sauvegarde: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur de connexion au serveur');
        });
    }

    const polycliniqueInput = document.getElementById('polyclinique');
    if (polycliniqueInput) {
        polycliniqueInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique', this.value);
        });
    }

    const polycliniqueArInput = document.getElementById('polyclinique-ar');
    if (polycliniqueArInput) {
        polycliniqueArInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique-ar', this.value);
        });
    }

    document.getElementById('printButton').addEventListener('click', function () {
        window.print();
    });
    
    document.getElementById('saveButtonc3').addEventListener('click', function () {
        sauvegarderCertificatAntirabique();
    });
    </script> 
    </body>
    </html>
    `;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

function essen3(dateMorsure, poidsInput) {
    // Récupérer les informations du patient depuis le formulaire
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value || '';
    const patientDateNaissance = document.getElementById('patientDateNaissance').value || '';

    // Utiliser la date de naissance si disponible, sinon l'âge
    let ageInfo = '';
    if (patientDateNaissance) {
        ageInfo = patientDateNaissance;
    } else if (patientAge) {
        ageInfo = patientAge;
    } else {
        ageInfo = '[Date de naissance]';
    }

    // Calculer le SAR (Sérum Antirabique) en fonction du poids
    const poids = parseFloat(poidsInput) || 0;
    let sar = poids / 5;
    if (poids >= 75) {
        sar = 15;
    }
    sar = Math.round(sar * 100) / 100;

    // Calculer les dates pour le schéma Essen 3 (J0, J3, J7, J14)
    const dateJour0 = new Date(dateMorsure);
    const datePlus3 = new Date(dateJour0);
    datePlus3.setDate(dateJour0.getDate() + 3);
    const datePlus7 = new Date(dateJour0);
    datePlus7.setDate(dateJour0.getDate() + 7);
    const datePlus14 = new Date(dateJour0);
    datePlus14.setDate(dateJour0.getDate() + 14);

    const dateFormattedJour0 = `${dateJour0.getFullYear()}-${String(dateJour0.getMonth() + 1).padStart(2, '0')}-${String(dateJour0.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus3 = `${datePlus3.getFullYear()}-${String(datePlus3.getMonth() + 1).padStart(2, '0')}-${String(datePlus3.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus7 = `${datePlus7.getFullYear()}-${String(datePlus7.getMonth() + 1).padStart(2, '0')}-${String(datePlus7.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus14 = `${datePlus14.getFullYear()}-${String(datePlus14.getMonth() + 1).padStart(2, '0')}-${String(datePlus14.getDate()).padStart(2, '0')}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";
    const animal = "chien"; // Animal en cause (valeur par défaut)

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    // Générer le certificat Essen Schema 3
    const certificatContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
    <meta charset="UTF-8">
    <title>Certificat Antirabique - Essen Schema 3</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f9f9f9;
    }
    .certificat {
        background-color: white;
        border: 1px solid #ddd;
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        margin-top: 60px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        text-align: center;
        color: #333;
        text-decoration: underline;
        font-size: 16px;
    }
    h2 {
        text-align: center;
        color: #555;
        font-size: 10px;
        margin-top: 5px;
        margin-bottom: 15px;
    }
    p {
        line-height: 1.5;
        color: #555;
    }
    .small-text {
        font-size: 12px;
    }
    .print-button {
        text-align: center;
        margin-top: 20px;
    }
    .print-button button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .print-button button:hover {
        background-color: #0056b3;
    }
    @media print {
        @page {
            size: A5;
            margin: 0.2cm 0.2cm 0.2cm 0.2cm;
        }
        body {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10pt !important;
            background-color: white;
        }
        .certificat {
            padding: 2px 8px !important;
            max-width: 100% !important;
            border: none;
            box-shadow: none;
            margin-top: 0;
        }
        h1 {
            font-size: 14pt !important;
            margin: 5px 0 !important;
            margin-top: 2cm !important;
        }
        h2 {
            font-size: 12pt !important;
            margin: 3px 0 !important;
        }
        p {
            font-size: 9pt !important;
            margin: 2px 0 !important;
            line-height: 1.2 !important;
        }
        input[type="text"],
        input[type="date"],
        textarea {
            border: none !important;
            background: none !important;
            box-shadow: none !important;
            outline: none !important;
            font-size: 9pt !important;
        }
        input[type="text"]:focus,
        input[type="date"]:focus,
        textarea:focus {
            border: none !important;
            outline: none !important;
        }
        .print-button {
            display: none;
        }
        .docteur {
            font-weight: bold;
            font-size: 14pt !important;
            margin-right: 50px;
        }
        /* Additional space optimization */
        * {
            margin-top: 0 !important;
            margin-bottom: 2px !important;
        }
    }
    </style>
    </head>
    <body>
   ${enteteContent}

    <div class="certificat">
        <h1>Schéma Antirabique - Classe 03 (Essen)</h1>
        <h2>Selon l'instruction N16 du 15 Juillet 2024 relative à la conduite à tenir devant un risque rabique</h2>
        <p>
        NOM : <strong><input type="text" value="${patientNomPrenom}" style="width: auto;"></strong><br>
        Date de naissance : <strong><input type="text" value="${ageInfo}" style="width: auto;"></strong><br>
        Animal en cause : <strong><input type="text" value="${animal}" style="width: auto;"></strong><br>
        Poids : <strong><input type="text" value="${poidsInput} kg" style="width: auto;"></strong><br>
        SAR : <strong><input type="text" value="${sar} cc" style="width: auto;"></strong><br>
		<br>
         Classe 03, schéma choisi : vaccin cellulaire / schéma de Essen / avec SAR
        <br>
        </p>
        <p>
         <br>
         Jour 0 : <input type="date" id="dateJour0" value="${dateFormattedJour0}" readonly> ( dans le deltoïde )<br>
         Jour 3 : <input type="date" id="datePlus3" value="${dateFormattedPlus3}" readonly> <br>
         Jour 7 : <input type="date" id="datePlus7" value="${dateFormattedPlus7}" readonly> <br>
         Jour 14 : <input type="date" id="datePlus14" value="${dateFormattedPlus14}" readonly> <br>
         <br><br>
        Pour les immunodéprimées si sérologie de contrôle après 02 a 04 semaines de vaccin < 0.5 ui/ml (ou s’il n'est pas faisable) ajouter une autre dose de vaccin.<br>
		
		<br><br>
		<br><br>
        <span class="small-text">en cas d'âge <02 ans Face antérolatéral externe de la cuisse droite et gauche</span><br>
        </p>
        <p style="text-align: right; margin-top: 30px;">
        Medecin traitant <br>
        <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp&nbsp&nbsp&nbsp&nbsp;
        </p>
    </div>

    <div class="print-button">
        <button id="printButton">Imprimer le schéma</button>
		<button id="saveButtonessen3">Sauvegarder</button>
    </div>

    <script>
    function sauvegarderCertificatAntirabique() {
        // Récupérer les informations du patient depuis les champs du certificat affiché
        const inputs = document.querySelectorAll('input[type="text"]');
        const patientNomPrenom = inputs[0] ? inputs[0].value : ''; // Premier input = NOM
        const patientDateNaissance = inputs[1] ? inputs[1].value : ''; // Deuxième input = Date de naissance
        const patientAnimal = inputs[2] ? inputs[2].value : 'chien'; // Troisième input = Animal
        const docteurSpan = document.querySelector('.docteur');
        const docteur = docteurSpan ? docteurSpan.textContent.replace('Dr ', '').trim() : '';
        
        // Préparer les données pour l'API
        const maintenant = new Date();
        const data = {
            nom: patientNomPrenom.split(' ').slice(0, -1).join(' ').trim() || patientNomPrenom, // Extraire le nom
            prenom: patientNomPrenom.split(' ').slice(-1).join(' ').trim() || '', // Extraire le prénom
            medecin: docteur,
            classe: "classe03",
            type_de_vaccin: "Cellulaire",
            shema: "Essen",
            date_de_certificat: maintenant.toISOString().split('T')[0], // Date d'aujourd'hui
            date_de_naissance: patientDateNaissance,
            animal: patientAnimal,
            heure_creation: maintenant.toTimeString().split(' ')[0] // Ajouter l'heure pour éviter les doublons
        };
        
        // Envoyer les données à l'API
        fetch('http://localhost:5000/api/ajouter_antirabique', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Certificat antirabique sauvegardé avec succès!');
            } else {
                alert('Erreur lors de la sauvegarde: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur de connexion au serveur');
        });
    }

    const polycliniqueInput = document.getElementById('polyclinique');
    if (polycliniqueInput) {
        polycliniqueInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique', this.value);
        });
    }

    const polycliniqueArInput = document.getElementById('polyclinique-ar');
    if (polycliniqueArInput) {
        polycliniqueArInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique-ar', this.value);
        });
    }

    document.getElementById('printButton').addEventListener('click', function () {
        window.print();
    });
    
    document.getElementById('saveButtonessen3').addEventListener('click', function () {
        sauvegarderCertificatAntirabique();
    });
    </script> 
    </body>
    </html>
    `;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

function vaccint3(dateMorsure, poidsInput) {
    // Récupérer les informations du patient depuis le formulaire
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value || '';
    const patientDateNaissance = document.getElementById('patientDateNaissance').value || '';

    // Utiliser la date de naissance si disponible, sinon l'âge
    let ageInfo = '';
    if (patientDateNaissance) {
        ageInfo = patientDateNaissance;
    } else if (patientAge) {
        ageInfo = patientAge;
    } else {
        ageInfo = '[Date de naissance]';
    }

    // Calculer le SAR (Sérum Antirabique) en fonction du poids
    const poids = parseFloat(poidsInput) || 0;
    let sar = poids / 5;
    if (poids >= 75) {
        sar = 15;
    }
    sar = Math.round(sar * 100) / 100;

    // Calculer les dates pour le schéma Tissulaire avec SAR (J0, J3, J7, J14, J24,J34, J90)




    const dateJour0 = new Date(dateMorsure);
    const dateJour1 = new Date(dateJour0);
    dateJour1.setDate(dateJour0.getDate() + 1);
    const dateJour2 = new Date(dateJour0);
    dateJour2.setDate(dateJour0.getDate() + 2);
    const dateJour3 = new Date(dateJour0);
    dateJour3.setDate(dateJour0.getDate() + 3);
    const dateJour4 = new Date(dateJour0);
    dateJour4.setDate(dateJour0.getDate() + 4);
    const dateJour5 = new Date(dateJour0);
    dateJour5.setDate(dateJour0.getDate() + 5);
    const dateJour6 = new Date(dateJour0);
    dateJour6.setDate(dateJour0.getDate() + 6);
    const dateJour10 = new Date(dateJour0);
    dateJour10.setDate(dateJour0.getDate() + 10);
    const dateJour14 = new Date(dateJour0);
    dateJour14.setDate(dateJour0.getDate() + 14);
    const dateJour24 = new Date(dateJour0);
    dateJour24.setDate(dateJour0.getDate() + 24);
    const dateJour34 = new Date(dateJour0);
    dateJour34.setDate(dateJour0.getDate() + 34);
    const dateJour90 = new Date(dateJour0);
    dateJour90.setDate(dateJour0.getDate() + 90);

    // Formatage des dates
    const formatDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;


    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";
    const animal = "chien"; // Animal en cause (valeur par défaut)

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    // Générer le certificat Vaccin T Schema 3
    const certificatContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
    <meta charset="UTF-8">
    <title>Certificat Antirabique - Vaccin T Schema 3 (Tissulaire avec SAR)</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f9f9f9;
    }
    .certificat {
        background-color: white;
        border: 1px solid #ddd;
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        margin-top: 60px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        text-align: center;
        color: #333;
        text-decoration: underline;
        font-size: 16px;
    }
    h2 {
        text-align: center;
        color: #555;
        font-size: 10px;
        margin-top: 5px;
        margin-bottom: 15px;
    }
    p {
        line-height: 1.5;
        color: #555;
    }
    .small-text {
        font-size: 12px;
    }
    .print-button {
        text-align: center;
        margin-top: 20px;
    }
    .print-button button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .print-button button:hover {
        background-color: #0056b3;
    }
    @media print {
        @page {
            size: A5;
            margin: 0.2cm 0.2cm 0.2cm 0.2cm;
        }
        body {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10pt !important;
            background-color: white;
        }
        .certificat {
            padding: 2px 8px !important;
            max-width: 100% !important;
            border: none;
            box-shadow: none;
            margin-top: 0;
        }
        h1 {
            font-size: 14pt !important;
            margin: 5px 0 !important;
            margin-top: 2cm !important;
        }
        h2 {
            font-size: 12pt !important;
            margin: 3px 0 !important;
        }
        p {
            font-size: 9pt !important;
            margin: 2px 0 !important;
            line-height: 1.2 !important;
        }
        input[type="text"],
        input[type="date"],
        textarea {
            border: none !important;
            background: none !important;
            box-shadow: none !important;
            outline: none !important;
            font-size: 9pt !important;
        }
        input[type="text"]:focus,
        input[type="date"]:focus,
        textarea:focus {
            border: none !important;
            outline: none !important;
        }
        .print-button {
            display: none;
        }
        .docteur {
            font-weight: bold;
            font-size: 14pt !important;
            margin-right: 50px;
        }
        /* Additional space optimization */
        * {
            margin-top: 0 !important;
            margin-bottom: 2px !important;
        }
    }
    </style>
    </head>
    <body>
   ${enteteContent}

    <div class="certificat">
        <h1>Schéma Antirabique - Tissulaire avec SAR</h1>
        <h2>Selon l'instruction N16 du 15 Juillet 2024 relative à la conduite à tenir devant un risque rabique</h2>
        <p>
        NOM : <strong><input type="text" value="${patientNomPrenom}" style="width: auto;"></strong><br>
        Date de naissance : <strong><input type="text" value="${ageInfo}" style="width: auto;"></strong><br>
        Animal en cause : <strong><input type="text" value="${animal}" style="width: auto;"></strong><br>
        Poids : <strong><input type="text" value="${poidsInput} kg" style="width: auto;"></strong><br>
        SAR : <strong><input type="text" value="${sar} cc" style="width: auto;"></strong><br>
		
        </p>
        <p>
         <br>
          <span style="font-size: smaller;">Classe 03, schéma choisi : vaccin tissulaire / avec SAR</span><br><br>
        
Jour 0 : <input type="date" id="dateJour0" value="${formatDate(dateJour0)}" readonly> <span class="small-text">( les 07 premiers jours les inj s/cutanée péri-ombilicale)</span><br>
Jour 1 : <input type="date" id="dateJour1" value="${formatDate(dateJour1)}" readonly><br>
Jour 2 : <input type="date" id="dateJour2" value="${formatDate(dateJour2)}" readonly><br>
Jour 3 : <input type="date" id="dateJour3" value="${formatDate(dateJour3)}" readonly><br>
Jour 4 : <input type="date" id="dateJour4" value="${formatDate(dateJour4)}" readonly><br>
Jour 5 : <input type="date" id="dateJour5" value="${formatDate(dateJour5)}" readonly><br>
Jour 6 : <input type="date" id="dateJour6" value="${formatDate(dateJour6)}" readonly><br>
=========== les rappeles en ID dans dans les av bras=====<br>
Jour 10 : <input type="date" id="dateJour10" value="${formatDate(dateJour10)}" readonly><br>
Jour 14 : <input type="date" id="dateJour14" value="${formatDate(dateJour14)}" readonly><br>
Jour 24 : <input type="date" id="dateJour24" value="${formatDate(dateJour24)}" readonly><br>
Jour 34 : <input type="date" id="dateJour34" value="${formatDate(dateJour34)}" readonly><br>
Jour 90 : <input type="date" id="dateJour90" value="${formatDate(dateJour90)}" readonly><br>
<span class="small-text">en cas d'âge <05ans la dose sera 1/2 amp( 01 ml)</span><br>
        </p>
        <p style="text-align: right; margin-top: 30px;">
        Medecin traitant <br>
        <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp&nbsp&nbsp&nbsp;
        </p>
    </div>

    <div class="print-button">
        <button id="printButton">Imprimer le schéma</button>
		<button id="saveButtonT3">Sauvegarder</button>
    </div>
 

    <script>
    function sauvegarderCertificatAntirabique() {
        // Récupérer les informations du patient depuis les champs du certificat affiché
        const inputs = document.querySelectorAll('input[type="text"]');
        const patientNomPrenom = inputs[0] ? inputs[0].value : ''; // Premier input = NOM
        const patientDateNaissance = inputs[1] ? inputs[1].value : ''; // Deuxième input = Date de naissance
        const patientAnimal = inputs[2] ? inputs[2].value : 'chien'; // Troisième input = Animal
        const docteurSpan = document.querySelector('.docteur');
        const docteur = docteurSpan ? docteurSpan.textContent.replace('Dr ', '').trim() : '';
        
        // Préparer les données pour l'API
        const maintenant = new Date();
        const data = {
            nom: patientNomPrenom.split(' ').slice(0, -1).join(' ').trim() || patientNomPrenom, // Extraire le nom
            prenom: patientNomPrenom.split(' ').slice(-1).join(' ').trim() || '', // Extraire le prénom
            medecin: docteur,
            classe: "classe03",
            type_de_vaccin: "Tissulaire",
            shema: "avec SAR",
            date_de_certificat: maintenant.toISOString().split('T')[0], // Date d'aujourd'hui
            date_de_naissance: patientDateNaissance,
            animal: patientAnimal,
            heure_creation: maintenant.toTimeString().split(' ')[0] // Ajouter l'heure pour éviter les doublons
        };
        
        // Envoyer les données à l'API
        fetch('http://localhost:5000/api/ajouter_antirabique', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Certificat antirabique sauvegardé avec succès!');
            } else {
                alert('Erreur lors de la sauvegarde: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur de connexion au serveur');
        });
    }

    const polycliniqueInput = document.getElementById('polyclinique');
    if (polycliniqueInput) {
        polycliniqueInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique', this.value);
        });
    }

    const polycliniqueArInput = document.getElementById('polyclinique-ar');
    if (polycliniqueArInput) {
        polycliniqueArInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique-ar', this.value);
        });
    }

    document.getElementById('printButton').addEventListener('click', function () {
        window.print();
    });
    
    document.getElementById('saveButtonT3').addEventListener('click', function () {
        sauvegarderCertificatAntirabique();
    });
    </script> 
    </body>
    </html>
    `;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

function risqueHemorragique3(dateMorsure, poidsInput) {
    // Récupérer les informations du patient depuis le formulaire
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value || '';
    const patientDateNaissance = document.getElementById('patientDateNaissance').value || '';

    // Utiliser la date de naissance si disponible, sinon l'âge
    let ageInfo = '';
    if (patientDateNaissance) {
        ageInfo = patientDateNaissance;
    } else if (patientAge) {
        ageInfo = patientAge;
    } else {
        ageInfo = '[Date de naissance]';
    }

    // Calculer le SAR (Sérum Antirabique) en fonction du poids
    const poids = parseFloat(poidsInput) || 0;
    let sar = poids / 5;
    if (poids >= 75) {
        sar = 15;
    }
    sar = Math.round(sar * 100) / 100;

    // Calculer les dates pour le schéma Risque Hémorragique (J0, J3, J7)
    const dateJour0 = new Date(dateMorsure);
    const dateJour3 = new Date(dateJour0);
    dateJour3.setDate(dateJour0.getDate() + 3);
    const dateJour7 = new Date(dateJour0);
    dateJour7.setDate(dateJour0.getDate() + 7);


    // Fonction pour formater la date
    const formatDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const dateFormattedJour0 = formatDate(dateJour0);
    const dateFormattedJour3 = formatDate(dateJour3);
    const dateFormattedJour7 = formatDate(dateJour7);


    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";
    const animal = "chien"; // Animal en cause (valeur par défaut)

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    // Générer le certificat Risque Hémorragique 3
    const certificatContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
    <meta charset="UTF-8">
    <title>Certificat Antirabique - Risque Hémorragique 3</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f9f9f9;
    }
    .certificat {
        background-color: white;
        border: 1px solid #ddd;
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        margin-top: 60px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        text-align: center;
        color: #333;
        text-decoration: underline;
        font-size: 16px;
    }
    h2 {
        text-align: center;
        color: #555;
        font-size: 10px;
        margin-top: 5px;
        margin-bottom: 15px;
    }
    p {
        line-height: 1.5;
        color: #555;
    }
    .small-text {
        font-size: 12px;
    }
    .print-button {
        text-align: center;
        margin-top: 20px;
    }
    .print-button button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .print-button button:hover {
        background-color: #0056b3;
    }
    @media print {
        @page {
            size: A5;
            margin: 0.2cm 0.2cm 0.2cm 0.2cm;
        }
        body {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10pt !important;
            background-color: white;
        }
        .certificat {
            padding: 2px 8px !important;
            max-width: 100% !important;
            border: none;
            box-shadow: none;
            margin-top: 0;
        }
        h1 {
            font-size: 14pt !important;
            margin: 5px 0 !important;
            margin-top: 2cm !important;
        }
        h2 {
            font-size: 12pt !important;
            margin: 3px 0 !important;
        }
        p {
            font-size: 9pt !important;
            margin: 2px 0 !important;
            line-height: 1.2 !important;
        }
        input[type="text"],
        input[type="date"],
        textarea {
            border: none !important;
            background: none !important;
            box-shadow: none !important;
            outline: none !important;
            font-size: 9pt !important;
        }
        input[type="text"]:focus,
        input[type="date"]:focus,
        textarea:focus {
            border: none !important;
            outline: none !important;
        }
        .print-button {
            display: none;
        }
        .docteur {
            font-weight: bold;
            font-size: 14pt !important;
            margin-right: 50px;
        }
        /* Additional space optimization */
        * {
            margin-top: 0 !important;
            margin-bottom: 2px !important;
        }
    }
    </style>
    </head>
    <body>
   ${enteteContent}

    <div class="certificat">
        <h1>Schéma Antirabique - Risque Hémorragique/Qte Limitées (Voie Intradermique)</h1>
        <h2>Selon l'instruction N16 du 15 Juillet 2024 relative à la conduite à tenir devant un risque rabique</h2>
        <p>
        NOM : <strong><input type="text" value="${patientNomPrenom}" style="width: auto;"></strong><br>
        Date de naissance : <strong><input type="text" value="${ageInfo}" style="width: auto;"></strong><br>
        Animal en cause : <strong><input type="text" value="${animal}" style="width: auto;"></strong><br>
        Poids : <strong><input type="text" value="${poidsInput} kg" style="width: auto;"></strong><br>
        SAR : <strong><input type="text" value="${sar} cc" style="width: auto;"></strong><br>
        </p>
        <p>
         <br>
         <span class="small-text">Schéma adapté pour patient à  risque hémorragique ou quantités limitées</span>
		<br>
        </p>
        <p>
         <strong>Personne sans antécédent de vaccination:</strong><br>
         Un total de six doses : 2 doses en deux [2] sites différents<br><br>
         Jour 0 : <input type="date" id="dateJour0" value="${dateFormattedJour0}" readonly> ( 2 doses en ID + SAR )<br>
         Jour 3 : <input type="date" id="dateJour3" value="${dateFormattedJour3}" readonly> ( 2 doses en ID )<br>
         Jour 7 : <input type="date" id="dateJour7" value="${dateFormattedJour7}" readonly> ( 2 doses en ID ))<br>
        
         <br><br>
       NB: 01 dose =0.1ml
        </p>
        <p style="text-align: right; margin-top: 30px;">
        Medecin traitant <br>
        <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp&nbsp&nbsp&nbsp;
        </p>
    </div>

    <div class="print-button">
        <button id="printButton">Imprimer le schéma</button>
		<button id="saveButtonRh">Sauvegarder</button>
    </div>
 
    <script>
    function sauvegarderCertificatAntirabique() {
        // Récupérer les informations du patient depuis les champs du certificat affiché
        const inputs = document.querySelectorAll('input[type="text"]');
        const patientNomPrenom = inputs[0] ? inputs[0].value : ''; // Premier input = NOM
        const patientDateNaissance = inputs[1] ? inputs[1].value : ''; // Deuxième input = Date de naissance
        const patientAnimal = inputs[2] ? inputs[2].value : 'chien'; // Troisième input = Animal
        const docteurSpan = document.querySelector('.docteur');
        const docteur = docteurSpan ? docteurSpan.textContent.replace('Dr ', '').trim() : '';
        
        // Préparer les données pour l'API
        const maintenant = new Date();
        const data = {
            nom: patientNomPrenom.split(' ').slice(0, -1).join(' ').trim() || patientNomPrenom, // Extraire le nom
            prenom: patientNomPrenom.split(' ').slice(-1).join(' ').trim() || '', // Extraire le prénom
            medecin: docteur,
            classe: "classe03",
            type_de_vaccin: "Cellulaire",
            shema: "risqueHemorragique3",
            date_de_certificat: maintenant.toISOString().split('T')[0], // Date d'aujourd'hui
            date_de_naissance: patientDateNaissance,
            animal: patientAnimal,
            heure_creation: maintenant.toTimeString().split(' ')[0] // Ajouter l'heure pour éviter les doublons
        };
        
        // Envoyer les données à l'API
        fetch('http://localhost:5000/api/ajouter_antirabique', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Certificat antirabique sauvegardé avec succès!');
            } else {
                alert('Erreur lors de la sauvegarde: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur de connexion au serveur');
        });
    }

    const polycliniqueInput = document.getElementById('polyclinique');
    if (polycliniqueInput) {
        polycliniqueInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique', this.value);
        });
    }

    const polycliniqueArInput = document.getElementById('polyclinique-ar');
    if (polycliniqueArInput) {
        polycliniqueArInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique-ar', this.value);
        });
    }

    document.getElementById('printButton').addEventListener('click', function () {
        window.print();
    });
    
    document.getElementById('saveButtonRh').addEventListener('click', function () {
        sauvegarderCertificatAntirabique();
    });
    </script> 
    </body>
    </html>
    `;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

function prophylaxiePreExpositionSchema1Classe3(dateMorsure, poidsInput) {
    // Récupérer les informations du patient depuis le formulaire
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value || '';
    const patientDateNaissance = document.getElementById('patientDateNaissance').value || '';

    // Utiliser la date de naissance si disponible, sinon l'âge
    let ageInfo = '';
    if (patientDateNaissance) {
        ageInfo = patientDateNaissance;
    } else if (patientAge) {
        ageInfo = patientAge;
    } else {
        ageInfo = '[Date de naissance]';
    }

    // Calculer le SAR (Sérum Antirabique) en fonction du poids
    const poids = parseFloat(poidsInput) || 0;
    let sar = poids / 5;
    if (poids >= 75) {
        sar = 15;
    }
    sar = Math.round(sar * 100) / 100;

    // Calculer les dates pour le schéma ATCD Vaccinaux Schéma 1 (J0, J3, J7, J14)
    const dateJour0 = new Date(dateMorsure);
    const datePlus3 = new Date(dateJour0);
    datePlus3.setDate(dateJour0.getDate() + 3);
    const datePlus7 = new Date(dateJour0);
    datePlus7.setDate(dateJour0.getDate() + 7);
    const datePlus14 = new Date(dateJour0);
    datePlus14.setDate(dateJour0.getDate() + 14);

    const dateFormattedJour0 = `${dateJour0.getFullYear()}-${String(dateJour0.getMonth() + 1).padStart(2, '0')}-${String(dateJour0.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus3 = `${datePlus3.getFullYear()}-${String(datePlus3.getMonth() + 1).padStart(2, '0')}-${String(datePlus3.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus7 = `${datePlus7.getFullYear()}-${String(datePlus7.getMonth() + 1).padStart(2, '0')}-${String(datePlus7.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus14 = `${datePlus14.getFullYear()}-${String(datePlus14.getMonth() + 1).padStart(2, '0')}-${String(datePlus14.getDate()).padStart(2, '0')}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";
    const animal = "chien"; // Animal en cause (valeur par défaut)

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    // Générer le certificat ATCD Vaccinaux Schéma 1
    const certificatContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
    <meta charset="UTF-8">
    <title>Certificat Antirabique - ATCD Vaccinaux Schéma 1 (Classe 3)</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f9f9f9;
    }
    .certificat {
        background-color: white;
        border: 1px solid #ddd;
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        margin-top: 60px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        text-align: center;
        color: #333;
        text-decoration: underline;
        font-size: 16px;
    }
    h2 {
        text-align: center;
        color: #555;
        font-size: 10px;
        margin-top: 5px;
        margin-bottom: 15px;
    }
    p {
        line-height: 1.5;
        color: #555;
    }
    .small-text {
        font-size: 12px;
    }
    .print-button {
        text-align: center;
        margin-top: 20px;
    }
    .print-button button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .print-button button:hover {
        background-color: #0056b3;
    }
    @media print {
        @page {
            size: A5;
            margin: 0.2cm 0.2cm 0.2cm 0.2cm;
        }
        body {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10pt !important;
            background-color: white;
        }
        .certificat {
            padding: 2px 8px !important;
            max-width: 100% !important;
            border: none;
            box-shadow: none;
            margin-top: 0;
        }
        h1 {
            font-size: 14pt !important;
            margin: 5px 0 !important;
            margin-top: 2cm !important;
        }
        h2 {
            font-size: 12pt !important;
            margin: 3px 0 !important;
        }
        p {
            font-size: 9pt !important;
            margin: 2px 0 !important;
            line-height: 1.2 !important;
        }
        input[type="text"],
        input[type="date"],
        textarea {
            border: none !important;
            background: none !important;
            box-shadow: none !important;
            outline: none !important;
            font-size: 9pt !important;
        }
        input[type="text"]:focus,
        input[type="date"]:focus,
        textarea:focus {
            border: none !important;
            outline: none !important;
        }
        .print-button {
            display: none;
        }
        .docteur {
            font-weight: bold;
            font-size: 14pt !important;
            margin-right: 50px;
        }
        /* Additional space optimization */
        * {
            margin-top: 0 !important;
            margin-bottom: 2px !important;
        }
    }
    </style>
    </head>
    <body>
   ${enteteContent}

    <div class="certificat">
        <h1>Schéma Antirabique -  Avec ATCD Vaccinaux(Schéma 1</h1>
        <h2>Selon l'instruction N16 du 15 Juillet 2024 relative à la conduite à tenir devant un risque rabique</h2>
        <p>
        NOM : <strong><input type="text" value="${patientNomPrenom}" style="width: auto;"></strong><br>
        Date de naissance : <strong><input type="text" value="${ageInfo}" style="width: auto;"></strong><br>
        Animal en cause : <strong><input type="text" value="${animal}" style="width: auto;"></strong><br>
        Poids : <strong><input type="text" value="${poidsInput} kg" style="width: auto;"></strong><br>
		<br>
       Classe 03, schéma choisi : Avec ATCD Vaccinaux (Schéma 1)<br>
       <br>
        </p>
        <p>
         <strong style="font-size: 14px;">Personne ayant reçu une prophylaxie Pré-exPosition, ou (>= 02 doses):</strong><br>
         <br><br>
         Schéma 1 : Un total de deux (2) doses<br><br>
         Jour 0 : <input type="date" id="dateJour0" value="${dateFormattedJour0}" readonly> (une (1) dose ID en un seul site)<br>
         Jour 3 : <input type="date" id="datePlus3" value="${dateFormattedPlus3}" readonly> (une (1) dose ID en un seul site)<br>
        
         <br><br>
        NB:01 dose=0,1mI
        </p>
        <p style="text-align: right; margin-top: 30px;">
        Medecin traitant <br>
        <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp&nbsp&nbsp&nbsp&nbsp;
        </p>
    </div>

    <div class="print-button">
        <button id="printButton">Imprimer le schéma</button>
		<button id="saveButtonAtcd1">Sauvegarder</button>
    </div>
    

    <script>
    function sauvegarderCertificatAntirabique() {
        // Récupérer les informations du patient depuis les champs du certificat affiché
        const inputs = document.querySelectorAll('input[type="text"]');
        const patientNomPrenom = inputs[0] ? inputs[0].value : ''; // Premier input = NOM
        const patientDateNaissance = inputs[1] ? inputs[1].value : ''; // Deuxième input = Date de naissance
        const patientAnimal = inputs[2] ? inputs[2].value : 'chien'; // Troisième input = Animal
        const docteurSpan = document.querySelector('.docteur');
        const docteur = docteurSpan ? docteurSpan.textContent.replace('Dr ', '').trim() : '';
        
        // Préparer les données pour l'API
        const maintenant = new Date();
        const data = {
            nom: patientNomPrenom.split(' ').slice(0, -1).join(' ').trim() || patientNomPrenom, // Extraire le nom
            prenom: patientNomPrenom.split(' ').slice(-1).join(' ').trim() || '', // Extraire le prénom
            medecin: docteur,
            classe: "classe03",
            type_de_vaccin: "Cellulaire",
            shema: "avec ATCD 1",
            date_de_certificat: maintenant.toISOString().split('T')[0], // Date d'aujourd'hui
            date_de_naissance: patientDateNaissance,
            animal: patientAnimal,
            heure_creation: maintenant.toTimeString().split(' ')[0] // Ajouter l'heure pour éviter les doublons
        };
        
        // Envoyer les données à l'API
        fetch('http://localhost:5000/api/ajouter_antirabique', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Certificat antirabique sauvegardé avec succès!');
            } else {
                alert('Erreur lors de la sauvegarde: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur de connexion au serveur');
        });
    }

    const polycliniqueInput = document.getElementById('polyclinique');
    if (polycliniqueInput) {
        polycliniqueInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique', this.value);
        });
    }

    const polycliniqueArInput = document.getElementById('polyclinique-ar');
    if (polycliniqueArInput) {
        polycliniqueArInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique-ar', this.value);
        });
    }

    document.getElementById('printButton').addEventListener('click', function () {
        window.print();
    });
    
    document.getElementById('saveButtonAtcd1').addEventListener('click', function () {
        sauvegarderCertificatAntirabique();
    });
    </script> 
    </body>
    </html>
    `;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

function prophylaxiePreExpositionSchema2Classe3(dateMorsure, poidsInput) {
    // Récupérer les informations du patient depuis le formulaire
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value || '';
    const patientDateNaissance = document.getElementById('patientDateNaissance').value || '';

    // Utiliser la date de naissance si disponible, sinon l'âge
    let ageInfo = '';
    if (patientDateNaissance) {
        ageInfo = patientDateNaissance;
    } else if (patientAge) {
        ageInfo = patientAge;
    } else {
        ageInfo = '[Date de naissance]';
    }

    // Calculer le SAR (Sérum Antirabique) en fonction du poids
    const poids = parseFloat(poidsInput) || 0;
    let sar = poids / 5;
    if (poids >= 75) {
        sar = 15;
    }
    sar = Math.round(sar * 100) / 100;

    // Calculer les dates pour le schéma ATCD Vaccinaux Schéma 2 (J0 uniquement)
    const dateJour0 = new Date(dateMorsure);

    const dateFormattedJour0 = `${dateJour0.getFullYear()}-${String(dateJour0.getMonth() + 1).padStart(2, '0')}-${String(dateJour0.getDate()).padStart(2, '0')}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";
    const animal = "chien"; // Animal en cause (valeur par défaut)

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    // Générer le certificat ATCD Vaccinaux Schéma 2
    const certificatContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
    <meta charset="UTF-8">
    <title>Certificat Antirabique - ATCD Vaccinaux Schéma 2 (Classe 3)</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f9f9f9;
    }
    .certificat {
        background-color: white;
        border: 1px solid #ddd;
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        margin-top: 60px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        text-align: center;
        color: #333;
        text-decoration: underline;
        font-size: 16px;
    }
    h2 {
        text-align: center;
        color: #555;
        font-size: 10px;
        margin-top: 5px;
        margin-bottom: 15px;
    }
    p {
        line-height: 1.5;
        color: #555;
    }
    .small-text {
        font-size: 12px;
    }
    .print-button {
        text-align: center;
        margin-top: 20px;
    }
    .print-button button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .print-button button:hover {
        background-color: #0056b3;
    }
    @media print {
        @page {
            size: A5;
            margin: 0.2cm 0.2cm 0.2cm 0.2cm;
        }
        body {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10pt !important;
            background-color: white;
        }
        .certificat {
            padding: 2px 8px !important;
            max-width: 100% !important;
            border: none;
            box-shadow: none;
            margin-top: 0;
        }
        h1 {
            font-size: 14pt !important;
            margin: 5px 0 !important;
            margin-top: 2cm !important;
        }
        h2 {
            font-size: 12pt !important;
            margin: 3px 0 !important;
        }
        p {
            font-size: 9pt !important;
            margin: 2px 0 !important;
            line-height: 1.2 !important;
        }
        input[type="text"],
        input[type="date"],
        textarea {
            border: none !important;
            background: none !important;
            box-shadow: none !important;
            outline: none !important;
            font-size: 9pt !important;
        }
        input[type="text"]:focus,
        input[type="date"]:focus,
        textarea:focus {
            border: none !important;
            outline: none !important;
        }
        .print-button {
            display: none;
        }
        .docteur {
            font-weight: bold;
            font-size: 14pt !important;
            margin-right: 50px;
        }
        /* Additional space optimization */
        * {
            margin-top: 0 !important;
            margin-bottom: 2px !important;
        }
    }
    </style>
    </head>
    <body>
   ${enteteContent}

    <div class="certificat">
        <h1>Schéma Antirabique - ATCD Vaccinaux Schéma 2 </h1>
        <h2>Selon l'instruction N16 du 15 Juillet 2024 relative à la conduite à tenir devant un risque rabique</h2>
        <p>
        NOM : <strong><input type="text" value="${patientNomPrenom}" style="width: auto;"></strong><br>
        Date de naissance : <strong><input type="text" value="${ageInfo}" style="width: auto;"></strong><br>
        Animal en cause : <strong><input type="text" value="${animal}" style="width: auto;"></strong><br>
        Poids : <strong><input type="text" value="${poidsInput} kg" style="width: auto;"></strong><br>
        </p>
        <p>
         <strong>Personne ayant reçu une prophylaxie Pré-exPosition, ou (≥ 02 doses):</strong><br>
         Schéma 2 : Un total de quatre (4) doses<br><br>
         Jour 0 : <input type="date" id="dateJour0" value="${dateFormattedJour0}" readonly> (une dose en ID en quatre (4) sites différents)<br>
         <br><br>
        NB: 01 dose=0,1mI
        </p>
        <p style="text-align: right; margin-top: 30px;">
        Medecin traitant <br>
        <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp&nbsp&nbsp&nbsp;
        </p>
    </div>

    <div class="print-button">
        <button id="printButton">Imprimer le schéma</button>
		<button id="saveButtonAtcd2">Sauvegarder</button>
    </div>
    

    <script>
    function sauvegarderCertificatAntirabique() {
        // Récupérer les informations du patient depuis les champs du certificat affiché
        const inputs = document.querySelectorAll('input[type="text"]');
        const patientNomPrenom = inputs[0] ? inputs[0].value : ''; // Premier input = NOM
        const patientDateNaissance = inputs[1] ? inputs[1].value : ''; // Deuxième input = Date de naissance
        const patientAnimal = inputs[2] ? inputs[2].value : 'chien'; // Troisième input = Animal
        const docteurSpan = document.querySelector('.docteur');
        const docteur = docteurSpan ? docteurSpan.textContent.replace('Dr ', '').trim() : '';
        
        // Préparer les données pour l'API
        const maintenant = new Date();
        const data = {
            nom: patientNomPrenom.split(' ').slice(0, -1).join(' ').trim() || patientNomPrenom, // Extraire le nom
            prenom: patientNomPrenom.split(' ').slice(-1).join(' ').trim() || '', // Extraire le prénom
            medecin: docteur,
            classe: "classe03",
            type_de_vaccin: "Cellulaire",
            shema: "avec ATCD 2",
            date_de_certificat: maintenant.toISOString().split('T')[0], // Date d'aujourd'hui
            date_de_naissance: patientDateNaissance,
            animal: patientAnimal,
            heure_creation: maintenant.toTimeString().split(' ')[0] // Ajouter l'heure pour éviter les doublons
        };
        
        // Envoyer les données à l'API
        fetch('http://localhost:5000/api/ajouter_antirabique', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Certificat antirabique sauvegardé avec succès!');
            } else {
                alert('Erreur lors de la sauvegarde: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur de connexion au serveur');
        });
    }

    const polycliniqueInput = document.getElementById('polyclinique');
    if (polycliniqueInput) {
        polycliniqueInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique', this.value);
        });
    }

    const polycliniqueArInput = document.getElementById('polyclinique-ar');
    if (polycliniqueArInput) {
        polycliniqueArInput.addEventListener('input', function () {
            localStorage.setItem('polyclinique-ar', this.value);
        });
    }

    document.getElementById('printButton').addEventListener('click', function () {
        window.print();
    });
    
    document.getElementById('saveButtonAtcd2').addEventListener('click', function () {
        sauvegarderCertificatAntirabique();
    });
    </script> 
    </body>
    </html>
    `;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

function genererCertificatProphylaxieImmunocompetent(dateDebut) {
    // Récupérer les informations du patient depuis le formulaire
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value || '';
    const patientDateNaissance = document.getElementById('patientDateNaissance').value || '';

    // Utiliser la date de naissance si disponible, sinon l'âge
    let ageInfo = '';
    if (patientDateNaissance) {
        ageInfo = patientDateNaissance;
    } else if (patientAge) {
        ageInfo = patientAge;
    } else {
        ageInfo = '[Date de naissance]';
    }

    // Calculer les dates pour la prophylaxie pré-exposition immunocompétent
    const dateJour0 = new Date(dateDebut);
    const datePlus7 = new Date(dateJour0);
    datePlus7.setDate(dateJour0.getDate() + 7);

    // Ajouter 12 mois (365 jours) pour le rappel
    const datePlus12Mois = new Date(dateJour0);
    datePlus12Mois.setFullYear(dateJour0.getFullYear() + 1);

    const dateFormattedJour0 = `${dateJour0.getFullYear()}-${String(dateJour0.getMonth() + 1).padStart(2, '0')}-${String(dateJour0.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus7 = `${datePlus7.getFullYear()}-${String(datePlus7.getMonth() + 1).padStart(2, '0')}-${String(datePlus7.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus12Mois = `${datePlus12Mois.getFullYear()}-${String(datePlus12Mois.getMonth() + 1).padStart(2, '0')}-${String(datePlus12Mois.getDate()).padStart(2, '0')}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    // Générer le certificat de prophylaxie pré-exposition immunocompétent
    const certificatContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
    <meta charset="UTF-8">
    <title>Prophylaxie Pré-exposition - Patient Immunocompétent</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f9f9f9;
    }
    .certificat {
        background-color: white;
        border: 1px solid #ddd;
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        margin-top: 60px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        text-align: center;
        color: #333;
        text-decoration: underline;
        font-size: 16px;
    }
    h2 {
        text-align: center;
        color: #555;
        font-size: 10px;
        margin-top: 5px;
        margin-bottom: 15px;
    }
    p {
        line-height: 1.5;
        color: #555;
    }
    .print-button {
        text-align: center;
        margin-top: 20px;
    }
    .print-button button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .print-button button:hover {
        background-color: #0056b3;
    }
    @media print {
        @page {
            size: A5;
            margin: 0.2cm 0.2cm 0.2cm 0.2cm;
        }
        body {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10pt !important;
            background-color: white;
        }
        .certificat {
            padding: 2px 8px !important;
            max-width: 100% !important;
            border: none;
            box-shadow: none;
            margin-top: 0;
        }
        h1 {
            font-size: 14pt !important;
            margin: 5px 0 !important;
            margin-top: 2cm !important;
        }
        h2 {
            font-size: 12pt !important;
            margin: 3px 0 !important;
        }
        p {
            font-size: 9pt !important;
            margin: 2px 0 !important;
            line-height: 1.2 !important;
        }
        input[type="text"],
        input[type="date"],
        textarea {
            border: none !important;
            background: none !important;
            box-shadow: none !important;
            outline: none !important;
            font-size: 9pt !important;
        }
        input[type="text"]:focus,
        input[type="date"]:focus,
        textarea:focus {
            border: none !important;
            outline: none !important;
        }
        .print-button {
            display: none;
        }
        .docteur {
            font-weight: bold;
            font-size: 14pt !important;
            margin-right: 50px;
        }
        /* Additional space optimization */
        * {
            margin-top: 0 !important;
            margin-bottom: 2px !important;
        }
    }
    </style>
    </head>
    <body>
   ${enteteContent}

    <div class="certificat">
        <h1>Prophylaxie Pré-exposition - Patient Immunocompétent</h1>
        <h2>Selon l'instruction N16 du 15 Juillet 2024 relative à la conduite à tenir devant un risque rabique</h2>
        <p>
        NOM : <strong><input type="text" value="${patientNomPrenom}" style="width: auto;"></strong><br>
        Date de naissance : <strong><input type="text" value="${ageInfo}" style="width: auto;"></strong><br>
        </p>
        <p>
         <br>
         Un total de trois (3) doses :<br><br>
         Jour 0 : <input type="date" id="dateJour0" value="${dateFormattedJour0}" readonly> (dans le deltoïde)<br>
         Jour 7 : <input type="date" id="datePlus7" value="${dateFormattedPlus7}" readonly> <br>
		 Après 12 mois : <input type="date" id="datePlus12Mois" value="${dateFormattedPlus12Mois}" readonly> <br>
        NB: 01 dose=0,1mI
        </p>
        <p style="text-align: right; margin-top: 30px;">
        Medecin traitant <br>
        <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp&nbsp&nbsp&nbsp&nbsp;
        </p>
    </div>

    <div class="print-button">
        <button id="printButton">Imprimer le schéma</button>
		<button id="saveButtonProph">Sauvegarder</button>
    </div>
    

    <script>
    document.addEventListener('DOMContentLoaded', function () {
        const polycliniqueInput = document.getElementById('polyclinique');
        if (polycliniqueInput) {
            polycliniqueInput.addEventListener('input', function () {
                localStorage.setItem('polyclinique', this.value);
            });
        }

        const polycliniqueArInput = document.getElementById('polyclinique-ar');
        if (polycliniqueArInput) {
            polycliniqueArInput.addEventListener('input', function () {
                localStorage.setItem('polyclinique-ar', this.value);
            });
        }

        document.getElementById('printButton').addEventListener('click', function () {
            window.print();
        });
    });
    </script>
    </body>
    </html>
    `;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

function demanderDateImmunoDeprime() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const modalContent = `
        <div style="background: white; padding: 20px; border-radius: 5px; text-align: center;">
            <h3>Prophylaxie Pré-exposition - Patient Immunodéprimé</h3>
            <p>Date de début de la prophylaxie :</p>
            <input type="date" id="dateDebut" value="${todayFormatted}" style="padding: 8px; margin: 10px 0;">
            <div>
                <button id="confirmDate" style="padding: 8px 16px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Confirmer</button>
            </div>
        </div>`;

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    modal.innerHTML = modalContent;

    document.body.appendChild(modal);

    modal.querySelector('#confirmDate').addEventListener('click', function () {
        const dateDebut = modal.querySelector('#dateDebut').value;

        if (!dateDebut) {
            alert("Veuillez sélectionner une date.");
            return;
        }

        document.body.removeChild(modal);
        // Appeler la fonction pour générer le certificat de prophylaxie pré-exposition pour immunodéprimé
        genererCertificatProphylaxieImmunoDeprime(dateDebut);
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function prophylaxiePreExpositionSchema3(dateMorsure) {
    // Récupérer les informations du patient depuis le formulaire
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value || '';
    const patientDateNaissance = document.getElementById('patientDateNaissance').value || '';

    // Utiliser la date de naissance si disponible, sinon l'âge
    let ageInfo = '';
    if (patientDateNaissance) {
        ageInfo = patientDateNaissance;
    } else if (patientAge) {
        ageInfo = patientAge;
    } else {
        ageInfo = '[Date de naissance]';
    }

    // Calculer les dates pour le schéma Prophylaxie Pré-exposition Schema 3
    const dateJour0 = new Date(dateMorsure);
    const datePlus7 = new Date(dateJour0);
    datePlus7.setDate(dateJour0.getDate() + 7);
    const datePlus21 = new Date(dateJour0);
    datePlus21.setDate(dateJour0.getDate() + 21);
    const datePlus90 = new Date(dateJour0);
    datePlus90.setDate(dateJour0.getDate() + 90);

    const dateFormattedJour0 = `${dateJour0.getFullYear()}-${String(dateJour0.getMonth() + 1).padStart(2, '0')}-${String(dateJour0.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus7 = `${datePlus7.getFullYear()}-${String(datePlus7.getMonth() + 1).padStart(2, '0')}-${String(datePlus7.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus21 = `${datePlus21.getFullYear()}-${String(datePlus21.getMonth() + 1).padStart(2, '0')}-${String(datePlus21.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus90 = `${datePlus90.getFullYear()}-${String(datePlus90.getMonth() + 1).padStart(2, '0')}-${String(datePlus90.getDate()).padStart(2, '0')}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    // Générer le certificat Prophylaxie Pré-exposition Schema 3
    const certificatContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
    <meta charset="UTF-8">
    <title>Prophylaxie pré-exposition (avec risque hemoragique </title>
    <style>
    body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f9f9f9;
    }
    .certificat {
        background-color: white;
        border: 1px solid #ddd;
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        margin-top: 60px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        text-align: center;
        color: #333;
        text-decoration: underline;
        font-size: 16px;
    }
    h2 {
        text-align: center;
        color: #555;
        font-size: 10px;
        margin-top: 5px;
        margin-bottom: 15px;
    }
    p {
        line-height: 1.5;
        color: #555;
    }
    .print-button {
        text-align: center;
        margin-top: 20px;
    }
    .print-button button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .print-button button:hover {
        background-color: #0056b3;
    }
    @media print {
        @page {
            size: A5;
            margin: 0.2cm 0.2cm 0.2cm 0.2cm;
        }
        body {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10pt !important;
            background-color: white;
        }
        .certificat {
            padding: 2px 8px !important;
            max-width: 100% !important;
            border: none;
            box-shadow: none;
            margin-top: 0;
        }
        h1 {
            font-size: 14pt !important;
            margin: 5px 0 !important;
            margin-top: 2cm !important;
        }
        h2 {
            font-size: 12pt !important;
            margin: 3px 0 !important;
        }
        p {
            font-size: 9pt !important;
            margin: 2px 0 !important;
            line-height: 1.2 !important;
        }
        input[type="text"],
        input[type="date"],
        textarea {
            border: none !important;
            background: none !important;
            box-shadow: none !important;
            outline: none !important;
            font-size: 9pt !important;
        }
        input[type="text"]:focus,
        input[type="date"]:focus,
        textarea:focus {
            border: none !important;
            outline: none !important;
        }
        .print-button {
            display: none;
        }
        .docteur {
            font-weight: bold;
            font-size: 14pt !important;
            margin-right: 50px;
        }
        /* Additional space optimization */
        * {
            margin-top: 0 !important;
            margin-bottom: 2px !important;
        }
    }
    </style>
    </head>
    <body>
   ${enteteContent}

    <div class="certificat">
        <h1>Prophylaxie Pré-exposition (Avec Risque Hémorragique)</h1>
        <h2>Selon l'instruction N16 du 15 Juillet 2024 relative à la conduite à tenir devant un risque rabique</h2>
        <p>
        NOM : <strong><input type="text" value="${patientNomPrenom}" style="width: auto;"></strong><br>
        Date de naissance : <strong><input type="text" value="${ageInfo}" style="width: auto;"></strong><br>
        </p>
        <p>
         <br>
         Un total de quatre (4) doses :<br><br>
         Jour 0 : <input type="date" id="dateJour0" value="${dateFormattedJour0}" readonly>  (deux [2] doses en ID en deux (2) sites différents)<br>
         Jour 7 : <input type="date" id="datePlus7" value="${dateFormattedPlus7}" readonly>  (deux [2] doses en ID en deux (2) sites différents)<br>
        
         <br><br>
        NB: 01 dose=0,1mI
        </p>
        <p style="text-align: right; margin-top: 30px;">
        Medecin traitant <br>
        <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp&nbsp&nbsp&nbsp&nbsp;
        </p>
    </div>

    <div class="print-button">
        <button id="printButton">Imprimer le schéma</button>
		<button id="saveButtonProphH">Sauvegarder</button>
    </div>
    

    <script>
    document.addEventListener('DOMContentLoaded', function () {
        const polycliniqueInput = document.getElementById('polyclinique');
        if (polycliniqueInput) {
            polycliniqueInput.addEventListener('input', function () {
                localStorage.setItem('polyclinique', this.value);
            });
        }

        const polycliniqueArInput = document.getElementById('polyclinique-ar');
        if (polycliniqueArInput) {
            polycliniqueArInput.addEventListener('input', function () {
                localStorage.setItem('polyclinique-ar', this.value);
            });
        }

        document.getElementById('printButton').addEventListener('click', function () {
            window.print();
        });
    });
    </script>
    </body>
    </html>
    `;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

// Fonction pour générer le certificat de prophylaxie pré-exposition pour patients immunodéprimés
function genererCertificatProphylaxieImmunoDeprime(dateDebut) {
    // Get patient information from the form fields
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value || '';
    const patientDateNaissance = document.getElementById('patientDateNaissance').value || '';

    // Extraire nom et prénom
    const nomPrenomArray = patientNomPrenom.split(' ');
    const nom = nomPrenomArray[nomPrenomArray.length - 1] || '';
    const prenom = nomPrenomArray.slice(0, -1).join(' ') || '';

    // Utiliser la date de naissance si disponible, sinon l'âge
    let ageInfo = '';
    if (patientDateNaissance) {
        ageInfo = patientDateNaissance;
    } else if (patientAge) {
        ageInfo = patientAge;
    } else {
        ageInfo = '[Date de naissance]';
    }

    const dateJour0 = new Date(dateDebut);
    const datePlus3 = new Date(dateJour0);
    datePlus3.setDate(dateJour0.getDate() + 3);

    const datePlus28 = new Date(dateJour0);
    datePlus28.setDate(dateJour0.getDate() + 28);

    // Ajouter 12 mois (365 jours) pour le rappel
    const datePlus12Mois = new Date(dateJour0);
    datePlus12Mois.setFullYear(dateJour0.getFullYear() + 1);

    const dateFormattedJour0 = `${dateJour0.getFullYear()}-${String(dateJour0.getMonth() + 1).padStart(2, '0')}-${String(dateJour0.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus3 = `${datePlus3.getFullYear()}-${String(datePlus3.getMonth() + 1).padStart(2, '0')}-${String(datePlus3.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus28 = `${datePlus28.getFullYear()}-${String(datePlus28.getMonth() + 1).padStart(2, '0')}-${String(datePlus28.getDate()).padStart(2, '0')}`;
    const dateFormattedPlus12Mois = `${datePlus12Mois.getFullYear()}-${String(datePlus12Mois.getMonth() + 1).padStart(2, '0')}-${String(datePlus12Mois.getDate()).padStart(2, '0')}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";

    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';
    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        enteteContent = '<div style="height: 155px;"></div>';
    }

    const certificatContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
    <meta charset="UTF-8">
    <title>Prophylaxie pré-exposition - Patient Immunodéprimé</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        padding: 14px;
        background-color: #f9f9f9;
    }
    .certificat {
        background-color: white;
        border: 1px solid #ddd;
        padding: 16px;
        max-width: 600px;
        margin: 0 auto;
        margin-top: 60px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        text-align: center;
        color: #333;
        text-decoration: underline;
        font-size: 14px;
    }
    h2 {
        text-align: center;
        color: #555;
        font-size: 10px;
        margin-top: 5px;
        margin-bottom: 15px;
    }
    p {
        line-height: 1.5;
        color: #555;
    }
    .small-text {
        font-size: 12px;
    }
    .print-button {
        text-align: center;
        margin-top: 20px;
    }
    .print-button button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .print-button button:hover {
        background-color: #0056b3;
    }
    @media print {
        @page {
            size: A5;
            margin: 0.2cm 0.2cm 0.2cm 0.2cm;
        }
        body {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10pt !important;
            background-color: white;
        }
        .certificat {
            padding: 2px 8px !important;
            max-width: 100% !important;
            border: none;
            box-shadow: none;
            margin-top: 0;
        }
        h1 {
            font-size: 14pt !important;
            margin: 5px 0 !important;
            margin-top: 2cm !important;
        }
        h2 {
            font-size: 12pt !important;
            margin: 3px 0 !important;
        }
        p {
            font-size: 9pt !important;
            margin: 2px 0 !important;
            line-height: 1.2 !important;
        }
        input[type="text"],
        input[type="date"],
        textarea {
            border: none !important;
            background: none !important;
            box-shadow: none !important;
            outline: none !important;
            font-size: 9pt !important;
        }
        input[type="text"]:focus,
        input[type="date"]:focus,
        textarea:focus {
            border: none !important;
            outline: none !important;
        }
        .print-button {
            display: none;
        }
        .docteur {
            font-weight: bold;
            font-size: 14pt !important;
            margin-right: 50px;
        }
        /* Additional space optimization */
        * {
            margin-top: 0 !important;
            margin-bottom: 2px !important;
        }
    }
    </style>
    </head>
    <body>
   ${enteteContent}

    <div class="certificat">
        <h1>Prophylaxie pré-exposition (Immunodéprimé)</h1>
        <h2>Selon l'instruction N16 du 15 Juillet 2024 relative à la conduite à tenir devant un risque rabique</h2>
        <p>
        NOM : <strong><input type="text" value="${nom} ${prenom}" style="width: auto;"></strong><br>
        Date de naissance : <strong><input type="text" value="${ageInfo}" style="width: auto;"></strong><br>
        </p>
        <p>
         <strong style="font-size: 14px;">Patient Immunodéprimé - Prophylaxie pré-exposition :</strong><br>
         Un total de quatre (4) doses :<br><br>
         Jour 0 : <input type="date" id="dateJour0" value="${dateFormattedJour0}" readonly> (dans le deltoïde)<br>
         Jour 3 : <input type="date" id="datePlus3" value="${dateFormattedPlus3}" readonly> <br>
         Jour 28 : <input type="date" id="datePlus28" value="${dateFormattedPlus28}" readonly> <br>
         Après 12 mois : <input type="date" id="datePlus12Mois" value="${dateFormattedPlus12Mois}" readonly> <br>
         <br><br>
         
        </p>
        <p style="text-align: right; margin-top: 30px;">
        Medecin traitant <br>
        <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp&nbsp&nbsp&nbsp&nbsp;
        </p>
    </div>

    <div class="print-button">
        <button id="printButton">Imprimer le schéma</button>
		<button id="saveButtonProphd">Sauvegarder</button>
    </div>
 

    <script>
    document.addEventListener('DOMContentLoaded', function () {
        const polycliniqueInput = document.getElementById('polyclinique');
        if (polycliniqueInput) {
            polycliniqueInput.addEventListener('input', function () {
                localStorage.setItem('polyclinique', this.value);
            });
        }

        const polycliniqueArInput = document.getElementById('polyclinique-ar');
        if (polycliniqueArInput) {
            polycliniqueArInput.addEventListener('input', function () {
                localStorage.setItem('polyclinique-ar', this.value);
            });
        }

        document.getElementById('printButton').addEventListener('click', function () {
            window.print();
        });
    });
    </script>
    </body>
    </html>
    `;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

function Tissulairesanssar(dateMorsure, poidsInput) {
    // Récupérer les informations du patient depuis le formulaire
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value || '';
    const patientDateNaissance = document.getElementById('patientDateNaissance').value || '';

    // Utiliser la date de naissance si disponible, sinon l'âge
    let ageInfo = '';
    if (patientDateNaissance) {
        ageInfo = patientDateNaissance;
    } else if (patientAge) {
        ageInfo = patientAge;
    } else {
        ageInfo = '[Date de naissance]';
    }

    // Calculer les dates pour le schéma Tissulaire sans SAR
    const dateJour0 = new Date(dateMorsure);
    const dateJour1 = new Date(dateJour0);
    dateJour1.setDate(dateJour0.getDate() + 1);
    const dateJour2 = new Date(dateJour0);
    dateJour2.setDate(dateJour0.getDate() + 2);
    const dateJour3 = new Date(dateJour0);
    dateJour3.setDate(dateJour0.getDate() + 3);
    const dateJour4 = new Date(dateJour0);
    dateJour4.setDate(dateJour0.getDate() + 4);
    const dateJour5 = new Date(dateJour0);
    dateJour5.setDate(dateJour0.getDate() + 5);
    const dateJour6 = new Date(dateJour0);
    dateJour6.setDate(dateJour0.getDate() + 6);
    const dateJour10 = new Date(dateJour0);
    dateJour10.setDate(dateJour0.getDate() + 10);
    const dateJour14 = new Date(dateJour0);
    dateJour14.setDate(dateJour0.getDate() + 14);
    const dateJour29 = new Date(dateJour0);
    dateJour29.setDate(dateJour0.getDate() + 29);
    const dateJour90 = new Date(dateJour0);
    dateJour90.setDate(dateJour0.getDate() + 90);

    // Fonction pour formater la date
    const formatDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";
    const animal = "chien"; // Animal en cause (valeur par défaut)

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    // Générer le certificat Tissulaire sans SAR
    const certificatContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
    <meta charset="UTF-8">
    <title>Certificat Antirabique - Tissulaire sans SAR</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f9f9f9;
    }
    .certificat {
        background-color: white;
        border: 1px solid #ddd;
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        margin-top: 60px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        text-align: center;
        color: #333;
        text-decoration: underline;
        font-size: 15px;
        margin-top: 5px;
    }
    p {
        line-height: 1.4;
        color: #555;
    }
    .print-button {
        text-align: center;
        margin-top: 20px;
    }
    .print-button button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .print-button button:hover {
        background-color: #0056b3;
    }
    @media print {
        @page {
            size: A5;
            margin: 0.2cm 0.2cm 0.2cm 0.2cm;
        }
        body {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10pt !important;
            background-color: white;
        }
        .certificat {
            padding: 2px 8px !important;
            max-width: 100% !important;
            border: none;
            box-shadow: none;
            margin-top: 0;
        }
        h1 {
            font-size: 14pt !important;
            margin: 5px 0 !important;
            margin-top: 2cm !important;
        }
        p {
            font-size: 9pt !important;
            margin: 2px 0 !important;
            line-height: 1.2 !important;
        }
        input[type="text"],
        input[type="date"],
        textarea {
            border: none !important;
            background: none !important;
            box-shadow: none !important;
            outline: none !important;
            font-size: 9pt !important;
        }
        input[type="text"]:focus,
        input[type="date"]:focus,
        textarea:focus {
            border: none !important;
            outline: none !important;
        }
        .print-button {
            display: none;
        }
        .docteur {
            font-weight: bold;
            font-size: 14pt !important;
            margin-right: 50px;
        }
        /* Additional space optimization */
        * {
            margin-top: 0 !important;
            margin-bottom: 2px !important;
        }
    }
    </style>
    </head>
    <body>
   ${enteteContent}

    <div class="certificat">
        <h1>Schéma Antirabique - Tissulaire sans SAR</h1>
        <p>
        Nom et Prenom : <strong><input type="text" value="${patientNomPrenom}" style="width: auto;"></strong><br>
        Date de naissance : <strong><input type="text" value="${ageInfo}" style="width: auto;"></strong><br>
        Animal en cause : <strong><input type="text" value="${animal}" style="width: auto;"></strong><br>
        Classe 02, schéma choisi : vaccin tissulaire / sans SAR<br>

         Jour 0 : <input type="date" id="dateJour0" value="${formatDate(dateJour0)}" readonly>( dans les 07 premiers jours les injections sous-cutanée péri ombilicale)<br>
         Jour 1 : <input type="date" id="dateJour1" value="${formatDate(dateJour1)}" readonly><br>
         Jour 2 : <input type="date" id="dateJour2" value="${formatDate(dateJour2)}" readonly><br>
         Jour 3 : <input type="date" id="dateJour3" value="${formatDate(dateJour3)}" readonly><br>
         Jour 4 : <input type="date" id="dateJour4" value="${formatDate(dateJour4)}" readonly><br>
         Jour 5 : <input type="date" id="dateJour5" value="${formatDate(dateJour5)}" readonly><br>
         Jour 6 : <input type="date" id="dateJour6" value="${formatDate(dateJour6)}" readonly><br>
         =================== les rappels en ID dans les deux bras ==================<br>
         Jour 10 : <input type="date" id="dateJour10" value="${formatDate(dateJour10)}" readonly><br>
         Jour 14 : <input type="date" id="dateJour14" value="${formatDate(dateJour14)}" readonly><br>
         Jour 29 : <input type="date" id="dateJour29" value="${formatDate(dateJour29)}" readonly><br>
         Jour 90 : <input type="date" id="dateJour90" value="${formatDate(dateJour90)}" readonly><br>
        <br>
        en cas d'âge <5ans la dose sera 1/2 amp (01 ml)<br>
        </p>
        <p style="text-align: right; margin-top: 15px;">
        Medecin traitant <br>
        <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>&nbsp&nbsp&nbsp&nbsp&nbsp;
        </p>
    </div>

    <div class="print-button">
        <button id="printButton">Imprimer le schéma</button>
		<button id="saveButtonT2">Sauvegarder</button>
    </div>
   

    <script>
    document.addEventListener('DOMContentLoaded', function () {
        const polycliniqueInput = document.getElementById('polyclinique');
        if (polycliniqueInput) {
            polycliniqueInput.addEventListener('input', function () {
                localStorage.setItem('polyclinique', this.value);
            });
        }

        const polycliniqueArInput = document.getElementById('polyclinique-ar');
        if (polycliniqueArInput) {
            polycliniqueArInput.addEventListener('input', function () {
                localStorage.setItem('polyclinique-ar', this.value);
            });
        }

        document.getElementById('printButton').addEventListener('click', function () {
            window.print();
        });
    });
    </script>
    </body>
    </html>
    `;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

// Fonction pour générer un certificat médical de circoncision
function genererCirconcision() {
    // Récupérer les informations du patient depuis les champs du formulaire
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value || '';
    const patientDateNaissance = document.getElementById('patientDateNaissance').value || '';
    const dateCertificatInput = document.getElementById('dateCertificat').value || '';
    
    // Convertir la date du format dd/mm/yyyy au format ISO (YYYY-MM-DD) pour l'utilisation interne
    let dateCertificat = '';
    if (dateCertificatInput && dateCertificatInput.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const [day, month, year] = dateCertificatInput.split('/');
        dateCertificat = `${year}-${month}-${day}`;
    } else {
        // Si la date n'est pas au bon format, utiliser la date d'aujourd'hui
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateCertificat = `${year}-${month}-${day}`;
    }

    // Diviser le nom et prénom
    let nom = '';
    let prenom = '';
    if (patientNomPrenom) {
        const parts = patientNomPrenom.split(' ');
        nom = parts[0] || '';
        prenom = parts.slice(1).join(' ') || '';
    }

    // Utiliser la date de naissance si disponible
    const dob = patientDateNaissance || '';

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    const certificatContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CERTIFICAT MÉDICAL DE CIRCONCISION</title>
    <style>
body {
font-family: Arial, sans-serif;
padding: 20px;
background-color: #f9f9f9;
}
.certificat {
background-color: white;
border: 1px solid #ddd;
padding: 20px;
max-width: 600px;
margin: 0 auto;
margin-top: 60px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h1 {
text-align: center;
color: #333;
text-decoration: underline;
font-size: 20px;
}
p {
line-height: 1.5;
color: #555;
}
.editable-field {
border-bottom: 1px dashed #666;
display: inline-block;
min-width: 50px;
min-height: 20px;
padding: 2px 4px;
margin: 0 3px;
}
.editable-area {
border: 1px solid #ddd;
border-radius: 4px;
padding: 8px;
margin: 5px 0;
width: 100%;
min-height: 20px;
resize: vertical;
overflow: hidden;
font-family: inherit;
font-size: inherit;
line-height: inherit;
}
.editable-area:focus {
outline: none;
border-color: #007bff;
}
#head {
margin-bottom: 20px;
}
#head table {
width: 100%;
border: 0px solid #000000;
padding: 4px;
margin-bottom: 15px;
}
#head td {
text-align: center;
}
.print-button {
text-align: center;
margin-top: 20px;
}
.print-button button {
padding: 10px 20px;
font-size: 16px;
background-color: #007bff;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
}
.print-button button:hover {
background-color: #0056b3;
}
@media print {
@page {
    size: A5;
    margin: 0.2cm 0.2cm 0.2cm 0.2cm;
}

body {
    margin: 0 !important;
    padding: 0 !important;
    font-size: 10pt !important;
    line-height: 1.2 !important;
    background-color: white;
}

.certificat {
    border: none;
    box-shadow: none;
    margin: 0 !important;
    padding: 2px 8px !important;
    max-width: 100% !important;
}

h1 {
    font-size: 14pt !important;
    margin: 5px 0 !important;
    margin-top: 2cm !important;
}
 .footer-note {
            margin-top: 30px;
            font-style: italic;
            text-align: center;
            font-size: 12px;
            color: #666;
        }

input[type="text"],
input[type="date"],
textarea {
    border: none !important;
    background: none !important;
    box-shadow: none !important;
    outline: none !important;
    font-size: 9pt !important;
}

input[type="text"]:focus,
input[type="date"]:focus,
textarea:focus {
    border: none !important;
    outline: none !important;
}


/* Styles existants */
.print-button {
    display: none;
}
.editable-field, .editable-area {
    border: none !important;
}

/* Additional space optimization */
* {
    margin-top: 0 !important;
    margin-bottom: 2px !important;
}

p {
    margin: 2px 0 !important;
    font-size: 9pt !important;
}
}
</style>
</head>
<body>
${enteteContent}
    <div class="certificat">
        <h1>CERTIFICAT MÉDICAL DE CIRCONCISION</h1>
        <div class="contenu-certificat" style="margin-top: 1.5cm !important;">
        <p>
            Je soussigné, Dr <input type="text" id="docteur" value="${docteur}" placeholder="" style="width: 120px;">,
             certifie que l'enfant nommé(e) <span class="editable-field" contenteditable="true" style="min-width: 180px; display: inline-block;">${nom} ${prenom}</span>,
            <span class="editable-field" contenteditable="true" style="min-width: 100px; display: inline-block;">né(e) le ${dob}</span> était récemment circoncis  . <span class="editable-field" contenteditable="true" style="min-width: 300px; display: inline-block;">Ce certificat a été délivré à son tuteur pour faire valoir ce que de droit .</span> 
        </p>
		 <div class="footer-note">
                (Ce certificat est valable que pour le dossier des oeuvres sociales)
            </div>
        <p style="text-align: right; margin-top: 30px;">
            Le <input type="text" id="dateCertificat" value="${dateCertificatInput}" style="width: 150px;">
        </p>
        <p style="text-align: right; margin-top: 30px;">
            Dont certificat<br>
            <span class="docteur" style="font-weight: bold;">Dr ${docteur}</span>
        </p>
    </div>
    <div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">
        <div style="display: flex; align-items: center; gap: 8px;">
            <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:</label>
            <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">
        </div>
        <button id="printButton">Imprimer le Certificat</button>
    </div>
    
    <script src="certificat-unified-font-size.js"></script>

</body>
</html>
`;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();

        // Attacher l'événement d'impression directement après la fermeture du document
        newWindow.onload = function () {
            const printButton = newWindow.document.getElementById('printButton');
            if (printButton) {
                printButton.addEventListener('click', function () {
                    newWindow.print();
                });
            }
        };
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

// ===================== Congé Maternité =====================

// Fonction pour capitaliser automatiquement les noms et prénoms
function capitalizeNames(text) {
    if (!text) return text;
    return text.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase());
}

// Récupérer les informations du patient
function extractInfo() {
    const nom = capitalizeNames(localStorage.getItem("nom") || "");
    const prenom = capitalizeNames(localStorage.getItem("prenom") || "");
    const dob = localStorage.getItem("dateNaissance") || "";
    const numero = localStorage.getItem("numero") || "";
    return { nom, prenom, dob, numero };
}

// Conversion d'un nombre en toutes lettres (français)
function nombreEnLettres(n) {
    n = parseInt(n, 10);
    if (isNaN(n)) return '';
    if (n === 0) return 'zéro';
    const unite = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
    const dizaine = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];
    const special = {
        71: 'soixante et onze', 72: 'soixante-douze', 73: 'soixante-treize', 74: 'soixante-quatorze',
        75: 'soixante-quinze', 76: 'soixante-seize', 77: 'soixante-dix-sept', 78: 'soixante-dix-huit',
        79: 'soixante-dix-neuf', 81: 'quatre-vingt-un', 91: 'quatre-vingt-onze', 92: 'quatre-vingt-douze',
        93: 'quatre-vingt-treize', 94: 'quatre-vingt-quatorze', 95: 'quatre-vingt-quinze',
        96: 'quatre-vingt-seize', 97: 'quatre-vingt-dix-sept', 98: 'quatre-vingt-dix-huit', 99: 'quatre-vingt-dix-neuf'
    };

    function moinsDeCent(v) {
        if (v < 20) return unite[v];
        if (special[v]) return special[v];
        const d = Math.floor(v / 10);
        const u = v % 10;
        if (d === 7) return 'soixante' + (u === 1 ? ' et ' : '-') + unite[10 + u];
        if (d === 9) return 'quatre-vingt' + (u === 1 ? '-un' : '-' + unite[10 + u]);
        if (u === 1 && d > 1) return dizaine[d] + ' et un';
        if (u === 0) return d === 8 ? 'quatre-vingts' : dizaine[d];
        return dizaine[d] + '-' + unite[u];
    }

    function troisChiffres(v) {
        const c = Math.floor(v / 100);
        const r = v % 100;
        let res = '';
        if (c > 0) {
            res += c === 1 ? 'cent' : unite[c] + ' cent';
            if (r === 0 && c > 1) res += 's';
        }
        if (r > 0) res += (res ? ' ' : '') + moinsDeCent(r);
        return res;
    }

    if (n < 100) return moinsDeCent(n);
    if (n < 1000) return troisChiffres(n);
    const m = Math.floor(n / 1000);
    const r = n % 1000;
    let res = m === 1 ? 'mille' : troisChiffres(m) + ' mille';
    if (r > 0) res += ' ' + troisChiffres(r);
    return res;
}

// Fonction pour générer un certificat de congé de maternité
function ouvrirCertificatMaternite() {
    // Récupérer les informations du patient depuis les champs du formulaire certificat.html
    const patientNomPrenom = document.getElementById('patientNomPrenom').value || '';
    const patientAge = document.getElementById('patientAge').value || '';
    const patientDateNaissance = document.getElementById('patientDateNaissance').value || '';
    const dateCertificatInput = document.getElementById('dateCertificat').value || '';

    // Extraire nom et prénom
    const nomPrenomArray = patientNomPrenom.split(' ');
    const nom = nomPrenomArray[nomPrenomArray.length - 1] || '';
    const prenom = nomPrenomArray.slice(0, -1).join(' ') || '';

    // Âge : utiliser le champ âge, sinon calculer depuis la date de naissance
    let age = '';
    const ageMatch = String(patientAge).match(/(\d+)/);
    if (ageMatch) {
        age = ageMatch[1];
    } else if (patientDateNaissance) {
        const parts = patientDateNaissance.split('/');
        if (parts.length === 3) {
            const birthDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            if (!isNaN(birthDate.getTime())) {
                const today = new Date();
                let calculatedAge = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    calculatedAge--;
                }
                age = String(calculatedAge);
            }
        }
    }

    // Date du certificat : utiliser le champ dateCertificat, sinon la date du jour
    let dateCertificat = dateCertificatInput;
    if (!dateCertificat || !dateCertificat.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        dateCertificat = `${day}/${month}/${year}`;
    }

    const polyclinique = localStorage.getItem('polyclinique') || "";
    const polycliniqueAr = localStorage.getItem('polyclinique-ar') || "";
    const docteur = localStorage.getItem('docteur') || "";

    // Vérifier le format choisi
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        // Espace vide pour garder la meme mise en page
        enteteContent = '<div style="height: 155px;"></div>';
    }

    const certificatContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CERTIFICAT DE CONGÉ DE MATERNITÉ</title>
    <style>
body {
font-family: Arial, sans-serif;
padding: 20px;
background-color: #f9f9f9;
}
.certificat {
background-color: white;
border: 1px solid #ddd;
padding: 20px;
max-width: 600px;
margin: 0 auto;
margin-top: 60px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h1 {
text-align: center;
color: #333;
text-decoration: underline;
font-size: 20px;
}
p {
line-height: 1.5;
color: #555;
}
.editable-field {
border-bottom: 1px dashed #666;
display: inline-block;
min-width: 50px;
min-height: 20px;
padding: 2px 4px;
margin: 0 3px;
}
.print-button {
text-align: center;
margin-top: 20px;
}
.print-button button {
padding: 10px 20px;
font-size: 16px;
background-color: #007bff;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
}
.print-button button:hover {
background-color: #0056b3;
}
@media print {
@page {
    size: A5;
    margin: 0.2cm 0.2cm 0.2cm 0.2cm;
}

body {
    margin: 0 !important;
    padding: 0 !important;
    font-size: 10pt !important;
    line-height: 1.2 !important;
    background-color: white;
}

.certificat {
    border: none;
    box-shadow: none;
    margin: 0 !important;
    padding: 2px 8px !important;
    max-width: 100% !important;
}

h1 {
    font-size: 14pt !important;
    margin: 5px 0 !important;
    margin-top: 2cm !important;
}

input[type="text"],
input[type="date"],
input[type="number"],
textarea {
    border: none !important;
    background: none !important;
    box-shadow: none !important;
    outline: none !important;
    font-size: 9pt !important;
}

input[type="text"]:focus,
input[type="date"]:focus,
input[type="number"]:focus,
textarea:focus {
    border: none !important;
    outline: none !important;
}

input#nbJours {
    -webkit-appearance: none;
    -moz-appearance: textfield;
    appearance: textfield;
    border: none !important;
    background: none !important;
    box-shadow: none !important;
    outline: none !important;
    text-align: center !important;
    min-width: 20px !important;
}

input#nbJours::-webkit-inner-spin-button,
input#nbJours::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input#nbJours::-moz-number-spin-box {
    -moz-appearance: none;
}

.print-button {
    display: none;
}
.editable-field, .editable-area {
    border: none !important;
}

* {
    margin-top: 0 !important;
    margin-bottom: 2px !important;
}

p {
    margin: 2px 0 !important;
    font-size: 9pt !important;
}
}
</style>
</head>
<body>
${enteteContent}
    <div class="certificat">
        <h1>CERTIFICAT DE CONGÉ DE MATERNITÉ</h1>
        <div class="contenu-certificat" style="margin-top: 1.5cm !important;">
        <p>
            Je soussigné, Dr <span class="editable-field" contenteditable="true" id="docteur">${docteur}</span>,
            certifie avoir examiné ce jour la susnommée <span class="editable-field" contenteditable="true" style="min-width: 180px; display: inline-block;">${nom} ${prenom}</span>,
            âgée de <span class="editable-field" contenteditable="true" style="min-width: 40px; display: inline-block;">${age}</span> ans,
            déclare qu'elle nécessite d'un congé de maternité de <input type="number" id="nbJours" value="98" min="0" max="9999" style="min-width: 55px; text-align: center; border: 1px solid #ccc; border-radius: 4px; padding: 2px 4px;"> Jours <span id="nbJoursLettres" style="font-style: italic;">
(Quatre-vingt-dix-huit jours)
</span> à daté du
            <span class="editable-field" contenteditable="true" style="min-width: 110px; display: inline-block;">${dateCertificat}</span>,
            sauf complication.
        </p>
        
        <p style="text-align: right; margin-top: 30px;">
            Le <input type="text" id="dateCertificat" value="${dateCertificat}" style="width: 150px;">
        </p>
        <p style="text-align: right; margin-top: 30px;">
            Dr <span style="font-weight: bold;">${docteur}</span>
        </p>
    </div>
    <div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px;">
        <div style="display: flex; align-items: center; gap: 8px;">
            <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:</label>
            <input type="number" id="fontSize" min="8" max="20" value="14" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">
        </div>
        <button id="printButton">Imprimer le Certificat</button>
    </div>
    
    <script src="certificat-unified-font-size.js"></script>

</body>
</html>
`;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();

        // Attacher l'événement d'impression directement après la fermeture du document
        newWindow.onload = function () {
            const printButton = newWindow.document.getElementById('printButton');
            if (printButton) {
                printButton.addEventListener('click', function () {
                    if (newWindow && !newWindow.closed) {
                        newWindow.print();
                    }
                });
            }

            // Mettre à jour le nombre de jours en toutes lettres quand le chiffre change
            const inputJours = newWindow.document.getElementById('nbJours');
            const noteLettres = newWindow.document.getElementById('nbJoursLettres');
            function majJoursEnLettres() {
                if (!noteLettres) return;
                const v = parseInt(inputJours.value, 10);
                if (isNaN(v) || v < 0) {
                    noteLettres.textContent = '( ... )';
                    return;
                }
                const texte = nombreEnLettres(v);
                noteLettres.textContent = '(' + texte.charAt(0).toUpperCase() + texte.slice(1) + ' jours)';
            }
            if (inputJours) {
                inputJours.addEventListener('input', majJoursEnLettres);
                inputJours.addEventListener('change', majJoursEnLettres);
            }
        };
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}

// ===================== Profil Tensionnel Hebdomadaire =====================

function genererProfilTensionnel() {
    const g = function (id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; };

    const patientNomPrenom = g('patientNomPrenom');
    const patientAge = g('patientAge');
    const patientDateNaissance = g('patientDateNaissance');
    const patientNumero = g('patientNumero');

    const escHtml = function (s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    };

    let nom = '', prenom = '';
    if (patientNomPrenom) {
        const parts = patientNomPrenom.split(/\s+/);
        nom = parts[0] || '';
        prenom = parts.slice(1).join(' ') || '';
    }

    const docteur = localStorage.getItem('docteur') || '';
    // Nom du medecin retenu pour la signature : espaces seuls = champ vide.
    const nomMedecin = String(docteur).replace(/\s+/g, ' ').trim();
    // Sans nom, on n'affiche rien du tout (pas de "Dr" isole) et on n'ajoute
    // pas de "Dr" en double si le nom est deja enregistre avec ce prefixe.
    // '&nbsp;' reserve la hauteur de la ligne pour que la mise en page reste
    // identique que le nom du medecin soit saisi ou non.
    const signatureMedecin = !nomMedecin ? ''
        : (/^dr\.?\s/i.test(nomMedecin)
            ? escHtml(nomMedecin)
            : 'Dr ' + escHtml(nomMedecin));
    const avecEntete = localStorage.getItem('certificatFormat') === 'avecEntete';
    const enteteContent = avecEntete ? generateHeader() : '<div style="height: 155px;"></div>';

    // Date initiale de la semaine : aujourd'hui + 1 jour par defaut.
    // Elle est ecrite dans la 1re ligne du tableau (colonne Date) et reste
    // modifiable via le calendrier de la barre d'outils, masque a l'impression.
    const maintenant = new Date();
    const startDate = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate() + 1);

    const NB_JOURS = 7;
    const fmtFr = function (d) {
        return String(d.getDate()).padStart(2, '0') + '/' +
               String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
    };

    // Champ patient : si la valeur est vide, laisse une ligne à remplir
    const champ = function (label, valeur, largeur) {
        if (valeur) {
            return '<span><strong>' + label + ' :</strong> ' + escHtml(valeur) + '</span>';
        }
        return '<span><strong>' + label + ' :</strong>' +
               '<span class="editable-field" contenteditable="true" style="min-width:' + largeur + 'px;"></span>' +
               '</span>';
    };

    // Si le nom et le prénom sont tous deux vides, on n'affiche que
    // Nom / Prénom / Âge — les champs administratifs (date de naissance, N°)
    // sont masqués pour ne pas surcharger la ligne.
    const champsInfos = (nom || prenom)
        ? champ('Nom', nom, 130) + champ('Prénom', prenom, 120) + champ('Âge', patientAge, 60) +
          champ('Né(e) le', patientDateNaissance, 90) + champ('N°', patientNumero, 80)
        : champ('Nom', nom, 130) + champ('Prénom', prenom, 120) + champ('Âge', patientAge, 60);

    let lignes = '';
    for (let i = 0; i < NB_JOURS; i++) {
        const d = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
        const cell = function (cls) {
            return '<td><input type="text" class="cell ' + cls + '" inputmode="numeric" autocomplete="off"></td>';
        };
        lignes +=
            '<tr>' +
                '<td><input type="text" class="cell date" value="' + fmtFr(d) + '" placeholder="jj/mm/aaaa" autocomplete="off"></td>' +
                cell('tas mat') + cell('tad mat') + cell('pouls mat') +
                cell('tas apr') + cell('tad apr') + cell('pouls apr') +
            '</tr>';
    }

    const certificatContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TABLEAU DES PROFILS TENSIONNELS</title>
    <style>
body {
    font-family: Arial, sans-serif;
    padding: 20px;
    background-color: #f9f9f9;
    font-size: 11pt;
}
.certificat {
    background-color: white;
    border: 1px solid #ddd;
    padding: 14px;
    margin: 0 auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
/* En-tête officiel : même rendu que les autres certificats, mais sans bordure */
#head {
    border: none !important;
    box-shadow: none !important;
    padding: 0 4px !important;
    margin-bottom: 92px !important;
}
/* L'en-tête est en font-size inline (12px) dans generateHeader() : il faut
   !important pour l'emporter. 16,5 px = même proportion que l'arrêt de travail
   (12 px sur A5) rapportée à la largeur imprimable A4 (198 mm au lieu de 144 mm). */
#head, #head div { font-size: 16.5px !important; }
h1 {
    text-align: center;
    color: #333;
    text-decoration: underline;
    font-size: 16pt;
    margin: 0 0 58px 0;
}
.info-ligne {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    font-size: 10pt;
    color: #333;
    margin-bottom: 10px;
    align-items: baseline;
}
.info-ligne strong { color: #37474f; }
/* Champ vide : laisse une ligne pour écrire à la main (ou saisie sur place) */
.info-ligne .editable-field {
    display: inline-block;
    min-width: 60px;
    min-height: 17px;
    padding: 0 3px;
    margin: 0 0 0 4px;
    border-bottom: 1px dashed #666;
    vertical-align: bottom;
}
.info-ligne .editable-field:focus {
    outline: none;
    background: #e3f2fd;
}
/* ── Tableau : règles scopingées pour ne pas toucher le tableau de l'en-tête ── */
.table-tension {
    width: 100%;
    border-collapse: collapse;
    font-size: 10pt;
    table-layout: fixed;
    background: #fff;
}
.table-tension th, .table-tension td {
    border: 1px solid #333;
    padding: 3px 4px;
    text-align: center;
    vertical-align: middle;
}
.table-tension thead th {
    background-color: #e3f2fd;
    font-weight: bold;
    padding: 5px 4px;
}
.table-tension thead tr:first-child th { background-color: #1976d2; color: #fff; font-size: 10.5pt; }
.table-tension th.groupe-apr, .table-tension td.apr { border-left: 2px solid #333; }
input.cell {
    width: 100%;
    border: none;
    background: transparent;
    text-align: center;
    font-family: inherit;
    font-size: inherit;
    padding: 4px 0;
    height: 26px;
    box-sizing: border-box;
}
input.cell:focus { outline: none; background: #e3f2fd; }
.legende {
    font-size: 8.5pt;
    color: #555;
    margin-top: 6px;
    font-style: italic;
    line-height: 1.4;
}
.observations {
    margin-top: 12px;
    font-size: 10pt;
}
.obs-box {
    border: 1px dashed #666;
    min-height: 55px;
    padding: 6px;
    font-family: inherit;
    font-size: inherit;
    line-height: 1.5;
}
.signature {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 18px;
    font-size: 10pt;
    gap: 20px;
}
.signature div { flex: 1; }
.print-button {
    text-align: center;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
}
.print-button > button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.print-button > button:hover { background-color: #0056b3; }
/* Calendrier de la date initiale : construit dans la page, donc independant
   du selecteur natif input[type=date] qui ne s'ouvre pas partout. */
.calendrier {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 50;
    margin-top: 6px;
    width: 238px;
    padding: 8px;
    background: #fff;
    border: 1px solid #bdbdbd;
    border-radius: 6px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, .18);
    font-size: 13px;
}
.calendrier[hidden] { display: none; }
.cal-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.cal-nav span { font-weight: bold; }
.cal-nav button {
    width: 26px;
    height: 26px;
    padding: 0;
    font-size: 15px;
    line-height: 1;
    color: #333;
    background: #f1f3f5;
    border: 1px solid #d3d6da;
    border-radius: 4px;
    cursor: pointer;
}
.cal-nav button:hover { background: #e2e6ea; }
.cal-semaine, .cal-jours { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.cal-semaine span { text-align: center; color: #777; font-size: 11px; padding: 2px 0; }
.cal-jour {
    padding: 5px 0;
    text-align: center;
    font-size: 12px;
    color: #333;
    background: #fff;
    border: 1px solid #e3e5e8;
    border-radius: 4px;
    cursor: pointer;
}
.cal-jour:hover { background: #e3f2fd; border-color: #90caf9; }
.cal-jour.actif { background: #007bff; border-color: #007bff; color: #fff; font-weight: bold; }
.cal-pied { display: flex; gap: 6px; margin-top: 6px; }
.cal-pied button {
    flex: 1;
    padding: 5px 0;
    font-size: 12px;
    color: #333;
    background: #f1f3f5;
    border: 1px solid #d3d6da;
    border-radius: 4px;
    cursor: pointer;
}
.cal-pied button:hover { background: #e2e6ea; }
@media print {
    @page {
        size: A4 portrait;
        margin: 0.6cm;
    }
    body {
        margin: 0 !important;
        padding: 0 !important;
        background-color: white;
        font-size: 11pt !important;
        line-height: 1.2 !important;
    }
    .certificat {
        border: none;
        box-shadow: none;
        margin: 0 !important;
        padding: 0 !important;
    }
    /* Taille de l en-tete a l impression : meme valeur que le rendu ecran,
        repetee ici pour rester garantie meme si la reggle globale est modifiee. */
    #head, #head div { font-size: 16.5px !important; }
    h1 { font-size: 15pt !important; }
    .table-tension, .table-tension th, .table-tension td,
    .info-ligne, .legende, .observations { font-size: 10pt !important; }
    input.cell {
        border: none !important;
        background: none !important;
        box-shadow: none !important;
        outline: none !important;
    }
    .table-tension, .table-tension tr { break-inside: avoid; page-break-inside: avoid; }
    .print-button { display: none !important; }
    .outil { display: none !important; }
    #calendrier { display: none !important; }
    #nbJoursTension { display: none !important; }
    .table-tension thead { display: table-header-group; }
}
</style>
</head>
<body>
${enteteContent}
<div class="certificat">
    <h1>TABLEAU DES PROFILS TENSIONNELS</h1>

    <div class="info-ligne">
        ${champsInfos}
    </div>

    <table class="table-tension">
        <thead>
            <tr>
                <th rowspan="2" style="width: 14%;">Date</th>
                <th colspan="3" style="width: 43%;">MATIN</th>
                <th colspan="3" class="groupe-apr" style="width: 43%;">APRÈS-MIDI</th>
            </tr>
            <tr>
                <th>Systolique</th>
                <th>Diastolique</th>
                <th>Pouls</th>
                <th class="groupe-apr">Systolique</th>
                <th>Diastolique</th>
                <th>Pouls</th>
            </tr>
        </thead>
        <tbody>
            ${lignes}
        </tbody>
    </table>

    <div class="legende">
        Prise de la tension artérielle en position assise, après 5 minutes de repos, bras au niveau du cœur.
        TAS = tension systolique (mmHg), TAD = tension diastolique (mmHg).
        Remplir 2 prises par jour (matin / après-midi) pendant <span id="dureeLegende">7 jours</span> consécutifs.
    </div>

    <div class="observations">
        <strong>Observations / Traitement en cours :</strong>
        <div class="obs-box" contenteditable="true"></div>
    </div>

    <div class="signature">
        <div style="text-align: right; font-weight: bold;">${signatureMedecin || '&nbsp;'}</div>
    </div>
</div>

<div class="print-button" style="display: flex; align-items: center; justify-content: center; gap: 15px; flex-wrap: wrap;">
    <div class="outil" style="display: flex; align-items: center; gap: 8px;">
        <label for="nbJoursTension" style="font-size: 14px; margin: 0;">Nombre de jours:</label>
        <input type="number" id="nbJoursTension" min="1" max="31" value="${NB_JOURS}" step="1"
               style="width: 62px; padding: 5px; text-align: center; border: 1px solid #bdbdbd; border-radius: 4px;">
    </div>
    <div class="outil" style="display: flex; align-items: center; gap: 8px; position: relative;">
        <label for="dateInitiale" style="font-size: 14px; margin: 0;">Date initiale:</label>
        <input type="text" id="dateInitiale" readonly placeholder="jj/mm/aaaa" title="Cliquer pour ouvrir le calendrier"
               style="width: 112px; padding: 5px; text-align: center; border: 1px solid #bdbdbd; border-radius: 4px; background: #fff; cursor: pointer;">
        <div id="calendrier" class="calendrier" hidden>
            <div class="cal-nav">
                <button type="button" id="calPrec" title="Mois precedent">&#8249;</button>
                <span id="calTitre"></span>
                <button type="button" id="calSuiv" title="Mois suivant">&#8250;</button>
            </div>
            <div class="cal-semaine">
                <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
            </div>
            <div id="calJours" class="cal-jours"></div>
            <div class="cal-pied">
                <button type="button" id="calAujourdhui">Aujourd hui</button>
                <button type="button" id="calDemain">Demain</button>
            </div>
        </div>
    </div>
    <div class="outil" style="display: flex; align-items: center; gap: 8px;">
        <label for="fontSize" style="font-size: 14px; margin: 0;">Taille du texte:</label>
        <input type="number" id="fontSize" min="8" max="20" value="11" style="width: 60px; padding: 5px; border: 1px solid #bdbdbd; border-radius: 4px;">
    </div>
    <button id="printButton">Imprimer le Tableau</button>
</div>

<script>
(function () {
    /* Champs "Date initiale" et "Nombre de jours" de la barre d'outils.
       Le calendrier est construit dans la page, donc il s'ouvre partout (le
       selecteur natif input[type=date] ne fonctionne pas dans tous les
       environnements). Toute la barre d'outils, calendrier compris, est
       masquee a l'impression : seuls les resultats sont imprimes. */
    var MOIS = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
                'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'];
    var NB_MIN = 1, NB_MAX = 31;

    function jj(d) { return String(d.getDate()).padStart(2, '0'); }
    function mm(d) { return String(d.getMonth() + 1).padStart(2, '0'); }
    function fr(d) { return jj(d) + '/' + mm(d) + '/' + d.getFullYear(); }

    var champ = document.getElementById('dateInitiale');
    var champNb = document.getElementById('nbJoursTension');
    var duree = document.getElementById('dureeLegende');
    var cal = document.getElementById('calendrier');
    var titre = document.getElementById('calTitre');
    var grille = document.getElementById('calJours');
    var corps = document.querySelector('.table-tension tbody');
    var dateChoisie = null;
    var vueMois = null;

    /* Nombre de jours retenu : borne a [1, 31] pour ne jamais casser le tableau. */
    function nbJours() {
        var n = parseInt(champNb ? champNb.value : '7', 10);
        if (isNaN(n)) n = 7;
        return Math.max(NB_MIN, Math.min(NB_MAX, n));
    }

    function ligneHtml(dateFr) {
        var cell = function (cls) {
            return '<td><input type="text" class="cell ' + cls + '" inputmode="numeric" autocomplete="off"></td>';
        };
        return '<tr>' +
            '<td><input type="text" class="cell date" value="' + dateFr + '" placeholder="jj/mm/aaaa" autocomplete="off"></td>' +
            cell('tas mat') + cell('tad mat') + cell('pouls mat') +
            cell('tas apr') + cell('tad apr') + cell('pouls apr') +
            '</tr>';
    }

    /* Filtre numerique + selection au focus, reattache a chaque reconstruction. */
    function brancherSaisie() {
        document.querySelectorAll('.table-tension input.cell').forEach(function (el) {
            if (el.classList.contains('date')) return;
            el.addEventListener('input', function () {
                this.value = this.value.replace(/[^0-9]/g, '');
            });
            el.addEventListener('focus', function () { this.select(); });
        });
    }

    /* Reconstruit le corps du tableau : les valeurs deja saisies sont
       conservees, les nouvelles lignes demarrent vides. */
    function construireLignes() {
        if (!corps || !dateChoisie) return;
        var saisie = [];
        corps.querySelectorAll('tr').forEach(function (tr) {
            saisie.push([].map.call(tr.querySelectorAll('input.cell'), function (i) { return i.value; }));
        });
        var n = nbJours();
        var html = '';
        for (var i = 0; i < n; i++) {
            html += ligneHtml(fr(new Date(dateChoisie.getFullYear(), dateChoisie.getMonth(), dateChoisie.getDate() + i)));
        }
        corps.innerHTML = html;
        corps.querySelectorAll('tr').forEach(function (tr, r) {
            if (!saisie[r]) return;
            var cells = tr.querySelectorAll('input.cell');
            // c = 0 est la date : elle est toujours regeneree depuis dateChoisie,
            // seule la retablir ecraserait la date affichee.
            for (var c = 1; c < cells.length; c++) {
                if (saisie[r][c]) cells[c].value = saisie[r][c];
            }
        });
        if (duree) duree.textContent = n > 1 ? n + ' jours' : '1 jour';
        brancherSaisie();
    }

    function majDates(base) {
        document.querySelectorAll('.table-tension input.cell.date').forEach(function (el, i) {
            el.value = fr(new Date(base.getFullYear(), base.getMonth(), base.getDate() + i));
        });
    }

    function choisir(d) {
        dateChoisie = d;
        vueMois = new Date(d.getFullYear(), d.getMonth(), 1);
        if (champ) champ.value = fr(d);
        construireLignes();
        fermer();
    }

    function rendre() {
        if (!grille || !vueMois) return;
        titre.textContent = MOIS[vueMois.getMonth()] + ' ' + vueMois.getFullYear();
        // getDay() renvoie 0 pour le dimanche : la semaine commence le lundi
        var decalage = (new Date(vueMois.getFullYear(), vueMois.getMonth(), 1).getDay() + 6) % 7;
        var nbJoursMois = new Date(vueMois.getFullYear(), vueMois.getMonth() + 1, 0).getDate();
        var html = '';
        for (var v = 0; v < decalage; v++) html += '<span></span>';
        for (var j = 1; j <= nbJoursMois; j++) {
            var actif = dateChoisie && dateChoisie.getDate() === j &&
                        dateChoisie.getMonth() === vueMois.getMonth() &&
                        dateChoisie.getFullYear() === vueMois.getFullYear();
            html += '<button type="button" class="cal-jour' + (actif ? ' actif' : '') + '" data-j="' + j + '">' + j + '</button>';
        }
        grille.innerHTML = html;
    }

    function ouvrir() { if (cal) { cal.hidden = false; rendre(); } }
    function fermer() { if (cal) cal.hidden = true; }

    if (champ && cal) {
        champ.addEventListener('click', function () {
            if (cal.hidden) ouvrir(); else fermer();
        });
        champ.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                ouvrir();
            }
        });
    }

    /* Valeur par defaut du tableau : aujourd'hui + 1 jour, puis le nombre de
       jours demande. Le nombre de jours est applique immediatement, comme la
       date : aucune validation n est necessaire. */
    var maintenant = new Date();
    dateChoisie = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate() + 1);
    if (champ) champ.value = fr(dateChoisie);
    if (vueMois === null) vueMois = new Date(dateChoisie.getFullYear(), dateChoisie.getMonth(), 1);
    construireLignes();

    if (champNb) {
        /* Uniquement sur "input" : "change" se declenche au blur du champ, donc
           apres un changement le premier clic dans une cellule reconstruirait
           le tableau et detruirait la cible du clic (focus et saisie perdus).
           "input" suffit et applique la valeur a chaque frappe / clic spinner. */
        champNb.addEventListener('input', construireLignes);
    }

    var prec = document.getElementById('calPrec');
    var suiv = document.getElementById('calSuiv');
    if (prec) prec.addEventListener('click', function () {
        vueMois = new Date(vueMois.getFullYear(), vueMois.getMonth() - 1, 1);
        rendre();
    });
    if (suiv) suiv.addEventListener('click', function () {
        vueMois = new Date(vueMois.getFullYear(), vueMois.getMonth() + 1, 1);
        rendre();
    });
    if (grille) grille.addEventListener('click', function (e) {
        var b = e.target.closest('.cal-jour');
        if (!b) return;
        choisir(new Date(vueMois.getFullYear(), vueMois.getMonth(), parseInt(b.getAttribute('data-j'), 10)));
    });
    var ajd = document.getElementById('calAujourdhui');
    var dem = document.getElementById('calDemain');
    if (ajd) ajd.addEventListener('click', function () {
        var n = new Date();
        choisir(new Date(n.getFullYear(), n.getMonth(), n.getDate()));
    });
    if (dem) dem.addEventListener('click', function () {
        var n = new Date();
        choisir(new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1));
    });
    document.addEventListener('click', function (e) {
        if (!cal || cal.hidden) return;
        if (cal.contains(e.target) || (champ && e.target === champ)) return;
        fermer();
    });
})();
</script>
<script src="certificat-unified-font-size.js"></script>
</body>
</html>
`;

    var newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(certificatContent);
        newWindow.document.close();
        newWindow.onload = function () {
            const printButton = newWindow.document.getElementById('printButton');
            if (printButton) {
                printButton.addEventListener('click', function () {
                    if (newWindow && !newWindow.closed) newWindow.print();
                });
            }
        };
    } else {
        console.log("Popup bloquée par le navigateur.");
    }
}
