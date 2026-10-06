const fs = require('fs');
const path = require('path');
const vm = require('vm');

// 1. Read db.json
const dbPath = path.join(__dirname, 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
console.log('Loaded DB: players count = ' + (dbData.players ? dbData.players.length : 0));

// 2. Read client_app.js
const clientAppJs = fs.readFileSync(path.join(__dirname, 'client_app.js'), 'utf-8');

// 3. Extract head from index.html (lines 1 to 453)
const indexContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
const scriptIndex = indexContent.indexOf('<script>');
if (scriptIndex === -1) {
  throw new Error('Could not find <script> in index.html');
}
const headHtml = indexContent.substring(0, scriptIndex);

// 4. Build full JS
const fullScript = 'const INITIAL_SEED_DB = ' + JSON.stringify(dbData) + ';\n' + clientAppJs;

// 5. Test syntax of fullScript with vm.Script
try {
  new vm.Script(fullScript);
  console.log('✓ Full JavaScript validated successfully with Node vm.Script');
} catch (err) {
  console.error('✗ Syntax Error in JavaScript:', err);
  process.exit(1);
}

// 6. Assemble complete standalone HTML
const fullHtml = headHtml + '<script>\n' + fullScript + '\n</script>\n</body>\n</html>\n';

// 7. Write outputs
const out1 = path.join(__dirname, 'index.html');
const out2 = path.join(__dirname, 'Bulbula_Amen_FC_System.html');

fs.writeFileSync(out1, fullHtml, 'utf-8');
fs.writeFileSync(out2, fullHtml, 'utf-8');

console.log('✓ Generated index.html (' + Math.round(fs.statSync(out1).size / 1024) + ' KB)');
console.log('✓ Generated Bulbula_Amen_FC_System.html (' + Math.round(fs.statSync(out2).size / 1024) + ' KB)');
