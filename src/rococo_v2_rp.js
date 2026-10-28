(()=>{
/* ===================================================================================================
   右侧卷宗栏（rococo_v1 的 .folio）开关 · 2026-10-27 15:55
   默认收起；鼠标进入屏幕右侧 1/3 靠上（上 42%）区域时，从右边缘滑出一枚模切书签拉手；
   点拉手 → 整块卷宗栏弹簧滑入（与左栏同一手感）；再点拉手 / 栏上的 ✕ / Esc / 点外部 → 收回。
   弹出方式 = 覆盖（主栏 720–760px 本就居中、与卷宗栏不重叠，弹出时不重排、不跳动）。打孔圆点原样保留。
   调试 hash：#rp-peek（拉手露出）#rp-open（卷宗栏打开）。window.__rp = {open, close, toggle, peek, get isOpen}
   =================================================================================================== */
const b=document.body,folio=document.querySelector('.folio');if(!folio)return;
const HASH=window.__navHash||decodeURIComponent(location.hash.slice(1)).split(/[&,]/).filter(Boolean);
const tab=document.createElement('button');tab.id='rpTab';tab.type='button';tab.setAttribute('aria-label','展开卷宗栏');tab.setAttribute('aria-expanded','false');tab.tabIndex=-1;
tab.innerHTML=`<span class="rp-paper"><i class="rp-star">✦</i><em>Dossier</em><b>卷 宗</b><i class="rp-arr" aria-hidden="true">‹</i></span><span class="rp-tail" aria-hidden="true"></span>`;
b.appendChild(tab);
const x=document.createElement('button');x.className='rp-x';x.type='button';x.setAttribute('aria-label','收起卷宗栏');x.innerHTML='<span>✕</span>';folio.appendChild(x);
let open=false,peek=false,peekT=0;
const busy=()=>b.classList.contains('fl-open')||b.classList.contains('st-open')||b.classList.contains('sr-on');
const set=()=>{b.classList.toggle('rp-open',open);b.classList.toggle('rp-peek',peek||open);tab.setAttribute('aria-expanded',open?'true':'false');tab.setAttribute('aria-label',open?'收起卷宗栏':'展开卷宗栏')};
const api={open(){if(busy())return;open=true;peek=true;set()},close(){open=false;set();clearTimeout(peekT);peekT=setTimeout(()=>{if(!open){peek=false;set()}},900)},
  toggle(){open?api.close():api.open()},peek(v=true){peek=v;set()},get isOpen(){return open}};
window.__rp=api;
addEventListener('pointermove',e=>{if(open)return;const inZone=e.clientX>innerWidth*2/3&&e.clientY<innerHeight*.42&&!busy();
  if(inZone){clearTimeout(peekT);if(!peek){peek=true;set()}}else if(peek&&!tab.matches(':hover')){clearTimeout(peekT);peekT=setTimeout(()=>{if(!open){peek=false;set()}},420)}},{passive:true});
tab.addEventListener('click',e=>{e.stopPropagation();api.toggle()});
x.addEventListener('click',e=>{e.stopPropagation();api.close()});
addEventListener('keydown',e=>{if(open&&e.key==='Escape'&&!b.classList.contains('sr-on')){api.close()}},true);
addEventListener('pointerdown',e=>{if(!open)return;if(folio.contains(e.target)||tab.contains(e.target))return;api.close()},true);
/* other pages take the right side: fold away */
new MutationObserver(()=>{if(busy()&&(open||peek)){open=false;peek=false;set()}}).observe(b,{attributes:true,attributeFilter:['class']});
if(HASH.includes('rp-open'))setTimeout(()=>api.open(),60);else if(HASH.includes('rp-peek'))setTimeout(()=>api.peek(true),60);
})();
