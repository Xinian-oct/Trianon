"""全局自定义光标（2026-10-27 21:40）：蓝色蝴蝶 / 墨水 I 线 / 小枕头。由 build_rococo_v2.py 在写出前调用 inject(s)。
   - 所有样式与脚本里的 cursor:pointer|default|text|not-allowed|grab|grabbing|wait|progress → cursor:var(--cu-*)，
     :root 上定义每个变量 = -webkit-image-set(48px 1x, 96px 2x) 热点, 48px 回退（2026-10-27 22:05 由 32/64 放大）, 系统关键字回退
   - :where() 零优先级基线：html 默认蝴蝶；输入框/可编辑区 I 线；a/button/[role=button]… 指针蝴蝶；禁用 not-allowed
   - 等待：#br.loading（浏览器页加载）/ [aria-busy=true] / body.busy → html.cu-wait（枕头）；有鼠标位置时改用跟随鼠标的
     DOM 枕头（呼吸起伏，z 轻飘；减少动效时静止），系统光标隐藏
   - 进行中：Kimi 正在写（window.__cuBusy，由首页时间轴给出）→ html.cu-progress，只换默认光标（蝴蝶 + 小枕头）
   - Kimi 的钢笔笔尖代理光标是 DOM 元素，不受影响"""
import base64, json, os, re
H = os.path.dirname(os.path.abspath(__file__)) + '/'
NAMES = ['default', 'pointer', 'text', 'not-allowed', 'grab', 'grabbing', 'wait', 'progress']

def b64(p): return 'data:image/png;base64,' + base64.b64encode(open(H + 'out/' + p, 'rb').read()).decode()

def css():
    # 2026-10-27 22:55 edge tiers: Blink skips ANY custom cursor whose rect is not fully inside the visual viewport and tries the
    # next list entry (event_handler.cc SelectCursor) — so near the right/bottom edge the 48px butterfly would fall to the system
    # arrow. Chain: 48px (image-set 1x/2x, url) -> 32px (image-set 32/64) -> 24px (image-set 24/48) -> keyword.
    ht = json.load(open(H + 'out/hotspots_tiers.json'))
    v = []
    for n in NAMES:
        x, y = ht['48'][n]; a, b = b64(f'{n}_48.png'), b64(f'{n}_96.png')
        x3, y3 = ht['32'][n]; c, d = b64(f'{n}_32.png'), b64(f'{n}_64.png')
        x2, y2 = ht['24'][n]; e = b64(f'{n}_24.png')
        v.append(f'--cu-{n}:-webkit-image-set(url({a}) 1x,url({b}) 2x) {x} {y},url({a}) {x} {y},'
                 f'-webkit-image-set(url({c}) 1x,url({d}) 2x) {x3} {y3},-webkit-image-set(url({e}) 1x,url({a}) 2x) {x2} {y2},{n};')
    return (':root{' + ''.join(v) + '}\n'
        'html{cursor:var(--cu-default)}\n'
        ':where(a[href],button,select,summary,label[for],[role=button],[role=tab],[role=link],[role=menuitem],[role=option],[role=checkbox],[role=switch],[onclick],'
        'input[type=button],input[type=submit],input[type=reset],input[type=checkbox],input[type=radio],input[type=range],input[type=color],input[type=file]){cursor:var(--cu-pointer)}\n'
        ':where(input:not([type]),input[type=text],input[type=search],input[type=url],input[type=email],input[type=password],input[type=number],input[type=tel],'
        'textarea,[contenteditable=""],[contenteditable=true],[contenteditable=plaintext-only]){cursor:var(--cu-text)}\n'
        ':where(button:disabled,input:disabled,select:disabled,textarea:disabled,[aria-disabled=true]){cursor:var(--cu-not-allowed)}\n'
        'html.cu-progress{--cu-default:var(--cu-progress)}\n'
        'html.cu-wait{--cu-default:var(--cu-wait);--cu-pointer:var(--cu-wait);--cu-text:var(--cu-wait);--cu-not-allowed:var(--cu-wait);--cu-grab:var(--cu-wait);--cu-grabbing:var(--cu-wait);--cu-progress:var(--cu-wait)}\n'
        'html.cu-wait.cu-dom,html.cu-wait.cu-dom *{cursor:none!important}\n'
        f'#cuPillow{{position:fixed;left:0;top:0;width:48px;height:48px;z-index:2147483647;pointer-events:none;display:none;will-change:transform}}\n'
        'html.cu-wait.cu-dom #cuPillow{display:block}\n'
        f'#cuPillow i,#cuPillow b{{position:absolute;inset:0;background:url({b64("pillowdom_96.png")}) 0 0/48px 48px no-repeat}}\n'
        f'#cuPillow b{{background-image:url({b64("zdom_96.png")})}}\n'
        '#cuPillow i{transform-origin:22px 40px;animation:cuBreath 2.8s ease-in-out infinite}\n'
        '#cuPillow b{transform-origin:39px 9px;animation:cuZ 2.8s ease-in-out infinite}\n'
        '@keyframes cuBreath{0%,100%{transform:scale(1,1)}50%{transform:scale(1.035,.93)}}\n'
        '@keyframes cuZ{0%,100%{opacity:.55;transform:translate(0,1.5px) rotate(-4deg)}50%{opacity:1;transform:translate(1.5px,-3px) rotate(4deg)}}\n'
        '@media (prefers-reduced-motion:reduce){#cuPillow i,#cuPillow b{animation:none}}\n')

JS = r"""<script>/* global cursors: butterfly / ink I-beam / pillow (cur/inject_cur.py) */
(()=>{const H=document.documentElement;let mx=null,my=null,pl=null;
const put=()=>{if(pl&&mx!=null)pl.style.transform=`translate(${mx-22}px,${my-28}px)`};
addEventListener('pointermove',e=>{if(e.pointerType&&e.pointerType!=='mouse')return;mx=e.clientX;my=e.clientY;put();if(!H.classList.contains('cu-dom')&&H.classList.contains('cu-wait'))tick()},{passive:true,capture:true});
addEventListener('pointerleave',()=>{mx=null;H.classList.remove('cu-dom')},{passive:true});
const tick=()=>{const br=document.getElementById('br'),b=document.body;
  const wait=!!((b&&b.classList.contains('busy'))||document.querySelector('[aria-busy="true"]')||(br&&br.classList.contains('loading')&&getComputedStyle(br).visibility!=='hidden'));
  H.classList.toggle('cu-wait',wait);H.classList.toggle('cu-progress',!wait&&!!window.__cuBusy);H.classList.toggle('cu-dom',wait&&mx!=null);
  if(!pl&&b){pl=document.createElement('div');pl.id='cuPillow';pl.setAttribute('aria-hidden','true');pl.innerHTML='<i></i><b></b>';b.appendChild(pl);put()}};
window.__cuTick=tick;window.__cuSet=(x,y)=>{mx=x;my=y;put();tick()};
setInterval(tick,120);document.addEventListener('DOMContentLoaded',tick)})();
</script>"""

RX = re.compile(r'cursor\s*:\s*(pointer|default|text|not-allowed|grabbing|grab|wait|progress)\b')

def inject(s):
    assert 'id="cuStyle"' not in s
    n = 0
    def fix(m):
        nonlocal n; n += 1; return 'cursor:var(--cu-' + m.group(1) + ')'
    # only outside data: URIs (base64 never contains ':' so plain regex is safe)
    s = RX.sub(fix, s)
    i = s.index('<head>') + len('<head>')
    s = s[:i] + '\n<style id="cuStyle">' + css() + '</style>' + s[i:]
    j = s.rindex('</body>')
    s = s[:j] + JS + '\n' + s[j:]
    print('cursor: replaced', n, 'cursor declarations')
    return s
