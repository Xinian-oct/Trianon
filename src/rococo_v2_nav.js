(()=>{
/* ===================================================================================================
   rococo v2 合并版 · 导航 — one app: the die-cut tag rail switches between the pages that were built separately.
     新的对话 / 历史 / 模型   rococo_v1 as approved (chat page)
     文件                     files_v2  file panel / @ picker            (window.__files)
     外观 / 账户 / 设置(竖琴)  settings_v3 #appearance / #account / 权限·引擎 (window.__set)
     引擎状态                  engine_v2 overlays on the chat page          (window.__eng.emit stays the entry)
     搜索                      state #9 search overlay (rococo_v2_search.js, window.__search) — 2026-10-27 13:50
     浏览器                    state #10 built-in browser page (rococo_v2_browser.js, window.__browser) — 2026-10-27 17:40, 11th tag
     收藏                      state #11 collection album page (rococo_v2_collection.js, window.__collection) — 2026-10-27 23:00
     终端                      state #12 terminal ticket page (rococo_v2_terminal.js, window.__terminal) — 2026-10-28 10:10, whole page like 收藏
   This script owns only the glue: closing the page you leave, which tag is chosen (it follows the page, including the
   section inside settings), keeping the rail out while a page is open, the layer scope classes (body.ly-fl / ly-st / ly-eg)
   that gate each page's few unscoped rules, the coming-soon tag, and the merged #play demo.
   Pages keep their own scene hashes; prefixed forms (files/… set/… eng/… rk/…) are normalised in <head>.
   Extra hashes here: #soon-fav #soon-terminal (#soon-search now opens the real search) #play (merged navigation demo).
   =================================================================================================== */
const b=document.body,rail=document.querySelector('.rail');
const its=[...rail.querySelectorAll('.grp .it')];
const IDX={new:0,history:1,files:2,search:3,terminal:4,model:5,fav:6,look:7,browser:8,account:9,settings:10};
const KEY=Object.fromEntries(Object.entries(IDX).map(([k,v])=>[v,k]));
const CHAT=[0,1,5];
const RM=matchMedia('(prefers-reduced-motion: reduce)');
const HASH=window.__navHash||decodeURIComponent(location.hash.slice(1)).split(/[&,]/).filter(Boolean);
const has=k=>HASH.includes(k);
const F=()=>window.__files,S=()=>window.__set;
const now=()=>performance.now()/1000;
const BR=()=>window.__browser,brOpen=()=>!!(BR()&&BR().isOpen);
const CL=()=>window.__collection,clOpen=()=>!!(CL()&&CL().isOpen);
const TM=()=>window.__terminal,tmOpen=()=>!!(TM()&&TM().isOpen);
const filesOpen=()=>!!(F()&&F().S.open),setOpen=()=>!!(S()&&S().S.open),SR=()=>window.__search,srOpen=()=>!!(SR()&&SR().isOpen);

/* ---------------------------------------------------------------- coming soon tag */
const SOON={
  search:{em:'Chercher',zh:'搜索',line:'会话与消息的检索',line2:'还在装订中'},
  fav:{em:'Trésors',zh:'收藏',line:'收藏的片段与会话',line2:'还在装订中'},
  terminal:{em:'Terminal',zh:'终端',line:'内置终端',line2:'稍后启用'}};
const soonEl=document.createElement('div');soonEl.id='nvSoon';soonEl.setAttribute('role','status');soonEl.setAttribute('aria-live','polite');
soonEl.innerHTML=`<svg class="nv-str" width="60" height="40" aria-hidden="true"><path d="" fill="none" stroke="#B9C3DC" stroke-width="1.1" stroke-linecap="round"/><circle r="2.1" fill="#DCE2F1" stroke="#9DA9C8" stroke-width=".7"/></svg>
<div class="nv-sw"><svg class="nv-shape" width="268" height="132" viewBox="0 0 268 132" aria-hidden="true">
  <path class="o" d="M30 6 H254 Q262 6 262 14 V118 Q262 126 254 126 H30 Q22 126 15 119 L6 104 Q3 99 3 92 V40 Q3 33 6 28 L15 13 Q22 6 30 6 Z"/>
  <path class="i" d="M33 13 H250 Q255 13 255 18 V114 Q255 119 250 119 H33 Q27 119 22 114 L14 101 Q11 97 11 91 V41 Q11 35 14 31 L22 18 Q27 13 33 13 Z"/>
  <circle class="g0" cx="25" cy="66" r="8.2"/><circle class="g1" cx="25" cy="66" r="4.6"/>
  <path class="ln" d="M44 77 H238"/></svg>
  <div class="nv-tx"><p class="nv-h"><em></em><b></b></p><p class="nv-pill"><span>即将推出</span><i>·</i><em>Bientôt</em></p><p class="nv-l"></p></div>
  <i class="nv-star" aria-hidden="true">✦</i></div>`;
b.appendChild(soonEl);
const sw=soonEl.querySelector('.nv-sw'),strP=soonEl.querySelector('.nv-str path'),strK=soonEl.querySelector('.nv-str circle'),strS=soonEl.querySelector('.nv-str');
let soon=null,soonA=null,soonT=0,soonHover=false;
const SOON_MS=4800;
const tagPt=it=>{const r=it.getBoundingClientRect();return [r.right-8,r.top+r.height*.42]};
const placeSoon=()=>{if(!soon)return;const [tx,ty]=tagPt(its[IDX[soon.k]]);const x=Math.round(rail.getBoundingClientRect().right+22),y=Math.round(ty-66);
  sw.style.left=x+'px';sw.style.top=y+'px';
  const gx=x+25,gy=y+66;strS.style.left=Math.min(tx,gx)-4+'px';strS.style.top=Math.min(ty,gy)-14+'px';
  const w=Math.abs(gx-tx)+8,h=Math.abs(gy-ty)+28;strS.setAttribute('width',w);strS.setAttribute('height',h);
  const ax=tx-(Math.min(tx,gx)-4),ay=ty-(Math.min(ty,gy)-14),bx=gx-(Math.min(tx,gx)-4),by=gy-(Math.min(ty,gy)-14);
  strP.setAttribute('d',`M${ax.toFixed(1)} ${ay.toFixed(1)} Q${((ax+bx)/2).toFixed(1)} ${(Math.max(ay,by)+9).toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`);
  strK.setAttribute('cx',ax.toFixed(1));strK.setAttribute('cy',ay.toFixed(1))};
const swing=(amp,n=2.2,z=.18)=>{const f=[],N=36;for(let k=0;k<=N;k++){const u=k/N;const a=amp*Math.exp(-z*u*14)*Math.sin(u*n*2*Math.PI+Math.PI/2);
  f.push({offset:u,transform:`rotate(${(k===N?0:a).toFixed(3)}deg)`,opacity:Math.min(1,u*6)})}return f};
const showSoon=(k,{instant,keep}={})=>{const d=SOON[k];if(!d)return;
  soonEl.querySelector('.nv-h em').textContent=d.em;soonEl.querySelector('.nv-h b').textContent=d.zh;
  soonEl.querySelector('.nv-l').innerHTML=`${d.line}，<span>${d.line2}</span>。`;
  const again=soon&&soon.k===k;soon={k,t:now()};placeSoon();soonEl.classList.add('on');soonEl.classList.remove('out');
  if(soonA)soonA.cancel();
  if(!instant&&!RM.matches)soonA=sw.animate(again?swing(4,1.6,.24):swing(-13),{duration:again?800:1400,easing:'linear'});
  else soonA=null;
  clearTimeout(soonT);if(!instant&&!keep)soonT=setTimeout(function chk(){if(soonHover){soonT=setTimeout(chk,600);return}hideSoon()},SOON_MS);sync()};
const hideSoon=()=>{if(!soon)return;soon=null;clearTimeout(soonT);if(soonA)soonA.cancel();soonEl.classList.add('out');
  if(!RM.matches)soonA=sw.animate([{opacity:1,transform:'rotate(0deg)'},{opacity:0,transform:'rotate(5deg) translateY(-6px)'}],{duration:260,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});
  setTimeout(()=>{if(!soon){soonEl.classList.remove('on','out');if(soonA)soonA.cancel();soonA=null}},RM.matches?0:270);sync()};
sw.addEventListener('pointerenter',()=>{soonHover=true});sw.addEventListener('pointerleave',()=>{soonHover=false});
sw.addEventListener('click',()=>hideSoon());
addEventListener('pointerdown',e=>{if(soon&&!e.target.closest('#nvSoon')&&!e.target.closest('.rail'))hideSoon()},true);
addEventListener('keydown',e=>{if(soon&&e.key==='Escape'){hideSoon()}});
addEventListener('resize',placeSoon);

/* ---------------------------------------------------------------- routing (capture phase on the rail, before each page's own listener) */
rail.addEventListener('click',e=>{const it=e.target.closest('.grp .it');if(!it)return;const k=KEY[its.indexOf(it)];if(!k)return;
  /* state #10 browser: a whole page like 文件; its tag toggles it, any other tag (except the coming-soon ones) leaves it first */
  /* state #11 collection: a whole page as well; its tag toggles it, every other tag leaves it */
  if(k==='terminal'&&TM()){e.stopPropagation();e.preventDefault();if(soon)hideSoon();if(srOpen())SR().close({quick:true});if(brOpen())BR().close({quick:true});if(clOpen())CL().close({quick:true});if(filesOpen())F().close();if(setOpen())S().close();TM().toggle();
    if(!RM.matches){const im=it.querySelector('img.tg');if(im)im.animate([{transform:'rotate(0)'},{transform:'rotate(6deg)',offset:.3},{transform:'rotate(-3deg)',offset:.65},{transform:'rotate(0)'}],{duration:760,easing:'cubic-bezier(.3,.6,.3,1)'})}
    return}
  /* state #12 terminal: a whole page too; any other tag leaves it */
  if(tmOpen())TM().close({quick:true});
  if(k==='fav'&&CL()){e.stopPropagation();e.preventDefault();if(soon)hideSoon();if(srOpen())SR().close({quick:true});if(brOpen())BR().close({quick:true});if(filesOpen())F().close();if(setOpen())S().close();CL().toggle();
    if(!RM.matches){const im=it.querySelector('img.tg');if(im)im.animate([{transform:'rotate(0)'},{transform:'rotate(6deg)',offset:.3},{transform:'rotate(-3deg)',offset:.65},{transform:'rotate(0)'}],{duration:760,easing:'cubic-bezier(.3,.6,.3,1)'})}
    return}
  if(k==='browser'&&BR()){e.stopPropagation();e.preventDefault();if(soon)hideSoon();if(srOpen())SR().close({quick:true});if(clOpen())CL().close({quick:true});if(filesOpen())F().close();if(setOpen())S().close();BR().toggle();
    if(!RM.matches){const im=it.querySelector('img.tg');if(im)im.animate([{transform:'rotate(0)'},{transform:'rotate(6deg)',offset:.3},{transform:'rotate(-3deg)',offset:.65},{transform:'rotate(0)'}],{duration:760,easing:'cubic-bezier(.3,.6,.3,1)'})}
    return}
  if(brOpen()&&k!=='fav'&&k!=='terminal')BR().close({quick:true});
  if(clOpen()&&k!=='terminal')CL().close({quick:true});
  if(k==='search'&&SR()){e.stopPropagation();e.preventDefault();if(soon)hideSoon();SR().toggle();
    if(!RM.matches){const im=it.querySelector('img.tg');if(im)im.animate([{transform:'rotate(0)'},{transform:'rotate(6deg)',offset:.3},{transform:'rotate(-3deg)',offset:.65},{transform:'rotate(0)'}],{duration:760,easing:'cubic-bezier(.3,.6,.3,1)'})}
    return}
  if(srOpen())SR().close({quick:true});
  if(k==='search'||k==='fav'||k==='terminal'){e.stopPropagation();e.preventDefault();
    if(soon&&soon.k===k){hideSoon();return}showSoon(k);
    if(!RM.matches){const im=it.querySelector('img.tg');if(im)im.animate([{transform:'rotate(0)'},{transform:'rotate(5deg)',offset:.3},{transform:'rotate(-3deg)',offset:.65},{transform:'rotate(0)'}],{duration:760,easing:'cubic-bezier(.3,.6,.3,1)'})}
    return}
  if(soon)hideSoon();
  if(k==='files'){if(setOpen())S().close();return}
  if(k==='look'||k==='account'||k==='settings'){if(filesOpen())F().close();
    if(k==='settings'){const s=S();if(!s)return;const sec=s.S.sec;
      if(s.S.open){if(sec!=='permission'&&sec!=='engine')s.go('permission')}
      else if(s.S.lastSec!=='permission'&&s.S.lastSec!=='engine')s.S.lastSec='permission'}
    return}
  /* chat tags: leave any page first */
  if(filesOpen())F().close();if(setOpen())S().close()},true);

/* ---------------------------------------------------------------- state → chosen tag, rail pin, layer classes */
let chatOn=Math.max(-1,its.findIndex(e=>e.classList.contains('on'))),lastPage=null,flUntil=0,stUntil=0,mx=innerWidth/2,my=innerHeight/2;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY},{passive:true});
const page=()=>{if(srOpen())return 'search';if(brOpen())return 'browser';if(clOpen())return 'fav';if(tmOpen())return 'terminal';if(setOpen()){const k=S().S.sec;return k==='account'?'account':k==='appearance'?'look':'settings'}
  if(filesOpen())return 'files';return null};
window.__railPin=()=>!!(page()||soon);
const setOn=i=>its.forEach((e,j)=>{const on=j===i;if(e.classList.contains('on')!==on)e.classList.toggle('on',on)});
b.classList.add('ly-eg');
const sync=()=>{const p=page(),t=now();
  const want=soon?IDX[soon.k]:p?IDX[p]:null;
  if(want!=null){const n=its.filter(e=>e.classList.contains('on')).length;if(n!==1||!its[want].classList.contains('on'))setOn(want)}
  else{const cur=its.findIndex(e=>e.classList.contains('on'));
    if(cur===-1||CHAT.includes(cur))chatOn=cur;else setOn(chatOn)}
  /* layer scope classes: a page's unscoped rules apply while it is open and while it slides away */
  if(filesOpen()||b.classList.contains('fl-closing'))flUntil=t+.9;
  if(setOpen())stUntil=t+1.1;
  b.classList.toggle('ly-fl',t<flUntil);b.classList.toggle('ly-st',t<stUntil);
  const pg=soon?'soon':(p||'chat');if(b.dataset.page!==pg)b.dataset.page=pg;
  /* the rail stays out while a page (or the coming-soon tag) is showing */
  const pin=!!(p||soon);
  if(pin&&window.__rail2&&!window.__rail2.isOpen())window.__rail2.show();
  if(!pin&&lastPage&&window.__rail2&&window.__rail2.isOpen()){const r=rail.getBoundingClientRect();
    if(mx>r.right+36)setTimeout(()=>{if(!window.__railPin()&&mx>rail.getBoundingClientRect().right+36&&!b.classList.contains('drw-open'))window.__rail2.hide()},700)}
  lastPage=pin?(p||'soon'):null;
  if(soon)placeSoon()};
const loop=()=>{sync();requestAnimationFrame(loop)};

/* ---------------------------------------------------------------- merged #play: rail drops → 文件 → 外观 → 账户 → 设置(权限/引擎) → 回到对话 */
const D={x:760,y:470,vis:0,press:-9};const marks={};
const cur=()=>document.getElementById('rkCur');
const Pt=(el,fx=.5,fy=.5)=>{if(!el)return [D.x,D.y];const r=el.getBoundingClientRect();return [r.left+r.width*fx,r.top+r.height*fy]};
const tagAt=k=>{const e=its[IDX[k]];const r=rail.getBoundingClientRect();
  return [r.left+e.offsetParent.offsetLeft+e.offsetLeft+e.offsetWidth/2,r.top+e.offsetParent.offsetTop+e.offsetTop+e.offsetHeight/2+4]};
const tab=i=>document.querySelectorAll('#stSet .st-tab')[i];
const press=(el,name)=>{D.press=now();marks[name||'press'+Object.keys(marks).length]=now();if(el)el.click()};
const sm=u=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u)};
const STEPS=[
 {d:.45,show:1},
 {to:()=>[6,430],d:.95},
 {d:.12,act:()=>{if(!window.__realMouse&&window.__rail2)window.__rail2.show()}},
 {d:1.2},
 {to:()=>tagAt('files'),d:.62},{d:.3,act:()=>press(its[IDX.files],'files')},{d:1.7},
 {to:()=>tagAt('look'),d:.66},{d:.26,act:()=>press(its[IDX.look],'look')},{d:1.7},
 {to:()=>tagAt('account'),d:.6},{d:.26,act:()=>press(its[IDX.account],'account')},{d:1.6},
 {to:()=>tagAt('settings'),d:.52},{d:.26,act:()=>press(its[IDX.settings],'settings')},{d:1.3},
 {to:()=>Pt(tab(3),.45),d:.85},{d:.26,act:()=>press(tab(3),'engine')},{d:1.5},
 {to:()=>tagAt('new'),d:.95},{d:.26,act:()=>press(its[IDX.new],'chat')},{d:.9},
 {to:()=>[760,470],d:.95},{d:1.15,end:1}];
let si=-1,t0=0,tEnd=0,from=[0,0],playing=false;
const begin=(i,n)=>{si=i;const s=STEPS[i];if(!s)return;t0=n;from=[D.x,D.y];if(s.show)D.vis=1;tEnd=n+(s.d||0)};
const tick=()=>{if(!playing)return;const n=now();if(si<0)begin(0,n);
  while(si<STEPS.length&&n>=tEnd){const s=STEPS[si];if(s.to){const p=s.to();D.x=p[0];D.y=p[1]}if(s.act)s.act();if(s.end){playing=false;marks.END=n;break}begin(si+1,n)}
  const s=STEPS[si];if(s&&playing&&s.to){const u=tEnd>t0?(n-t0)/(tEnd-t0):1,p=s.to(),e=sm(u);
    const ax=from[0]+(p[0]-from[0])*e,ay=from[1]+(p[1]-from[1])*e,arc=Math.sin(Math.PI*e)*Math.min(26,Math.hypot(p[0]-from[0],p[1]-from[1])*.06);D.x=ax;D.y=ay-arc}
  const c=cur();if(c){const pr=now()-D.press<.12;c.style.opacity=D.vis?'1':'0';c.style.transform=`translate(${(D.x-3).toFixed(2)}px,${(D.y-2).toFixed(2)}px) scale(${pr?.88:1})`}
  requestAnimationFrame(tick)};
const play=()=>{if(playing)return;playing=true;si=-1;marks.play=now();if(window.__v11restart)window.__v11restart();D.x=760;D.y=470;D.vis=0;requestAnimationFrame(tick)};

/* ---------------------------------------------------------------- boot */
const boot=()=>{requestAnimationFrame(loop);
  const sk=['soon-fav'].find(has);
  if(sk){if(window.__rail2)window.__rail2.show();setTimeout(()=>showSoon(sk.slice(5),{keep:true}),1300)}
  else if(has('play')){setTimeout(play,600)}};
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(boot)))));
if(has('play')){window.__demoXY=()=>[D.x,D.y,now()-D.press<.12?1:0];window.__playGo=play}
window.__nav={showSoon,hideSoon,get page(){return page()||(soon?'soon:'+soon.k:'chat')},play,
  timeline:()=>JSON.stringify(Object.fromEntries(Object.entries(marks).map(([k,v])=>[k,+(v-(marks.play||0)).toFixed(2)])))};
addEventListener('hashchange',()=>location.reload());
})();
