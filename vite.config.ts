import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

function openAIProxy() {
  return {
    name: 'openai-proxy',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }
        try {
          let raw = '';
          req.on('data', (c) => raw += c);
          req.on('end', async () => {
            try {
              const { prompt, model } = JSON.parse(raw || '{}');
              const apiKey = process.env.OPENAI_API_KEY;
              if (!apiKey) {
                res.statusCode = 500;
                res.end('Missing OPENAI_API_KEY');
                return;
              }
              const r = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                  model: model || 'gpt-4o-mini',
                  messages: [
                    { role: 'system', content: 'You are Marcus, an AI calling assistant for ARMOR Ai Dialer. Keep responses concise and helpful.' },
                    { role: 'user', content: String(prompt || '') }
                  ]
                })
              });
              const data = await r.json();
              if (!r.ok) {
                res.statusCode = r.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return;
              }
              const text = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ text }));
            } catch (err) {
              res.statusCode = 500;
              res.end('Invalid request body');
            }
          });
        } catch (e) {
          res.statusCode = 500;
          res.end('Invalid request');
        }
      });
    }
  }
}

export default defineConfig({
  plugins: [vue(), openAIProxy()],
  server: {
    port: 3000,
    host: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@ds': resolve(__dirname, 'src/design-system')
    }
  }
})
