'use strict';
const CACHE='skill-studio-v1-6-1-stability';
const CORE=['./','./index.html','./style.css','./app.js?v=1.6.1','./cloud.js?v=1.6.1','./storage-sync.js?v=1.6.1','./manifest.webmanifest','./icon.svg','./vendor/jszip.min.js','./guide.js','./resources/defaults.js','./resources/skill-guide.pdf','./resources/portable-creator.md','./resources/universal-ai-skill-creator.zip'];
const LIBS=['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js'];
async function boundedFetch(req,ms=12000){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),ms);try{return await fetch(req,{signal:controller.signal})}finally{clearTimeout(timer)}}
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(CORE);await self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('skill-studio-')&&k!==CACHE)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||(u.origin!==location.origin&&!LIBS.includes(u.href)))return;e.respondWith((async()=>{const c=await caches.open(CACHE);try{const r=await boundedFetch(e.request);if(r.ok)await c.put(e.request,r.clone());return r}catch(err){const r=await c.match(e.request);if(r)return r;if(e.request.mode==='navigate'){const index=await c.match('./index.html');if(index)return index}throw err}})())});
