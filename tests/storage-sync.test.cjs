const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const {webcrypto}=require('node:crypto');
const store=new Map();let uploads=0,downloads=0;
const bucket={async upload(path,blob){if(store.has(path))return {error:{message:'Already exists'}};uploads++;store.set(path,blob);return {}},async download(path){downloads++;return store.has(path)?{data:store.get(path)}:{error:{message:'Not found'}}}};
const ctx=vm.createContext({crypto:webcrypto,TextEncoder,TextDecoder,Blob,console,user:{id:'test-user'},authUncertain:false,switching:false,recoveryMode:false,client:{storage:{from:()=>bucket}},showSync(){},validateBackup:x=>x});
vm.runInContext(fs.readFileSync(__dirname+'/../storage-sync.js','utf8')+'\n globalThis.api={stageStorage16,hydrateStorage16,buildStorage16};',ctx);
(async()=>{
const s={skills:[{id:'one',files:{'SKILL.md':{content:'Tiếng Việt 中文 😀',binary:false},'large.bin':{content:'A'.repeat(22*1024*1024),binary:true}},versions:[]}],templates:[],components:[],guides:[{data:{content:'PDF content',binary:true}}],updated:'1'};
let first=await ctx.api.stageStorage16('test-user',s,null);const row={revision:'r1',payload:first.payload};assert(first.stats.uploaded>0);assert(JSON.stringify(first.payload).length<2000);assert([...store.values()].every(b=>b.size<=1048576));
const restored=await ctx.api.hydrateStorage16('test-user',row,null);assert.equal(JSON.stringify(restored),JSON.stringify(s));
const second=await ctx.api.stageStorage16('test-user',s,row);assert.equal(second.stats.uploaded,0);
const changed=JSON.parse(JSON.stringify(s));changed.skills[0].files['SKILL.md'].content='new text';changed.updated='2';const third=await ctx.api.stageStorage16('test-user',changed,row);assert(third.stats.reused>0);assert(third.stats.uploaded<first.stats.uploaded);const newRow={revision:'r2',payload:third.payload};assert.equal(JSON.stringify(await ctx.api.hydrateStorage16('test-user',newRow,s)),JSON.stringify(changed));
// Failed or interrupted upload can be retried, even before a revision was committed.
const repeat=await ctx.api.stageStorage16('test-user',changed,row);assert.equal(JSON.stringify(repeat.payload),JSON.stringify(third.payload));
// Corrupt the unique changed file block, clear local/manifest cache by using a new revision.
const target=[...third.objects].find(([h,b])=>new TextDecoder().decode(b)==='"new text"')[0];store.set('test-user/v1/'+target,new Blob(['bad']));await assert.rejects(()=>ctx.api.hydrateStorage16('test-user',{...newRow,revision:'r3'},null),/SHA-256/);
console.log('PASS: >20 MiB round trip, unchanged writes, incremental changes, retry, integrity check');
})().catch(e=>{console.error(e);process.exitCode=1});
