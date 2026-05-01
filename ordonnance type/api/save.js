const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const data = req.body;
    const filePath = path.join(process.cwd(), 'ordonnances-types.json');
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    return res.status(200).json({ success: true, message: 'Fichier mis à jour' });
  } catch (error) {
    console.error('Erreur:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
