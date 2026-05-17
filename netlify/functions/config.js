exports.handler = async (event, context) => {
  const config = {
    SUPABASE_URL: process.env.SUPABASE_URL || 'https://nlvrgabznsmzodnylyly.supabase.co',
    configured: true
  };

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/javascript',
      'Access-Control-Allow-Origin': '*'
    },
    body: `window.ENV = ${JSON.stringify(config)};`
  };
};
