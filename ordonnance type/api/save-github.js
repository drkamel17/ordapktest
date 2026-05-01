export const runtime = 'edge';

export async function POST(request) {
  try {
    const body = await request.json();
    const { data, message, sha } = body;
    
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const path = 'ordonnances-types.json';
    
    // Debug
    console.log('Token exists:', !!token);
    console.log('Owner:', owner);
    console.log('Repo:', repo);
    
    if (!token || !owner || !repo) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'GitHub config not set',
        env: { token: !!token, owner, repo }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
    
    const githubBody = {
      message: message || 'Update ordonnances-types.json',
      content: content,
      branch: 'main'
    };
    
    if (sha) {
      githubBody.sha = sha;
    }
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify(githubBody)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'File updated on GitHub',
        sha: result.content?.sha
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        message: result.message || 'GitHub API error',
        details: result
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
