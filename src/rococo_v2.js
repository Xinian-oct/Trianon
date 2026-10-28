/* rococo v2 · rail「模切吊牌」 (合并版: short drop per tag; hide() is held while window.__railPin() says a page keeps the rail out)
   原注释: rococo v2 · rail「模切吊牌」 — replaces the v1 rail script at build time (same triggers: linger at the left edge, leave to close,
   drawer keeps it open, #open hash, one shared lace label, click marks .on).
   Opening: the cord draws from the top, tags slide down it one after another and swing twice before they rest.
   Hover: the tag swings gently + label. Chosen: leans forward with a pale light (CSS). Reduced motion: fades only. */
(()=>{const b=document.body,rail=document.querySelector('.rail'),its=[...rail.querySelectorAll('.it')];
const RM=matchMedia('(prefers-reduced-motion: reduce)');
let open=false,tOpen=0,tClose=0,my=innerHeight/2,mx=-1;
const img=e=>e.querySelector('img.tg');
its.forEach((e,i)=>{e.style.zIndex=String(30-i);e.tabIndex=0;e.setAttribute('role','button');e.setAttribute('aria-label',e.textContent.replace(/[✕●]/g,'').trim())});
rail.addEventListener('focusin',()=>show());
rail.addEventListener('keydown',e=>{const cur=e.target.closest('.it');if(!cur)return;const i=its.indexOf(cur);let n=null;
  if(e.key==='ArrowDown'||e.key==='ArrowRight')n=(i+1)%its.length;
  else if(e.key==='ArrowUp'||e.key==='ArrowLeft')n=(i+its.length-1)%its.length;
  else if(e.key==='Home')n=0;else if(e.key==='End')n=its.length-1;
  else if(e.key==='Enter'){e.preventDefault();cur.click();return}
  else if(e.key===' '){e.preventDefault();return}else return;
  e.preventDefault();its[n].focus({preventScroll:true})});
rail.addEventListener('keyup',e=>{const cur=e.target.closest('.it');if(cur&&e.key===' '){e.preventDefault();cur.click()}});
/* where each tag rests, measured from the rail top (transforms ignored) -> start position at the top of the cord */
/* v2 合并版: each tag drops only a short way from just above its own place (no more passing through tags already resting) */
const DROP=i=>30+(i%3)*4;
let offs=[];const measure=()=>{offs=its.map(e=>e.offsetParent.offsetTop+e.offsetTop);
  its.forEach((e,i)=>e.style.setProperty('--up',(-DROP(i))+'px'))};measure();addEventListener('resize',measure);
const anims=new Map();const sw=new Map();
const kill=e=>{(anims.get(e)||[]).forEach(a=>a.cancel());anims.set(e,[])};
const killSw=e=>{const a=sw.get(e);if(a)a.cancel();sw.delete(e)};
/* damped pendulum sampled into keyframes */
const swingFrames=(amp,dir,n=2.15,z=.2)=>{const f=[],N=40;for(let k=0;k<=N;k++){const u=k/N;
  const a=amp*dir*Math.exp(-z*u*14)*Math.sin(u*n*2*Math.PI);f.push({offset:u,transform:`rotate(${a.toFixed(3)}deg)`})}
  f[N].transform='rotate(0deg)';return f};
const SLIDE=430,STEP=70,CORD=380;
const openAnim=()=>{measure();
  its.forEach((e,i)=>{const cs=getComputedStyle(e),midway=+cs.opacity>.04,from=cs.transform;kill(e);killSw(e);
    if(RM.matches){anims.get(e).push(e.animate([{opacity:0,transform:'none'},{opacity:1,transform:'none'}],{duration:260,delay:i*20,easing:'ease-out',fill:'backwards'}));return}
    if(midway){anims.get(e).push(e.animate([{opacity:cs.opacity,transform:from==='none'?'none':from},{opacity:1,transform:'none'}],{duration:300,easing:'cubic-bezier(.22,1,.36,1)'}));return}
    const up=-DROP(i),delay=CORD*.55+i*STEP;
    /* slide down the cord: accelerate, tiny overshoot past the rest point, settle */
    anims.get(e).push(e.animate([
      {offset:0,opacity:0,transform:`translateY(${up}px)`},
      {offset:.22,opacity:1,transform:`translateY(${(up*.8).toFixed(1)}px)`},
      {offset:.72,opacity:1,transform:'translateY(3px)',easing:'cubic-bezier(.3,.7,.4,1)'},
      {offset:.86,opacity:1,transform:'translateY(-1px)'},
      {offset:1,opacity:1,transform:'none'}],{duration:SLIDE,delay,easing:'cubic-bezier(.45,0,.75,.55)',fill:'backwards'}));
    /* then swings twice and stops */
    const a=img(e).animate(swingFrames(7.5-Math.min(3,i*.25),i%2?-1:1),{duration:1250,delay:delay+SLIDE*.7,easing:'linear'});
    anims.get(e).push(a)})};
const closeAnim=()=>{its.forEach((e,i)=>{const cs=getComputedStyle(e),o=+cs.opacity,from=cs.transform;kill(e);killSw(e);
    if(RM.matches||o<.02)return;const n=its.length;
    anims.get(e).push(e.animate([{opacity:o,transform:from==='none'?'none':from},{opacity:0,transform:`translateY(${(-DROP(i)*.6).toFixed(1)}px)`}],
      {duration:220,delay:(n-1-i)*14,easing:'cubic-bezier(.4,0,.68,.06)',fill:'backwards'}))})};
const show=()=>{if(open)return;open=true;openAnim();b.classList.add('rail-open')};
const hide=()=>{if(!open||(window.__railPin&&window.__railPin()))return;open=false;tipHide(true);closeAnim();b.classList.remove('rail-open')};
/* hover: a gentle sway that keeps going while the pointer stays, eases out when it leaves */
const swayOn=e=>{if(RM.matches||!open)return;const busy=(anims.get(e)||[]).some(a=>a.playState==='running'&&a.effect&&a.effect.target===img(e));
  killSw(e);const go=()=>{const a=img(e).animate([{transform:'rotate(0deg)'},{transform:'rotate(4.2deg)',offset:.25},{transform:'rotate(-3.6deg)',offset:.72},{transform:'rotate(0deg)'}],
    {duration:1700,iterations:Infinity,easing:'cubic-bezier(.45,0,.55,1)'});sw.set(e,a)};
  if(busy){const t=setTimeout(()=>{if(hoverIt===e)go()},420);sw.set(e,{cancel:()=>clearTimeout(t)})}else go()};
const swayOff=e=>{const a=sw.get(e);if(!a||!a.effect){killSw(e);return}sw.delete(e);
  let cur='rotate(0deg)';try{cur=getComputedStyle(img(e)).transform}catch(x){}a.cancel();
  if(RM.matches)return;const m=cur.match(/matrix\(([^,]+),([^,]+)/);const ang=m?Math.atan2(+m[2],+m[1])*180/Math.PI:0;
  img(e).animate([{transform:`rotate(${ang.toFixed(2)}deg)`},{transform:`rotate(${(-ang*.45).toFixed(2)}deg)`,offset:.45},{transform:'rotate(0deg)'}],{duration:620,easing:'cubic-bezier(.3,.6,.3,1)'})};
/* single lace label (as v1) */
const host=document.createElement('div');host.className='it ttip';host.setAttribute('aria-hidden','true');
const tsp=document.createElement('span');host.appendChild(tsp);rail.appendChild(host);
let tipAt=null,tipShown=false,tShow=0,tHide=0,tipA=null,moveA=null,hoverIt=null;
const yOf=e=>e.offsetParent.offsetTop+e.offsetTop;
const tipPlace=(e,glide)=>{const y=yOf(e),tr=getComputedStyle(host).translate.split(' '),cur=tr.length>1?parseFloat(tr[1]):y;
  host.style.setProperty('--ty',y+'px');if(moveA)moveA.cancel();
  if(glide&&!RM.matches&&Math.abs(cur-y)>1){moveA=host.animate([{translate:`0 ${cur}px`},{translate:`0 ${y}px`}],{duration:260,easing:'cubic-bezier(.22,1,.36,1)'});
    tsp.animate([{opacity:.6},{opacity:1}],{duration:220,easing:'ease-out',composite:'replace'})}};
const fill=e=>{tsp.innerHTML=e.querySelector(':scope>span').innerHTML};
const tipShow=e=>{clearTimeout(tHide);tHide=0;
  if(tipShown){if(tipAt!==e){fill(e);tipPlace(e,true);tipAt=e}return}
  clearTimeout(tShow);tShow=setTimeout(()=>{tShow=0;tipAt=e;fill(e);tipPlace(e,false);tipShown=true;if(tipA)tipA.cancel();
    if(RM.matches){tsp.style.opacity=1;tsp.style.transform='translate(0,-50%)';return}
    tipA=tsp.animate([{opacity:0,transform:'translate(-4px,-50%) scale(.965)'},{opacity:1,transform:'translate(0,-50%) scale(1)'}],{duration:240,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'})},120)};
const tipHide=now=>{clearTimeout(tShow);tShow=0;if(!tipShown)return;clearTimeout(tHide);
  tHide=setTimeout(()=>{tHide=0;tipShown=false;tipAt=null;if(tipA)tipA.cancel();
    if(RM.matches){tsp.style.opacity=0;return}
    const cs=getComputedStyle(tsp);
    tipA=tsp.animate([{opacity:cs.opacity,transform:cs.transform},{opacity:0,transform:'translate(-3px,-50%) scale(.98)'}],{duration:150,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'})},now?0:90)};
its.forEach(e=>{e.addEventListener('pointerenter',()=>{hoverIt=e;if(open){tipShow(e);swayOn(e)}});
  e.addEventListener('pointerleave',()=>{if(hoverIt===e)hoverIt=null;tipHide(false);swayOff(e)});
  e.addEventListener('click',()=>{its.forEach(o=>o.classList.remove('on'));e.classList.add('on');
    if(!RM.matches){killSw(e);img(e).animate(swingFrames(5,1,1.6,.24),{duration:900,easing:'linear'})}})});
/* the calendar turns a page when the history drawer opens (instead of v1's hourglass flip) */
const cal=its[1]&&img(its[1]);let wasD=false;
new MutationObserver(()=>{const d=b.classList.contains('drw-open');if(d&&!wasD&&cal&&!RM.matches)
  cal.animate([{transform:'perspective(160px) rotateX(0deg)'},{transform:'perspective(160px) rotateX(-28deg)',offset:.35},{transform:'perspective(160px) rotateX(6deg)',offset:.7},{transform:'perspective(160px) rotateX(0deg)'}],{duration:700,easing:'cubic-bezier(.3,.6,.3,1)'});wasD=d}).observe(b,{attributes:true,attributeFilter:['class']});
addEventListener('pointermove',e=>{my=e.clientY;mx=e.clientX;const x=mx;
  if(!open){clearTimeout(tClose);tClose=0;if(x<=16){if(!tOpen)tOpen=setTimeout(()=>{tOpen=0;show()},90)}else{clearTimeout(tOpen);tOpen=0}}
  else{if(x>(b.classList.contains('drw-open')?document.getElementById('drw').getBoundingClientRect().right:rail.getBoundingClientRect().right)+36){if(!tClose){tClose=setTimeout(()=>{tClose=0;hide()},260)}}else{clearTimeout(tClose);tClose=0}}},{passive:true});
/* leaving the window closes it; a stray leave reported inside the window (e.g. while a tag swings under a still pointer) does not */
document.addEventListener('pointerleave',e=>{const inWin=e.clientX>0&&e.clientY>0&&e.clientX<innerWidth-1&&e.clientY<innerHeight-1;
  if(inWin&&e.clientX<=rail.getBoundingClientRect().right+36)return;
  clearTimeout(tOpen);tOpen=0;if(open&&!tClose&&!b.classList.contains('drw-open'))tClose=setTimeout(()=>{tClose=0;hide()},260)});
window.__rail2={show,hide,isOpen:()=>open};
if(location.hash.includes('open')){open=true;b.classList.add('rail-open');
  const t=its.find(e=>e.classList.contains('tip'));if(t){tipAt=t;fill(t);tipPlace(t,false);tipShown=true;tsp.style.opacity=1;tsp.style.transform='translate(0,-50%)'}}
})();
