const fs = require('fs');
let code = fs.readFileSync('generate_single_html.cjs', 'utf-8');

// Replace </script> inside printCardWindow
code = code.replace(/<script>window\.print\(\);<\/script>/g, "<script>window.print();<\\\\/script>");
code = code.replace(/<script>window\.print\(\);<\\\/script>/g, "<script>window.print();<\\\\/script>");
code = code.replace(/<\/script>/g, (match, offset) => {
  // If it's near window.print
  return match;
});

// Specifically in printCardWindow:
code = code.replace(/<script>window\.print\(\);.*?<\/script>/gs, "<' + 'script>window.print();<' + '/script>");

fs.writeFileSync('generate_single_html.cjs', code, 'utf-8');
console.log('Fixed script tag inside printCardWindow');
