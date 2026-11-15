const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add cache-control meta tags in <head>
const metaTarget = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">';
const metaReplacement = `${metaTarget}
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">`;

if (!html.includes('http-equiv="Cache-Control"')) {
  html = html.replace(metaTarget, metaReplacement);
}

// 2. Update version strings for modified assets
const nowVer = '20261115_v5_' + Date.now().toString().slice(-4);

html = html.replace(/href="styles\.css\?v=[^"]*"/g, `href="styles.css?v=${nowVer}"`);
html = html.replace(/src="auth\.js\?v=[^"]*"/g, `src="auth.js?v=${nowVer}"`);
html = html.replace(/src="app\.js\?v=[^"]*"/g, `src="app.js?v=${nowVer}"`);
html = html.replace(/src="bazi\.js\?v=[^"]*"/g, `src="bazi.js?v=${nowVer}"`);
html = html.replace(/src="data\/bazi-knowledge\/([^"]*)\?v=[^"]*"/g, `src="data/bazi-knowledge/$1?v=${nowVer}"`);
html = html.replace(/src="data\/jiutian-arcana-database-v2\.js\?v=[^"]*"/g, `src="data/jiutian-arcana-database-v2.js?v=${nowVer}"`);
html = html.replace(/src="data\/jiutian-cards\.js\?v=[^"]*"/g, `src="data/jiutian-cards.js?v=${nowVer}"`);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated cache-busting query strings in index.html to', nowVer);
