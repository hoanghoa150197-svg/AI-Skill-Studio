const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const source=n=>fs.readFileSync(__dirname+'/../'+n,'utf8');
function setup(mode){
 const elements=new Map(), classes=new Set(['auth-locked']),main={inert:true};
 const el=id=>{if(!elements.has(id))elements.set(id,{hidden:id!=='authGate',textContent:'',querySelectorAll:()=>[]});return elements.get(id)};
 const document={body:{classList:{add:k=>classes.add(k),remove:k=>classes.delete(k),toggle(){}}},getElementById:el,querySelector:q=>q==='main'?main:null};
 let enteredRemote=false,resolveRemote;const remotePromise=new Promise(r=>resolveRemote=r);let t=0;
 const sdk={createClient(){return {auth:{onAuthStateChange(){},getSession:()=>mode==='auth-timeout'?new Promise(()=>{}):Promise.resolve({data:{session:{user:{id:'test',email:'test@example.com'}}}}),getUser:async()=>({data:{user:{id:'test'}}})},from(){return {select(){return this},eq(){return this},maybeSingle(){enteredRemote=true;return remotePromise}}}}}};
 const storage={getItem:()=>null,setItem(){},removeItem(){}};
 const context=vm.createContext({document,window:{supabase:sdk,addEventListener(){}},navigator:{},location:{hash:'',protocol:'file:',reload(){}},sessionStorage:storage,localStorage:storage,URLSearchParams,TextEncoder,TextDecoder,Blob,console,AbortController,Request,Response,fetch,crypto:require('node:crypto').webcrypto,setTimeout:(f,ms,...a)=>setTimeout(f,ms===15000?20:ms,...a),clearTimeout,setInterval(){},clearInterval});
 const app=source('app.js').replace(/init\(\)\.catch\(e=>gateFailure\(e\)\);\s*$/,'');
 vm.runInContext(source('storage-sync.js')+'\n'+source('cloud.js')+'\n'+app+'\n dbOpen=async()=>({});readDB=async()=>({skills:[{id:"local",name:"local"}],templates:[],components:[],updated:"1"});render=()=>{};persist=async()=>{};toast=()=>{};globalThis.api={start:()=>init().catch(gateFailure),status:()=>({syncBusy,pending,conflict,syncError,state,authUncertain,localReady}),mark:()=>{state.updated="changed";pending=true},sync:syncCloud};',context);
 return {context,api:context.api,el,classes,main,entered:()=>enteredRemote,resolveRemote};
}
const tick=(ms=10)=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const a=setup('ok');await a.api.start();await tick();assert.equal(a.el('authGate').hidden,true);assert.equal(a.main.inert,false);assert.equal(a.classes.has('auth-locked'),false);assert(a.entered());assert(a.api.status().syncBusy);assert.equal(a.api.status().state.skills[0].id,'local');
 console.log('PASS: verified user opens local Studio without awaiting cloud');
 a.resolveRemote({error:{message:'Storage network error'}});await tick();assert.equal(a.api.status().syncBusy,false);assert.equal(a.api.status().syncError,'Storage network error');assert.equal(a.el('authGate').hidden,true);assert.equal(a.api.status().state.skills[0].id,'local');
 console.log('PASS: cloud error does not close Studio or replace local state');
 const b=setup('auth-timeout');await b.api.start();assert.equal(b.main.inert,true);assert.equal(b.el('gateRetry').hidden,false);assert.match(b.el('gateStatus').textContent,/quá thời gian chờ/);assert(!b.entered());assert(b.api.status().authUncertain);
 console.log('PASS: timed-out auth stays locked and exposes retry');
 const c=setup('ok');let hydrateResolve;const hydratePromise=new Promise(r=>hydrateResolve=r);c.context.mockHydrate=()=>hydratePromise;vm.runInContext('hydrateStorage16=mockHydrate',c.context);await c.api.start();await tick();c.resolveRemote({data:{revision:'remote-r1',payload:{format:'studio-storage-v1'}}});await tick();c.api.mark();hydrateResolve({skills:[{id:'remote'}],templates:[],components:[],updated:'2'});await tick();assert.equal(c.api.status().state.skills[0].id,'local');assert(c.api.status().pending);assert(c.api.status().conflict);console.log('PASS: local edits during remote hydration are not overwritten');
 // Simulate failed fetch with a signal-aware mock and shorten the network timer.
 const d=setup('ok');vm.runInContext(`setTimeout=(f,ms)=>globalThis.shortTimer(f,5);fetch=(_input,init)=>new Promise((_,reject)=>init.signal.addEventListener('abort',()=>reject(Error('aborted'))));`,Object.assign(d.context,{shortTimer:setTimeout}));
 await assert.rejects(vm.runInContext('fetch161("https://example.test")',d.context),/quá 25 giây/);
 console.log('PASS: network request aborts on deadline');
})().catch(e=>{console.error(e);process.exitCode=1});
