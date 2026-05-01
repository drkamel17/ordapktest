export const runtime = 'edge';

export async function GET() {
  const config = {
    SUPABASE_URL: process.env.SUPABASE_URL || 'https://nlvrgabznsmzodnylyly.supabase.co',
    configured: true
  };
  
  return new Response(`window.ENV = ${JSON.stringify(config)};`, {
    headers: { 'Content-Type': 'application/javascript' }
  });
}