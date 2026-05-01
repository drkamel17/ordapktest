// Background script pour l'extension Chrome

let db = null;

// Initialiser la base de données IndexedDB
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CertificatsDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      db = event.target.result;
      
      // Créer les object stores pour différents types de certificats
      if (!db.objectStoreNames.contains('arretsTravail')) {
        db.createObjectStore('arretsTravail', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('prolongations')) {
        db.createObjectStore('prolongations', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('cbv')) {
        db.createObjectStore('cbv', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('antirabiques')) {
        db.createObjectStore('antirabiques', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('deces')) {
        db.createObjectStore('deces', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Sauvegarder un certificat dans IndexedDB
function saveCertificate(storeName, data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add({
      ...data,
      date_sauvegarde: new Date().toISOString()
    });
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Récupérer tous les certificats d'un type
function getCertificates(storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Initialiser la base de données au démarrage
initDB().then(() => {
  console.log('Base de données initialisée avec succès');
}).catch(error => {
  console.error('Erreur lors de l\'initialisation de la base de données:', error);
});

// Écouter les messages des pages web externes
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  console.log('Message reçu de:', sender.origin, request);
  console.log('URL de l\'expéditeur:', sender.url);
  
  // Traiter différentes actions
  if (request.action === 'getArretsTravail') {
    console.log('Traitement de getArretsTravail');
    getCertificates('arretsTravail')
      .then(data => {
        console.log('Données récupérées:', data);
        sendResponse({ success: true, data: data });
      })
      .catch(error => {
        console.error('Erreur lors de la récupération:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Garder le canal de réponse ouvert
  }
  
  if (request.action === 'addArretTravail') {
    console.log('Traitement de addArretTravail avec données:', request.arretData);
    saveCertificate('arretsTravail', request.arretData)
      .then(id => {
        console.log('Certificat sauvegardé avec ID:', id);
        sendResponse({ success: true, data: { id } });
      })
      .catch(error => {
        console.error('Erreur lors de la sauvegarde:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
  
  // Ajouter d'autres actions selon les besoins
  if (request.action === 'ajouter_arret_travail') {
    console.log('Traitement de ajouter_arret_travail avec données:', request);
    saveCertificate('arretsTravail', request)
      .then(id => {
        console.log('Arrêt de travail sauvegardé avec ID:', id);
        sendResponse({ success: true, data: { id } });
      })
      .catch(error => {
        console.error('Erreur lors de la sauvegarde:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
  
  console.log('Action non reconnue:', request.action);
  // Action par défaut
  sendResponse({ success: false, error: 'Action non reconnue: ' + request.action });
});

// Écouter les messages internes (popup, content script)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message interne reçu:', request);
  
  if (request.action === 'getData') {
    Promise.all([
      getCertificates('arretsTravail'),
      getCertificates('prolongations'),
      getCertificates('cbv')
    ]).then(([arrets, prolongations, cbv]) => {
      sendResponse({
        success: true,
        data: {
          arretsTravail: arrets,
          prolongations: prolongations,
          cbv: cbv
        }
      });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
  
  sendResponse({ success: false, error: 'Action interne non reconnue' });
});