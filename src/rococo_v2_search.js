(()=>{
/* ===================================================================================================
   状态 #9 · 搜索（会话 / 消息）v2 ——「Chercher dans le ciel · 云天仪表」   rococo v2 合并版的一层（v1 备份 rococo_v2_search.bak-1520.*）
   动效语言按 一段动效参考录屏（亮色 HTML-in-Canvas 仪表盘），视觉按 一张风格参考图（Hanging in the sky 天空拼贴）：
   WebGL 流动云天从放大镜吊牌处涌出铺满（半分辨率 ~30fps，无 WebGL 退回静态渐变），拱形窗洞里放搜索卡、环形旋转分页文字、45° 菱形预览卡、
   命中全文；右侧奶白玻璃结果面板；空心大数字 09、竖排巨字 寻/阅/启（云中显影）；拼贴：仰视建筑一角、神庙废墟（Met CC0 Bonfils）、断柱、梯子、天使、白鸽。
   Enter 打开会话 / 跳到消息（rococo_v1 的历史会话视图，build 时补的钩子 window.__rkOpenHist）。Esc / 点空处关闭。
   ---------------------------------------------------------------------------------------------------
   后端 → 页面   window.__search.emit(type, payload)
     'search.recent'  {items:[{q,scope,at}], suggestions:[Session]}              （打开时 / 清空输入后）
     'search.loading' {q, scope}
     'search.results' {q, scope, total, tookMs, groups:[{session:Session, titleRanges:[[s,e]], hits:[Hit]}]}
     'search.error'   {q, scope, code, message}
       Session = {id, title, workDir, model, createdAt, updatedAt, messageCount, lastMessage?}
       Hit     = {messageId, role:'user'|'assistant'|'tool', snippet, ranges:[[s,e]], createdAt}
   页面 → 后端   window.__search.onRequest = (type, payload) => {}     （没接后端时用内置 mock）
     'search.query'       {q, scope:'all'|'sessions'|'messages'|'date', limit}   q 为空 = 要最近搜索与建议
     'search.open'        {sessionId, messageId|null, q}
     'search.recentClear' {}
   场景 hash：#search #search-typing #search-empty #search-loading #search-play
   =================================================================================================== */
const b=document.body,RM=matchMedia('(prefers-reduced-motion: reduce)');
const HASH=window.__navHash||decodeURIComponent(location.hash.slice(1)).split(/[&,]/).filter(Boolean);
const has=k=>HASH.includes(k);
const now=()=>performance.now()/1000;
const IMG={building:'__S9_BUILDING__',temple:'__S9_TEMPLE__',column:'__S9_COLUMN__',ladder:'__S9_LADDER__',angel:'__S9_ANGEL__',dove:'__S9_DOVE__',sky:'__S9_SKY__'};
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cl=(v,a=0,z=1)=>Math.max(a,Math.min(z,v));
const bez=(x1,y1,x2,y2)=>{const A=(a,b)=>1-3*b+3*a,B=(a,b)=>3*b-6*a,C=a=>3*a;
  const cal=(t,a,b)=>((A(a,b)*t+B(a,b))*t+C(a))*t,sl=(t,a,b)=>3*A(a,b)*t*t+2*B(a,b)*t+C(a);
  return x=>{if(x<=0)return 0;if(x>=1)return 1;let t=x;for(let i=0;i<8;i++){const s=sl(t,x1,x2);if(Math.abs(s)<1e-6)break;t-=(cal(t,x1,x2)-x)/s}return cal(cl(t),y1,y2)}};
const OUT=bez(.16,1,.3,1),INQ=bez(.55,0,.75,.2),SM=u=>{u=cl(u);return u*u*(3-2*u)};
const ROMAN=n=>{const r=[['x',10],['ix',9],['v',5],['iv',4],['i',1]];let s='';for(const [k,v] of r)while(n>=v){s+=k;n-=v}return s||'—'};

/* ---------------------------------------------------------------- mock index (shapes as Kimi Code sessions / messages) */
const P1='~/code/trianon-workbench';
const S=(id,title,workDir,model,updatedAt,msgs)=>({id,title,workDir,model,updatedAt,createdAt:msgs.length?msgs[0][2]:updatedAt,messages:msgs.map(([role,content,createdAt],k)=>({id:id.replace('ses_','msg_')+'_'+k,sessionId:id,role,content,createdAt}))});
const HIST_ID='ses_8c41e2a7';
const DB=[
 S(HIST_ID,'重构聊天工作台的流式渲染',P1,'K3.1 Pro','2026-10-27T13:41',[
  ['user','流式回复每个 delta 都触发一次重排，长会话会卡。改成按帧批量提交，别让已完成的消息重复插入。','2026-10-25T14:20'],
  ['assistant','看过 transcript.ts 了。每个 delta 都直接写进响应式数组，所以每个 token 都重排一次；结束时又整条 push，没按 id 去重。先缓冲，再在一帧里一次性提交（scheduleFlush）。','2026-10-25T14:21'],
  ['user','好，顺便把去重也补上。','2026-10-25T14:26'],
  ['assistant','补上了：结束时按 message id 合并，已完成的消息不再整条重复插入；流式测试也加了一条。','2026-10-25T14:27']]),
 S('ses_51d0b9c3','WebContentsView 内置浏览器',P1,'K3.1 Pro','2026-10-27T13:30',[
  ['user','内置浏览器用 WebContentsView 挂在右侧卷宗栏下面，CDP 截图要能拿到。','2026-10-27T13:02'],
  ['assistant','WebContentsView 不在 DOM 里，层级要在主进程里排；截图走 webContents.debugger 的 Page.captureScreenshot。','2026-10-27T13:05']]),
 S('ses_2f7a6e10','流式输出落笔动效',P1,'K3.1 Pro','2026-10-27T11:42',[
  ['user','流式输出的时候光标做成一支笔，落笔中三个字慢慢写出来。','2026-10-27T11:20'],
  ['assistant','落笔中用 Pinyon 描边动画，流式结束时笔抬起淡出；减少动效时只显示静态标签。','2026-10-27T11:24']]),
 S('ses_93b4c0d8','Pinia 会话状态持久化',P1,'K3','2026-10-26T18:10',[
  ['user','刷新以后会话列表丢了，Pinia 要持久化到哪？','2026-10-26T17:52'],
  ['assistant','会话索引放 IndexedDB，流式中途刷新时只恢复到最后一个完整的 message，不恢复半截 delta。','2026-10-26T17:58']]),
 S('ses_0ae1f562','阶段 3 骨架 · 交接说明',P1,'K3.1 Pro','2026-10-25T22:40',[
  ['user','把阶段 3 的骨架写成交接说明，GLM 那边照着做。','2026-10-25T22:10'],
  ['assistant','交接说明分四节：目录、网关、事件契约、流式渲染的验收用例。','2026-10-25T22:31']]),
 S('ses_6b2d7f04','contracts · 事件形状',P1,'K2.8 Preview','2026-10-24T21:05',[
  ['user','把适配器的事件整理成一份契约文档。','2026-10-24T20:40'],
  ['assistant','message.delta / message.done / tool.call / approval.request 四类；流式 delta 带 seq，断线后按 seq 重同步。','2026-10-24T20:52']]),
 S('ses_c47e1a9b','修复 Vite HMR 白屏','~/playground','K2.7 Code Highspeed','2026-10-26T16:20',[
  ['user','改完 store 以后 HMR 直接白屏。','2026-10-26T16:02'],
  ['assistant','是 Pinia store 在 HMR 时被重复定义；加 acceptHMRUpdate 就好。','2026-10-26T16:08']]),
 S('ses_7d15e3f2','Electron 窗口无边框拖拽','~/playground','K3','2026-10-23T15:12',[
  ['user','无边框窗口怎么拖？','2026-10-23T15:01'],
  ['assistant','顶栏加 -webkit-app-region: drag，按钮区域设 no-drag。','2026-10-23T15:04']]),
 S('ses_1e9a44c0','CDP 截图接口','~/project','K3.1 Pro','2026-10-26T10:30',[
  ['user','CDP 截图要支持整页和指定元素。','2026-10-26T10:05'],
  ['assistant','整页用 captureBeyondViewport，元素先 DOM.getBoxModel 拿 clip 再截。','2026-10-26T10:12']]),
 S('ses_4c2b88e1','会话列表分页与缓存','~/project','K3','2026-10-21T19:44',[
  ['user','会话列表要分页，滚动时再加载下一页。','2026-10-21T19:20'],
  ['assistant','按 updated_at 倒序，每页 20 条；最近一页缓存在本地。','2026-10-21T19:31']]),
 S('ses_a83f02d6','主进程模块梳理','~/project','K2.8 Preview','2026-10-18T23:15',[
  ['user','把主进程的模块结构理一下。','2026-10-18T22:40'],
  ['assistant','主进程五块：窗口、引擎守护、会话存储、更新、托盘。','2026-10-18T22:58']]),
 S('ses_e60c7b15','立绘裁切与透明边处理','D:\\atelier','K3','2026-10-22T14:00',[
  ['user','立绘抠图以后边缘一圈灰。','2026-10-22T13:40'],
  ['assistant','是预乘 alpha 的问题，导出前反预乘再去色边。','2026-10-22T13:46']]),
 S('ses_f2a91c37','配色与字体试样','~/ada','K3.1 Pro','2026-10-12T20:20',[
  ['user','雾蓝、银蓝、奶白这一套，配 Pinyon 花体和思源宋体试一下。','2026-10-12T20:01'],
  ['assistant','试样三张：信笺、吊牌、卷宗栏；花体只用在小标题。','2026-10-12T20:12']]),
 S('ses_3b7f6d22','阶段 2 · 契约冻结与评审',P1,'K3.1 Pro','2026-10-22T17:30',[
  ['user','阶段 2 的契约今天冻结，评审意见汇总一下。','2026-10-22T17:02'],
  ['assistant','冻结 12 个事件、3 个 REST 接口；流式事件的 seq 字段评审通过。','2026-10-22T17:21']]),
 S('ses_8a0d3e47','图标集 · 银线描边重绘',P1,'K2.8 Preview','2026-10-19T12:10',[
  ['user','左栏图标统一成银线描边。','2026-10-19T11:50'],
  ['assistant','十枚图标按视觉面积重排，描边 1.4px。','2026-10-19T11:58']]),
 S('ses_d1c6f590','依赖升级到 Electron 33','~/project','K3','2026-10-09T09:40',[
  ['user','依赖升到 Electron 33，看看有什么破坏性改动。','2026-10-09T09:12'],
  ['assistant','BrowserView 已弃用，换成 WebContentsView；其余兼容。','2026-10-09T09:25']]),
];
const RECENT0=[{q:'流式',scope:'all',at:'2026-10-27T13:20'},{q:'transcript.ts',scope:'messages',at:'2026-10-27T11:02'},{q:'Electron 33',scope:'all',at:'2026-10-26T18:30'},{q:'CDP 截图',scope:'all',at:'2026-10-26T10:40'}];
const NOW_REF=new Date('2026-10-27T13:50');
const sess=s=>({id:s.id,title:s.title,workDir:s.workDir,model:s.model,createdAt:s.createdAt,updatedAt:s.updatedAt,messageCount:s.messages.length});
const ranges=(txt,q)=>{const r=[];if(!q)return r;const T=txt.toLowerCase(),Q=q.toLowerCase();let i=T.indexOf(Q);while(i>=0){r.push([i,i+Q.length]);i=T.indexOf(Q,i+Q.length)}return r};
const snip=(txt,q)=>{const i=txt.toLowerCase().indexOf(q.toLowerCase());if(i<0)return {snippet:txt.slice(0,44)+(txt.length>44?'…':''),ranges:[]};
  const a=Math.max(0,i-26),z=Math.min(txt.length,i+q.length+74);const pre=a>0?'…':'',s=pre+txt.slice(a,z)+(z<txt.length?'…':'');
  return {snippet:s,ranges:ranges(s,q)}};
const dateKeys=iso=>{const d=new Date(iso);return [`${d.getMonth()+1}/${d.getDate()}`,`${d.getMonth()+1}月${d.getDate()}日`,`${d.getMonth()+1}-${d.getDate()}`,iso.slice(0,10)]};
let recentDB=RECENT0.slice();
const mock={hold:false,latency:.32,
  query(p){const q=(p.q||'').trim(),scope=p.scope||'all',limit=p.limit||24;
    if(!q){emit('search.recent',{items:recentDB.slice(),suggestions:DB.slice().sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).slice(0,5).map(s=>({...sess(s),lastMessage:s.messages[s.messages.length-1]}))});return}
    emit('search.loading',{q,scope});if(mock.hold)return;
    setTimeout(()=>{const t0=performance.now();let groups=[];
      for(const s of DB){const titleHit=ranges(s.title,q).length>0||ranges(s.workDir,q).length>0;
        let hits=s.messages.filter(m=>m.content.toLowerCase().includes(q.toLowerCase())).map(m=>({messageId:m.id,role:m.role,...snip(m.content,q),createdAt:m.createdAt}));
        if(scope==='date'){const dk=s.messages.some(m=>dateKeys(m.createdAt).some(k=>k.includes(q)));
          if(dk){hits=s.messages.filter(m=>dateKeys(m.createdAt).some(k=>k.includes(q))).map(m=>({messageId:m.id,role:m.role,snippet:m.content.slice(0,40)+(m.content.length>40?'…':''),ranges:[],createdAt:m.createdAt}))}
          else if(!titleHit&&!hits.length)continue}
        if(scope==='sessions'&&!titleHit)continue;
        if(scope==='messages'&&!hits.length)continue;
        if(!titleHit&&!hits.length)continue;
        groups.push({session:sess(s),titleRanges:ranges(s.title,q),hits:scope==='sessions'?[]:hits.slice(0,3),_score:(ranges(s.title,q).length?10:0)+hits.length})}
      groups.sort((a,b)=>scope==='date'?b.session.updatedAt.localeCompare(a.session.updatedAt):(b._score-a._score)||b.session.updatedAt.localeCompare(a.session.updatedAt));
      groups=groups.slice(0,limit);groups.forEach(g=>delete g._score);
      emit('search.results',{q,scope,total:groups.length,tookMs:Math.max(1,Math.round(performance.now()-t0)),groups})},mock.latency*1000)},
  open(p){recentDB=[{q:p.q,scope:st.scope,at:'2026-10-27T13:50'},...recentDB.filter(r=>r.q!==p.q)].filter(r=>r.q).slice(0,6);
    const s=DB.find(x=>x.id===p.sessionId);if(s&&window.__searchOpenLocal)window.__searchOpenLocal(p,s)},
  clear(){recentDB=[];emit('search.recent',{items:[],suggestions:st.sugg})}};
const req=(type,payload)=>{const h=window.__search.onRequest;
  if(typeof h==='function'){try{if(h(type,payload)!==false)return}catch(e){console.error(e)}}
  if(type==='search.query')mock.query(payload);else if(type==='search.open')mock.open(payload);else if(type==='search.recentClear')mock.clear()};

/* ---------------------------------------------------------------- markup */
const root=document.createElement('div');root.id='sr';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','搜索会话与消息');root.setAttribute('aria-hidden','true');
const SCOPES=[['all','全部','TOUT'],['sessions','会话','SEANCES'],['messages','消息','MESSAGES'],['date','日期','DATES']];
const BARS=(n,seed)=>{let s=seed,x=0,o='';for(let i=0;i<n;i++){s=(s*9301+49297)%233280;const w=1+Math.floor(s/233280*3);o+=`<rect x="${x}" y="0" width="${w}" height="16" class="sr-bar"/>`;x+=w+2+Math.floor((s%7)/3)}return [o,x]};
const ARCH=(x0,y0,x1,y1,band)=>{/* cartouche arch: round top + notched shoulders, as an outer/inner ring (evenodd) */
  const sh=(a,b,c,d,k)=>{const w=c-a,cx=(a+c)/2,r=w/2,n=k;return `M${a} ${d} L${a} ${b+r+n*1.6} L${a+n} ${b+r+n*1.6} L${a+n} ${b+r} A${r-n} ${r-n} 0 0 1 ${c-n} ${b+r} L${c-n} ${b+r+n*1.6} L${c} ${b+r+n*1.6} L${c} ${d} Z`};
  return sh(x0,y0,x1,y1,26)+' '+sh(x0+band,y0+band,x1-band,y1-band*.6,20)};
root.innerHTML=`<canvas class="sr-cv" aria-hidden="true"></canvas><div class="sr-bgf" aria-hidden="true"></div>
<div class="sr-clouds" aria-hidden="true"><i class="sr-q1"></i><i class="sr-q2"></i><i class="sr-q3"></i></div>
<img class="sr-k sr-bld" alt="" src="${IMG.building}" draggable="false" aria-hidden="true">
<img class="sr-k sr-lad" alt="" src="${IMG.ladder}" draggable="false" aria-hidden="true">
<img class="sr-k sr-col sr-q1" alt="" src="${IMG.column}" draggable="false" aria-hidden="true">
<img class="sr-k sr-tmp" alt="" src="${IMG.temple}" draggable="false" aria-hidden="true">
<img class="sr-k sr-col sr-q2" alt="" src="${IMG.column}" draggable="false" aria-hidden="true">
<div class="sr-clouds sr-front" aria-hidden="true"><i class="sr-q4"></i><i class="sr-q5"></i></div>
<svg class="sr-arch" aria-hidden="true"><path class="sr-as s1"/><path class="sr-as s2"/><path class="sr-ab"/><path class="sr-al" fill="none"/></svg>
<svg class="sr-hud" aria-hidden="true">
 <defs><path id="srRingP"/></defs>
 <g class="sr-x"><line class="sr-ln sr-faint sr-dr xh" pathLength="1"/><line class="sr-ln sr-faint sr-dr xv" pathLength="1"/><line class="sr-ln sr-dr xt" pathLength="1"/><line class="sr-ln sr-dr xb" pathLength="1"/></g>
 <g class="sr-rg"><circle class="sr-ring r0 sr-dr" pathLength="1" stroke-opacity=".45"/><circle class="sr-ring r1 sr-dr" pathLength="1" stroke-opacity=".2"/>
  <g class="sr-rtx">${SCOPES.map(([k,z,f],i)=>`<text class="sr-rt"><textPath href="#srRingP" startOffset="${(i*25+12.5).toFixed(1)}%" text-anchor="middle"><tspan class="no">0${i+1}</tspan><tspan dx="10" class="sr-lbl" data-k="${k}">${f} · ${z}</tspan></textPath></text>`).join('')}</g></g>
 <g class="sr-tks"></g>
 <text class="sr-big" x="0" y="0">09</text>
 <text class="sr-big2 ixn" x="0" y="0">01</text>
 <g class="sr-pl"></g>
 <text class="sr-mono sr-m1"></text><text class="sr-mono sr-m2"></text><text class="sr-mono sr-m3"></text>
</svg>
<div class="sr-head"><span class="sr-lab"><i>RECHERCHE · 09</i></span><b class="sr-hw">搜索</b><span class="sr-hs">SESSIONS &amp; MESSAGES · KIMI CODE</span></div>
<div class="sr-scr" aria-hidden="true">Chercher dans le ciel</div>
<div class="sr-poem2" aria-hidden="true"><p>我把走失的句子挂在天上，<br>等一阵风，把它们吹回来。</p><p class="sr-en">I hang my lost words on the sky,<br>and wait for the wind.</p></div>
<div class="sr-date"><b></b><em></em><span></span></div>
<div class="sr-gly" aria-hidden="true"><span class="sr-g0"></span><span class="sr-g1"></span></div>
<div class="sr-gsub" aria-hidden="true"><b></b><i></i></div>
<img class="sr-k sr-ang" alt="" src="${IMG.angel}" draggable="false" aria-hidden="true">
<div class="sr-box"><i class="sr-sheen"></i>
 <label class="sr-in"><span class="sr-ph"><em>Chercher…</em> 搜索会话、消息、代码片段</span><input id="srQ" type="text" autocomplete="off" spellcheck="false" aria-label="搜索会话与消息" aria-controls="srRes"><i class="sr-ul"></i></label>
 <span class="sr-scope" aria-hidden="true"></span><kbd class="sr-esc">Esc</kbd></div>
<div class="sr-tabs" role="tablist">${SCOPES.map(([k,z],i)=>`<button class="sr-tab${i?'':' on'}" data-s="${k}" role="tab" aria-selected="${i?'false':'true'}" tabindex="-1"><i>0${i+1}</i>${z}</button>`).join('')}</div>
<div class="sr-pn sr-left"><div class="sr-ph2"><span class="sr-nn">01</span><b>RÉSULTATS · 结果</b><em class="sr-n"></em></div>
 <p class="sr-status" aria-live="polite"></p>
 <div class="sr-recent"><span class="sr-rl"><em>Souvenirs</em>最近搜索 · RECENT</span><span class="sr-chips"></span><button class="sr-clr" tabindex="-1">清除 ✕</button></div>
 <div class="sr-res" id="srRes" role="listbox" aria-label="搜索结果"></div></div>
<div class="sr-dia sr-stage"><div class="sr-dq"><i class="sr-sky"></i><svg viewBox="0 0 300 300"><path class="sr-o1" d="M150 6 L294 150 L150 294 L6 150Z"/><path class="sr-o2" d="M150 6 L294 150 L150 294 L6 150Z"/><path class="sr-o3" d="M150 -4 L304 150 L150 304 L-4 150Z"/></svg></div><div class="sr-dv sr-l0"></div><div class="sr-dv sr-l1"></div></div>
<div class="sr-pn sr-right sr-stage"><div class="sr-ph2"><span class="sr-nn">02</span><b>DÉTAIL · 命中全文</b><em class="sr-dtn"></em></div>
 <div class="sr-dt sr-l0"></div><div class="sr-dt sr-l1"></div></div>
${[0,1,2].map(k=>`<img class="sr-k sr-dove d${k}" alt="" src="${IMG.dove}" draggable="false" aria-hidden="true">`).join('')}
<div class="sr-ft"><span><b>Esc</b>关闭</span><span><b>↑↓</b>选择</span><span><b>Tab</b>切换分页</span><span><b>Enter</b>打开会话</span><span class="sr-spc"></span><span class="sr-ftt"></span><svg width="${BARS(18,3)[1]}" height="16">${BARS(18,3)[0]}</svg></div>`;
b.appendChild(root);
const $=q=>root.querySelector(q),$$=q=>[...root.querySelectorAll(q)];
const box=$('.sr-box'),inp=$('#srQ'),resEl=$('#srRes'),chips=$('.sr-chips'),stat=$('.sr-status'),hud=$('.sr-hud'),cv=$('.sr-cv');
$('.sr-dq .sr-sky').style.backgroundImage=`url(${IMG.sky})`;
const tabs=$$('.sr-tab'),dvs=$$('.sr-dv'),dts=$$('.sr-dt'),glys=$$('.sr-gly span'),drs=$$('.sr-dr'),rg=$('.sr-rg'),rtx=$('.sr-rtx'),tks=$('.sr-tks'),pnL=$('.sr-left'),pnR=$('.sr-right'),dia=$('.sr-dia');
const NS='http://www.w3.org/2000/svg',mk=(t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);return e};

/* ---------------------------------------------------------------- liquid marble: WebGL domain-warped fbm, half resolution, ~30 fps */
const FS=`precision mediump float;
uniform vec2 uRes,uO,uM;uniform float uT,uR,uS,uE;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){vec2 fc=gl_FragCoord.xy;float ar=uRes.x/uRes.y;vec2 uv=fc/uRes.y;float y=fc.y/uRes.y;vec2 m=uM/uRes.y;float dm=length(uv-m);
 float t=uT*.022;
 float st=uS*exp(-dm*dm*5.)+.25*exp(-dm*dm*14.);
 vec2 p=vec2(uv.x*1.25,uv.y*2.1);
 vec2 q=vec2(fbm(p+vec2(t*1.4,0.)),fbm(p+vec2(5.2,1.3)+vec2(t,t*.3)));
 q+=st*vec2(sin(uT*1.2+dm*9.),cos(uT*1.0-dm*8.))*.2;
 vec2 p2=p+1.5*q;
 float d=fbm(p2*1.3+vec2(t*2.,0.));float d2=fbm(p2*1.3+vec2(t*2.,0.)+vec2(.06,.09));
 float cl=smoothstep(.44,.74,d);float li=clamp((d-d2)*5.+.62,0.,1.);
 vec3 skyTop=vec3(.737,.827,.918),skyBot=vec3(.878,.918,.96),cream=vec3(.984,.976,.957),sb=vec3(.749,.784,.878),lot=vec3(.91,.788,.816);
 vec3 sky=mix(skyBot,skyTop,smoothstep(.05,1.,y));
 sky=mix(sky,cream,smoothstep(.35,0.,y)*.5);
 sky=mix(sky,lot,smoothstep(.45,0.,y)*smoothstep(.5,0.,abs(uv.x/ar-.82))*.22);
 vec3 cc=mix(mix(sb,cream,.35),vec3(1.),li);
 vec3 c=mix(sky,cc,cl*.94);
 float dd=distance(fc,uO);float e=uR*(1.+.22*(fbm(uv*2.6+vec2(t*9.,-t*6.))-.5));
 float a=1.-smoothstep(e-uE,e,dd);
 c=mix(c,vec3(1.),smoothstep(e-uE*3.,e-uE*.2,dd)*.7);
 gl_FragColor=vec4(c*a,a);}`;
const GLX=(()=>{let gl=null;try{gl=cv.getContext('webgl',{premultipliedAlpha:true,preserveDrawingBuffer:true,alpha:true,antialias:false})}catch(e){}
  if(!gl){root.classList.add('nogl');return null}
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(o));return null}return o};
  const vs=sh(gl.VERTEX_SHADER,'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'),fs=sh(gl.FRAGMENT_SHADER,FS);
  if(!vs||!fs){root.classList.add('nogl');return null}
  const pr=gl.createProgram();gl.attachShader(pr,vs);gl.attachShader(pr,fs);gl.linkProgram(pr);gl.useProgram(pr);
  const bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const al=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(al);gl.vertexAttribPointer(al,2,gl.FLOAT,false,0,0);
  const U={};for(const k of ['uRes','uO','uM','uT','uR','uS','uE'])U[k]=gl.getUniformLocation(pr,k);
  return {gl,U,draw(o){const s=.5,w=Math.max(2,Math.round(G.W*s)),hh=Math.max(2,Math.round(G.H*s));if(cv.width!==w||cv.height!==hh){cv.width=w;cv.height=hh}
    gl.viewport(0,0,w,hh);gl.uniform2f(U.uRes,w,hh);gl.uniform2f(U.uO,o.ox*s,(G.H-o.oy)*s);gl.uniform2f(U.uM,o.mx*s,(G.H-o.my)*s);
    gl.uniform1f(U.uT,o.t);gl.uniform1f(U.uR,o.r*s);gl.uniform1f(U.uS,o.stir);gl.uniform1f(U.uE,o.edge*s);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,3)}}})();

/* ---------------------------------------------------------------- state */
const st={open:false,phase:'closed',tOpen:-9,tClose:-9,origin:[60,300],q:'',scope:'all',mode:'recent',groups:[],recent:[],sugg:[],err:null,
  sel:0,selF:0,tRes:-9,tLoad:-9,lastFrame:0,cards:[],opening:null,svKey:'',dOn:0,tD:-9,tOn:0,tT:-9,gly:'寻',glyOn:0,tGly:-9,
  mouse:[0,0],mx:0,my:0,tStir:-9,took:null,lastDraw:-9,ringA:-45};
let G={};
const geo=()=>{const W=innerWidth,H=innerHeight,L=92;
  const sx=W/1440,sy=H/900,k=Math.min(sx,sy);
  const ax0=Math.round(L+380*sx),ax1=Math.round(L+934*sx),acx=(ax0+ax1)/2;
  G={W,H,L,ox:acx,oy:Math.round(454*sy),rr:Math.round(148*k),ax0,ax1};
  hud.setAttribute('width',W);hud.setAttribute('height',H);hud.setAttribute('viewBox',`0 0 ${W} ${H}`);
  const set=(el,o)=>{for(const k in o)el.setAttribute(k,o[k])};const P=(el,x,y,w)=>{el.style.left=x+'px';el.style.top=y+'px';if(w)el.style.width=w+'px'};
  const ox=G.ox,oy=G.oy,r=G.rr;
  /* the arch window */
  const ar=$('.sr-arch');set(ar,{width:W,height:H,viewBox:`0 0 ${W} ${H}`});
  const AD=ARCH(ax0,14*sy,ax1,H-58,30);$('.sr-arch .sr-ab').setAttribute('d',AD);$$('.sr-arch .sr-as').forEach(e=>e.setAttribute('d',AD));
  const iw=ax1-ax0-60,ir=iw/2;$('.sr-arch .sr-al').setAttribute('d',`M${ax0+38} ${H-70} V${14*sy+30+ir+8} A${ir-8} ${ir-8} 0 0 1 ${ax1-38} ${14*sy+30+ir+8} V${H-70} Z`);
  set($('.xh'),{x1:ax0+40,y1:oy,x2:ax1-40,y2:oy});set($('.xv'),{x1:ox,y1:oy-r-62,x2:ox,y2:oy+r+66});
  set($('.xt'),{x1:L+24,y1:206*sy,x2:ax0-20,y2:206*sy});set($('.xb'),{x1:L+24,y1:H-48,x2:W-30,y2:H-48});
  set($('.r0'),{cx:ox,cy:oy,r});set($('.r1'),{cx:ox,cy:oy,r:r+36});
  const R2=r+20;$('#srRingP').setAttribute('d',`M${ox} ${oy-R2} A${R2} ${R2} 0 1 1 ${ox} ${oy+R2} A${R2} ${R2} 0 1 1 ${ox} ${oy-R2}`);
  tks.textContent='';for(let i=0;i<24;i++){const a=i*15*Math.PI/180,big=i%6===0,r1=r-(big?13:7),r2=r;tks.appendChild(mk('line',{x1:ox+r1*Math.cos(a),y1:oy+r1*Math.sin(a),x2:ox+r2*Math.cos(a),y2:oy+r2*Math.sin(a),class:'sr-tk'+(big?' big':'')}))}
  const pl=$('.sr-pl');pl.textContent='';[[L+30,206*sy],[ox,oy-r-62],[ox,oy+r+66],[W-36,H-48]].forEach(([x,y])=>pl.appendChild(mk('path',{d:`M${x-6} ${y}H${x+6}M${x} ${y-6}V${y+6}`,class:'sr-ln',style:'stroke-opacity:.7'})));
  pl.appendChild(mk('rect',{x:ox+r+22,y:oy-4,width:8,height:8,class:'sr-dot',transform:`rotate(45 ${ox+r+26} ${oy})`}));
  set($('.sr-big'),{x:L+20,y:Math.round(168*sy)});set($('.ixn'),{x:ox-r-64,y:oy+r+10});
  set($('.sr-m1'),{x:ox+r+30,y:oy-r+24});set($('.sr-m2'),{x:ox+r+40,y:oy+16});set($('.sr-m3'),{x:ax0+44,y:H-84});
  P($('.sr-head'),L+206,Math.round(46*sy));P($('.sr-date'),0,Math.round(26*sy));$('.sr-date').style.left='auto';$('.sr-date').style.right='34px';
  P($('.sr-scr'),ax0,Math.round(70*sy),ax1-ax0);
  P(box,acx-210,Math.round(168*sy));P($('.sr-tabs'),acx-180,Math.round(248*sy));
  P(dia,ox,oy);
  P(pnR,ax0+46,Math.round(630*sy),ax1-ax0-92);pnR.style.height=(H-70-Math.round(630*sy))+'px';   /* 16:30 taller: 2–3 hits in full, still inside the arch's dashed frame */
  P($('.sr-gly'),W-380,Math.round(92*sy));P($('.sr-gsub'),W-178,Math.round(206*sy));$('.sr-gsub').style.width='150px';
  const rt=Math.round(318*sy),pb=H-60;P(pnL,W-386,rt,352);pnL.style.height=(pb-rt)+'px';
  P($('.sr-ang'),W-430,rt-96,96);
  /* collage: building corner, temple ruins on a cloud, broken columns, ladder into the clouds */
  P($('.sr-bld'),L-30,-26,Math.round(420*k));
  const th=Math.round(560*k),tw=Math.round(th*463/900);P($('.sr-tmp'),L+48,H-th-96,tw);
  P($('.sr-col.sr-q1'),L+6,H-96-Math.round(250*k),Math.round(250*k*234/420));P($('.sr-col.sr-q2'),L+48+tw-14,H-96-Math.round(170*k),Math.round(170*k*234/420));
  P($('.sr-lad'),ax1-62,-30,Math.round(118*k));
  P($('.sr-poem2'),L+22,H-214);
  G.tmp={x:L+48,y:H-th-96,w:tw,h:th};
  const CB=(q,x,y,w,h)=>{const e=$(q);e.style.left=x+'px';e.style.top=y+'px';e.style.width=w+'px';e.style.height=h+'px'};
  CB('.sr-clouds .sr-q1',L-80,H-250,520,230);CB('.sr-clouds .sr-q2',L+200,H-170,360,160);CB('.sr-clouds .sr-q3',W-520,H-150,560,200);
  CB('.sr-clouds.sr-front .sr-q4',L-40,H-170,460,170);CB('.sr-clouds.sr-front .sr-q5',L+250,H-120,260,120);
  P($('.sr-ft'),0,H-34);$('.sr-ft').style.padding=`0 34px 0 ${L+24}px`};
geo();addEventListener('resize',()=>geo());
root.addEventListener('pointermove',e=>{st.mouse=[e.clientX,e.clientY]});

/* ---------------------------------------------------------------- rendering helpers */
const mark=(t,rs)=>{if(!rs||!rs.length)return esc(t);let o='',p=0;for(const [a,z] of rs){o+=esc(t.slice(p,a))+'<u>'+esc(t.slice(a,z))+'</u>';p=z}return o+esc(t.slice(p))};
const fmtT=iso=>{const d=new Date(iso),hm=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
  const same=d.toDateString()===NOW_REF.toDateString(),y=new Date(NOW_REF);y.setDate(y.getDate()-1);
  return same?hm:d.toDateString()===y.toDateString()?'昨天 '+hm:`${d.getMonth()+1}/${d.getDate()} ${hm}`};
const MOIS=['janv.','fevr.','mars','avr.','mai','juin','juil.','aout','sept.','oct.','nov.','dec.'];
const frD=iso=>{const d=new Date(iso);return `${d.getDate()} ${MOIS[d.getMonth()]}`};
const shD=iso=>{const d=new Date(iso);return `${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`};
const prj=w=>w.replace(/\\/g,'/').split('/').filter(Boolean).pop()||w;
const ROLE={user:'你',assistant:'KIMI',tool:'工具'};
const N2=i=>String(i).padStart(2,'0');
const MAXC=8;
const hsh=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h};
const buildCards=(list,kind)=>{resEl.textContent='';const vis=list.slice(0,MAXC);st.all=list;
  st.cards=vis.map((g,i)=>{const el=document.createElement('div');el.className='sr-c'+(kind==='sugg'?' sugg':'');el.setAttribute('role','option');el.id='srC'+i;el.dataset.i=i;
    const s=g.session,nh=(g.hits||[]).length;el.setAttribute('aria-label',s.title);
    el.innerHTML=`<span class="sr-ix">${N2(i+1)}</span><span class="sr-tt2"><b>${mark(s.title,g.titleRanges)}</b><i>${esc(prj(s.workDir))} · ${kind==='sugg'?esc(s.messageCount)+' MSG':nh?nh+' HIT':'TITLE'} · ${esc(s.model||'')}</i></span><span class="sr-tm"><em>${fmtT(s.updatedAt).replace('昨天 ','')}</em>${shD(s.updatedAt)}</span>`;
    resEl.appendChild(el);return {el,g,i,kind}});
  st.sel=0;st.selF=0;st.tRes=now();st.svKey='';st.building=1;aria();st.building=0};
const idx=()=>{const n=st.cards.length;return n?((st.sel%n)+n)%n:0};
const wrap=v=>v;
const aria=()=>{const I=idx();st.cards.forEach((c,i)=>{c.el.setAttribute('aria-selected',i===I?'true':'false');c.el.classList.toggle('front',i===I)});const c=st.cards[I];
  if(c)inp.setAttribute('aria-activedescendant',c.el.id);else inp.removeAttribute('aria-activedescendant');
  $('.sr-n').textContent=st.cards.length?`${N2(I+1)} / ${N2(st.cards.length)}`:'';if(!st.building)stageSet()};
const setGly=ch=>{if(ch===st.gly&&st.tGly>0)return;st.gly=ch;st.glyOn^=1;glys[st.glyOn].textContent=ch;st.tGly=now()};
const diaHTML=c=>{if(!c)return '';const s=c.g.session,I=idx();
  return `<span class="sr-lk">N° ${N2(I+1)} · ${esc(s.messageCount)} MSG</span><div class="sr-sc">${c.kind==='sugg'?'Souvenir':'Archive'}</div>
   <div class="sr-plt"><b>${st.scope==='date'&&c.kind!=='sugg'?frD(s.updatedAt).toUpperCase():c.kind==='sugg'?'RECENT':'TROUVE'}<i>${shD(s.updatedAt)}</i></b><span>${esc(s.title)}</span></div>`};
const dtHTML=()=>{const m=st.mode;
  if(m==='empty')return `<div class="sr-poem3"><em>Nul nom ne brille ici.</em><span>这片档案里，还没有写下它的名字<br>换个词，或切回「全部」。</span></div>`;
  if(m==='error')return `<div class="sr-poem3"><em>Pardon.</em><span>${esc(st.err||'检索没有完成')}<br>Enter 重试</span></div>`;
  const c=st.cards[idx()];if(!c)return '';const g=c.g,s=g.session;const hits=(g.hits||[]).slice(0,3);
  return `<div class="sr-mt"><b>${esc(s.model||'')}</b><span>${esc(prj(s.workDir))}</span><span>${fmtT(s.updatedAt)}</span></div>
   <div class="sr-tt2">${mark(s.title,g.titleRanges)}</div>
   ${hits.length?`<ol>${hits.map(h=>`<li><em class="r-${esc(h.role)}">${esc(ROLE[h.role]||h.role)}</em><div><span>${mark(h.snippet,h.ranges)}</span><time>${fmtT(h.createdAt)}</time></div></li>`).join('')}</ol>`:''}
   <span class="sr-go"><kbd>ENTER</kbd>打开会话</span>`};
/* a 3rd hit only when it fits whole (never a half-cut row) */
const fitHits=el=>{const lim=el.clientHeight-6;[...el.querySelectorAll('ol li')].forEach((li,i)=>{if(i>=2&&li.offsetTop+li.offsetHeight>lim)li.remove()})};
const stageSet=()=>{const c=st.cards[idx()];const key=st.mode+'|'+(st.mode==='empty'||st.mode==='error'?st.err:c?c.g.session.id+'|'+st.q+'|'+st.scope+'|'+idx():'');
  if(key===st.svKey)return;st.svKey=key;
  st.tOn^=1;dts[st.tOn].innerHTML=dtHTML();fitHits(dts[st.tOn]);st.tT=now();
  const showD=c&&(st.mode==='results'||st.mode==='recent');const nk=showD?c.g.session.id+'|'+idx():'';
  if(nk!==st.dKey){st.dKey=nk;st.dOn^=1;dvs[st.dOn].innerHTML=diaHTML(showD?c:null);st.tD=now();st.dDir=(st.sel>=(st.lastSel||0))?1:-1;st.lastSel=st.sel}
  $('.ixn').textContent=showD?N2(idx()+1):'00';st.tIx=now();
  $('.sr-dtn').textContent=showD?`N° ${N2(idx()+1)}`:''};
const renderChips=()=>{chips.innerHTML=st.recent.map(r=>`<button class="sr-chip" tabindex="-1" data-q="${esc(r.q)}">${esc(r.q)}</button>`).join('')||'<span class="sr-none">还没有搜索过</span>';
  root.classList.toggle('no-recent',!st.recent.length)};
const setMode=m=>{st.mode=m;root.dataset.mode=m;
  stat.innerHTML=m==='loading'?'RECHERCHE · 正在翻检档案…':m==='results'?`<b>${st.groups.length}</b>会话 · <b>${st.groups.reduce((a,g)=>a+(g.hits||[]).length,0)}</b>消息 · ${st.took==null?'—':esc(st.took)}ms${st.groups.length>MAXC?` · 显示前 ${MAXC}`:''}`:
    m==='empty'?'<b>0</b>没有找到 · RIEN':m==='error'?`PARDON · ${esc(st.err||'检索没有完成')}`:'SUGGESTIONS · 最近的会话';
  if(m==='results')setGly('阅');else if(m!=='loading'&&!st.opening)setGly('寻');
  if(m==='results'||m==='empty')st.tStir=now();
  if(m==='empty')st.tEmpty=now();if(m!=='loading')stageSet()};

/* ---------------------------------------------------------------- backend bridge */
function emit(type,p){p=p||{};
  if(type==='search.recent'){st.recent=p.items||[];st.sugg=p.suggestions||st.sugg;renderChips();
    if(!st.q){st.groups=[];buildCards(st.sugg.map(s=>({session:s,titleRanges:[],hits:s.lastMessage?[{messageId:s.lastMessage.id,role:s.lastMessage.role,snippet:s.lastMessage.content.slice(0,96)+(s.lastMessage.content.length>96?'…':''),ranges:[],createdAt:s.lastMessage.createdAt}]:[]})),'sugg');setMode('recent')}}
  else if(type==='search.loading'){if((p.q||'')!==st.q)return;st.tLoad=now();setMode('loading')}
  else if(type==='search.results'){if((p.q||'')!==st.q||(p.scope&&p.scope!==st.scope))return;st.groups=p.groups||[];st.took=p.tookMs==null?null:p.tookMs;
    if(st.groups.length){buildCards(st.groups,'res');setMode('results')}else{buildCards([],'res');setMode('empty')}}
  else if(type==='search.error'){if((p.q||'')!==st.q)return;st.err=p.message||'检索没有完成';setMode('error')}}
let qT=0;
const query=(instant)=>{clearTimeout(qT);const go=()=>req('search.query',{q:st.q,scope:st.scope,limit:24});if(instant)go();else qT=setTimeout(go,140)};

/* ---------------------------------------------------------------- open / close */
const tagEl=()=>{const its=[...document.querySelectorAll('.rail .grp .it')];return its[3]};
const setOrigin=()=>{const t=tagEl();if(t){const r=t.getBoundingClientRect();if(r.width)st.origin=[r.left+r.width/2,r.top+r.height/2];else st.origin=[52,G.H*.38]}};
const open=(o={})=>{if(st.open&&st.phase!=='closing')return;setOrigin();st.open=true;st.phase='opening';st.tOpen=now()-(o.instant?9:0);
  const active=document.activeElement;st.returnFocus=active&&active!==document.body&&!root.contains(active)?active:tagEl();
  if(window.__v13toggle&&b.classList.contains('drw-open'))window.__v13toggle(false);
  b.classList.add('sr-on');root.classList.add('on');root.setAttribute('aria-hidden','false');
  st.q=o.q||'';inp.value=st.q;root.classList.toggle('has-q',!!st.q);if(o.scope)setScope(o.scope,true);
  query(true);st.sheenDone=false;
  setTimeout(()=>{try{inp.focus({preventScroll:true})}catch(e){}},o.instant?0:120);
  st.lastFrame=now();frame()};
const close=(o={})=>{if(!st.open||st.phase==='closing')return;setOrigin();st.phase='closing';st.tClose=now()-(o.quick?.3:0);inp.blur();clearTimeout(qT)};
const finishClose=()=>{st.open=false;st.phase='closed';root.classList.remove('on');b.classList.remove('sr-on');root.setAttribute('aria-hidden','true');
  if(st.after){const f=st.after;st.after=null;f()}
  const prev=st.returnFocus;st.returnFocus=null;if(prev&&prev.isConnected)prev.focus({preventScroll:true})};
const setScope=(k,silent)=>{st.scope=k;tabs.forEach(t=>{const on=t.dataset.s===k;t.classList.toggle('on',on);t.setAttribute('aria-selected',on?'true':'false')});
  $('.sr-scope').textContent={all:'全部',sessions:'会话',messages:'消息',date:'日期'}[k];root.dataset.scope=k;
  st.tStir=now();if(!silent&&st.open){if(st.q)query(true);else{buildCards(st.all||st.cards.map(c=>c.g),'sugg');stageSet()}}};
const move=d=>{if(!st.cards.length)return;st.sel+=d;aria()};   /* the orbit is a ring: ↑ on the first card turns round to the last */
const openSel=()=>{if(st.mode==='error'){query(true);return}const c=st.cards[idx()];if(!c)return;setGly('启');st.tStir=now();
  const s=c.g.session,h=(c.g.hits||[])[0];const p={sessionId:s.id,messageId:h&&st.mode==='results'?h.messageId:null,q:st.q};
  st.opening={el:c.el,t:now()};
  /* the conversation is switched in under the night, so the veil recedes onto it (no flash of the page behind) */
  setTimeout(()=>{req('search.open',p);close()},RM.matches?0:170)};
/* default local open (no backend): open the conversation in rococo_v1's history view and point at the message */
window.__searchOpenLocal=(p,s)=>{const F=window.__files,Se=window.__set;if(F&&F.S.open)F.close();if(Se&&Se.S.open)Se.close();
  const idx=p.sessionId===HIST_ID&&p.messageId?+p.messageId.split('_').pop():null;
  if(window.__rkOpenHist)window.__rkOpenHist(s.title,idx)};

/* ---------------------------------------------------------------- input & keys */
inp.addEventListener('input',()=>{st.q=inp.value.trim();root.classList.toggle('has-q',!!inp.value);if(!st.q){query(true)}else query()});
addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&(e.key==='k'||e.key==='K')){e.preventDefault();e.stopPropagation();st.open&&st.phase!=='closing'?close():open();return}
  if(!st.open||st.phase==='closing')return;
  if(e.isComposing)return;
  const k=e.key;
  if(k==='Escape'){e.preventDefault();e.stopPropagation();close();return}
  if(k==='ArrowDown'){e.preventDefault();e.stopPropagation();move(1);return}
  if(k==='ArrowUp'){e.preventDefault();e.stopPropagation();move(-1);return}
  if(k==='Enter'){e.preventDefault();e.stopPropagation();openSel();return}
  if(k==='Tab'){e.preventDefault();e.stopPropagation();const ks=['all','sessions','messages','date'];setScope(ks[(ks.indexOf(st.scope)+(e.shiftKey?3:1))%4]);return}
  if(document.activeElement!==inp&&k.length===1&&!e.ctrlKey&&!e.metaKey)inp.focus({preventScroll:true})},true);
root.addEventListener('click',e=>{if(st.phase==='closing')return;
  const c=e.target.closest('.sr-c');if(c){const i=+c.dataset.i;if(i===idx())openSel();else{st.sel+=wrap(i-idx());aria()}inp.focus({preventScroll:true});return}
  const t=e.target.closest('.sr-tab');if(t){setScope(t.dataset.s);inp.focus({preventScroll:true});return}
  const ch=e.target.closest('.sr-chip');if(ch){st.q=ch.dataset.q;inp.value=st.q;root.classList.add('has-q');query(true);inp.focus({preventScroll:true});return}
  if(e.target.closest('.sr-clr')){req('search.recentClear',{});chips.querySelectorAll('.sr-chip').forEach((el,k)=>{if(!RM.matches)el.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-10px) rotate(-4deg)'}],{duration:260,delay:k*40,fill:'forwards',easing:'cubic-bezier(.55,0,.75,.2)'})});inp.focus({preventScroll:true});return}
  if(e.target.closest('.sr-stage')){openSel();inp.focus({preventScroll:true});return}
  if(e.target.closest('.sr-box,.sr-recent,.sr-tabs,.sr-status,.sr-pn,.sr-head,.sr-date'))return;
  close()});
root.addEventListener('wheel',e=>{if(!st.open)return;e.preventDefault();const n=now();if(n-(st.wh||0)<.16)return;st.wh=n;move(e.deltaY>0?1:-1)},{passive:false});

/* ---------------------------------------------------------------- the frame loop (everything time-driven, so captures with a virtual clock are exact) */
const BACK=bez(.34,1.56,.64,1),FLOW=bez(.42,.08,.22,1);
const SIDX={all:0,sessions:1,messages:2,date:3};
const ivs=[];let ivsN=0;
function frame(){if(!st.open)return;const n=now(),dt=Math.min(.1,n-st.lastFrame);st.lastFrame=n;const rm=RM.matches;
  const to=n-st.tOpen,closing=st.phase==='closing',tc=closing?n-st.tClose:0;
  if(closing&&tc>=(rm?.2:.6)){finishClose();return}
  if(!closing&&to>1.3)st.phase='open';
  const [ox,oy]=st.origin,R=Math.hypot(Math.max(ox,G.W-ox),Math.max(oy,G.H-oy))+160;
  root.style.opacity=rm?(closing?1-cl(tc/.2):cl(to/.2)).toFixed(3):'1';
  /* ink-flow reveal out of the magnifier tag (and back into it on close) */
  let vr=rm?1:FLOW(cl(to/.95));if(closing)vr=rm?1:1-INQ(cl((tc-.08)/.5));
  root.style.clipPath=rm||(!closing&&to>1.2)?'none':`circle(${(vr*R*1.12+24).toFixed(1)}px at ${ox.toFixed(1)}px ${oy.toFixed(1)}px)`;
  const ease=1-Math.exp(-dt/.25);st.mx+=((st.mouse[0]||G.W/2)-st.mx)*ease;st.my+=((st.mouse[1]||G.H/2)-st.my)*ease;
  const stir=rm?0:.95*Math.exp(-Math.max(0,n-st.tStir)*1.5)+(st.mode==='loading'?.5:0);
  if(GLX){if(rm||n-st.lastDraw>=1/30-1e-3||to<1||closing){st.lastDraw=n;GLX.draw({ox,oy,mx:st.mx,my:st.my,t:rm?7:n+7,r:vr*R,stir,edge:90})}}
  else $('.sr-bgf').style.clipPath=rm?'none':`circle(${(vr*R).toFixed(1)}px at ${ox.toFixed(1)}px ${oy.toFixed(1)}px)`;
  const cf=closing&&!rm?1-SM(tc/.32):1;
  const up=(t0,d)=>rm?1:OUT(cl((to-t0)/d));
  const px=(st.mx/G.W-.5)*2,py=(st.my/G.H-.5)*2;const par=(k)=>rm?'':` translate(${(-px*k).toFixed(2)}px,${(-py*k*.6).toFixed(2)}px)`;
  /* HUD hairlines draw in */
  drs.forEach((e,k)=>{const p=rm?1:closing?1-SM(tc/.35):SM((to-.22-k*.06)/.5);e.style.strokeDashoffset=(1-p).toFixed(4)});
  tks.style.opacity=(up(.45,.4)*cf).toFixed(3);
  tks.setAttribute('transform',`rotate(${(rm?0:n*1.6%360).toFixed(2)} ${G.ox} ${G.oy})`);
  /* ring text: turns to the active scope, sways gently */
  const tgt=-(SIDX[st.scope]*90+45);const ra=1-Math.exp(-dt/.22);st.ringA+=(tgt-st.ringA)*(rm?1:ra);
  const ringOpen=rm?0:(1-OUT(cl((to-.35)/.75)))*-70;
  rtx.setAttribute('transform',`rotate(${(st.ringA+ringOpen+(rm?0:Math.sin(n*.25)*4)).toFixed(3)} ${G.ox} ${G.oy})`);rtx.style.opacity=(up(.35,.5)*cf).toFixed(3);
  rtx.querySelectorAll('.sr-lbl').forEach(t=>t.classList.toggle('on',t.dataset.k===st.scope));
  /* big outline numerals: strokes drawn in */
  const bg=$('.sr-big');bg.style.strokeDasharray='900';bg.style.strokeDashoffset=(900*(1-(rm?1:SM((to-.3)/.8)))).toFixed(1);bg.style.opacity=cf.toFixed(3);
  const ix=$('.ixn');ix.style.strokeDasharray='700';ix.style.strokeDashoffset=(700*(1-(rm?1:SM((n-Math.max(st.tIx||0,st.tOpen+.5))/.6)))).toFixed(1);ix.style.opacity=(cf*(st.mode==='results'||st.mode==='recent'?1:.25)).toFixed(3);
  /* the giant vertical glyph: ink develops from the top; the old one washes out */
  glys.forEach((e,k)=>{const on=k===st.glyOn;const u=rm?1:cl((n-Math.max(st.tGly,st.tOpen+.42))/.7);
    if(on){e.style.opacity=(cf).toFixed(3);e.style.webkitMaskPosition=e.style.maskPosition=`0 ${((1-SM(u))*100).toFixed(1)}%`;e.style.filter=rm?'none':`blur(${((1-u)*5).toFixed(2)}px)`}
    else{const o=rm?0:1-SM(u*1.5);e.style.opacity=(o*cf).toFixed(3);e.style.filter=rm?'none':`blur(${(SM(u)*8).toFixed(2)}px)`;e.style.webkitMaskPosition=e.style.maskPosition='0 0%'}
    e.parentNode.style.transform=par(14)});
  $('.sr-gsub').style.opacity=(up(.6,.5)*cf).toFixed(3);
  /* head, date, footer */
  const hp=up(.3,.55);$('.sr-head').style.opacity=(hp*cf).toFixed(3);$('.sr-head').style.transform=`translateX(${((1-hp)*-24).toFixed(1)}px)`;
  const dp=up(.4,.55);$('.sr-date').style.opacity=(dp*cf).toFixed(3);$('.sr-date').style.transform=`translateY(${((1-dp)*-12).toFixed(1)}px)`;
  $('.sr-ft').style.opacity=(up(.6,.4)*cf).toFixed(3);
  if(!st.clk||n-st.clk>1){st.clk=n;const d=new Date(),P2=v=>String(v).padStart(2,'0');const DW=['SUN','MON','TUE','WED','THU','FRI','SAT'][d.getDay()];
    $('.sr-date b').innerHTML=`${d.getFullYear()}<small>/</small>${P2(d.getMonth()+1)}<small>/</small>${P2(d.getDate())}`;$('.sr-date em').textContent=DW;
    $('.sr-date span').innerHTML=`INDEX ${DB.length} SESSIONS <i>${P2(d.getHours())}:${P2(d.getMinutes())}:${P2(d.getSeconds())}</i>`;
    $('.sr-gsub b').textContent=`${d.getFullYear()}.${P2(d.getMonth()+1)}.${P2(d.getDate())} ${DW}.`;
    $('.sr-ftt').textContent=`KIMI CODE · ARCHIVE · ${P2(d.getHours())}:${P2(d.getMinutes())}`;
    $('.sr-m1').textContent=`CHERCHER / ${st.scope.toUpperCase()}`;$('.sr-m3').textContent=`Q="${st.q||'—'}"  ${st.took==null?'':st.took+'ms'}`;$('.sr-m2').textContent=`${N2(idx()+1)} / ${N2(st.cards.length)}`}
  $('.sr-gsub i').textContent={'寻':'Chercher · en veille','阅':'Lire · trouve','启':'Ouvrir · en cours'}[st.gly]||'';
  front(cf,up,par,n,rm,dt,closing,tc);
  requestAnimationFrame(frame)}
const SO=(el,o,tr)=>{el.style.opacity=o;el.style.transform=tr};
const bz3=(a,b,c,d,u)=>{const v=1-u;return [v*v*v*a[0]+3*v*v*u*b[0]+3*v*u*u*c[0]+u*u*u*d[0],v*v*v*a[1]+3*v*v*u*b[1]+3*v*u*u*c[1]+u*u*u*d[1]]};
function front(cf,up,par,n,rm,dt,closing,tc){const to=n-st.tOpen,sp=rm?0:n;
  /* the arch window + its sky script */
  const ap=up(.3,.55);const arch=$('.sr-arch');arch.style.opacity=(ap*cf).toFixed(3);
  const scp=rm?1:cl((to-.62)/.7);const scr=$('.sr-scr');scr.style.opacity=cf.toFixed(3);
  scr.style.webkitMaskImage=scr.style.maskImage=`linear-gradient(105deg,#000 ${(scp*130-20).toFixed(1)}%,transparent ${(scp*130).toFixed(1)}%)`;
  /* search card + tabs */
  const bp=up(.4,.5);box.style.opacity=(bp*cf).toFixed(3);box.style.transform=`translateY(${((1-bp)*-14).toFixed(2)}px)`;
  $('.sr-tabs').style.opacity=(up(.5,.45)*cf).toFixed(3);
  const shP=rm?1:cl((to-.8)/.8);$('.sr-sheen').style.setProperty('--shx',`${(-130+shP*390).toFixed(1)}%`);$('.sr-sheen').style.opacity=shP>0&&shP<1?'1':'0';
  /* collage stickers: building leans in from the corner, temple rises out of the cloud, ladder lowers, angel and poem pop on */
  const k1=up(.2,.7);SO($('.sr-bld'),`${(k1*cf).toFixed(3)}`,`translate(${((1-k1)*-40).toFixed(1)}px,${((1-k1)*-40).toFixed(1)}px) rotate(${(-4+(1-k1)*-8).toFixed(2)}deg)`+par(3));
  const k2=up(.3,.9);const fl=Math.sin(sp*.5)*4;
  SO($('.sr-tmp'),`${(SM(k2*1.4)*cf).toFixed(3)}`,`translateY(${((1-k2)*110+fl).toFixed(1)}px)`+par(6));
  [['.sr-col.sr-q1',.38,-3],['.sr-col.sr-q2',.46,4]].forEach(([q,t0,rot],i)=>{const p=up(t0,.8);SO($(q),`${(SM(p*1.4)*cf).toFixed(3)}`,`translateY(${((1-p)*90+Math.sin(sp*.5+1+i)*3).toFixed(1)}px) rotate(${rot}deg)`+par(7+i))});
  const cp=up(.25,.9);$$('.sr-clouds').forEach((e,i)=>{e.style.opacity=(cp*cf).toFixed(3);e.style.transform=`translateX(${(Math.sin(sp*.12+i*2)*10).toFixed(1)}px)`+par(i?9:4)});
  const k3=up(.45,.7);SO($('.sr-lad'),`${(k3*cf).toFixed(3)}`,`translateY(${((1-k3)*-120).toFixed(1)}px) rotate(${(6+Math.sin(sp*.3)*.4).toFixed(2)}deg)`+par(4));
  const k4=rm?1:cl((to-.85)/.6);SO($('.sr-ang'),`${(SM(k4*2)*cf).toFixed(3)}`,`scale(${(rm?1:.6+.4*BACK(k4)).toFixed(4)}) rotate(${((1-k4)*-10).toFixed(2)}deg)`+par(8));
  const k5=up(.9,.6);$('.sr-poem2').style.opacity=(k5*cf).toFixed(3);$('.sr-poem2').style.transform=`rotate(-2deg) translateY(${((1-k5)*16).toFixed(1)}px)`+par(5);
  /* three white doves: out of the magnifier, through the columns, two fly off, one settles on the arch */
  const [ox,oy]=st.origin,T=G.tmp;const apx=(G.ax0+G.ax1)/2;
  $$('.sr-dove').forEach((e,i)=>{const t0=.25+i*.18,dur=i===2?1.5:1.9;const u=rm?1:cl((to-t0)/dur);
    let p,sc=[.8,.62,.7][i],fly=true;
    if(i<2){p=bz3([ox,oy],[T.x+T.w*(.35+i*.3),T.y+T.h*(.3+i*.1)],[G.ax1+60,120+i*40],[G.W+160,-80+i*60],SM(u));if(rm){e.style.opacity='0';return}}
    else{const land=[apx+64,G.H*.03];p=bz3([ox,oy],[T.x+T.w*.5,T.y+T.h*.45],[apx-180,60],land,OUT(u));fly=u<.98}
    const flap=fly&&!rm?1-.42*Math.abs(Math.sin((n-t0)*16+i)):1;const bob=!fly?Math.sin(sp*1.6)*1.5:0;
    const o=rm?(i===2?1:0):i<2?SM(cl(u*8))*(1-SM(cl((u-.85)/.15))):SM(cl(u*8));
    e.style.opacity=(o*cf).toFixed(3);e.style.transform=`translate(${(p[0]-48).toFixed(1)}px,${(p[1]-30+bob).toFixed(1)}px) scale(${(-sc).toFixed(3)},${(sc*flap).toFixed(3)}) rotate(${fly?-8:4}deg)`});
  /* glass panels slide in, staggered, with a light parallax */
  const dim=st.mode==='loading'&&n-st.tLoad>.12?.62:1;
  const lp=up(.42,.55),rp2=up(.55,.55);
  pnL.style.opacity=(lp*cf).toFixed(3);pnL.style.transform=`translateX(${((1-lp)*46).toFixed(1)}px)`+par(5);
  pnR.style.opacity=(rp2*cf).toFixed(3);pnR.style.transform=`translateY(${((1-rp2)*30).toFixed(1)}px)`+par(3);
  const tR=n-Math.max(st.tRes,st.tOpen+.55);
  st.cards.forEach((c,i)=>{const e=rm?1:OUT(cl((tR-i*.04)/.4));c.el.style.opacity=(e*dim).toFixed(3);c.el.style.transform=`translateX(${((1-e)*18).toFixed(1)}px)`});
  /* detail: cross-dissolve with a little push */
  const u=rm?1:cl((n-st.tT)/.38);dts.forEach((e,k)=>{const on=k===st.tOn,o=on?SM(u):1-SM(u);e.style.opacity=(o*dim).toFixed(3);e.style.visibility=o<.01?'hidden':'inherit';e.style.transform=`translateY(${(on?(1-OUT(u))*10:-SM(u)*6).toFixed(1)}px) scale(${(on?.985+.015*OUT(u):1).toFixed(4)})`});
  /* the diamond: scales in, flips between results */
  const dp=up(.5,.6);dia.style.opacity=(dp*cf*(st.mode==='empty'||st.mode==='error'?.55:1)).toFixed(3);
  const du=rm?1:cl((n-Math.max(st.tD,st.tOpen+.5))/.56),dir=st.dDir||1;
  dia.style.transform=`scale(${(.82+.18*BACK(dp)).toFixed(4)})`+par(6);
  $('.sr-dq').style.transform=`rotate(${((1-dp)*-30).toFixed(2)}deg) scale(${(1-.035*Math.sin(du*Math.PI)).toFixed(4)})`;
  dvs.forEach((e,k)=>{const on=k===st.dOn;let ry,o;
    if(on){const v=cl((du-.42)/.58);ry=-dir*90*(1-OUT(v));o=du>.42||rm?1:0}else{const v=cl(du/.42);ry=dir*90*SM(v);o=du<.42&&!rm?1:0}
    e.style.transform=`rotateY(${ry.toFixed(2)}deg) translateX(${(on?-dir*(1-OUT(cl((du-.42)/.58)))*30:dir*SM(cl(du/.42))*30).toFixed(1)}px)`;e.style.opacity=(o*dim).toFixed(3)});
  }

/* ---------------------------------------------------------------- self-running demo (#search-play): click the tag → type → results → ↑↓ → Enter */
const demo=()=>{const cur=document.getElementById('rkCur');const D={x:900,y:620,press:-9};const its=[...document.querySelectorAll('.rail .grp .it')];
  const tagXY=()=>{const r=its[3].getBoundingClientRect();return [r.left+r.width/2+4,r.top+r.height/2+6]};
  const key=k=>{const ev=new KeyboardEvent('keydown',{key:k,bubbles:true,cancelable:true});inp.dispatchEvent(ev)};
  const type=ch=>{inp.value+=ch;inp.dispatchEvent(new Event('input',{bubbles:true}))};
  const S=[[.25,()=>{window.__rail2&&window.__rail2.show()}],[1.4,()=>{D.press=now();its[3].click()}],
    [4.0,()=>type('流')],[4.25,()=>type('式')],[6.0,()=>key('ArrowDown')],[6.8,()=>key('ArrowDown')],[7.6,()=>key('Tab')],[8.6,()=>key('Tab')],[9.6,()=>key('ArrowUp')],[10.4,()=>key('Enter')]];
  const P=[[0,[900,620]],[.3,[900,620]],[1.25,null],[1.75,null],[2.6,[760,300]],[4.6,[760,300]],[5.4,[840,360]],[99,[880,420]]];
  const t0=now();let si=0;window.__searchPlayT0=t0;
  const tick=()=>{const t=now()-t0;while(si<S.length&&t>=S[si][0]){S[si][1]();si++}
    let p=P[0][1];for(let k=0;k<P.length-1;k++){const [a,pa]=P[k],[z,pz]=P[k+1];if(t>=a&&t<z){const A=pa||tagXY(),Z=pz||tagXY(),u=SM((t-a)/(z-a));p=[A[0]+(Z[0]-A[0])*u,A[1]+(Z[1]-A[1])*u-Math.sin(u*Math.PI)*16];break}if(t>=z)p=pz||tagXY()}
    D.x=p[0];D.y=p[1];if(cur){cur.style.opacity=t>.2&&t<12.4?'1':'0';cur.style.transform=`translate(${(D.x-3).toFixed(2)}px,${(D.y-2).toFixed(2)}px) scale(${now()-D.press<.12?.88:1})`}
    if(t<13)requestAnimationFrame(tick)};
  requestAnimationFrame(tick)};

/* ---------------------------------------------------------------- api + boot */
window.__search={emit,onRequest:null,mock,open,close,toggle:()=>{st.open&&st.phase!=='closing'?close():open()},
  get isOpen(){return st.open&&st.phase!=='closing'},get state(){return {open:st.open,phase:st.phase,q:st.q,scope:st.scope,mode:st.mode,sel:idx(),n:st.cards.length}},
  select:i=>{st.sel=i;st.selF=i;aria()}};
setScope('all',true);
const boot=()=>{
  if(has('search-loading'))mock.hold=true;
  const sc=has('search-typing')?{q:'流式'}:has('search-empty')?{q:'向日葵'}:has('search-loading')?{q:'transcript'}:has('search')||has('soon-search')?{}:null;
  if(sc){window.__rail2&&window.__rail2.show();setTimeout(()=>open(sc),520)}
  else if(has('search-play'))setTimeout(demo,1900)};
window.__searchDemo=demo;
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>requestAnimationFrame(()=>requestAnimationFrame(boot)));
})();
