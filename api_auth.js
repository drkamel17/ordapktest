/**
 * Fonction pour obtenir le token d'authentification de l'API
 * @returns {Promise<string>} - Le token d'authentification
 */
async function getApiToken() {
    // Récupérer le token d'authentification stocké dans localStorage
    let token = localStorage.getItem('api_token');
    
    if (!token) {
        // Si le token n'est pas dans le localStorage, afficher une modale pour demander le token
        token = await showTokenModal('Veuillez entrer le token d\'authentification API (trouvé dans local_api/secret_token.txt):', 'cbRNF-Ix6101HLXRnSZXN4inPCf-2yqNpi_tOy_LWcQ');
        
        if (!token) {
            throw new Error('Token d\'authentification requis');
        }
        
        // Stocker le token dans localStorage pour les prochaines utilisations
        localStorage.setItem('api_token', token);
    }
    
    return token;
}

/**
 * Fonction pour afficher une modale de saisie de token
 * @param {string} message - Le message à afficher
 * @param {string} defaultValue - La valeur par défaut
 * @returns {Promise<string|null>} - Le token saisi ou null
 */
async function showTokenModal(message, defaultValue) {
    // Vérifier si la modale existe déjà
    let modal = document.getElementById('token-modal');
    
    if (modal) {
        // Si la modale existe déjà, la supprimer
        modal.remove();
    }
    
    // Créer la modale
    modal = document.createElement('div');
    modal.id = 'token-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    // Créer le contenu de la modale de manière programmatique pour éviter CSP
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    
    // Titre
    const title = document.createElement('h3');
    title.textContent = 'Authentification requise';
    title.style.cssText = 'margin-top: 0; color: #333;';
    modalContent.appendChild(title);
    
    // Message
    const msg = document.createElement('p');
    msg.textContent = message;
    modalContent.appendChild(msg);
    
    // Input pour le token
    const tokenInput = document.createElement('input');
    tokenInput.type = 'password';
    tokenInput.id = 'token-input';
    tokenInput.placeholder = "Entrez votre token d'authentification";
    tokenInput.value = defaultValue || '';
    tokenInput.style.cssText = `
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
    `;
    modalContent.appendChild(tokenInput);
    
    // Conteneur des boutons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'text-align: right; margin-top: 15px;';
    
    // Bouton Annuler
    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancel-token-btn';
    cancelBtn.textContent = 'Annuler';
    cancelBtn.style.cssText = `
        padding: 8px 16px;
        margin-right: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: #f5f5f5;
        cursor: pointer;
    `;
    buttonContainer.appendChild(cancelBtn);
    
    // Bouton Valider
    const submitBtn = document.createElement('button');
    submitBtn.id = 'submit-token-btn';
    submitBtn.textContent = 'Valider';
    submitBtn.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background: #007bff;
        color: white;
        cursor: pointer;
    `;
    buttonContainer.appendChild(submitBtn);
    
    modalContent.appendChild(buttonContainer);
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);
    
    // Récupérer les éléments
    const modalTokenInput = document.getElementById('token-input');
    const modalSubmitBtn = document.getElementById('submit-token-btn');
    const modalCancelBtn = document.getElementById('cancel-token-btn');
    
    return new Promise((resolve) => {
        // Fonction pour fermer la modale
        const closeModal = (token = null) => {
            modal.remove();
            resolve(token);
        };
        
        // Événements pour les boutons
        modalSubmitBtn.addEventListener('click', () => {
            const token = modalTokenInput.value.trim();
            if (token) {
                closeModal(token);
            }
        });
        
        modalCancelBtn.addEventListener('click', () => {
            closeModal(null);
        });
        
        // Événement pour la touche Entrée
        modalTokenInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const token = modalTokenInput.value.trim();
                if (token) {
                    closeModal(token);
                }
            }
        });
        
        // Fermer la modale si on clique en dehors
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(null);
            }
        });
        
        // Focus sur l'input
        modalTokenInput.focus();
    });
}

/**
 * Fonction pour effectuer une requête authentifiée à l'API locale
 * @param {string} endpoint - L'endpoint de l'API
 * @param {Object} options - Les options de la requête
 * @returns {Promise<Object>} - La réponse de l'API
 */
async function apiRequest(endpoint, options = {}) {
    const token = await getApiToken();
    const url = `http://127.0.0.1:5000${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    
    const requestOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
    }
    
    return response.json();
}

/**
 * Fonction pour tester la connexion à l'API
 * @returns {Promise<boolean>} - True si la connexion est réussie
 */
async function testApiConnection() {
    try {
        const response = await apiRequest('/health');
        return response.status === 'ok';
    } catch (error) {
        console.error('Erreur de connexion à l\'API:', error);
        return false;
    }
}

// Fonction pour initialiser le script
function initApiAuth() {
    // Ajouter un événement pour supprimer la modale si la page est rechargée
    window.addEventListener('beforeunload', () => {
        const modal = document.getElementById('token-modal');
        if (modal) {
            modal.remove();
        }
    });
}

// Initialiser le script quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApiAuth);
} else {
    initApiAuth();
}