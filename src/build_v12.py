#!/usr/bin/env python3
"""Build v12_stream.html (assistant streaming / 落笔中 state) from v8.html. v8/v11 are read only.
The last assistant bubble (#sb) and its code block (#sp) stream in token by token; a small SVG blossom
rides the writing tip and sweeps the freshly arrived characters into place (ink settling).
Deterministic: every visual is a pure function of cycle time, exposed as window.__v12frame(seconds)."""
import re

SRC = './v8.html'
OUT = './v12_stream.html'
s = open(SRC, encoding='utf-8').read()

def sub1(old, new):
    global s
    assert s.count(old) == 1, (old, s.count(old))
    s = s.replace(old, new)

# ---------- blossom (5 notched petals, blush -> ivory, silver-blue heart; sparse, no dots clusters) ----------
PETAL = 'M0,-1.4 C-3.7,-3.1 -5.5,-7.3 -3.3,-10.1 C-2.1,-11.5 -0.8,-11.1 0,-9.9 C0.8,-11.1 2.1,-11.5 3.3,-10.1 C5.5,-7.3 3.7,-3.1 0,-1.4Z'
petals = ''.join(
    f'<g transform="rotate({k*72})"><g class="po"><path d="{PETAL}" fill="url(#pg12)" stroke="rgba(166,122,138,.5)" stroke-width=".42"/>'
    f'<path d="M0,-2.6 L0,-6.6" stroke="rgba(186,146,158,.32)" stroke-width=".38" stroke-linecap="round"/></g></g>'
    for k in range(5))
DEFS = '''<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
 <linearGradient id="pg12" x1="0" y1="-1" x2="0" y2="-11" gradientUnits="userSpaceOnUse">
  <stop offset="0" stop-color="#E6C9CF"/><stop offset=".45" stop-color="#F2E1E1"/><stop offset="1" stop-color="#FCF8F2"/></linearGradient>
 <radialGradient id="cg12" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#F4F7FB"/><stop offset=".55" stop-color="#A9B8D3"/><stop offset="1" stop-color="#7386AD"/></radialGradient>
 <radialGradient id="hg12"><stop offset="0" stop-color="#FFF4F2" stop-opacity=".9"/><stop offset=".5" stop-color="#F3DCE0" stop-opacity=".35"/><stop offset="1" stop-color="#F3DCE0" stop-opacity="0"/></radialGradient>
</defs></svg>'''
FLOWER = f'''<div class="flw12" id="flw12" aria-hidden="true">
 <svg class="halo" width="44" height="44" viewBox="-22 -22 44 44"><circle r="21" fill="url(#hg12)"/></svg>
 <svg class="bl" width="22" height="22" viewBox="-12 -12 24 24"><g id="flRot">{petals}
  <circle r="2.35" fill="url(#cg12)" stroke="rgba(92,108,148,.35)" stroke-width=".35"/><circle cx="-.7" cy="-.8" r=".65" fill="#fff" opacity=".75"/></g></svg>
</div>
<div class="pdrop12" id="pd12a" aria-hidden="true"><svg width="12" height="12" viewBox="-6 -11.5 12 12"><path d="{PETAL}" fill="url(#pg12)" stroke="rgba(170,128,142,.4)" stroke-width=".42"/></svg></div>
<div class="pdrop12" id="pd12b" aria-hidden="true"><svg width="12" height="12" viewBox="-6 -11.5 12 12"><path d="{PETAL}" fill="url(#pg12)" stroke="rgba(170,128,142,.4)" stroke-width=".42"/></svg></div>'''

STOP = '''<i class="stop12" id="stop12" aria-hidden="true"><svg width="40" height="40" viewBox="-20 -20 40 40">
 <circle r="14.6" fill="none" stroke="rgba(143,161,196,.28)" stroke-width=".9"/>
 <circle id="stArc" r="14.6" fill="none" stroke="#7F93BC" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="20 72"/>
 <circle r="10.2" fill="rgba(249,250,253,.94)" stroke="rgba(91,108,147,.42)" stroke-width=".6"/>
 <rect x="-3.3" y="-3.3" width="6.6" height="6.6" rx="1.5" fill="#5B6C93"/>
</svg></i>'''

CSS = r'''
<style id="v12stream">
/* ===== v12: streaming / 落笔中 ===== */
.ch{opacity:0}
.ch.on{opacity:var(--fo,1)}
#sb::after{opacity:var(--sig,1)}
.flw12{position:fixed;left:0;top:0;width:0;height:0;z-index:30;pointer-events:none;opacity:0;will-change:transform,opacity}
.flw12 svg{position:absolute;left:0;top:0;overflow:visible}
.flw12 .bl{width:20px;height:20px;margin:-10px 0 0 -10px;filter:drop-shadow(0 1.4px 1.6px rgba(56,68,108,.26))}
.flw12 .halo{margin:-22px 0 0 -22px;opacity:.55}
.pdrop12{position:fixed;left:0;top:0;width:0;height:0;z-index:29;pointer-events:none;opacity:0}
.pdrop12 svg{position:absolute;left:-6px;top:-6px;filter:drop-shadow(0 1px 1px rgba(56,68,108,.18))}
/* "Kimi 正在落笔…" */
.who{position:relative}
.pen12{position:absolute;left:84px;top:50%;transform:translateY(-52%);display:flex;align-items:baseline;gap:7px;white-space:nowrap;
  font-size:11px;letter-spacing:.24em;color:rgba(78,94,140,.62);opacity:var(--pen,0)}
.pen12::before{content:"";align-self:center;width:18px;height:1px;background:linear-gradient(90deg,rgba(91,108,147,0),rgba(91,108,147,.45))}
.pen12 em{font-family:"Pinyon",serif;font-style:normal;font-size:16px;letter-spacing:0;color:#7C8FB8;line-height:1}
.pen12 i{font-style:normal;letter-spacing:.12em}
.pen12 i b{font-weight:400;opacity:.25}
/* send clock -> stop */
.send .stop12{position:absolute;left:50%;top:var(--fy,57%);width:40px;height:40px;margin:-20px 0 0 -20px;z-index:3;pointer-events:none;
  opacity:var(--busy,0);transform:scale(calc(.86 + .14*var(--busy,0)))}
.send .stop12 svg{display:block!important}
.send .sl{transition:none}
.send .sl.sl0{opacity:calc(1 - var(--busy,0))}
.send .sl.sl2{opacity:var(--busy,0)}
@media (prefers-reduced-motion:reduce){.flw12 .halo{display:none}}
</style>
'''

JS = r'''<script>
(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)');
const sb=document.getElementById('sb'),sp=document.getElementById('sp');
const flw=document.getElementById('flw12'),flRot=document.getElementById('flRot'),pos=[...flw.querySelectorAll('.po')];
const pdA=document.getElementById('pd12a'),pdB=document.getElementById('pd12b');
const pen=document.getElementById('pen12'),dots=[...pen.querySelectorAll('i b')];
const send=document.querySelector('.send'),stArc=document.getElementById('stArc');
/* ---- wrap every character of the two blocks in a span (stickers/images untouched) ---- */
const chars=[];
const wrap=(root,blk)=>{const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const ns=[];while(tw.nextNode())ns.push(tw.currentNode);
  ns.forEach(n=>{const f=document.createDocumentFragment();for(const c of n.data){
    if(c==='\n'){f.appendChild(document.createTextNode('\n'));chars.push({nl:true,blk});continue}
    const e=document.createElement('span');e.className='ch';e.textContent=c;f.appendChild(e);chars.push({el:e,c,blk})}
   n.parentNode.replaceChild(f,n)})};
wrap(sb,0);wrap(sp,1);
/* ---- seeded token schedule (realistic uneven chunks) ---- */
let seed=20261026;const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const R=(a,b)=>a+rnd()*(b-a);
const chunks=[];let cur=null,line=0;
const push=()=>{if(cur&&cur.idx.length)chunks.push(cur);cur=null};
// bubble: CJK tokens of 1-3 chars, punctuation alone
let i=0;
while(i<chars.length&&chars[i].blk===0){const c=chars[i].c;
  if('，。：；！？、'.includes(c)){push();chunks.push({idx:[i],punct:c,line:0,blk:0});i++;continue}
  const n=rnd()<.45?1:(rnd()<.7?2:3);cur={idx:[],line:0,blk:0};
  for(let k=0;k<n&&i<chars.length&&chars[i].blk===0&&!'，。：；！？、'.includes(chars[i].c);k++)cur.idx.push(i++);push()}
// code: per line, regex tokens merged 1-3 per chunk (indent rides with first token)
line=1;let lineIdx=[];const flushLine=()=>{if(!lineIdx.length)return;
  const str=lineIdx.map(j=>chars[j].c).join('');const toks=[];const re=/^\s+|[A-Za-z_]+|\d+|\s+|[^\sA-Za-z_\d]/g;let m,p=0;
  while((m=re.exec(str))){toks.push(lineIdx.slice(m.index,m.index+m[0].length))}
  let t=0,first=true;while(t<toks.length){const n=rnd()<.3?1:(rnd()<.6?2:3);
    const idx=[];let k=0;while(k<n&&t<toks.length){const tk=toks[t++];idx.push(...tk);if(chars[tk[0]].c.trim()!=='')k++}
    while(t<toks.length&&chars[toks[t][0]].c.trim()==='')idx.push(...toks[t++]);chunks.push({idx,line,blk:1,first});first=false}
  lineIdx=[];line++};
for(;i<chars.length;i++){if(chars[i].nl){flushLine();continue}lineIdx.push(i)}flushLine();
/* ---- geometry ---- */
let G=null;
const measure=()=>{chars.forEach(c=>{if(c.nl)return;const r=c.el.getBoundingClientRect();c.l=r.left;c.r=r.right;c.cy=(r.top+r.bottom)/2})};
/* ---- timeline ---- */
const T0=.8,CH_D=.028;
let TL=null;
const build=()=>{measure();seed=20261026;for(let k=0;k<400;k++)rnd();
  const segs=[];let t=T0;const vis=c=>c.c.trim()!=='';
  const startP=ch=>{const j=ch.idx.find(j=>vis(chars[j]))??ch.idx[0];const c=chars[j];return {x:c.l-3,y:c.cy-1}};
  const endP=ch=>{const j=[...ch.idx].reverse().find(j=>vis(chars[j]))??ch.idx[ch.idx.length-1];const c=chars[j];return {x:c.r+7,y:c.cy-1}};
  let p0=startP(chunks[0]);const start=p0;let prevBlk=0,prevLine=0;
  chunks.forEach((ch,ci)=>{
    const n=ch.idx.length;
    if(ci>0&&(ch.line!==prevLine)){ // hop to next line start during the pause
      const p1=startP(ch);const hd=ch.blk!==prevBlk?.6:.44;segs.push({a:t-hd,b:t,from:p0,to:p1,hop:ch.blk!==prevBlk?6:4.5});p0=p1}
    const p1=endP(ch);const d=Math.max(.07,n*CH_D);
    segs.push({a:t,b:t+d,from:p0,to:p1});
    // characters arrive as the blossom sweeps past them (inverse of easeOutQuad)
    ch.idx.forEach(j=>{const c=chars[j];const span=p1.x-p0.x;const u=span>1?Math.min(1,Math.max(0,((c.r??p0.x)-p0.x)/span)):1;c.a=t+d*(1-Math.sqrt(1-u))*.92});
    p0=p1;prevBlk=ch.blk;prevLine=ch.line;
    let gap=n/(ch.blk?40:24)*R(.65,1.5);
    if(ch.punct)gap+=ch.punct==='：'?R(.30,.40):R(.22,.32);
    if(rnd()<.07)gap+=R(.12,.26);           // tokenizer hiccup
    const nx=chunks[ci+1];
    if(nx&&nx.line!==ch.line)gap=Math.max(gap,(nx.blk!==ch.blk?.72:R(.5,.6)));
    t+=Math.max(gap,d+.02)});
  const Tend=chars.filter(c=>!c.nl).reduce((m,c)=>Math.max(m,c.a),0);
  const Tbloom=Tend+.32,Tmark=Tbloom+1.0,Thold=Tmark+.6,Treset=Thold+2.0,CYC=Treset+.6;
  // two petals only, at quiet moments on the code lines
  const petT=[chunks.find(c=>c.line===2&&!c.first),chunks.find(c=>c.line===3&&c.idx.length>2&&!c.first)].filter(Boolean).map(c=>chars[c.idx[0]].a+.05);
  TL={segs,start,Tend,Tbloom,Tmark,Thold,Treset,CYC,petT,endPos:p0}};
const ease=u=>1-(1-u)*(1-u),eio=u=>u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2,cl=u=>Math.max(0,Math.min(1,u));
const posAt=t=>{const S=TL.segs;let p=TL.start;for(const s of S){if(t<s.a)break;
    if(t<s.b){const u=(t-s.a)/(s.b-s.a);
      if(s.hop){ // soft hop at the tip, drop to the next line, then glide back along its empty start
        const ex=eio(cl((u-.2)/.8)),ey=eio(cl((u-.08)/.47)),lift=s.hop*Math.sin(Math.PI*cl(u/.26));
        return {x:s.from.x+(s.to.x-s.from.x)*ex,y:s.from.y+(s.to.y-s.from.y)*ey-lift,hop:u}}
      const e=ease(u);return {x:s.from.x+(s.to.x-s.from.x)*e,y:s.from.y+(s.to.y-s.from.y)*e,hop:-1}}
    p=s.to}return {x:p.x,y:p.y,hop:-1}};
const spinAt=t=>{const ts=Math.min(t,TL.Tend);let a=ts*34+7*Math.sin(t*2*Math.PI/1.8);
  // extra twirl during line hops
  for(const s of TL.segs){if(s.hop&&t>=s.a){a+=60*eio(cl((t-s.a)/(s.b-s.a)))}}
  if(t>TL.Tend){const r=a;const u=cl((t-TL.Tend)/1.4);const rest=Math.round(r/72)*72+12;a=r+(rest-r)*ease(u)-7*Math.sin(t*2*Math.PI/1.8)*(1-ease(u))*0+0}
  return a};
let lastT=-1;
const frame=T=>{if(!TL)build();const t=((T%TL.CYC)+TL.CYC)%TL.CYC;const rm=RM.matches;
  // characters
  const fo=t<TL.Treset?1:1-cl((t-TL.Treset)/.55);
  sb.style.setProperty('--fo',fo.toFixed(3));sp.style.setProperty('--fo',fo.toFixed(3));
  sb.style.setProperty('--sig',cl((t-TL.Tmark)/.6)*fo);
  for(const c of chars){if(c.nl)continue;const age=t-c.a,e=c.el;
    if(age<0){if(e._s!==0){e.className='ch';e.removeAttribute('style');e._s=0}continue}
    const D=rm?.12:.27;
    if(age>=D){if(e._s!==2){e.className='ch on';e.removeAttribute('style');e._s=2}continue}
    const u=age/D,k=ease(u);e.className='ch on';e._s=1;
    if(rm){e.style.cssText=`opacity:${(k*fo).toFixed(3)}`;continue}
    e.style.cssText=`opacity:${(Math.pow(k,.7)*fo).toFixed(3)};position:relative;top:${(-1.6*(1-k)).toFixed(2)}px;`+
      `-webkit-text-fill-color:color-mix(in srgb,currentColor ${(k*k*100).toFixed(0)}%,transparent);`+
      `text-shadow:0 0 ${(5*(1-k)).toFixed(2)}px color-mix(in srgb,currentColor ${(70*(1-k)).toFixed(0)}%,transparent)`}
  // busy state (label, send stop)
  const busy=t<TL.Tend+.25?cl(t/.35):1-cl((t-TL.Tend-.25)/.45);
  const busyR=t>=TL.Treset?0:busy;
  pen.style.setProperty('--pen',busyR.toFixed(3));send.style.setProperty('--busy',busyR.toFixed(3));
  if(!rm){dots.forEach((d,k)=>{const ph=((t*1.25-k*.22)%1+1)%1;d.style.opacity=(.25+.75*Math.max(0,Math.sin(ph*Math.PI))).toFixed(2)});
    stArc.setAttribute('transform',`rotate(${((t*150)%360).toFixed(1)})`)}
  else{dots.forEach(d=>d.style.opacity=.7)}
  // blossom
  let op,sc=1,open=0,x,y,rot;
  if(t<TL.Tend+.01){const p=posAt(t);x=p.x;y=p.y;op=cl((t-.1)/.45);sc=.6+.4*ease(cl((t-.1)/.55));sc*=1+.035*Math.sin(t*2*Math.PI/1.3)}
  else{const p=TL.endPos;x=p.x+6*ease(cl((t-TL.Tend)/.35));y=p.y;op=1;
    const b=cl((t-TL.Tbloom)/.75);open=Math.sin(Math.PI*Math.min(1,b*1.15))*(b<.87?1:Math.max(.25,1-(b-.87)*6))+0;
    const bs=b<1?1+.26*Math.sin(Math.PI*b):1;
    const m=ease(cl((t-TL.Tmark)/.7));open=b<1?open:.25*(1-m)+.15;
    sc=bs*(1-.24*m);op=1-.42*m;
    if(t>=TL.Treset)op*=1-cl((t-TL.Treset)/.5)}
  rot=spinAt(t);
  if(rm){ // no motion: blossom only appears as the resting mark at the end
    if(t>=TL.Tend){const p=TL.endPos;x=p.x+6;y=p.y;sc=.76;open=.15;rot=12;op=.58*(t>=TL.Treset?1-cl((t-TL.Treset)/.5):1)}else op=0}
  flw.style.opacity=op.toFixed(3);
  flw.style.transform=`translate(${x.toFixed(2)}px,${y.toFixed(2)}px) scale(${sc.toFixed(3)})`;
  flRot.setAttribute('transform',`rotate(${rot.toFixed(2)})`);
  pos.forEach((g,k)=>g.setAttribute('transform',`translate(0 ${(-1.5*open).toFixed(2)}) rotate(${(open*(k%2?3:-3)).toFixed(2)}) scale(${(1+.08*open).toFixed(3)})`));
  flw.querySelector('.halo').style.opacity=(rm?0:(.42+.5*open)).toFixed(2);
  // petal drops
  [pdA,pdB].forEach((pd,k)=>{const tp=TL.petT[k];if(rm||tp==null){pd.style.opacity=0;return}
    const u=(t-tp)/1.5;if(u<0||u>1){pd.style.opacity=0;return}
    const p=posAt(tp);const dx=-6+10*Math.sin(u*2.4)+(k?-4:3)*u,dy=4+26*Math.pow(u,1.15);
    pd.style.opacity=(.85*(u<.12?u/.12:1)*(1-Math.pow(u,1.6))).toFixed(3);
    pd.style.transform=`translate(${(p.x+dx).toFixed(2)}px,${(p.y+dy).toFixed(2)}px) rotate(${(k?-1:1)*(40+190*u)}deg) scale(${(.85-.2*u).toFixed(3)})`});
};
window.__v12frame=frame;window.__v12tl=()=>{if(!TL)build();return {Tend:TL.Tend,CYC:TL.CYC,chunks:chunks.length,petT:TL.petT}};
addEventListener('resize',()=>{TL=null});window.__v12reset=()=>{TL=null};
const go=()=>{build();let t0=null;const loop=n=>{if(t0===null)t0=n;frame((n-t0)/1000);requestAnimationFrame(loop)};requestAnimationFrame(loop)};
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>requestAnimationFrame(go));
frame(0);
})();
</script>'''

sub1('<title>Kimi Code · 蓝雾厅 v8</title>', '<title>Kimi Code · 蓝雾厅 v12 · 落笔中</title>')
sub1('<div class="b">先缓冲，再在一帧里一次性提交：</div>', '<div class="b" id="sb">先缓冲，再在一帧里一次性提交：</div>')
sub1('<pre>', '<pre id="sp">')
sub1('<div class="who">K I M I</div>',
     '<div class="who">K I M I<span class="pen12" id="pen12" aria-live="polite"><em>Kimi</em>正在落笔<i><b>·</b><b>·</b><b>·</b></i></span></div>')
sub1('<span class="sl">Envoyer</span>', '<span class="sl sl0">Envoyer</span><span class="sl sl2">Stopper</span>' + STOP)
sub1('</head>', CSS + '</head>')
idx = s.rfind('</body>')
s = s[:idx] + DEFS + FLOWER + JS + s[idx:]
open(OUT, 'w', encoding='utf-8').write(s)
print('wrote', OUT, len(s))
