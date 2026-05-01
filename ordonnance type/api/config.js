export const runtime = 'edge';

const DEFAULT_CONFIG = {
  SUPABASE_URL: 'https://nlvrgabznsmzodnylyly.supabase.co',
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNniDbkdgTQA5uiNqmG6TnLJ3wL4'
};

export async function GET() {
  const config = {
    SUPABASE_URL: process.env.SUPABASE_URL || DEFAULT_CONFIG.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY || DEFAULT_CONFIG.SUPABASE_KEY
  };
  
  return new Response(`window.ENV = ${JSON.stringify(config)};`, {
    headers: { 'Content-Type': 'application/javascript' }
  });
}
