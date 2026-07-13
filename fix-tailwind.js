const fs = require('fs');
const path = require('path');

// Update globals.css for Tailwind v4
const cssContent = `@import "tailwindcss";

@theme {
  --color-border: hsl(217.2 32.6% 17.5%);
  --color-input: hsl(217.2 32.6% 17.5%);
  --color-ring: hsl(224.3 76.3% 48%);
  --color-background: hsl(0 0% 3.9%);
  --color-foreground: hsl(0 0% 98%);
  --color-primary: hsl(217.2 91.2% 59.8%);
  --color-primary-foreground: hsl(222.2 47.4% 11.2%);
  --color-secondary: hsl(217.2 32.6% 17.5%);
  --color-secondary-foreground: hsl(210 40% 98%);
  --color-muted: hsl(217.2 32.6% 17.5%);
  --color-muted-foreground: hsl(215 20.2% 65.1%);
  --color-accent: hsl(217.2 32.6% 17.5%);
  --color-accent-foreground: hsl(210 40% 98%);
  --color-destructive: hsl(0 62.8% 30.6%);
  --color-destructive-foreground: hsl(210 40% 98%);
  --color-card: hsl(0 0% 5.9%);
  --color-card-foreground: hsl(0 0% 98%);
  --color-popover: hsl(0 0% 5.9%);
  --color-popover-foreground: hsl(0 0% 98%);
  --radius: 0.5rem;
}

* {
  border-color: var(--color-border);
}

body {
  background-color: var(--color-background);
  color: var(--color-foreground);
}
`;

fs.writeFileSync(path.join(__dirname, 'src', 'app', 'globals.css'), cssContent, 'utf8');
console.log('✓ Updated globals.css for Tailwind v4');

// Update layout.tsx to remove the "dark" class since we're always dark
const layoutPath = path.join(__dirname, 'src', 'app', 'layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
// We'll keep the dark class for now, but note that in v4 we handle this differently

console.log('\n✅ Fix applied!');
console.log('Now run: npm run dev');