import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/snake/',
  plugins: [
    react(),
    VitePWA({
      // Mise à jour automatique du service worker
      registerType: 'autoUpdate',

      // Fichier à inclure dans le cache
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],

      // Configuration du manifest
      manifest: {
        name: 'Snake Hard Game',  // Nom complet
        short_name: 'Snake',      // Nom court pour l'écran d'accueil
        description: 'Jeux snake',
        theme_color: '#ffffff',   // Couleur du thème
        start_url: 'https://romainsgn.github.io/snake/', // Page de démarrage
        display: 'standalone',    // Mode d'affichage
        background_color: '#ffffff', // Couleur du background

        // Liste des icônes
        icons: [
          {
            src: 'pwa-192x192.png',  // Chemin relatif au dossier public
            sizes: '192x192',        // Taille de l'icône
            type: 'image/png',       // Type de fichier
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'  // L'icône peut être masquée (Android)
          }
        ]
      },
      workbox: {
        runtimeCaching: [{
          // Pattern pour les URLs de l'API
          urlPattern: /^https:\/\/api\.rawg\.io\/api/,
          // Stratégie de cache : sert le cache d'abord, puis met à jour
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'api-cache',
            // Configuration de l'expiration du cache
            expiration: {
              maxEntries: 100,  // Nombre maximum d'entrées
              maxAgeSeconds: 86400  // Durée de vie (24h)
            },
            // Type de réponses à mettre en cache
            cacheableResponse: {
              statuses: [0, 200]  // Codes HTTP acceptés
            }
          }
        }]
      }
    })
  ]
})
