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
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Dr Daoudi Notifications <onboarding@resend.dev>',
        to: to,
        subject: subject,
        html: htmlContent
      })
    });

    return resendResponse.ok ? { success: true } : { success: false, message: await resendResponse.text() };
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
        const response = await fetch(`${supabaseUrl}/rest/v1/commentaires?status=eq.pending&order=created_at.desc`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
        });

        if (response.ok) {
          const result = await response.json();
          return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, pending: result }) };
        }

        return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Erreur' }) };
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/commentaires?status=eq.confirmed&order=created_at.desc`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
      });

      if (response.ok) {
        const result = await response.json();
        return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, commentaires: result }) };
      }

      const error = await response.text();
      return { statusCode: response.status, headers: corsHeaders, body: JSON.stringify({ success: false, message: error }) };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { nom, situation, message, action, password, commentId, nouveauMessage, reponse } = body;

      if (!supabaseUrl || !supabaseKey) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Supabase config not set' }) };
      }

      if (action === 'add' && nom && message) {
        const newId = `commentaire_${nom.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;

        const response = await fetch(`${supabaseUrl}/rest/v1/commentaires`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Prefer': 'return=minimal' },
          body: JSON.stringify({
            id: newId,
            nom: nom,
            situation: situation || 'Autre',
            message: message,
            status: 'pending',
            created_at: new Date().toISOString()
          })
        });

        if (response.ok) {
          const adminEmail = process.env.ADMIN_EMAIL || 'drkamel17@gmail.com';
          sendResendEmail(
            adminEmail,
            `Nouveau commentaire en attente - ${nom}`,
            'Commentaire',
            nom,
            situation || 'Autre',
            'https://ordonnances-sur-web.vercel.app/admin.html',
            'https://certificats-medicaux.vercel.app/admin.html'
          ).catch(err => console.log('[DEBUG] Email error:', err));

          return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, message: 'pending', info: "Votre proposition sera examinée par l'admin" }) };
        }

        const error = await response.text();
        return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ success: false, message: error }) };
      }

      if (action === 'confirm' && commentId) {
        if (!password || password !== writePassword) {
          return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Mot de passe admin requis' }) };
        }

        const response = await fetch(`${supabaseUrl}/rest/v1/commentaires?id=eq.${commentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Prefer': 'return=minimal' },
          body: JSON.stringify({ status: 'confirmed' })
        });

        return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: response.ok, message: response.ok ? 'Confirme' : 'Erreur' }) };
      }

      if (action === 'reject' && commentId) {
        if (!password || password !== writePassword) {
          return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Mot de passe admin requis' }) };
        }

        const response = await fetch(`${supabaseUrl}/rest/v1/commentaires?id=eq.${commentId}`, {
          method: 'DELETE',
          headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
        });

        return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: response.ok, message: response.ok ? 'Rejete' : 'Erreur' }) };
      }

      if (action === 'modify' && commentId && nouveauMessage) {
        if (!password || password !== writePassword) {
          return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Mot de passe admin requis' }) };
        }

        const response = await fetch(`${supabaseUrl}/rest/v1/commentaires?id=eq.${commentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Prefer': 'return=minimal' },
          body: JSON.stringify({ message: nouveauMessage })
        });

        return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: response.ok, message: response.ok ? 'Modifie' : 'Erreur' }) };
      }

      if (action === 'reply' && commentId && reponse) {
        if (!password || password !== writePassword) {
          return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Mot de passe admin requis' }) };
        }

        const response = await fetch(`${supabaseUrl}/rest/v1/commentaires?id=eq.${commentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Prefer': 'return=minimal' },
          body: JSON.stringify({ reponse_admin: reponse })
        });

        return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: response.ok, message: response.ok ? 'Reponse ajoutee' : 'Erreur' }) };
      }

      if (action === 'delete' && commentId) {
        if (!password || password !== writePassword) {
          return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Mot de passe admin requis' }) };
        }

        const response = await fetch(`${supabaseUrl}/rest/v1/commentaires?id=eq.${commentId}`, {
          method: 'DELETE',
          headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
        });

        return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: response.ok, message: response.ok ? 'Supprime' : 'Erreur' }) };
      }

      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Action non reconnue' }) };
    }

    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Method not allowed' }) };

  } catch (error) {
    console.log('=== COMMENTAIRES: Erreur ===', error.message);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ success: false, message: error.message }) };
  }
};
