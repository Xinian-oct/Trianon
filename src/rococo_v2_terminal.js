(()=>{
/* ===================================================================================================
   状态 #12 · 终端 ——「Billet de Terminal · 终端票根」   rococo v2 合并版的一层（2026-10-28 10:10）
   票券横幅的版式语言：横长票券 + 左侧缺口/切角、主题物件大拼贴、四角星爆闪、
   大标题 + 小标语条、同一张票的双联。配色：象牙白 / 雾霾灰蓝 / 钢笔墨水蓝 + 极少冷银，没有暗版（双联 = 象牙版主票 +
   雾蓝版副票，撕线 = 细虚线 + 两个半圆缺口），物件是终端 / 编程主题的复古物（每张票 6–9 件、大而少），没有武器烟酒骷髅、
   没有重复纹样。插画 = generate_image 高完成度描边矢量位图（b12v/out，来源 b12v/SOURCES.md），CSS/SVG 只做结构、细线、动画。
   整页切换（同收藏 / 浏览器）：右栏拉手隐藏，Esc 不关整页（只关查找 / 取消重命名），与其他吊牌互切。
   ---------------------------------------------------------------------------------------------------
   后端 → 页面   window.__terminal.emit(type, payload)
     'terminal.output'   {id, data}            一段输出（ANSI：SGR 颜色/粗体/斜体/下划线、\r \b \x1b[K \x1b[2J）
     'terminal.exit'     {id, code}            会话的 shell 结束（标签变成「已检」，不能再输入）
     'terminal.sessions' {list:[{id,name,shell,cwd,branch,startedAt}]}   整体替换会话列表
     'terminal.cwd'      {id, cwd, branch, code?}   提示符就绪（shell integration：每次回到提示符发一次；code = 上条命令退出码）
   页面 → 后端   window.__terminal.onRequest = (type, payload) => {}     （没接后端时用内置 mock shell）
     'terminal.create' {id, shell, cwd}   页面先给出 id（后端沿用），随后发 terminal.sessions / terminal.cwd
     'terminal.input'  {id, data}          提示符下按 Enter 发整行 + '\r'；命令运行中按键原样发（Ctrl+C = '\x03'）
     'terminal.resize' {id, cols, rows} · 'terminal.kill' {id} · 'terminal.rename' {id, name}
   行编辑在页面里做（票根提示符、历史 ↑↓、Tab 补全），所以后端 shell 应关掉自己的提示符与回显（PS1='' / stty -echo）。
   场景 hash：#terminal #terminal-run（npm run dev 运行中）#terminal-split #terminal-kimi #terminal-empty（#terminal-play 预留）
   =================================================================================================== */
const b=document.body,RM=matchMedia('(prefers-reduced-motion: reduce)');
const HASH=window.__navHash||decodeURIComponent(location.hash.slice(1)).split(/[&,]/).filter(Boolean);
const has=k=>HASH.includes(k);
const now=()=>performance.now();
const IMG={typewriter:'__B12_TYPEWRITER__',reel:'__B12_REEL__',punchcard:'__B12_PUNCHCARD__',telegraph:'__B12_TELEGRAPH__',tube:'__B12_TUBE__',
  compass:'__B12_COMPASS__',gear:'__B12_GEAR__',keycaps:'__B12_KEYCAPS__',tape:'__B12_TAPE__',floppy:'__B12_FLOPPY__',key:'__B12_KEY__',lamp:'__B12_LAMP__',paper:'__B12_PAPER__'};
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const M=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
const W=['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
const HOME='/Users/colette';
const tilde=p=>p===HOME?'~':p.startsWith(HOME+'/')?'~'+p.slice(HOME.length):p;

/* ---------------------------------------------------------------- ticket outlines (one generator for banner, stub, tabs, empty ticket) */
const f1=v=>+v.toFixed(2);
const tk=(w,h,o={})=>{const c=o.c??16,n=o.n??12,rn=o.rn??0,c2=o.c2??0,ln=o.ln??0;
  /* left: chamfer c + mid notch n; right: either joint notches rn (top/bottom half circles) or chamfer c2; ln = notches on the left joint (stub) */
  let d=ln?`M${f1(ln)} 0`:`M${f1(c)} 0`;
  if(rn)d+=` H${f1(w-rn)} A${rn} ${rn} 0 0 0 ${f1(w)} ${f1(rn)} V${f1(h-rn)} A${rn} ${rn} 0 0 0 ${f1(w-rn)} ${f1(h)}`;
  else d+=` H${f1(w-c2)} L${f1(w)} ${f1(c2)} V${f1(h-c2)} L${f1(w-c2)} ${f1(h)}`;
  if(ln)d+=` H${f1(ln)} A${ln} ${ln} 0 0 0 0 ${f1(h-ln)} V${f1(ln)} A${ln} ${ln} 0 0 0 ${f1(ln)} 0 Z`;
  else{d+=` H${f1(c)} L0 ${f1(h-c)}`;if(n)d+=` V${f1(h/2+n)} A${n} ${n} 0 0 0 0 ${f1(h/2-n)}`;d+=` V${f1(c)} Z`}
  return d};
const inset=(w,h,o,k)=>{const q={...o};['c','c2'].forEach(x=>{if(q[x])q[x]=Math.max(2,q[x]-k*.45)});['n','rn','ln'].forEach(x=>{if(q[x])q[x]=q[x]+k});return tk(w-2*k,h-2*k,q)};
const STAR=(R,cls='')=>{const r=R*.16;return `<svg class="tm-star ${cls}" viewBox="${-R-12} ${-R-12} ${2*R+24} ${2*R+24}" width="${2*R+24}" height="${2*R+24}" aria-hidden="true">
  <path class="ray" d="M${-R-10} 0 H${R+10} M0 ${-R-10} V${R+10}"/>
  <path class="pt" d="M0 ${-R} C${r} ${-r} ${r} ${-r} ${R} 0 C${r} ${r} ${r} ${r} 0 ${R} C${-r} ${r} ${-r} ${r} ${-R} 0 C${-r} ${-r} ${-r} ${-r} 0 ${-R}Z"/></svg>`};

/* geometry (1440×900 layout like 收藏 / 浏览器: rail · left column 116–302 · centre 330–1222 · right column 1246–1424) */
const G={x:330,y:20,mw:628,sw:264,h:258};
const MO={c:18,n:13,rn:9},SO={ln:9,c2:16};
/* collage: [key, left, top, width, rotate, z] inside the 628×258 main ticket (6–9 large pieces, room to breathe) */
const COL=[['punchcard',8,62,262,-7,1],['tape',176,-46,360,5,1],['compass',26,4,112,-12,4],['tube',160,8,62,-9,3],['keycaps',300,2,104,9,4],
  ['gear',404,150,196,-5,2],['reel',448,-34,196,0,3],['typewriter',232,90,292,-2,5],['telegraph',462,166,176,-3,6]];
const COL2=[['floppy',186,-16,110,15,1],['lamp',16,4,44,-4,2],['key',108,204,156,-8,2]];
const STARS=[[150,34,15,'s1'],[424,30,12,'s2'],[598,142,14,'s3'],[262,120,9,'s4'],[386,212,11,'s5']];

/* ---------------------------------------------------------------- markup */
const root=document.createElement('div');root.id='tm';root.setAttribute('aria-hidden','true');root.setAttribute('aria-label','终端');
const mainD=tk(G.mw,G.h,MO),stubD=tk(G.sw,G.h,SO);
root.innerHTML=`<div class="tm-veil"></div>
<div class="tm-side tm-head tm-in"><p class="tm-lab">N° 12 · <i>billet</i></p><p class="tm-th">Terminal</p><p class="tm-ttl">终端</p><p class="tm-sub">BILLETS <i class="n-ses">0</i> · <span class="n-sh">ZSH</span></p></div>
<div class="tm-side tm-reg tm-in"><h4><em>Guichet</em><span>票 务</span></h4>
 <p><span>Shell</span><b class="g-sh">zsh 5.9</b><i>外壳</i></p><p><span>Taille</span><b class="g-sz">96×22</b><i>行列</i></p>
 <p><span>Encodage</span><b>UTF-8</b><i>编码</i></p><p><span>Liaison</span><b class="g-li">mock</b><i>连接</i></p><p class="tot"><span>Billets</span><b class="g-n">0</b><i>会话</i></p></div>
<div class="tm-side tm-keys tm-in"><h4><em>Raccourcis</em><span>快 捷 键</span></h4>
 <p><kbd>↑</kbd><kbd>↓</kbd><span>历史</span><kbd>Tab</kbd><span>补全</span></p>
 <p><kbd>⌃C</kbd><span>中断</span><kbd>⌘K</kbd><span>清屏</span></p>
 <p><kbd>⌘T</kbd><span>新票</span><kbd>⌘D</kbd><span>分屏</span></p>
 <p><kbd>⌘F</kbd><span>查找</span><kbd>⌘C</kbd><span>复制选中</span></p></div>
<div class="tm-side tm-cmds tm-in"><h4><em>Trajets</em><span>常 用</span></h4><div class="cm-l"></div>
 <p class="cm-n">点一下填进提示符；输入 <b>help</b> 看全部。</p></div>
<div class="tm-side tm-date tm-in"><em></em><b></b><span class="tm-dsub"></span><p class="tm-dl">Composter · <i>voyager</i></p></div>
<div class="tm-side tm-jr tm-in"><h4><em>Composteur</em><span>检 票</span></h4><div class="jr-l"></div></div>
<div class="tm-side tm-pm tm-in"><svg viewBox="0 0 120 120" aria-hidden="true"><path id="tmPmP" d="M60 60 m-41 0 a41 41 0 1 1 82 0 a41 41 0 1 1 -82 0" fill="none"/>
 <circle cx="60" cy="60" r="52"/><circle cx="60" cy="60" r="30"/><text><textPath href="#tmPmP">TERMINAL ✦ KIMI CODE ✦ BILLET ✦</textPath></text>
 <text class="pt" x="60" y="62" text-anchor="middle">--:--</text><text class="ps" x="60" y="76" text-anchor="middle">N° 12</text></svg>
 <p class="pl"><span>Pilote</span><b class="pl-v">OFF</b></p></div>
<div class="tm-stage">
 <div class="tm-bill">
  <div class="tk tk-main" style="clip-path:path('${mainD}')"><div class="tk-bg"></div><div class="col"></div><div class="stars"></div>
   <p class="tk-no">BILLET N° 012 · ADMIT ONE</p>
   <h2 class="tk-t">Terminal</h2><p class="tk-bar"><span>« Une ligne, un voyage. »</span><i>·</i><b class="tb-sh">zsh</b><i>·</i><b class="tb-cwd">~/rococo-workbench</b></p></div>
  <svg class="tk-ol tk-ol-m" width="${G.mw}" height="${G.h}" aria-hidden="true"><path class="o" d="${mainD}"/><path class="i" transform="translate(5 5)" d="${inset(G.mw,G.h,MO,5)}"/></svg>
  <div class="tk tk-stub" style="clip-path:path('${stubD}')"><div class="tk-bg"></div><div class="col"></div>
   <p class="sb-lab">BILLET DE SESSION</p><p class="sb-t">Session</p>
   <div class="sb-box"><p><span>Shell</span><b class="s-sh">zsh</b></p><p><span>Cwd</span><b class="s-cwd">~/rococo-workbench</b></p>
    <p><span>Branche</span><b class="s-br">⎇ main</b></p><p><span>Durée</span><b class="s-up">00:00:00</b></p></div>
   <p class="sb-no"><span class="s-no">N° 012-A</span><i>ALLER SIMPLE</i></p></div>
  <svg class="tk-ol tk-ol-s" width="${G.sw}" height="${G.h}" aria-hidden="true"><path class="o" d="${stubD}"/><path class="i" transform="translate(5 5)" d="${inset(G.sw,G.h,SO,5)}"/></svg>
  <svg class="tk-tear" width="2" height="${G.h}" aria-hidden="true"><path d="M1 16 V${G.h-16}"/></svg>
 </div>
 <div class="tm-tabs" role="tablist" aria-label="会话"><div class="tb-l"></div>
  <button type="button" class="tb-new" aria-label="新建会话（⌘T）"><span class="slot"></span><em>Imprimer</em><b>新票</b><i>+</i></button></div>
 <div class="tm-paper"><i class="pp-l"></i><div class="panes"></div>
  <div class="tm-find" role="search"><span>Chercher</span><input type="text" class="fd-q" placeholder="查找输出…" spellcheck="false" aria-label="查找"><b class="fd-n">0/0</b>
   <button type="button" class="fd-p" aria-label="上一个">↑</button><button type="button" class="fd-x" aria-label="关闭查找">✕</button></div>
  <div class="tm-empty"><div class="em-tk"><svg class="em-ol" width="380" height="168" aria-hidden="true"><path class="o" d="${tk(380,168,{c:16,n:12,c2:16})}"/><path class="i" transform="translate(6 6)" d="${inset(380,168,{c:16,n:12,c2:16},6)}"/><path class="ln" d="M70 118 H330"/><path class="ln" d="M70 140 H262"/></svg>
   <p class="em-t">Aucun billet</p><p class="em-s">没有正在运行的会话 · 一张待打印的空白票</p></div>
   <button type="button" class="em-b"><em>Imprimer un billet</em><b>新建会话</b></button></div>
 </div>
 <p class="tm-foot"><span class="ft-k"><kbd>⌘T</kbd>新票 <kbd>⌘D</kbd>分屏 <kbd>⌘F</kbd>查找 <kbd>⌘K</kbd>清屏 <kbd>⌃C</kbd>中断</span><span class="ft-r"><i class="ft-sz">96×22</i> · UTF-8 · <i class="ft-st">PRÊT</i></span></p>
</div>
<textarea class="tm-kb" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="终端输入"></textarea>`;
root.style.setProperty('--tm-paper',`url(${IMG.paper})`);
b.appendChild(root);
const $=q=>root.querySelector(q),$$=q=>[...root.querySelectorAll(q)];
const bill=$('.tm-bill'),tMain=$('.tk-main'),tStub=$('.tk-stub'),panesEl=$('.panes'),tabsEl=$('.tb-l'),kb=$('.tm-kb'),paper=$('.tm-paper'),
  findEl=$('.tm-find'),fq=$('.fd-q'),emptyEl=$('.tm-empty'),stage=$('.tm-stage');
/* collage pieces */
const mkCol=(host,list)=>list.forEach(([k,x,y,w,r,z])=>{const e=document.createElement('img');e.className='ob ob-'+k;e.src=IMG[k];e.alt='';e.draggable=false;
  e.style.cssText=`left:${x}px;top:${y}px;width:${w}px;--r:${r}deg;z-index:${z}`;e.dataset.k=k;host.appendChild(e)});
mkCol(tMain.querySelector('.col'),COL);mkCol(tStub.querySelector('.col'),COL2);
const reelEl=$('.ob-reel');
const starsEl=tMain.querySelector('.stars');
starsEl.innerHTML=STARS.map(([x,y,R,c])=>`<i class="st ${c}" style="left:${x}px;top:${y}px">${STAR(R)}</i>`).join('');
$('.cm-l').innerHTML=['ls','git status','git log --oneline','npm run dev','cat README.md','kimi'].map(c=>`<button type="button" class="cm" data-c="${esc(c)}"><i>❯</i>${esc(c)}</button>`).join('');

/* ---------------------------------------------------------------- mock file system (Kimi Code workbench) */
const FS={'/Users/colette':['rococo-workbench/','notes/','Downloads/'],
 '/Users/colette/rococo-workbench':['README.md','package.json','vite.config.ts','tsconfig.json','src/','public/','docs/','.git/','.gitignore'],
 '/Users/colette/rococo-workbench/src':['main.ts','terminal.ts','collection.ts','browser.ts','styles/'],
 '/Users/colette/rococo-workbench/src/styles':['rococo.css','terminal.css'],
 '/Users/colette/rococo-workbench/public':['favicon.svg','butterfly.png'],
 '/Users/colette/rococo-workbench/docs':['server-api.md','design-notes.md'],
 '/Users/colette/notes':['todo.md'],'/Users/colette/Downloads':['refs.zip']};
const README=['# Trianon Workbench','','Kimi Code 的雾蓝桌面端 · 象牙白 / 雾霾灰蓝 / 钢笔墨水蓝。','','## 开发','  npm install','  npm run dev      # http://localhost:5173','','## 页面','  对话 · 文件 · 搜索 · 浏览器 · 收藏 · 终端'];
const LOG=[['a3f9c21','终端票根：票券横幅 + 多会话'],['7be41d0','收藏 v2：小兔管理员'],['c02e8aa','光标：蓝色蝴蝶 48px'],['91d6b3f','浏览器 v6：法式版画手账'],
 ['5e8f0c4','搜索 v2：云天仪表'],['2d77a19','左栏吊牌放大'],['e41b6d2','空白页 v5 拼贴'],['0f3c9be','初始化 rococo workbench']];
const CMDS=['help','ls','cd','pwd','git status','git log --oneline','npm run dev','cat README.md','echo','clear','kimi','exit'];
const A={rs:'\x1b[0m',b:'\x1b[1m',it:'\x1b[3m',u:'\x1b[4m',red:'\x1b[31m',grn:'\x1b[32m',yel:'\x1b[33m',blu:'\x1b[34m',cya:'\x1b[36m',gry:'\x1b[90m'};

/* ---------------------------------------------------------------- sessions */
let renaming=null;
const st={open:false,sessions:[],active:null,split:false,pane2:null,focus:0,seq:0,find:'',findI:0,kimi:null,journal:[],cols:96,rows:22,nCmd:0};
const mkSession=(o={})=>{const n=++st.seq;const s={id:o.id||('t'+n+'-'+Math.random().toString(36).slice(2,6)),name:o.name||(n===1?'workbench':n===2?'serveur':'billet '+n),
  no:n,shell:o.shell||'zsh',cwd:o.cwd||HOME+'/rococo-workbench',branch:o.branch??'main',started:now()-(o.ago||0)*1000,lines:[],cur:null,sty:{},
  input:'',caret:0,hist:[],hi:-1,draft:'',running:null,ended:false,dirty:true,stick:true};
  return s};
const S=id=>st.sessions.find(s=>s.id===id);
const act=()=>S(st.focus===1&&st.split?st.pane2:st.active);
const req=(type,payload)=>{const T=window.__terminal;if(T&&typeof T.onRequest==='function'){try{if(T.onRequest(type,payload)!==false)return true}catch(e){console.error(e)}}return false};
const backend=()=>{const T=window.__terminal;return !!(T&&typeof T.onRequest==='function')};

/* ---------------------------------------------------------------- ANSI → line segments */
const SGR=(sty,codes)=>{if(!codes.length)codes=[0];for(const c of codes){
  if(c===0){for(const k in sty)delete sty[k]}else if(c===1)sty.b=1;else if(c===3)sty.i=1;else if(c===4)sty.u=1;else if(c===22)delete sty.b;else if(c===23)delete sty.i;else if(c===24)delete sty.u;
  else if((c>=30&&c<=37)||(c>=90&&c<=97))sty.fg=c;else if(c===39)delete sty.fg}};
const FGC={30:'k',31:'er',32:'ok',33:'wn',34:'bl',35:'mg',36:'cy',37:'wt',90:'gy',91:'er',92:'ok',93:'wn',94:'bl',95:'mg',96:'cy',97:'wt'};
const clsOf=sty=>{const c=[];if(sty.fg)c.push('a-'+FGC[sty.fg]);if(sty.b)c.push('a-b');if(sty.i)c.push('a-i');if(sty.u)c.push('a-u');return c.join(' ')};
const newLine=(s,kind='out',extra={})=>{const L={k:kind,segs:[],...extra};s.lines.push(L);s.cur=L;if(s.lines.length>1500)s.lines.splice(0,s.lines.length-1500);return L};
const push=(s,t)=>{if(!t)return;let L=s.cur;if(!L||L.k!=='out'||L.done)L=newLine(s);const c=clsOf(s.sty);const last=L.segs[L.segs.length-1];
  if(last&&last.c===c)last.t+=t;else L.segs.push({t,c});if(c.includes('a-er'))L.er=1};
const write=(s,data)=>{let i=0,buf='';const flush=()=>{push(s,buf);buf=''};
  while(i<data.length){const ch=data[i];
    if(ch==='\x1b'&&data[i+1]==='['){flush();let j=i+2;while(j<data.length&&!/[A-Za-z]/.test(data[j]))j++;const p=data.slice(i+2,j),f=data[j];
      if(f==='m')SGR(s.sty,p?p.split(';').map(Number):[]);
      else if(f==='J'&&(p==='2'||p==='3')){s.lines=[];s.cur=null}
      else if(f==='K'){/* erase to end of line: the current line is rebuilt by \r anyway */}
      i=j+1;continue}
    if(ch==='\n'){flush();if(s.cur&&s.cur.k==='out'&&!s.cur.done)s.cur.done=1;else newLine(s).done=1;i++;continue}
    if(ch==='\r'){flush();if(data[i+1]!=='\n'&&s.cur&&s.cur.k==='out'&&!s.cur.done){s.cur.segs=[];s.cur.er=0}i++;continue}
    if(ch==='\b'){flush();const L=s.cur;if(L&&L.segs.length){const g=L.segs[L.segs.length-1];g.t=g.t.slice(0,-1);if(!g.t)L.segs.pop()}i++;continue}
    if(ch==='\x07'){i++;continue}
    buf+=ch;i++}
  flush();s.dirty=true};
const outLn=(s,t='')=>emit('terminal.output',{id:s.id,data:t+'\r\n'});

/* ---------------------------------------------------------------- mock shell */
const resolve=(cwd,a)=>{if(!a||a==='~')return HOME;let p=a.startsWith('~')?HOME+a.slice(1):a.startsWith('/')?a:cwd+'/'+a;const out=[];
  for(const k of p.split('/')){if(!k||k==='.')continue;if(k==='..')out.pop();else out.push(k)}return '/'+out.join('/')};
const MOCK={
  timers:new Map(),
  run(s,line){const raw=line.trim();const [cmd,...args]=raw.split(/\s+/);const done=(code=0)=>{s.running=null;stopReel(s);emit('terminal.cwd',{id:s.id,cwd:s.cwd,branch:s.branch,code})};
    if(!raw)return done(0);
    if(cmd==='help'){outLn(s,`${A.b}Billet de Terminal${A.rs} ${A.gry}· 内置 mock shell，可用命令：${A.rs}`);
      [['ls [-a]','列出目录'],['cd <dir>','切换目录'],['pwd','当前路径'],['git status','工作区状态'],['git log --oneline','提交记录'],['npm run dev','开发服务器（长任务，⌃C 中断）'],
       ['cat README.md','查看文件'],['echo <text>','回显'],['clear','清屏（⌘K）'],['kimi','让 Kimi 接管终端'],['exit','结束会话']].forEach(([a,z])=>outLn(s,`  ${A.cya}${a.padEnd(20)}${A.rs}${z}`));return done(0)}
    if(cmd==='pwd'){outLn(s,s.cwd);return done(0)}
    if(cmd==='ls'){const ar=args.find(a=>!a.startsWith('-'));const p=ar?resolve(s.cwd,ar):s.cwd;const l=FS[p];if(!l){outLn(s,`${A.red}ls: ${args.find(a=>!a.startsWith('-'))}: No such file or directory${A.rs}`);return done(1)}
      const all=args.some(a=>/^-\w*a/.test(a));const it=l.filter(x=>all||!x.startsWith('.'));
      outLn(s,it.map(x=>x.endsWith('/')?`${A.b}${A.blu}${x.slice(0,-1)}${A.rs}`:x.endsWith('.md')?`${A.cya}${x}${A.rs}`:x).join('    '));return done(0)}
    if(cmd==='cd'){const p=resolve(s.cwd,args[0]);if(!FS[p]){outLn(s,`${A.red}cd: no such file or directory: ${args[0]}${A.rs}`);return done(1)}
      s.cwd=p;s.branch=p.startsWith(HOME+'/rococo-workbench')?'main':'';return done(0)}
    if(cmd==='echo'){outLn(s,args.join(' ').replace(/^["']|["']$/g,''));return done(0)}
    if(cmd==='cat'){const f=args[0]||'';if(/README\.md$/i.test(f)&&s.cwd.endsWith('rococo-workbench')){README.forEach(l=>outLn(s,l.startsWith('#')?`${A.b}${l}${A.rs}`:l.includes('#')?l.replace(/(#.*)$/,`${A.gry}$1${A.rs}`):l));return done(0)}
      outLn(s,`${A.red}cat: ${f||'(无文件名)'}: No such file or directory${A.rs}`);return done(1)}
    if(cmd==='git'){if(!s.cwd.startsWith(HOME+'/rococo-workbench')){outLn(s,`${A.red}fatal: not a git repository (or any of the parent directories): .git${A.rs}`);return done(128)}
      if(args[0]==='status'){[`On branch ${A.b}main${A.rs}`,`Your branch is ahead of 'origin/main' by 1 commit.`,'','Changes to be committed:',`        ${A.grn}new file:   src/terminal.ts${A.rs}`,'',
        'Changes not staged for commit:',`        ${A.yel}modified:   src/styles/terminal.css${A.rs}`,`        ${A.yel}modified:   README.md${A.rs}`,'','Untracked files:',`        ${A.gry}docs/billet-notes.md${A.rs}`].forEach(l=>outLn(s,l));return done(0)}
      if(args[0]==='log'){const n=+(args[args.indexOf('-n')+1])||(args.find(a=>/^-\d+$/.test(a))?+args.find(a=>/^-\d+$/.test(a)).slice(1):8);
        LOG.slice(0,n).forEach(([h,m],i)=>outLn(s,`${A.yel}${h}${A.rs} ${i===0?`${A.cya}(HEAD -> main)${A.rs} `:''}${m}`));return done(0)}
      if(args[0]==='branch'){outLn(s,`* ${A.grn}main${A.rs}`);outLn(s,'  billet-tabs');return done(0)}
      outLn(s,`${A.red}git: '${args[0]||''}' is not a git command in this mock.${A.rs}`);return done(1)}
    if(cmd==='npm'&&args[0]==='run'&&args[1]==='dev'){s.running={cmd:raw,long:true,t:now()};startReel(s);
      const L=[[300,`\r\n${A.gry}> rococo-workbench@0.12.0 dev${A.rs}\r\n${A.gry}> vite${A.rs}\r\n`],[900,`\r\n  ${A.b}${A.grn}VITE${A.rs} ${A.grn}v5.4.10${A.rs}  ready in ${A.b}412${A.rs} ms\r\n\r\n`],
        [1150,`  ${A.grn}➜${A.rs}  ${A.b}Local${A.rs}:   ${A.cya}http://localhost:${A.b}5173${A.rs}${A.cya}/${A.rs}\r\n`],[1300,`  ${A.gry}➜  Network: use --host to expose${A.rs}\r\n`],[1450,`  ${A.gry}➜  press h + enter to show help${A.rs}\r\n`]];
      const tms=[];L.forEach(([t,d])=>tms.push(setTimeout(()=>emit('terminal.output',{id:s.id,data:d}),RM.matches?0:t)));
      const files=['src/terminal.ts','src/styles/terminal.css','src/collection.ts','src/main.ts'];let k=0;
      const hmr=()=>{if(!s.running)return;const d=new Date(Date.now());const ts=`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        emit('terminal.output',{id:s.id,data:`${A.gry}${ts}${A.rs} ${A.cya}${A.b}[vite]${A.rs} ${A.grn}hmr update${A.rs} ${A.gry}/${files[k++%files.length]}${A.rs}\r\n`});tms.push(setTimeout(hmr,1700))};
      tms.push(setTimeout(hmr,2600));MOCK.timers.set(s.id,{tms,done});return}
    if(cmd==='kimi'){outLn(s,`${A.cya}✦ Kimi${A.rs} ${A.gry}接管终端 · Pilote — 你的蝴蝶光标随时可以拿回控制（⌃C）${A.rs}`);s.running=null;emit('terminal.cwd',{id:s.id,cwd:s.cwd,branch:s.branch,code:0});setTimeout(()=>kimiGo(s),RM.matches?60:450);return}
    if(cmd==='exit'){outLn(s,`${A.gry}logout${A.rs}`);s.running=null;emit('terminal.exit',{id:s.id,code:0});return}
    if(cmd==='clear'){s.running=null;clearPane(s);emit('terminal.cwd',{id:s.id,cwd:s.cwd,branch:s.branch,code:0});return}
    outLn(s,`${A.red}zsh: command not found: ${cmd}${A.rs}`);done(127)},
  input(s,data){const t=MOCK.timers.get(s.id);
    if(data==='\x03'&&s.running){if(t){t.tms.forEach(clearTimeout);MOCK.timers.delete(s.id)}emit('terminal.output',{id:s.id,data:`${A.gry}^C${A.rs}\r\n`});s.running=null;stopReel(s,true);
      emit('terminal.cwd',{id:s.id,cwd:s.cwd,branch:s.branch,code:130});return}
    if(s.running){if(data==='h\r'||data==='h')emit('terminal.output',{id:s.id,data:`  ${A.gry}shortcuts: r restart · u show url · o open · q quit${A.rs}\r\n`});return}
    if(data.endsWith('\r'))MOCK.run(s,data.slice(0,-1))}};

/* ---------------------------------------------------------------- emit (backend → page) */
const emit=(type,p={})=>{
  if(type==='terminal.output'){const s=S(p.id);if(!s)return;write(s,String(p.data||''));sched()}
  else if(type==='terminal.cwd'){const s=S(p.id);if(!s)return;if(p.cwd)s.cwd=p.cwd;if(p.branch!==undefined)s.branch=p.branch||'';
    const was=s.running;s.running=null;if(was&&was.long)stopReel(s,true);
    if(s.pending){journal(s,s.pending,p.code??0);s.pending=null}
    if(s.cur)s.cur.done=1;s.dirty=true;syncInfo();sched()}
  else if(type==='terminal.exit'){const s=S(p.id);if(!s)return;s.ended=true;s.running=null;stopReel(s);
    write(s,`\r\n${A.gry}[进程已结束 · code ${p.code??0}] 这张票已检过，⌘T 打印新票${A.rs}\r\n`);renderTabs();syncInfo();sched()}
  else if(type==='terminal.sessions'){const list=p.list||[];const keep=new Map(st.sessions.map(s=>[s.id,s]));
    st.sessions=list.map(o=>{const s=keep.get(o.id)||mkSession(o);if(o.name)s.name=o.name;if(o.cwd)s.cwd=o.cwd;if(o.branch!==undefined)s.branch=o.branch;if(o.shell)s.shell=o.shell;return s});
    if(!S(st.active))st.active=st.sessions[0]?st.sessions[0].id:null;if(st.split&&!S(st.pane2))setSplit(false);renderAll()}};

/* ---------------------------------------------------------------- render */
const PANES=()=>$$('.pane');
const mkPane=i=>{const e=document.createElement('div');e.className='pane';e.dataset.i=i;
  e.innerHTML=`<div class="sc"><div class="ls"></div><div class="pr"></div><i class="pad"></i></div><p class="pn"></p>`;
  e.addEventListener('pointerdown',ev=>{if(ev.button)return;st.focus=i;PANES().forEach(p=>p.classList.toggle('fo',+p.dataset.i===st.focus));const s=act();if(s)s.dirty=true;sched()});
  e.addEventListener('mouseup',()=>{const sel=getSelection();if(!sel||sel.isCollapsed)focusKb()});
  const sc=e.querySelector('.sc');sc.addEventListener('scroll',()=>{const s=paneSes(i);if(s)s.stick=sc.scrollTop+sc.clientHeight>=sc.scrollHeight-4},{passive:true});
  panesEl.appendChild(e);return e};
const paneSes=i=>S(i===1?st.pane2:st.active);
const promptHTML=(s,cwd,branch,o={})=>`<span class="pt${o.kimi?' km':''}${o.punch?' punched':''}"><i class="ch">❯</i><b>${esc(tilde(cwd))}</b>${branch?`<em>⎇ ${esc(branch)}</em>`:''}${o.kimi?'<u>Kimi</u>':''}<s class="hole"></s></span>`;
const hl=t=>{const e=esc(t);if(!st.find)return e;const q=esc(st.find).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return e.replace(new RegExp(q,'gi'),m=>`<mark>${m}</mark>`)};
const lineHTML=(s,L)=>{if(L.k==='cmd')return `<div class="ln cmd${L.km?' kmd':''}">${promptHTML(s,L.cwd,L.br,{punch:1,kimi:L.km})}<span class="cx">${hl(L.cmd)}</span></div>`;
  if(L.k==='mark')return `<div class="ln mk"><span>${esc(L.t)}</span></div>`;
  const inner=L.segs.map(g=>g.c?`<span class="${g.c}">${hl(g.t)}</span>`:hl(g.t)).join('');
  return `<div class="ln${L.er?' er':''}">${inner||'&#8203;'}${L.er?'<i class="xs" aria-hidden="true">✕</i>':''}</div>`};
const renderPane=(i)=>{const p=PANES()[i];if(!p)return;const s=paneSes(i);const ls=p.querySelector('.ls'),pr=p.querySelector('.pr'),sc=p.querySelector('.sc');
  p.classList.toggle('fo',st.focus===i||!st.split);p.querySelector('.pn').textContent=s?`N° ${pad(s.no)} · ${s.name}`:'';
  if(!s){ls.innerHTML='';pr.innerHTML='';return}
  if(s.dirty||p.dataset.sid!==s.id||st._fd!==st.find){ls.innerHTML=s.lines.map(L=>lineHTML(s,L)).join('');p.dataset.sid=s.id}
  /* live prompt line (hidden while a command runs or the session has ended) */
  const live=!s.running&&!s.ended;const km=st.kimi&&st.kimi.s===s;
  if(live){const a=s.input.slice(0,s.caret),z=s.input.slice(s.caret);
    pr.innerHTML=`${promptHTML(s,s.cwd,s.branch,{kimi:km})}<span class="cx">${esc(a)}<i class="cu${(st.focus===i||!st.split)&&!km?'':' off'}"></i>${esc(z)}</span>${s.ghost&&!km?`<span class="gh">${esc(s.ghost)}</span>`:''}`;pr.style.display=''}
  else{pr.innerHTML=s.running?`<span class="cu run"></span>`:'';pr.style.display=s.running?'':'none'}
  if(s.stick)sc.scrollTop=sc.scrollHeight;
  s.dirty=false};
let rq=0;const sched=()=>{if(rq)return;rq=requestAnimationFrame(()=>{rq=0;renderPanes()})};
const renderPanes=()=>{const n=st.split?2:1;while(PANES().length<n)mkPane(PANES().length);while(PANES().length>n)PANES()[PANES().length-1].remove();
  panesEl.classList.toggle('split',st.split);for(let i=0;i<n;i++)renderPane(i);
  st._fd=st.find;root.classList.toggle('empty',!st.sessions.length);syncFoot();placeKb()};
const renderTabs=()=>{if(renaming){$('.n-ses').textContent=st.sessions.length;return}const n=st.sessions.length,w=Math.max(92,Math.min(150,Math.floor((736-8*(n-1))/Math.max(1,n))));
  tabsEl.innerHTML=st.sessions.map(s=>{const on=s.id===st.active,sec=st.split&&s.id===st.pane2;const d=tk(w,34,{c:8,n:5,c2:6});
    return `<div class="tb${on?' on':''}${sec?' sec':''}${s.ended?' end':''}" role="tab" aria-selected="${on}" tabindex="0" data-id="${esc(s.id)}" style="width:${w}px">
    <svg class="tb-sv" width="${w}" height="34" aria-hidden="true"><path class="f" d="${d}"/><path class="o" d="${d}"/></svg>
    <span class="tn">N°${pad(s.no)}</span><b class="nm" title="双击重命名">${esc(s.name)}</b>${s.running&&s.running.long?'<i class="rn" aria-label="运行中"></i>':''}<button type="button" class="x" aria-label="关闭会话">✕</button></div>`}).join('');
  $('.n-ses').textContent=n;$('.g-n').textContent=n};
const syncInfo=()=>{const s=act()||S(st.active);const cwd=s?tilde(s.cwd):'—',br=s&&s.branch?'⎇ '+s.branch:'—';
  $('.tb-cwd').textContent=cwd;$('.tb-sh').textContent=s?s.shell:'—';$('.s-sh').textContent=s?`${s.shell} 5.9`:'—';$('.s-cwd').textContent=cwd;$('.s-br').textContent=br;
  $('.s-no').textContent=s?`N° 0${pad(s.no+11)}-${String.fromCharCode(64+((s.no-1)%26)+1)}`:'N° 000';$('.g-li').textContent=backend()?'pty':'mock';
  $('.pl-v').textContent=st.kimi?'KIMI':'OFF';$('.pl-v').classList.toggle('on',!!st.kimi);tickUp()};
const syncFoot=()=>{const s=act();$('.ft-st').textContent=!s?'—':s.ended?'TERMINÉ':st.kimi?'PILOTE · KIMI':s.running?'EN ROUTE':'PRÊT';
  $('.ft-sz').textContent=`${st.cols}×${st.rows}`;$('.g-sz').textContent=`${st.cols}×${st.rows}`};
const renderJournal=()=>{$('.jr-l').innerHTML=st.journal.slice(0,6).map(j=>`<p class="${j.code?'bad':''}"><span>${j.t}</span><b>${esc(j.cmd)}</b><i>${j.code?'✕ '+j.code:'✓'}</i></p>`).join('')||'<p class="nil"><span>—</span><b>还没有检票</b></p>'};
const journal=(s,cmd,code)=>{const d=new Date(Date.now());st.journal.unshift({t:`${pad(d.getHours())}:${pad(d.getMinutes())}`,cmd,code});st.nCmd++;renderJournal();tickDate()};
const renderAll=()=>{st.sessions.forEach(s=>s.dirty=true);renderTabs();renderPanes();syncInfo();measure()};

/* ---------------------------------------------------------------- input / line editing */
const focusKb=()=>{if(!st.open)return;if(document.activeElement!==kb)kb.focus({preventScroll:true})};
const placeKb=()=>{const p=PANES()[st.split?st.focus:0];const c=p&&p.querySelector('.cu');if(!c)return;const r=c.getBoundingClientRect(),R=root.getBoundingClientRect();kb.style.left=(r.left-R.left)+'px';kb.style.top=(r.top-R.top)+'px'};
const setInput=(s,v,c)=>{s.input=v;s.caret=c==null?v.length:Math.max(0,Math.min(v.length,c));s.ghost=ghostOf(s);s.dirty=true;sched()};
const ghostOf=s=>{if(!s.input||s.caret!==s.input.length)return '';const m=CMDS.find(c=>c.startsWith(s.input)&&c!==s.input);return m?m.slice(s.input.length):''};
const complete=s=>{const v=s.input;const parts=v.split(' ');
  if(parts.length===1){const m=CMDS.filter(c=>c.startsWith(v));if(m.length===1)return setInput(s,m[0]+(m[0].includes(' ')?'':' '));
    if(m.length>1){const pre=m.reduce((a,c)=>{let i=0;while(i<a.length&&a[i]===c[i])i++;return a.slice(0,i)});if(pre.length>v.length)return setInput(s,pre);echoList(s,m)}return}
  const m=CMDS.filter(c=>c.startsWith(v));if(m.length===1)return setInput(s,m[0]);
  /* path completion against the mock fs */
  const last=parts[parts.length-1],dir=last.includes('/')?last.slice(0,last.lastIndexOf('/')+1):'',base=last.slice(dir.length);
  const l=FS[resolve(s.cwd,dir||'.')]||[];const c=l.filter(x=>x.startsWith(base)&&(base.startsWith('.')||!x.startsWith('.')));
  if(c.length===1){parts[parts.length-1]=dir+c[0];setInput(s,parts.join(' ')+(c[0].endsWith('/')?'':' '))}else if(c.length>1)echoList(s,c)};
const echoList=(s,m)=>{newLine(s,'cmd',{cmd:s.input,cwd:s.cwd,br:s.branch});s.cur=null;write(s,m.map(x=>x.endsWith('/')?`${A.b}${A.blu}${x}${A.rs}`:x).join('    ')+'\r\n');sched()};
const submit=(s,o={})=>{if(!s||s.ended)return;const line=s.input;
  newLine(s,'cmd',{cmd:line,cwd:s.cwd,br:s.branch,km:!!o.kimi});s.cur=null;
  if(line.trim()){s.hist=s.hist.filter(h=>h!==line);s.hist.push(line);if(s.hist.length>200)s.hist.shift()}
  s.hi=-1;s.draft='';s.pending=line.trim()?line.trim():null;setInput(s,'');
  s.running={cmd:line,t:now()};punch();
  if(line.trim()==='clear'){/* clear rolls the paper even when a backend runs the shell */}
  if(!req('terminal.input',{id:s.id,data:line+'\r'}))MOCK.run(s,line);
  else if(line.trim()==='clear')clearPane(s);
  renderTabs();syncFoot()};
const ctrlC=s=>{if(!s)return;if(st.kimi&&st.kimi.s===s){kimiStop(true);return}
  if(s.running){if(!req('terminal.input',{id:s.id,data:'\x03'}))MOCK.input(s,'\x03');return}
  newLine(s,'cmd',{cmd:s.input+'^C',cwd:s.cwd,br:s.branch});s.cur=null;setInput(s,'')};
kb.addEventListener('keydown',e=>{if(!st.open)return;const s=act();if(!s){return}
  if(e.isComposing||e.keyCode===229)return;
  if(st.kimi&&st.kimi.s===s){if(e.ctrlKey&&e.key.toLowerCase()==='c'){e.preventDefault();e.stopPropagation();kimiStop(true)}else{e.preventDefault();e.stopPropagation()}return}
  const k=e.key,mod=e.metaKey||e.ctrlKey;
  if(mod&&(k==='c'||k==='C')&&e.metaKey||(e.ctrlKey&&e.shiftKey&&(k==='C'||k==='c'))){if(copySel()){e.preventDefault();e.stopPropagation()}return}
  if(e.ctrlKey&&(k==='c'||k==='C')){e.preventDefault();e.stopPropagation();if(copySel())return;ctrlC(s);return}
  if(mod&&(k==='v'||k==='V'))return;   /* paste lands in the textarea → input event */
  if(mod&&!e.shiftKey&&(k==='a'||k==='A')&&e.metaKey)return;
  e.stopPropagation();
  if(s.ended){if(k==='Enter')e.preventDefault();return}
  if(s.running){e.preventDefault();const map={Enter:'\r',Backspace:'\x7f',Tab:'\t',ArrowUp:'\x1b[A',ArrowDown:'\x1b[B',ArrowRight:'\x1b[C',ArrowLeft:'\x1b[D'};
    const d=map[k]||(k.length===1&&!mod?k:e.ctrlKey&&k.length===1?String.fromCharCode(k.toUpperCase().charCodeAt(0)-64):'');
    if(d&&!req('terminal.input',{id:s.id,data:d}))MOCK.input(s,d);return}
  const v=s.input,c=s.caret;
  if(k==='Enter'){e.preventDefault();submit(s);return}
  if(k==='Tab'){e.preventDefault();if(s.ghost&&!v.includes(' ')&&!CMDS.filter(x=>x.startsWith(v)).slice(1).length)setInput(s,v+s.ghost);else complete(s);return}
  if(k==='Backspace'){e.preventDefault();if(c>0)setInput(s,v.slice(0,c-1)+v.slice(c),c-1);return}
  if(k==='Delete'){e.preventDefault();setInput(s,v.slice(0,c)+v.slice(c+1),c);return}
  if(k==='ArrowLeft'){e.preventDefault();setInput(s,v,c-1);return}
  if(k==='ArrowRight'){e.preventDefault();if(c===v.length&&s.ghost)setInput(s,v+s.ghost);else setInput(s,v,c+1);return}
  if(k==='Home'||(e.ctrlKey&&k==='a')){e.preventDefault();setInput(s,v,0);return}
  if(k==='End'||(e.ctrlKey&&k==='e')){e.preventDefault();setInput(s,v,v.length);return}
  if(e.ctrlKey&&k==='u'){e.preventDefault();setInput(s,v.slice(c),0);return}
  if(e.ctrlKey&&k==='w'){e.preventDefault();const a=v.slice(0,c).replace(/\S+\s*$/,'');setInput(s,a+v.slice(c),a.length);return}
  if(k==='ArrowUp'||k==='ArrowDown'){e.preventDefault();if(!s.hist.length)return;if(s.hi===-1){if(k==='ArrowDown')return;s.draft=v;s.hi=s.hist.length}
    s.hi+=k==='ArrowUp'?-1:1;if(s.hi<0)s.hi=0;if(s.hi>=s.hist.length){s.hi=-1;setInput(s,s.draft);return}setInput(s,s.hist[s.hi]);return}
  if(k.length===1&&!mod){e.preventDefault();setInput(s,v.slice(0,c)+k+v.slice(c),c+1);return}});
kb.addEventListener('input',()=>{const s=act();const t=kb.value;kb.value='';if(!s||!t||s.ended||(st.kimi&&st.kimi.s===s))return;
  if(s.running){if(!req('terminal.input',{id:s.id,data:t}))MOCK.input(s,t);return}
  const one=t.replace(/\r?\n/g,' ');setInput(s,s.input.slice(0,s.caret)+one+s.input.slice(s.caret),s.caret+one.length)});
const copySel=()=>{const sel=getSelection();const t=sel&&!sel.isCollapsed&&paper.contains(sel.anchorNode)?sel.toString():'';if(!t)return false;
  try{navigator.clipboard&&navigator.clipboard.writeText(t)}catch(e){}toast(`<em>Copié</em>已复制 ${t.length} 个字符`);return true};
let toastT=0;const toast=h=>{let e=$('.tm-toast');if(!e){e=document.createElement('div');e.className='tm-toast';root.appendChild(e)}e.innerHTML=h;
  if(!RM.matches)e.animate([{opacity:0,transform:'translate(-50%,6px)'},{opacity:1,transform:'translate(-50%,0)'}],{duration:240,easing:'ease-out'});
  clearTimeout(toastT);toastT=setTimeout(()=>{if(e.isConnected)e.remove()},2000)};

/* page-level shortcuts while open. Registered from <head> (build_rococo_v2.py NORM: window capture, before search's own capture
   listener for ⌘K), so ⌘K clears the paper instead of opening search; returns true when it handled the key */
window.__tmKey=e=>{if(!st.open)return false;const k=(e.key||'').toLowerCase(),mod=e.metaKey||e.ctrlKey;
  if(e.key==='Escape'){if(renaming)return false;if(root.classList.contains('find'))closeFind();else focusKb();return true}
  if(!mod||e.altKey)return false;
  if(k==='k'||(e.ctrlKey&&k==='l')){const s=act();if(s)clearPane(s);return true}
  if((k==='d'&&e.metaKey)||(e.ctrlKey&&e.shiftKey&&k==='d')){setSplit(!st.split);return true}
  if(k==='f'){openFind();return true}
  if(k==='t'&&(e.metaKey||e.shiftKey)){newSession();return true}
  if(k==='w'&&e.metaKey){const s=act();if(s)closeSession(s.id);return true}
  return false};

/* ---------------------------------------------------------------- tabs: switch / rename / close / new */
tabsEl.addEventListener('click',e=>{const t=e.target.closest('.tb');if(!t)return;if(e.target.closest('.x')){closeSession(t.dataset.id);return}if(e.target.closest('[contenteditable]'))return;switchTo(t.dataset.id)});
tabsEl.addEventListener('dblclick',e=>{const nm=e.target.closest('.tb .nm');if(nm)startRename(nm)});
tabsEl.addEventListener('keydown',e=>{const t=e.target.closest('.tb');if(!t||e.target.closest('[contenteditable]'))return;if(e.key==='Enter'){e.preventDefault();switchTo(t.dataset.id)}if(e.key==='F2'){e.preventDefault();startRename(t.querySelector('.nm'))}});
const startRename=nm=>{const id=nm.closest('.tb').dataset.id,s=S(id);if(!s)return;renaming=nm;nm.contentEditable='plaintext-only';nm.classList.add('ed');nm.focus();
  const r=document.createRange();r.selectNodeContents(nm);const sel=getSelection();sel.removeAllRanges();sel.addRange(r);
  const fin=ok=>{nm.removeEventListener('blur',onB);nm.removeEventListener('keydown',onK);renaming=null;const v=nm.textContent.trim().slice(0,24);
    if(ok&&v&&v!==s.name){s.name=v;req('terminal.rename',{id,name:v})}renderTabs();renderPanes();focusKb()};
  const onB=()=>fin(true),onK=ev=>{ev.stopPropagation();if(ev.key==='Enter'){ev.preventDefault();fin(true)}else if(ev.key==='Escape'){ev.preventDefault();nm.textContent=s.name;fin(false)}};
  nm.addEventListener('blur',onB);nm.addEventListener('keydown',onK)};
const switchTo=id=>{if(!S(id))return;if(id===st.active&&(!st.split||st.focus===0)){focusKb();return}if(st.split&&id===st.pane2){st.focus=1}else{st.active=id;st.focus=0;if(st.split&&st.pane2===id){st.pane2=st.sessions.find(s=>s.id!==id)?.id||null}}
  const s=S(id);s.dirty=true;renderTabs();renderPanes();syncInfo();focusKb();
  if(!RM.matches){const t=tabsEl.querySelector(`.tb[data-id="${id}"]`);if(t)t.animate([{transform:'translateY(3px)'},{transform:'translateY(-1px)',offset:.6},{transform:'none'}],{duration:280,easing:'ease-out'});
    const p=PANES()[st.focus];if(p&&!st.split)p.querySelector('.sc').animate([{opacity:.35,transform:'translateX(10px)'},{opacity:1,transform:'none'}],{duration:260,easing:'cubic-bezier(.2,.8,.3,1)'})}};
const closeSession=id=>{const s=S(id);if(!s)return;const t=MOCK.timers.get(id);if(t){t.tms.forEach(clearTimeout);MOCK.timers.delete(id)}req('terminal.kill',{id});if(st.kimi&&st.kimi.s===s)kimiStop(false);
  const el=tabsEl.querySelector(`.tb[data-id="${id}"]`);
  const fin=()=>{const i=st.sessions.indexOf(s);st.sessions.splice(i,1);if(st.active===id)st.active=(st.sessions[Math.min(i,st.sessions.length-1)]||{}).id||null;
    if(st.pane2===id||st.sessions.length<2){st.split=false;st.pane2=null;st.focus=0}if(st.active===st.pane2){st.split=false;st.pane2=null}stopReel(s);renderAll();focusKb()};
  if(el&&!RM.matches)el.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-14px) rotate(-4deg)'}],{duration:240,easing:'ease-in',fill:'forwards'}).onfinish=fin;else fin()};
const newSession=(o={})=>{const s=mkSession(o);st.sessions.push(s);
  const handled=req('terminal.create',{id:s.id,shell:s.shell,cwd:s.cwd});
  if(!handled){write(s,`${A.gry}Last login: ${new Date(Date.now()).toDateString()} on ttys00${s.no}${A.rs}\r\n`)}
  s.cur=null;st.active=s.id;st.focus=0;if(st.split&&st.pane2===s.id)st.pane2=null;renderAll();if(!o.quiet)printTicket(s);focusKb();measure();return s};
$('.tb-new').addEventListener('click',()=>newSession());
$('.em-b').addEventListener('click',()=>newSession());
$('.cm-l').addEventListener('click',e=>{const c=e.target.closest('.cm');if(!c)return;const s=act();if(!s||s.running||s.ended)return;setInput(s,c.dataset.c);focusKb()});
paper.addEventListener('mousedown',e=>{if(e.target.closest('.tm-find,.tm-empty'))return;setTimeout(()=>{const sel=getSelection();if(!sel||sel.isCollapsed)focusKb()},0)});

/* ---------------------------------------------------------------- split (⌘D) */
const setSplit=on=>{if(on===st.split)return;if(on){let o=st.sessions.find(s=>s.id!==st.active);if(!o){o=newSession({quiet:true});st.active=st.sessions[0].id}st.pane2=o.id;st.split=true;st.focus=1}
  else{st.split=false;st.pane2=null;st.focus=0}
  st.sessions.forEach(s=>s.dirty=true);renderTabs();renderPanes();measure();focusKb();
  if(!RM.matches&&on){const p=PANES()[1];if(p)p.animate([{opacity:0,clipPath:'inset(0 0 0 100%)'},{opacity:1,clipPath:'inset(0 0 0 0)'}],{duration:420,easing:'cubic-bezier(.2,.8,.25,1)'})}};

/* ---------------------------------------------------------------- find (⌘F) */
const openFind=()=>{root.classList.add('find');fq.focus();fq.select();if(!RM.matches)findEl.animate([{opacity:0,transform:'translateY(-6px)'},{opacity:1,transform:'none'}],{duration:200,easing:'ease-out'})};
const closeFind=()=>{root.classList.remove('find');st.find='';fq.value='';st.sessions.forEach(s=>s.dirty=true);renderPanes();focusKb()};
const runFind=(dir=0)=>{st.find=fq.value;st.sessions.forEach(s=>s.dirty=true);renderPanes();const p=PANES()[st.split?st.focus:0];const ms=p?[...p.querySelectorAll('mark')]:[];
  if(!ms.length){$('.fd-n').textContent='0/0';return}st.findI=dir?((st.findI+dir+ms.length)%ms.length):ms.length-1;ms.forEach((m,i)=>m.classList.toggle('cur',i===st.findI));
  const s=act();if(s)s.stick=false;ms[st.findI].scrollIntoView({block:'center'});$('.fd-n').textContent=`${st.findI+1}/${ms.length}`};
fq.addEventListener('input',()=>runFind(0));
fq.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();runFind(e.shiftKey?-1:1)}else if(e.key==='Escape'){e.preventDefault();closeFind()}});
$('.fd-p').addEventListener('click',()=>runFind(-1));$('.fd-x').addEventListener('click',closeFind);

/* ---------------------------------------------------------------- motion: entrance, punch, print, reel, roll, stars */
const SIDES=()=>$$('.tm-in');
const flashStar=(el,dl=0)=>{if(RM.matches||!el)return;el.animate([{opacity:0,transform:'scale(.2) rotate(-30deg)'},{opacity:1,transform:'scale(1.25) rotate(8deg)',offset:.45},{opacity:1,transform:'scale(1) rotate(0deg)'}],{duration:620,delay:dl,easing:'cubic-bezier(.3,1.4,.5,1)',fill:'backwards'})};
const stick=(dl)=>{$$('.tk .ob').forEach((e,i)=>{e.getAnimations().forEach(a=>{if(a.id!=='spin')a.cancel()});const d=dl+i*70;const r=getComputedStyle(e).getPropertyValue('--r');
  e.animate([{opacity:0,transform:`perspective(700px) rotate(${r}) rotateX(26deg) rotateY(-18deg) scale(1.12) translateY(-8px)`,filter:'drop-shadow(0 18px 16px rgba(70,85,125,.32))'},
    {opacity:1,offset:.45},{opacity:1,transform:`perspective(700px) rotate(${r}) rotateX(-2deg) rotateY(1deg) scale(.995)`,filter:'drop-shadow(0 2px 1.5px rgba(70,85,125,.30))',offset:.82},
    {opacity:1,transform:`perspective(700px) rotate(${r})`,filter:'drop-shadow(0 1.5px 1px rgba(70,85,125,.28))'}],{duration:520,delay:d,easing:'cubic-bezier(.34,1.3,.64,1)',fill:'backwards'})})};
const enter=(o={})=>{const q=o.instant||RM.matches;
  [bill,$('.tm-tabs'),paper,$('.tm-foot'),...SIDES()].forEach(e=>e.getAnimations().forEach(a=>a.cancel()));
  if(q){[stage,...SIDES()].forEach(e=>e.animate([{opacity:0},{opacity:1}],{duration:RM.matches?300:1,fill:'both'}));return}
  stage.animate([{opacity:1},{opacity:1}],{duration:1,fill:'both'});
  bill.animate([{opacity:0,transform:'translateX(160px) rotate(1.2deg)'},{opacity:1,offset:.35},{opacity:1,transform:'translateX(-6px) rotate(-.2deg)',offset:.78},{opacity:1,transform:'none'}],{duration:640,easing:'cubic-bezier(.2,.85,.25,1)',fill:'backwards'});
  stick(380);
  $$('.stars .st').forEach((e,i)=>flashStar(e,1080+i*130));
  [$('.tk-t'),$('.tk-bar'),$('.tk-no')].forEach((e,i)=>e.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:420,delay:860+i*90,easing:'ease-out',fill:'backwards'}));
  $('.tk-t').animate([{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],{duration:620,delay:860,easing:'cubic-bezier(.3,.6,.3,1)',fill:'backwards'});
  [$('.tm-tabs'),paper,$('.tm-foot')].forEach((e,i)=>e.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:520,delay:240+i*70,easing:'cubic-bezier(.25,.8,.3,1)',fill:'backwards'}));
  SIDES().forEach((e,i)=>e.animate([{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'none'}],{duration:520,delay:200+i*45,easing:'cubic-bezier(.25,.8,.3,1)',fill:'backwards'}))};
const punch=()=>{if(RM.matches)return;const p=PANES()[st.split?st.focus:0];if(!p)return;requestAnimationFrame(()=>{const c=[...p.querySelectorAll('.ln.cmd')].pop();if(!c)return;const h=c.querySelector('.hole');if(!h)return;
  h.animate([{transform:'scale(0)',opacity:0},{transform:'scale(1.45)',opacity:1,offset:.45},{transform:'scale(1)',opacity:1}],{duration:300,easing:'cubic-bezier(.3,1.5,.5,1)'});
  const chip=document.createElement('i');chip.className='chip';h.parentNode.appendChild(chip);
  chip.animate([{opacity:1,transform:'translate(0,0) rotate(0)'},{opacity:0,transform:'translate(5px,22px) rotate(140deg)'}],{duration:520,easing:'cubic-bezier(.5,0,.8,.6)'}).onfinish=()=>chip.remove();
  c.querySelector('.pt').animate([{transform:'translateY(0)'},{transform:'translateY(1.5px) scale(.98)',offset:.3},{transform:'none'}],{duration:240,easing:'ease-out'})})};
let spin=null,spinOwner=null;
const startReel=s=>{spinOwner=s.id;renderTabs();syncFoot();if(RM.matches)return;if(spin)spin.cancel();
  spin=reelEl.animate([{transform:'rotate(0deg)'},{transform:'rotate(360deg)'}],{duration:2600,iterations:Infinity,easing:'linear'});spin.id='spin';
  reelEl.classList.add('on')};
const stopReel=(s,flash)=>{if(!s||spinOwner!==s.id)return;spinOwner=null;renderTabs();syncFoot();reelEl.classList.remove('on');if(!spin)return;
  let a=0;try{a=((spin.currentTime||0)%2600)/2600*360}catch(e){}spin.cancel();spin=null;if(RM.matches)return;
  reelEl.animate([{transform:`rotate(${a}deg)`},{transform:`rotate(${a+70}deg)`}],{duration:900,easing:'cubic-bezier(.2,.7,.3,1)',fill:'forwards'}).id='spin';
  if(flash){const r=reelEl.getBoundingClientRect(),R=tMain.getBoundingClientRect();let e=$('.stars .st.rs');
    if(!e){e=document.createElement('i');e.className='st rs';e.innerHTML=STAR(14);starsEl.appendChild(e)}e.style.left=(r.left-R.left+r.width*.5)+'px';e.style.top=(r.top-R.top+r.height*.62)+'px';
    e.animate([{opacity:0,transform:'scale(.2) rotate(-40deg)'},{opacity:1,transform:'scale(1.35) rotate(10deg)',offset:.4},{opacity:1,transform:'scale(1)',offset:.75},{opacity:0,transform:'scale(.85)'}],{duration:1500,delay:600,easing:'cubic-bezier(.3,1.3,.5,1)',fill:'both'})}};
const clearPane=s=>{const i=st.split&&st.pane2===s.id?1:0;const p=PANES()[i];
  if(p&&!RM.matches&&s.lines.length){const sc=p.querySelector('.sc');const r=sc.getBoundingClientRect(),P=p.getBoundingClientRect();
    const roll=document.createElement('div');roll.className='roll';roll.style.cssText=`left:${r.left-P.left}px;top:${r.top-P.top}px;width:${r.width}px;height:${r.height}px`;
    roll.innerHTML=`<div class="rp">${sc.querySelector('.ls').innerHTML}${sc.querySelector('.pr').outerHTML}</div><i class="cyl"></i>`;p.appendChild(roll);const rp=roll.querySelector('.rp');rp.scrollTop=1e6;
    const D=720;rp.animate([{transform:'none',clipPath:'inset(0 0 0 0)'},{transform:`translateY(-${r.height*.92}px) perspective(600px) rotateX(38deg) scaleY(.6)`,clipPath:`inset(0 0 ${r.height*.0}px 0)`,opacity:.15}],{duration:D,easing:'cubic-bezier(.55,0,.3,1)',fill:'forwards'});
    roll.querySelector('.cyl').animate([{transform:`translateY(${r.height}px)`,opacity:0},{opacity:1,offset:.12},{transform:'translateY(-30px)',opacity:1,offset:.9},{transform:'translateY(-40px)',opacity:0}],{duration:D,easing:'cubic-bezier(.55,0,.3,1)',fill:'forwards'});
    setTimeout(()=>roll.remove(),D+40);
    sc.animate([{opacity:0,transform:'translateY(18px)'},{opacity:0,offset:.45},{opacity:1,transform:'none'}],{duration:D+160,easing:'cubic-bezier(.2,.8,.3,1)'})}
  s.lines=[];s.cur=null;s.dirty=true;s.stick=true;sched()};
const printTicket=s=>{if(RM.matches||!st.open)return;const t=tabsEl.querySelector(`.tb[data-id="${esc(s.id)}"]`),slot=$('.tb-new .slot');if(!t||!slot)return;
  const R=root.getBoundingClientRect(),a=slot.getBoundingClientRect(),z=t.getBoundingClientRect();
  const c=t.cloneNode(true);c.classList.add('print');c.style.left=(a.left-R.left+a.width/2-z.width/2)+'px';c.style.top=(a.top-R.top+3)+'px';root.appendChild(c);t.style.visibility='hidden';
  const dx=z.left-(a.left+a.width/2-z.width/2),dy=z.top-(a.top+3);
  const an=c.animate([{clipPath:'inset(0 0 100% 0)',transform:'none'},{clipPath:'inset(0 0 66% 0)',offset:.12},{clipPath:'inset(0 0 33% 0)',offset:.24},{clipPath:'inset(0 0 0 0)',transform:'translateY(0)',offset:.36},
    {clipPath:'inset(0 0 0 0)',transform:'translateY(5px) rotate(-4deg)',offset:.5},{clipPath:'inset(0 0 0 0)',transform:'translateY(9px) rotate(-2deg)',offset:.6},
    {clipPath:'inset(0 0 0 0)',transform:`translate(${dx}px,${dy}px) rotate(0deg)`}],{duration:1150,easing:'cubic-bezier(.3,.6,.3,1)',fill:'forwards'});
  const tear=document.createElement('i');tear.className='tearln';tear.style.left=(a.left-R.left+a.width/2-z.width/2)+'px';tear.style.top=(a.top-R.top+3)+'px';tear.style.width=z.width+'px';root.appendChild(tear);
  tear.animate([{opacity:0},{opacity:0,offset:.36},{opacity:1,offset:.42},{opacity:0,transform:'translateY(-4px)',offset:.62},{opacity:0}],{duration:1150,fill:'forwards'});
  slot.animate([{transform:'scaleX(1)'},{transform:'scaleX(1.25)',offset:.1},{transform:'scaleX(1)',offset:.4}],{duration:1150});
  an.onfinish=()=>{c.remove();tear.remove();const tt=tabsEl.querySelector(`.tb[data-id="${esc(s.id)}"]`);if(tt)tt.style.visibility=''}};

/* ---------------------------------------------------------------- Kimi takes the wheel (fountain-pen nib agent cursor, distinct from her butterfly) */
const NIB=`<svg class="tm-nib" width="42" height="42" viewBox="0 0 34 34" aria-hidden="true"><defs><linearGradient id="tmNib" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#E4E9F2"/><stop offset="1" stop-color="#B9C4D8"/></linearGradient></defs>
  <g transform="rotate(45 3 3)"><path d="M3 3 L9.4 -0.6 Q13.8 -3.4 19.5 -5.6 L27 -5.6 Q31 -3.8 31.4 3 Q31 9.8 27 11.6 L19.5 11.6 Q13.8 9.4 9.4 6.6 Z" fill="url(#tmNib)" stroke="#2E3B68" stroke-width=".9" stroke-linejoin="round"/>
  <path d="M3.6 3 H15.2" stroke="#2E3B68" stroke-width=".8"/><circle cx="16.6" cy="3" r="1.25" fill="#FFFFFF" stroke="#2E3B68" stroke-width=".8"/>
  <path d="M21 -2.6 Q24 3 21 8.6 M24.6 -3.6 Q28.2 3 24.6 9.6" fill="none" stroke="#7C93BA" stroke-width=".6"/></g></svg>`;
root.insertAdjacentHTML('beforeend',`<div class="tm-ag" aria-hidden="true">${NIB}<p class="ag-cap"><em>Pilote</em><b>Kimi 正在输入</b></p></div>`);
const ag=$('.tm-ag'),agCap=$('.ag-cap');
const nibAt=()=>{const p=PANES()[st.split?st.focus:0];const c=p&&(p.querySelector('.pr .cu')||p.querySelector('.pr'));if(!c)return null;const r=c.getBoundingClientRect(),R=root.getBoundingClientRect();return [r.left-R.left+2,r.top-R.top+r.height-2]};
let agX=1100,agY=420;
const nibTo=(x,y,ms)=>new Promise(res=>{const x0=agX,y0=agY,t0=now();const f=()=>{const u=Math.min(1,(now()-t0)/ms),e=u*u*(3-2*u);agX=x0+(x-x0)*e;agY=y0+(y-y0)*e-Math.sin(Math.PI*e)*Math.min(30,Math.hypot(x-x0,y-y0)*.08);
  ag.style.transform=`translate(${agX.toFixed(1)}px,${agY.toFixed(1)}px)`;if(u<1&&st.kimi)requestAnimationFrame(f);else res()};ms&&!RM.matches?requestAnimationFrame(f):(agX=x,agY=y,ag.style.transform=`translate(${x}px,${y}px)`,res())});
const wait=ms=>new Promise(r=>setTimeout(r,RM.matches?Math.min(ms,40):ms));
const PLAN_K=['git status','git log --oneline -n 3','echo "✦ 工作区干净，最近 3 次提交已核对"'];
const kimiGo=async s=>{if(st.kimi||!s)return;st.kimi={s,t:now()};root.classList.add('kimi');syncInfo();syncFoot();s.dirty=true;renderPanes();
  const P=nibAt()||[600,600];agX=P[0]+260;agY=P[1]-200;ag.style.transform=`translate(${agX}px,${agY}px)`;
  if(!RM.matches)ag.animate([{opacity:0},{opacity:1}],{duration:260,fill:'forwards'});else ag.style.opacity='1';
  for(const cmd of PLAN_K){if(!st.kimi)return;let q=nibAt();if(q)await nibTo(q[0],q[1],700);await wait(260);
    for(const ch of cmd){if(!st.kimi)return;setInput(s,s.input+ch);await wait(52+((ch.charCodeAt(0)*37)%45));q=nibAt();if(q){agX=q[0];agY=q[1];ag.style.transform=`translate(${agX}px,${agY}px)`}}
    await wait(320);if(!st.kimi)return;submit(s,{kimi:true});
    if(!RM.matches)ag.animate([{transform:ag.style.transform+' translateY(0)'},{transform:ag.style.transform+' translateY(4px)',offset:.4},{transform:ag.style.transform}],{duration:220});
    let g=0;while(s.running&&g++<80)await wait(60);await wait(520)}
  if(st.kimi)kimiStop(false,true)};
const kimiStop=(user,done)=>{const s=st.kimi&&st.kimi.s;st.kimi=null;root.classList.remove('kimi');if(s){if(user){write(s,`\r\n`);s.input='';s.caret=0}
    write(s,`${A.cya}✦ Kimi${A.rs} ${A.gry}${user?'已停下，控制权交还给你':'完成，控制权交还给你'}${A.rs}\r\n`);s.dirty=true}
  if(!RM.matches)ag.animate([{opacity:1},{opacity:0,transform:ag.style.transform+' translate(40px,-30px)'}],{duration:380,fill:'forwards'});else ag.style.opacity='0';
  syncInfo();syncFoot();sched();focusKb()};

/* ---------------------------------------------------------------- size → cols/rows (terminal.resize) */
const measure=()=>{const p=PANES()[0];if(!p||!st.open||!st.sessions.length)return;const sc=p.querySelector('.sc');const pr=document.createElement('span');pr.className='mw';pr.textContent='M'.repeat(20);sc.appendChild(pr);
  const cw=pr.getBoundingClientRect().width/20||7.8;pr.remove();const cols=Math.max(20,Math.floor((sc.clientWidth-8)/cw)),rows=Math.max(5,Math.floor(sc.clientHeight/21));
  if(cols!==st.cols||rows!==st.rows){st.cols=cols;st.rows=rows;st.sessions.forEach(s=>req('terminal.resize',{id:s.id,cols,rows}))}syncFoot()};
addEventListener('resize',()=>{if(st.open)measure()});

/* ---------------------------------------------------------------- date / uptime */
const tickDate=()=>{const d=new Date(Date.now());$('.tm-date em').textContent=W[d.getDay()];$('.tm-date b').innerHTML=`${d.getDate()} <small>${M[d.getMonth()]} ${d.getFullYear()}</small>`;
  $('.tm-dsub').innerHTML=`${st.sessions.length} BILLETS · ${st.nCmd} CMDS · <i>${pad(d.getHours())}:${pad(d.getMinutes())}</i>`;$('.tm-pm .pt').textContent=`${pad(d.getHours())}:${pad(d.getMinutes())}`};
const tickUp=()=>{const s=act()||S(st.active);if(!s){$('.s-up').textContent='—';return}const u=Math.max(0,Math.floor((now()-s.started)/1000));$('.s-up').textContent=`${pad(Math.floor(u/3600))}:${pad(Math.floor(u/60)%60)}:${pad(u%60)}`};
setInterval(()=>{if(st.open){tickUp();tickDate()}},1000);

/* ---------------------------------------------------------------- open / close (whole page, like 收藏 / 浏览器) */
const open=(o={})=>{if(st.open)return;st.open=true;
  if(window.__rp&&window.__rp.isOpen)window.__rp.close();
  root.classList.add('on');root.setAttribute('aria-hidden','false');b.classList.add('tm-on');
  renderAll();tickDate();renderJournal();enter(o);setTimeout(()=>{measure();focusKb()},o.instant?0:420)};
const close=(o={})=>{if(!st.open)return;st.open=false;if(st.kimi)kimiStop(false);if(document.activeElement===kb||document.activeElement===fq)document.activeElement.blur();
  const q=o.quick||RM.matches;const els=[stage,...SIDES()];
  els.forEach(e=>{e.getAnimations().forEach(a=>a.cancel());e.animate([{opacity:1},{opacity:0}],{duration:q?160:320,easing:'ease-in',fill:'both'})});
  setTimeout(()=>{if(st.open)return;root.classList.remove('on');root.setAttribute('aria-hidden','true');b.classList.remove('tm-on');els.forEach(e=>e.getAnimations().forEach(a=>a.cancel()))},q?200:360)};

/* ---------------------------------------------------------------- seed + api + scene hashes */
const seed=()=>{const a=mkSession({ago:754}),c=mkSession({ago:312,name:'serveur'}),d=mkSession({ago:48,name:'notes',cwd:HOME+'/notes',branch:''});st.sessions=[a,c,d];st.active=a.id;
  write(a,`${A.gry}Last login: Wed Oct 28 09:58:12 on ttys001${A.rs}\r\n`);
  const run=(s,cmd)=>{newLine(s,'cmd',{cmd,cwd:s.cwd,br:s.branch});s.cur=null;s.hist.push(cmd);s.pending=cmd;MOCK.run(s,cmd)};
  run(a,'ls');run(a,'git status');run(c,'pwd');run(d,'ls');
  st.journal=[];st.nCmd=0;
  [['10:31','git status',0],['10:30','ls',0],['10:24','npm test',1],['10:12','cd src',0]].forEach(([t,cmd,code])=>{st.journal.push({t,cmd,code});st.nCmd++})};
if(has('terminal-empty'))st.sessions=[];else seed();
window.__terminal={emit,open,close,toggle:()=>st.open?close():open(),get isOpen(){return st.open},
  newSession:o=>newSession(o||{}),closeSession,switchTo,split:v=>setSplit(v==null?!st.split:!!v),clear:()=>{const s=act();if(s)clearPane(s)},
  type:(t,enter)=>{const s=act();if(!s)return;setInput(s,s.input+t);if(enter)submit(s)},run:c=>{const s=act();if(!s)return;setInput(s,c);submit(s)},
  interrupt:()=>ctrlC(act()),kimi:()=>{const s=act();if(s){setInput(s,'kimi');submit(s)}},find:q=>{openFind();fq.value=q||'';runFind(0)},
  get state(){const s=act();return {open:st.open,count:st.sessions.length,active:st.active,focus:st.focus,split:st.split,pane2:st.pane2,kimi:!!st.kimi,find:st.find,cols:st.cols,rows:st.rows,
    running:!!(s&&s.running),spinning:!!spin,input:s?s.input:'',cwd:s?s.cwd:'',ended:!!(s&&s.ended),names:st.sessions.map(x=>x.name),lines:s?s.lines.length:0,
    text:s?s.lines.slice(-40).map(L=>L.k==='cmd'?'❯ '+L.cmd:L.k==='mark'?L.t:L.segs.map(g=>g.t).join('')).join('\n'):''}},
  onRequest:null};
const boot=()=>{
  if(['terminal','terminal-run','terminal-split','terminal-kimi','terminal-empty','terminal-play','soon-terminal'].some(has)){
    if(window.__rail2)window.__rail2.show();
    open({instant:has('terminal-split')||has('terminal-empty')});
    if(has('terminal-split'))setTimeout(()=>setSplit(true),80);
    if(has('terminal-run'))setTimeout(()=>window.__terminal.run('npm run dev'),RM.matches?100:1500);
    if(has('terminal-kimi'))setTimeout(()=>window.__terminal.kimi(),RM.matches?100:1500)}};
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(boot,140))));
})();
