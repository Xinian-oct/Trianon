(()=>{
/* ===================================================================================================
   engine v1 — engine states on top of the approved rococo v1 app.
   The Electron main process owns `demo-engine.exe serve`; the renderer only hears events. This layer listens to:
     engine.state   {state:'starting', phase:'locate'|'spawn'|'wait', path, pid, port}
                    {state:'ready'} {state:'reconnecting', attempt, retryIn}  (retryIn 0 = dialing now)
                    {state:'stopping'} {state:'failed', exitCode, at, uptime, log}
     events.resync  {restored?}      snapshot collation after subscribe (restored is counted from the DOM when absent)
     resync.failed  {reason}         e.g. not_found: the session subscription is not loaded yet, read the snapshot first
   window.__eng.emit(ev, payload) is the single entry; window.__eng.mock.* fakes the main process for the prototype.
   Every visual is a function of engine time (egT), so a scene still is just a frozen egT.
   =================================================================================================== */
const RM=matchMedia('(prefers-reduced-motion: reduce)');
const $=id=>document.getElementById(id);
const b=document.body;
const HASH=decodeURIComponent(location.hash.slice(1)).split(/[&,]/).filter(Boolean);
const has=k=>HASH.includes(k);
const cl=u=>Math.max(0,Math.min(1,u)),eo=u=>1-Math.pow(1-cl(u),3),eio=u=>{u=cl(u);return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let FROZEN=null;
const egT=()=>FROZEN!=null?FROZEN:performance.now()/1000;
const CHECK=window.__rkCheck||'✓';
const RK=()=>window.__rk;

/* ---------------------------------------------------------------- pieces */
const PATH='C:\\Users\\demo\\TrianonDemo\\demo-engine.exe',PORT=58231,PID=18424;
/* ---- engraving palette: one misty-blue line on cream, a little silver-blue and lotus ---- */
const L1='#4C5D88',L2='#8393B4',CR='#FCFAF6',LO='#EBDDE2',LR='#B48C9C';
const f1=n=>(+n).toFixed(2);
/* a concave four-point star, the reference's little spark */
const star4=(x,y,r,a='')=>`<path ${a} d="M${f1(x)},${f1(y-r)} Q${f1(x)},${f1(y)} ${f1(x+r)},${f1(y)} Q${f1(x)},${f1(y)} ${f1(x)},${f1(y+r)} Q${f1(x)},${f1(y)} ${f1(x-r)},${f1(y)} Q${f1(x)},${f1(y)} ${f1(x)},${f1(y-r)} Z"/>`;
/* a bead: pearl on a thread, outline + one highlight (no gloss) */
const bead=(x,y,r,lotus)=>`<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${lotus?LO:'#EEF1F6'}" stroke="${lotus?LR:L1}" stroke-width=".85"/><path d="M${f1(x-r*.5)},${f1(y-r*.15)} A${f1(r*.55)},${f1(r*.55)} 0 0 1 ${f1(x+r*.1)},${f1(y-r*.55)}" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round"/>`;
/* points along a quadratic curve */
const qpt=(p0,p1,p2,t)=>[(1-t)*(1-t)*p0[0]+2*(1-t)*t*p1[0]+t*t*p2[0],(1-t)*(1-t)*p0[1]+2*(1-t)*t*p1[1]+t*t*p2[1]];
/* a short bead strand: thread, 3 beads spaced wide, a star charm at the end */
const strand=(p0,p1,p2,r,ts,lot,sr)=>{const pe=qpt(p0,p1,p2,1);
  return `<path d="M${p0} Q${p1} ${p2}" fill="none" stroke="${L2}" stroke-width=".8" stroke-linecap="round"/>`+
   ts.map((t,i)=>{const p=qpt(p0,p1,p2,t);return bead(p[0],p[1],r,lot===i)}).join('')+
   `<g fill="${CR}" stroke="${L1}" stroke-width=".8" stroke-linejoin="round">${star4(pe[0],pe[1]+sr*.9,sr)}</g>`};
const ROM=['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
/* the engraved pocket watch (reference 1): bow, fluted crown, roman dial, breguet hands; optional hourglass of stars.
   R = case radius. Classes: w-h w-m w-s (hands) w-fl (crown fluting) w-hg (hourglass) w-sf (falling star). */
const engWatch=({R,full,hg})=>{const k=R/26;const s=v=>f1(v*k);let o='';
  /* bow + neck + crown */
  o+=`<g fill="none" stroke="${L1}" stroke-linecap="round" stroke-linejoin="round">
   <ellipse cx="0" cy="${s(-37.6)}" rx="${s(6.2)}" ry="${s(5)}" stroke-width="${f1(1.25*Math.max(k,.8))}"/>
   <ellipse cx="0" cy="${s(-37.6)}" rx="${s(4.1)}" ry="${s(3)}" stroke="${L2}" stroke-width=".6"/>
   <rect x="${s(-4.8)}" y="${s(-33.4)}" width="${s(9.6)}" height="${s(5.6)}" rx="${s(1.3)}" fill="${CR}" stroke-width="${f1(1.05*Math.max(k,.8))}"/>
   <g class="w-fl" stroke="${L2}" stroke-width=".6"></g>
   <path d="M${s(-3)},${s(-27.9)} h${s(6)} l${s(.6)},${s(2.4)} h${s(-7.2)} Z" fill="${CR}" stroke-width=".85"/></g>`;
  /* case: outer rim, bezel line, sparse bezel pips */
  o+=`<circle r="${s(26)}" fill="${CR}" stroke="${L1}" stroke-width="${f1(1.35*Math.max(k,.75))}"/>
   <circle r="${s(23.9)}" fill="none" stroke="${L2}" stroke-width=".7"/>`;
  if(full){o+=`<circle r="${s(21.7)}" fill="none" stroke="${L2}" stroke-width=".5"/>`;
    o+='<g fill="'+L1+'" font-family="CormI,serif" font-style="normal" font-size="'+s(5.1)+'" text-anchor="middle">'+ROM.map((n,i)=>{const a=i*Math.PI/6,rr=s(18.3);
      return `<text x="${f1(Math.sin(a)*rr)}" y="${f1(-Math.cos(a)*rr+1.7*k)}" transform="rotate(${i*30} ${f1(Math.sin(a)*rr)} ${f1(-Math.cos(a)*rr)})">${n}</text>`}).join('')+'</g>';
    o+=`<g stroke="${L1}" stroke-width=".7" stroke-linecap="round">`+[...Array(12)].map((_,i)=>{const a=i*Math.PI/6;return `<path d="M${f1(Math.sin(a)*s(21.7))},${f1(-Math.cos(a)*s(21.7))} L${f1(Math.sin(a)*s(23.4))},${f1(-Math.cos(a)*s(23.4))}"/>`}).join('')+'</g>';
    o+=`<circle r="${s(13.6)}" fill="none" stroke="${L2}" stroke-width=".4" stroke-dasharray="1.2 3.2"/>`}
  else{o+=`<circle r="${s(20.4)}" fill="none" stroke="${L2}" stroke-width=".5"/>`;
    o+='<g fill="'+L1+'" font-family="CormI,serif" font-size="'+s(7.6)+'" text-anchor="middle">'+[0,3,6,9].map(i=>{const a=i*Math.PI/6,rr=s(15.6);
      return `<text x="${f1(Math.sin(a)*rr)}" y="${f1(-Math.cos(a)*rr+2.5*k)}">${ROM[i]}</text>`}).join('')+'</g>';
    o+=`<g fill="${L2}">`+[1,2,4,5,7,8,10,11].map(i=>{const a=i*Math.PI/6;return `<circle cx="${f1(Math.sin(a)*s(16.6))}" cy="${f1(-Math.cos(a)*s(16.6))}" r=".75"/>`}).join('')+'</g>'}
  /* hourglass of stars at six */
  if(hg){o+=`<g class="w-hg" transform="translate(0 ${s(8.2)})" fill="none" stroke="${L1}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M${s(-4.6)},${s(-5.9)} h${s(9.2)} M${s(-4.6)},${s(5.9)} h${s(9.2)}" stroke-width="1"/>
    <path d="M${s(-3.5)},${s(-5)} C${s(-3.5)},${s(-1.6)} ${s(-.75)},${s(-1)} ${s(-.75)},0 C${s(-.75)},${s(1)} ${s(-3.5)},${s(1.6)} ${s(-3.5)},${s(5)} M${s(3.5)},${s(-5)} C${s(3.5)},${s(-1.6)} ${s(.75)},${s(-1)} ${s(.75)},0 C${s(.75)},${s(1)} ${s(3.5)},${s(1.6)} ${s(3.5)},${s(5)}" stroke-width=".7"/>
    <path d="M${s(-4.3)},${s(-5.9)} v${s(11.8)} M${s(4.3)},${s(-5.9)} v${s(11.8)}" stroke="${L2}" stroke-width=".55"/>
    <g fill="${L1}" stroke="none"><g class="w-st0">${star4(-1.3*k,-3.1*k,1.25*k)}</g><g class="w-st1">${star4(1.35*k,-2.6*k,1.05*k)}</g>
     <g class="w-sb0">${star4(-1.4*k,3.9*k,1.15*k)}</g><g class="w-sb1">${star4(1.5*k,3.6*k,1.25*k)}</g><g class="w-sf">${star4(0,0,.95*k)}</g></g></g>`}
  /* breguet hands */
  o+=`<g class="w-h"><path d="M0,${s(2.4)} L0,${s(-6.2)}" stroke="${L1}" stroke-width="${f1(1.5*Math.max(k,.8))}" stroke-linecap="round"/><circle cy="${s(-7.8)}" r="${s(1.7)}" fill="${CR}" stroke="${L1}" stroke-width=".9"/><path d="M0,${s(-9.5)} L0,${s(-11)}" stroke="${L1}" stroke-width="1" stroke-linecap="round"/></g>
   <g class="w-m"><path d="M0,${s(3)} L0,${s(-12.4)}" stroke="${L1}" stroke-width="${f1(1*Math.max(k,.8))}" stroke-linecap="round"/><circle cy="${s(-13.6)}" r="${s(1.2)}" fill="${CR}" stroke="${L1}" stroke-width=".75"/><path d="M0,${s(-14.8)} L0,${s(-17.2)}" stroke="${L1}" stroke-width=".75" stroke-linecap="round"/></g>
   <g class="w-s"><path d="M0,${s(4.4)} L0,${s(-18.4)}" stroke="${LR}" stroke-width=".65" stroke-linecap="round"/></g>
   <circle r="${s(1.7)}" fill="${L1}"/><circle r="${s(.65)}" fill="${CR}"/>`;
  return o};
/* tag watch (inside the hanging tag): 4 numerals, no hourglass */
const watchSVG=()=>`<svg width="46" height="56" viewBox="-23 -31 46 56" aria-hidden="true"><g transform="translate(0 2)">${engWatch({R:17,full:false,hg:false})}</g></svg>`;
/* the composer watch: full roman dial, hourglass of stars, a bead chain off the bow, progress ring and arched script below */
const EW_R=26;
const ewSVG=()=>`<svg width="120" height="120" viewBox="-60 -56 120 120" aria-hidden="true">
 <defs><path id="egArcP" d="M-44,4 A44,44 0 0 0 44,4"/></defs>
 <g class="ew-ring"><circle r="31.5" fill="none" stroke="rgba(131,147,180,.35)" stroke-width=".8"/>
  <circle class="ew-arc" r="31.5" fill="none" stroke="#6F82AC" stroke-width="1.5" stroke-linecap="round" transform="rotate(-90)" stroke-dasharray="0 400"/>
  <g class="ew-tip"><g fill="${CR}" stroke="${L1}" stroke-width=".8" stroke-linejoin="round">${star4(0,-31.5,3.6)}</g></g></g>
 <g class="ew-chain">${strand([5.5,-39],[33,-34],[40,-4],2.7,[.3,.55,.79],1,4.3)}</g>
 ${engWatch({R:EW_R,full:true,hg:true})}
 <text class="ew-txt" transform="rotate(-13)" font-family="Pinyon,serif" font-size="9.8" fill="#4C5D88" letter-spacing=".3"><textPath href="#egArcP" startOffset="50%" text-anchor="middle">Remontage · le temps se remonte</textPath></text></svg>`;
/* the key-ring hardware above the tag: tack, split ring, jump ring, bow, one short bead strand */
const TW=226,CX=TW/2,TOP=46;
const hwSVG=()=>`<svg class="eg-hw" width="${TW}" height="76" viewBox="0 0 ${TW} 76" aria-hidden="true">
 <g class="hw-strand">${strand([CX+10.5,28.5],[CX+30,64],[CX+64,64],3.8,[.27,.52,.76],1,5.6)}</g>
 <g transform="translate(${CX} 4) scale(1.2) translate(${-CX} -4)"><g fill="none" stroke-linecap="round">
  <circle cx="${CX}" cy="18.6" r="10.4" stroke="#EEF1F6" stroke-width="2.6"/>
  <circle cx="${CX}" cy="18.6" r="11.8" stroke="${L1}" stroke-width="1.15"/>
  <circle cx="${CX}" cy="18.6" r="9" stroke="${L2}" stroke-width=".75"/>
  <path d="M${f1(CX-11.3)},${f1(21.8)} A11.8,11.8 0 0 0 ${f1(CX-3)},${f1(30.1)}" stroke="${L1}" stroke-width=".7" transform="translate(1.4 -1.1)"/>
  <path d="M${f1(CX-6)},11 A8,8 0 0 1 ${f1(CX+3.5)},10.6" stroke="#fff" stroke-width=".9"/>
  <ellipse cx="${CX}" cy="36.4" rx="3.5" ry="8.4" stroke="#EEF1F6" stroke-width="2"/>
  <ellipse cx="${CX}" cy="36.4" rx="4.4" ry="9.2" stroke="${L1}" stroke-width="1"/>
  <ellipse cx="${CX}" cy="36.4" rx="2.6" ry="7.5" stroke="${L2}" stroke-width=".6"/></g>
 <circle cx="${CX}" cy="4" r="3.3" fill="#EEF1F6" stroke="${L1}" stroke-width="1"/><circle cx="${CX-1}" cy="3" r=".9" fill="#fff"/>
 <g class="hw-bow" stroke="${L1}" stroke-width=".95" stroke-linejoin="round" stroke-linecap="round">
  <path d="M${CX-2.6},38 C${CX-9},44 ${CX-11},50 ${CX-9.5},53.5 L${CX-6.4},50.6 L${CX-4.2},53.2 C${CX-4.2},48.5 ${CX-2.6},43 ${CX-1},39" fill="${LO}"/>
  <path d="M${CX+2.6},38 C${CX+9},44 ${CX+11},50 ${CX+9.5},53.5 L${CX+6.4},50.6 L${CX+4.2},53.2 C${CX+4.2},48.5 ${CX+2.6},43 ${CX+1},39" fill="${LO}"/>
  <path d="M${CX-2.2},36.4 C${CX-8},30 ${CX-16},30.4 ${CX-15.6},36.4 C${CX-15.2},42 ${CX-7},41.6 ${CX-2.2},37.8 Z" fill="${LO}"/>
  <path d="M${CX+2.2},36.4 C${CX+8},30 ${CX+16},30.4 ${CX+15.6},36.4 C${CX+15.2},42 ${CX+7},41.6 ${CX+2.2},37.8 Z" fill="${LO}"/>
  <path d="M${CX-12.4},35.4 C${CX-10},34.2 ${CX-6.5},35 ${CX-4.2},36.6 M${CX+12.4},35.4 C${CX+10},34.2 ${CX+6.5},35 ${CX+4.2},36.6" fill="none" stroke="${LR}" stroke-width=".6"/>
  <rect x="${CX-2.9}" y="34" width="5.8" height="6" rx="1.8" fill="#F6EEF1"/></g></g></svg>`;
/* the photo-frame tag body: arched crest with an eyelet, double rule, sparse stitch, two corner sparks. Drawn to size. */
const crestPath=(W,H,d,c)=>{const r=Math.max(3,11-d*.7),x0=d,x1=W-d,y0=c+d,y1=H-d,hw=46-d*.8,ct=d*.95;
  return `M${f1(x0+r)},${f1(y0)} L${f1(W/2-hw)},${f1(y0)} C${f1(W/2-hw+15)},${f1(y0)} ${f1(W/2-24+d*.3)},${f1(ct)} ${f1(W/2)},${f1(ct)} C${f1(W/2+24-d*.3)},${f1(ct)} ${f1(W/2+hw-15)},${f1(y0)} ${f1(W/2+hw)},${f1(y0)} L${f1(x1-r)},${f1(y0)} Q${f1(x1)},${f1(y0)} ${f1(x1)},${f1(y0+r)} L${f1(x1)},${f1(y1-r)} Q${f1(x1)},${f1(y1)} ${f1(x1-r)},${f1(y1)} L${f1(x0+r)},${f1(y1)} Q${f1(x0)},${f1(y1)} ${f1(x0)},${f1(y1-r)} L${f1(x0)},${f1(y0+r)} Q${f1(x0)},${f1(y0)} ${f1(x0+r)},${f1(y0)} Z`};
const frameSVG=(W,H,rose)=>{const c=13,ln=rose?'#A98393':'#7D8DB0',ln2=rose?'rgba(185,144,158,.62)':'rgba(125,141,176,.6)',st=rose?'rgba(185,144,158,.75)':'rgba(131,147,180,.72)';
  return `<svg class="eg-frame" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">
  <path d="${crestPath(W,H,.65,c)}" fill="url(#egPaperG)" stroke="${ln}" stroke-width="1.3"/>
  <path d="${crestPath(W,H,4.4,c)}" fill="none" stroke="${ln2}" stroke-width=".8"/>
  <path d="${crestPath(W,H,8.2,c)}" fill="none" stroke="${st}" stroke-width=".9" stroke-dasharray="5 5.5" stroke-linecap="round"/>
  <g fill="${rose?'#C9A3B1':'#9AA8C6'}">${star4(17.5,H-17.5,3)}${star4(W-17.5,H-17.5,3)}</g>
  <circle cx="${W/2}" cy="7.4" r="3.1" fill="#E4E9F1" stroke="${ln}" stroke-width="1"/></svg>`};
const sealSVG=`<svg width="62" height="62" viewBox="-31 -31 62 62" aria-hidden="true"><defs>
 <radialGradient id="egSx" cx="38%" cy="32%" r="80%"><stop offset="0" stop-color="#E2C3CC"/><stop offset=".55" stop-color="#C799A7"/><stop offset="1" stop-color="#A9788A"/></radialGradient></defs>
 <path d="M0,-27 C8,-28 14,-24 19,-19 C25,-14 28,-7 27,1 C29,9 25,16 19,21 C13,27 5,28 -2,27 C-10,28 -17,24 -21,18 C-27,12 -28,4 -27,-3 C-28,-11 -23,-18 -17,-22 C-12,-26 -6,-27 0,-27 Z" fill="url(#egSx)"/>
 <circle r="17.5" fill="none" stroke="rgba(120,70,90,.35)" stroke-width="1.6"/><circle r="17.5" fill="none" stroke="rgba(255,240,244,.35)" stroke-width=".6" transform="translate(-.6 -.6)"/>
 <g fill="none" stroke="rgba(110,62,80,.62)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M-6,-10 h12 M-6,10 h12 M-4.6,-10 C-4.6,-3 -1,-2 -1,0 C-1,2 -4.6,3 -4.6,10 M4.6,-10 C4.6,-3 1,-2 1,0 C1,2 4.6,3 4.6,10"/></g>
 <path d="M-8,-17 C-3,-20 4,-20 9,-17" fill="none" stroke="rgba(255,240,244,.45)" stroke-width="1.2" stroke-linecap="round"/></svg>`;
/* an oval badge (reference 1, "SINCE 1998"): double rule, small caps over a value */
const badge=(cap,val,rose)=>`<span class="eg-badge${rose?' r':''}"><i>${cap}</i><b>${val}</b></span>`;
/* the little hang tag that hangs off a letter's corner: thread, one bead, one star, a stitched label */
const miniTag=(em,val)=>`<i class="eg-mt" aria-hidden="true"><svg width="40" height="34" viewBox="0 0 40 34"><path d="M3,2 Q10,16 21,29" fill="none" stroke="${L2}" stroke-width=".8"/>${bead(10.6,15.5,2.7,true)}<g fill="${CR}" stroke="${L1}" stroke-width=".75">${star4(5.6,7.6,3.2)}</g></svg><span class="eg-mtb"><em>${em}</em><b>${val}</b></span></i>`;
/* interrupted plan mark: a hollow spark cut through */
const INTR=`<svg class="eg-ix" viewBox="-8 -8 16 16" width="15" height="15" aria-label="中断"><g fill="#F6EDF0" stroke="#A9788A" stroke-width="1.15" stroke-linejoin="round" stroke-linecap="round">
 <path d="M-1.9,-6.6 Q-1.4,-1.6 -6.3,-.6 L-3.2,.9 Q-1.6,1.9 -1.9,5.9 Z" transform="translate(-1.1 .9)"/><path d="M1.9,-6.1 Q1.6,-1.9 3.2,-.9 L6.3,.6 Q1.4,1.6 1.9,6.6 Z" transform="translate(1.1 -.9)"/></g></svg>`;
const caret=`<svg width="10" height="10" viewBox="-5 -5 10 10"><path d="M-1.6,-3.4 L2,0 L-1.6,3.4" fill="none" stroke="#5B6C93" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* ---------------------------------------------------------------- DOM */
const defs=document.createElementNS('http://www.w3.org/2000/svg','svg');defs.setAttribute('width','0');defs.setAttribute('height','0');defs.style.position='absolute';
defs.innerHTML='<defs><linearGradient id="egPaperG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FDFBF7"/><stop offset="1" stop-color="#F7F3EC"/></linearGradient></defs>';b.appendChild(defs);
const tag=document.createElement('div');tag.id='egTag';tag.setAttribute('role','status');tag.setAttribute('aria-live','polite');
tag.innerHTML=hwSVG()+'<div class="eg-card"><i class="eg-fw"></i><div class="eg-in"></div></div>';tag.style.visibility='hidden';
b.appendChild(tag);const tagIn=tag.querySelector('.eg-in'),tCard=tag.querySelector('.eg-card'),tFw=tag.querySelector('.eg-fw'),tHw=tag.querySelector('.eg-hw'),tStrand=tag.querySelector('.hw-strand');
const send=document.querySelector('.send');
const ew=document.createElement('i');ew.className='eg-ew';ew.innerHTML=ewSVG();send.appendChild(ew);
const s3=document.createElement('span');s3.className='sl eg-s3';s3.textContent='Remontage';send.appendChild(s3);
const arc=ew.querySelector('.ew-arc'),tip=ew.querySelector('.ew-tip'),ewRing=ew.querySelector('.ew-ring'),ewTxt=ew.querySelector('textPath'),ewTxtEl=ew.querySelector('.ew-txt'),ewChain=ew.querySelector('.ew-chain');
const flute=(g,R,ph)=>{const k=R/26,w=9.6*k,n=4,sp=w/(n+.2);let o='';for(let i=0;i<n;i++){let x=-w/2+sp*(i+.6)+((ph%1)*sp);if(x>w/2-.6)x-=w-.6;o+=`<path d="M${f1(x)},${f1(-32.6*k)} V${f1(-28.6*k)}"/>`}g.innerHTML=o};
const ewR={h:ew.querySelector('.w-h'),m:ew.querySelector('.w-m'),s:ew.querySelector('.w-s'),fl:ew.querySelector('.w-fl'),sf:ew.querySelector('.w-sf'),
  st0:ew.querySelector('.w-st0'),st1:ew.querySelector('.w-st1'),sb0:ew.querySelector('.w-sb0'),sb1:ew.querySelector('.w-sb1'),R:EW_R};
flute(ewR.fl,EW_R,0);
const vLive=$('vLive'),thLive=$('thLive'),row=$('rkRow'),col=row.querySelector('.col'),dsL=$('dsLive');
const sweep=document.createElement('div');sweep.id='egSweep';sweep.innerHTML='<i class="ln"></i><span class="lb">collation</span><span class="st">✦</span>';vLive.appendChild(sweep);
const chip=document.createElement('div');chip.id='egChip';chip.style.display='none';row.style.position='relative';row.appendChild(chip);
const secs=[...dsL.querySelectorAll('.sec')].map(s=>{const h=s.querySelector('h5');const l=document.createElement('i');l.className='eg-cl';const m=document.createElement('i');m.className='eg-cm';m.textContent='calibré';h.appendChild(l);h.appendChild(m);return {h,l,m,sm:h.querySelector('small')}});
const slip=$('slip'),wt1=$('rkWt1');const WT1=wt1?wt1.innerHTML:'';
const vst=document.createElement('div');vst.className='eg-vst';vst.innerHTML='<b>作废</b><em>Annulé</em>';slip.appendChild(vst);
const egPen=document.createElement('span');egPen.className='pen12 eg-pen';egPen.style.display='none';egPen.innerHTML='<em>Kimi</em>笔停住了<i class="eg-dot"></i>';
$('rkWho').appendChild(egPen);

/* incident letter */
const LOG=[
 ['22:41:06.904','INFO ','i','demo  example session connected · event 214'],
 ['22:41:06.958','INFO ','i','demo  example approval requested for demo-file.ts'],
 ['22:41:07.212','WARN ','e','demo  example context notice'],
 ['22:41:07.388','FATAL','f','Demo fatal exception: example error'],
 ['','','p','Demo stack (fictional example):'],
 ['','','p','  File "demo\\renderer.py", line 42 in render_frame'],
 ['','','p','  File "demo\\runtime.py", line 84 in run_demo'],
 ['','','p','  File "demo\\event_loop.py", line 12 in tick'],
 ['22:41:07.402','EXIT ','f','demo-engine.exe exited · demo code 1']];
const logHTML=LOG.map(([t,l,c,m])=>c==='p'?`<span class="ln p">${m}</span>`:`<span class="ln"><span class="t">${t}</span> <span class="${c}">${l}</span> ${m}</span>`).join('');
const crash=document.createElement('div');crash.className='eg-letter';crash.id='egCrash';crash.style.display='none';crash.setAttribute('role','alert');
crash.innerHTML=`<i class="eg-seal">${sealSVG}</i>${miniTag('heure','22:41:07')}<div class="sl-paper"><i class="eg-corner"></i>
 <div class="eg-full">
  <div class="eg-l-eb"><em>Accident</em><span>引 擎 停 了</span></div>
  <h3 class="eg-l-tt"><code>demo-engine.exe</code> 意外退出了</h3>
  <div class="eg-meta">${badge('退出码','DEMO-01',1)}${badge('运行时长','6′12″')}<span class="eg-mm">pid ${PID}<br>demo-engine.exe serve</span></div>
  <div class="eg-void"><em>Annulé</em>这一回合停在半路：<b>1 个等待中的审批</b>（修改 demo-file.ts）已作废，重启后不会自动执行。已经写下的内容都还在，重启后会用快照对齐。</div>
  <div class="eg-log"><div class="eg-lh" role="button" tabindex="0" aria-expanded="false"><span class="eg-cv">${caret}</span><span>最后一条日志</span><code>Demo fatal exception: example error</code></div>
   <div class="eg-lw"><div class="eg-lb">${logHTML}</div></div></div>
  <div class="sl-act"><button class="sl-ok eg-rs" type="button"><b>重新启动引擎</b><kbd>Enter</kbd></button><button class="sl-all eg-lg" type="button">查看日志</button><button class="sl-all eg-cp" type="button">复制诊断</button></div>
 </div>
 <div class="rec"><i class="rk">${window.__rkCk||'✓'}</i><em>Redémarré</em><span class="rw">引擎已重新启动</span><span>· 这一回合停在审批处，可以重新发送</span><span class="rr">22:41</span></div></div>`;
col.appendChild(crash);
const cPaper=crash.querySelector('.sl-paper'),cFull=crash.querySelector('.eg-full'),cRec=crash.querySelector('.rec'),cSeal=crash.querySelector('.eg-seal');
const lh=crash.querySelector('.eg-lh'),lw=crash.querySelector('.eg-lw'),lcv=crash.querySelector('.eg-cv');
const rsB=crash.querySelector('.eg-rs'),lgB=crash.querySelector('.eg-lg'),cpB=crash.querySelector('.eg-cp');
/* snapshot notice (resync.failed) */
const note=document.createElement('div');note.className='eg-letter notice';note.id='egNote';note.style.display='none';note.setAttribute('role','alert');
note.innerHTML=`${miniTag('séance','7f3a…c21')}<div class="sl-paper"><div class="eg-full">
  <div class="eg-l-eb"><em>Collation</em><span>快 照 没 对 上</span></div>
  <h3 class="eg-l-tt">断线那几秒的内容补不回来</h3>
  <div class="eg-meta">${badge('原因','not_found',1)}${badge('事件','resync.failed')}<span class="eg-mm">session 7f3a…c21<br>订阅还没加载</span></div>
  <p class="eg-p">上面停住的那条消息后面可能缺了一段。从快照重新载入会以引擎的记录为准，把这段对话整理一遍；你写到一半的字不会丢。</p>
  <div class="sl-act"><button class="sl-ok eg-rl" type="button"><b>从快照重新载入此会话</b></button><button class="sl-all eg-later" type="button">先这样</button><span class="eg-note" style="margin-left:auto">GET example.com/demo/snapshot</span></div>
 </div>
 <div class="rec"><i class="rk">${window.__rkCk||'✓'}</i><em>Rechargé</em><span class="rw">已从快照重新载入</span><span class="rr">22:39</span></div></div>`;
col.appendChild(note);
const nPaper=note.querySelector('.sl-paper'),nFull=note.querySelector('.eg-full'),nRec=note.querySelector('.rec');

/* ---------------------------------------------------------------- state */
const E={mode:'ready',since:-99,tagVis:0,tagT:-99,boot:{ph:0,phT:-99,durs:[1.3,1.5,2.2],health:''},
  rc:{attempt:0,retryAt:0,retryDur:1,dialing:false},rs:null,crash:null,note:null,hold:null,log:{v:0,from:0,to:0,t0:-99},
  hint:-99,marks:{},cause:null,swap:-99,lastHTML:''};
const ROSE={failed:1,resyncfail:1};
const setMode=(m)=>{if(E.mode!==m){E.mode=m;E.since=egT();E.swap=egT()}};
const showTag=v=>{if(E.tagVis!==v){E.tagVis=v;E.tagT=egT()}};
const blocked=()=>E.mode!=='ready'&&E.mode!=='resync';
window.__engBlock=()=>{if(blocked()){E.hint=egT();return true}return false};
window.__engHalt=false;

/* ---------------------------------------------------------------- tag content per mode */
const stepRow=(i,lb,dt,ph)=>{const st=i<ph?'ok':i===ph?'now':'todo';return `<div class="eg-st ${st}"><span class="mk">${st==='ok'?CHECK:st==='now'?'✦':'◇'}</span><span class="lb">${lb}</span><span class="dt">${dt}</span></div>`};
const tagHTML=()=>{const m=E.mode,t=egT();
  if(m==='boot'){const ph=E.boot.ph;
    return `<div class="eg-body"><div class="eg-w">${watchSVG()}</div><div class="eg-hd"><em>Remontage</em><b>引擎正在上发条</b>
      <div class="eg-sub">${E.cause==='restart'?'重新启动 · 第 2 次':'冷启动'} · <span class="eg-n">${Math.min(ph+1,3)}</span>/3</div></div>
      <div class="eg-steps">${stepRow(0,'找到 demo-engine.exe','~\\TrianonDemo\\demo-engine.exe',ph)}${stepRow(1,'启动 demo-engine serve',ph>=1?`pid ${PID} · 端口 ${PORT}`:'demo-engine.exe serve --port auto',ph)}${stepRow(2,'等待服务就绪',ph>=3?`200 · demo/health`:`GET example.com/demo/health`,ph)}</div>
      <div class="eg-hint" data-h><em>patience</em>写好的字先替你留着，就绪就能发</div></div>`}
  if(m==='ready')return `<div class="eg-body"><div class="eg-w">${watchSVG()}</div><div class="eg-hd"><em>En marche</em><b>引擎就绪</b><div class="eg-mono">example.com:${PORT}</div></div></div>`;
  if(m==='stopping')return `<div class="eg-body"><div class="eg-w">${watchSVG()}</div><div class="eg-hd"><em>Rangement</em><b>收拾旧进程</b><div class="eg-sub">清理旧订阅 · <span class="eg-n">3</span> 组</div><div class="eg-mono">kill pid ${PID}</div></div></div>`;
  if(m==='reconnect'){const r=E.rc;
    return `<div class="eg-body"><div class="eg-w">${watchSVG()}</div><div class="eg-hd"><em>Reconnexion</em><b>连接断了，正在重连</b>
      <div class="eg-sub">第 <span class="eg-n">${esc(r.attempt)}</span> 次 · <span data-cd>${r.dialing?'正在连接…':''}</span></div>
      <div class="eg-mono">wss://example.com/demo/socket</div></div></div>
      <div class="eg-foot"><span>已有的消息都还在</span><button class="eg-go" type="button" data-now${r.dialing?' style="visibility:hidden"':''}>立即重试</button></div><div class="eg-bar"><i data-bar></i></div>`}
  if(m==='resync'){const r=E.rs;const n=r&&r.n!=null?r.n:null;
    return `<div class="eg-body"><div class="eg-w">${watchSVG()}</div><div class="eg-hd"><em>Collation</em><b>用快照校对这段对话</b>
      <div class="eg-sub">${n==null?'对齐中…':n>0?`已补回 <span class="eg-n">${esc(n)}</span> 条`:'已对齐，没有缺漏'}</div><div class="eg-mono">events.resync</div></div></div>`}
  if(m==='resyncfail')return `<div class="eg-body"><div class="eg-w">${watchSVG()}</div><div class="eg-hd"><em>Collation</em><b>快照没对上</b><div class="eg-sub">需要从快照重新载入</div><div class="eg-mono">resync.failed</div></div></div>`;
  if(m==='failed')return `<div class="eg-body"><div class="eg-w">${watchSVG()}</div><div class="eg-hd"><em>Halte</em><b>引擎停了</b><div class="eg-sub">退出码 <span class="eg-n">DEMO-01</span></div><div class="eg-mono">demo-engine.exe · 22:41:07</div></div></div>`;
  return ''};
let tagRefs={};
const renderTag=()=>{const h=tagHTML();if(h===E.lastHTML)return;E.lastHTML=h;tagIn.innerHTML=h;tag.classList.toggle('rose',!!ROSE[E.mode]);
  const w=tagIn.querySelector('.eg-w svg');tagRefs={h:tagIn.querySelector('.w-h'),m:tagIn.querySelector('.w-m'),s:tagIn.querySelector('.w-s'),fl:tagIn.querySelector('.w-fl'),R:17,
    cd:tagIn.querySelector('[data-cd]'),bar:tagIn.querySelector('[data-bar]'),hint:tagIn.querySelector('[data-h]')};
  const nb=tagIn.querySelector('[data-now]');if(nb)nb.addEventListener('click',()=>mock.retryNow());
  if(w)w.querySelectorAll('[id]').forEach(()=>0)};

/* ---------------------------------------------------------------- per-frame drawing */
const HH=320.5,MM=246;   // 22:41 on the watch
/* one routine drives both engraved watches (tag + composer) */
const drawWatch=(R,t,o={})=>{if(!R||!R.h)return;const a=t-E.since,m=E.mode,rm=RM.matches;let h=HH,mi=MM,s=null,fl=0;
  if(m==='boot'){mi=rm?MM:MM+a*200;h=HH+a*200/12;fl=rm?0:a*1.6}
  else if(m==='reconnect'){const sec=Math.floor(a),f=a%1;s=rm?0:(sec+Math.min(1,eo(f/.12)*1.08))*6*5}
  else if(m==='resync'){const u=rm?1:eio(a/1.3);mi=MM-360*u;h=HH-30*u}
  else if(m==='failed'){s=137}
  else if(m==='resyncfail'){s=200}
  R.h.setAttribute('transform',`rotate(${h.toFixed(1)})`);R.m.setAttribute('transform',`rotate(${mi.toFixed(1)})`);
  R.s.style.display=s==null?'none':'';if(s!=null)R.s.setAttribute('transform',`rotate(${s.toFixed(1)})`);
  if(R.fl&&(R._fl==null||Math.abs(R._fl-fl)>.01)){R._fl=fl;flute(R.fl,R.R,fl)}
  if(R.sf){const p=o.p||0,boot=m==='boot'||m==='stopping',k=R.R/26;
    const vis=(el,v)=>{el.style.opacity=v.toFixed(3)};
    if(boot){vis(R.st0,1-cl((p-.45)/.12));vis(R.st1,1-cl((p-.8)/.12));vis(R.sb0,cl((p-.25)/.12));vis(R.sb1,cl((p-.62)/.12));
      const c=rm?.5:((t-E.since)/.8)%1;R.sf.setAttribute('transform',`translate(0 ${((-1+4.6*eio(c))*k).toFixed(2)})`);vis(R.sf,rm?0:Math.sin(Math.PI*c))}
    else{vis(R.st0,1);vis(R.st1,m==='ready'||m==='resync'?1:0);vis(R.sb0,m==='ready'||m==='resync'?0:1);vis(R.sb1,0);vis(R.sf,0)}}};
/* the tag's swing as a function of time, so the bead strand can lag behind it */
const swingAt=t=>{const rm=RM.matches;if(rm)return 0;const vis=E.tagVis,a=t-E.tagT;let r;
  if(vis)r=7*Math.exp(-2.6*a)*Math.cos(2*Math.PI*a/1.05);else r=-2*Math.sin(Math.PI*cl(a/.45));
  const sa=t-E.swap;if(vis&&sa<1.6&&sa>0&&a>.5)r+=2.4*Math.exp(-3*sa)*Math.sin(2*Math.PI*sa/.9);
  if(vis&&t-E.hint<1.2&&t>=E.hint){const hu=t-E.hint;r+=3*Math.exp(-4*hu)*Math.sin(2*Math.PI*hu/.22)}
  if(vis&&E.mode==='reconnect'){const ra=t-E.since;r+=1.8*cl(ra/.6)*Math.sin(2*Math.PI*ra/1.9)}
  return r};
const ewImg=send.querySelector('img');
const EWTXT={boot:'Remontage · le temps se remonte',stopping:'Rangement · le temps se remonte',reconnect:'Reconnexion · le fil se renoue',failed:'Halte · le temps s’est arrêté',resyncfail:'Collation · une page manque'};
let lastPn=0,fwKey='';
const frame=()=>{const t=egT(),rm=RM.matches;const pn=performance.now()/1000;window.__egDt=lastPn?Math.min(.1,Math.max(0,pn-lastPn)):0;lastPn=pn;renderTag();
  /* frame drawn to the card's size */
  const cw=tCard.offsetWidth,ch=tCard.offsetHeight,key=cw+'x'+ch+(ROSE[E.mode]?'r':'');if(key!==fwKey&&cw>0){fwKey=key;tFw.innerHTML=frameSVG(cw,ch,!!ROSE[E.mode])}
  /* key-ring tag: drop and swing on show, the card folds up into the ring on hide */
  const vis=E.tagVis,a=t-E.tagT;tag.style.visibility=(vis||a<.85)?'visible':'hidden';
  let y,op=1,cu=0;const r=swingAt(t);
  if(vis){y=-170*(1-(rm?1:eo(a/.5)))}
  else{cu=rm?1:eio(a/.4);const u2=rm?1:eio((a-.3)/.42);y=-90*u2;op=1-u2}
  tag.style.transform=`translateY(${y.toFixed(2)}px) rotate(${r.toFixed(3)}deg)`;tag.style.opacity=op.toFixed(3);
  tCard.style.transform=cu>0?`translateY(${(-30*cu).toFixed(2)}px) scale(${(1-.6*cu).toFixed(3)})`:'';tCard.style.opacity=(1-cl(cu*1.25)).toFixed(3);
  const rs=rm?0:(swingAt(t-.2)-r)*1.5+(E.mode==='reconnect'&&vis?1.4*Math.sin(2*Math.PI*(t-E.since)/1.9-1.1):0);
  tStrand.setAttribute('transform',`rotate(${rs.toFixed(2)} ${CX+10.5} 28.5)`);tStrand.style.opacity=(1-cu).toFixed(3);
  drawWatch(tagRefs,t);
  if(tagRefs.hint){const hu=t-E.hint,o=hu<3.2?cl(hu/.2)*(1-cl((hu-2.6)/.6)):0;tagRefs.hint.style.height=(o*22).toFixed(1)+'px';tagRefs.hint.style.opacity=o.toFixed(3);tagRefs.hint.style.marginTop=(o*8).toFixed(1)+'px'}
  if(E.mode==='reconnect'&&tagRefs.cd){const r2=E.rc;if(!r2.dialing){const left=Math.max(0,r2.retryAt-t);const txt=`${Math.max(1,Math.ceil(left-.001))} 秒后再试`;if(tagRefs.cd.textContent!==txt)tagRefs.cd.textContent=txt;
      tagRefs.bar.style.width=(100*cl(left/r2.retryDur)).toFixed(2)+'%'}
    else{tagRefs.bar.style.width=(rm?50:50+50*Math.sin(t*4)).toFixed(1)+'%';tagRefs.bar.style.left='0'}}
  /* composer: the engraved watch stands in for the send watch while the engine is not ready */
  const boot=E.mode==='boot'||E.mode==='stopping',down=E.mode==='failed',blk=blocked();
  b.classList.toggle('eg-blk',blk);b.classList.toggle('eg-boot',boot);b.classList.toggle('eg-down',down);
  if(blk!==E.ewOn){E.ewOn=blk;E.ewT=t}
  const ewo=FROZEN!=null||rm?(blk?1:0):blk?cl((t-E.ewT)/.35):1-cl((t-E.ewT-.3)/.4);
  ew.style.opacity=ewo.toFixed(3);ewImg.style.opacity=(1-ewo).toFixed(3);b.classList.toggle('eg-ew',ewo>.01);
  ew.style.transform=`scale(${(.92+.08*eo(ewo)).toFixed(3)})`;
  const tx=EWTXT[E.mode];if(tx&&ewTxt.textContent!==tx){ewTxt.textContent=tx;ewTxtEl.setAttribute('fill',ROSE[E.mode]||down?'#93687A':'#4C5D88')}
  let p=0;if(E.mode==='boot'){const bt=E.boot;p=(bt.ph+(bt.ph<3?cl((t-bt.phT)/bt.durs[bt.ph])*.85:0))/3}
  ewRing.style.opacity=(boot||E.mode==='ready'?1:0).toString();
  const P2=2*Math.PI*31.5,pv=E.mode==='ready'?1:p;arc.setAttribute('stroke-dasharray',`${(P2*pv).toFixed(2)} ${P2+2}`);
  tip.setAttribute('transform',`rotate(${(360*pv).toFixed(1)})`);
  drawWatch(ewR,t,{p:E.mode==='ready'?1:p});
  const ca=rm?0:boot?3*Math.sin(t*2.3):E.mode==='reconnect'?4.5*Math.sin(2*Math.PI*(t-E.since)/1.9-.6):0;
  ewChain.setAttribute('transform',`rotate(${ca.toFixed(2)} 5.5 -39)`);
  drawIntr();
  /* held writing */
  drawHold(t);
  /* collation */
  drawResync(t);
  /* incident letter / notice */
  drawCrash(t);drawNote(t);
  requestAnimationFrame(frame)};

/* ---------------------------------------------------------------- reconnect: the pen stops where it was */
const visibleBlocks=()=>{const out=[];[...thLive.children].forEach(r=>{if(r.style.display==='none')return;if(r===row){[...col.children].forEach(c=>{if(c.style.display!=='none'&&c.offsetParent)out.push(c)})}else out.push(r)});return out};
const holdTurn=()=>{const rk=RK();if(!rk||!rk.running||E.hold)return;
  const at=rk.t;rk.hold(at);
  const ons=[...thLive.querySelectorAll('.ch.on')];const last=ons[ons.length-1];
  const streaming=last&&rk.T&&(()=>{const T=rk.T;return [1,2,3,4,5,6].some(k=>at>=T['c'+k+'a']&&at<T['c'+k+'z']+.05)})();
  E.hold={at,t:egT(),chars:new Set(ons),els:new Set(visibleBlocks()),bub:streaming?last.closest('.b'):null};
  if(E.hold.bub){const s=document.createElement('span');s.className='eg-stall';s.innerHTML='<i></i>笔停住了<em>en attente</em>';E.hold.bub.appendChild(s);E.hold.bub.classList.add('eg-held');E.hold.stall=s;
    const p=$('pen12');egPen.style.left=p.offsetLeft+'px';egPen.style.top=p.offsetTop+'px';egPen.style.display='';b.classList.add('eg-hold')}};
const setStall=txt=>{if(E.hold&&E.hold.stall)E.hold.stall.innerHTML=txt};
const drawHold=t=>{};
const releaseHold=(jump)=>{const rk=RK();const H=E.hold;if(!H)return null;E.hold=null;
  b.classList.remove('eg-hold');egPen.style.display='none';if(H.stall){H.stall.remove();H.bub.classList.remove('eg-held')}
  const nt=H.at+(jump==null?(egT()-H.t):jump);
  if(rk){if(FROZEN!=null||window.__engHalt){for(let x=H.at;x<nt;x+=1/30)rk.frame(x);rk.hold(nt)}else rk.resume(nt)}
  return {H,nt}};

/* ---------------------------------------------------------------- collation */
const markRestored=H=>{const rs={chars:[],els:[],n:0,first:null};if(!H)return rs;
  const ons=[...thLive.querySelectorAll('.ch.on')];rs.chars=ons.filter(c=>!H.chars.has(c));
  rs.chars.forEach(c=>c.classList.add('eg-rest'));
  const bubs=new Set(rs.chars.map(c=>c.closest('.b')));
  rs.els=visibleBlocks().filter(e=>!H.els.has(e)&&!bubs.has(e)&&e.id!=='rkWho'&&e!==crash&&e!==note);
  rs.els.forEach(e=>{if(getComputedStyle(e).position==='static')e.classList.add('eg-restEl');else e.classList.add('eg-restEl')});
  rs.n=bubs.size+rs.els.length;rs.first=rs.chars[0]||rs.els[0]||null;return rs};
const placeChip=rs=>{if(!rs.first||!rs.n){chip.style.display='none';return}
  chip.innerHTML=`<em>restitué</em><b>已补回 ${rs.n} 条</b>`;chip.style.display='';
  const rr=row.getBoundingClientRect(),cr=col.getBoundingClientRect(),fr=rs.first.getBoundingClientRect();
  chip.style.left=(cr.left-rr.left-122).toFixed(0)+'px';chip.style.top=(fr.top-rr.top+fr.height/2-17).toFixed(0)+'px'};
const startResync=(o={})=>{setMode('resync');showTag(1);E.rs={t:egT(),n:null,cause:o.cause||null,rs:null};E.marks.resync=egT();dsL.classList.add('eg-cal');
  const rel=releaseHold(o.jump);
  const settle=()=>{const rs=markRestored(rel&&rel.H);E.rs.rs=rs;E.rs.n=o.restored!=null?o.restored:rs.n;placeChip(rs);E.lastHTML=''};
  requestAnimationFrame(()=>requestAnimationFrame(settle));
  if(!o.still)setTimeout(()=>{if(E.mode==='resync'){setMode('ready');showTag(0);E.marks.ready=egT();dsL.classList.remove('eg-cal')}},2600)};
const drawResync=t=>{const R=E.rs;if(!R)return;const a=t-R.t,rm=RM.matches;
  /* the proof line sweeps the visible list */
  const top=24,bot=vLive.clientHeight-30;const su=(a-.05)/1.2;
  if(su>0&&su<1.15&&!rm){const tr=thLive.getBoundingClientRect(),vr=vLive.getBoundingClientRect();
    sweep.style.left=(tr.left-vr.left-34).toFixed(1)+'px';sweep.style.width=(tr.width+68).toFixed(1)+'px';
    sweep.style.top=(top+(bot-top)*eio(su)).toFixed(1)+'px';sweep.style.opacity=(cl(su/.12)*(1-cl((su-.9)/.2))).toFixed(3)}
  else sweep.style.opacity=0;
  /* each row it passes settles back into line */
  const vr=vLive.getBoundingClientRect();
  visibleBlocks().forEach(e=>{const r=e.getBoundingClientRect();const cy=r.top+r.height/2-vr.top;const u=cl((cy-top)/(bot-top));const tp=.05+1.2*u;
    const k=(a-tp)/.42;if(rm||k<0||k>1||cy<0||cy>vr.height){if(e.style.translate)e.style.translate='';return}
    e.style.translate=`${(-3.2*Math.sin(Math.PI*k)).toFixed(2)}px 0`});
  /* restored words: a blush wash that dries */
  const w=rm?(a<2?.7:0):cl((a-.25)/.3)*.85*(1-cl((a-1.9)/1.5));thLive.style.setProperty('--egw',w.toFixed(3));
  const bb=rm?.8:cl((a-.3)/.3)*(1-.55*cl((a-4)/1.2));thLive.style.setProperty('--egb',bb.toFixed(3));
  if(chip.style.display!=='none'){const cu=rm?1:cl((a-.5)/.35);chip.style.opacity=(cu*(1-.3*cl((a-5)/1.2))).toFixed(3);
    chip.style.transform=`translateX(${(8*(1-eo(cu))).toFixed(2)}px) rotate(${(-2+1*eo(cu)).toFixed(2)}deg)`}
  /* dossier recalibrates: Plan, Changes, Context in turn */
  secs.forEach((s,i)=>{const t0=.45+.32*i,u=rm?(a>=t0?1:0):eo((a-t0)/.45),f=1-cl((a-t0-1.5)/.5);
    s.l.style.transform=`scaleX(${u.toFixed(3)})`;s.l.style.opacity=(u*f).toFixed(3);s.m.style.opacity=(cl((a-t0-.2)/.3)*f).toFixed(3);
    if(s.sm){const g=Math.sin(Math.PI*cl((a-t0)/.6));s.sm.style.textShadow=g>0?`0 0 ${(6*g).toFixed(1)}px rgba(232,214,160,.95)`:''}});
  /* the incident letter folds into a receipt once the snapshot agrees */
  if(R.cause==='restart'&&E.crash&&!E.crash.fold&&a>=1.0)E.crash.fold=t;
  if(R.cause==='reload'&&E.note&&!E.note.fold&&a>=.9)E.note.fold=t};

/* ---------------------------------------------------------------- incident letter */
const H0={};
const measureLetter=(el,paper,full)=>{const d=el.style.display;el.style.display='';paper.style.height='';const h=full.offsetHeight;el.style.display=d;return h};
const logH=()=>{const d=crash.style.display;crash.style.display='';const lb=lw.firstElementChild;const h=lb.offsetHeight+10;crash.style.display=d;return h};
const toggleLog=v=>{const t=egT(),L=E.log;const cur=L.cur||0;L.from=cur;L.to=v==null?(L.to>.5?0:1):v;L.t0=t;lh.setAttribute('aria-expanded',L.to>.5);lgB.textContent=L.to>.5?'收起日志':'查看日志'};
lh.addEventListener('click',()=>toggleLog());lh.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggleLog()}});
lgB.addEventListener('click',()=>toggleLog());
cpB.addEventListener('click',()=>{const txt=['Trianon · 引擎诊断','engine: '+PATH,'port: '+PORT+' · pid '+PID,'exit: 1 (DEMO-01) · 22:41:07 · uptime 6m12s',
  'session: demo-example · pending: demo.approval (voided)','--- log tail ---',...LOG.map(l=>l.join(' ').trim())].join('\n');
  try{navigator.clipboard&&navigator.clipboard.writeText(txt).catch(()=>0)}catch(e){}cpB.textContent='已复制 ✓';setTimeout(()=>cpB.textContent='复制诊断',1600)});
rsB.addEventListener('click',()=>mock.restart());
addEventListener('keydown',e=>{if(E.mode==='failed'&&e.key==='Enter'){const ae=document.activeElement;if(ae&&ae.tagName==='INPUT')return;e.preventDefault();mock.restart()}});
const drawCrash=t=>{const C=E.crash;if(!C){return}const a=t-C.t,rm=RM.matches;
  /* arrives like the slip did */
  if(crash.style.display==='none')crash.style.display='';
  if(!H0.crash){H0.crash=measureLetter(crash,cPaper,cFull)}
  const u=rm?1:cl(a/.5),y=rm?0:20*Math.exp(-6*a)*Math.cos(5*a);crash.style.opacity=cl(u*1.8).toFixed(3);crash.style.transform=a<1.6?`translateY(${y.toFixed(2)}px)`:'';
  /* seal pressed */
  const su=rm?1:cl((a-.3)/.28);cSeal.style.opacity=cl(su*2.5).toFixed(3);cSeal.style.transform=`scale(${(1.35-.35*eo(su)).toFixed(3)}) rotate(${(-18+10*eo(su)).toFixed(2)}deg)`;
  /* the pending slip is voided */
  const vu=rm?1:cl((a-.55)/.2);vst.style.opacity=(.86*vu).toFixed(3);vst.style.transform=`rotate(-7deg) scale(${(1.12-.12*eo(vu)).toFixed(3)})`;vst.style.filter=`blur(${(1.2*(1-vu)).toFixed(2)}px)`;
  /* log drawer */
  const L=E.log;const lu=rm?L.to:L.from+(L.to-L.from)*eio((t-L.t0)/.38);L.cur=lu;if(!H0.log)H0.log=logH();
  lw.style.height=(H0.log*lu).toFixed(2)+'px';lcv.style.display='inline-block';lcv.style.transform=`rotate(${(90*lu).toFixed(1)}deg)`;
  /* fold to a receipt after restart + collation */
  if(C.fold){const fu=rm?1:eio((t-C.fold)/.6);const full=H0.crash+H0.log*lu;cPaper.style.height=(full+(40-full)*fu).toFixed(2)+'px';
    cFull.style.opacity=(1-cl((fu-.1)/.4)).toFixed(3);cFull.style.transform=`translateY(${(-14*fu).toFixed(2)}px)`;cRec.style.opacity=cl((fu-.5)/.45).toFixed(3);
    cSeal.style.opacity=(1-cl(fu/.5)).toFixed(3);crash.querySelector('.eg-mt').style.opacity=(1-cl(fu/.4)).toFixed(3);crash.querySelector('.eg-corner').style.opacity=(1-fu).toFixed(3);cPaper.style.setProperty('--rule',(1-fu).toFixed(3))}
  else{cPaper.style.height='';cRec.style.opacity=0}};
const drawNote=t=>{const N=E.note;if(!N)return;const a=t-N.t,rm=RM.matches;if(note.style.display==='none')note.style.display='';if(!H0.note)H0.note=measureLetter(note,nPaper,nFull);
  const u=rm?1:cl(a/.5),y=rm?0:18*Math.exp(-6*a)*Math.cos(5*a);note.style.opacity=cl(u*1.8).toFixed(3);note.style.transform=a<1.6?`translateY(${y.toFixed(2)}px)`:'';
  if(N.fold){const fu=rm?1:eio((t-N.fold)/.6);nPaper.style.height=(H0.note+(40-H0.note)*fu).toFixed(2)+'px';nFull.style.opacity=(1-cl((fu-.1)/.4)).toFixed(3);
    nFull.style.transform=`translateY(${(-14*fu).toFixed(2)}px)`;nRec.style.opacity=cl((fu-.5)/.45).toFixed(3);note.querySelector('.eg-mt').style.opacity=(1-cl(fu/.4)).toFixed(3);nPaper.style.setProperty('--rule',(1-fu).toFixed(3))}
  else{nPaper.style.height='';nRec.style.opacity=0}};
note.querySelector('.eg-rl').addEventListener('click',()=>mock.reload());
note.querySelector('.eg-later').addEventListener('click',()=>{if(E.mode==='resyncfail'){setMode('ready');showTag(0)}});

const voidTurn=()=>{slip.classList.add('eg-voided');if(wt1){wt1.innerHTML='<em>interrompu</em><span>已中断 · 审批作废</span>';wt1.classList.add('eg-annul')}
  const td=dsL.querySelector('.rk-td.now');if(td){E.intr=td;td.classList.add('eg-intr')}};
/* the interrupted plan line keeps its own mark (rococo only rewrites the mark when the line's state changes) */
const drawIntr=()=>{const td=E.intr;if(!td)return;if(!td.classList.contains('eg-intr'))td.classList.add('eg-intr');const mk=td.querySelector('.mk');if(mk&&!mk.querySelector('.eg-ix'))mk.innerHTML=INTR};
/* a new turn (rococo reset) clears every engine mark */
window.__engReset=()=>{window.__engHalt=false;if(E.intr){E.intr.classList.remove('eg-intr');E.intr._st=null;E.intr=null}E.hold=null;b.classList.remove('eg-hold');egPen.style.display='none';
  thLive.querySelectorAll('.eg-stall').forEach(e=>e.remove());thLive.querySelectorAll('.eg-held').forEach(e=>e.classList.remove('eg-held'));
  thLive.querySelectorAll('.eg-rest').forEach(e=>e.classList.remove('eg-rest'));thLive.querySelectorAll('.eg-restEl').forEach(e=>{e.classList.remove('eg-restEl');e.style.translate=''});
  chip.style.display='none';E.rs=null;E.crash=null;E.note=null;crash.style.display='none';note.style.display='none';E.log={v:0,from:0,to:0,t0:-99,cur:0};lw.style.height='0px';
  slip.classList.remove('eg-voided');vst.style.opacity=0;if(wt1){wt1.innerHTML=WT1;wt1.classList.remove('eg-annul')}lgB.textContent='查看日志'};

/* ---------------------------------------------------------------- the event entry */
const emit=(ev,p={})=>{const t=egT();
  if(ev==='engine.state'){const s=p.state;
    if(s==='starting'){const ph={locate:0,spawn:1,wait:2}[p.phase||'locate'];if(E.mode!=='boot'){setMode('boot');E.boot.ph=-1}showTag(1);if(ph!==E.boot.ph){E.boot.ph=ph;E.boot.phT=t;E.swap=t}}
    else if(s==='ready'){const was=E.mode;if(was==='boot')E.boot.ph=3;
      setMode('ready');if(was==='boot'){E.lastHTML='';E.marks.boot=t;showTag(1);if(!p.still)setTimeout(()=>{if(E.mode==='ready')showTag(0)},900)}else showTag(0)}
    else if(s==='reconnecting'){if(E.mode!=='reconnect'){holdTurn();setMode('reconnect');E.marks.disc=t}showTag(1);const r=E.rc;r.attempt=p.attempt||1;r.dialing=!p.retryIn;r.retryDur=p.retryIn||1;r.retryAt=t+(p.retryIn||0);E.lastHTML='';E.swap=t}
    else if(s==='stopping'){setMode('stopping');showTag(1)}
    else if(s==='failed'){const rk=RK();if(rk&&rk.running&&!E.hold)rk.hold(rk.t);
      window.__engHalt=true;voidTurn();setMode('failed');showTag(1);E.crash={t};E.marks.crash=t;H0.crash=0;H0.log=0}}
  else if(ev==='events.resync')startResync(p);
  else if(ev==='resync.failed'){setMode('resyncfail');showTag(1);E.note={t};H0.note=0;setStall('<i></i>这里可能缺了一段<em>lacune</em>')}};

/* ---------------------------------------------------------------- mock main process */
const T_=[];const later=(s,f)=>{const id=setTimeout(f,s*1000);T_.push(id);return id};
const mock={
  boot(o={}){const d=o.quick?[.55,.6,.9]:[1.3,1.5,2.9];E.boot.durs=d;E.cause=o.cause||null;
    emit('engine.state',{state:'starting',phase:'locate',path:PATH});
    later(d[0],()=>emit('engine.state',{state:'starting',phase:'spawn',pid:PID,port:PORT}));
    later(d[0]+d[1],()=>emit('engine.state',{state:'starting',phase:'wait'}));
    later(d[0]+d[1]+d[2],()=>{emit('engine.state',{state:'ready'});o.then&&o.then()})},
  disconnect(o={}){const plan=o.plan||[1.6,2.0];let k=0;
    const attempt=()=>{if(k>=plan.length){emit('engine.state',{state:'reconnecting',attempt:k,retryIn:0});later(.45,()=>{if(o.fail){emit('resync.failed',{reason:'not_found'})}else{emit('events.resync',{})}});return}
      k++;emit('engine.state',{state:'reconnecting',attempt:k,retryIn:plan[k-1]});
      mock._next=later(plan[k-1],()=>{emit('engine.state',{state:'reconnecting',attempt:k,retryIn:0});later(.5,attempt)})};
    attempt()},
  retryNow(){if(E.mode!=='reconnect'||E.rc.dialing)return;clearTimeout(mock._next);emit('engine.state',{state:'reconnecting',attempt:E.rc.attempt,retryIn:0});later(.45,()=>emit('events.resync',{}))},
  crash(){emit('engine.state',{state:'failed',exitCode:1,at:'22:41:07',uptime:372,log:LOG})},
  restart(){if(E.mode!=='failed')return;E.marks.restart=egT();emit('engine.state',{state:'stopping'});
    later(.6,()=>mock.boot({quick:true,cause:'restart',then:()=>{later(.15,()=>emit('events.resync',{restored:0,cause:'restart',jump:0}))}}))},
  reload(){if(E.mode!=='resyncfail')return;emit('events.resync',{cause:'reload'})}};

/* ---------------------------------------------------------------- scenes */
const LIVE_TITLE='流式渲染 · 合批与去重';
const goLive=at=>{const rk=RK();rk.start(window.__rkPrompt,{auto:true,at});const cs=document.querySelector('.dw-ses.cur .dw-t');if(cs)cs.textContent=LIVE_TITLE;
  document.querySelectorAll('.rail .grp .it').forEach(e=>e.classList.remove('on'));rk.showView('live',{instant:true})};
const raf2=f=>requestAnimationFrame(()=>requestAnimationFrame(f));
const SC={
  boot(){const t=egT();setMode('boot');E.boot={ph:2,phT:t-1.5,durs:[1.3,1.5,2.2]};E.since=t-3.1;showTag(1);E.tagT=t-3;E.swap=t-3;
    const ci=$('ci');ci.value='流式回复每个 delta 都触发一次重排，';document.querySelector('.field').classList.add('has');FROZEN=t},
  reconnect(){const rk=RK();const T=rk.T;goLive(T.c2a+.62*(T.c2z-T.c2a));
    raf2(()=>{holdTurn();const t=egT();setMode('reconnect');E.since=t-2.35;E.rc={attempt:2,retryDur:4,retryAt:t+2.4,dialing:false};showTag(1);E.tagT=t-3;E.swap=t-3;E.lastHTML='';FROZEN=t})},
  crash(log){const rk=RK();goLive(rk.T.sl+1.6);
    raf2(()=>{const t=egT();emit('engine.state',{state:'failed'});E.crash.t=t-3;E.tagT=t-3;E.swap=t-3;E.since=t-3;if(log){toggleLog(1);E.log.t0=t-2}FROZEN=t})},
  resync(age=.85){const rk=RK();const T=rk.T;const h=T.c2a+.62*(T.c2z-T.c2a);goLive(h);
    raf2(()=>{holdTurn();const t=egT();FROZEN=t;startResync({jump:T.sl+1.25-h,still:true});E.rs.t=t-age;E.tagT=t-3;E.swap=t-3;E.since=t-age;
      if(age>2.6){setMode('ready');E.since=t-age+2.6;showTag(0);E.tagT=t-age+2.6;dsL.classList.remove('eg-cal')}})},
  resyncfail(){const rk=RK();const T=rk.T;goLive(T.c2a+.62*(T.c2z-T.c2a));
    raf2(()=>{holdTurn();const t=egT();emit('resync.failed',{reason:'not_found'});E.note.t=t-3;E.tagT=t-3;E.swap=t-3;E.since=t-3;FROZEN=t})}};

/* ---------------------------------------------------------------- #play */
const D={x:1010,y:640,vis:0,press:-9};
const cur=()=>$('rkCur');
window.__demoXY=()=>[D.x,D.y,egT()-D.press<.12?1:0];
const Pt=(el,fx=.5,fy=.5)=>{if(!el)return [D.x,D.y];const r=el.getBoundingClientRect();return [r.left+r.width*fx,r.top+r.height*fy]};
const press=el=>{D.press=egT();if(el)el.click()};
const abs=k=>{const rk=RK();return rk.t0+rk.T[k]};
const mk=k=>E.marks[k]!=null?E.marks[k]:Infinity;
const sm=u=>{u=cl(u);return u*u*(3-2*u)};
const typeTo=u=>{const s=window.__rkPrompt,n=Math.round(s.length*cl(u)),ci=$('ci');if(ci.value.length!==n){ci.value=s.slice(0,n);document.querySelector('.field').classList.toggle('has',n>0)}};
let discAt=0,crashAt=0;
const STEPS=[
 {act:()=>mock.boot()},
 {d:.9},
 {to:()=>Pt(document.querySelector('.field'),.42,.36),d:.9,show:1},
 {d:.2,act:()=>$('ci').focus({preventScroll:true})},
 {d:2.1,tick:typeTo},
 {d:.25},
 {to:()=>Pt(send,.5,.55),d:.5},
 {d:.2,act:()=>press(send)},
 {until:()=>mk('boot')+.75},
 {d:.15,act:()=>press(send)},
 {to:()=>[1010,640],d:.8},
 {until:()=>abs('c2a')+.95},
 {act:()=>{E.marks.discCall=egT();mock.disconnect({plan:[1.6,2.4]})}},
 {to:()=>[440,330],d:1.0},
 {until:()=>E.mode==='reconnect'&&E.rc.attempt===2&&!E.rc.dialing?E.rc.retryAt-1.45:Infinity},
 {to:()=>Pt(document.querySelector('#egTag [data-now]'),.5,.6),d:.55},
 {d:.25,act:()=>press(document.querySelector('#egTag [data-now]'))},
 {to:()=>[440,330],d:.8},
 {until:()=>mk('ready')+.6},
 {to:()=>Pt(document.querySelector('#slOk'),.7,.6),d:1.0},
 {d:.9},
 {act:()=>mock.crash()},
 {to:()=>[1030,520],d:.8},
 {d:.9},
 {to:()=>Pt(lgB,.5,.55),d:.7},
 {d:.3,act:()=>press(lgB)},
 {d:2.3},
 {to:()=>Pt(rsB,.45,.55),d:.8},
 {d:.35,act:()=>press(rsB)},
 {to:()=>[1030,600],d:.9},
 {until:()=>mk('ready')>mk('restart')?mk('ready')+2.4:Infinity,end:1}];
let si=-1,sT=0,sEnd=0,from=[0,0],playing=false;
const begin=(i,n)=>{si=i;const s=STEPS[i];if(!s)return;sT=n;from=[D.x,D.y];if(s.show)D.vis=1;sEnd=s.until?Math.max(n,s.until()):n+(s.d||0)};
const playTick=()=>{if(!playing)return;const n=egT();if(si<0)begin(0,n);
  while(si<STEPS.length&&n>=sEnd){const s=STEPS[si];if(s.to){const p=s.to();D.x=p[0];D.y=p[1]}if(s.tick)s.tick(1);if(s.act)s.act();if(s.end){playing=false;E.marks.END=n;break}begin(si+1,n)}
  const s=STEPS[si];
  if(s&&playing){const u=sEnd>sT?(n-sT)/(sEnd-sT):1;if(s.to){const p=s.to(),e=sm(u);D.x=from[0]+(p[0]-from[0])*e;D.y=from[1]+(p[1]-from[1])*e}if(s.tick&&isFinite(u))s.tick(u);
    if(s.until&&!isFinite(sEnd))sEnd=s.until()}
  const c=cur();if(c){const pr=egT()-D.press<.12;c.style.opacity=D.vis?'1':'0';c.style.transform=`translate(${(D.x-3).toFixed(2)}px,${(D.y-2).toFixed(2)}px) scale(${pr?.88:1})`}
  requestAnimationFrame(playTick)};
const play=()=>{if(playing)return;playing=true;si=-1;E.marks.play=egT();D.x=1010;D.y=640;D.vis=0;requestAnimationFrame(playTick)};
window.__playGo=play;

/* ---------------------------------------------------------------- demo palette (plain load) */
const demo=()=>{const d=document.createElement('details');d.id='egDemo';
  d.innerHTML='<summary><em>Démo</em>引擎事件</summary><div class="eg-dl"><button data-a="boot">冷启动</button><button data-a="disc">断线重连（对话中）</button><button data-a="crash">崩溃</button><button data-a="rf">断线 · 校对失败</button></div>';
  d.addEventListener('click',e=>{const a=e.target.closest('button');if(!a)return;const k=a.dataset.a;
    if(k==='boot'&&E.mode==='ready')mock.boot();else if(k==='disc'&&E.mode==='ready')mock.disconnect();else if(k==='rf'&&E.mode==='ready')mock.disconnect({fail:true});else if(k==='crash'&&E.mode!=='failed')mock.crash()});
  b.appendChild(d)};

/* ---------------------------------------------------------------- boot */
const go=()=>{requestAnimationFrame(frame);
  const sc=['boot','reconnect','crash','crashlog','resync','resyncfail','ready'].find(has);
  if(sc==='boot')SC.boot();else if(sc==='reconnect')SC.reconnect();else if(sc==='crash')SC.crash(false);else if(sc==='crashlog')SC.crash(true);
  else if(sc==='resync')SC.resync(.98);else if(sc==='ready')SC.resync(6.5);else if(sc==='resyncfail')SC.resyncfail();
  else if(has('play')){setMode('boot');E.boot.ph=0;E.boot.phT=egT();showTag(0);E.tagT=-99;setTimeout(play,500)}
  else{demo();mock.boot()}};
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(go))));

window.__eng={emit,mock,get state(){return E.mode},E,freeze:t=>{FROZEN=t},
  timeline:()=>JSON.stringify(Object.fromEntries(Object.entries(E.marks).map(([k,v])=>[k,+(v-(E.marks.play||0)).toFixed(2)])))};
})();
