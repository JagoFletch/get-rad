const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const OWNER = 'JagoFletch';
const REPO = 'get-rad';

export async function createCommit(type: 'patch' | 'minor' | 'major', message: string) {
  if (!GITHUB_TOKEN) {
    throw new Error('GitHub token not found in environment variables');
  }

  const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/dispatches`, {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event_type: `version_${type}`,
      client_payload: {
        message: message
      }
    })
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  return response;
}
