(()=>{
/* ===================================================================================================
   状态 #10 · 内置浏览器 v8 ——「Édition du jour · 编辑排版版」  rococo v2 合并版的一层（2026-10-28 10:40；
   v6「法式版画手账」(7/10) 备份 *.bak-1040.*（= *.bak-2200.*）；v7 (0/10) 存档 _v7keep/，不复用）
   在 v6 上做减法 + 换真实材质，只有一个招牌动作：
   · 招牌：一张印着大而疏的雾蓝 toile 的硫酸纸（canvas 2D 绘制，半透明、边缘受光）。新标签页时它盖着跨页的左页；
     加载时它滑过来盖住整页（从网页上加载则轻轻落下），网页到来时从右下角被拈起、翻折（背面镜像 + 卷边高光 + 投影）揭走。
   · 左 = 杂志报头：大号 N° 10、Édition du jour、当天日期、细线、一行小标语 + 版权页式的记录行；下面一颗 ASCII 字符地球
     （Canvas 2D，稀疏大字符 · : ; + * o O / K I M I，自转 + 鼠标轻微转向，滚轮/滚动时沿速度方向拖尾、弹簧回弹；加载开始时字符散开再聚拢）。
     画框左上垂下一条雾蓝缎带书签。右 = 引擎记录、铜版手工上色大闪蝶标本卡、glassine 小信封（截图装进去、盖蓝蜡封、滑进信封叠）。
   · 加载 = 银钢笔尖沿画框顶边画出一道真实笔触的蓝墨线（偶尔顿一下），完成后笔抬起，墨线收成右上角一个小墨点。
   · 失败 = 一封淡蓝和纸信 + 信封，波浪邮戳与「Retour à l'envoyeur · 退回寄件人」印章砸下。
   · Kimi 接管 = 一块柔和的椭圆天光（借 BnF 椭圆阅览室，只取光）缓慢移过画框；钢笔尖代理光标照旧。
   · 彩蛋：每天第一次打开时，硫酸纸 toile 里的那只信鸽被惊飞出画框（localStorage，一天一次；window.__brDove() 可强制）。
   素材 b10v/v8/out（generate_image → b10v/v8/proc8.py，来源 b10v/SOURCES.md「v8」段）。无暗色 / 金 / 粉紫 / 暖棕 / 橙；无波点格纹条纹蕾丝颗粒。
   ---------------------------------------------------------------------------------------------------
   后端 → 页面   window.__browser.emit(type, payload)
     'browser.tabs'        {tabs:[{id,title,url,favicon?}], activeId}
     'browser.navigate'    {tabId, url, canGoBack, canGoForward}
     'browser.loading'     {tabId, url, progress?}
     'browser.loaded'      {tabId, url, title, status, tookMs, requests, bytes}
     'browser.error'       {tabId, url, code, message}
     'browser.agentAction' {tabId, kind:'move'|'click'|'type'|'scroll'|'highlight'|'done', selector?, rect?:{x,y,w,h}, label, text?, step?, total?}
     'browser.console'     {tabId, kind:'log', level, text, ts} | {tabId, kind:'network', method, url, status, type, bytes, ms}
   页面 → 后端   window.__browser.onRequest = (type, payload) => {}     （没接后端时用内置 mock）
     'browser.open' {url, tabId} · 'browser.back' · 'browser.forward' · 'browser.reload' {tabId}
     'browser.newTab' {} · 'browser.closeTab' {tabId} · 'browser.activateTab' {tabId}
     'browser.takeover' {on} · 'browser.screenshot' {tabId} · 'browser.bounds' {x,y,width,height}
     v8 新增（可选，后端可忽略）：'browser.cover' {on}  —— 硫酸纸盖住视口时 on:true，揭开后 on:false。Electron 里 WebContentsView 是原生层，
       盖在 DOM 之上；后端可在 on:true 时把原生视图暂时隐藏/截图代替，揭开结束再显示，硫酸纸才看得见。
   场景 hash：#browser #browser-loading #browser-error #browser-newtab #browser-agent #browser-play（前缀 br/… 也可：#br/loading …）
   =================================================================================================== */
const b=document.body,RM=matchMedia('(prefers-reduced-motion: reduce)');
const HASH=window.__navHash||decodeURIComponent(location.hash.slice(1)).split(/[&,]/).filter(Boolean);
const has=k=>HASH.includes(k);
const now=()=>performance.now()/1000;
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cl=(v,a=0,z=1)=>Math.max(a,Math.min(z,v));
const bez=(x1,y1,x2,y2)=>{const A=(a,b)=>1-3*b+3*a,B=(a,b)=>3*b-6*a,C=a=>3*a;
  const cal=(t,a,b)=>((A(a,b)*t+B(a,b))*t+C(a))*t,sl=(t,a,b)=>3*A(a,b)*t*t+2*B(a,b)*t+C(a);
  return x=>{if(x<=0)return 0;if(x>=1)return 1;let t=x;for(let i=0;i<8;i++){const s=sl(t,x1,x2);if(Math.abs(s)<1e-6)break;t-=(cal(t,x1,x2)-x)/s}return cal(cl(t),y1,y2)}};
const OUT=bez(.16,1,.3,1),INQ=bez(.55,0,.75,.2),SM=u=>{u=cl(u);return u*u*(3-2*u)};
const pad=(n,k=2)=>String(n).padStart(k,'0');
const IMG={paper:'__B10_PAPER__',vellum:'__B10V8_VELLUM__',d1:'__B10V8_DOVE1__',d2:'__B10V8_DOVE2__',d3:'__B10V8_DOVE3__',spec:'__B10V8_SPECIMEN__',ribbon:'__B10V8_RIBBON__',
  sealB:'__B10V8_SEAL_BLUE__',sealI:'__B10V8_SEAL_IVORY__',glass:'__B10V8_GLASSINE__',letter:'__B10V8_LETTER__',env:'__B10V8_ENVELOPE__',leaf:'__B10V8_LEAF__',
  nib:'__B10V8_NIB__',ink:'__B10V8_INKLINE__',sky:'__B10V8_SKYLIGHT__'};
const OUTB='cubic-bezier(.16,1,.3,1)',SLAM='cubic-bezier(.6,.04,.98,.33)';
/* 11:51 · every bitmap is decoded once up front (and kept), so the first time a letter / envelope / seal / leaf / nib shows up it costs no decode frame */
const IMGK=Object.values(IMG).filter(u=>u&&u.startsWith('data:')).map(u=>{const i=new Image();i.decoding='async';i.src=u;if(i.decode)i.decode().catch(()=>{});return i});
const D0=Date.now(),P0=performance.now(),clock=()=>new Date(D0+performance.now()-P0);   /* wall clock that follows the page clock (real time live, virtual time in captures) */
const setT=(el,v)=>{if(el&&el.__t!==v){el.__t=v;el.textContent=v}};
/* ---------------------------------------------------------------- favicons (inline svg, ink hairline + silver-blue) */
const FAV={
 vite:'<svg viewBox="0 0 16 16"><path d="M2 3l6 11 6-11-6 2z" fill="#DCE2F1" stroke="#1E2748" stroke-width="1" stroke-linejoin="round"/><path d="M8.6 3.6L6.8 8h2.1l-1 3.6 3-5H8.8l1-3z" fill="#7C93BA"/></svg>',
 docs:'<svg viewBox="0 0 16 16"><path d="M3 2.5h7l3 3v8H3z" fill="#FBF9F4" stroke="#1E2748" stroke-width="1"/><path d="M10 2.5v3h3M5 8h6M5 10.5h4" stroke="#7C93BA" stroke-width="1" fill="none"/></svg>',
 git:'<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="#DCE2F1" stroke="#1E2748" stroke-width="1"/><path d="M5.6 11.6c0-1.4.8-1.9 1.4-2.1-1.6-.2-2.6-.9-2.6-2.5 0-.6.2-1 .5-1.4-.1-.3-.1-.8.1-1.3.6 0 1 .3 1.4.6a5 5 0 0 1 3.2 0c.4-.3.8-.6 1.4-.6.2.5.2 1 .1 1.3.3.4.5.8.5 1.4 0 1.6-1 2.3-2.6 2.5.6.2 1.4.7 1.4 2.1" fill="none" stroke="#1E2748" stroke-width=".9"/></svg>',
 cloud:'<svg viewBox="0 0 16 16"><path d="M4.4 12.2a2.6 2.6 0 0 1-.3-5.2 3.4 3.4 0 0 1 6.5-1 2.7 2.7 0 0 1 1.6 5.2z" fill="#FBF9F4" stroke="#7C93BA" stroke-width="1.1" stroke-linejoin="round"/></svg>',
 note:'<svg viewBox="0 0 16 16"><path d="M3 2.5h7.5l2.5 2.5v8.5H3z" fill="#E6ECF6" stroke="#4A5A86" stroke-width="1"/><path d="M10.5 2.5V5H13" fill="none" stroke="#4A5A86" stroke-width="1"/></svg>',
 load:'<svg viewBox="0 0 16 16" class="spin"><circle cx="8" cy="8" r="5.5" fill="none" stroke="#DCE2F1" stroke-width="2"/><path d="M8 2.5a5.5 5.5 0 0 1 5.5 5.5" fill="none" stroke="#1E2748" stroke-width="1.6" stroke-linecap="round"/></svg>'};
const SG={W:896,H:872};
const WAVES=(w,n,y0,gap,amp)=>{let o='';for(let i=0;i<n;i++){const y=y0+i*gap;let d=`M0 ${y}`;for(let x=0;x<=w;x+=24)d+=`Q${x+6} ${y-amp} ${x+12} ${y}T${x+24} ${y}`;o+=`<path d="${d}"/>`}return o};
/* fountain-pen nib (Kimi's cursor): tip at (3,3) */
const NIB=`<svg class="ag-cur" width="42" height="42" viewBox="0 0 34 34" aria-hidden="true"><defs><linearGradient id="brNib" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#E4E9F2"/><stop offset="1" stop-color="#B9C4D8"/></linearGradient></defs>
  <g transform="rotate(45 3 3)"><path d="M3 3 L9.4 -0.6 Q13.8 -3.4 19.5 -5.6 L27 -5.6 Q31 -3.8 31.4 3 Q31 9.8 27 11.6 L19.5 11.6 Q13.8 9.4 9.4 6.6 Z" fill="url(#brNib)" stroke="#2E3B68" stroke-width=".9" stroke-linejoin="round"/>
  <path d="M3.6 3 H15.2" stroke="#2E3B68" stroke-width=".8"/><circle cx="16.6" cy="3" r="1.25" fill="#FFFFFF" stroke="#2E3B68" stroke-width=".8"/>
  <path d="M21 -2.6 Q24 3 21 8.6 M24.6 -3.6 Q28.2 3 24.6 9.6" fill="none" stroke="#7C93BA" stroke-width=".6"/></g></svg>`;
/* ---------------------------------------------------------------- mock sites (stand-ins for what WebContentsView would show) */
const SITES={
 'localhost:5173':{title:'Trianon Workbench · 登录',fav:'vite',took:412,req:18,bytes:1.24,render:()=>pgLogin()},
 'localhost:5173/sessions':{title:'Trianon Workbench · 会话',fav:'vite',took:236,req:9,bytes:.62,render:()=>pgDash()},
 'localhost:4173/docs/adapter-api':{title:'Adapter API · workspace.list',fav:'docs',took:188,req:7,bytes:.41,render:()=>pgDocs()},
 'github.com/example/trianon':{title:'example / trianon',fav:'git',took:964,req:46,bytes:2.8,render:()=>pgGeneric('example / trianon','github.com')},
 'vitejs.dev/guide':{title:'Vite · 开始',fav:'vite',took:540,req:22,bytes:1.1,render:()=>pgGeneric('Vite · Getting Started','vitejs.dev')}};
const norm=u=>{u=String(u||'').trim();if(!u)return '';if(!/^[a-z]+:\/\//i.test(u)&&!/^about:/.test(u))u=(/^(localhost|127\.)/.test(u)?'http://':'https://')+u;return u};
const keyOf=u=>u.replace(/^[a-z]+:\/\//i,'').replace(/[#?].*$/,'').replace(/\/$/,'').toLowerCase();
const site=u=>SITES[keyOf(u)];

function pgLogin(){return `<div class="mk mk-login">
 <header class="mk-nav"><b>✦ Trianon Workbench</b><span>会话</span><span>文件</span><span>设置</span><i>vite 5.4 · HMR</i></header>
 <section class="mk-hero"><em>Bienvenue</em><h1>登录工作台</h1><p>本地开发预览 · 端口 5173。<br>登录后会话、文件和引擎状态会同步到这里。</p></section>
 <form class="mk-card" onsubmit="return false"><h2>欢迎回来</h2>
  <label>邮箱<input data-ag="email" type="text" placeholder="name@example.com" autocomplete="off"></label>
  <label>密码<input data-ag="password" type="password" placeholder="••••••••" autocomplete="off"></label>
  <div class="mk-row"><span><i class="mk-ck"></i>记住我</span><a>忘记密码？</a></div>
  <button type="button" data-ag="login" class="mk-btn">登 录</button>
  <p class="mk-small">还没有账号？<a>注册</a></p></form></div>`}
function pgDash(){return `<div class="mk mk-dash">
 <header class="mk-nav"><b>✦ Trianon Workbench</b><span class="on">会话</span><span>文件</span><span>设置</span><i>colette · 已登录</i></header>
 <section class="mk-dh"><em>Bonjour</em><h1>早上好，Colette</h1><p>上次停在「重构聊天工作台的流式渲染」。</p></section>
 <div class="mk-cards"><div><small>会话</small><b>12</b><span>本周 +3</span></div><div><small>本周改动</small><b>+312</b><span>−88 行</span></div><div><small>引擎</small><b>正常</b><span>K3.1 Pro · 1M</span></div></div>
 <ul class="mk-list"><li><b>重构聊天工作台的流式渲染</b><span>13:41</span></li><li><b>WebContentsView 内置浏览器</b><span>13:30</span></li><li><b>流式输出落笔动效</b><span>11:42</span></li></ul></div>`}
function pgDocs(){return `<div class="mk mk-docs">
 <aside><b>Adapter API</b><a>概览</a><a>emit · 事件</a><a class="on">workspace.list</a><a>file.read</a><a>git.status</a><a>onRequest</a></aside>
 <article><p class="mk-bc">docs / adapter-api / files</p><h1>workspace.list · 列出目录</h1>
 <p>列出工作区里某个目录的直接子项，遵守 .gitignore。返回按「文件夹在前、名称升序」排好。</p>
 <pre>window.__files.onRequest('workspace.list',
  { path: 'src/renderer', depth: 1 })</pre>
 <table><tr><th>参数</th><th>类型</th><th>说明</th></tr><tr><td>root</td><td>string</td><td>工作区根目录（适配器自己知道）</td></tr><tr><td>path</td><td>string</td><td>相对路径，空 = 根</td></tr><tr><td>depth</td><td>number</td><td>默认 1，最大 4</td></tr></table></article></div>`}
function pgGeneric(t,h){return `<div class="mk mk-gen"><p class="mk-bc">${esc(h)}</p><h1>${esc(t)}</h1><p>这里是 mock 预览；真实页面由 WebContentsView 渲染在这块视口里，CDP 负责截图与代理操作。</p></div>`}
const RECENT=[{u:'http://localhost:5173',t:'Trianon Workbench',h:'localhost:5173',f:'vite',a:'2 分钟前'},{u:'http://localhost:4173/docs/adapter-api#workspace-list',t:'Adapter API · workspace.list',h:'localhost:4173',f:'docs',a:'18 分钟前'},
 {u:'https://github.com/example/trianon',t:'example / trianon',h:'github.com',f:'git',a:'昨天'},{u:'https://vitejs.dev/guide',t:'Vite · 开始',h:'vitejs.dev',f:'vite',a:'10/25'}];
const FR={W:['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],M:['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],
  ZW:['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],ZN:['一','二','三','四','五','六','七','八','九','十','十一','十二']};
const zhDay=n=>n<=10?(n===10?'十':FR.ZN[n-1]):n<20?'十'+FR.ZN[n-11]:n%10===0?FR.ZN[n/10-1]+'十':FR.ZN[Math.floor(n/10)-1]+'十'+FR.ZN[n%10-1];
/* new tab = an editorial spread: left page lies under the toile vellum, right page is the contents */
function pgNew(){return `<div class="mk mk-new"><i class="nt-gut"></i>
 <div class="nt-lp"><span class="nt-fol">N° 10 · <i>Édition du jour</i> · p. 1</span></div>
 <div class="nt-rp"><span class="nt-k">SOMMAIRE · 今日目录</span><em class="nt-sc">Où aller<br><span>aujourd'hui ?</span></em>
  <p class="nt-q">在上方写下网址，或者从目录翻开一页。</p><i class="nt-rule"></i>
  <ol class="nt-toc">${RECENT.map((r,i)=>`<li><button type="button" class="nt-card" data-u="${esc(r.u)}"><b class="no">${pad(i+1)}</b><span class="tt"><b>${esc(r.t)}</b><code>${esc(r.h)}</code></span><small>${esc(r.a)}</small></button></li>`).join('')}</ol>
  <img class="nt-leaf" src="${IMG.leaf}" alt="" draggable="false"><span class="nt-fol r">p. 2</span></div></div>`}
/* error = a pale-blue washi letter returned to sender */
const stampSVG=(id,txt,sub)=>`<svg class="er-pm" viewBox="0 0 230 110" aria-hidden="true"><defs><path id="${id}" d="M60 55 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0"/></defs>
  <g class="er-ink"><circle cx="60" cy="55" r="46" class="o"/><circle cx="60" cy="55" r="29" class="o"/><text class="pt"><textPath href="#${id}" startOffset="1">${txt}</textPath></text>
  <text x="60" y="52" text-anchor="middle" class="pd">${sub[0]}</text><text x="60" y="66" text-anchor="middle" class="ps">${sub[1]}</text>
  <g class="w" transform="translate(112 30)">${WAVES(112,5,0,12.5,4.2)}</g></g></svg>`;
function pgErr(url,code){const h=keyOf(url).split('/')[0],d=new Date();return `<div class="mk mk-err"><img class="er-env" src="${IMG.env}" alt="" aria-hidden="true">
 <div class="er-lt"><img class="er-ppr" src="${IMG.letter}" alt="" aria-hidden="true"><img class="er-leaf" src="${IMG.leaf}" alt="" aria-hidden="true">
  <div class="er-tx"><span class="er-to">À · ${esc(h)}</span><em>Page introuvable</em><h2>找不到这个页面</h2><code>${esc(code||'ERR_CONNECTION_REFUSED')}</code>
  <p>这封信没有送到——开发服务器可能还没启动，或者端口不对。</p><div class="er-btns"><button type="button" class="er-retry"><b>↻</b><span>重新投递</span></button><button type="button" class="er-back">← 返回</button></div></div>
  ${stampSVG('brPmE','NAVIGATEUR ✦ KIMI CODE ✦ PARIS ✦',[`${pad(d.getDate())}·${pad(d.getMonth()+1)}`,`${pad(d.getHours())}H${pad(d.getMinutes())}`])}
  <div class="er-ret"><b>☞</b><span><em>Retour à l'envoyeur</em><i>退回寄件人 · ${esc((code||'').replace('ERR_','').replace(/_/g,' ').toLowerCase()||'introuvable')}</i></span></div></div></div>`}

/* ---------------------------------------------------------------- markup */
const root=document.createElement('div');root.id='br';root.setAttribute('aria-hidden','true');
const svgInk=`<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="brInkF" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.45"/><feComposite in="SourceGraphic" operator="in"/></filter></svg>`;
root.innerHTML=`<div class="br-veil"></div>${svgInk}
<div class="br-mast br-in" data-d="3"><span class="mh-k">KIMI CODE · <i>le navigateur</i></span>
 <div class="mh-no"><i>N°</i><b>10</b></div><em class="mh-ed">Édition du jour</em>
 <p class="mh-dt"><span class="dt-fr"></span><span class="dt-zh"></span></p><i class="mh-rule"></i>
 <p class="mh-tag"><em>« Chaque page, une lettre. »</em><span>每一页，都是一封来信。</span></p></div>
<div class="br-stats br-in" data-d="2"><p><span>Requêtes</span><b class="s-req">0</b><i class="s-req2">—</i></p><p><span>Poids</span><b class="s-size">0.00</b><i>MB</i></p><p><span>Durée</span><b class="s-ms">0</b><i>ms</i></p><p><span>Statut</span><b class="s-st">—</b><i class="s-st2"></i></p><p><span>Vue</span><b class="s-vw">760×656</b><i>DPR 2</i></p></div>
<div class="br-atlas br-in" data-d="4"><canvas class="as-cv" width="392" height="392"></canvas><p class="as-cap"><em>Atlas</em><span>LAT 48.85 · LON <i class="as-lon">2.35</i></span></p></div>
<div class="br-info br-in" data-d="2"><h4><em>Moteur</em><span>引 擎</span></h4><p><span>Engine</span>WebContentsView</p><p><span>Driver</span>CDP · Page / Input</p><p><span>Pilote</span><b class="i-tk">OFF</b></p>
 <span class="br-dsub"></span><span class="br-ntab" hidden>3</span></div>
<div class="br-spec br-in" data-d="3"><img src="${IMG.spec}" alt="" draggable="false"><span class="sp-lab">Morpho menelaus · N° 10</span></div>
<div class="br-mail br-in" data-d="4"><h4><em>Courrier</em><span>截 图</span><i class="sh-n">N° 00</i></h4><div class="ml-stack"><div class="ml-empty"><img src="${IMG.glass}" alt=""><span>en attente</span></div></div></div>
<div class="br-stage">
 <div class="pp-mat br-in0"><i class="pp-groove"></i>
  <div class="br-crest"><i></i><em>Navigateur</em><small>N° 10 · ÉDITION DU JOUR</small><i></i></div>
  <div class="br-keys"><span><kbd>⌘L</kbd>地址栏</span><span><kbd>⌘T</kbd>新标签</span><span><kbd>⌘W</kbd>关闭</span><span><kbd>⌘R</kbd>刷新</span><span><kbd>F12</kbd>控制台</span></div>
  <div class="br-foot"><em>Kimi</em><span>· VUE 10</span></div><div class="br-foot r"><code class="bf-u"></code><i class="br-led"></i></div>
  <button type="button" class="br-conh"><em>Console</em><b>控制台</b></button></div>
 <img class="br-rib" src="${IMG.ribbon}" alt="" draggable="false">
 <div class="ly ly-pro" data-d="0">
  <div class="br-win"></div>
  <div class="br-vp">
    <div class="br-doc"></div>
    <canvas class="br-vel" width="1520" height="1312"></canvas>
    <div class="br-load"><em>En route</em><code class="bl-u"></code><span class="bl-ms">0 ms</span></div>
    <div class="br-flash"></div>
    <div class="br-ag"><div class="ag-hl"><i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i><b></b></div>
      ${NIB}
      <div class="ag-cap"><i class="ag-dot"></i><span class="ag-t"></span><code class="ag-n"></code></div><span class="ag-badge"><em>Kimi</em> · PILOTE</span></div>
    <aside class="br-con"><header><b>02</b><span><em>Console</em> · 控制台</span><nav><button type="button" class="on" data-t="log">控制台</button><button type="button" data-t="net">网络</button></nav><button type="button" class="cx">✕</button></header>
      <div class="cs-sum"></div><div class="cs-list"></div></aside>
  </div>
  <div class="br-skyw"><div class="br-sky"><img src="${IMG.sky}" alt=""></div></div>
  <div class="br-tabs" role="tablist"></div>
  <div class="br-bar">
    <button type="button" class="br-nb b-back" title="后退"><svg viewBox="0 0 20 20"><path d="M12 4.5L6.5 10l5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    <button type="button" class="br-nb b-fwd" title="前进"><svg viewBox="0 0 20 20"><path d="M8 4.5l5.5 5.5L8 15.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    <button type="button" class="br-nb b-rl" title="刷新"><svg viewBox="0 0 20 20" class="rl"><path d="M15.2 8.2A5.6 5.6 0 1 0 15.6 12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M15.8 4.2v4.3h-4.3" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg><svg viewBox="0 0 20 20" class="x"><path d="M5.5 5.5l9 9M14.5 5.5l-9 9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></button>
    <label class="br-addr"><span class="br-ato">À</span><i class="br-lock"></i><span class="br-ad"></span><input class="br-in2" type="text" spellcheck="false" autocomplete="off" aria-label="地址栏"></label>
    <button type="button" class="br-kimi" aria-pressed="false"><svg class="kp" viewBox="0 0 20 20"><g transform="rotate(45 3 3) translate(1.2 0) scale(.62)"><path d="M3 3 L9.4 -0.6 Q13.8 -3.4 19.5 -5.6 L27 -5.6 Q31 -3.8 31.4 3 Q31 9.8 27 11.6 L19.5 11.6 Q13.8 9.4 9.4 6.6 Z" fill="#FFFFFF" stroke="#2E3B68" stroke-width="1.3" stroke-linejoin="round"/><path d="M3.6 3 H15.2" stroke="#2E3B68" stroke-width="1.1"/><circle cx="16.6" cy="3" r="1.6" fill="none" stroke="#2E3B68" stroke-width="1.1"/></g></svg><span class="kt">Kimi 代驾</span><i class="ksw"><i></i></i></button>
    <button type="button" class="br-nb b-shot" title="截图"><svg viewBox="0 0 20 20"><rect x="3" y="6" width="14" height="10" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.15"/><path d="M7.2 6l1.2-2h3.2l1.2 2" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linejoin="round"/><circle cx="10" cy="11" r="2.6" fill="none" stroke="currentColor" stroke-width="1.15"/></svg></button>
    <button type="button" class="br-nb b-con" title="控制台 F12"><svg viewBox="0 0 20 20"><rect x="3" y="4" width="14" height="12" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.15"/><path d="M6.5 8.5l2 1.6-2 1.6M10.5 12h3" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"/></svg><i class="b-cnt"></i></button>
  </div>
  <div class="br-ink"><i class="ink-l"><i></i></i><i class="ink-dot"></i><img class="ink-nib" src="${IMG.nib}" alt="" draggable="false"></div>
 </div>
</div>`;
root.style.setProperty('--br-paper',`url(${IMG.paper})`);root.style.setProperty('--br-inkline',`url(${IMG.ink})`);
b.appendChild(root);
const $=q=>root.querySelector(q),$$=q=>[...root.querySelectorAll(q)];
const vp=$('.br-vp'),doc=$('.br-doc'),tabsEl=$('.br-tabs'),addr=$('.br-in2'),adisp=$('.br-ad'),lock=$('.br-lock'),
  kimi=$('.br-kimi'),con=$('.br-con'),cList=$('.cs-list'),cSum=$('.cs-sum'),ag=$('.br-ag'),agc=$('.ag-cur'),hl=$('.ag-hl'),cap=$('.ag-cap'),stage=$('.br-stage');
const prog={animate(){return {}},style:{},firstElementChild:{style:{}}};   /* v6 progress hairline is gone (the pen line replaces it) */
let G={W:innerWidth,H:innerHeight};
/* ---------------------------------------------------------------- state */
let tid=1;
const mkTab=(url,o={})=>({id:'tab_'+(tid++),url:url||'',title:o.title||'新标签页',fav:o.fav||'cloud',state:url?'loaded':'new',hist:url?[url]:[],hi:url?0:-1,
  took:o.took||0,req:o.req||0,bytes:o.bytes||0,status:o.status||(url?200:0),err:null,html:null,logged:false});
const st={open:false,phase:'closed',tOpen:-9,tClose:-9,origin:[60,560],tabs:[],active:null,takeover:false,consoleOn:false,conTab:'log',
  logs:[],net:[],shots:0,tLoad:-9,loadUrl:'',hold:false,gly:'',tGly:-9,ring:0,ringA:0,ms:0,msShown:0,mouse:[700,450],tStir:-9,lastDraw:-9,agentStep:0,agentBusy:false};
const T=()=>st.tabs.find(t=>t.id===st.active);
let bridge=null;   // set via window.__browser.onRequest
const req=(type,payload)=>{payload=payload||{};if(bridge){try{if(bridge(type,payload)!==false)return}catch(e){console.warn('browser bridge',e)}}mock(type,payload)};
st.ink={x:0,ph:'idle',tF:-9,x0:0};st.doveGone=false;st.tAsc=-9;
/* ---------------------------------------------------------------- tabs */
const renderTabs=()=>{tabsEl.innerHTML=st.tabs.map((t,i)=>`<div class="br-tab${t.id===st.active?' on':''}${t.state==='error'?' err':''}" role="tab" data-id="${esc(t.id)}" style="z-index:${t.id===st.active?20:10-i}">
  <i class="tb-fv">${t.state==='loading'?FAV.load:FAV[t.state==='error'?'note':t.fav]}</i><span class="tb-t">${esc(t.title)}</span><button type="button" class="tb-x" aria-label="关闭">✕</button></div>`).join('')+
  `<button type="button" class="br-tnew" aria-label="新标签页"><svg viewBox="0 0 20 20"><path d="M10 5.5v9M5.5 10h9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button>`;
  $('.br-ntab').textContent=st.tabs.length};
tabsEl.addEventListener('click',e=>{const x=e.target.closest('.tb-x');const tb=e.target.closest('.br-tab');
  if(e.target.closest('.br-tnew')){req('browser.newTab',{});return}
  if(x&&tb){e.stopPropagation();req('browser.closeTab',{tabId:tb.dataset.id});return}
  if(tb&&tb.dataset.id!==st.active)req('browser.activateTab',{tabId:tb.dataset.id})});

/* ---------------------------------------------------------------- address bar */
const showAddr=()=>{const t=T();const u=t?(t.state==='new'?'':(t.state==='loading'?st.loadUrl||t.url:t.url)):'';
  if(document.activeElement!==addr)addr.value=u;
  const m=u.match(/^([a-z]+:\/\/)?([^\/#?]+)(.*)$/i);
  if(!u){adisp.innerHTML='<span class="ph">输入网址，或者让 Kimi 带你去</span>';lock.className='br-lock nt';lock.innerHTML='';}
  else{const sec=/^https:/i.test(u);lock.className='br-lock '+(sec?'sec':'loc');lock.innerHTML=sec?'<svg viewBox="0 0 14 14"><rect x="3" y="6.2" width="8" height="6" rx="1.4" fill="#DCE2F1" stroke="#1E2748" stroke-width="1"/><path d="M4.8 6.2V4.6a2.2 2.2 0 0 1 4.4 0v1.6" fill="none" stroke="#1E2748" stroke-width="1"/></svg>':'<b>本地</b>';
    adisp.innerHTML=`<span class="sc">${esc((m&&m[1])||'')}</span><b>${esc(m?m[2]:u)}</b><span class="pt">${esc(m?m[3]:'')}</span>`}
  $('.bf-u').textContent=u?keyOf(u):'about:newtab'};
addr.addEventListener('focus',()=>{root.classList.add('ad-f');const t=T();addr.value=t&&t.state!=='new'?(st.loadUrl&&t.state==='loading'?st.loadUrl:t.url):'';setTimeout(()=>addr.select(),0)});
addr.addEventListener('blur',()=>{root.classList.remove('ad-f');showAddr()});
addr.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const u=norm(addr.value);if(!u)return;addr.blur();req('browser.open',{url:u,tabId:st.active})}
  else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();addr.blur()}});
/* ---------------------------------------------------------------- toolbar */
$('.b-back').addEventListener('click',()=>req('browser.back',{tabId:st.active}));
$('.b-fwd').addEventListener('click',()=>req('browser.forward',{tabId:st.active}));
$('.b-rl').addEventListener('click',()=>{const t=T();if(t&&t.state==='loading'){stopLoad();return}req('browser.reload',{tabId:st.active})});
kimi.addEventListener('click',()=>req('browser.takeover',{on:!st.takeover}));
$('.b-shot').addEventListener('click',()=>{req('browser.screenshot',{tabId:st.active});shotFx()});
$('.b-con').addEventListener('click',()=>setConsole(!st.consoleOn));
$('.br-conh').addEventListener('click',()=>setConsole(!st.consoleOn));
con.querySelector('.cx').addEventListener('click',()=>setConsole(false));
con.querySelectorAll('nav button').forEach(x=>x.addEventListener('click',()=>{st.conTab=x.dataset.t;con.querySelectorAll('nav button').forEach(y=>y.classList.toggle('on',y===x));renderCon()}));
const navBtns=()=>{const t=T();$('.b-back').disabled=!(t&&t.hi>0);$('.b-fwd').disabled=!(t&&t.hi<t.hist.length-1);root.classList.toggle('loading',!!(t&&t.state==='loading'))};

/* ---------------------------------------------------------------- the vellum sheet (canvas 2D): side (left page) · cover · drop · peel
   11:51 perf pass: the sheet is drawn at the canvas origin (+PAD) and only re-rasterised when its SHAPE changes (peel p / lift / which sheet);
   sliding (ox, oy) and fading (a) are a CSS transform + opacity on the canvas (compositor only). Soft shadows are pre-blurred sprites
   (no per-frame shadowBlur / ctx.filter on the big canvas). Both toile sheets (with / without the printed dove) are built once. */
const vel=$('.br-vel'),vx=vel.getContext('2d'),VW=760,VH=656,VD=Math.min(2,Math.max(1,window.devicePixelRatio||1)),PAD=48;
vel.width=Math.round((VW+PAD*2)*VD);vel.height=Math.round((VH+PAD*2)*VD);
Object.assign(vel.style,{left:-PAD+'px',top:-PAD+'px',width:(VW+PAD*2)+'px',height:(VH+PAD*2)+'px',opacity:'0',willChange:'transform,opacity'});
const VI=new Image();VI.src=IMG.vellum;const DI=[IMG.d1,IMG.d2,IMG.d3].map(s=>{const i=new Image();i.src=s;return i});
const DOVE={x:598,y:64,w:66};                        /* the printed dove, sheet coords */
const mkC=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c};
const sheetA=mkC(1140,984),sheetB=mkC(1140,984);let sheetOk=false;
const SHQ=4,shF=mkC((VW+PAD*2)/SHQ,(VH+PAD*2)/SHQ),shL=mkC((VW+PAD*2)/SHQ,(VH+PAD*2)/SHQ),loC=mkC((VW+PAD*2)/SHQ,(VH+PAD*2)/SHQ);
const SH='70,85,125';
const buildSheet=()=>{if(sheetOk)return true;if(!VI.complete||!VI.naturalWidth||!DI[1].complete||!DI[1].naturalWidth)return false;
  for(const [c,withDove] of [[sheetA,true],[sheetB,false]]){const x=c.getContext('2d');x.clearRect(0,0,1140,984);x.drawImage(VI,0,0,1140,984);
    if(withDove){const d=DI[1];x.globalAlpha=.78;x.drawImage(d,DOVE.x*1.5,DOVE.y*1.5,DOVE.w*1.5,DOVE.w*1.5*d.naturalHeight/d.naturalWidth);x.globalAlpha=1}}
  /* shadow sprites, quarter resolution (they are blurry anyway): resting (blur 10, y+2) and lifted (blur 36, y+12) */
  for(const [c,bl,oy] of [[shF,10,2],[shL,36,12]]){const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.save();x.scale(1/SHQ,1/SHQ);
    x.shadowColor=`rgba(${SH},.17)`;x.shadowBlur=bl/SHQ;x.shadowOffsetX=4000/SHQ;x.shadowOffsetY=oy/SHQ;x.drawImage(sheetA,PAD-4000,PAD,VW,VH);x.restore()}
  sheetOk=true;drawn='';return true};
const sheetC=()=>st.doveGone?sheetB:sheetA;
VI.onload=()=>{buildSheet()};DI[1].onload=()=>{buildSheet()};
const SIDE=-368,PSIDE=.045;
const VS={mode:'off',ox:SIDE,oy:0,a:0,lift:0,p:0,an:null};
let drawn='',velCss='';
/* tweens start on the first frame they are actually drawn (t0 = null), so a heavy frame (new page layout) never eats the first part of the motion */
const tween=(to,dur,ease,done)=>{const from={};for(const k in to)from[k]=VS[k];VS.an={t0:null,dur:RM.matches?0:dur/1000,from,to,ease:ease||OUT,done}};
const EIO=bez(.4,0,.2,1),EDROP=bez(.3,.12,.25,1);
const setVel=(mode,quick)=>{if(mode===VS.mode)return;const was=VS.mode;VS.mode=mode;
  if(mode==='off'){if(VS.a<=0){VS.an=null;return}
    if(quick||!st.open){VS.an=null;VS.a=0;VS.p=0;req('browser.cover',{on:false});return}
    if(!st.doveDone&&!st.doveGone&&eggDue())setTimeout(()=>dove(),120);
    tween({p:1},was==='side'?820:1050,bez(.45,.05,.35,1),()=>{VS.a=0;VS.p=0;req('browser.cover',{on:false})});return}
  req('browser.cover',{on:true});
  const ox=mode==='side'?SIDE:0,pp=mode==='side'?PSIDE:0;
  if(VS.a<=0||was==='off'||VS.p>PSIDE+.001){VS.ox=ox;VS.p=pp;VS.oy=-12;VS.lift=1;VS.a=0;if(quick||!st.open){VS.a=1;VS.oy=0;VS.lift=0;VS.an=null;return}tween({a:1,oy:0,lift:0},600,EDROP);return}
  if(quick||!st.open){VS.ox=ox;VS.p=pp;VS.an=null;return}
  tween({ox,lift:0,p:pp},700,bez(.3,.0,.2,1))};
/* half-plane clipping helpers */
const hp=(c,M,n,s,L=3000)=>{const t=[-n[1],n[0]];c.beginPath();c.moveTo(M[0]+t[0]*L,M[1]+t[1]*L);c.lineTo(M[0]-t[0]*L,M[1]-t[1]*L);c.lineTo(M[0]-t[0]*L+s*n[0]*L,M[1]-t[1]*L+s*n[1]*L);c.lineTo(M[0]+t[0]*L+s*n[0]*L,M[1]+t[1]*L+s*n[1]*L);c.closePath()};
const clipPoly=(P,M,n)=>{const o=[],side=q=>(q[0]-M[0])*n[0]+(q[1]-M[1])*n[1];for(let i=0;i<P.length;i++){const a=P[i],z=P[(i+1)%P.length],sa=side(a),sz=side(z);
  if(sa>=0)o.push(a);if((sa>=0)!==(sz>=0)){const k=sa/(sa-sz);o.push([a[0]+(z[0]-a[0])*k,a[1]+(z[1]-a[1])*k])}}return o};
const refl=(q,M,n)=>{const d=(q[0]-M[0])*n[0]+(q[1]-M[1])*n[1];return [q[0]-2*d*n[0],q[1]-2*d*n[1]]};
const shadowSprite=(c,lift,al)=>{if(al<=.002)return;const W=VW+PAD*2,H=VH+PAD*2;c.save();c.setTransform(VD,0,0,VD,0,0);
  if(lift<.999){c.globalAlpha=al*(1-lift);c.drawImage(shF,0,0,W,H)}if(lift>.001){c.globalAlpha=al*lift;c.drawImage(shL,0,0,W,H)}c.restore()};
const drawVel=()=>{
  const p=VS.p,fade=1-SM(cl((p-.72)/.28)),A=VS.a*fade,side=VS.ox<-10;
  const dx=p>.7?-SM((p-.7)/.3)*90:0,dy=p>.7?-SM((p-.7)/.3)*60:0;
  /* compositor part: where the sheet is and how opaque */
  const css=A<=0.002||!sheetOk?'0':`${A.toFixed(3)}|translate(${(VS.ox+dx).toFixed(2)}px,${(VS.oy+dy).toFixed(2)}px)`;
  if(css!==velCss){velCss=css;if(css==='0')vel.style.opacity='0';else{const [o,t]=css.split('|');vel.style.opacity=o;vel.style.transform=t}}
  if(A<=0.002||!sheetOk)return;
  /* raster part: only when the sheet's shape changes */
  const key=[p<=0.0005?'flat':p.toFixed(4),(p<=0.0005?VS.lift:0).toFixed(3),st.doveGone?'B':'A',side?'s':'c'].join('|');if(key===drawn)return;drawn=key;
  const c=vx,S=sheetC();c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,vel.width,vel.height);
  if(p<=0.0005){shadowSprite(c,VS.lift,1);c.setTransform(VD,0,0,VD,PAD*VD,PAD*VD);c.drawImage(S,0,0,VW,VH);
    if(side){/* edge of the vellum lying over the gutter: a lit lip + a hairline contact shadow */c.fillStyle='rgba(255,255,255,.85)';c.fillRect(VW-1.2,0,1.2,VH);c.fillStyle=`rgba(${SH},.10)`;c.fillRect(VW,0,1.5,VH)}
    return}
  c.setTransform(VD,0,0,VD,PAD*VD,PAD*VD);
  const Cn=[VW,VH],e=p,D=[-560,-420];const P=[Cn[0]+(D[0]-Cn[0])*e+Math.sin(Math.PI*e)*-36,Cn[1]+(D[1]-Cn[1])*e+Math.sin(Math.PI*e)*58];
  const M=[(Cn[0]+P[0])/2,(Cn[1]+P[1])/2];let n=[Cn[0]-P[0],Cn[1]-P[1]];const ln=Math.hypot(n[0],n[1])||1;n=[n[0]/ln,n[1]/ln];
  const R=[[0,0],[VW,0],[VW,VH],[0,VH]];const fold=clipPoly(R,M,n);const flap=fold.map(q=>refl(q,M,n));
  const lift=SM(cl(e*3));
  /* 1 · shadow the curl throws on the page that is being uncovered */
  c.save();hp(c,M,n,1);c.clip();const g0=c.createLinearGradient(M[0],M[1],M[0]+n[0]*46,M[1]+n[1]*46);g0.addColorStop(0,`rgba(${SH},${(.16*lift).toFixed(3)})`);g0.addColorStop(1,`rgba(${SH},0)`);
  c.fillStyle=g0;c.fillRect(-PAD,-PAD,VW+PAD*2,VH+PAD*2);c.restore();
  /* 2 · the part of the sheet still lying flat, on its resting shadow (pre-blurred sprite, clipped to the flat side) */
  c.save();hp(c,M,n,-1);c.clip();c.save();c.translate(-PAD,-PAD);c.drawImage(shF,0,0,VW+PAD*2,VH+PAD*2);c.restore();c.drawImage(S,0,0,VW,VH);c.restore();
  if(flap.length>2){
    /* 3 · the lifted flap's soft shadow on the flat part: polygon filled at quarter resolution, blurred there (cheap), scaled up */
    const lo=loC.getContext('2d'),q=1/SHQ,off=4+lift*12;lo.setTransform(1,0,0,1,0,0);lo.clearRect(0,0,loC.width,loC.height);
    lo.filter=`blur(${((6+lift*10)*q).toFixed(2)}px)`;lo.fillStyle=`rgba(${SH},${(.20*lift).toFixed(3)})`;lo.beginPath();
    flap.forEach((v,i)=>{const x=(v[0]-n[0]*off+PAD)*q,y=(v[1]-n[1]*off+lift*6+PAD)*q;i?lo.lineTo(x,y):lo.moveTo(x,y)});lo.closePath();lo.fill();lo.filter='none';
    c.save();hp(c,M,n,-1);c.clip();c.drawImage(loC,-PAD,-PAD,VW+PAD*2,VH+PAD*2);c.restore();
    /* 4 · the flap: the back of the vellum (mirrored print, milkier), lit roll along the crease */
    c.save();const d=2*(M[0]*n[0]+M[1]*n[1]);
    c.transform(1-2*n[0]*n[0],-2*n[0]*n[1],-2*n[0]*n[1],1-2*n[1]*n[1],d*n[0],d*n[1]);
    hp(c,M,n,1);c.clip();c.globalAlpha=.92;c.drawImage(S,0,0,VW,VH);c.globalAlpha=1;
    c.beginPath();R.forEach((v,i)=>i?c.lineTo(v[0],v[1]):c.moveTo(v[0],v[1]));c.closePath();c.clip();
    c.fillStyle='rgba(251,252,254,.34)';c.fillRect(0,0,VW,VH);
    const g=c.createLinearGradient(M[0],M[1],M[0]+n[0]*70,M[1]+n[1]*70);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.06,'rgba(255,255,255,.55)');
    g.addColorStop(.2,'rgba(226,232,242,.30)');g.addColorStop(.42,`rgba(${SH},.07)`);g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,VW,VH);c.restore();
    /* 5 · thickness: a lit edge round the flap + a hairline crease */
    c.save();c.lineJoin='round';c.beginPath();flap.forEach((v,i)=>i?c.lineTo(v[0],v[1]):c.moveTo(v[0],v[1]));c.closePath();
    c.strokeStyle=`rgba(${SH},.16)`;c.lineWidth=1.6;c.stroke();c.strokeStyle='rgba(255,255,255,.95)';c.lineWidth=.9;c.stroke();c.restore();
    const f2=fold.filter(v=>Math.abs((v[0]-M[0])*n[0]+(v[1]-M[1])*n[1])<.5);
    if(f2.length===2){c.save();c.beginPath();c.moveTo(f2[0][0],f2[0][1]);c.lineTo(f2[1][0],f2[1][1]);c.strokeStyle=`rgba(${SH},.12)`;c.lineWidth=2.2;c.stroke();c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=.8;c.stroke();c.restore()}}
  if(side){c.fillStyle='rgba(255,255,255,.85)';c.save();hp(c,M,n,-1);c.clip();c.fillRect(VW-1.2,0,1.2,VH);c.fillStyle=`rgba(${SH},.10)`;c.fillRect(VW,0,1.5,VH);c.restore()}};

/* ---------------------------------------------------------------- daily easter egg: the toile's carrier pigeon wakes and flies out of the frame
   11:51 redo (she found the 10fps three-pose stop-motion odd): ONE engraved pose (the printed one), its wings bent on a WebGL mesh around the
   line of the back, so every frame is an in-between (60fps, no pose swaps). Gentle anticipation (it settles, lifts its wings), then a
   powerful first downstroke, slow → accelerating rise along a soft curve with a small lift on each downstroke, heading/bank following the
   path; a few beats, then it glides out past the frame, growing a little (it leaves the paper towards us) and fading at the edge.
   The soft shadow is the same mesh sampled from a blurry mip level, sliding further away as it rises. No WebGL → the same flight, wings held. */
const today=()=>{const d=new Date();return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
const eggDue=()=>{try{return localStorage.getItem('kimi.br8.dove')!==today()}catch(e){return false}};
const DV={ok:null,cv:null,gl:null,pr:null,buf:null,ibuf:null,n:0,pos:null,rest:null,uv:null,cls:null,TW:256,OX:18,OY:12,M:30};
const DVG={H:[130,140],a:[.909,-.416],nn:[-.416,-.909]};      /* hinge on the line of the back (image px), body axis, "above the back" */
const prepDove=()=>{if(DV.ok!==null)return DV.ok;const d=DI[1];if(!d.complete||!d.naturalWidth)return false;
  try{const cv=document.createElement('canvas');cv.className='br-dove';const gl=cv.getContext('webgl',{premultipliedAlpha:true,alpha:true,antialias:false});
    if(!gl)throw 0;
    const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(o);return o};
    const pr=gl.createProgram();
    gl.attachShader(pr,sh(gl.VERTEX_SHADER,'attribute vec2 p;attribute vec2 t;uniform vec2 sz;uniform vec2 off;varying vec2 v;void main(){v=t;vec2 q=(p+off)/sz*2.-1.;gl_Position=vec4(q.x,-q.y,0,1);}'));
    gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,'precision mediump float;varying vec2 v;uniform sampler2D tx;uniform float al;uniform float shd;uniform vec3 sc;void main(){vec4 c=texture2D(tx,v,shd*3.2);if(shd>.5){gl_FragColor=vec4(sc,1.)*c.a*al;}else{gl_FragColor=c*al;}}'));
    gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw gl.getProgramInfoLog(pr);
    /* texture: the printed pose padded into a 256² power-of-two sheet so it can be mip-mapped (no shimmer when small, blur for the shadow) */
    const T=mkC(DV.TW,DV.TW),tx=T.getContext('2d');tx.drawImage(d,DV.OX,DV.OY,220,220*d.naturalHeight/d.naturalWidth);
    const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,T);gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    /* mesh: a 26×26 grid over the padded texture; triangles ordered far wing → body → near wing (painter's order) */
    const NX=26,NY=26,rest=[],uv=[],cls=[];
    for(let j=0;j<=NY;j++)for(let i=0;i<=NX;i++){const x=i/NX*DV.TW-DV.OX,y=j/NY*DV.TW-DV.OY;rest.push(x,y);uv.push(i/NX,j/NY)}
    const tri=[[],[],[]],H=DVG.H,a=DVG.a,nn=DVG.nn;
    for(let j=0;j<NY;j++)for(let i=0;i<NX;i++){const k=j*(NX+1)+i,q=[k,k+1,k+NX+1,k+1,k+NX+2,k+NX+1];
      const cx=((i+.5)/NX*DV.TW-DV.OX)-H[0],cy=((j+.5)/NY*DV.TW-DV.OY)-H[1],h=cx*nn[0]+cy*nn[1],s=cx*a[0]+cy*a[1];
      tri[h<6?1:s>14?0:2].push(...q)}
    const idx=new Uint16Array([...tri[0],...tri[1],...tri[2]]);
    const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,idx,gl.STATIC_DRAW);
    const ub=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,ub);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(uv),gl.STATIC_DRAW);
    const pb=gl.createBuffer();
    Object.assign(DV,{cv,gl,pr,tex,ib,ub,pb,n:idx.length,rest:new Float32Array(rest),pos:new Float32Array(rest.length),
      L:{p:gl.getAttribLocation(pr,'p'),t:gl.getAttribLocation(pr,'t'),sz:gl.getUniformLocation(pr,'sz'),off:gl.getUniformLocation(pr,'off'),al:gl.getUniformLocation(pr,'al'),shd:gl.getUniformLocation(pr,'shd'),sc:gl.getUniformLocation(pr,'sc')},
      lod:!!gl.getExtension('EXT_shader_texture_lod')});
    DV.ok=true}catch(e){DV.ok=false}
  return DV.ok};
/* wing pose: s = downstroke amount (0 wings up … 1 wings down), lift of the tips lags the root a little (the feathers whip) */
const bendDove=(strokeAt,flex,raise)=>{const R=DV.rest,P=DV.pos,H=DVG.H,a=DVG.a,nn=DVG.nn;
  for(let k=0;k<R.length;k+=2){const rx=R[k]-H[0],ry=R[k+1]-H[1];let h=rx*nn[0]+ry*nn[1],s=rx*a[0]+ry*a[1];
    if(h>0){const w=SM(h/18),far=SM((s-6)/18),lagS=cl(strokeAt(flex*h/150),0,1);
      const cN=1+raise-(1+raise+.2)*lagS,cF=1+raise-(1+raise-.14)*lagS;const c=cN+(cF-cN)*far;
      s+=w*(1-Math.max(-.2,c))*h*.07*(1-far);h*=1+(c-1)*w}
    P[k]=H[0]+a[0]*s+nn[0]*h;P[k+1]=H[1]+a[1]*s+nn[1]*h}};
const drawDoveGL=(W,Hh,k,al,shOff,shAl)=>{const gl=DV.gl,L=DV.L;gl.viewport(0,0,DV.cv.width,DV.cv.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(DV.pr);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  gl.bindBuffer(gl.ARRAY_BUFFER,DV.pb);gl.bufferData(gl.ARRAY_BUFFER,DV.pos,gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(L.p);gl.vertexAttribPointer(L.p,2,gl.FLOAT,false,0,0);
  gl.bindBuffer(gl.ARRAY_BUFFER,DV.ub);gl.enableVertexAttribArray(L.t);gl.vertexAttribPointer(L.t,2,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,DV.ib);
  gl.uniform2f(L.sz,W,Hh);gl.uniform3f(L.sc,70/255,85/255,125/255);
  if(shAl>.003){gl.uniform2f(L.off,DV.M+shOff[0],DV.M+shOff[1]);gl.uniform1f(L.al,shAl);gl.uniform1f(L.shd,1);gl.drawElements(gl.TRIANGLES,DV.n,gl.UNSIGNED_SHORT,0)}
  gl.uniform2f(L.off,DV.M,DV.M);gl.uniform1f(L.al,al);gl.uniform1f(L.shd,0);gl.drawElements(gl.TRIANGLES,DV.n,gl.UNSIGNED_SHORT,0)};
const dove=(force)=>{if(st.doveFlying||RM.matches)return false;if(!force&&!eggDue())return false;if(VS.a<=0.05&&!force)return false;
  if(VS.a<=0.05){VS.mode='';setVel('side',true)}
  try{localStorage.setItem('kimi.br8.dove',today())}catch(e){}
  st.doveFlying=true;st.doveDone=true;
  const gl=prepDove()===true;
  const v=vp.getBoundingClientRect(),sc=v.width/VW,k=DOVE.w*sc/220;     /* screen px per image px */
  const x0=v.left+(VS.ox+DOVE.x)*sc,y0=v.top+(VS.oy+DOVE.y)*sc;       /* image (0,0) on screen */
  const M=DV.M,IW=220,IH=232,W=IW+M*2,Hh=IH+M*2,SMAX=1.42,dpr=Math.min(2,window.devicePixelRatio||1);
  let el;if(gl){el=DV.cv;el.width=Math.round(W*k*SMAX*dpr);el.height=Math.round(Hh*k*SMAX*dpr)}
  else{el=document.createElement('img');el.className='br-dove';el.src=IMG.d2}
  el.style.cssText=`position:fixed;left:0;top:0;width:${((gl?W:IW)*k).toFixed(2)}px;height:${((gl?Hh:IH)*k).toFixed(2)}px;will-change:transform,opacity`+(gl?';filter:none':'');
  const ox=((gl?M:0)+DVG.H[0])*k,oy=((gl?M:0)+DVG.H[1])*k;el.style.transformOrigin=`${ox.toFixed(1)}px ${oy.toFixed(1)}px`;
  root.appendChild(el);
  /* flight path (screen px, for the hinge point): eased cubic from the print, up and right, out past the window edge */
  const hx=x0+DVG.H[0]*k,hy=y0+DVG.H[1]*k,P0=[hx,hy],P1=[hx+60,hy-42],P2=[hx+290,hy-170],P3=[Math.max(G.W+150,hx+620),Math.min(-150,hy-430)];
  const bz=(u,i)=>{const m=1-u;return m*m*m*P0[i]+3*m*m*u*P1[i]+3*m*u*u*P2[i]+u*u*u*P3[i]};
  const T0=.38,DUR=2.75,TF=DUR-T0,t0=now();let ph=0,lastT=0,rot=0;
  const f=()=>{const tt=now()-t0,dt=Math.max(0,Math.min(.05,tt-lastT));lastT=tt;
    if(tt>=DUR||!st.open){el.remove();st.doveFlying=false;return}
    let strokeAt,raise=0,al,sx,sy,r,s,shOff,shAl;
    if(tt<T0){/* anticipation: it settles (a small crouch along the back), wings lift a touch, the ink becomes a living bird */
      const u=tt/T0,cr=Math.sin(Math.PI*SM(u));strokeAt=()=>0;raise=.07*SM(u);
      al=.78+.22*SM(u/.7);sx=P0[0]-DVG.nn[0]*2.2*cr;sy=P0[1]-DVG.nn[1]*2.2*cr;r=2.6*cr;s=1;shOff=[2*u,1+2*u];shAl=.14*SM(u)}
    else{const u=(tt-T0)/TF;
      /* beats: a strong first downstroke, then ~3.3 Hz, easing into a glide for the last third; the tips trail the root (lag) */
      const glide=SM((u-.55)/.3),fq=3.7-.9*SM(u/.5);ph+=dt*Math.PI*2*fq*(1-.75*glide);
      const P=ph;strokeAt=l=>{const q=P-l*1.1;return (1-glide)*Math.pow(Math.max(0,.5-.5*Math.cos(q)),.85)+glide*(.22+.12*(.5-.5*Math.cos(q)))};
      raise=.07*(1-SM(u/.15));
      const kk=.32*u+.68*Math.pow(u,1.6);                                                 /* a launch, then still gaining speed at the exit */
      const bob=(1-glide*.7)*Math.sin(ph-.6)*2.4*SM(u/.05);                                           /* the body lifts on each downstroke */
      sx=bz(kk,0);sy=bz(kk,1)-bob;
      const e2=Math.min(1,kk+.02),vx=bz(e2,0)-bz(Math.max(0,e2-.04),0),vy=bz(e2,1)-bz(Math.max(0,e2-.04),1),hd=Math.atan2(vy,vx)*180/Math.PI;
      const target=cl((hd+24.6)*.45,-14,10)+Math.sin(ph-.3)*1.2*(1-glide);
      rot+=(target-rot)*Math.min(1,dt*7);r=rot*SM(u/.06);
      s=1+(SMAX-1)*SM(kk);al=1-SM((u-.84)/.16);shOff=[2+8*SM(u/.4),3+14*SM(u/.4)];shAl=.14*(1-SM(u/.5))*al}
    if(gl){bendDove(strokeAt,.55,raise);drawDoveGL(W,Hh,k,1,shOff,shAl)}
    el.style.transform=`translate(${(sx-ox).toFixed(2)}px,${(sy-oy).toFixed(2)}px) rotate(${r.toFixed(2)}deg) scale(${s.toFixed(4)})`;
    el.style.opacity=al.toFixed(3);
    requestAnimationFrame(f)};
  f();st.doveGone=true;drawVel();                  /* the print leaves the sheet in the same frame the living bird appears on top of it */
  return true};

/* ---------------------------------------------------------------- the ASCII atlas: a sparse character globe (Canvas 2D) */
const acv=$('.as-cv'),ax=acv.getContext('2d'),AS={W:196,R:90,yaw:0,mx:0,my:0,S:[0,0],V:[0,0],last:-9,seed:[],rc:null,rt:-9,lt:-9},asLon=$('.as-lon');
const RAMP=['·','·',':',';','+','*','o','O'],KIMI='KIMI';
const AFONT='500 11.5px "DejaVu Sans Mono","Courier New",monospace',CW=12.2,CH=14.2;
const cells=[];{const n=Math.ceil(AS.W/CW)+1,m=Math.ceil(AS.W/CH)+1;for(let j=0;j<m;j++)for(let i=0;i<n;i++){const x=(i-(n-1)/2)*CW+(j%2?CW*.5:0),y=(j-(m-1)/2)*CH;
  if(x*x+y*y<(AS.R+4)*(AS.R+4))cells.push({x,y,j,i,h:Math.random()})}}
const land=(X,Y,Z)=>Math.sin(2.7*X+1.2)*Math.sin(2.1*Y+.3)+.8*Math.sin(3.9*Z+2.4+1.4*X)+.55*Math.sin(5.3*Y-1.1+2.0*Z)+.35*Math.sin(7.1*X+4.2*Z);
const kick=(dx,dy)=>{if(!st.open||RM.matches)return;AS.V[0]=cl(AS.V[0]-dx*1.15,-420,420);AS.V[1]=cl(AS.V[1]-dy*1.15,-420,420)};
root.addEventListener('wheel',e=>{const f=e.deltaMode===1?32:e.deltaMode===2?400:1;kick(e.deltaX*f,e.deltaY*f)},{passive:true});
let lastScroll=0;doc.addEventListener('scroll',()=>{const d=doc.scrollTop-lastScroll;lastScroll=doc.scrollTop;kick(0,d*.6)},{passive:true,capture:true});
const drawAtlas=(n,dt)=>{const c=ax,W=AS.W,R=AS.R;c.setTransform(2,0,0,2,0,0);c.clearRect(0,0,W,W);c.translate(W/2,W/2);c.font=AFONT;c.textAlign='center';c.textBaseline='middle';
  if(!RM.matches){/* spring: the character field is smeared along the scroll velocity, then springs back (slightly under-damped) */
    for(let k=0;k<2;k++){const a=-58*AS.S[k]-6.2*AS.V[k];AS.V[k]+=a*dt;AS.S[k]+=AS.V[k]*dt;AS.S[k]=cl(AS.S[k],-46,46)}
    if(!AS.rc||n-AS.rt>2){AS.rc=$('.br-atlas').getBoundingClientRect();AS.rt=n}const r=AS.rc,tx=cl((st.mouse[0]-(r.left+r.width/2))/700,-.6,.6),ty=cl((st.mouse[1]-(r.top+r.height/2))/900,-.35,.35);
    AS.mx+=(tx-AS.mx)*.04;AS.my+=(ty-AS.my)*.04;AS.yaw+=dt*.24}
  const yaw=AS.yaw+AS.mx*.9,pit=-.36+AS.my*.6,cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pit),sp=Math.sin(pit);
  const S=AS.S,sm=Math.hypot(S[0],S[1]),dir=sm>.01?[S[0]/sm,S[1]/sm]:[0,0];
  const su=RM.matches?1:cl((n-st.tAsc)/.85),scr=su<1?1:0,scrE=su<1?(su<.22?SM(su/.22):1-SM((su-.22)/.78)):0;   /* 11:51: scatter swells in ~0.19 s instead of jumping to full on the first frame */
  const Lx=-.48,Ly=-.58,Lz=.66;
  for(const q of cells){const nx=q.x/R,ny=q.y/R,r2=nx*nx+ny*ny;if(r2>1)continue;const nz=Math.sqrt(1-r2);
    /* view → globe: pitch (x axis) then yaw (y axis) */
    const y1=ny*cp-nz*sp,z1=ny*sp+nz*cp,X=nx*cy+z1*sy,Z=-nx*sy+z1*cy,Y=y1;
    const ld=land(X,Y,Z),L=SM(cl((ld-.05)/.45));const lam=Math.max(0,nx*Lx+ny*Ly+nz*Lz),bri=.12+.88*lam;
    /* sea = sparse dots in dusty blue, land = denser glyphs in pen-ink blue; light falls from the upper left */
    let ch;if(L<.5)ch=bri<.45?'·':bri<.8?':':';';else{const v=bri;ch=v<.3?':':v<.5?'+':v<.68?'*':v<.84?'o':'O';if(v>.9&&((q.i*7+q.j*3)%5===0))ch=KIMI[(q.i+q.j)%4]}
    if(scrE>0&&q.h<scrE*.9)ch=RAMP[Math.floor((q.h*97+n*13)%RAMP.length)];
    /* fluid smear: displacement grows along the motion direction and wobbles a little per row */
    const along=(nx*dir[0]+ny*dir[1]+1)*.5,wob=.62+.38*Math.sin(q.j*.9+q.i*.35+n*2.4);
    let px=q.x+S[0]*(.35+.9*along)*wob,py=q.y+S[1]*(.35+.9*along)*wob;
    if(scrE>0){const k=scrE*(8+q.h*16);px+=nx*k+Math.sin(q.h*40)*k*.5;py+=ny*k+Math.cos(q.h*40)*k*.5}
    if(sm>7&&q.h<.32)ch=Math.abs(dir[1])>Math.abs(dir[0])?(q.h<.14?'|':':'):(q.h<.14?'~':'-');
    const ink=L>.5,al=(ink?.22+.74*bri:.16+.42*bri)*(1-.35*scrE);
    const col=ink?'46,59,104':'124,147,186';
    if(sm>3){/* two fading ghosts trailing behind */for(const [g,ga] of [[.38,.32],[.74,.14]]){c.fillStyle=`rgba(${col},${(al*ga*Math.min(1,sm/14)).toFixed(3)})`;c.fillText(ch,px-S[0]*g*(.4+along),py-S[1]*g*(.4+along))}}
    c.fillStyle=`rgba(${col},${al.toFixed(3)})`;c.fillText(ch,px,py)}
  /* faint hairline limb so the globe holds its shape when the field is sparse */
  c.beginPath();c.arc(0,0,R+5,0,Math.PI*2);c.strokeStyle=`rgba(124,147,186,${(.22-.12*Math.min(1,sm/20)).toFixed(3)})`;c.lineWidth=.6;c.stroke();
  if(n-AS.lt>.12){AS.lt=n;setT(asLon,((((-yaw*180/Math.PI)%360)+540)%360-180).toFixed(2))}};

/* ---------------------------------------------------------------- viewport content */
let docKey='';
const paint=(force)=>{const t=T();if(!t)return;let k,h;
  if(t.state==='loading'&&docKey&&!force)return;      /* the vellum covers the page while it loads: keep what is under it */
  if(t.state==='new'){k='new';h=pgNew()}
  else if(t.state==='error'){k='err:'+t.url;h=pgErr(t.url,t.err&&t.err.code)}
  else if(t.state==='loading'&&!t.prev){k='new';h=pgNew()}
  else{const u=t.state==='loading'?t.prev:t.url;const s=site(u);k='pg:'+(s?keyOf(u):u)+(t.logged?':in':'');h=t.html||(s?s.render():pgGeneric(keyOf(u).split('/')[0],keyOf(u)))}
  if(k===docKey&&!force)return;const hadOld=doc.childNodes.length>0;docKey=k;
  /* 11:51: never a hard cut — the old page is moved (not cloned) into a ghost layer that fades out over the new one (tab switch, login, letter, under the vellum) */
  let ghost=null;const live=[...root.querySelectorAll('.br-docg')];
  if(hadOld&&st.open&&!RM.matches&&st.phase!=='opening'&&live.length){doc.innerHTML=''}   /* a fade already running keeps showing the page the user actually saw */
  else if(hadOld&&st.open&&!RM.matches&&st.phase!=='opening'){
    ghost=document.createElement('div');ghost.className='br-docg';const sc=doc.scrollTop;while(doc.firstChild)ghost.appendChild(doc.firstChild);doc.after(ghost);ghost.scrollTop=sc;
    ghost.animate([{opacity:1},{opacity:0}],{duration:VS.a>.5?300:360,easing:'cubic-bezier(.4,0,.6,1)',fill:'forwards'}).onfinish=()=>ghost.remove()}
  doc.innerHTML=h;lastScroll=0;doc.scrollTop=0;
  if(!RM.matches&&st.open&&VS.a<=0)doc.animate([{opacity:0,transform:'translateY(6px) scale(.995)'},{opacity:1,transform:'none'}],{duration:380,easing:'cubic-bezier(.22,1,.36,1)'});
  doc.querySelectorAll('.nt-card').forEach(c=>c.addEventListener('click',()=>req('browser.open',{url:c.dataset.u,tabId:st.active})));
  const rt=doc.querySelector('.er-retry');if(rt)rt.addEventListener('click',()=>req('browser.reload',{tabId:st.active}));
  const bk=doc.querySelector('.er-back');if(bk)bk.addEventListener('click',()=>req('browser.back',{tabId:st.active}));
  if(k.startsWith('err:')&&st.open){/* the letter comes back: stamps slam down once the vellum is lifting */
    const pm=doc.querySelector('.er-pm'),rr=doc.querySelector('.er-ret'),lt=doc.querySelector('.er-lt');const q=RM.matches;
    if(!q){const ev=doc.querySelector('.er-env');if(ev)ev.animate([{transform:'translate(-16px,18px)',opacity:0},{transform:'none',opacity:1}],{duration:640,delay:40,easing:OUTB,fill:'backwards'});
      lt.animate([{transform:'translate(0,10px) rotate(3.2deg)',opacity:.0},{transform:'none',opacity:1}],{duration:600,delay:120,easing:OUTB,fill:'backwards'});
      pm.animate([{transform:'scale(2.2)',filter:'blur(3px)',opacity:0},{transform:'scale(1)',filter:'blur(0)',opacity:1}],{duration:300,delay:720,easing:SLAM,fill:'backwards'});
      rr.animate([{transform:'rotate(-9deg) scale(2.3)',filter:'blur(3px)',opacity:0},{transform:'rotate(-9deg) scale(1)',filter:'blur(0)',opacity:1}],{duration:300,delay:1080,easing:SLAM,fill:'backwards'});
      [[1020,pm],[1380,rr]].forEach(([dl])=>lt.animate([{transform:'none'},{transform:'translateY(2px) scale(.996)',offset:.3},{transform:'none'}],{duration:260,delay:dl,easing:'ease-out'}))}}};
const MODE=()=>{const t=T();if(!t)return 'new';if(st.takeover&&t.state==='loaded')return 'agent';return t.state==='new'?'new':t.state};
const RI={new:0,loading:1,loaded:2,agent:3,error:4};
const sync=()=>{const m=MODE();root.dataset.mode=m;renderTabs();showAddr();navBtns();paint();
  setVel(m==='new'?'side':m==='loading'?'cover':'off');
  const t=T();if(t&&t.state==='loaded'){st.ms=t.took;$('.s-req').textContent=t.req;$('.s-req2').textContent=t.req?`${Math.max(0,Math.round(t.req/6))}×304`:'—';$('.s-size').textContent=(+t.bytes).toFixed(2);$('.s-st').textContent=t.status||200;$('.s-st2').textContent='OK'}
  else if(t&&t.state==='error'){st.ms=0;$('.s-st').textContent='ERR';$('.s-st2').textContent=(t.err&&t.err.code||'').replace('ERR_','').slice(0,14);$('.s-req').textContent='1';$('.s-size').textContent='0.00'}
  else if(t&&t.state==='new'){st.ms=0;$('.s-st').textContent='—';$('.s-st2').textContent='';$('.s-req').textContent='0';$('.s-req2').textContent='—';$('.s-size').textContent='0.00'}
  $('.i-tk').textContent=st.takeover?'ON · KIMI':'OFF';kimi.setAttribute('aria-pressed',st.takeover?'true':'false');kimi.classList.toggle('on',st.takeover);
  $('.kt').textContent=st.takeover?'由 Kimi 操作中':'Kimi 代驾';root.classList.toggle('tk',st.takeover);root.classList.toggle('con',st.consoleOn);
  $('.b-cnt').textContent=st.logs.length?String(st.logs.length):''};
const stopLoad=()=>{const t=T();if(!t||t.state!=='loading')return;clearTimeout(mockT);t.state=t.prev?'loaded':'new';if(t.prev)t.url=t.prev;st.loadUrl='';sync()};
/* ---------------------------------------------------------------- console */
const lvTag=l=>({info:'INFO',warn:'WARN',error:'ERR',log:'LOG'}[l]||'LOG');
const stTag=s=>s>=400?'e':s>=300?'r':'k';
const renderCon=()=>{const L=st.conTab==='log';
  cSum.innerHTML=L?`<span><b>${st.logs.length}</b> 条</span><span><b>${st.logs.filter(x=>x.level==='warn').length}</b> 警告</span><span><b>${st.logs.filter(x=>x.level==='error').length}</b> 错误</span><span class="r">保留日志 ✦</span>`
   :`<span><b>${st.net.length}</b> 请求</span><span><b>${(st.net.reduce((a,x)=>a+(x.bytes||0),0)/1024).toFixed(1)}</b> KB</span><span><b>${st.net.length?Math.max(...st.net.map(x=>x.ms||0)):0}</b> ms 最长</span><span class="r">仅 XHR · 全部</span>`;
  cList.innerHTML=L?st.logs.map(x=>`<p class="cl lv-${esc(x.level)}"><i>${lvTag(x.level)}</i><span>${esc(x.text)}</span><time>${esc(x.ts||'')}</time></p>`).join('')
   :st.net.map(x=>`<p class="cn"><i>${esc(x.method||'GET')}</i><span>${esc(x.url)}</span><b class="sc-${stTag(x.status)}">${esc(x.status)}</b><em>${esc(x.type||'')}</em><time>${esc(x.ms)} ms</time></p>`).join('');
  cList.scrollTop=cList.scrollHeight};
const setConsole=on=>{st.consoleOn=on;root.classList.toggle('con',on);renderCon();
  if(!RM.matches&&on){con.animate([{transform:'translateX(28px)',opacity:0},{transform:'none',opacity:1}],{duration:520,easing:'cubic-bezier(.24,1.2,.4,1)'});
    [...cList.children].forEach((p,i)=>p.animate([{opacity:0,transform:'translateX(10px)'},{opacity:1,transform:'none'}],{duration:320,delay:120+i*45,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}))}
  sync()};
const pushLog=x=>{st.logs.push(x);if(st.logs.length>60)st.logs.shift();if(st.consoleOn&&st.conTab==='log'){renderCon();const p=cList.lastElementChild;if(p&&!RM.matches)p.animate([{opacity:0,transform:'translateX(10px)'},{opacity:1,transform:'none'}],{duration:300,easing:'ease-out'})}$('.b-cnt').textContent=String(st.logs.length)};
const pushNet=x=>{st.net.push(x);if(st.net.length>60)st.net.shift();if(st.consoleOn&&st.conTab==='net')renderCon()};

/* ---------------------------------------------------------------- screenshot → a glassine envelope, sealed with blue wax, slides into the stack */
const stackEl=$('.ml-stack');
const shotFx=()=>{st.shots++;$('.sh-n').textContent='N° '+pad(st.shots);const fl=$('.br-flash');
  const em=stackEl.querySelector('.ml-empty');if(em)em.remove();
  const t=T();const host=t&&t.state!=='new'?keyOf(t.url).split('/')[0]:'nouvel onglet';
  const e=document.createElement('div');e.className='ml-env';
  e.innerHTML=`<div class="ml-th"><div class="sh-in">${doc.innerHTML}</div></div><img class="ml-gl" src="${IMG.glass}" alt=""><span class="ml-lb">${esc(host)}<i>${pad(new Date().getHours())}:${pad(new Date().getMinutes())}</i></span><img class="ml-seal" src="${IMG.sealB}" alt="">`;
  stackEl.prepend(e);const envs=[...stackEl.querySelectorAll('.ml-env')];
  const POS=[[12,0,-1.6],[2,60,2.2],[22,118,-2.8]];
  envs.forEach((x,i)=>{if(i>2){x.animate([{opacity:1},{opacity:0,transform:x.style.transform+' translateY(12px)'}],{duration:RM.matches?1:400,fill:'forwards'}).onfinish=()=>x.remove();return}
    const [px,py,r]=POS[i],to=`translate(${px}px,${py}px) rotate(${r}deg)`;const from=x.style.transform;x.style.transform=to;x.style.zIndex=String(10-i);
    if(i>0&&from&&!RM.matches)x.animate([{transform:from},{transform:to}],{duration:520,delay:880,easing:OUTB,fill:'backwards'})});
  if(RM.matches)return;
  fl.animate([{opacity:0},{opacity:.8,offset:.15},{opacity:0}],{duration:520,easing:'ease-out'});
  const th=e.querySelector('.ml-th'),v=vp.getBoundingClientRect(),c=th.getBoundingClientRect(),sx=c.width/v.width;
  th.animate([{transform:`translate(${v.left-c.left}px,${v.top-c.top}px) scale(${1/sx}) rotate(-2deg)`,opacity:0,offset:0},{opacity:1,offset:.1},
    {transform:'translate(0,-74px) rotate(-3deg)',opacity:1,offset:.72},{transform:'none',opacity:1}],{duration:1050,delay:80,easing:'cubic-bezier(.5,0,.2,1)',fill:'backwards'});
  e.animate([{opacity:0},{opacity:1}],{duration:260,delay:500,fill:'backwards'});
  e.querySelector('.ml-seal').animate([{transform:'translate(-50%,-50%) scale(2.3)',filter:'blur(3px)',opacity:0},{transform:'translate(-50%,-50%) scale(1)',filter:'blur(0)',opacity:1}],{duration:280,delay:1180,easing:SLAM,fill:'backwards'});
  e.animate([{translate:'0 0'},{translate:'0 2px',offset:.35},{translate:'0 0'}],{duration:260,delay:1460});
  e.animate([{translate:'-14px 0'},{translate:'0 0'}],{duration:500,delay:1560,easing:OUTB,composite:'add'})};
/* ---------------------------------------------------------------- agent overlay */
const AG={x:-60,y:-60,anim:null};
const vpRect=()=>vp.getBoundingClientRect();
const targetRect=a=>{if(a.rect)return a.rect;const el=a.selector&&doc.querySelector(`[data-ag="${a.selector}"]`)||null;if(!el)return null;const r=el.getBoundingClientRect(),v=vpRect();return {x:r.left-v.left,y:r.top-v.top,w:r.width,h:r.height,el}};
const placeCur=(x,y)=>{AG.x=x;AG.y=y;agc.style.transform=`translate(${(x-3).toFixed(1)}px,${(y-3).toFixed(1)}px)`};
const moveCur=(x,y,ms)=>new Promise(res=>{const x0=AG.x,y0=AG.y,t0=now(),d=ms/1000;if(RM.matches||d<=0){placeCur(x,y);res();return}
  const arc=Math.min(60,Math.hypot(x-x0,y-y0)*.18);
  const f=()=>{const u=cl((now()-t0)/d),e=bez(.45,0,.2,1)(u);placeCur(x0+(x-x0)*e,y0+(y-y0)*e-Math.sin(Math.PI*e)*arc);if(u<1)requestAnimationFrame(f);else res()};requestAnimationFrame(f)});
const showHL=(r,label)=>{if(!r){hl.classList.remove('on');return}hl.style.left=(r.x-6)+'px';hl.style.top=(r.y-6)+'px';hl.style.width=(r.w+12)+'px';hl.style.height=(r.h+12)+'px';
  hl.querySelector('b').textContent=label||'';const was=hl.classList.contains('on');hl.classList.add('on');
  if(!RM.matches&&!was)hl.animate([{opacity:0,transform:'scale(1.08)'},{opacity:1,transform:'none'}],{duration:300,easing:'cubic-bezier(.22,1,.36,1)'})};
const ripple=(x,y)=>{const r=document.createElement('i');r.className='ag-rp';r.style.left=x+'px';r.style.top=y+'px';ag.appendChild(r);
  const r2=r.cloneNode();ag.appendChild(r2);
  if(RM.matches){setTimeout(()=>{r.remove();r2.remove()},300);return}
  r.animate([{transform:'translate(-50%,-50%) scale(.2)',opacity:.95},{transform:'translate(-50%,-50%) scale(1.6)',opacity:0}],{duration:720,easing:'cubic-bezier(.2,.7,.3,1)',fill:'forwards'});
  r2.animate([{transform:'translate(-50%,-50%) scale(.1)',opacity:.8},{transform:'translate(-50%,-50%) scale(1)',opacity:0}],{duration:620,delay:110,easing:'cubic-bezier(.2,.7,.3,1)',fill:'both'});
  agc.animate([{scale:'1'},{scale:'.84',offset:.35},{scale:'1'}],{duration:260});setTimeout(()=>{r.remove();r2.remove()},900)};
const caption=(text,step,total)=>{cap.querySelector('.ag-t').textContent=text||'';cap.querySelector('.ag-n').textContent=step?`${pad(step)} / ${pad(total||step)}`:'';
  cap.classList.toggle('on',!!text);if(!RM.matches&&text)cap.querySelector('.ag-t').animate([{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:260,easing:'ease-out'})};
const typeInto=(el,text,cps=34)=>new Promise(res=>{if(!el){res();return}el.value='';let i=0;el.classList.add('ag-typing');
  const f=()=>{el.value=text.slice(0,++i);if(i<text.length)setTimeout(f,1000/cps);else{el.classList.remove('ag-typing');res()}};setTimeout(f,1000/cps)});
const agentAction=async a=>{if(a.tabId&&a.tabId!==st.active)return;st.agentStep=a.step||st.agentStep;ag.classList.add('on');
  if(a.kind==='done'){showHL(null);caption(a.label||'完成',a.step,a.total);setTimeout(()=>{if(st.agentStep===a.step)caption('')},1600);return}
  const r=targetRect(a);const cx=r?r.x+Math.min(r.w*.5+40,r.w*.78):AG.x,cy=r?r.y+r.h*.6:AG.y;
  if(AG.x<0){placeCur(vpRect().width*.62,vpRect().height*.86)}
  if(a.kind==='scroll'){caption(a.label,a.step,a.total);doc.scrollBy({top:a.dy||200,behavior:RM.matches?'auto':'smooth'});return}
  caption(a.label,a.step,a.total);await moveCur(cx,cy,a.ms!=null?a.ms:620);if(r)showHL(r,a.selector?(a.tag||a.selector):'');
  if(a.kind==='click'){ripple(cx,cy);if(r&&r.el&&r.el.tagName==='INPUT')r.el.focus({preventScroll:true})}
  if(a.kind==='type'){ripple(cx,cy);await typeInto(r&&r.el,a.text||'',a.cps||34)}};

/* ---------------------------------------------------------------- emit (backend → page) */
const tabById=id=>st.tabs.find(t=>t.id===id)||T();
const emit=(type,p={})=>{const t=tabById(p.tabId);
  switch(type){
  case 'browser.tabs':{const old=st.tabs;st.tabs=(p.tabs||[]).map(x=>{const o=old.find(y=>y.id===x.id);if(o){o.title=x.title||o.title;o.url=x.url!=null?x.url:o.url;if(x.favicon)o.fav=x.favicon;return o}
      const n=mkTab(x.url,{title:x.title,fav:x.favicon});n.id=x.id;if(!x.url){n.state='new'}return n});st.active=p.activeId||(st.tabs[0]&&st.tabs[0].id);docKey='';sync();postBounds();break}
  case 'browser.navigate':{if(!t)break;t.canBack=p.canGoBack;t.canFwd=p.canGoForward;st.loadUrl=p.url;sync();break}
  case 'browser.loading':{if(!t)break;if(t.state!=='loading'){t.prev=t.state==='loaded'?t.url:null;t.state='loading';st.tLoad=now();t.logged=false;t.html=null;if(t.id===st.active){st.ink.ph='draw';st.ink.x=0;st.tAsc=now()}}
      st.loadUrl=p.url||st.loadUrl;$('.bl-u').textContent=keyOf(st.loadUrl);t.title=keyOf(st.loadUrl).split('/')[0];sync();break}
  case 'browser.loaded':{if(!t)break;const s=site(p.url);t.state='loaded';t.url=p.url;t.title=p.title||(s&&s.title)||keyOf(p.url);t.fav=p.favicon||(s&&s.fav)||'cloud';t.took=p.tookMs||0;t.req=p.requests||0;t.bytes=p.bytes||0;t.status=p.status||200;t.err=null;
      if(t.hist[t.hi]!==p.url){t.hist=t.hist.slice(0,t.hi+1);t.hist.push(p.url);t.hi=t.hist.length-1}st.loadUrl='';sync();break}
  case 'browser.error':{if(!t)break;t.state='error';t.url=p.url;t.err={code:p.code,message:p.message};t.title='找不到页面';st.loadUrl='';
      if(t.hist[t.hi]!==p.url){t.hist=t.hist.slice(0,t.hi+1);t.hist.push(p.url);t.hi=t.hist.length-1}sync();break}
  case 'browser.agentAction':agentAction(p);break;
  case 'browser.console':if(p.kind==='network')pushNet(p);else pushLog(p);break}};
/* ---------------------------------------------------------------- built-in mock backend */
let mockT=0;
const stamp=()=>{const d=new Date();return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`};
const mock=(type,p)=>{const t=tabById(p.tabId);
  const tabsOut=()=>emit('browser.tabs',{tabs:st.tabs.map(x=>({id:x.id,title:x.title,url:x.state==='new'?'':x.url,favicon:x.fav})),activeId:st.active});
  const go=(url,tab,push=true)=>{clearTimeout(mockT);emit('browser.navigate',{tabId:tab.id,url,canGoBack:tab.hi>=0,canGoForward:false});emit('browser.loading',{tabId:tab.id,url});
    if(st.hold)return;const s=site(url),k=keyOf(url),dly=(window.__brLoadMs||1500);
    mockT=setTimeout(()=>{if(s){emit('browser.loaded',{tabId:tab.id,url,title:s.title,status:200,tookMs:s.took,requests:s.req,bytes:s.bytes});
        if(k==='localhost:5173'){[['info','[vite] connecting…'],['info','[vite] connected.'],['log','Workbench boot · vue 3.5 · pinia 2.2'],['warn','[Vue warn] Extraneous non-props attributes (class) were passed to <Field>']].forEach(([l,x])=>emit('browser.console',{tabId:tab.id,kind:'log',level:l,text:x,ts:stamp()}));
          [['GET','/','document',200,1240,18],['GET','/@vite/client','script',200,18200,9],['GET','/src/main.ts','script',200,3100,12],['GET','/src/App.vue','script',200,6800,14],['GET','/demo/me','xhr',401,96,21],['GET','/favicon.svg','img',304,0,3]].forEach(([m,u,ty,s2,by,ms])=>emit('browser.console',{tabId:tab.id,kind:'network',method:m,url:u,type:ty,status:s2,bytes:by,ms}))}}
      else emit('browser.error',{tabId:tab.id,url,code:/^localhost|^127\./.test(k)?'ERR_CONNECTION_REFUSED':'ERR_NAME_NOT_RESOLVED',message:'无法访问此网站'})},dly)};
  switch(type){
  case 'browser.open':go(p.url,t);break;
  case 'browser.reload':if(t&&t.url)go(t.url,t);break;
  case 'browser.back':if(t&&t.hi>0){t.hi--;go(t.hist[t.hi],t)}break;
  case 'browser.forward':if(t&&t.hi<t.hist.length-1){t.hi++;go(t.hist[t.hi],t)}break;
  case 'browser.newTab':{const n=mkTab('');st.tabs.push(n);st.active=n.id;tabsOut();setTimeout(()=>addr.focus(),60);break}
  case 'browser.closeTab':{const i=st.tabs.findIndex(x=>x.id===p.tabId);if(i<0)break;st.tabs.splice(i,1);if(!st.tabs.length)st.tabs.push(mkTab(''));if(st.active===p.tabId)st.active=st.tabs[Math.min(i,st.tabs.length-1)].id;tabsOut();break}
  case 'browser.activateTab':st.active=p.tabId;tabsOut();break;
  case 'browser.takeover':st.takeover=!!p.on;if(!st.takeover){ag.classList.remove('on');showHL(null);caption('');agGen++}else{ag.classList.add('on');placeCur(vpRect().width*.62,vpRect().height*.86);agc.animate([{opacity:0,transform:agc.style.transform+' scale(.6)'},{opacity:1,transform:agc.style.transform}],{duration:RM.matches?1:360,easing:'cubic-bezier(.22,1,.36,1)'});
      if(!window.__brNoAuto)setTimeout(()=>mockAgent(),420)}sync();break;
  case 'browser.screenshot':emit('browser.console',{tabId:t&&t.id,kind:'log',level:'info',text:`Page.captureScreenshot → ${Math.round(vp.clientWidth*2)}×${Math.round(vp.clientHeight*2)} png`,ts:stamp()});break;
  case 'browser.bounds':break}};
/* Kimi's demo run on the login page (mock): email → password → login → dashboard */
let agGen=0;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const mockAgent=async()=>{const g=++agGen;const t=T();if(!t||keyOf(t.url)!=='localhost:5173'||t.logged)return;const live=()=>g===agGen&&st.takeover;
  const N=4;
  await agentAction({kind:'click',selector:'email',tag:'input[type=email]',label:'聚焦 · 邮箱输入框',step:1,total:N,ms:640});if(!live())return;await wait(120);
  await agentAction({kind:'type',selector:'email',tag:'input[type=email]',label:'输入 · colette@example.com',text:'colette@example.com',step:1,total:N,ms:0,cps:36});if(!live())return;await wait(160);
  await agentAction({kind:'type',selector:'password',tag:'input[type=password]',label:'输入 · 密码',text:'rococo-10',step:2,total:N,ms:460,cps:28});if(!live())return;await wait(200);
  await agentAction({kind:'highlight',selector:'login',tag:'button#login',label:'点击 · 登录按钮',step:3,total:N,ms:520});if(!live())return;await wait(window.__brHoldLogin||260);if(!live())return;
  await agentAction({kind:'click',selector:'login',tag:'button#login',label:'点击 · 登录按钮',step:3,total:N,ms:0});
  emit('browser.console',{tabId:t.id,kind:'network',method:'POST',url:'/demo/login',type:'xhr',status:200,bytes:412,ms:132});
  emit('browser.console',{tabId:t.id,kind:'log',level:'log',text:'POST /demo/login → 200 · 132 ms',ts:stamp()});await wait(300);if(!live())return;
  t.logged=true;t.url='http://localhost:5173/sessions';t.title=SITES['localhost:5173/sessions'].title;t.hist.push(t.url);t.hi=t.hist.length-1;t.took=236;t.req=9;t.bytes=.62;showHL(null);sync();toast('✓ 已登录 · colette');
  emit('browser.console',{tabId:t.id,kind:'network',method:'GET',url:'/demo/sessions?limit=20',type:'xhr',status:200,bytes:5240,ms:48});
  emit('browser.console',{tabId:t.id,kind:'log',level:'info',text:'session restored · colette · 12 sessions',ts:stamp()});
  await wait(200);if(!live())return;await agentAction({kind:'done',label:'完成 · 已进入会话列表',step:4,total:N})};
const toast=txt=>{const e=document.createElement('div');e.className='br-toast';e.textContent=txt;vp.appendChild(e);
  if(!RM.matches)e.animate([{opacity:0,transform:'translate(-50%,-8px)'},{opacity:1,transform:'translate(-50%,0)'}],{duration:320,easing:'cubic-bezier(.22,1,.36,1)'});
  setTimeout(()=>{if(RM.matches){e.remove();return}e.animate([{opacity:1},{opacity:0}],{duration:300,fill:'forwards'}).onfinish=()=>e.remove()},2600)};

/* ---------------------------------------------------------------- bounds for the native view */
const postBounds=()=>{if(!st.open)return;const r=vp.getBoundingClientRect();req('browser.bounds',{x:Math.round(r.left),y:Math.round(r.top),width:Math.round(r.width),height:Math.round(r.height)});
  $('.s-vw').textContent=`${Math.round(r.width)}×${Math.round(r.height)}`};
addEventListener('resize',()=>{G={W:innerWidth,H:innerHeight};layout();postBounds()});

/* ---------------------------------------------------------------- HUD layout */
const layout=()=>{const W=G.W,H=G.H,s=Math.min(1,(W-312-200)/SG.W,(H-24)/SG.H);const left=312+Math.max(0,(W-312-200-SG.W*s)/2);
  stage.style.left=left+'px';stage.style.top=Math.max(12,(H-SG.H*s)/2)+'px';stage.style.transform=s<1?`scale(${s.toFixed(4)})`:'none'};

/* ---------------------------------------------------------------- open / close */
const POP=()=>[[stage,.10],[$('.br-mast'),.28],[$('.br-info'),.36],[$('.br-stats'),.44],[$('.br-spec'),.50],[$('.br-atlas'),.56],[$('.br-mail'),.62]];
const UP=[{opacity:0,transform:'translate(0,-10px) scale(1.012) rotate(-.25deg)',offset:0},{opacity:1,offset:.45},{opacity:1,transform:'translate(0,1px) scale(.999)',offset:.8},{opacity:1,transform:'none'}];
const open=(o={})=>{if(st.open)return;st.open=true;st.phase='opening';st.tOpen=now();
  if(window.__rp&&window.__rp.isOpen)window.__rp.close();
  root.classList.add('on');root.setAttribute('aria-hidden','false');b.classList.add('br-on');G={W:innerWidth,H:innerHeight};layout();docKey='';
  VS.mode='off';VS.a=0;VS.an=null;sync();if(VS.mode!=='off'){VS.a=1;VS.oy=0;VS.lift=0;VS.an=null;VS.p=VS.mode==='side'?PSIDE:0;VS.ox=VS.mode==='side'?SIDE:0}
  const q=o.instant||RM.matches;
  POP().forEach(([e,dl])=>{if(!e)return;e.getAnimations().forEach(a=>a.cancel());
    if(q){e.animate([{opacity:0},{opacity:1}],{duration:RM.matches?300:1,fill:'both'});return}
    e.animate(UP,{duration:e===stage?820:640,delay:dl*1000,easing:'cubic-bezier(.25,.8,.3,1)',fill:'both'})});
  if(!q){/* masthead: the numeral is inked in left → right, the rules are drawn, the ribbon unrolls downwards */
    $('.mh-no').animate([{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],{duration:900,delay:420,easing:OUTB,fill:'backwards'});
    $('.mh-ed').animate([{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],{duration:1000,delay:760,easing:OUTB,fill:'backwards'});
    $('.mh-rule').animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:700,delay:900,easing:OUTB,fill:'backwards'});
    $('.br-rib').animate([{clipPath:'inset(0 0 100% 0)',translate:'0 -6px'},{clipPath:'inset(0 0 0 0)',translate:'0 0'}],{duration:1100,delay:520,easing:'cubic-bezier(.3,.6,.25,1)',fill:'backwards'});
    $('.br-spec img').animate([{rotate:'-4deg'},{rotate:'2.2deg'}],{duration:900,delay:500,easing:OUTB,fill:'backwards'})}   /* ends on its CSS tilt (2.2deg): no snap when it finishes */
  if(!q&&eggDue()&&VS.mode==='side')setTimeout(()=>{if(st.open&&VS.mode==='side')dove()},2300);
  AS.rc=null;setTimeout(()=>{AS.rc=null},q?40:1300);setTimeout(()=>{if(st.open)prepDove()},q?600:1500);   /* dove mesh + texture ready long before it is needed */
  setTimeout(postBounds,q?320:1100);if(!loopOn){loopOn=true;requestAnimationFrame(loop)}};
const close=(o={})=>{if(!st.open)return;st.open=false;st.phase='closing';b.classList.remove('br-full');const q=o.quick||RM.matches;st.tClose=now()+(q?0:.3);agGen++;
  if(document.activeElement===addr)addr.blur();
  POP().reverse().forEach(([e],i)=>{if(!e)return;e.getAnimations().forEach(a=>a.cancel());
    e.animate(q?[{opacity:1},{opacity:0}]:[{transform:'none',opacity:1},{transform:'translate(0,-6px) scale(1.006)',opacity:0}],
      {duration:q?160:340,delay:q?0:i*22,easing:'cubic-bezier(.55,0,.75,.4)',fill:'both'})});
  setTimeout(()=>{if(st.open)return;root.classList.remove('on');root.setAttribute('aria-hidden','true');b.classList.remove('br-on');st.phase='closed'},q?200:720)};

/* ---------------------------------------------------------------- frame loop: veil, vellum, pen line, atlas, clock */
let loopOn=false,lastN=now(),veilV='',dsubV='';const dsub=$('.br-dsub');
addEventListener('pointermove',e=>{st.mouse=[e.clientX,e.clientY];st.mIn=true},{passive:true});
document.addEventListener('mouseout',e=>{if(!e.relatedTarget)st.mIn=false});
const inkL=$('.ink-l'),inkD=$('.ink-dot'),inkN=$('.ink-nib'),IW=760,blMs=$('.bl-ms'),sMs=$('.s-ms');
inkL.style.width=IW+'px';inkL.style.clipPath='inset(0 100% 0 0)';
const setO=(el,v)=>{if(el.__o!==v){el.__o=v;el.style.opacity=v}};
const inkSet=(l,r,o)=>{const c=`inset(0 ${(IW-r).toFixed(2)}px 0 ${l.toFixed(2)}px)`;if(inkL.__c!==c){inkL.__c=c;inkL.style.clipPath=c}setO(inkL,o)};
const inkFrame=n=>{const I=st.ink,t=T(),loading=t&&t.state==='loading';
  /* 11:51: the stroke never stops any more — the pen only slows a little every ~92 px (a soft 顿笔: speed 0.45 … 1.55×, the nib presses a touch where it slows);
     the line is revealed with clip-path on a fixed-width strip (no width → no layout per frame) */
  if(loading){if(I.ph!=='draw'){I.ph='draw';I.x=0}const el=n-st.tLoad,p=1-Math.exp(-el*1.15),raw=IW*(.03+.9*p),seg=92,w=2*Math.PI*raw/seg;
    const x=RM.matches?IW*.5:raw-.55*seg/(2*Math.PI)*Math.sin(w);I.x=Math.max(I.x,x);
    inkSet(0,I.x,'1');setO(inkD,'0');
    const bob=RM.matches?0:Math.sin(el*9)*.6+.7*(.5+.5*Math.cos(w));setO(inkN,'1');inkN.style.transform=`translate(${(I.x-1.5).toFixed(2)}px,${(-30+bob).toFixed(2)}px) rotate(${(bob*1.1).toFixed(2)}deg)`;
    const ms=String(Math.round(el*1000));setT(blMs,ms+' ms');setT(sMs,ms);return}
  if(I.ph==='draw'){I.ph='fin';I.tF=n;I.x0=I.x}
  if(I.ph==='fin'){const u=RM.matches?9:n-I.tF,x=I.x0+(IW-I.x0)*OUT(cl(u/.3));
    const k=SM(cl((u-.24)/.5));setO(inkN,(1-k).toFixed(3));inkN.style.transform=`translate(${(x-1.5+14*k).toFixed(2)}px,${(-30-24*k).toFixed(2)}px) rotate(${(-14*k).toFixed(2)}deg)`;
    const f=SM(cl((u-.45)/.7));inkSet(f*IW,x,(1-f).toFixed(3));setO(inkD,SM(cl((u-.6)/.4)).toFixed(3));
    if(u>1.3){I.ph='idle'}}
  if(I.ph==='idle'){setO(inkL,'0');setO(inkN,'0');setO(inkD,t&&t.state==='loaded'?'1':'0');setT(sMs,String(st.ms))}};
const loop=()=>{const n=now(),dt=Math.min(.05,Math.max(0,n-lastN));lastN=n;
  if(st.phase==='closed'){loopOn=false;return}
  if(st.phase==='opening'&&n-st.tOpen>.8){st.phase='open';b.classList.add('br-full')}   /* fully covered: the empty page under the opaque veil stops painting */
  /* only touch the custom property while it changes (setting it re-styles the whole #br tree every frame) */
  const vv=st.phase==='closing'?(1-cl((n-st.tClose)/.45)).toFixed(3):(RM.matches?1:SM(cl((n-st.tOpen)/.55))).toFixed(3);if(vv!==veilV){veilV=vv;root.style.setProperty('--veil',vv)}
  if(VS.an){const A=VS.an;if(A.t0===null)A.t0=n;const u=A.dur?cl((n-A.t0)/A.dur):1,e=A.ease(u);for(const k in A.to)VS[k]=A.from[k]+(A.to[k]-A.from[k])*e;if(u>=1){VS.an=null;A.done&&A.done()}}
  if(!sheetOk)buildSheet();drawVel();inkFrame(n);
  /* atlas: 60 fps while it moves (smear / scatter), 30 fps while it only turns */
  const asAct=!RM.matches&&(Math.abs(AS.S[0])+Math.abs(AS.S[1])>.25||Math.abs(AS.V[0])+Math.abs(AS.V[1])>2||n-st.tAsc<.9);
  if(n-AS.last>(asAct?.012:.031)||RM.matches&&AS.last<0){drawAtlas(n,Math.min(.05,n-AS.last));AS.last=n}
  const d=clock(),t=T(),ds=`${t?st.tabs.length:0} TABS · ${st.logs.length} LOGS · <i>${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}</i>`;if(ds!==dsubV){dsubV=ds;dsub.innerHTML=ds}
  requestAnimationFrame(loop)};
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&st.open&&!loopOn){loopOn=true;lastN=now();requestAnimationFrame(loop)}});
{const d=new Date();$('.dt-fr').textContent=`${FR.W[d.getDay()]} ${d.getDate()} ${FR.M[d.getMonth()]} ${d.getFullYear()}`;$('.dt-zh').textContent=`${FR.ZN[d.getMonth()]}月${zhDay(d.getDate())}日 · ${FR.ZW[d.getDay()]} · 浏览`}
/* ---------------------------------------------------------------- keys (only while open). Esc never closes the page (same as the files page brief) */
addEventListener('keydown',e=>{if(!st.open)return;const k=e.key.toLowerCase(),mod=e.ctrlKey||e.metaKey;
  if(e.key==='Escape'){if(document.activeElement===addr)return;e.preventDefault();e.stopImmediatePropagation();if(st.consoleOn)setConsole(false);return}
  if(mod&&k==='l'){e.preventDefault();addr.focus();return}
  if(mod&&k==='t'){e.preventDefault();req('browser.newTab',{});return}
  if(mod&&k==='w'){e.preventDefault();req('browser.closeTab',{tabId:st.active});return}
  if((mod&&k==='r')||e.key==='F5'){e.preventDefault();req('browser.reload',{tabId:st.active});return}
  if(e.key==='F12'){e.preventDefault();setConsole(!st.consoleOn);return}},true);
/* ---------------------------------------------------------------- seed tabs + scene hashes */
const seed=(which)=>{tid=1;st.logs=[];st.net=[];
  const wb=mkTab('http://localhost:5173',{title:SITES['localhost:5173'].title,fav:'vite',took:412,req:18,bytes:1.24});
  const dc=mkTab('http://localhost:4173/docs/adapter-api#workspace-list',{title:'Adapter API · workspace.list',fav:'docs',took:188,req:7,bytes:.41});
  const nt=mkTab('');st.tabs=[wb,dc,nt];st.active=wb.id;
  if(which==='newtab'){st.tabs=[dc,nt];st.active=nt.id}
  if(which==='play'){st.tabs=[dc,nt];st.active=nt.id}
  if(which==='error'){const er=mkTab('http://localhost:5174');er.state='error';er.title='找不到页面';er.err={code:'ERR_CONNECTION_REFUSED'};er.fav='vite';st.tabs=[wb,er,dc];st.active=er.id}
  if(which==='loading'){st.tabs=[dc,nt];st.active=nt.id;st.hold=true}
  if(which!=='newtab'&&which!=='play'&&which!=='loading'){const L=[['info','[vite] connecting…'],['info','[vite] connected.'],['log','Workbench boot · vue 3.5 · pinia 2.2'],['warn','[Vue warn] Extraneous non-props attributes (class) were passed to <Field>']];
    L.forEach(([l,x],i)=>st.logs.push({level:l,text:x,ts:`17:2${i}:0${i*3}`}));
    [['GET','/','document',200,1240,18],['GET','/@vite/client','script',200,18200,9],['GET','/src/main.ts','script',200,3100,12],['GET','/src/App.vue','script',200,6800,14],['GET','/demo/me','xhr',401,96,21],['GET','/favicon.svg','img',304,0,3]].forEach(([m,u,ty,s2,by,ms])=>st.net.push({method:m,url:u,type:ty,status:s2,bytes:by,ms}))}};
seed('browser');

/* ---------------------------------------------------------------- demo (#browser-play / window.__brDemo), ~19 s:
   tag → masthead + pieces → new tab (vellum on the left page) → scroll over the atlas (smear) → type → vellum slides over, pen line → peeled off → Kimi (skylight)
   → screenshot into a glassine envelope → bad address → letter returned to sender → new tab → the dove is startled out of the frame */
const demo=()=>{const cur=document.getElementById('rkCur');const D={x:760,y:470,press:-9};const its=[...document.querySelectorAll('.rail .grp .it')];
  window.__brNoAuto=true;window.__brLoadMs=1500;window.__brHoldLogin=180;try{localStorage.setItem('kimi.br8.dove',today())}catch(e){}st.doveGone=false;st.doveDone=true;buildSheet();
  const tagXY=()=>{const r=its[8].getBoundingClientRect();return [r.left+r.width/2+4,r.top+r.height/2+8]};
  const P=(sel,fx=.5,fy=.55)=>()=>{const e=root.querySelector(sel)||document.querySelector(sel);if(!e)return [D.x,D.y];const r=e.getBoundingClientRect();return [r.left+r.width*fx,r.top+r.height*fy]};
  const wheel=(dy)=>{const r=$('.br-atlas').getBoundingClientRect();root.dispatchEvent(new WheelEvent('wheel',{deltaY:dy,clientX:r.left+90,clientY:r.top+90,bubbles:true}))};
  const typ=(s,t0,dt)=>s.split('').map((c,i)=>[t0+i*dt,()=>{addr.value+=c}]);
  const MV=[[.1,.95,tagXY],[2.6,3.3,P('.br-atlas',.5,.45)],[4.6,5.1,P('.br-addr',.3)],[8.6,9.1,P('.br-kimi',.5)],[9.25,9.9,()=>[G.W-160,G.H-170]],
    [11.6,12.1,P('.b-shot',.5)],[13.6,14.0,P('.br-addr',.3)],[16.3,16.8,P('.br-tnew',.5)],[17.0,17.8,()=>[G.W-150,G.H-120]]];
  const S=[[0,()=>{window.__rail2&&window.__rail2.show()}],[1.0,()=>{D.press=now();its[8].click()}],
    ...[[3.45,90],[3.55,120],[3.65,140],[3.75,110],[3.85,60],[4.25,-70],[4.35,-90]].map(([t,dy])=>[t,()=>wheel(dy)]),
    [5.15,()=>{D.press=now();addr.focus()}],...typ('localhost:5173',5.3,.055),
    [6.2,()=>{const u=norm(addr.value);addr.blur();req('browser.open',{url:u,tabId:st.active})}],
    [9.15,()=>{D.press=now();req('browser.takeover',{on:true})}],[9.35,()=>{mockAgent()}],
    [12.15,()=>{D.press=now();req('browser.screenshot',{tabId:st.active});shotFx()}],
    [13.5,()=>{req('browser.takeover',{on:false})}],
    [14.05,()=>{D.press=now();addr.focus()}],[14.1,()=>{addr.value=''}],...typ('localhost:5174',14.15,.03),
    [14.65,()=>{window.__brLoadMs=800;const u=norm(addr.value);addr.blur();req('browser.open',{url:u,tabId:st.active})}],
    [16.85,()=>{D.press=now();req('browser.newTab',{})}],[17.55,()=>{st.doveDone=false;dove(true)}]];
  const t0=now();let si=0,from=null,mi=-1;
  const f=()=>{const t=now()-t0;while(si<S.length&&t>=S[si][0]){S[si][1]();si++}
    const m=MV.findIndex(([a,z])=>t>=a&&t<z);
    if(m!==-1){if(mi!==m){mi=m;from=[D.x,D.y]}const [a,z,to]=MV[m];const u=SM((t-a)/(z-a)),p=to();const arc=Math.sin(Math.PI*u)*Math.min(30,Math.hypot(p[0]-from[0],p[1]-from[1])*.08);D.x=from[0]+(p[0]-from[0])*u;D.y=from[1]+(p[1]-from[1])*u-arc}
    else if(mi!==-1&&t>=MV[mi][1]){const p=MV[mi][2]();D.x=p[0];D.y=p[1];mi=-1}
    st.mouse=[D.x,D.y];st.mIn=true;
    if(cur){const pr=now()-D.press<.12;cur.style.opacity='1';cur.style.transform=`translate(${(D.x-3).toFixed(2)}px,${(D.y-2).toFixed(2)}px) scale(${pr?.88:1})`}
    window.__demoMouse=[D.x,D.y];
    if(t<20.5)requestAnimationFrame(f)};requestAnimationFrame(f)};

const boot=()=>{const sc=['browser-agent','browser-loading','browser-error','browser-newtab','browser-play','browser'].find(has);if(!sc)return;
  const w=sc.replace('browser-','').replace('browser','browser');
  if(sc==='browser-play'){seed('play');setTimeout(demo,600);return}
  seed(w);window.__rail2&&window.__rail2.show();
  setTimeout(()=>{open({});if(sc==='browser-agent'){window.__brHoldLogin=1e9;setTimeout(()=>req('browser.takeover',{on:true}),1000)}
    if(sc==='browser-loading')setTimeout(()=>req('browser.open',{url:'http://localhost:5173',tabId:st.active}),1100)},520)};
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>requestAnimationFrame(()=>requestAnimationFrame(boot)));

window.__browser={emit,open,close,mouse:(x,y)=>{st.mouse=[x,y];st.mIn=true},toggle:()=>st.open?close():open(),get isOpen(){return st.open},get state(){const t=T();return {open:st.open,phase:st.phase,mode:MODE(),tabs:st.tabs.length,active:t&&t.url,takeover:st.takeover,console:st.consoleOn,agentStep:st.agentStep,shots:st.shots,vellum:VS.mode,ink:st.ink.ph}},
  set onRequest(f){bridge=typeof f==='function'?f:null},get onRequest(){return bridge},viewportRect:()=>vp.getBoundingClientRect(),seed,demo,mockAgent,dove:()=>dove(true),kick};
window.__brDemo=demo;window.__brDove=()=>dove(true);
})();
