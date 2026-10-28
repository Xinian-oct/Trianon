#!/usr/bin/env python3
"""Build v11_empty.html (new-conversation empty state) from v8.html. v8/v9/v10 files are read only.
v10: English-only Pinyon lines, lotus-leaf sticker hero with a rolling dew drop.
v11: the hopping notes are replaced by a flowing ribbon five-line staff (clef + notes as SVG paths,
     glyph outlines for clef/sharp taken from Noto Music via music/glyphs.json) that unspools from the ink bleed."""
import re, base64, math, json

SRC = './v8.html'
OUT = './v11_empty.html'
GLYPHS = json.load(open('./music/glyphs.json'))
s = open(SRC, encoding='utf-8').read()

b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
LOTUS = 'data:image/png;base64,' + b64('./icons/k_lotus.png')
PINYON = re.search(r'@font-face\{font-family:"Pinyon";src:url\((data:font/woff2;base64,[A-Za-z0-9+/=]+)\)', s).group(1)
BOW = 'data:image/png;base64,' + b64('./icons/k_pinkbow.png')

# ---------- card geometry (card coords, 600 x 310) ----------
W, H = 600, 310
def scallop_outline(W, H, s=24, ry=7):
    """clockwise scalloped rectangle; bumps bulge outward"""
    nx = round(W / s); sx = W / nx
    ny = round(H / s); sy = H / ny
    d = [f'M0,0']
    for _ in range(nx): d.append(f'a{sx/2:.2f},{ry} 0 0 1 {sx:.2f},0')
    for _ in range(ny): d.append(f'a{ry},{sy/2:.2f} 0 0 1 0,{sy:.2f}')
    for _ in range(nx): d.append(f'a{sx/2:.2f},{ry} 0 0 1 {-sx:.2f},0')
    for _ in range(ny): d.append(f'a{ry},{sy/2:.2f} 0 0 1 0,{-sy:.2f}')
    return ' '.join(d) + 'Z'

OUTLINE = scallop_outline(W, H)
def curl(x, y, sx, sy):
    # small rococo C-scroll in a frame corner; sx/sy mirror it
    p = [(0, 14), (0, 4), (4, 0), (14, 0), (20, 0), (22, 6), (18, 8), (14, 10), (10, 6), (13, 4)]
    q = [(x + sx * a, y + sy * b) for a, b in p]
    return (f'M{q[0][0]},{q[0][1]} C{q[1][0]},{q[1][1]} {q[2][0]},{q[2][1]} {q[3][0]},{q[3][1]} '
            f'C{q[4][0]},{q[4][1]} {q[5][0]},{q[5][1]} {q[6][0]},{q[6][1]} '
            f'C{q[7][0]},{q[7][1]} {q[8][0]},{q[8][1]} {q[9][0]},{q[9][1]}')
CURLS = ' '.join([curl(30, 280, 1, -1), curl(570, 280, -1, -1)])

CARD_SVG = f'''<svg class="paper" width="{W+28}" height="{H+28}" viewBox="-14 -14 {W+28} {H+28}" aria-hidden="true">
 <defs>
  <linearGradient id="pp" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#FCF9F1"/><stop offset=".55" stop-color="#F7F1E4"/><stop offset="1" stop-color="#F1E9D8"/></linearGradient>
  <radialGradient id="pl" cx=".28" cy=".18" r=".9"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".55"/><stop offset=".6" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>
  <linearGradient id="vf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFEFB"/><stop offset="1" stop-color="#FBF7EE"/></linearGradient>
  <filter id="fib" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".011 .03" numOctaves="2" seed="7"/>
   <feColorMatrix values="0 0 0 0 .55  0 0 0 0 .5  0 0 0 0 .42  0 0 0 .07 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
 </defs>
 <path d="{OUTLINE}" fill="url(#pp)"/>
 <path d="{OUTLINE}" fill="url(#pl)"/>
 <path d="{OUTLINE}" fill="#000" filter="url(#fib)"/>
 <path d="{OUTLINE}" fill="none" stroke="rgba(150,160,182,.45)" stroke-width=".7"/>
 <rect x="14" y="14" width="{W-28}" height="{H-28}" rx="3" fill="none" stroke="#A3B0C9" stroke-width=".9"/>
 <rect x="19" y="19" width="{W-38}" height="{H-38}" rx="2" fill="none" stroke="rgba(163,176,201,.55)" stroke-width=".55"/>
 <path d="{CURLS}" fill="none" stroke="#A3B0C9" stroke-width=".9" stroke-linecap="round"/>
 <g transform="translate(300 270)"><line x1="-74" y1="0" x2="-12" y2="0" stroke="rgba(163,176,201,.8)" stroke-width=".6"/><line x1="12" y1="0" x2="74" y2="0" stroke="rgba(163,176,201,.8)" stroke-width=".6"/>
  <path d="M0,-5 C1,-1 1,-1 5,0 C1,1 1,1 0,5 C-1,1 -1,1 -5,0 C-1,-1 -1,-1 0,-5Z" fill="#E2BCC6"/></g>
</svg>'''

NIB = '''<svg class="nib" id="nib" width="40" height="64" viewBox="-20 -60 40 64" aria-hidden="true">
 <defs><linearGradient id="nb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9AA8C4"/><stop offset=".45" stop-color="#DCE3EF"/><stop offset=".6" stop-color="#8E9DBB"/><stop offset="1" stop-color="#5F6E92"/></linearGradient>
 <linearGradient id="nbody" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#6F7FA3"/><stop offset="1" stop-color="#6F7FA3" stop-opacity="0"/></linearGradient></defs>
 <path d="M-7.5,-36 L7.5,-36 L7,-58 L-7,-58Z" fill="url(#nbody)"/>
 <path d="M0,0 C-1.6,-5 -7,-13 -7.5,-22 L-7.5,-36 L7.5,-36 L7.5,-22 C7,-13 1.6,-5 0,0Z" fill="url(#nb)" stroke="#56658A" stroke-width=".6"/>
 <path d="M0,-1.5 L0,-17" stroke="#3E4A6C" stroke-width=".8"/><circle cx="0" cy="-19.5" r="1.7" fill="#3E4A6C"/>
 <path d="M-7.5,-36 L7.5,-36" stroke="#B9A27A" stroke-width="1.2"/>
</svg>'''

# ---------- lotus leaf sticker (k_lotus.png 560x358; navel at 291,166; drip edge at 215,334) ----------
LW = 240; LS = LW / 560; LH = round(358 * LS, 1)
LL, LT = 338, -71                      # leaf box in card coords
NAVEL = [round(291 * LS, 1), round(166 * LS, 1)]
DRIP = [round(LL + 215 * LS, 1), round(LT + 333 * LS, 1)]  # drip point (card coords) on the leaf rim

DROP = '''<svg class="drop" id="drop" width="40" height="64" viewBox="-20 -44 40 64" aria-hidden="true">
 <defs>
  <radialGradient id="dgB" cx=".56" cy=".66" r=".72"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".85"/><stop offset=".22" stop-color="#F2F6FB" stop-opacity=".3"/>
   <stop offset=".55" stop-color="#C3D0E4" stop-opacity=".12"/><stop offset=".8" stop-color="#7F93BA" stop-opacity=".42"/><stop offset=".94" stop-color="#4D6290" stop-opacity=".78"/><stop offset="1" stop-color="#3E5180" stop-opacity=".9"/></radialGradient>
  <filter id="dgS" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.4"/></filter>
 </defs>
 <ellipse id="dSh" cx="1.6" cy="5" rx="6" ry="3" fill="rgba(44,58,92,.38)" filter="url(#dgS)"/>
 <path id="dBody" d="M0,-7 A7,7 0 1 1 0,7 A7,7 0 1 1 0,-7Z" fill="url(#dgB)" stroke="rgba(52,68,108,.55)" stroke-width=".6"/>
 <path id="dCau" d="" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="1.1" stroke-linecap="round"/>
 <ellipse id="dHi" cx="-2.6" cy="-2.8" rx="1.9" ry="1.25" fill="#fff" transform="rotate(-38 -2.6 -2.8)"/>
 <circle id="dHi2" cx="2.4" cy="-4.4" r=".55" fill="#fff" opacity=".85"/>
</svg>'''

LEAF = f'''<div class="lotus" id="lotus"><img src="{LOTUS}" alt="" width="{LW}" height="{LH}"></div>'''

FILTERS = '''<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
 <filter id="bleedF" x="-30%" y="-60%" width="160%" height="220%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="3" result="n"/><feDisplacementMap id="bleedD" in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G"/></filter>
 <filter id="bloomF" x="-40%" y="-80%" width="180%" height="260%"><feTurbulence type="fractalNoise" baseFrequency=".022" numOctaves="2" seed="11" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation="5"/></filter>
</defs></svg>'''

HERO = f'''<div class="scroll empty"><div class="hall">
      <div class="dsep"><span>新 的 信 笺</span></div>
      <div class="invite" id="invite">
        {CARD_SVG}
        <img class="bow9" src="{BOW}" alt="">
        <div class="bloom" id="bloom"><i></i><i></i><i></i></div>
        <span class="line" id="line">Bonsoir, Colette</span>
        <span class="line blur" id="lineB" aria-hidden="true">Bonsoir, Colette</span>
        <svg class="staff" id="staff" width="600" height="310" viewBox="0 0 600 310" aria-hidden="true">
         <defs><linearGradient id="stGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="600" y2="0">
          <stop offset="0" stop-color="#2F3E6E" stop-opacity="0"/><stop offset=".03" stop-color="#2F3E6E" stop-opacity=".92"/>
          <stop offset=".55" stop-color="#4C6294" stop-opacity=".85"/><stop offset=".85" stop-color="#93A7CB" stop-opacity=".55"/><stop offset="1" stop-color="#A9B9D8" stop-opacity="0"/></linearGradient></defs>
         <g id="stWrap"><g id="stLines" fill="url(#stGrad)"><path id="stL0"/><path id="stL1"/><path id="stL2"/><path id="stL3"/><path id="stL4"/></g>
          <path id="stClef" d="{GLYPHS['clef']}"/><g id="stNotes"></g></g>
        </svg>
        <i class="ring" id="ring"></i>
        {LEAF}
        {DROP}
        {NIB}
        <div class="sig">Kimi</div>
      </div>
      <div class="tagcap"><span>或 者 ， 从 这 里 开 始</span></div>
      <div class="tags">
        <button class="tag t1"><span>Tidy this repo</span></button>
        <button class="tag t2"><span>Fix a bug</span></button>
        <button class="tag t3"><span>Just chat</span></button>
      </div>
      {FILTERS}
    </div></div>

    '''

CSS = '''
<style id="v10empty">
@font-face{font-family:"HandL9";src:url(''' + PINYON + ''') format("woff2");unicode-range:U+0000-00FF;size-adjust:118%}
.scroll.empty{padding-top:0!important;-webkit-mask:none;mask:none}
.hall{width:720px;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-bottom:6px}
.hall .dsep{width:420px;margin:0 0 26px!important}
.invite{position:relative;width:600px;height:310px;flex:none}
.invite .paper{position:absolute;left:-14px;top:-14px;filter:drop-shadow(0 1px 1px rgba(70,80,110,.16)) drop-shadow(0 18px 26px rgba(66,80,124,.22)) drop-shadow(0 4px 8px rgba(66,80,124,.08))}
.invite .bow9{position:absolute;left:-30px;top:-46px;height:92px;transform:rotate(-24deg);filter:drop-shadow(0 5px 6px rgba(90,70,90,.22)) saturate(.8);opacity:.96;pointer-events:none}
.invite .lotus{position:absolute;left:''' + str(LL) + '''px;top:''' + str(LT) + '''px;width:''' + str(LW) + '''px;height:''' + str(LH) + '''px;pointer-events:none;
 transform-origin:''' + f'{NAVEL[0]}px {NAVEL[1]}px' + ''';filter:drop-shadow(0 1px 1px rgba(70,80,110,.2)) drop-shadow(0 9px 12px rgba(60,76,118,.22))}
.invite .lotus img{display:block;width:100%;height:100%}
.invite .line{position:absolute;left:0;top:118px;display:inline-block;white-space:nowrap;font-family:"HandL9","Pinyon",var(--serif);font-size:47px;line-height:72px;
 color:#2E3B68;letter-spacing:.01em;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}
.invite .line.blur{padding:40px;color:#3A4C82;opacity:0;filter:url(#bleedF) blur(2px);text-shadow:0 0 10px rgba(60,82,140,.55)}
.invite .bloom{position:absolute;left:0;top:0;width:0;height:0;pointer-events:none}
.invite .bloom i{position:absolute;left:0;top:0;border-radius:50%;opacity:0;filter:url(#bloomF);
 background:radial-gradient(closest-side,rgba(62,84,146,.34),rgba(84,106,164,.18) 55%,rgba(110,130,180,0))}
.invite .staff{position:absolute;left:0;top:0;overflow:visible;pointer-events:none;opacity:0}
.invite .ring{position:absolute;left:0;top:0;width:10px;height:10px;border-radius:50%;border:1px solid rgba(110,130,176,.55);opacity:0;pointer-events:none}
.invite .drop{position:absolute;left:0;top:0;opacity:0;pointer-events:none;overflow:visible;filter:drop-shadow(0 1.5px 1.2px rgba(40,54,92,.22))}
.invite .nib{position:absolute;left:0;top:0;transform-origin:20px 60px;opacity:0;pointer-events:none;filter:drop-shadow(2px 4px 3px rgba(50,62,100,.28))}
.invite .sig{position:absolute;right:44px;bottom:50px;font-family:"Pinyon",serif;font-size:19px;color:rgba(122,140,178,.7)}
.tagcap{margin:40px 0 12px;font-size:10.5px;letter-spacing:.3em;color:rgba(70,85,120,.5)}
.tags{display:flex;gap:18px}
.tag{all:unset;cursor:pointer;filter:drop-shadow(0 2px 2px rgba(80,90,120,.16));transition:transform .45s cubic-bezier(.18,1.4,.32,1),filter .45s}
.tag span{display:flex;align-items:center;height:30px;padding:0 26px;font-family:"CormI",var(--serif);font-style:italic;font-size:16px;letter-spacing:.03em;
 clip-path:polygon(0 0,100% 0,calc(100% - 9px) 50%,100% 100%,0 100%,9px 50%);box-shadow:inset 0 1px 0 rgba(255,255,255,.6)}
.tag.t1{transform:rotate(-2deg)}.tag.t2{transform:rotate(1.4deg)}.tag.t3{transform:rotate(-.8deg)}
.tag.t1 span{color:#7A5F6C;background:linear-gradient(180deg,#F4E7EA,#E9D6DC)}
.tag.t2 span{color:#4F6188;background:linear-gradient(180deg,#E6EDF6,#D2DCEC)}
.tag.t3 span{color:#76674A;background:linear-gradient(180deg,#F7F2E6,#ECE4D1)}
.tag:hover,.tag:focus-visible{transform:translateY(-3px) rotate(0deg);filter:drop-shadow(0 7px 7px rgba(80,90,120,.22))}
.tag:active{transform:translateY(-1px) scale(.98)}
</style>
'''

JS = '''
<script>
(()=>{
const LINES=["Bonsoir, Colette","What shall we write today?","The tea is warm, take your time","Hand me your wildest idea","May every line compile"];
const LEAF={x:''' + str(LL) + ''',y:''' + str(LT) + ''',nx:''' + str(NAVEL[0]) + ''',ny:''' + str(NAVEL[1]) + '''},DRIP=''' + json.dumps(DRIP) + ''';
const CYCLE=7.6, W0=.35, MAXW=520, FS=47;
/* drop timeline (cycle seconds): bead -> roll along vein -> hang on rim -> fall */
const TB0=1.1,TB1=1.9,TR1=3.45,TH1=4.0,TF1=4.5;
const R0=9.5;
const $=id=>document.getElementById(id);
const card=$('invite'),line=$('line'),lineB=$('lineB'),nib=$('nib'),drop=$('drop'),ring=$('ring'),bloomEls=[...$('bloom').children],disp=$('bleedD');
const ST=$('staff'),stWrap=$('stWrap'),stGrad=$('stGrad'),stL=[0,1,2,3,4].map(j=>$('stL'+j)),stClef=$('stClef'),stNotes=$('stNotes');
const leaf=$('lotus'),dBody=$('dBody'),dSh=$('dSh'),dHi=$('dHi'),dHi2=$('dHi2'),dCau=$('dCau');
const RM=matchMedia('(prefers-reduced-motion: reduce)');
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),seg=(t,a,b)=>cl((t-a)/(b-a)),lerp=(a,b,u)=>a+(b-a)*u;
const eo=u=>1-Math.pow(1-u,3),ei=u=>u*u,eio=u=>.5-.5*Math.cos(Math.PI*u);
const NS='http://www.w3.org/2000/svg';
/* roll path on the leaf: from just beside the navel, along a vein, to the rim (card coords, quadratic bezier) */
const P0=[LEAF.x+LEAF.nx-5,LEAF.y+LEAF.ny+9],P2=[DRIP[0]+.6,DRIP[1]-R0+1],P1=[lerp(P0[0],P2[0],.5)+5,lerp(P0[1],P2[1],.5)-2];
const bez=u=>[(1-u)*(1-u)*P0[0]+2*u*(1-u)*P1[0]+u*u*P2[0],(1-u)*(1-u)*P0[1]+2*u*(1-u)*P1[1]+u*u*P2[1]];
function dropShape(r,k){/* body circle radius r centred at 0,0; apex at (0,-k), k>=r */
 if(k<=r+.01)return `M0,${-r}A${r},${r} 0 1 1 0,${r}A${r},${r} 0 1 1 0,${-r}Z`;
 const e=cl((k-r)/(1.5*r)),c1x=lerp(.552*r,.18*r,e),c1y=lerp(-k,-k*.5,e),c2y=lerp(-.552*r,-.7*r,e);
 return `M0,${-k}C${c1x},${c1y} ${r},${c2y} ${r},0A${r},${r} 0 0 1 ${-r},0C${-r},${c2y} ${-c1x},${c1y} 0,${-k}Z`}
function setDrop(x,y,r,k,sx,sy,rot,sh,op){
 dBody.setAttribute('d',dropShape(r,k));
 dHi.setAttribute('cx',-.38*r);dHi.setAttribute('cy',-.42*r);dHi.setAttribute('rx',.28*r);dHi.setAttribute('ry',.17*r);
 dHi.setAttribute('transform',`rotate(-38 ${-.38*r} ${-.42*r})`);dHi2.setAttribute('cx',.3*r);dHi2.setAttribute('cy',-.6*r);dHi2.setAttribute('r',.08*r);
 const a=.62*r;dCau.setAttribute('d',`M${(a*Math.cos(.35)).toFixed(2)},${(a*Math.sin(.35)).toFixed(2)}A${a},${a} 0 0 1 ${(a*Math.cos(1.45)).toFixed(2)},${(a*Math.sin(1.45)).toFixed(2)}`);
 dCau.setAttribute('stroke-width',(.16*r).toFixed(2));
 dSh.setAttribute('rx',.95*r);dSh.setAttribute('ry',.5*r);dSh.setAttribute('cx',.22*r);dSh.setAttribute('cy',.62*r);dSh.style.opacity=sh;
 drop.style.opacity=op;drop.style.transform=`translate(${(x-20).toFixed(2)}px,${(y-44).toFixed(2)}px)`;
 const g=`translate(0 0) rotate(${rot.toFixed(1)}) scale(${sx.toFixed(3)} ${sy.toFixed(3)}) rotate(${(-rot).toFixed(1)})`;
 [dBody,dCau].forEach(e=>e.parentNode===drop&&e.setAttribute('transform',g));}
/* ---- v11 flowing ribbon staff. local glyph units = 1 staff space, origin = notehead centre, +y = down the staff ---- */
const SHARP=''' + json.dumps(GLYPHS['sharp']) + ''';
const HEAD='<ellipse cx="0" cy="0" rx=".6" ry=".42" transform="rotate(-22)"/>';
const GLY={
 qu:HEAD+'<path d="M.48,-.06H.6V-3.3H.48Z"/>',
 qd:HEAD+'<path d="M-.6,.06H-.48V3.3H-.6Z"/>',
 eu:HEAD+'<path d="M.48,-.06H.6V-3.3H.48Z"/><path d="M.6,-3.3C.66,-2.5 1.58,-2.15 1.42,-.95C1.36,-1.62 .98,-1.96 .6,-2.08Z"/>',
 ed:HEAD+'<path d="M-.6,.06H-.48V3.3H-.6Z"/><path d="M-.48,3.3C-.42,2.5 .5,2.15 .34,.95C.28,1.62 -.1,1.96 -.48,2.08Z"/>',
 s:'<path d="'+SHARP+'"/>'};
/* [s along ribbon, staff position (spaces from middle line, + = lower), kind]  kind: q/e note, b = beamed pair start (next item is its partner), # = sharp */
const PAT=[
 [[.16,1,'q'],[.245,-.5,'e'],[.33,.5,'b'],[.385,-.5,'p'],[.47,1.5,'q'],[.545,-1,'#'],[.575,-1,'q'],[.665,0,'e'],[.75,-1.5,'q']],
 [[.17,.5,'e'],[.26,1.5,'q'],[.35,-1,'#'],[.38,-1,'q'],[.47,0,'b'],[.525,1,'p'],[.62,-.5,'q'],[.71,.5,'e']],
 [[.16,-1,'q'],[.25,0,'b'],[.305,-1,'p'],[.395,1,'#'],[.425,1,'e'],[.52,-.5,'q'],[.61,1.5,'q'],[.70,0,'e'],[.775,-1,'q']]];
const X0=48,X1=560,G=8.6,NS0=120;
let SP=null;
function staffSetup(k){
 const pat=PAT[k%PAT.length],flip=k>=PAT.length?-1:1;stNotes.textContent='';const items=[];
 for(let i=0;i<pat.length;i++){const [sp,p0,kd]=pat[i],p=p0*flip;
  if(kd==='p')continue;
  const mk=g=>{const e=document.createElementNS(NS,'g');e.innerHTML=g;stNotes.appendChild(e);return e};
  if(kd==='#'){items.push({s:sp,p,el:mk(GLY.s),kind:'#'});continue}
  const up=p>=0;
  if(kd==='b'){const q=pat[i+1],p2=q[1]*flip;
   const bm=document.createElementNS(NS,'path');stNotes.appendChild(bm);
   items.push({s:sp,p,el:mk(up?GLY.qu:GLY.qd),kind:'q',up,beam:{s2:q[0],p2,el2:mk(up?GLY.qu:GLY.qd),bm}});continue}
  items.push({s:sp,p,el:mk(GLY[kd+(up?'u':'d')]),kind:kd,up})}
 SP={items,ph:[.6+k*1.3,1.9+k*.7,.4+k*2.1],amp:24+3*(k%2),cy:M.mid+2,six:cl((M.ix-X0)/(X1-X0),.1,.9)};
}
const TAU=Math.PI*2;
function cen(s,tau,w,ex){/* centre point, tangent, spacing and line half-width of the ribbon at parameter s */
 const P=SP.ph,f=s0=>SP.cy+w*(-13*Math.sin(Math.PI*1.2*s0)+SP.amp*(.22+.78*s0)*Math.sin(TAU*1.15*s0-TAU*.75*tau+P[1]));
 const x=X0+(X1-X0)*s,y=f(s),dy=(f(s+.004)-f(s-.004))/(.008*(X1-X0)),L=Math.hypot(1,dy),tx=1/L,ty=dy/L;
 const tw=1-w*.9*Math.pow(s,.55)*Math.pow(.5+.5*Math.sin(TAU*.9*s-TAU*.45*tau+P[2]),1.6);  /* ribbon turning edge-on: lines converge */
 const tap=1-.72*Math.pow(s,1.3);
 return {x,y,tx,ty,nx:-ty,ny:tx,g:G*tap*tw*(1-.4*ex),tap,tw,hw:Math.max(.27,.6*(1-.55*s)*(.7+.3*tw))}}
function inkAt(q){/* mirrors the stroke gradient: [opacity, colour] at fraction q of the visible ribbon */
 const op=q<.03?.92*q/.03:q<.55?lerp(.92,.85,(q-.03)/.52):q<.85?lerp(.85,.55,(q-.55)/.3):.55*(1-(q-.85)/.15);
 const c=q<.55?['#2F3E6E','#4C6294',q/.55]:['#4C6294','#93A7CB',(q-.55)/.45];
 const h=x=>parseInt(x,16),A=c[0],B=c[1],u=cl(c[2]);
 const ch=[1,3,5].map(i=>Math.round(lerp(h(A.substr(i,2)),h(B.substr(i,2)),u)));
 return [cl(op),'rgb('+ch.join(',')+')']}
function placeGlyph(el,c,p,u,dx,op,col){const X=c.x+c.nx*p*c.g+c.tx*dx*u,Y=c.y+c.ny*p*c.g+c.ty*dx*u;
 el.setAttribute('transform',`matrix(${(u*c.tx).toFixed(4)} ${(u*c.ty).toFixed(4)} ${(u*c.nx).toFixed(4)} ${(u*c.ny).toFixed(4)} ${X.toFixed(2)} ${Y.toFixed(2)})`);
 el.setAttribute('fill',col);el.style.opacity=op.toFixed(3);return [X,Y]}
function staffFrame(t){
 const fc=TF1,T0=fc+.12;
 if(!SP||t<T0||t>CYCLE-.02){ST.style.opacity=0;return}
 const r=eo(seg(t,T0,fc+.95));                          /* unspool outward from the bleed */
 const w=eio(seg(t,fc+.35,fc+1.3));                      /* flat (where the text lay) -> flowing */
 const ex=eio(seg(t,CYCLE-.9,CYCLE-.06));                /* drift up/right, thin out, pull through the tail */
 const tau=t-fc;
 let sa=SP.six*(1-r),sb=SP.six+(1-SP.six)*r;sa=Math.max(sa,.97*Math.pow(ex,1.25));
 if(sb-sa<.004){ST.style.opacity=0;return}
 ST.style.opacity=(1-Math.pow(ex,3)).toFixed(3);
 stWrap.setAttribute('transform',`translate(${(30*ex).toFixed(2)} ${(-13*ex).toFixed(2)})`);
 const n=Math.max(8,Math.round(NS0*(sb-sa))),C=[];
 for(let i=0;i<=n;i++)C.push(cen(sa+(sb-sa)*i/n,tau,w,ex));
 stGrad.setAttribute('x1',C[0].x.toFixed(1));stGrad.setAttribute('x2',C[n].x.toFixed(1));
 for(let j=0;j<5;j++){const o=j-2,A=[],B=[];
  for(const c of C){const px=c.x+c.nx*o*c.g,py=c.y+c.ny*o*c.g;A.push((px+c.nx*c.hw).toFixed(2)+','+(py+c.ny*c.hw).toFixed(2));B.push((px-c.nx*c.hw).toFixed(2)+','+(py-c.ny*c.hw).toFixed(2))}
  stL[j].setAttribute('d','M'+A.join('L')+'L'+B.reverse().join('L')+'Z')}
 const vis=s=>{const q=(s-sa)/(sb-sa);if(q<0||q>1)return [0,'#000'];const [o,col]=inkAt(q);return [o*cl((s-sa)/.025)*cl((sb-s)/.06),col]};
 /* clef at the head */
 {const s=.028,c=cen(s,tau,w,ex),[o,col]=vis(s+.02),u=c.g;placeGlyph(stClef,c,0,u,0,Math.min(1,o*1.06),col)}
 for(const it of SP.items){const c=cen(it.s,tau,w,ex),u=G*c.tap*(.82+.18*c.tw)*(1-.4*ex);let [o,col]=vis(it.s);
  const pop=cl(o/.6);const uu=u*(.7+.3*pop);
  placeGlyph(it.el,c,it.p,uu,0,o,col);
  if(it.beam){const b=it.beam,c2=cen(b.s2,tau,w,ex),u2=G*c2.tap*(.82+.18*c2.tw)*(1-.4*ex),[o2]=vis(b.s2),uu2=u2*(.7+.3*cl(o2/.6));
   placeGlyph(b.el2,c2,b.p2,uu2,0,o2,col);
   const sx=it.up?.54:-.54,sy=it.up?-3.3:3.3,tip=(cc,p,U)=>[cc.x+cc.nx*p*cc.g+(cc.tx*sx+cc.nx*sy)*U,cc.y+cc.ny*p*cc.g+(cc.ty*sx+cc.ny*sy)*U];
   const [ax,ay]=tip(c,it.p,uu),[bx,by]=tip(c2,b.p2,uu2),th=.46*uu,d=it.up?1:-1,nx=c.nx*th*d,ny=c.ny*th*d;
   b.bm.setAttribute('d',`M${(ax-c.tx*.06*uu).toFixed(2)},${ay.toFixed(2)}L${(bx+c2.tx*.06*uu2).toFixed(2)},${by.toFixed(2)}L${(bx+nx).toFixed(2)},${(by+ny).toFixed(2)}L${(ax+nx).toFixed(2)},${(ay+ny).toFixed(2)}Z`);
   b.bm.setAttribute('fill',col);b.bm.style.opacity=Math.min(o,o2).toFixed(3)}}
}
let cur=-1,M=null;
function setup(k){
 cur=k;const txt=LINES[k];line.textContent=txt;lineB.textContent=txt;
 line.style.webkitMaskImage=line.style.maskImage='none';
 line.style.fontSize=lineB.style.fontSize=FS+'px';
 if(line.offsetWidth>MAXW){const f=(FS*MAXW/line.offsetWidth).toFixed(1)+'px';line.style.fontSize=lineB.style.fontSize=f}
 const lw=line.offsetWidth,lx=Math.round((600-lw)/2),ly=line.offsetTop,lh=line.offsetHeight;
 line.style.left=lx+'px';lineB.style.left=(lx-40)+'px';lineB.style.top=(ly-40)+'px';
 const cr=card.getBoundingClientRect(),tn=line.firstChild,rg=document.createRange(),ch=[...txt];let off=0;const xs=[];
 for(const c of ch){rg.setStart(tn,off);rg.setEnd(tn,off+c.length);const r=rg.getBoundingClientRect();xs.push([r.left-cr.left,r.right-cr.left]);off+=c.length}
 const base=ly+lh*.5+16, mid=ly+lh*.5-2;
 const D=Math.min(2.95,1.25+.055*ch.length), pause=.03, wts=xs.map(([a,b])=>Math.pow(Math.max(4,b-a),.8)), sw=wts.reduce((a,b)=>a+b,0);
 let t=W0;const segs=xs.map((x,i)=>{const d=(D-pause*ch.length)*wts[i]/sw,s={a:t,b:t+d,x0:x[0],x1:x[1]};t+=d+pause;return s});
 M={lx,lw,ly,base,mid,segs,end:t,ix:DRIP[0],iy:mid};staffSetup(k);
}
function writeP(t){const S=M.segs;if(t<=S[0].a)return{p:S[0].x0,on:false,u:0};
 for(let i=0;i<S.length;i++){const s=S[i];if(t<s.a)return{p:S[i-1].x1,on:false,u:0};if(t<=s.b){const u=(t-s.a)/(s.b-s.a);return{p:s.x0+(s.x1-s.x0)*eio(u),on:true,u}}}
 return{p:S[S.length-1].x1+60,on:false,u:1}}
function leafAt(T){/* the leaf unfurls once at load: from a curled, turned bud to a flat spreading leaf */
 const u=seg(T,0,1.6),e=1-Math.pow(1-u,4);
 if(u>=1){if(leaf.style.transform)leaf.style.transform='';leaf.style.opacity=1;return}
 leaf.style.opacity=eo(seg(T,0,.35));
 leaf.style.transform=`perspective(600px) rotateX(${(58*(1-e)).toFixed(2)}deg) rotate(${(-24*(1-e)).toFixed(2)}deg) scale(${(.42+.58*e+.025*Math.sin(Math.PI*u)).toFixed(4)},${(.3+.7*e).toFixed(4)})`}
function frame(T){
 leafAt(T);
 const k=Math.floor(T/CYCLE)%LINES.length,t=T%CYCLE;if(k!==cur)setup(k);
 const {lx,lw,ly,base,mid,end,ix,iy}=M;
 const w=writeP(t),rel=w.p-lx;
 const fc=TF1;
 if(t<fc)line.style.webkitMaskImage=line.style.maskImage=(w.u>=1&&!w.on&&t>M.segs[M.segs.length-1].b)?'none':`linear-gradient(90deg,#000 ${rel-9}px,rgba(0,0,0,.35) ${rel-2}px,transparent ${rel+3}px)`;
 const nin=seg(t,.05,W0),nout=seg(t,end+.05,end+.6),no=nin*(1-nout);
 if(no>0){const bob=w.on?Math.sin(w.u*Math.PI*(3+(cur%2)))*9+Math.sin(T*23)*2:-5;
  const nx=w.p+nout*26-20,ny=mid+bob+nout*18-60;
  nib.style.opacity=no;nib.style.transform=`translate(${nx}px,${ny}px) rotate(${32+nout*16+Math.sin(T*9)*1.5}deg)`}else nib.style.opacity=0;
 /* dew drop */
 if(t>TB0&&t<fc+.07){
  if(t<TB1){const u=seg(t,TB0,TB1),g=eo(u),wob=1+.06*Math.sin(u*16)*(1-u);const r=Math.max(.3,R0*g);
   setDrop(P0[0],P0[1],r,r,wob,1/wob,0,.9*g,Math.min(1,u*3))}
  else if(t<TR1){const u=eio(seg(t,TB1,TR1)),p=bez(u),q=bez(Math.min(1,u+.02)),ang=Math.atan2(q[1]-p[1],q[0]-p[0])*180/Math.PI;
   const v=Math.sin(Math.PI*u),st=1+.1*v;                                   /* gentle stretch along the vein while it moves */
   setDrop(p[0],p[1],R0,R0,st,1/st,ang,.9,1)}
  else if(t<TH1){const u=seg(t,TR1,TH1),e=eio(u),r=R0*(1-.06*e);              /* slips over the rim and sags into a teardrop */
   const cy=lerp(P2[1],DRIP[1]+1.6*r,e)+.7*Math.sin(u*Math.PI*3)*(1-u)*e,apex=DRIP[1]-2,k=Math.max(r,cy-apex);
   setDrop(lerp(P2[0],DRIP[0],e),cy,r,k,1,1,0,.9*(1-eo(cl(e*1.6))),1)}
  else if(t<fc){const f=seg(t,TH1,fc),r=R0*.94,k=lerp(r*2.1,r*1.3,eo(cl(f*2.5)));
   const y0=DRIP[1]+1.6*R0*.94,y=y0+(iy-y0)*ei(f);
   setDrop(DRIP[0],y,r,k,1-.04*f,1+.06*f,0,0,1)}
  else{const f=seg(t,fc,fc+.07),r=R0*.94;setDrop(DRIP[0],iy+3*f,r,r*1.1,1+.8*f,1-.6*f,0,0,1-f)}
 }else drop.style.opacity=0;
 const rr=seg(t,fc,fc+.55);if(rr>0&&rr<1){const r=6+44*eo(rr);ring.style.opacity=.75*(1-rr);
  ring.style.transform=`translate(${ix-5}px,${iy+4-5}px) scale(${r/5},${r*.32/5})`;ring.style.borderWidth=(1.4/(r/5))+'px'}else ring.style.opacity=0;
 const b=seg(t,fc,fc+.95),R=(lw*1.05+40)*eo(b);
 if(t>=fc){const cx=ix-lx,cy=iy-ly;
  line.style.webkitMaskImage=line.style.maskImage=`radial-gradient(circle at ${cx}px ${cy}px,transparent ${R}px,#000 ${R+38}px)`;
  lineB.style.webkitMaskImage=lineB.style.maskImage=`radial-gradient(circle at ${cx+40}px ${cy+40}px,#000 ${R}px,transparent ${R+38}px)`;
  const fo=seg(t,fc+.45,fc+1.25);lineB.style.opacity=(1-fo)*.95;
  lineB.style.filter=`url(#bleedF) blur(${(1.2+5.5*eo(b)+3*fo).toFixed(2)}px)`;lineB.style.transform=`scale(${(1+.035*eo(b)).toFixed(4)},${(1+.035*eo(b)-.5*eo(fo)).toFixed(4)})`;  /* letters settle into the staff */
  disp.setAttribute('scale',(5+18*eo(b)).toFixed(1));
 }else{lineB.style.opacity=0}
 const bo=seg(t,fc,fc+.4),bf=seg(t,fc+1.2,fc+2.2);
 bloomEls.forEach((el,i)=>{const g=eo(seg(t,fc+i*.12,fc+1.4+i*.2)),bw=(i==0?lw*.62:lw*.38)*(.12+.88*g)+18,bh=bw*(i==0?.42:.5);
  const ox=i==0?0:(i==1?-1:1)*lw*.2*g;el.style.width=bw+'px';el.style.height=bh+'px';
  el.style.transform=`translate(${ix+ox-bw/2}px,${iy-bh/2+(i?4:0)}px)`;el.style.opacity=((i==0?.85:.6)*eo(bo)*(1-bf)).toFixed(3)});
 staffFrame(t);
}
function still(){setup(0);leaf.style.transform='';leaf.style.opacity=1;[nib,drop,ring,lineB].forEach(e=>e.style.opacity=0);bloomEls.forEach(e=>e.style.opacity=0);ST.style.opacity=0}
window.__v9frame=frame;window.__v10frame=frame;window.__v11frame=frame;
const go=()=>{if(RM.matches){still();return}const t0=performance.now();
 const loop=n=>{frame((n-t0)/1000);requestAnimationFrame(loop)};requestAnimationFrame(loop)};
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(go);
RM.addEventListener&&RM.addEventListener('change',()=>{if(RM.matches)location.reload()});
})();
</script>
'''

out = s[:s.find('<div class="scroll">')] + HERO + s[s.find('<div class="composer">'):]
out = out.replace('</head>', CSS + '</head>', 1)
k = out.rfind('</body>')
out = out[:k] + JS + out[k:]
open(OUT, 'w', encoding='utf-8').write(out)
assert 'Hand9' not in out and 'longcang' not in out.lower()
print('wrote', OUT, len(out), 'drip', DRIP, 'navel', NAVEL)
