export const safeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const parsed = new URL(url);
    if(!['https:'].includes(parsed.protocol)) {
      return false;
    }

    const allowedHosts = ['res.cloudinary.com'];
    return allowedHosts.some(host => parsed.hostname === host);
    
  } catch {
    return false; 
  }
}