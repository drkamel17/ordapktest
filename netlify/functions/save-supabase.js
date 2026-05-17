const DEFAULT_CONFIG = {
  SUPABASE_URL: 'https://nlvrgabznsmzodnylyly.supabase.co',
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNniDbkdgTQA5uiNqmG6TnLJ3wL4'
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

async function sendResendEmail(to, subject, type, nom, situation, lien1, lien2) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('[DEBUG] ERREUR: RESEND_API_KEY non configuree');
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

    if (resendResponse.ok) {
      return { success: true };
    } else {
      const errorText = await resendResponse.text();
      return { success: false, message: errorText };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  const supabaseUrl = process.env.SUPABASE_URL || DEFAULT_CONFIG.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY || DEFAULT_CONFIG.SUPABASE_KEY;
  const writePassword = process.env.WRITE_PASSWORD;

  try {
    if (event.httpMethod === 'GET') {
      const params = event.queryStringParameters || {};
      const { pending, verify, pass } = params;

      if (!supabaseUrl || !supabaseKey) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Supabase config not set' }) };
      }

      if (verify === 'true' && pass) {
        const isValid = (pass === writePassword);
        return { statusCode: isValid ? 200 : 401, headers: corsHeaders, body: JSON.stringify({ valid: isValid }) };
      }

      if (pending === 'true') {
        const response = await fetch(`${supabaseUrl}/rest/v1/ordonnances?status=eq.pending`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
        });

        if (response.ok) {
          const result = await response.json();
          const usersWithData = result.map(row => ({ id: row.id, suggested_by: row.suggested_by, data: row.data || {} }));
          return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, users: usersWithData }) };
        }

        return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Erreur' }) };
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
        return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, data }) };
      }

      const error = await response.text();
      return { statusCode: response.status, headers: corsHeaders, body: JSON.stringify({ success: false, message: error }) };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { data, password, username, action, pendingKey, pendingId, titre, nouveauxMedicaments } = body;

      if (!supabaseUrl || !supabaseKey) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Supabase config not set' }) };
      }

      if (action === 'confirm' && pendingKey) {
        if (!password || password !== writePassword) {
          return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Mot de passe admin requis' }) };
        }

        const pendingResponse = await fetch(`${supabaseUrl}/rest/v1/ordonnances?id=eq.${pendingKey}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
        });

        if (!pendingResponse.ok) {
          return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Pending non trouvé' }) };
        }

        const pendingDataResult = await pendingResponse.json();
        if (pendingDataResult.length === 0) {
          return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Aucune donnée pending' }) };
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

        return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, message: 'Confirme' }) };
      }

      if (action === 'reject' && pendingKey) {
        if (!password || password !== writePassword) {
          return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Mot de passe admin requis' }) };
        }

        const response = await fetch(`${supabaseUrl}/rest/v1/ordonnances?id=eq.${pendingKey}`, {
          method: 'DELETE',
          headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
        });

        return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: response.ok, message: response.ok ? 'Rejete' : 'Erreur' }) };
      }

      if (action === 'modify' && pendingId && titre && nouveauxMedicaments) {
        if (!password || password !== writePassword) {
          return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Mot de passe admin requis' }) };
        }

        const pendingResponse = await fetch(`${supabaseUrl}/rest/v1/ordonnances?id=eq.${pendingId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
        });

        if (!pendingResponse.ok) {
          return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Pending non trouvé' }) };
        }

        const pendingResult = await pendingResponse.json();
        if (pendingResult.length === 0) {
          return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Aucune donnée pending' }) };
        }

        const pendingData = pendingResult[0].data || {};
        if (pendingData && pendingData[titre]) {
          pendingData[titre] = nouveauxMedicaments;
        } else {
          return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Titre non trouvé' }) };
        }

        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/ordonnances?id=eq.${pendingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Prefer': 'return=minimal' },
          body: JSON.stringify({ data: pendingData, updated_at: new Date().toISOString() })
        });

        return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: updateResponse.ok, message: updateResponse.ok ? 'Modifie' : 'Erreur' }) };
      }

      if (!password && username) {
        const pendingId = `pending_${username.toLowerCase().replace(/\s+/g, '_')}`;

        const existingResponse = await fetch(`${supabaseUrl}/rest/v1/ordonnances?id=eq.${pendingId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
        });

        let existingPendingData = {};
        let method = 'POST';
        let url = `${supabaseUrl}/rest/v1/ordonnances`;

        if (existingResponse.ok) {
          const existing = await existingResponse.json();
          if (existing.length > 0) {
            existingPendingData = existing[0].data || {};
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
            existingPendingData[newKey] = data[key];
          }
        });

        const finalData = {
          ...(method === 'PATCH' ? {} : { id: pendingId }),
          data: existingPendingData,
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
          const adminEmail = process.env.ADMIN_EMAIL || 'drkamel17@gmail.com';
          sendResendEmail(
            adminEmail,
            `Nouvelle ordonnance en attente - ${username}`,
            'Ordonnance',
            username,
            null,
            'https://ordonnances-sur-web.vercel.app/admin.html',
            'https://certificats-medicaux.vercel.app/admin.html'
          ).catch(err => console.log('[DEBUG] Email error:', err));

          return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, message: 'pending', info: "Votre enregistrement sera pris en consideration apres la confirmation de l'admin" }) };
        }

        const error = await response.text();
        return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ success: false, message: error }) };
      }

      if (password === writePassword) {
        const response = await fetch(`${supabaseUrl}/rest/v1/ordonnances?id=eq.default`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Prefer': 'return=minimal' },
          body: JSON.stringify({ data: data, status: 'confirmed', suggested_by: null, updated_at: new Date().toISOString() })
        });

        if (response.ok) {
          return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, message: 'Data saved to Supabase' }) };
        }

        const error = await response.text();
        return { statusCode: response.status, headers: corsHeaders, body: JSON.stringify({ success: false, message: error }) };
      }

      return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ success: false, message: "Mot de passe incorrect ou nom d'utilisateur requis", requiresPassword: true }) };
    }

    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Method not allowed' }) };

  } catch (error) {
    console.log('=== SUPABASE: Erreur ===', error.message);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ success: false, message: error.message }) };
  }
};
