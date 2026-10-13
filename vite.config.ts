import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

import fs from 'fs';

const feedbackApiPlugin = () => ({
  name: 'feedback-api-dev',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      const url = req.url?.split('?')[0];
      if (url === '/api/feedback' || url === '/api/reviews') {
        const filePath = path.resolve(__dirname, 'data/reviews.json');
        if (req.method === 'GET') {
          try {
            if (fs.existsSync(filePath)) {
              const data = fs.readFileSync(filePath, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(data || '[]');
              return;
            }
          } catch {}
          res.setHeader('Content-Type', 'application/json');
          res.end('[]');
          return;
        }
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}');
              let list: any[] = [];
              if (fs.existsSync(filePath)) {
                try {
                  const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                  if (Array.isArray(existing)) list = existing;
                } catch {}
              }
              const newReview = {
                id: parsed.id || `custom-review-${Date.now()}`,
                clientName: String(parsed.clientName || '').trim(),
                clientRole: parsed.clientRole ? String(parsed.clientRole).trim() : 'Homeowner',
                projectType: String(parsed.projectType || '').trim(),
                location: parsed.location ? String(parsed.location).trim() : 'Bengaluru',
                quote: parsed.quote ? String(parsed.quote).trim() : `Excellent custom carpentry and solid precision joinery for ${parsed.projectType}.`,
                date: parsed.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                rating: Number(parsed.rating) || 5,
                verifiedProject: true,
                createdAt: new Date().toISOString(),
              };
              list.unshift(newReview);
              fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify({ success: true, review: newReview }));
              return;
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
              return;
            }
          });
          return;
        }
      }
      next();
    });
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), feedbackApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
