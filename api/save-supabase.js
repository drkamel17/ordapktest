export const runtime = 'edge';

const DEFAULT_CONFIG = {
  SUPABASE_URL: 'https://nlvrgabznsmzodnylyly.supabase.co',
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNniDbkdgTQA5uiNqmG6TnLJ3wL4',
  WRITE_PASSWORD: 'DAOUDI'
};

async function sendResendEmail(to, subject, type, nom, situation, lien1, lien2) {
  const apiKey = process.env.RESEND_API_KEY;
  
  console.log('[DEBUG] sendResendEmail - API key presente:', !!apiKey);
  console.log('[DEBUG] sendResendEmail - Destinataire:', to);
  console.log('[DEBUG] sendResendEmail - Sujet:', subject);
  
  if (!apiKey) {
    console.log('[DEBUG] ERREUR: RESEND_API_KEY non configuree dans Vercel');
    return { success: false, message: 'RESEND_API_KEY non configuree' };
  }
  
  const bgColor = type === 'Ordonnance' ? '#ff9800' : '#9C27B0';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: ${bgColor}; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
        <h2 style="margin: 0;">📩 Nouveau message en attente</h2>
      </div>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;"><strong>Type:</strong> ${type}</p>
        <p style="font-size: 16px;"><strong>Nom:</strong> ${nom}</p>
        ${situation ? `<p style="font-size: 16px;"><strong>Situation:</strong> ${situation}</p>` : ''}
        <p style="margin-top: 20px;">Cliquez sur un des liens ci-dessous pour gerer ce message:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${lien1}" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 5px;">🔧 Ordonnances Sur Web</a>
          <br>
          <a href="${lien2}" style="display: inline-block; background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 5px;">🔧 Certificats Medicaux</a>
        </div>
      </div>
    </div>
  `;
  
  console.log('[DEBUG] Envoi requete vers Resend API...');
  
  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Dr Daoudi Notifications <onboarding@resend.dev>',
        to: to,
        subject: subject,
        html: htmlContent
      })
    });
    
    console.log('[DEBUG] Resend response status:', resendResponse.status);
    
    if (resendResponse.ok) {
      console.log('[DEBUG] Email envoye avec succes!');
      return { success: true };
    } else {
      const errorText = await resendResponse.text();
      console.log('[DEBUG] ERREUR Resend:', errorText);
      return { success: false, message: errorText };
    }
  } catch (error) {
    console.log('[DEBUG] ERREUR exception:', error.message);
    return { success: false, message: error.message };
  }
}

export async function POST(request) {
  console.log('=== SUPABASE POST: Debut ===');
  
  try {
    const body = await request.json();
    const { data, password, username, action, pendingKey, pendingId, titre, nouveauxMedicaments } = body;
    console.log('Data received:', data ? Object.keys(data).length : 0, 'ordonnances');
    
    const supabaseUrl = process.env.SUPABASE_URL || DEFAULT_CONFIG.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY || DEFAULT_CONFIG.SUPABASE_KEY;
    const writePassword = process.env.WRITE_PASSWORD;
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ success: false, message: 'Supabase config not set' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    // Action: Confirmer
    if (action === 'confirm' && pendingKey) {
      if (!password || password !== writePassword) {
        return new Response(JSON.stringify({ success: false, message: 'Mot de passe admin requis' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
      }
      
      const pendingResponse = await fetch(`${supabaseUrl}/rest/v1/ordonnances?id=eq.${pendingKey}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
      });
      
      if (!pendingResponse.ok) {
        return new Response(JSON.stringify({ success: false, message: 'Pending non trouvé' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }
      
      const pendingDataResult = await pendingResponse.json();
      if (pendingDataResult.length === 0) {
        return new Response(JSON.stringify({ success: false, message: 'Aucune donnée pending' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }
      
      const pendingData = pendingDataResult[0].data || {};
      
      const defaultResponse = await fetch(`${supabaseUrl}/rest/v1/ordonnances?id=eq.default`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
      });
      
      let defaultData = {};
      if (defaultResponse.ok) {
        const defaultResult = await defaultResponse.json();
        if (defaultResult.length > 0) {
          defaultData = defaultResult[0].data || {};
        }
      }
      
      Object.keys(pendingData).forEach(key => { defaultData[key] = pendingData[key]; });
      
      await fetch(`${supabaseUrl}/rest/v1/ordonnances?id=eq.default`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ data: defaultData, status: 'confirmed', suggested_by: null, updated_at: new Date().toISOString() })
      });
      
      await fetch(`${supabaseUrl}/rest/v1/ordonnances?id=eq.${pendingKey}`, {
        method: 'DELETE',
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
      });
      
      return new Response(JSON.stringify({ success: true, message: 'Confirme' }), { headers: { 'Content-Type': 'application/json' } });
    }
    
    // Action: Rejeter
    if (action === 'reject' && pendingKey) {
      if (!password || password !== writePassword) {
        return new Response(JSON.stringify({ success: false, message: 'Mot de passe admin requis' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
      }
      
      const response = await fetch(`${supabaseUrl}/rest/v1/ordonnances?id=eq.${pendingKey}`, {
        method: 'DELETE',
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
      });
      
      return new Response(JSON.stringify({ success: response.ok, message: response.ok ? 'Rejete' : 'Erreur' }), { headers: { 'Content-Type': 'application/json' } });
    }
    
    // Action: Modifier
    if (action === 'modify' && pendingId && titre && nouveauxMedicaments) {
      if (!password || password !== writePassword) {
        return new Response(JSON.stringify({ success: false, message: 'Mot de passe admin requis' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
      }
      
      const pendingResponse = await fetch(`${supabaseUrl}/rest/v1/ordonnances?id=eq.${pendingId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
      });
      
      if (!pendingResponse.ok) {
        return new Response(JSON.stringify({ success: false, message: 'Pending non trouvé' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }
      
      const pendingResult = await pendingResponse.json();
      if (pendingResult.length === 0) {
        return new Response(JSON.stringify({ success: false, message: 'Aucune donnée pending' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }
      
      const pendingData = pendingResult[0].data || {};
      if (pendingData && pendingData[titre]) {
        pendingData[titre] = nouveauxMedicaments;
      } else {
        return new Response(JSON.stringify({ success: false, message: 'Titre non trouvé' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }
      
      const updateResponse = await fetch(`${supabaseUrl}/rest/v1/ordonnances?id=eq.${pendingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ data: pendingData, updated_at: new Date().toISOString() })
      });
      
      return new Response(JSON.stringify({ success: updateResponse.ok, message: updateResponse.ok ? 'Modifie' : 'Erreur' }), { headers: { 'Content-Type': 'application/json' } });
    }
    
    // Sans mot de passe → sauvegarder comme pending
    if (!password && username) {
      console.log('Sauvegarde pending avec username:', username);
      
      const pendingId = `pending_${username.toLowerCase().replace(/\s+/g, '_')}`;
      
      const existingResponse = await fetch(`${supabaseUrl}/rest/v1/ordonnances?id=eq.${pendingId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
      });
      
      let pendingData = {};
      let method = 'POST';
      let url = `${supabaseUrl}/rest/v1/ordonnances`;
      
      if (existingResponse.ok) {
        const existing = await existingResponse.json();
        if (existing.length > 0) {
          pendingData = existing[0].data || {};
          method = 'PATCH';
          url = `${supabaseUrl}/rest/v1/ordonnances?id=eq.${pendingId}`;
        }
      }
      
      const defaultResponse = await fetch(`${supabaseUrl}/rest/v1/ordonnances?id=eq.default`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
      });
      
      let defaultData = {};
      if (defaultResponse.ok) {
        const defaultResult = await defaultResponse.json();
        if (defaultResult.length > 0) {
          defaultData = defaultResult[0].data || {};
        }
      }
      
      Object.keys(data).forEach(key => {
        const newKey = `${key} (par ${username})`;
        if (!defaultData[key]) {
          pendingData[newKey] = data[key];
        }
      });
      
      const finalData = {
        ...(method === 'PATCH' ? {} : { id: pendingId }),
        data: pendingData,
        status: 'pending',
        suggested_by: username,
        updated_at: new Date().toISOString()
      };
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Prefer': 'return=minimal' },
        body: JSON.stringify(finalData)
      });
      
      if (response.ok) {
        console.log('=== SUPABASE POST: Pending saved ===');
        
        const adminEmail = process.env.ADMIN_EMAIL || 'drkamel17@gmail.com';
        console.log('[DEBUG] Envoi email notification a:', adminEmail);
        
        const emailResult = await sendResendEmail(
          adminEmail,
          `Nouvelle ordonnance en attente - ${username}`,
          'Ordonnance',
          username,
          null,
          'https://ordonnances-sur-web.vercel.app/admin.html',
          'https://certificats-medicaux.vercel.app/admin.html'
        );
        
        console.log('[DEBUG] Resultat email:', emailResult);
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'pending',
          info: 'Votre enregistrement sera pris en consideration apres la confirmation de l\'admin'
        }), { headers: { 'Content-Type': 'application/json' } });
      }
      
      const error = await response.text();
      return new Response(JSON.stringify({ success: false, message: error }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    
    // Avec mot de passe → sauvegarder directement
    if (password === writePassword) {
      const response = await fetch(`${supabaseUrl}/rest/v1/ordonnances?id=eq.default`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ data: data, status: 'confirmed', suggested_by: null, updated_at: new Date().toISOString() })
      });
      
      if (response.ok) {
        return new Response(JSON.stringify({ success: true, message: 'Data saved to Supabase' }), { headers: { 'Content-Type': 'application/json' } });
      }
      
      const error = await response.text();
      return new Response(JSON.stringify({ success: false, message: error }), { status: response.status, headers: { 'Content-Type': 'application/json' } });
    }
    
    return new Response(JSON.stringify({ success: false, message: 'Mot de passe incorrect ou nom d\'utilisateur requis', requiresPassword: true }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    
  } catch (error) {
    console.log('=== SUPABASE POST: Erreur ===', error.message);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function GET(request) {
  console.log('=== SUPABASE GET: Debut ===');
  
  try {
    const supabaseUrl = process.env.SUPABASE_URL || DEFAULT_CONFIG.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY || DEFAULT_CONFIG.SUPABASE_KEY;
    const writePassword = process.env.WRITE_PASSWORD;
    const urlParams = new URL(request.url).searchParams;
    const pending = urlParams.get('pending');
    const verify = urlParams.get('verify');
    const pass = urlParams.get('pass');
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ success: false, message: 'Supabase config not set' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    // API de vérification du mot de passe admin
    if (verify === 'true' && pass) {
      const isValid = (pass === writePassword);
      return new Response(JSON.stringify({ valid: isValid }), { 
        status: isValid ? 200 : 401, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    if (pending === 'true') {
      const response = await fetch(`${supabaseUrl}/rest/v1/ordonnances?status=eq.pending`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        const usersWithData = result.map(row => ({ id: row.id, suggested_by: row.suggested_by, data: row.data || {} }));
        return new Response(JSON.stringify({ success: true, users: usersWithData }), { headers: { 'Content-Type': 'application/json' } });
      }
      
      return new Response(JSON.stringify({ success: false, message: 'Erreur' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    
    const response = await fetch(`${supabaseUrl}/rest/v1/ordonnances?id=eq.default`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
    });
    
    if (response.ok) {
      const result = await response.json();
      let data = {};
      if (result.length > 0 && result[0].data) {
        data = result[0].data;
      }
      return new Response(JSON.stringify({ success: true, data: data }), { headers: { 'Content-Type': 'application/json' } });
    } else {
      const error = await response.text();
      return new Response(JSON.stringify({ success: false, message: error }), { status: response.status, headers: { 'Content-Type': 'application/json' } });
    }
    
  } catch (error) {
    console.log('=== SUPABASE GET: Erreur ===', error.message);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}