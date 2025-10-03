// Test file to check environment variables
require('dotenv').config({ path: '.env.local' });

console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('NEXTAUTH_REDIRECT_PROXY_URL:', process.env.NEXTAUTH_REDIRECT_PROXY_URL);
console.log('CODESPACE_URL:', process.env.CODESPACE_URL);
console.log('HOSTNAME:', process.env.HOSTNAME);