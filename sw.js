if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(i[a])return;let c={};const o=e=>n(e,a),t={module:{uri:a},exports:c,require:o};i[a]=Promise.all(s.map((e=>t[e]||o(e)))).then((e=>(r(...e),c)))}}define(["./workbox-6c670a36"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-C6bUWGLy.js",revision:null},{url:"assets/index-CuVt6Ler.css",revision:null},{url:"index.html",revision:"5bea20fba5815ea776d0a5bc64286607"},{url:"registerSW.js",revision:"c6ff6272cae354a7e1eb8a93ca0a985a"},{url:"apple-touch-icon.png",revision:"66f336973c894c26f02aa93e462de086"},{url:"favicon.ico",revision:"7cac5149641e6449139e3488c4be44d0"},{url:"mask-icon.svg",revision:"0c9ef4b4fa86e74f67d367f20b504c3f"},{url:"pwa-192x192.png",revision:"19a37445ac5ad66a06e3e9bf105305a3"},{url:"pwa-512x512.png",revision:"2760ec6670ecff93fa200b3240ac6d9f"},{url:"manifest.webmanifest",revision:"7f52f189e6605aea240558d029189284"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(/^https:\/\/api\.rawg\.io\/api/,new e.StaleWhileRevalidate({cacheName:"api-cache",plugins:[new e.ExpirationPlugin({maxEntries:100,maxAgeSeconds:86400}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));
