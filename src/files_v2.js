(()=>{
/* ===================================================================================================
   files v2 — 文件面板 / @文件 选择 on top of the approved rococo v1 app (nothing approved is redrawn).
   Same function, scenes and bridge as files v1; only the visual language changes:
   v1 torn-paper archive drawer  →  v2 "Hushfall" die-cut stationery, translated into the project palette
   (mauve → misty / silver blue, charcoal → a deeper misty grey-blue, pink only as the faintest lotus accent).
     · panel head: silver-blue band, wide white lace (large sparse motifs) + a sheer organza bow, script "Dossiers"
       + 「文件」 + one small italic verse line; workspace name in a scalloped label frame
     · filter = a long washi-tape bookmark          · folders = label-frame die-cuts with a tiny gothic double door
       that swings open when the folder expands      · files = die-cut stationery by type:
       code = long bookmark, md = mini postcard, image = lace photo card, json/toml = round-head hang tag,
       binary = tin label, other = plain card        · git state = small wax seals     · Kimi touched = a pale rose sticker
     · library card → a tin-lid label               · preview = a flat letter card, embossed frame with scroll corners,
       vellum underlay, buttons as little tags        · @ = a stack of die-cut label cards fanning out
     · chip = round-head hang tag on a thin string  · drop = embossed scalloped doily frame
     · empty = a pair of closed wrought-iron gates + 「打开文件夹」   · a faint iron railing along the bottom
   Trypophobia rules: no dots, no checks, no mesh, no bead strings; lace = few big motifs, holes large and few.

   Bridge (back end → page):   window.__files.emit(type, payload)
     'workspace.tree' {root, name, items:[entry], children_by_path?:{dir:[entry]}, truncated, hidden, ignore:{file,patterns}}   (entry = fs:list entry)
     'workspace.tree' {root:null, recent_roots:[...]}   → no workspace open
     'file.content'   fs:read data  {path, content, encoding, size, truncated, etag, mime, language_id, line_count, is_binary} | {path, error:{code,msg}}
     'git.status'     fs:git_status data {branch, ahead, behind, entries:{path:status}, additions, deletions}
     'fs.suggest'     {query, items:[{path,name,kind,score,match_positions}], truncated}       (workspace/fs:suggest)
     'fs.search'      {query, items:[...], truncated}                                          (workspace/fs:search)
     'agent.touched'   {paths:[...]}   files written by Kimi in this turn (derived from Write/Edit tool events)
   Page → back end:   window.__files.onRequest = (type, payload) => { ... return false to let the built-in mock answer }
     'workspace.list' {path, depth, show_hidden, follow_gitignore, include_git_status, sort}
     'file.read'      {path, offset, length, encoding}                                     
     'git.status'     {paths?}                                                             
     'fs.suggest'     {workspace, query, limit, follow_gitignore, show_hidden}             
     'fs.search'      {workspace, query, limit, follow_gitignore}                          
     'file.openIn'    {path, app_id, line?}                       'file.reveal' {path}                   'file.open' {path}
     'file.copyPath'  {path, absolute}        (clipboard, local)  'workspace.pick' {}
     'workspace.open' {root}                                      'mention.insert' {path, kind}  (local; text keeps "@path")
   =================================================================================================== */
const RMQ=matchMedia('(prefers-reduced-motion: reduce)');
const $=id=>document.getElementById(id);
const b=document.body;
const HASH=decodeURIComponent(location.hash.slice(1)).split(/[&,]/).filter(Boolean);
const has=k=>HASH.includes(k);
const cl=u=>Math.max(0,Math.min(1,u));
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const now=()=>performance.now()/1000;
const RM=()=>RMQ.matches;
const RNG=seed=>{let s=seed>>>0||1;return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};

const IMG={lily:'__IMG_LILY__',lilyLt:'__IMG_LILY_LT__',horse:'__IMG_HORSE__',slip:'__IMG_SLIPPERS__',bear:'__IMG_BEAR__',rabbit:'__IMG_RABBIT__',
  gate:'__IMG_GATE__',fenceLt:'__IMG_FENCE_LT__',fence:'__IMG_FENCE__',rose:'__IMG_ROSE__',bow:'__IMG_BOW__',key:'__IMG_KEY__',fmn:'__IMG_FMN__',shot:'__IMG_SHOT__'};

/* ---------------------------------------------------------------- the workspace (mock = what fs:list depth 6 + git_status would return) */
const ROOT_WIN='D:\\work\\trianon-workbench';
const MOCK_TREE=[
 ['design/',[
   ['keyframes/',[['d-foggy-blue/',[['rococo_v1.html',61.2e3],['settings_v2.html',72.8e3],['files_v1.html',58.4e3],['shot_rococo_v1_end.png',1.15e6]]]]],
   ['demo/',[['rococo_v1.mp4',12.44e6],['settings_v2.mp4',8.39e6]]]]],
 ['docs/',[['specs/',[['2026-10-25-rococo-workbench-design.md',18.2e3]]],['2026-10-26-handoff-foggy-blue.md',9.6e3],['HANDOFF-NEXT.md',6.1e3],['keyframe-preview.png',412e3]]],
 ['src/',[
   ['main/',[['gateway.ts',7.4e3],['index.ts',3.2e3]]],
   ['preload/',[['index.ts',1.9e3]]],
   ['renderer/',[
     ['assets/',[['lily.png',182e3],['paper-grain.png',64e3]]],
     ['components/',[['Composer.vue',8.8e3],['FilePanel.vue',5.2e3]]],
     ['engine/',[['adapter.ts',4.6e3]]],
     ['stores/',[['transcript.ts',5.9e3]]],
     ['App.vue',3.3e3],['stream.ts',2.4e3]]],
   ['shared/',[['events.ts',2.2e3]]]]],
 ['tests/',[['gateway.test.ts',3.1e3],['stream.test.ts',2.7e3]]],
 ['.gitignore',96],['AGENTS.md',3.4e3],['electron.vite.config.ts',1.1e3],['notes.txt',420],['package.json',1.6e3],['README.md',2.9e3],['tsconfig.json',640]];
const MOCK_GIT={branch:'main',ahead:2,behind:0,additions:27,deletions:9,
  entries:{'src/renderer/stream.ts':'modified','tests/stream.test.ts':'modified','src/renderer/engine/adapter.ts':'modified','package.json':'modified',
    'docs/HANDOFF-NEXT.md':'modified','src/renderer/components/FilePanel.vue':'added','design/keyframes/d-foggy-blue/files_v1.html':'added','notes.txt':'untracked'}};
const MOCK_TOUCHED=['src/renderer/stream.ts','tests/stream.test.ts','src/renderer/engine/adapter.ts'];
const MOCK_IGNORE={file:'.gitignore',patterns:['node_modules/','out/','dist/','*.log','.env'],hidden:['.trianon-demo/','.vscode/']};
const MOCK_RECENT=['~/KimiCode/Default','D:\\work\\trianon-workbench','D:\\work\\twig-memory'];

const EXT_LANG={ts:'typescript',vue:'vue',js:'javascript',md:'markdown',json:'json',toml:'toml',html:'html',png:'image',mp4:'video',txt:'plaintext',gitignore:'ignore'};
const ext=n=>{const m=n.match(/\.([^.]+)$/);return m?m[1].toLowerCase():(n.startsWith('.')?n.slice(1):'')};
const stock=n=>{const e=ext(n);if(/^(ts|tsx|js|jsx|vue|mjs|cjs|py|rs|go|css)$/.test(e))return 'code';if(e==='md')return 'md';if(/^(png|jpe?g|gif|webp|svg|heic)$/.test(e))return 'img';
  if(/^(json|toml|ya?ml|lock)$/.test(e))return 'rcpt';if(/^(mp4|webm|mov|zip|asar|ico|icns|woff2?)$/.test(e))return 'bin';return 'plain'};
const mimeOf=n=>({ts:'text/x-typescript',vue:'text/x-vue',md:'text/markdown',json:'application/json',png:'image/png',mp4:'video/mp4',html:'text/html',txt:'text/plain',toml:'application/toml'})[ext(n)]||'text/plain';
const fmtSize=s=>s>=1e6?(s/1048576).toFixed(1)+' MB':s>=1e3?(s/1024).toFixed(1)+' KB':s+' B';

/* the model: entries as fs:list returns them, kept in a path map */
const W={root:null,name:'',nodes:new Map(),top:[],git:{},branch:'',ahead:0,behind:0,touched:new Set(),ignore:MOCK_IGNORE,hiddenN:0,recent:MOCK_RECENT,truncated:false};
const buildMock=()=>{const items=[],cbp={};
  const walk=(list,dir)=>{const out=[];for(const [nm,v] of list){const isDir=nm.endsWith('/');const name=nm.replace(/\/$/,'');const path=(dir?dir+'/':'')+name;
      const e={path,name,kind:isDir?'directory':'file',modified_at:'2026-10-26T16:42:00+08:00'};
      if(isDir){const ch=walk(v,path);e.child_count=ch.length;cbp[path]=ch}else{e.size=v;e.mime=mimeOf(name);e.language_id=EXT_LANG[ext(name)]||'plaintext';e.is_binary=stock(name)==='bin'||stock(name)==='img'}
      e.git_status=MOCK_GIT.entries[path]||'clean';out.push(e)}
    return out};
  const top=walk(MOCK_TREE,'');return {root:ROOT_WIN,name:'trianon-workbench',items:top,children_by_path:cbp,truncated:false,hidden:2,ignore:MOCK_IGNORE}};
const loadTree=p=>{W.nodes.clear();W.top=[];if(!p.root){W.root=null;W.recent=p.recent_roots||MOCK_RECENT;return}
  W.root=p.root;W.name=p.name||p.root.split(/[\\/]/).pop();W.truncated=!!p.truncated;W.hiddenN=p.hidden||0;if(p.ignore)W.ignore=p.ignore;
  const add=(e,parent,depth)=>{const n={...e,parent,depth,children:null};W.nodes.set(e.path,n);if(e.git_status&&e.git_status!=='clean')W.git[e.path]=e.git_status;return n};
  W.top=p.items.map(e=>add(e,null,0).path);
  const fill=dir=>{const ch=p.children_by_path&&p.children_by_path[dir];if(!ch)return;const pn=W.nodes.get(dir);pn.children=ch.map(e=>add(e,dir,pn.depth+1).path);pn.children.forEach(c=>{if(W.nodes.get(c).kind==='directory')fill(c)})};
  W.top.forEach(t=>{if(W.nodes.get(t).kind==='directory')fill(t)})};
const counts=()=>{let f=0,d=0;W.nodes.forEach(n=>n.kind==='directory'?d++:f++);return [f,d]};

/* ---------------------------------------------------------------- mock file contents */
const STREAM_TS=`// src/renderer/stream.ts — 流式回复：delta 先缓冲，按帧批量提交
import { useTranscript } from './stores/transcript'
import type { StreamDelta, MessageId } from '../shared/events'

const FRAME_MS = 16
let pending: StreamDelta[] = []
let scheduled = false

/** 收到一个 delta：只入队，不立刻改 DOM */
export function onDelta(d: StreamDelta) {
  pending.push(d)
  if (!scheduled) {
    scheduled = true
    requestAnimationFrame(flushFrame)
  }
}

/** 一帧只提交一次：同一条消息的 delta 先合并 */
export function flushFrame() {
  const batch = pending
  pending = []
  scheduled = false
  const merged = new Map<MessageId, string>()
  for (const d of batch) {
    merged.set(d.id, (merged.get(d.id) ?? '') + d.text)
  }
  const store = useTranscript()
  for (const [id, text] of merged) store.append(id, text)
}

/** 结束时按 message id 去重，已完成的消息不再整条插入 */
export function onDone(id: MessageId) {
  const store = useTranscript()
  if (store.isDone(id)) return
  flushFrame()
  store.markDone(id)
}

export const __test = { FRAME_MS, pendingCount: () => pending.length }
`;
const KIMI_LINES=new Set([5,6,7,10,11,12,13,14,15,16,19,20,21,22,23,24,25,26,27,28,29,30]);
const HANDOFF_MD=`# HANDOFF · 下一棒

## 进度
- 前端：雾蓝拼贴，主流程已完成
- 设置页待确认

## 下一步（A1）
1. 引擎崩溃后卡在 reconnecting：重连要带退避
2. 重启后清掉旧订阅组
3. 先 subscribe，再 events.resync

> 合并前先跑一遍 npm test
`;
const contentOf=path=>{const n=W.nodes.get(path)||{name:path.split('/').pop(),size:2048};const nm=n.name;const s=stock(nm);
  if(s==='bin'||s==='img'||n.size>10485760)return {path,content:'',encoding:'base64',size:n.size,truncated:n.size>10485760,etag:'W/"'+(n.size>>>0).toString(16)+'"',mime:mimeOf(nm),is_binary:true};
  let c=path==='src/renderer/stream.ts'?STREAM_TS:path==='docs/HANDOFF-NEXT.md'?HANDOFF_MD:`// ${path}\n// （模拟内容：原型里只为几张样张写了正文）\n`;
  return {path,content:c,encoding:'utf-8',size:n.size||c.length,truncated:false,etag:'"9f3c'+(c.length*7919%65536).toString(16)+'"',mime:mimeOf(nm),language_id:EXT_LANG[ext(nm)]||'plaintext',line_count:c.split('\n').length-1,is_binary:false}};

/* fuzzy match (the client mirror of fs:suggest's score / match_positions) */
const fuzzy=(q,s)=>{q=q.toLowerCase();const t=s.toLowerCase();if(!q)return {score:.5,pos:[]};
  const i=t.indexOf(q);if(i>=0){const base=t.lastIndexOf('/')+1;return {score:.9-(i<base?.3:0)+(i===base?.08:0)-t.length/900,pos:[...Array(q.length)].map((_,k)=>i+k)}}
  let j=0,pos=[];for(let k=0;k<t.length&&j<q.length;k++)if(t[k]===q[j]){pos.push(k);j++}
  if(j<q.length)return null;const spread=pos[pos.length-1]-pos[0];return {score:Math.max(.05,.6-spread/80-t.length/900),pos}};
const suggest=(q,limit=8)=>{const out=[];const byPath=q.includes('/');W.nodes.forEach(n=>{const p=n.kind==='directory'?n.path+'/':n.path;
    let m;if(byPath)m=fuzzy(q,p);else{const nm=n.kind==='directory'?n.name+'/':n.name;const mm=fuzzy(q,nm);if(mm){const off=p.length-nm.length;m={score:mm.score,pos:mm.pos.map(x=>x+off)}}}
    if(m&&m.score>.3)out.push({path:p,name:n.name,kind:n.kind,score:+m.score.toFixed(3),match_positions:m.pos})});
  out.sort((a,b)=>b.score-a.score||a.path.localeCompare(b.path));return out.slice(0,limit)};

/* ---------------------------------------------------------------- bridge */
const T_=[];const later=(s,f)=>{const id=setTimeout(f,s*1000);T_.push(id);return id};
const marks={};const mark=k=>{marks[k]=now()};
const mock={
  handle(type,p){
    if(type==='workspace.list')later(.05,()=>emit('workspace.tree',buildMock()));
    else if(type==='git.status')later(.08,()=>emit('git.status',MOCK_GIT));
    else if(type==='file.read')later(.12,()=>emit('file.content',contentOf(p.path)));
    else if(type==='fs.suggest')emit('fs.suggest',{query:p.query,items:suggest(p.query,p.limit||8),truncated:false});
    else if(type==='fs.search')emit('fs.search',{query:p.query,items:suggest(p.query,200),truncated:false});
    else if(type==='workspace.pick')later(.3,()=>{emit('workspace.tree',buildMock());later(.1,()=>emit('git.status',MOCK_GIT))});
    else if(type==='workspace.open')later(.2,()=>{emit('workspace.tree',buildMock());later(.1,()=>emit('git.status',MOCK_GIT))})}};
const request=(type,p={})=>{marks['req:'+type]=now();if(typeof api.onRequest==='function'){try{if(api.onRequest(type,p)!==false)return}catch(e){}}mock.handle(type,p)};


/* ---------------------------------------------------------------- die-cut drawing kit */
const P2=n=>+(+n).toFixed(2);
const C={ink:'#26305A',ink2:'#3C4A75',line:'#7F8FB8',emb:'rgba(111,128,168,.55)',milk:'#FBF9F4',silver:'#E2E7F3',mist:'#CDD5EA',tin:'#E3E7EF',
  lotus:'#F2E6EA',lotusInk:'#9A6A80',board:'#66718F',sage:'#B9C5B8'};
/* bracket label: concave corners */
const bracketD=(x,y,w,h,r)=>`M${P2(x+r)},${y} H${P2(x+w-r)} A${r},${r} 0 0 0 ${P2(x+w)},${P2(y+r)} V${P2(y+h-r)} A${r},${r} 0 0 0 ${P2(x+w-r)},${P2(y+h)} H${P2(x+r)} A${r},${r} 0 0 0 ${x},${P2(y+h-r)} V${P2(y+r)} A${r},${r} 0 0 0 ${P2(x+r)},${y} Z`;
/* "Void Dream" label frame: concave corners + a round bump in the middle of each end */
const labelD=(x,y,w,h,r,bp)=>`M${P2(x+r)},${y} H${P2(x+w-r)} A${r},${r} 0 0 0 ${P2(x+w)},${P2(y+r)} V${P2(y+h/2-bp)} A${bp},${bp} 0 0 1 ${P2(x+w)},${P2(y+h/2+bp)} V${P2(y+h-r)} A${r},${r} 0 0 0 ${P2(x+w-r)},${P2(y+h)} H${P2(x+r)} A${r},${r} 0 0 0 ${x},${P2(y+h-r)} V${P2(y+h/2+bp)} A${bp},${bp} 0 0 1 ${x},${P2(y+h/2-bp)} V${P2(y+r)} A${r},${r} 0 0 0 ${P2(x+r)},${y} Z`;
/* soft scalloped rectangle (big bumps only) */
const waveD=(x,y,w,h,bw,amp,sides='tlbr')=>{const nx=Math.max(1,Math.round(w/bw)),ny=Math.max(1,Math.round(h/bw));const sx=w/nx,sy=h/ny;let d=`M${x},${y}`;
  for(let i=0;i<nx;i++)d+=sides.includes('t')?` Q${P2(x+sx*(i+.5))},${P2(y-amp)} ${P2(x+sx*(i+1))},${y}`:` L${P2(x+sx*(i+1))},${y}`;
  for(let i=0;i<ny;i++)d+=sides.includes('r')?` Q${P2(x+w+amp)},${P2(y+sy*(i+.5))} ${P2(x+w)},${P2(y+sy*(i+1))}`:` L${P2(x+w)},${P2(y+sy*(i+1))}`;
  for(let i=0;i<nx;i++)d+=sides.includes('b')?` Q${P2(x+w-sx*(i+.5))},${P2(y+h+amp)} ${P2(x+w-sx*(i+1))},${P2(y+h)}`:` L${P2(x+w-sx*(i+1))},${P2(y+h)}`;
  for(let i=0;i<ny;i++)d+=sides.includes('l')?` Q${P2(x-amp)},${P2(y+h-sy*(i+.5))} ${x},${P2(y+h-sy*(i+1))}`:` L${x},${P2(y+h-sy*(i+1))}`;
  return d+' Z'};
const bookmarkD=(x,y,w,h,n)=>`M${P2(x+h/2)},${y} H${P2(x+w)} L${P2(x+w-n)},${P2(y+h/2)} L${P2(x+w)},${P2(y+h)} H${P2(x+h/2)} A${P2(h/2)},${P2(h/2)} 0 0 1 ${P2(x+h/2)},${y} Z`;
const tagD=(x,y,w,h)=>{const k=h*.55;return `M${P2(x+k)},${y} H${P2(x+w-3)} Q${P2(x+w)},${y} ${P2(x+w)},${P2(y+3)} V${P2(y+h-3)} Q${P2(x+w)},${P2(y+h)} ${P2(x+w-3)},${P2(y+h)} H${P2(x+k)} C${P2(x+3)},${P2(y+h)} ${x},${P2(y+h*.78)} ${x},${P2(y+h/2)} C${x},${P2(y+h*.22)} ${P2(x+3)},${y} ${P2(x+k)},${y} Z`};
const rrD=(x,y,w,h,r)=>`M${P2(x+r)},${y} H${P2(x+w-r)} Q${P2(x+w)},${y} ${P2(x+w)},${P2(y+r)} V${P2(y+h-r)} Q${P2(x+w)},${P2(y+h)} ${P2(x+w-r)},${P2(y+h)} H${P2(x+r)} Q${x},${P2(y+h)} ${x},${P2(y+h-r)} V${P2(y+r)} Q${x},${y} ${P2(x+r)},${y} Z`;
/* vertical round-head hang tag (head on top) */
const vtagD=(x,y,w,h)=>{const r=w/2;return `M${x},${P2(y+r)} A${P2(r)},${P2(r*.92)} 0 0 1 ${P2(x+w)},${P2(y+r)} V${P2(y+h-4)} Q${P2(x+w)},${P2(y+h)} ${P2(x+w-4)},${P2(y+h)} H${P2(x+4)} Q${x},${P2(y+h)} ${x},${P2(y+h-4)} Z`};
/* one die-cut card: outer path, optional embossed inner path, extra svg */
const dc=(w,h,outer,o={})=>`<svg class="pp${o.cls?' '+o.cls:''}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">${o.under||''}
  <path class="dc-o" d="${outer}" fill="${o.fill||C.milk}" stroke="${o.stroke||C.line}" stroke-width="${o.sw||.9}"/>
  ${o.grain?`<path d="${outer}" fill="url(#f2Grain)" opacity="${o.grain}"/>`:''}
  ${o.inner?`<path d="${o.inner}" fill="none" stroke="rgba(255,255,255,.95)" stroke-width="1.3" transform="translate(.5,.7)"/><path d="${o.inner}" fill="none" stroke="${o.emb||C.emb}" stroke-width=".7"${o.dash?` stroke-dasharray="${o.dash}"`:''}/>`:''}
  ${o.extra||''}</svg>`;
/* scroll flourish for frame corners (one C-curl + leaf) */
const curl=(x,y,s,rot,col)=>`<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})" fill="none" stroke="${col}" stroke-width="${P2(1.1/s)}" stroke-linecap="round">
  <path d="M0,0 C10,0 18,6 18,15 C18,22 12,25 8,22 C5,19.5 7,15 10.5,16.2"/><path d="M0,0 C0,10 6,18 15,18 C22,18 25,12 22,8 C19.5,5 15,7 16.2,10.5"/>
  <path d="M4,4 C9,9 13,10 20,8" opacity=".7"/></g>`;
/* small wax seal (git status) */
const SEAL={modified:['M','改动','#6E80AE','#5A6C9C'],added:['A','新增','#8EA4CA','#6F86AF'],untracked:['?','未跟踪','#CDA9B6','#AE8696'],deleted:['D','删除','#C29AA9','#9E7686'],renamed:['R','改名','#6E80AE','#5A6C9C'],conflicted:['!','冲突','#C29AA9','#9E7686']};
const sealSVG=(st,sz=20)=>{const s=SEAL[st];if(!s)return '';let d='';const N=7;for(let i=0;i<=N*8;i++){const a=i/(N*8)*Math.PI*2;const r=9.4+Math.sin(a*N)*.75+Math.sin(a*3+1)*.35;d+=(i?'L':'M')+P2(Math.cos(a)*r)+','+P2(Math.sin(a)*r)}
  return `<svg class="gs" width="${sz}" height="${sz}" viewBox="-11 -11 22 22" aria-hidden="true"><path d="${d}Z" fill="${s[2]}"/><circle r="6.9" fill="none" stroke="rgba(255,255,255,.55)" stroke-width=".8"/><circle r="6.9" fill="none" stroke="${s[3]}" stroke-width=".5" transform="translate(.3,.4)" opacity=".7"/>
   <text y="3.5" text-anchor="middle" font-family="CormI,Georgia,serif" font-style="italic" font-weight="700" font-size="10.5" fill="#FDFCF8">${s[0]}</text></svg>`};
/* tiny gothic double door: closed for a closed folder, swings open when it expands */
const doorSVG=()=>`<svg class="dr-svg" width="15" height="19" viewBox="0 0 15 19" aria-hidden="true"><path d="M1,18.4 V8 Q1,1.2 7.5,.6 Q14,1.2 14,8 V18.4 Z" fill="#FFF9EC" stroke="#56679A" stroke-width=".9"/>
  <path class="dl l" d="M1.7,17.8 V8.1 Q1.9,2.2 7.2,1.4 V17.8 Z" fill="#AEB9D8" stroke="#56679A" stroke-width=".6"/><path class="dl r" d="M13.3,17.8 V8.1 Q13.1,2.2 7.8,1.4 V17.8 Z" fill="#AEB9D8" stroke="#56679A" stroke-width=".6"/>
  <path class="dl l" d="M3,16 V9 Q3.2,5 6,3.8" fill="none" stroke="rgba(255,255,255,.75)" stroke-width=".6"/><path class="dl r" d="M12,16 V9 Q11.8,5 9,3.8" fill="none" stroke="rgba(255,255,255,.75)" stroke-width=".6"/></svg>`;
const FD_FILL=['#DCE2F1','#F7F4ED','#E4E9F5'];

/* a folder: label-frame die-cut, embossed inner line, door at the left end */
const folderSVG=(w,d,open)=>dc(w,30,labelD(4,1,w-8,28,6,4.2),{fill:FD_FILL[d%3],stroke:d%2?'#A79E8C':C.line,inner:bracketD(10,4.6,w-20,20.8,4),emb:d%2?'rgba(167,158,140,.6)':C.emb,
  extra:`<path d="M${w-58},15 h22" stroke="${d%2?'rgba(167,158,140,.5)':'rgba(111,128,168,.45)'}" stroke-width=".7"/>`});
/* file die-cuts by stock */
const fileSVG=(w,h,st)=>{
  if(st==='code')return dc(w,h,bookmarkD(1,1,w-2,h-2,8),{fill:'#FDFCF8',inner:bookmarkD(5,4,w-10,h-8,5.6),extra:`<path d="M${h/2+3},${h/2} m-3.2,0 a3.2,3.2 0 1,0 6.4,0 a3.2,3.2 0 1,0 -6.4,0" fill="none" stroke="${C.line}" stroke-width=".8"/>`});
  if(st==='md')return dc(w,h,rrD(1,1,w-2,h-2,2.5),{fill:'#FBF7F0',stroke:'#A9A08C',inner:rrD(4,3.6,w-8,h-7.2,1.5),emb:'rgba(169,160,140,.6)',
    extra:`<rect x="${w-24}" y="5.5" width="13" height="${h-11}" rx="1" fill="#F1E6EA" stroke="#B9939F" stroke-width=".7"/><path d="M${w-40},9 q4,-2.6 8,0 t8,0" fill="none" stroke="rgba(150,132,104,.55)" stroke-width=".7"/>`});
  if(st==='img')return dc(w,h,waveD(2,2.5,w-4,h-5,16,2.2),{fill:'#FEFDFB',stroke:'#9AA8C8',inner:rrD(5.5,5.5,w-11,h-11,2),dash:'5 3.4'});
  if(st==='rcpt')return dc(w,h,tagD(1,1,w-2,h-2),{fill:'#F6F3FA',stroke:'#8E9BC0',inner:tagD(4,3.6,w-8,h-7.2),
    extra:`<circle cx="${h*.42}" cy="${h/2}" r="3.4" fill="#FDFCF8" stroke="#56679A" stroke-width="1"/>`});
  if(st==='bin')return dc(w,h,rrD(1,1,w-2,h-2,7),{fill:'url(#f2Tin)',stroke:'#8D97B2',inner:rrD(4,3.5,w-8,h-7,5)});
  return dc(w,h,bracketD(1,1,w-2,h-2,3.5),{fill:'#FDFCF8',stroke:'#98A3C0',inner:bracketD(4.5,4,w-9,h-8,2.5)})};
/* tiny type marks inside the die-cut */
const glyph=(st,kind)=>{const s='#56679A';
  if(kind==='directory')return doorSVG();
  if(st==='code')return `<svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true"><path d="M5,3 L1.8,7 L5,11 M11,3 L14.2,7 L11,11" fill="none" stroke="${s}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  if(st==='md')return `<svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="9" rx="1" fill="#FBF7F0" stroke="#8E7E62" stroke-width=".9"/><path d="M1.8,3 L8,8 L14.2,3" fill="none" stroke="#8E7E62" stroke-width=".9"/></svg>`;
  if(st==='rcpt')return `<svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true"><path d="M3,7 C3,3.6 6,2.6 8.4,2.6 H13.4 V11.4 H8.4 C6,11.4 3,10.4 3,7 Z" fill="none" stroke="${s}" stroke-width="1"/><path d="M7,7 h4.4" stroke="${s}" stroke-width=".9"/></svg>`;
  if(st==='bin')return `<svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true"><rect x="2" y="5" width="12" height="7.4" rx="1.6" fill="#E3E7EF" stroke="${s}" stroke-width=".9"/><rect x="1.2" y="2.4" width="13.6" height="3.4" rx="1.4" fill="#F2F4F8" stroke="${s}" stroke-width=".9"/></svg>`;
  return `<svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true"><path d="M3.5,1.5 H10 L12.5,4 V12.5 H3.5 Z" fill="#FDFCF8" stroke="${s}" stroke-width=".9"/><path d="M5.6,7 h4.8 M5.6,9.4 h3.4" stroke="${s}" stroke-width=".8"/></svg>`};
const hl=(name,pos,off=0)=>{if(!pos||!pos.length)return esc(name);const set=new Set(pos.map(p=>p-off));let o='',inM=false;
  for(let i=0;i<name.length;i++){const m=set.has(i);if(m&&!inM){o+='<mark>';inM=true}if(!m&&inM){o+='</mark>';inM=false}o+=esc(name[i])}if(inM)o+='</mark>';return o};

/* lace: white band with a scalloped lower edge; one heart cut per scallop (large, few), petal outlines embossed, never holes */
const laceSVG=(w,h,id)=>{const n=Math.max(4,Math.round(w/58)),U=w/n,top=h*.36,dp=h-top;let d=`M0,0 H${w} V${P2(top)}`;let holes='',emb='',fl='';
  for(let i=n-1;i>=0;i--){const x0=U*i;d+=` A${P2(U/2)},${P2(dp)} 0 0 1 ${P2(x0)},${P2(top)}`}
  for(let i=0;i<n;i++){const cx=U*(i+.5),cy=top+dp*.42,s=dp*.2;
    holes+=` M${P2(cx)},${P2(cy+s*1.05)} C${P2(cx-s*1.5)},${P2(cy)} ${P2(cx-s*1.1)},${P2(cy-s*1.1)} ${P2(cx)},${P2(cy-s*.35)} C${P2(cx+s*1.1)},${P2(cy-s*1.1)} ${P2(cx+s*1.5)},${P2(cy)} ${P2(cx)},${P2(cy+s*1.05)} Z`;
    emb+=`<path d="M${P2(cx-U/2+7)},${P2(top+1)} A${P2(U/2-7)},${P2(dp-7)} 0 0 0 ${P2(cx+U/2-7)},${P2(top+1)}" fill="none" stroke="rgba(143,157,194,.5)" stroke-width=".8"/>
      <path d="M${P2(cx-s*2.4)},${P2(cy+s*.2)} C${P2(cx-s*2.6)},${P2(cy+s*2.2)} ${P2(cx-s*.8)},${P2(cy+s*2.6)} ${P2(cx)},${P2(cy+s*2.1)} C${P2(cx+s*.8)},${P2(cy+s*2.6)} ${P2(cx+s*2.6)},${P2(cy+s*2.2)} ${P2(cx+s*2.4)},${P2(cy+s*.2)}" fill="none" stroke="rgba(143,157,194,.42)" stroke-width=".7"/>`;
    if(i>0){const fx=U*i,fy=top*.52,r=top*.2;fl+=`<g transform="translate(${P2(fx)},${P2(fy)})" fill="none" stroke="rgba(143,157,194,.55)" stroke-width=".75">${[0,90,180,270].map(a=>`<ellipse cx="0" cy="${P2(-r)}" rx="${P2(r*.55)}" ry="${P2(r)}" transform="rotate(${a+45})"/>`).join('')}<circle r="${P2(r*.32)}" fill="rgba(143,157,194,.45)" stroke="none"/></g>`}}
  return `<svg class="lace" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><defs><filter id="${id}F" x="-5%" y="-20%" width="110%" height="150%"><feDropShadow dx="0" dy="2.4" stdDeviation="2.2" flood-color="#232C4E" flood-opacity=".28"/></filter></defs>
   <path d="${d} Z${holes}" fill-rule="evenodd" fill="#FCFBF8" filter="url(#${id}F)"/>
   <path d="M0,${P2(top*.16)} H${w}" stroke="rgba(143,157,194,.45)" stroke-width=".8"/><path d="M0,${P2(top*.9)} H${w}" stroke="rgba(143,157,194,.4)" stroke-width=".7"/>${fl}${emb}</svg>`};

/* the panel board: deeper misty grey-blue die-cut with a silver-blue head band, gentle scalloped foot */
const boardSVG=(Wd,Hd)=>{const outer=`M14,0 H${Wd-14} Q${Wd},0 ${Wd},14 V${Hd-14} `+(()=>{const n=8,bw=Wd/n;let d='';for(let i=0;i<n;i++)d+=`Q${P2(Wd-bw*(i+.5))},${Hd+6} ${P2(Wd-bw*(i+1))},${Hd-8} `;return d})()+`V14 Q0,0 14,0 Z`;
  return `<svg class="pp board" width="${Wd}" height="${Hd}" viewBox="0 0 ${Wd} ${Hd}" aria-hidden="true">
 <defs><clipPath id="f2BoardC"><path d="${outer}"/></clipPath><linearGradient id="f2BoardG" x1="0" y1="0" x2=".5" y2="1"><stop offset="0" stop-color="#6D7896"/><stop offset=".55" stop-color="#64708E"/><stop offset="1" stop-color="#6A7593"/></linearGradient>
  <linearGradient id="f2Band" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#BFC8E0"/><stop offset=".5" stop-color="#C7CFE5"/><stop offset="1" stop-color="#BAC3DC"/></linearGradient></defs>
 <path d="${outer}" fill="url(#f2BoardG)"/>
 <g clip-path="url(#f2BoardC)"><rect width="${Wd}" height="${Hd}" fill="url(#f2Grain)" opacity=".55"/>
  <rect width="${Wd}" height="128" fill="url(#f2Band)"/><rect width="${Wd}" height="128" fill="url(#f2Grain)" opacity=".7"/>
  <image href="${IMG.lilyLt}" x="${Wd-232}" y="${Hd-470}" width="250" height="208" opacity=".07" transform="rotate(-8 ${Wd-110} ${Hd-360})"/>
  <image href="${IMG.fenceLt}" x="-30" y="${Hd-150}" width="${Wd+60}" height="${P2((Wd+60)*299/900)}" opacity=".13"/></g>
 <path d="${outer}" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="1"/>
 <path d="M10,${Hd-30} V24 Q10,10 24,10 H${Wd-24} Q${Wd-10},10 ${Wd-10},24 V${Hd-30}" fill="none" stroke="rgba(226,231,243,.22)" stroke-width=".8" transform="translate(0,0)"/></svg>`};

/* ---------------------------------------------------------------- DOM */
const defs=document.createElementNS('http://www.w3.org/2000/svg','svg');defs.setAttribute('width','0');defs.setAttribute('height','0');defs.style.position='absolute';
defs.innerHTML=`<defs><pattern id="f2Grain" patternUnits="userSpaceOnUse" width="256" height="256"><image href="__IMG_GRAIN__" width="256" height="256"/></pattern>
 <linearGradient id="f2Tin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2F4F8"/><stop offset=".5" stop-color="#E1E5EE"/><stop offset="1" stop-color="#D3D9E6"/></linearGradient>
 <linearGradient id="f2TinL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EEF1F6"/><stop offset=".45" stop-color="#DCE1EC"/><stop offset=".55" stop-color="#E8EBF2"/><stop offset="1" stop-color="#CED5E3"/></linearGradient></defs>`;
b.appendChild(defs);
/* faint iron railing along the bottom of the whole screen while the panel is out */
const fenceEl=document.createElement('div');fenceEl.id='flFence';fenceEl.setAttribute('aria-hidden','true');fenceEl.innerHTML=`<img src="${IMG.fence}" alt="">`;b.appendChild(fenceEl);
const DW=396,DH=876;
const root=document.createElement('div');root.id='flRoot';
const VERSE='Every file a letter kept,<br>every folder a door left ajar.';
root.innerHTML=`
<div class="fl-drawer" id="flDrawer" role="region" aria-label="文件" aria-hidden="true" style="width:${DW}px;height:${DH}px">
 <div class="fl-board">${boardSVG(DW,DH)}</div>
 <div class="fl-head">
  <p class="fl-verse">${VERSE}</p>
  <em class="fl-title">Dossiers</em><b class="fl-zh">文件</b>
 </div>
 <img class="fl-rose" src="${IMG.rose}" alt="">
 <div class="fl-lace">${laceSVG(DW,54,'f2LaceA')}</div>
 <img class="fl-bow" src="${IMG.bow}" alt="">
 <i class="fl-gtag" id="flGtag"></i>
 <button class="fl-x" id="flX" type="button" aria-label="合上文件面板"><svg width="44" height="44" viewBox="-22 -22 44 44" aria-hidden="true"><circle r="17" fill="#FBF9F4" stroke="#7F8FB8" stroke-width=".9"/><circle r="13.6" fill="none" stroke="rgba(111,128,168,.55)" stroke-width=".7"/><circle r="13.6" fill="none" stroke="#fff" stroke-width="1" transform="translate(.4,.6)" opacity=".8"/></svg><span><i>✕</i><b>合上</b></span></button>
 <div class="fl-ws" id="flWs"></div>
 <label class="fl-flt" id="flFltWrap">
  <span class="fl-tape"><svg class="tp-svg" width="276" height="34" viewBox="0 0 276 34" aria-hidden="true"><path d="M0,2 H276 L266,17 L276,32 H0 L10,17 Z" fill="rgba(236,240,249,.86)"/><path d="M0,2 H276 L266,17 L276,32 H0 L10,17 Z" fill="url(#f2Grain)" opacity=".5"/>
   <path d="M14,6.5 H262" stroke="rgba(111,128,168,.4)" stroke-width=".7"/><path d="M14,27.5 H262" stroke="rgba(111,128,168,.4)" stroke-width=".7"/></svg>
   <svg class="tp-key" width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="8.6" cy="8.6" r="5.4" fill="none" stroke="#4C5D88" stroke-width="1.4"/><path d="M12.6,12.6 L19,19" stroke="#4C5D88" stroke-width="1.8" stroke-linecap="round"/></svg>
   <input id="flFlt" type="text" autocomplete="off" spellcheck="false" placeholder="筛选文件 · filtrer" aria-label="筛选文件"><b class="fl-cnt" id="flCnt"></b><button type="button" class="fl-fx" id="flFx" aria-label="清除筛选">✕</button></span></label>
 <div class="fl-tree" id="flTree" role="tree" aria-label="工作区文件"><div class="fl-rows" id="flRows"></div></div>
 <div class="fl-gates" aria-hidden="true"><i class="gl l"><b></b></i><i class="gl r"><b></b></i></div>
 <div class="fl-none" id="flNone"></div>
 <div class="fl-empty" id="flEmpty"></div>
 <div class="fl-card" id="flCard"></div>
</div>
<div class="fl-pv" id="flPv" role="dialog" aria-label="文件预览" aria-hidden="true"></div>
<div class="fl-at" id="flAt" role="listbox" aria-label="引用文件" aria-hidden="true"></div>
<div class="fl-drop" id="flDrop" aria-hidden="true"><svg class="dz" aria-hidden="true"></svg><span class="dz-t"><em>déposez ici</em><b>放这里 · 作为 @ 引用</b></span></div>
<div class="fl-ghost" id="flGhost" aria-hidden="true"></div>
<div class="fl-fly" id="flFly" aria-hidden="true"></div>`;
b.appendChild(root);
const drawer=$('flDrawer'),rowsEl=$('flRows'),treeEl=$('flTree'),flt=$('flFlt'),cnt=$('flCnt'),pvEl=$('flPv'),atEl=$('flAt'),dropEl=$('flDrop'),ghost=$('flGhost'),fly=$('flFly');

/* composer: chips live on the writing line, before the typed words */
const ci=$('ci'),field=document.querySelector('.field'),ph=field.querySelector('.ph'),send=document.querySelector('.send');
const chipsEl=document.createElement('span');chipsEl.className='fl-chips';chipsEl.id='flChips';ph.insertBefore(chipsEl,ci);
const atPill=[...field.querySelectorAll('.pill')].find(p=>p.textContent.includes('@'));

/* ---------------------------------------------------------------- state */
const S={open:false,exp:new Set(['src','src/renderer']),q:'',sel:null,pv:null,at:null,chips:[],drag:null,recent:['src/renderer/stream.ts','docs/HANDOFF-NEXT.md','package.json'],
  prevRail:null,fileCache:{},touchedT:{}};

/* ---------------------------------------------------------------- workspace label, git hang tag, tin card, empty gates */
const drawWs=()=>{const w=$('flWs');if(!W.root){w.innerHTML='';drawGtag();return}const nw=Math.min(312,Math.max(190,W.name.length*7.7+70));
  w.innerHTML=`<span class="ws-lab" style="width:${nw}px">${dc(nw,30,labelD(5,1,nw-10,28,7,4.6),{fill:'#FBF9F4',inner:bracketD(11,4.6,nw-22,20.8,4.4)})}
   <svg class="ws-k" width="20" height="10" viewBox="0 0 20 10" aria-hidden="true"><circle cx="4.4" cy="5" r="3.4" fill="none" stroke="#4C5D88" stroke-width="1.2"/><path d="M7.8,5 H18.6 M15.4,5 V8.2 M17.8,5 V7.4" stroke="#4C5D88" stroke-width="1.2" stroke-linecap="round"/></svg>
   <b>${esc(W.name)}</b></span>`;drawGtag()};
/* a round-head hang tag on a thin string, hung from the lace: git branch + what changed (fs:git_status) */
const drawGtag=()=>{const g=$('flGtag');if(!W.root){g.innerHTML='';return}const ch=Object.keys(W.git).length;const kc=W.touched.size;
  g.innerHTML=`<svg class="gt-str" width="40" height="44" viewBox="0 0 40 44" aria-hidden="true"><path d="M20,0 C17,12 24,22 20,40" fill="none" stroke="#E6EAF4" stroke-width="1" stroke-linecap="round"/></svg>
   <span class="gt-card">${dc(76,104,vtagD(1,1,74,102),{fill:'#FBF9F4',stroke:C.line,inner:vtagD(5,5,66,94),grain:.25})}
    <i class="gt-ey"></i><b><svg width="10" height="11" viewBox="0 0 11 12" aria-hidden="true"><circle cx="2.6" cy="2.4" r="1.6" fill="none" stroke="#4C5D88"/><circle cx="2.6" cy="9.6" r="1.6" fill="none" stroke="#4C5D88"/><circle cx="8.4" cy="4.2" r="1.6" fill="none" stroke="#4C5D88"/><path d="M2.6,4 V8 M8.4,5.8 C8.4,8 2.6,6.8 2.6,8" fill="none" stroke="#4C5D88"/></svg>${esc(W.branch||'—')}${W.ahead?` ↑${esc(W.ahead)}`:''}${W.behind?` ↓${esc(W.behind)}`:''}</b>
    <em>${ch} 处改动</em><small><img src="${IMG.rose}" alt="">动过 ${kc}</small></span>`};
const drawCard=()=>{const c=$('flCard');const [f,d]=W.root?counts():[0,0];
  const rows=W.root?`<div class="lc-r"><span>路径</span><code title="${esc(W.root)}">${esc(W.root)}</code></div>
    <div class="lc-r"><span>藏量</span><b>${f} 份文件 · ${d} 个文件夹</b><small>隐藏 ${W.ignore.hidden.length} 项点文件</small></div>
    <div class="lc-r"><span>忽略</span><code class="ig">${esc(W.ignore.file)} · ${W.ignore.patterns.map(esc).join('  ')}</code></div>`:
   `<div class="lc-r"><span>路径</span><i class="lc-blank">— 尚未开启 —</i></div><div class="lc-r"><span>藏量</span><i class="lc-blank"></i></div><div class="lc-r"><span>忽略</span><i class="lc-blank"></i></div>`;
  c.innerHTML=`<div class="lc-tin">${dc(356,128,rrD(1,1,354,126,18),{fill:'url(#f2TinL)',stroke:'#8D97B2',sw:1,inner:rrD(6,6,344,116,14),emb:'rgba(141,151,178,.7)'})}</div>
   <div class="lc-lab">${dc(326,104,labelD(4,1,318,102,10,6),{fill:'#FBF9F4',inner:bracketD(11,6,304,92,7),grain:.18,
     extra:curl(14,9,.62,0,'rgba(111,128,168,.55)')+curl(312,9,.62,90,'rgba(111,128,168,.55)')+curl(312,95,.62,180,'rgba(111,128,168,.55)')+curl(14,95,.62,270,'rgba(111,128,168,.55)')})}
    <div class="lc-in"><div class="lc-h"><em>le coffret</em><span>工作区 · 锡盒标签</span></div>${rows}</div></div>
   <img class="lc-rab" src="${IMG.rabbit}" alt="">`};
const drawEmpty=()=>{const e=$('flEmpty');if(W.root){e.innerHTML='';e.classList.remove('on');return}e.classList.add('on');
  e.innerHTML=`<div class="em-gate"><img src="${IMG.gate}" alt=""><i class="em-lock">${sealSVG('untracked',30).replace('>?<','>✦<')}</i></div>
   <div class="em-note">${dc(304,150,labelD(4,1,296,148,12,7),{fill:'#FBF9F4',inner:bracketD(12,7,280,136,8),grain:.2,extra:curl(16,11,.7,0,'rgba(111,128,168,.5)')+curl(288,11,.7,90,'rgba(111,128,168,.5)')+curl(288,139,.7,180,'rgba(111,128,168,.5)')+curl(16,139,.7,270,'rgba(111,128,168,.5)')})}
    <div class="ct"><em>la grille est fermée</em><b>还没有打开工作区</b><p>Kimi 需要一个工作目录才能读写文件；<br>相当于命令行里的 <code>agent --work-dir</code>。</p></div></div>
   <button type="button" class="fl-open-btn" id="flPick">${dc(214,40,tagD(1,1,212,38),{fill:'#4E5F8E',stroke:'#3D4C78',inner:tagD(5,4.5,204,31),emb:'rgba(226,231,243,.6)'})}<i class="ey"></i><span>打开文件夹 …</span></button>
   <div class="fl-rec"><span class="fl-rech">最近 · <em>récents</em></span>${W.recent.map((r,i)=>{const w=Math.min(318,r.length*7.2+52);return `<button type="button" class="fl-rt" data-root="${esc(r)}" style="--r:${[-1.6,1.2,-.8][i%3]}deg;width:${w}px">${dc(w,26,tagD(1,1,w-2,24),{fill:'#F7F4ED',stroke:'#A79E8C'})}<i class="ey"></i><code>${esc(r)}</code></button>`}).join('')}</div>`};

/* ---------------------------------------------------------------- the tree */
const visible=()=>{const out=[];const q=S.q.trim().toLowerCase();
  if(q){const hit=new Map();
    if(Array.isArray(S.searchResults))S.searchResults.forEach(it=>{const n=it&&W.nodes.get(it.path);if(n)hit.set(n.path,it.match_positions||[])});
    else W.nodes.forEach(n=>{if(n.kind!=='file')return;const m=fuzzy(q,n.name);if(m&&m.score>.2)hit.set(n.path,m.pos)});
    const keep=new Set();hit.forEach((_,p)=>{let x=W.nodes.get(p);while(x){keep.add(x.path);x=x.parent?W.nodes.get(x.parent):null}});
    const walk=list=>list.forEach(p=>{if(!keep.has(p))return;const n=W.nodes.get(p);out.push({n,pos:hit.get(p),open:n.kind==='directory'});if(n.children)walk(n.children)});
    walk(W.top);return {rows:out,hits:hit.size}}
  const walk=list=>list.forEach(p=>{const n=W.nodes.get(p);const op=n.kind==='directory'&&S.exp.has(p);out.push({n,open:op});if(op&&n.children)walk(n.children)});
  walk(W.top);return {rows:out,hits:0}};
const MC=document.createElement('canvas').getContext('2d');
const FONT={code:'400 12.5px Tw',md:'italic 700 14.5px CormI',rcpt:'400 12px Tw',img:'400 12.5px Tw',bin:'400 12.5px Tw',plain:'400 12.5px Tw'};
const LEFT={code:32,md:32,rcpt:22,img:36,bin:32,plain:32};
const slipW=(name,st,git)=>{let t;if(st==='md'){MC.font=FONT.md;t=MC.measureText(name).width}else t=name.length*(st==='rcpt'?7.32:7.63);return Math.ceil(LEFT[st]+t+(st==='md'?(git?70:38):(git?42:18))+(st==='code'?6:0))};
const thumbOf=nm=>nm==='lily.png'?IMG.lily:/(end|preview)\.png$/.test(nm)?IMG.shot:nm==='paper-grain.png'?IMG.fmn:IMG.shot;
const rowHTML=(v,i)=>{const n=v.n,d=n.depth,ind=d*16;const git=W.git[n.path];
  if(n.kind==='directory'){const wd=354-ind;
    return `<div class="fl-row d${d} fd${v.open?' open':''}" role="treeitem" aria-expanded="${v.open}" aria-level="${d+1}" tabindex="-1" data-p="${esc(n.path)}" style="--d:${d};margin-left:${ind}px;width:${wd}px">
      ${folderSVG(wd,d,v.open)}<i class="fd-door">${doorSVG()}</i><span class="fd-nm">${v.pos?hl(n.name,v.pos):esc(n.name)}</span>
      <span class="fd-n">${n.child_count!=null?esc(n.child_count):''}<small>件</small></span>${git?sealSVG(git,19):''}</div>`}
  const st=stock(n.name),wd=Math.min(338-ind,Math.max(150,slipW(n.name,st,git)));const tc=W.touched.has(n.path);
  return `<div class="fl-row d${d} sl st-${st}${tc?' kimi':''}${S.pv&&S.pv.path===n.path?' sel':''}" role="treeitem" aria-level="${d+1}" tabindex="-1" data-p="${esc(n.path)}" draggable="false"
     style="--d:${d};margin-left:${ind+6}px;width:${wd}px" title="${esc(n.path)} · ${fmtSize(n.size||0)}">
    ${fileSVG(wd,24,st)}
    ${st==='img'?`<i class="sl-pic"><img src="${thumbOf(n.name)}" alt=""></i>`:`<i class="sl-g">${glyph(st,'file')}</i>`}
    <span class="sl-nm">${v.pos?hl(n.name,v.pos):esc(n.name)}</span>
    ${git?sealSVG(git,20):''}${tc?`<img class="sl-rose" src="${IMG.rose}" alt="">`:''}</div>`};
let rowsMap=new Map();
const renderTree=(stag=true,base=0,soft=false)=>{const {rows,hits}=visible();const prev=new Set(rowsMap.keys());
  rowsEl.innerHTML=rows.map(rowHTML).join('')+(S.q.trim()&&hits?srchHTML(S.q.trim(),hits,rows.filter(v=>v.n.kind==='directory').length):'');rowsMap=new Map([...rowsEl.querySelectorAll('.fl-row')].map(e=>[e.dataset.p,e]));
  let k=0;[...rowsEl.children].forEach((e,i)=>{if(soft){if(!e.dataset.p||!prev.has(e.dataset.p)){e.classList.add('in');e.style.animationDelay=(k++*.03).toFixed(3)+'s'}}else if(stag){e.classList.add('in');e.style.animationDelay=(base+i*.032).toFixed(3)+'s'}});
  const q=S.q.trim();cnt.textContent=q?(hits?hits+' 处':'0'):'';$('flFltWrap').classList.toggle('has',!!q);
  const none=$('flNone');if(q&&!hits&&W.root){none.classList.add('on');none.innerHTML=noneHTML(q)}else{none.classList.remove('on');none.innerHTML=''}
  treeEl.classList.toggle('dim',!!(q&&!hits))};
const srchHTML=(q,h,d)=>`<div class="fl-srch in" style="animation-delay:${(.12+h*.05).toFixed(2)}s">${dc(300,118,labelD(4,1,292,116,10,6),{fill:'#FBF9F4',inner:bracketD(11,6,278,106,6),grain:.18})}
  <div class="ct"><b><em>Recherche</em> · 检索单</b><div class="sr-r"><span>关键词</span><code>${esc(q)}</code></div><div class="sr-r"><span>命中</span><code>${h} 份文件 · ${d} 个文件夹</code></div>
  <div class="sr-r"><span>范围</span><code>文件名 · 模糊 · gitignore 生效</code></div><div class="sr-f">— Enter 打开 · Esc 清除 —</div></div></div>
  <img class="fl-srstk" src="${IMG.horse}" alt="">`;
const noneHTML=q=>`<div class="nm-note">${dc(332,196,rrD(1,1,330,194,4),{fill:'#FBF7F0',stroke:'#A9A08C',inner:rrD(7,7,318,182,2.5),emb:'rgba(169,160,140,.6)',grain:.22,
    extra:`<rect x="268" y="18" width="44" height="52" rx="2" fill="#F1E6EA" stroke="#B9939F" stroke-width=".8"/><rect x="273" y="23" width="34" height="42" rx="1" fill="none" stroke="rgba(185,147,159,.6)" stroke-width=".6"/><path d="M228,38 q8,-5 16,0 t16,0 M228,46 q8,-5 16,0 t16,0" fill="none" stroke="rgba(150,132,104,.5)" stroke-width=".8"/><path d="M166,96 V176" stroke="rgba(169,160,140,.45)" stroke-width=".7"/>`})}
   <div class="ct"><em>Rien trouvé</em><b>查无此卷</b><p class="nm-q">没有文件名像 “<code>${esc(q)}</code>”</p>
   <ul><li><code>.gitignore</code> 忽略的不会出现（如 <code>node_modules/</code>）</li><li>点文件默认隐藏（show_hidden: false）</li><li>想按内容找，回到对话里让 Kimi 用 Grep 搜</li></ul></div></div>
  <img class="nm-bear" src="${IMG.bear}" alt="">
  <button type="button" class="nm-clr" id="flNmClr">${dc(128,32,tagD(1,1,126,30),{fill:'#4E5F8E',stroke:'#3D4C78',inner:tagD(5,4,118,24),emb:'rgba(226,231,243,.6)'})}<i class="ey"></i><span>清除筛选</span></button>`;
/* expand / collapse one folder: its little door swings open and the new die-cuts drop out of it */
const toggle=(path,force)=>{const n=W.nodes.get(path);if(!n||n.kind!=='directory'||S.q.trim())return;const op=force!=null?force:!S.exp.has(path);
  if(op===S.exp.has(path))return;const el=rowsMap.get(path);
  if(op){S.exp.add(path);const {rows}=visible();const idx=rows.findIndex(v=>v.n.path===path);let k=idx+1;const add=[];
    while(k<rows.length&&rows[k].n.depth>n.depth){add.push(rows[k]);k++}
    let ref=el;add.forEach((v,j)=>{const t=document.createElement('div');t.innerHTML=rowHTML(v,idx+1+j);const e=t.firstElementChild;e.classList.add('in','flip');e.style.animationDelay=(.12+j*.045).toFixed(3)+'s';
      ref.after(e);ref=e;rowsMap.set(v.n.path,e)});
    if(el){el.classList.add('open');el.setAttribute('aria-expanded','true')}}
  else{S.exp.delete(path);const kill=[];rowsMap.forEach((e,p)=>{if(p.startsWith(path+'/'))kill.push([p,e])});
    kill.reverse().forEach(([p,e],j)=>{e.classList.remove('in');e.classList.add('out');e.style.animationDelay=(j*.025).toFixed(3)+'s';rowsMap.delete(p);later(.3+j*.025,()=>e.remove())});
    if(el){el.classList.remove('open');el.setAttribute('aria-expanded','false')}}
  mark('toggle:'+path)};
const setFilter=v=>{S.q=v;S.searchResults=null;if(flt.value!==v)flt.value=v;request('fs.search',{workspace:W.root,query:v,limit:50,follow_gitignore:true});renderTree(true,0,true);mark('filter')};

/* ---------------------------------------------------------------- open / close */
const railIts=()=>[...document.querySelectorAll('.rail .grp .it')];
const railFiles=()=>railIts().find(e=>{const x=e.querySelector(':scope>span em');return x&&x.textContent.trim()==='Dossiers'});
const open=(o={})=>{if(S.open)return;S.open=true;mark('open');b.classList.add('fl-open');b.classList.remove('fl-closing');drawer.setAttribute('aria-hidden','false');
  S.prevRail=document.querySelector('.rail .grp .it.on');railIts().forEach(e=>e.classList.remove('on'));const rf=railFiles();if(rf)rf.classList.add('on');
  drawer.classList.remove('land');void drawer.offsetWidth;drawer.classList.add('land');
  if(!W.nodes.size&&W.root!==null&&!o.empty){request('workspace.list',{path:'.',depth:6,show_hidden:false,follow_gitignore:true,include_git_status:true,sort:'type_first'});request('git.status',{})}
  else renderAll(true)};
const close=()=>{if(!S.open)return;S.open=false;mark('close');closePv(true);closeAt();b.classList.remove('fl-open');b.classList.add('fl-closing');drawer.setAttribute('aria-hidden','true');
  later(.45,()=>b.classList.remove('fl-closing'));railIts().forEach(e=>e.classList.remove('on'));if(S.prevRail)S.prevRail.classList.add('on')};
const renderAll=stag=>{drawWs();drawCard();drawEmpty();drawer.classList.toggle('nows',!W.root);treeEl.style.display=W.root?'':'none';$('flFltWrap').style.display=W.root?'':'none';if(W.root)renderTree(stag,.62);else{rowsEl.innerHTML='';$('flNone').classList.remove('on')}};

/* ---------------------------------------------------------------- preview */
const KW=/\b(import|from|export|const|let|var|function|return|if|else|for|of|in|new|type|interface|async|await|while|true|false|null|undefined|as)\b/;
const hlCode=line=>{const out=[];let s=line;const push=(c,t)=>out.push(c?`<span class="${c}">${esc(t)}</span>`:esc(t));
  while(s.length){let m;
    if((m=s.match(/^\/\/.*$/)))push('c',m[0]);else if((m=s.match(/^\/\*\*?.*?(\*\/|$)/)))push('c',m[0]);
    else if((m=s.match(/^(['"`])(?:\\.|(?!\1).)*\1?/)))push('s',m[0]);
    else if((m=s.match(/^\d[\d_.]*/)))push('n',m[0]);
    else if((m=s.match(/^[A-Za-z_$][\w$]*/))){const w=m[0];const after=s.slice(w.length);push(KW.test(w)&&new RegExp('^'+KW.source+'$').test(w)?'k':/^\s*\(/.test(after)?'f':/^[A-Z]/.test(w)?'t':'',w)}
    else if((m=s.match(/^\s+/)))push('',m[0]);else{m=[s[0]];push('p',m[0])}
    s=s.slice(m[0].length)}return out.join('')};
const hlMd=line=>{if(/^#/.test(line))return `<span class="h">${esc(line)}</span>`;if(/^>/.test(line))return `<span class="c">${esc(line)}</span>`;
  return esc(line).replace(/^(\s*[-\d]+\.?)/,'<span class="k">$1</span>').replace(/`([^`]+)`/g,'<span class="s">`$1`</span>')};
const tabBtn=(id,cls,label,w,dark,title='')=>`<button type="button" class="pv-b ${cls}" id="${id}" style="width:${w}px"${title?` title="${title}"`:''}>${dc(w,28,tagD(1,1,w-2,26),dark?{fill:'#4E5F8E',stroke:'#3D4C78',inner:tagD(5,4,w-10,20),emb:'rgba(226,231,243,.6)'}:{fill:'#EEF1F8',stroke:'#8E9BC0',inner:tagD(5,4,w-10,20)})}<i class="ey"></i><span>${label}</span></button>`;
/* the gift box (binary / sealed piece) */
const boxSVG=()=>`<svg class="pv-box" width="250" height="210" viewBox="0 0 250 210" aria-hidden="true">
 <path d="M30,78 H220 V196 Q220,204 212,204 H38 Q30,204 30,196 Z" fill="#E2E7F3" stroke="#7F8FB8" stroke-width="1"/><path d="M38,86 H212 V194 H38 Z" fill="none" stroke="rgba(111,128,168,.5)" stroke-width=".7"/>
 <path d="M20,56 H230 Q236,56 236,62 V82 Q236,88 230,88 H20 Q14,88 14,82 V62 Q14,56 20,56 Z" fill="#EEF1F8" stroke="#7F8FB8" stroke-width="1"/>
 <rect x="112" y="56" width="26" height="148" fill="#F0E2E7" stroke="#B9939F" stroke-width=".8"/><path d="M118,60 V200 M132,60 V200" stroke="rgba(255,255,255,.7)" stroke-width=".8"/>
 <path d="M125,56 C100,20 66,26 78,46 C86,58 108,58 125,56 Z" fill="#F3E7EB" stroke="#B9939F" stroke-width=".9"/><path d="M125,56 C150,20 184,26 172,46 C164,58 142,58 125,56 Z" fill="#F3E7EB" stroke="#B9939F" stroke-width=".9"/>
 <path d="M122,58 C112,76 102,92 94,104 M128,58 C138,76 148,92 156,104" fill="none" stroke="#B9939F" stroke-width="5" stroke-linecap="round" opacity=".55"/>
 <ellipse cx="125" cy="57" rx="9" ry="7" fill="#EBDCE1" stroke="#B9939F" stroke-width=".9"/>
 <path d="M60,150 h70 M60,164 h52" stroke="rgba(111,128,168,.45)" stroke-width=".9"/></svg>`;
const pvHTML=(path,data)=>{const n=W.nodes.get(path)||{name:path.split('/').pop(),size:data.size};const st=stock(n.name);const git=W.git[path];const tc=W.touched.has(path);
  const dir=path.includes('/')?path.slice(0,path.lastIndexOf('/')+1):'';const pw=Math.min(520,(path.length)*8.6+56);
  const head=`<div class="pv-hd"><span class="pv-path" style="width:${pw}px">${dc(pw,32,bookmarkD(1,1,pw-2,30,10),{fill:'#5A6A98',stroke:'#46557F',inner:bookmarkD(5,4.5,pw-10,23,7),emb:'rgba(226,231,243,.55)'})}<span><i>${esc(dir)}</i>${esc(n.name)}</span></span>
    <div class="pv-meta">${esc((data.language_id||data.mime||'').replace('typescript','TypeScript').replace('markdown','Markdown'))} · ${fmtSize(data.size||0)}${data.line_count?` · ${esc(data.line_count)} 行`:''} · ${data.is_binary?'二进制':esc(data.encoding||'utf-8')}</div>
    <div class="pv-acts">${tabBtn('flIns','pv-ins','插入到对话 <b>@</b>',150,true,'在输入框插入 @'+esc(path))}${tabBtn('flEd','pv-ed','在编辑器打开 <small>VS Code ▾</small>',196,false,'fs:open-in · app_id: vscode')}${tabBtn('flCp','pv-cp','复制路径',104,false)}</div>
    <button type="button" class="pv-x" id="flPvX" aria-label="关闭预览"><svg width="38" height="38" viewBox="-19 -19 38 38" aria-hidden="true"><circle r="15.5" fill="#FBF9F4" stroke="#7F8FB8" stroke-width=".9"/><circle r="12.2" fill="none" stroke="rgba(111,128,168,.5)" stroke-width=".7"/></svg><span>✕</span></button></div>`;
  let body='';
  if(data.is_binary||data.error){const big=(data.size||0)>10485760;const isImg=st==='img'&&!big;
    if(isImg)body=`<div class="pv-img"><div class="pv-pol">${dc(380,440,waveD(4,4,372,432,30,4),{fill:'#FEFDFB',stroke:'#9AA8C8',inner:rrD(14,14,352,412,4),dash:'6 4'})}<img src="${n.name==='lily.png'?IMG.lily:IMG.shot}" alt=""><span><em>${esc(n.name)}</em><b>${fmtSize(data.size)} · ${esc(data.mime)}</b></span></div></div>`;
    else body=`<div class="pv-bin">${boxSVG()}<i class="pv-binseal">${sealSVG('untracked',64).replace('>?<','>✦<')}</i><img class="pv-slip" src="${IMG.slip}" alt="">
      <div class="pv-binrc">${dc(230,104,labelD(4,1,222,102,9,6),{fill:'#F6F3FA',stroke:'#8E9BC0',inner:bracketD(11,6,208,92,6)})}<div class="ct"><b>fs:stat</b><span>size&nbsp;&nbsp;${esc(data.size)}</span><span>mime&nbsp;&nbsp;${esc(data.mime)}</span><span>is_binary&nbsp;&nbsp;true · etag ${esc(String(data.etag||'').replace(/["W\/]/g,''))}</span></div></div>
      <div class="pv-binx"><em>Pièce scellée</em><b>这份文件不能在这里展开</b>
      <ul>${big?`<li><span>❦</span>${fmtSize(data.size)}，超过单次读取上限 10 MiB（fs:read · 41302）</li>`:''}<li><span>❦</span>二进制内容（is_binary: true），不以文本显示</li><li><span>❦</span>仍可 <code>@</code> 引用，交给 Kimi 用工具读取</li></ul>
      <div class="pv-binb">${tabBtn('flOpenSys','','用系统程序打开',150,false)}${tabBtn('flReveal','','在文件夹中显示',150,false)}</div></div></div>`}
  else{const lines=data.content.replace(/\n$/,'').split('\n');const md=st==='md';
    body=`<div class="pv-code${md?' md':''}" id="flCode">${lines.map((l,i)=>`<div class="ln${!md&&tc&&KIMI_LINES.has(i+1)?' kim':''}"><b>${i+1}</b><code>${(md?hlMd(l):hlCode(l))||' '}</code></div>`).join('')}</div>`}
  const rc=`<div class="pv-rc"><svg class="rc-str" width="60" height="40" viewBox="0 0 60 40" aria-hidden="true"><path d="M4,2 C18,4 30,18 44,30" fill="none" stroke="#8393B4" stroke-width="1" stroke-linecap="round"/></svg>
    <span class="rc-tag">${dc(170,60,tagD(1,1,168,58),{fill:'#F6F3FA',stroke:'#8E9BC0',inner:tagD(5,4.5,160,49)})}<i class="ey"></i><span class="ct"><b>fs:read</b><span>${data.is_binary?'—':fmtSize(Math.min(data.size||0,1048576))+' / 1 MiB'}</span><span>etag ${esc(String(data.etag||'').replace(/["W\/]/g,'').slice(0,8))}</span></span></span></div>`;
  const SW=800,SH=708,fr=`<rect x="20" y="20" width="${SW-40}" height="${SH-40}" fill="none" stroke="rgba(111,128,168,.5)" stroke-width=".8"/><rect x="26" y="26" width="${SW-52}" height="${SH-52}" fill="none" stroke="#fff" stroke-width="1.2" transform="translate(.5,.7)"/><rect x="26" y="26" width="${SW-52}" height="${SH-52}" fill="none" stroke="rgba(111,128,168,.4)" stroke-width=".6"/>`+
    curl(30,30,1.15,0,'rgba(111,128,168,.6)')+curl(SW-30,30,1.15,90,'rgba(111,128,168,.6)')+curl(SW-30,SH-30,1.15,180,'rgba(111,128,168,.6)')+curl(30,SH-30,1.15,270,'rgba(111,128,168,.6)');
  return `<div class="pv-layer l1">${dc(SW,SH,bracketD(1,1,SW-2,SH-2,22),{fill:'rgba(242,245,251,.62)',stroke:'rgba(160,172,204,.7)',inner:bracketD(14,14,SW-28,SH-28,16)})}</div>
   <div class="pv-layer l2">${dc(SW-10,SH,labelD(4,1,SW-18,SH-2,20,12),{fill:'#CBD3E8',stroke:'#8D9BC0',grain:.5})}</div>
   <div class="pv-sheet${data.is_binary?' bin':''}">${dc(SW,SH,bracketD(1,1,SW-2,SH-2,16),{fill:st==='md'?'#FBF7F0':'#FBFAF6',stroke:'#98A5C6',grain:.3,extra:fr})}<span class="pv-wm">Aperçu</span>
    <div class="ct">${head}${body}</div></div>
   <img class="pv-bow" src="${IMG.bow}" alt=""><img class="pv-lily" src="${IMG.lily}" alt="">
   ${git?`<i class="pv-seal">${sealSVG(git,58)}<span>${git==='modified'?'modifié · 改动':git==='added'?'nouveau · 新增':'inconnu · 未跟踪'}</span></i>`:''}
   ${tc?`<span class="pv-kim"><img src="${IMG.rose}" alt=""><span class="pv-rib"><svg width="250" height="26" viewBox="0 0 250 26" aria-hidden="true"><path d="M0,3 H250 L242,13 L250,23 H0 L8,13 Z" fill="#F2E6EA" stroke="#C3A2AE" stroke-width=".8"/><path d="M10,6.5 H240 M10,19.5 H240" stroke="rgba(255,255,255,.8)" stroke-width=".8"/></svg><b>Kimi 本轮改过 · 浅蓝底为改动行</b></span></span>`:''}
   ${!data.is_binary?rc:''}`};
const openPv=path=>{const n=W.nodes.get(path);if(!n||n.kind!=='file')return;S.sel=path;
  rowsMap.forEach((e,p)=>e.classList.toggle('sel',p===path));
  const show=data=>{S.pv={path,t:now(),data};pvEl.innerHTML=pvHTML(path,data);pvEl.classList.remove('off');void pvEl.offsetWidth;pvEl.classList.add('on');pvEl.setAttribute('aria-hidden','false');b.classList.add('fl-pv-open');placePv();mark('preview:'+path)};
  if(S.fileCache[path])show(S.fileCache[path]);else{S.pendingPv=path;request('file.read',{path,offset:0,length:1048576,encoding:'auto'})}};
const closePv=instant=>{if(!S.pv)return;const was=S.pv.path;S.pv=null;b.classList.remove('fl-pv-open');pvEl.setAttribute('aria-hidden','true');
  if(instant){pvEl.classList.remove('on','off')}else{pvEl.classList.remove('on');pvEl.classList.add('off');later(.34,()=>{if(!S.pv)pvEl.classList.remove('off')})}
  rowsMap.forEach(e=>e.classList.remove('sel'));mark('pvclose:'+was)};
const placePv=()=>{const fr=field.getBoundingClientRect();const top=22,bottom=Math.min(fr.top-26,792);const h=Math.max(420,bottom-top);pvEl.style.setProperty('--pvh',h+'px');pvEl.style.top=top+'px'};

/* ---------------------------------------------------------------- chips (round-head hang tags on a thin string) */
const chipHTML=(c,i)=>{const nm=c.kind==='directory'?c.path.replace(/\/$/,'').split('/').pop()+'/':c.path.split('/').pop();
  return `<span class="fl-chip ${c.kind==='directory'?'dir':'file'} st-${c.kind==='directory'?'dir':stock(nm)}" data-i="${i}" title="@${esc(c.path)}" style="--r:${[-2.2,1.6,-1.2,2][i%4]}deg">
   <svg class="ch-str" width="16" height="22" viewBox="0 0 16 22" aria-hidden="true"><path d="M15,11 C9,9 6,3 2,2" fill="none" stroke="#8393B4" stroke-width=".9" stroke-linecap="round"/></svg>
   <i class="ch-ey"></i><b>@${esc(nm)}</b><button type="button" class="ch-x" aria-label="移除 @${esc(c.path)}">×</button></span>`};
const drawChips=fresh=>{chipsEl.innerHTML=S.chips.map(chipHTML).join('');if(fresh!=null){const e=chipsEl.children[fresh];if(e)e.classList.add('swing')}
  const w=S.chips.length?chipsEl.getBoundingClientRect().width+8:0;ci.style.paddingLeft=w?w+'px':'';ci.style.paddingRight=w?'64px':'';field.classList.toggle('fl-has',S.chips.length>0||!!ci.value)};
const addChip=(path,kind,from)=>{path=kind==='directory'&&!path.endsWith('/')?path+'/':path;if(S.chips.some(c=>c.path===path)){mark('chipdup');return}
  S.chips.push({path,kind});S.recent=[path.replace(/\/$/,''),...S.recent.filter(p=>p!==path.replace(/\/$/,''))].slice(0,5);
  request('mention.insert',{path,kind});drawChips(S.chips.length-1);mark('chip:'+path);
  if(from&&!RM()){const tg=chipsEl.children[S.chips.length-1].getBoundingClientRect();flyTo(from,tg,path)}};
const removeChip=i=>{S.chips.splice(i,1);drawChips();mark('chipx')};
chipsEl.addEventListener('click',e=>{const x=e.target.closest('.ch-x');if(x){e.stopPropagation();removeChip(+x.closest('.fl-chip').dataset.i)}});
const flyTo=(fr,tg,path)=>{fly.innerHTML=`<span>@${esc(path.split('/').filter(Boolean).pop())}</span>`;fly.style.display='block';
  const a=fly.animate([{transform:`translate(${fr.left}px,${fr.top}px) rotate(-6deg) scale(1)`,opacity:1},{transform:`translate(${(fr.left+tg.left)/2}px,${Math.min(fr.top,tg.top)-90}px) rotate(8deg) scale(.95)`,opacity:1,offset:.5},
    {transform:`translate(${tg.left}px,${tg.top}px) rotate(0deg) scale(.8)`,opacity:.2}],{duration:620,easing:'cubic-bezier(.3,.7,.3,1)',fill:'forwards'});
  a.onfinish=()=>{fly.style.display='none';a.cancel()};setTimeout(()=>{fly.style.display='none'},700)};

/* ---------------------------------------------------------------- @ picker: a stack of die-cut label cards */
const atState=q=>{const items=suggest(q,7);const rec=q?[]:S.recent.map(p=>{const n=W.nodes.get(p);return n?{path:n.kind==='directory'?p+'/':p,name:n.name,kind:n.kind,recent:true,match_positions:[]}:null}).filter(Boolean).slice(0,3);
  const seen=new Set(rec.map(r=>r.path));let list=[...rec,...items.filter(i=>!seen.has(i.path))];
  if(q&&q.includes('/')){const ql=q.toLowerCase();list.sort((a,b)=>(b.path.toLowerCase().startsWith(ql)&&b.kind==='directory'?1:0)-(a.path.toLowerCase().startsWith(ql)&&a.kind==='directory'?1:0)||(a.kind==='directory'?0:1)-(b.kind==='directory'?0:1)||b.score-a.score)}
  else if(q){const recSet=new Set(S.recent);list.sort((a,b)=>(recSet.has(b.path)?1:0)-(recSet.has(a.path)?1:0)||b.score-a.score);list=list.map(i=>({...i,recent:recSet.has(i.path)}))}
  return list.slice(0,6)};
const atHTML=()=>{const A=S.at;const L=A.items;let rows='';let secR=false,secM=false;
  L.forEach((it,i)=>{const isDir=it.kind==='directory';const nm=it.path.replace(/\/$/,'').split('/').pop()+(isDir?'/':'');const dir=it.path.replace(/\/$/,'').split('/').slice(0,-1).join('/');
    const off=it.path.length-(isDir?1:0)-(nm.length-(isDir?1:0));const on=i===A.sel;
    if(it.recent&&!secR){secR=true;rows+=`<div class="at-sec" style="--i:${i}"><span>最近使用</span><em>récents</em></div>`}
    if(!it.recent&&!secM){secM=true;rows+=`<div class="at-sec" style="--i:${i}"><span>${A.q?'匹配':'工作区'}</span><em>${A.q?'résultats':'dossiers'}</em></div>`}
    rows+=`<div class="at-card${on?' on':''}${isDir?' dir':''}" role="option" aria-selected="${on}" data-i="${i}" style="--i:${i};--r:${[-1,.7,-.5,.9,-.8,.5][i%6]}deg">
      ${dc(368,42,labelD(4,1,360,40,8,5),{fill:on?'#FFFFFF':isDir?'#F7F4ED':'#FBF9F4',stroke:on?'#5A6A98':isDir?'#A79E8C':C.line,sw:on?1.2:.9,inner:bracketD(11,5,346,32,5),emb:isDir?'rgba(167,158,140,.6)':C.emb})}
      <i class="at-g">${glyph(isDir?'':stock(nm),it.kind)}</i><span class="at-nm">${hl(nm,it.match_positions,off)}</span><span class="at-dir">${esc(dir?dir+'/':'./')}</span>
      ${isDir?`<span class="at-k">文件夹 · Tab 进入</span>`:it.recent?`<span class="at-k r">最近</span>`:''}${W.git[it.path]?sealSVG(W.git[it.path],18):''}
      ${on?`<i class="at-ear"><svg width="16" height="20" viewBox="0 0 16 20" aria-hidden="true"><path d="M8,0 C6,6 10,10 8,20" fill="none" stroke="#8393B4" stroke-width=".9"/></svg><span>Enter ↵</span></i>`:''}</div>`});
  if(!L.length)rows=`<div class="at-nil"><em>Rien</em><b>没有匹配 “${esc(A.q)}” 的路径</b><small>.gitignore 里的文件不会出现</small></div>`;
  return `<div class="at-box">${dc(396,58,labelD(4,1,388,56,12,7),{fill:'#5A6A98',stroke:'#46557F',inner:bracketD(13,7,370,44,7),emb:'rgba(226,231,243,.5)'})}<img class="at-bow" src="${IMG.bow}" alt=""><span class="at-q"><b>@</b>${esc(A.q)}<i class="at-caret"></i></span><span class="at-src">workspace/fs:suggest</span></div>
   <div class="at-cards">${dc(392,400,bracketD(1,1,390,398,14),{cls:'at-vel',fill:'rgba(247,249,252,.95)',stroke:'rgba(160,172,204,.8)',inner:bracketD(8,8,376,384,10)})}${rows}</div>
   <div class="at-foot">${dc(384,30,bookmarkD(1,1,382,28,9),{fill:'#EEF1F8',stroke:'#8E9BC0',inner:bookmarkD(5,4.5,372,21,6)})}<span><kbd>↑↓</kbd> 选择 · <kbd>Enter</kbd> 插入 · <kbd>Tab</kbd> 进入文件夹 · <kbd>Esc</kbd> 关闭</span></div>`};
const placeAt=()=>{const fr=field.getBoundingClientRect();atEl.style.left=(fr.left+34)+'px';atEl.style.bottom=(innerHeight-fr.top+6)+'px'};
const sizeAt=()=>{const c=atEl.querySelector('.at-cards');const v=c&&c.querySelector('.at-vel');if(!v)return;const ks=[...c.children].filter(k=>k!==v);const last=ks[ks.length-1];const h=Math.max(60,last?last.offsetTop+last.offsetHeight+12:60);v.setAttribute('height',h);v.setAttribute('viewBox',`0 0 392 ${h}`);
  const ps=v.querySelectorAll('path');ps[0].setAttribute('d',bracketD(1,1,390,h-2,14));if(ps[1])ps[1].setAttribute('d',bracketD(8,8,376,h-16,10));if(ps[2])ps[2].setAttribute('d',bracketD(8,8,376,h-16,10))};
const openAt=q=>{const fresh=!S.at;S.at={q,sel:0,items:atState(q),t:now()};request('fs.suggest',{workspace:W.root||ROOT_WIN,query:q,limit:50,follow_gitignore:true,show_hidden:false});
  atEl.innerHTML=atHTML();sizeAt();placeAt();atEl.setAttribute('aria-hidden','false');if(fresh){atEl.classList.remove('on');void atEl.offsetWidth}atEl.classList.add('on');atEl.classList.toggle('fan',fresh);mark('at:'+q)};
const updAt=()=>{if(!S.at)return;atEl.innerHTML=atHTML();sizeAt();atEl.classList.remove('fan')};
const closeAt=()=>{if(!S.at)return;S.at=null;atEl.classList.remove('on','fan');atEl.setAttribute('aria-hidden','true');mark('atclose')};
const atToken=()=>{const v=ci.value,c=ci.selectionStart==null?v.length:ci.selectionStart;const m=v.slice(0,c).match(/(^|\s)@([^\s@]*)$/);return m?{q:m[2],start:c-m[2].length-1,end:c}:null};
const atPick=(i,drill)=>{if(!S.at)return;const it=S.at.items[i==null?S.at.sel:i];if(!it)return;const tok=atToken();
  if(drill&&it.kind==='directory'){const v=ci.value;const s=tok?tok.start:v.length;ci.value=v.slice(0,s)+'@'+it.path+v.slice(tok?tok.end:v.length);const c=s+1+it.path.length;ci.setSelectionRange(c,c);openAt(it.path);return}
  const v=ci.value;if(tok)ci.value=(v.slice(0,tok.start)+v.slice(tok.end)).replace(/\s{2,}/g,' ');closeAt();addChip(it.path,it.kind);mark('atpick:'+it.path);ci.focus({preventScroll:true})};
ci.addEventListener('input',()=>{field.classList.toggle('fl-has',S.chips.length>0||!!ci.value);const tok=atToken();if(tok){if(!S.at)openAt(tok.q);else if(tok.q!==S.at.q){S.at.q=tok.q;S.at.items=atState(tok.q);S.at.sel=0;request('fs.suggest',{workspace:W.root||ROOT_WIN,query:tok.q,limit:50,follow_gitignore:true,show_hidden:false});updAt()}}else closeAt()});
ci.addEventListener('keydown',e=>{
  if(S.at){if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();e.stopImmediatePropagation();const n=S.at.items.length;if(n){S.at.sel=(S.at.sel+(e.key==='ArrowDown'?1:-1)+n)%n;updAt();mark('atsel:'+S.at.sel)}return}
    if(e.key==='Enter'||e.key==='Tab'){e.preventDefault();e.stopImmediatePropagation();atPick(null,e.key==='Tab');return}
    if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();closeAt();return}}
  if(e.key==='Backspace'&&!ci.value&&S.chips.length&&ci.selectionStart===0){e.preventDefault();removeChip(S.chips.length-1);return}
  if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&S.chips.length){e.preventDefault();e.stopImmediatePropagation();sendWithChips()}},true);
atEl.addEventListener('mousedown',e=>{const c=e.target.closest('.at-card');if(c){e.preventDefault();atPick(+c.dataset.i)}});
if(atPill)atPill.addEventListener('click',e=>{e.stopPropagation();const v=ci.value;ci.value=v+(v&&!/\s$/.test(v)?' ':'')+'@';ci.focus({preventScroll:true});ci.setSelectionRange(ci.value.length,ci.value.length);ci.dispatchEvent(new Event('input'))});
const sendWithChips=()=>{const txt=[...S.chips.map(c=>'@'+c.path),ci.value.trim()].filter(Boolean).join(' ');if(!txt)return;mark('send');
  const rk=window.__rk;S.chips=[];drawChips();if(rk)rk.sendNow(txt||undefined);
  setTimeout(()=>{const ub=$('rkUb');if(ub&&/@\S/.test(ub.textContent))ub.innerHTML=esc(ub.textContent).replace(/(^|\s)@(\S+)/g,'$1<span class="fl-mt">@$2</span>')},60)};
send.addEventListener('click',e=>{if(S.chips.length){e.stopImmediatePropagation();sendWithChips()}},true);

/* ---------------------------------------------------------------- dragging a die-cut into the composer: an embossed scalloped doily frame */
const drawDropPos=()=>{const fr=field.getBoundingClientRect();dropEl.style.left=(fr.left+2)+'px';dropEl.style.top=(fr.top-7)+'px'};
const drawDrop=()=>{const fr=field.getBoundingClientRect();const w=fr.width-4,h=fr.height+14;dropEl.style.left=(fr.left+2)+'px';dropEl.style.top=(fr.top-7)+'px';dropEl.style.width=w+'px';dropEl.style.height=h+'px';
  dropEl.querySelector('.dz').outerHTML=`<svg class="dz" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path class="dz-o" d="${waveD(4,4,w-8,h-8,34,5)}" fill="rgba(251,250,247,.9)" stroke="#8E9BC0" stroke-width="1"/>
   <path class="dz-i" d="${bracketD(14,12,w-28,h-24,10)}" fill="none" stroke="#5A6A98" stroke-width="1.4" stroke-dasharray="9 6"/>
   ${curl(18,16,.8,0,'rgba(90,106,152,.6)')}${curl(w-18,16,.8,90,'rgba(90,106,152,.6)')}${curl(w-18,h-16,.8,180,'rgba(90,106,152,.6)')}${curl(18,h-16,.8,270,'rgba(90,106,152,.6)')}</svg>`};
const overField=(x,y)=>{const r=field.getBoundingClientRect();return x>=r.left-10&&x<=r.right+10&&y>=r.top-20&&y<=r.bottom+10};
const dragStart=(path,x,y)=>{const n=W.nodes.get(path);if(!n)return;S.drag={path,kind:n.kind,x,y,over:false,t:now()};mark('drag');const st=stock(n.name),gw=Math.max(160,slipW(n.name,st,false)+10);
  ghost.style.width=gw+'px';ghost.className='fl-ghost st-'+st;ghost.innerHTML=`${fileSVG(gw,26,st)}<i class="sl-g">${glyph(st,n.kind)}</i><span class="sl-nm">${esc(n.name)}</span>`;ghost.classList.add('on');
  const row=rowsMap.get(path);if(row)row.classList.add('lifted');drawDrop();dropEl.classList.add('on');b.classList.add('fl-dragging');dragMove(x,y)};
const dragMove=(x,y)=>{if(!S.drag)return;S.drag.x=x;S.drag.y=y;const ov=overField(x,y);if(ov!==S.drag.over){S.drag.over=ov;dropEl.classList.toggle('over',ov);if(ov)mark('dragover')}
  ghost.style.transform=`translate(${x-26}px,${y-14}px) rotate(${ov?-2:-7}deg) scale(${ov?.96:1.04})`};
const dragEnd=()=>{if(!S.drag)return;const D=S.drag;S.drag=null;ghost.classList.remove('on');dropEl.classList.remove('on','over');b.classList.remove('fl-dragging');
  const row=rowsMap.get(D.path);if(row)row.classList.remove('lifted');if(D.over)addChip(D.path,D.kind);mark('drop:'+(D.over?'ok':'cancel'))};
let pd0=null;
rowsEl.addEventListener('pointerdown',e=>{const r=e.target.closest('.fl-row');if(!r)return;pd0={p:r.dataset.p,x:e.clientX,y:e.clientY,moved:false}});
addEventListener('pointermove',e=>{if(pd0&&!S.drag&&Math.hypot(e.clientX-pd0.x,e.clientY-pd0.y)>6){pd0.moved=true;dragStart(pd0.p,e.clientX,e.clientY)}if(S.drag)dragMove(e.clientX,e.clientY)});
addEventListener('pointerup',()=>{if(S.drag)dragEnd();setTimeout(()=>{pd0=null},0)});
addEventListener('dragover',e=>{if(!S.open)return;e.preventDefault();if(!dropEl.classList.contains('on')){drawDrop();dropEl.classList.add('on')}dropEl.classList.toggle('over',overField(e.clientX,e.clientY))});
addEventListener('dragleave',e=>{if(e.relatedTarget==null){dropEl.classList.remove('on','over')}});
addEventListener('drop',e=>{e.preventDefault();dropEl.classList.remove('on','over')});

/* ---------------------------------------------------------------- clicks, keys */
rowsEl.addEventListener('click',e=>{if(pd0&&pd0.moved)return;const r=e.target.closest('.fl-row');if(!r)return;const p=r.dataset.p;const n=W.nodes.get(p);
  if(n.kind==='directory')toggle(p);else openPv(p)});
root.addEventListener('click',e=>{const t=e.target;
  if(t.closest('#flX'))close();else if(t.closest('#flFx')||t.closest('#flNmClr')){setFilter('');flt.focus({preventScroll:true})}
  else if(t.closest('#flPvX'))closePv();
  else if(t.closest('#flIns')&&S.pv){const fr=t.closest('#flIns').getBoundingClientRect();const p=S.pv.path;closePv();addChip(p,'file',fr)}
  else if(t.closest('#flEd')&&S.pv){request('file.openIn',{path:S.pv.path,app_id:'vscode',line:1});stampAct('#flEd','已交给 VS Code')}
  else if(t.closest('#flCp')&&S.pv){request('file.copyPath',{path:S.pv.path,absolute:false});try{navigator.clipboard&&navigator.clipboard.writeText(S.pv.path)}catch(_){}stampAct('#flCp','已复制')}
  else if(t.closest('#flOpenSys')&&S.pv){request('file.open',{path:S.pv.path});stampAct('#flOpenSys','已打开')}
  else if(t.closest('#flReveal')&&S.pv){request('file.reveal',{path:S.pv.path});stampAct('#flReveal','已显示')}
  else if(t.closest('#flPick'))request('workspace.pick',{});
  else{const rt=t.closest('.fl-rt');if(rt)request('workspace.open',{root:rt.dataset.root})}});
const stampAct=(sel,txt)=>{const e=root.querySelector(sel);if(!e)return;const s=document.createElement('i');s.className='pv-ok';s.textContent=txt;e.appendChild(s);setTimeout(()=>s.remove(),1500);mark('act:'+txt)};
flt.addEventListener('input',()=>setFilter(flt.value));
flt.addEventListener('keydown',e=>{if(e.key==='Escape'&&flt.value){e.preventDefault();e.stopPropagation();setFilter('')}else if(e.key==='ArrowDown'){e.preventDefault();const f=rowsEl.querySelector('.fl-row');if(f)f.focus()}});
treeEl.addEventListener('keydown',e=>{const r=document.activeElement&&document.activeElement.closest('.fl-row');if(!r)return;const all=[...rowsEl.querySelectorAll('.fl-row:not(.out)')];const i=all.indexOf(r);const p=r.dataset.p,n=W.nodes.get(p);
  if(e.key==='ArrowDown'&&all[i+1]){e.preventDefault();all[i+1].focus()}else if(e.key==='ArrowUp'){e.preventDefault();(all[i-1]||flt).focus()}
  else if(e.key==='ArrowRight'&&n.kind==='directory'){e.preventDefault();toggle(p,true)}else if(e.key==='ArrowLeft'){e.preventDefault();if(n.kind==='directory'&&S.exp.has(p))toggle(p,false);else if(n.parent){const pe=rowsMap.get(n.parent);if(pe)pe.focus()}}
  else if(e.key==='Enter'||e.key===' '){e.preventDefault();n.kind==='directory'?toggle(p):openPv(p)}});
addEventListener('keydown',e=>{if(e.key!=='Escape'||!S.open)return;if(S.at||document.activeElement===ci)return;e.preventDefault();e.stopPropagation();if(S.pv)closePv();else close()},true);
const rf=railFiles();if(rf)rf.addEventListener('click',()=>{S.open?close():open()});
addEventListener('resize',()=>{if(S.pv)placePv();if(S.at)placeAt()});
const follow=()=>{if(S.at)placeAt();if(S.drag)drawDropPos();requestAnimationFrame(follow)};requestAnimationFrame(follow);

/* ---------------------------------------------------------------- back end → page */
const emit=(type,p={})=>{marks['ev:'+type]=now();
  if(type==='workspace.tree'){S.searchResults=null;loadTree(p);if(S.open)renderAll(true)}
  else if(type==='git.status'){W.branch=p.branch||'';W.ahead=p.ahead||0;W.behind=p.behind||0;W.git={};Object.entries(p.entries||{}).forEach(([k,v])=>{if(v!=='clean')W.git[k]=v});
    if(!W.touched.size)MOCK_TOUCHED.forEach(x=>W.touched.add(x));if(S.open&&W.root){drawWs();rowsMap.forEach((e,k)=>{const v=visible().rows.find(r=>r.n.path===k);if(!v)return;const t=document.createElement('div');t.innerHTML=rowHTML(v,0);const ne=t.firstElementChild;
      if(e.classList.contains('in')){ne.classList.add('in');ne.style.animationDelay=e.style.animationDelay}e.replaceWith(ne);rowsMap.set(k,ne)})}}
  else if(type==='agent.touched'){(p.paths||[]).forEach(x=>W.touched.add(x));if(S.open)renderTree(false)}
  else if(type==='file.content'){S.fileCache[p.path]=p;if(S.pendingPv===p.path){S.pendingPv=null;openPv(p.path)}}
  else if(type==='fs.suggest'){if(S.at&&p.query===S.at.q&&p.items&&p.items!==S.at.items&&api.onRequest){S.at.items=p.items.slice(0,6);updAt()}}
  else if(type==='fs.search'){if(p.query!==S.q)return;S.searchResults=Array.isArray(p.items)?p.items:[];if(S.open)renderTree(true,0,true)}};

/* ---------------------------------------------------------------- scenes */
const settle=()=>b.classList.add('fl-still');
const boot0=()=>{loadTree(buildMock());W.branch=MOCK_GIT.branch;W.ahead=MOCK_GIT.ahead;W.git={...MOCK_GIT.entries};delete W.git.clean;MOCK_TOUCHED.forEach(x=>W.touched.add(x));S.fileCache={}};
const SC={
  files:()=>{boot0();S.exp=new Set(['docs','tests']);open()},
  'files-search':()=>{boot0();open();setFilter('stream')},
  'files-nomatch':()=>{boot0();open();setFilter('lacework')},
  preview:()=>{boot0();S.exp=new Set(['src','src/renderer']);open();S.fileCache['src/renderer/stream.ts']=contentOf('src/renderer/stream.ts');openPv('src/renderer/stream.ts')},
  'preview-bin':()=>{boot0();S.exp=new Set(['design','design/demo','src']);open();S.fileCache['design/demo/rococo_v1.mp4']=contentOf('design/demo/rococo_v1.mp4');openPv('design/demo/rococo_v1.mp4')},
  at:()=>{boot0();S.exp=new Set(['src','src/renderer']);open();addChip('src/renderer/stream.ts','file');ci.value='再看下 @str';ci.focus({preventScroll:true});ci.setSelectionRange(ci.value.length,ci.value.length);ci.dispatchEvent(new Event('input'));if(S.at){S.at.sel=1;updAt()}},
  'at-folder':()=>{boot0();S.exp=new Set(['src','src/renderer']);open();ci.value='把 @src/rend';ci.focus({preventScroll:true});ci.setSelectionRange(ci.value.length,ci.value.length);ci.dispatchEvent(new Event('input'))},
  drag:()=>{boot0();S.exp=new Set(['docs','tests']);open();addChip('src/renderer/stream.ts','file');addChip('tests/stream.test.ts','file');
    setTimeout(()=>{const fr=field.getBoundingClientRect();dragStart('docs/HANDOFF-NEXT.md',fr.left+fr.width*.8,fr.top+26)},1500)},
  compose:()=>{boot0();S.exp=new Set(['src','src/renderer']);open();setTimeout(()=>{addChip('src/renderer/stream.ts','file');addChip('tests/stream.test.ts','file');addChip('docs/HANDOFF-NEXT.md','file');ci.value='按帧批量提交，别重复插入。';ci.dispatchEvent(new Event('input'));ci.focus({preventScroll:true})},900)},
  'empty-ws':()=>{loadTree({root:null,recent_roots:MOCK_RECENT});open({empty:true})}};

/* ---------------------------------------------------------------- #play */
const D={x:760,y:560,vis:0,press:-9};
const cur=()=>$('rkCur');
window.__demoXY=()=>[D.x,D.y,now()-D.press<.12?1:0];
const Pt=(el,fx=.5,fy=.5)=>{if(!el)return [D.x,D.y];const r=el.getBoundingClientRect();return [r.left+r.width*fx,r.top+r.height*fy]};
const press=el=>{D.press=now();if(el)el.click()};
const row=p=>rowsMap.get(p);
const sm=u=>{u=cl(u);return u*u*(3-2*u)};
const typeInto=(el,txt,base)=>u=>{const n=Math.round(txt.length*cl(u));const v=base+txt.slice(0,n);if(el.value!==v){el.value=v;el.setSelectionRange&&el.setSelectionRange(v.length,v.length);el.dispatchEvent(new Event('input'))}};
const key=k=>{ci.dispatchEvent(new KeyboardEvent('keydown',{key:k,bubbles:true,cancelable:true}))};
let base1='';
const STEPS=[
 {d:.5,show:1},
 {to:()=>{const r=railFiles();return [7,r?Pt(r)[1]:300]},d:1.0},
 {d:.75},
 {to:()=>Pt(railFiles()),d:.7},
 {d:.45},
 {act:()=>{press(railFiles())}},
 {to:()=>[640,420],d:.9},
 {d:1.6},
 {to:()=>Pt(row('docs'),.22,.4),d:.85},
 {d:.3,act:()=>press(row('docs'))},
 {d:1.3},
 {to:()=>Pt(flt,.3),d:.8},
 {d:.25,act:()=>{press(flt);flt.focus({preventScroll:true})}},
 {d:1.1,tick:typeInto(flt,'stream','')},
 {d:1.1},
 {to:()=>Pt(row('src/renderer/stream.ts'),.4),d:.8},
 {d:.3,act:()=>press(row('src/renderer/stream.ts'))},
 {d:1.0},
 {to:()=>Pt($('flCode'),.55,.42),d:1.0},
 {d:1.0},
 {to:()=>Pt($('flIns'),.45),d:.8},
 {d:.35,act:()=>press($('flIns'))},
 {d:1.0},
 {to:()=>Pt($('flFx')),d:.8},
 {d:.3,act:()=>press($('flFx'))},
 {d:.9},
 {to:()=>{const r=field.getBoundingClientRect();return [r.left+r.width*.55,r.top+30]},d:.85},
 {d:.25,act:()=>{press(null);ci.focus({preventScroll:true});base1=ci.value}},
 {d:.3,tick:u=>typeInto(ci,'@',base1)(u)},
 {d:.75},
 {d:.8,tick:u=>typeInto(ci,'test',base1+'@')(u)},
 {d:.9},
 {d:.45,act:()=>key('ArrowDown')},
 {d:.5,act:()=>key('ArrowUp')},
 {d:.6,act:()=>key('Enter')},
 {d:.8},
 {to:()=>Pt(row('docs/HANDOFF-NEXT.md'),.42),d:.9},
 {d:.35,act:()=>{D.press=now()}},
 {d:.12,act:()=>{dragStart('docs/HANDOFF-NEXT.md',D.x,D.y)}},
 {to:()=>{const r=field.getBoundingClientRect();return [r.left+r.width*.8,r.top+28]},d:1.15,tick:()=>dragMove(D.x,D.y)},
 {d:.5,tick:()=>dragMove(D.x,D.y)},
 {d:.2,act:()=>{D.press=now();dragEnd()}},
 {d:.8},
 {to:()=>{const r=field.getBoundingClientRect();return [r.left+r.width*.78,r.top+30]},d:.5},
 {d:.2,act:()=>{ci.focus({preventScroll:true});base1=ci.value}},
 {d:1.4,tick:u=>typeInto(ci,'按帧批量提交，别重复插入。',base1)(u)},
 {d:.45},
 {to:()=>Pt(send,.5,.55),d:.6},
 {d:.25,act:()=>press(send)},
 {to:()=>[880,560],d:.9},
 {d:3.2,end:1}];
let si=-1,sT0=0,sEnd=0,from=[0,0],playing=false;
const begin=(i,n)=>{si=i;const s=STEPS[i];if(!s)return;sT0=n;from=[D.x,D.y];if(s.show)D.vis=1;sEnd=n+(s.d||0)};
const playTick=()=>{if(!playing)return;const n=now();if(si<0)begin(0,n);
  while(si<STEPS.length&&n>=sEnd){const s=STEPS[si];if(s.to){const p=s.to();D.x=p[0];D.y=p[1]}if(s.tick)s.tick(1);if(s.act)s.act();if(s.end){playing=false;marks.END=n;break}begin(si+1,n)}
  const s=STEPS[si];
  if(s&&playing){const u=sEnd>sT0?(n-sT0)/(sEnd-sT0):1;if(s.to){const p=s.to(),e=sm(u);D.x=from[0]+(p[0]-from[0])*e;D.y=from[1]+(p[1]-from[1])*e}if(s.tick)s.tick(u)}
  const c=cur();if(c){const pr=now()-D.press<.12;c.style.opacity=D.vis?'1':'0';c.style.transform=`translate(${(D.x-3).toFixed(2)}px,${(D.y-2).toFixed(2)}px) scale(${pr?.88:1})`}
  requestAnimationFrame(playTick)};
const play=()=>{if(playing)return;playing=true;si=-1;marks.play=now();boot0();D.x=760;D.y=560;D.vis=0;requestAnimationFrame(playTick)};
window.__playGo=play;

/* ---------------------------------------------------------------- boot */
const boot=()=>{const sc=['files-search','files-nomatch','preview-bin','preview','at-folder','at','drag','compose','empty-ws','files'].find(has);
  if(sc){SC[sc]();setTimeout(settle,2400)}
  else if(has('play')){boot0();setTimeout(play,600)}
  else boot0()};
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(boot))));

const api={emit,open,close,toggle,preview:openPv,closePreview:closePv,filter:setFilter,openAt,closeAt,addChip,removeChip,dragStart,dragMove,dragEnd,onRequest:null,mock,S,W,
  timeline:()=>JSON.stringify(Object.fromEntries(Object.entries(marks).map(([k,v])=>[k,+(v-(marks.play||0)).toFixed(2)])))};
window.__files=api;
})();
