const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const ORIGIN = 'https://5dd312fa-015f-11ea-ad56-9cb6d0d995f7.gdn.poki.com';
const OUT = path.resolve('games/subway-surfers/site');
const reqs = JSON.parse(fs.readFileSync('subway-requests.json','utf8'));
const seen = new Set(); const queue = [];
function add(u){ try{ const x=new URL(u); if(x.origin===ORIGIN && !seen.has(u)){seen.add(u);queue.push(u);} }catch(e){} }
reqs.forEach(r=>add(r.url));
// seed manifests
queue.push(ORIGIN+'/ec5c789a-69d7-476d-aa4e-1a0064850d79/bundles/transylvania/manifest.json');
const TEXT=/.\.(json|js|mjs|html?|webmanifest|txt)$/i;
function outPath(u){ const p=decodeURIComponent(new URL(u).pathname); return path.join(OUT,p); }
function extract(t){ const out=[]; const re=/["'`](\.{0,2}\/[^"'`\s]+|assets\/[^"'`\s]+|bundles\/[^"'`\s]+)[^"'`\s]*["'`]/g; let m; while((m=re.exec(t))){ try{ out.push(new URL(m[1], ORIGIN+'/ec5c789a-69d7-476d-aa4e-1a0064850d79/').href.split('#')[0]); }catch(e){} } return out; }
(async()=>{
  let n=0,bytes=0;
  while(queue.length){
    const batch=queue.splice(0,10);
    await Promise.all(batch.map(async u=>{
      try{
        const r=await fetch(u,{headers:{'User-Agent':'Mozilla/5.0','Referer':'https://poki.com/'}});
        if(!r.ok){console.log('FAIL',r.status,u);return;}
        const b=Buffer.from(await r.arrayBuffer());
        const d=outPath(u); fs.mkdirSync(path.dirname(d),{recursive:true}); fs.writeFileSync(d,b);
        n++; bytes+=b.length;
        if(TEXT.test(u)){ for(const x of extract(b.toString('utf8'))) add(x); }
      }catch(e){console.log('ERR',u,e.message);}
    }));
    if(n%50===0)console.log('...',n,(bytes/1e6).toFixed(1),'MB, queue',queue.length);
  }
  console.log('DONE',n,'files',(bytes/1e6).toFixed(1),'MB');
})();
