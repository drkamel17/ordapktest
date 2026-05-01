export const runtime = 'edge';

const DEFAULT_CONFIG = {
  SUPABASE_URL: 'https://nlvrgabznsmzodnylyly.supabase.co',
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNniDbkdgTQA5uiNqmG6TnLJ3wL4',
  WRITE_PASSWORD: 'DAOUDI'
};

export async function POST(request) {
  console.log('=== SUPABASE POST: Debut ===');
  
  try {
    const { data, password } = await request.json();
    console.log('Data received:', Object.keys(data).length, 'ordonnances');
    console.log('Password received:', password ? 'Yes' : 'No');
    
    const writePassword = process.env.WRITE_PASSWORD || DEFAULT_CONFIG.WRITE_PASSWORD;
    console.log('Expected password:', writePassword ? 'Set' : 'Not set');
    
    if (!password || password !== writePassword) {
      console.log('Mot de passe incorrect ou manquant');
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Mot de passe incorrect',
        requiresPassword: true
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const supabaseUrl = process.env.SUPABASE_URL || DEFAULT_CONFIG.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY || DEFAULT_CONFIG.SUPABASE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('Erreur: Supabase config not set');
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Supabase config not set' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('Tentative de sauvegarde vers Supabase...');
    
    // Mettre à jour les données dans Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/ordonnances?id=eq.default`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        data: data,
        updated_at: new Date().toISOString()
      })
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      console.log('=== SUPABASE POST: Succes ===');
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Data saved to Supabase'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      const error = await response.text();
      console.log('Erreur Supabase:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Supabase error',
        details: error
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    console.log('=== SUPABASE POST: Erreur ===', error.message);
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET() {
  console.log('=== SUPABASE GET: Debut ===');
  
  try {
    const supabaseUrl = process.env.SUPABASE_URL || DEFAULT_CONFIG.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY || DEFAULT_CONFIG.SUPABASE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('Erreur: Supabase config not set');
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Supabase config not set' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('Tentative de chargement depuis Supabase...');
    
    // Récupérer les données depuis Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/ordonnances?id=eq.default`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Donnees recues:', result.length, 'lignes');
      if (result.length > 0) {
        console.log('Data:', Object.keys(result[0].data).length, 'ordonnances');
      }
      console.log('=== SUPABASE GET: Succes ===');
      return new Response(JSON.stringify({ 
        success: true, 
        data: result.length > 0 ? result[0].data : {}
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      const error = await response.text();
      console.log('Erreur Supabase:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Supabase error',
        details: error
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    console.log('=== SUPABASE GET: Erreur ===', error.message);
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
