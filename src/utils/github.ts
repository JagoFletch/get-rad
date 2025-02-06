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
      'X-GitHub-Api-Version': '2022-11-28'
    },
    body: JSON.stringify({
      event_type: `version_${type}`,
      client_payload: {
        type: type,
        message: message
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`GitHub API error:\n${JSON.stringify(errorData, null, 2)}`);
  }

  return response;
}
