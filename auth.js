async function login() {
    return new Promise((resolve, reject) => {
      chrome.identity.launchWebAuthFlow({
        url: buildAuthUrl(),
        interactive: true
      }, async (redirectUrl) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        const params = new URLSearchParams(new URL(redirectUrl).hash.substring(1));
        const accessToken = params.get('access_token');
        const expiresIn = parseInt(params.get('expires_in'), 10);
  
        const expirationTime = Date.now() + expiresIn * 1000;
  
        await chrome.storage.local.set({ accessToken, expirationTime });
        resolve();
      });
    });
  }
  
  async function logout() {
    await chrome.storage.local.remove(['accessToken', 'expirationTime']);
  }
  
  function buildAuthUrl() {
    const clientId = '619258080818-tsq3t3csocl05f4u2336an1gmnf0rgsc.apps.googleusercontent.com';
    const redirectUri = chrome.identity.getRedirectURL();
    const scopes = ['profile', 'email'];
  
    const authUrl = `https://accounts.google.com/o/oauth2/auth` +
      `?client_id=${encodeURIComponent(clientId)}` +
      `&response_type=token` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scopes.join(' '))}` +
      `&prompt=consent`;
  
    return authUrl;
  }
  
  async function getAccessToken() {
    const { accessToken, expirationTime } = await chrome.storage.local.get(['accessToken', 'expirationTime']);
  
    if (!accessToken || Date.now() > expirationTime) {
      console.log('Access token missing or expired, relogin needed.');
      await logout();
      return null;
    }
  
    return accessToken;
  }
  
  async function getProfile() {
    const token = await getAccessToken();
    if (!token) return null;
  
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (!res.ok) {
        console.error('Failed to fetch profile, logging out.');
        await logout();
        return null;
      }
  
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }