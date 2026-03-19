# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Server-side AI parse proxy

This project includes a small Express proxy at `server/index.js` to safely call the Anthropic API without exposing your key to the browser.

- The proxy now auto-loads `.env` and `.env.local` on startup.
- Add these server-only vars to `.env.local` (recommended):
  - `ANTHROPIC_API_KEY=your_key_here`
  - `SUPABASE_URL=your_supabase_project_url`
  - `SUPABASE_SERVICE_ROLE_KEY=your_service_role_key`
  - Optional in production: `FRONTEND_ORIGIN=https://your-app-domain.com`
- Start the proxy: `npm run start:server`
- In development the client will call `/api/parse` on the same origin; set `VITE_PARSE_PROXY_URL` if the proxy runs on a different host (e.g. `http://localhost:4001`).
- Health endpoint: `GET /health` (returns config readiness flags)
- The parse endpoint now enforces bearer auth, request validation, and basic rate limiting.

Security note: do not keep `VITE_ANTHROPIC_API_KEY` in client env files.

The client-side parse helper `src/lib/parseWithAI.ts` now POSTs documents to the proxy which forwards them to Anthropic and returns parsed JSON.
The parse proxy now requires an authenticated Supabase bearer token and applies basic request rate limiting.

