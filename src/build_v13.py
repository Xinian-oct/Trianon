#!/usr/bin/env python3
"""Build v13_sessions.html (conversation history drawer) from v8.html. v8/v12 are read only.
Clicking the hourglass in the left rail tips it over (a short sand trickle) and slides a paper drawer of
session slips out from behind the rail. Everything else is v8 unchanged.
Hooks: body.drw-open, window.__v13toggle(open?), #hist in the URL opens it instantly."""
import re, random, math, urllib.parse

SRC = './v8.html'
OUT = './v13_sessions.html'
s = open(SRC, encoding='utf-8').read()

def sub1(old, new):
    global s
    assert s.count(old) == 1, (old[:80], s.count(old))
    s = s.replace(old, new)

# ---------- deckle edge mask (irregular, low-frequency; no repeating pattern) ----------
rnd = random.Random(1026)
W, H = 330, 868
pts = []
y = 0.0
while y < H:
    pts.append((W - 3.2 + 1.6 * math.sin(y / 37.0) + rnd.uniform(-1.5, 1.3), y))
    y += rnd.uniform(5, 11)
pts.append((W - 3, H))
top = [(x, 1.2 + rnd.uniform(-.9, .9)) for x in range(0, W - 4, 9)]
bot = [(x, H - 1.2 + rnd.uniform(-.9, .9)) for x in range(W - 4, 0, -9)]
path = 'M0,0 ' + ' '.join(f'L{x:.1f},{y:.1f}' for x, y in top) + ' ' + ' '.join(f'L{x:.1f},{y:.1f}' for x, y in pts) + ' ' + \
       ' '.join(f'L{x:.1f},{y:.1f}' for x, y in bot) + f' L0,{H} Z'
DECKLE = 'data:image/svg+xml,' + urllib.parse.quote(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="none"><path d="{path}" fill="#000"/></svg>')

# ---------- blossom (same drawing as v12, own ids) ----------
PETAL = 'M0,-1.4 C-3.7,-3.1 -5.5,-7.3 -3.3,-10.1 C-2.1,-11.5 -0.8,-11.1 0,-9.9 C0.8,-11.1 2.1,-11.5 3.3,-10.1 C5.5,-7.3 3.7,-3.1 0,-1.4Z'
def blossom(cls, size, die_cut=False):
    pet = ''.join(f'<g transform="rotate({k*72})">'
                  + (f'<path d="{PETAL}" fill="#FFFDF8" stroke="#FFFDF8" stroke-width="2.6" stroke-linejoin="round"/>' if die_cut else '')
                  + f'<path d="{PETAL}" fill="url(#pg13)" stroke="rgba(166,122,138,.5)" stroke-width=".42"/>'
                  f'<path d="M0,-2.6 L0,-6.6" stroke="rgba(186,146,158,.32)" stroke-width=".38" stroke-linecap="round"/></g>' for k in range(5))
    return (f'<svg class="{cls}" width="{size}" height="{size}" viewBox="-12.5 -12.5 25 25" aria-hidden="true"><g>{pet}'
            f'<circle r="2.35" fill="url(#cg13)" stroke="rgba(92,108,148,.35)" stroke-width=".35"/>'
            f'<circle cx="-.7" cy="-.8" r=".65" fill="#fff" opacity=".75"/></g></svg>')

DEFS = '''<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
 <linearGradient id="pg13" x1="0" y1="-1" x2="0" y2="-11" gradientUnits="userSpaceOnUse">
  <stop offset="0" stop-color="#E6C9CF"/><stop offset=".45" stop-color="#F2E1E1"/><stop offset="1" stop-color="#FCF8F2"/></linearGradient>
 <radialGradient id="cg13" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#F4F7FB"/><stop offset=".55" stop-color="#A9B8D3"/><stop offset="1" stop-color="#7386AD"/></radialGradient>
 <linearGradient id="sv13" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7F8FB"/><stop offset=".35" stop-color="#B9C0CE"/>
  <stop offset=".55" stop-color="#EEF1F6"/><stop offset=".8" stop-color="#8E97AA"/><stop offset="1" stop-color="#D7DCE5"/></linearGradient>
 <linearGradient id="ink13" x1="0" x2="1"><stop offset="0" stop-color="#5B6C93" stop-opacity="0"/><stop offset=".08" stop-color="#5B6C93" stop-opacity=".55"/>
  <stop offset=".85" stop-color="#5B6C93" stop-opacity=".45"/><stop offset="1" stop-color="#5B6C93" stop-opacity="0"/></linearGradient>
</defs></svg>'''

CLIP = '''<svg class="dw-clip" width="22" height="50" viewBox="0 0 22 50" aria-hidden="true">
 <path d="M7,30 L7,9 C7,4.5 15,4.5 15,9 L15,40 C15,46.5 4,46.5 4,40 L4,13 M11,13 L11,36" fill="none" stroke="rgba(52,62,92,.32)" stroke-width="2.5" stroke-linecap="round" transform="translate(.8 1.2)"/>
 <path d="M7,30 L7,9 C7,4.5 15,4.5 15,9 L15,40 C15,46.5 4,46.5 4,40 L4,13 M11,13 L11,36" fill="none" stroke="url(#sv13)" stroke-width="1.9" stroke-linecap="round"/>
 <path d="M15,12 L15,38" stroke="#fff" stroke-width=".55" stroke-linecap="round" opacity=".8"/></svg>'''

MAG = '<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.4" cy="8.4" r="5.6" fill="none" stroke="#7183A9" stroke-width="1.3"/><path d="M12.6 12.6l4.6 4.8" stroke="#7183A9" stroke-width="1.5" stroke-linecap="round"/></svg>'
LINE = '<svg class="dw-ink" viewBox="0 0 260 6" preserveAspectRatio="none" aria-hidden="true"><path d="M1,3.6 C40,2.2 70,4.4 112,3.1 C150,2 190,4.2 259,2.8" fill="none" stroke="url(#ink13)" stroke-width="1.1" stroke-linecap="round"/></svg>'
MORE = '<i class="dw-more" aria-label="更多"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7h.01M7 7h.01M11 7h.01" stroke="#5B6C93" stroke-width="1.8" stroke-linecap="round"/></svg></i>'

TAG = 'trianon'
PINNED = [('阶段 3 骨架 · 交接说明', TAG, '10/25'), ('contracts · 事件形状', TAG, '10/24')]
GROUPS = [
    ('Aujourd\u2019hui', '今 天', [('重构聊天工作台的流式渲染', TAG, '刚刚', 'cur'),
                                   ('WebContentsView 内置浏览器', TAG, '', 'live'),
                                   ('流式输出落笔动效', TAG, '11:42', '')]),
    ('Hier', '昨 天', [('Pinia 会话状态持久化', TAG, '21:08', ''),
                      ('修复 Vite HMR 白屏', 'electron-shell', '17:30', ''),
                      ('CDP 截图接口', TAG, '14:15', '')]),
    ('Cette semaine', '本 周', [('Electron 窗口无边框拖拽', 'electron-shell', 'jeu.', ''),
                               ('会话列表分页与缓存', 'demo-app', 'mar.', '')]),
    ('Plus tôt', '更 早', [('主进程模块梳理', 'demo-app', '10 · 18', ''),
                          ('配色与字体试样', 'design-swatches', '10 · 12', '')]),
]

def ses(title, tag, when, kind='', k=0):
    cls = 'dw-ses' + (' cur' if kind == 'cur' else '') + (' live' if kind == 'live' else '')
    w = (f'<span class="dw-when">{when}</span>' if when else '')
    if kind == 'live':
        w = f'<span class="dw-when dw-pen">{blossom("dw-spin", 13)}落笔中</span>'
    extra = blossom('dw-stk', 28, die_cut=True) if kind == 'cur' else ''
    return (f'<div class="{cls} dw-c" data-k="{k}" role="button" tabindex="-1">{extra}'
            f'<div class="dw-t">{title}</div><div class="dw-m"><span class="dw-tag">{tag}</span>{w}{MORE}</div></div>')

k = 0
list_html = '<div class="dw-grp dw-c dw-pin-h"><em>Épinglé</em>置 顶</div><div class="dw-pack dw-c">' + CLIP
for t in PINNED:
    list_html += ses(*t, k=k).replace(' dw-c"', '"', 1); k += 1
list_html += '</div>'
for fr, cn, items in GROUPS:
    list_html += f'<div class="dw-grp dw-c"><em>{fr}</em>{cn}</div>'
    for it in items:
        list_html += ses(*it, k=k); k += 1
NSES = k

DRAWER = f'''<div class="drw-scrim" id="drwScrim" aria-hidden="true"></div>
<aside class="drw" id="drw" aria-label="历史会话" aria-hidden="true">
 <div class="drw-mv" id="drwMv">
  <div class="drw-paper"></div>
  <i class="drw-ribbon" aria-hidden="true"></i>
  <div class="drw-in">
   <header class="dw-hd dw-c"><em>Mémoire</em><span>历 史 会 话</span></header>
   <label class="dw-q dw-c">{MAG}<em>Chercher</em><span>搜索会话、项目、代码片段</span><kbd>Ctrl K</kbd>{LINE}</label>
   <div class="dw-new dw-c" role="button"><i>＋</i><b>新的一页</b><em>Nouvelle page</em></div>
   <div class="dw-list" id="dwList"><div class="dw-scr" id="dwScr">{list_html}<div class="dw-end dw-c">— fin —</div></div></div>
   <i class="dw-bar" id="dwBar" aria-hidden="true"><b></b></i>
   <footer class="dw-ft dw-c"><em>xii feuillets</em><b>✦</b><em>Esc</em> 收起</footer>
  </div>
 </div>
</aside>'''

SAND = '''<i class="hg-sand" aria-hidden="true"><svg width="16" height="34" viewBox="-8 0 16 34">
 <path class="st" d="M0,1 L0,20" stroke="#D8C9A2" stroke-width="1.1" stroke-linecap="round"/>
 <circle class="g g1" cx="0" cy="0" r=".9" fill="#CDBB8E"/><circle class="g g2" cx="0" cy="0" r=".75" fill="#D8C9A2"/><circle class="g g3" cx="0" cy="0" r=".8" fill="#CDBB8E"/>
 <path class="hp" d="M-4.2,30 Q0,25.4 4.2,30 Z" fill="#DCCDA8"/></svg></i>'''

CSS = r'''
<style id="v13sessions">
/* ===== v13: conversation history drawer (纸抽屉) ===== */
:root{--dw-l:98px;--dw-w:330px;--ivory:#FBF8F1;--mid:#2E3A63;--slate:#5B6C93}
/* hourglass: rotating wrapper + sand overlay */
.rail .it .hgw{position:relative;z-index:1;display:grid;place-items:center;width:58px;height:58px;font-weight:400;will-change:transform}
.rail .it .hgw img{position:static}
.hg-sand{position:absolute;left:50%;top:50%;width:16px;height:34px;margin:-3px 0 0 -8px;z-index:2;pointer-events:none;opacity:0}
.hg-sand svg{display:block;overflow:visible}
.hg-sand .st{stroke-dasharray:19 19;stroke-dashoffset:19}
.hg-sand .hp{transform-origin:0 30px;transform:scale(.2,.1);opacity:0}
.hg-sand .g{opacity:0}
/* rail tooltip never covers the drawer */
body.drw-open .rail .ttip,body.drw-closing .rail .ttip{visibility:hidden}
/* scrim: a faint shade, no blur */
.drw-scrim{position:fixed;inset:0;z-index:38;pointer-events:none;opacity:0;
 background:linear-gradient(90deg,rgba(46,56,92,.16) 0,rgba(46,56,92,.09) 34%,rgba(46,56,92,.06) 100%)}
body.drw-open .drw-scrim{pointer-events:auto}
/* drawer: emerges from behind the rail (left edge clipped) */
.drw{position:fixed;left:var(--dw-l);top:16px;bottom:16px;width:var(--dw-w);z-index:40;pointer-events:none;clip-path:inset(-60px -90px -60px 0);visibility:hidden}
body.drw-open .drw,.drw.anim{visibility:visible}
body.drw-open .drw{pointer-events:auto}
.drw-mv{position:absolute;inset:0;transform:translateX(-104%);transform-origin:0 0;will-change:transform;
 filter:drop-shadow(0 18px 22px rgba(40,52,95,.20)) drop-shadow(0 2px 3px rgba(40,52,95,.14))}
body.drw-open .drw-mv{transform:none}
.drw-paper{position:absolute;inset:0;
 -webkit-mask:url("__DECKLE__") 0 0/100% 100% no-repeat;mask:url("__DECKLE__") 0 0/100% 100% no-repeat;
 background:
  linear-gradient(90deg,rgba(58,70,108,.13),rgba(58,70,108,0) 16px),
  linear-gradient(90deg,transparent 21px,rgba(214,166,178,.42) 21px,rgba(214,166,178,.42) 22px,transparent 22px),
  radial-gradient(120% 60% at 80% 8%,rgba(255,255,255,.7),rgba(255,255,255,0) 60%),
  radial-gradient(90% 50% at 20% 100%,rgba(206,216,234,.55),rgba(206,216,234,0) 70%),
  linear-gradient(180deg,#FCFAF4 0,#F8F6F0 45%,#F1F2F2 100%)}
.drw-paper::after{content:"";position:absolute;inset:0;opacity:.5;mix-blend-mode:multiply;
 background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='330' height='330'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.012 .03' numOctaves='3' seed='7'/%3E%3CfeColorMatrix values='0 0 0 0 .55 0 0 0 0 .6 0 0 0 0 .72 0 0 0 .09 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")}
.drw-ribbon{position:absolute;right:30px;top:-7px;width:13px;height:92px;z-index:3;
 background:linear-gradient(90deg,#9AA3B6 0,#E9ECF2 30%,#C2C8D5 52%,#F4F6F9 70%,#A7AFC0 100%);
 clip-path:polygon(0 0,100% 0,100% 100%,50% calc(100% - 8px),0 100%);
 filter:drop-shadow(0 2px 2px rgba(40,52,95,.25))}
.drw-ribbon::before{content:"";position:absolute;left:0;right:0;top:0;height:9px;background:linear-gradient(180deg,rgba(70,80,110,.35),rgba(70,80,110,0))}
.drw-in{position:absolute;inset:0;display:flex;flex-direction:column;padding:26px 26px 0 34px}
.dw-c{will-change:transform,opacity}
/* header */
.dw-hd{display:flex;align-items:baseline;gap:12px;padding-right:30px}
.dw-hd em{font-family:"Pinyon",serif;font-style:normal;font-size:31px;color:#5B6C93;line-height:1;letter-spacing:0}
.dw-hd span{font-size:11px;letter-spacing:.42em;color:rgba(46,58,99,.6);white-space:nowrap}
/* search: inked underline, no box */
.dw-q{position:relative;display:flex;align-items:baseline;gap:8px;margin:34px 0 0;padding:0 2px 9px;cursor:text}
.dw-q svg:first-child{align-self:center;flex:none}
.dw-q em{font-family:"Pinyon",serif;font-style:normal;font-size:17px;color:#8C9DC0;line-height:1}
.dw-q span{font-size:12px;letter-spacing:.06em;color:rgba(70,85,120,.42);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dw-q kbd{margin-left:auto;font-family:"CormI",serif;font-style:italic;font-size:12px;color:rgba(70,85,120,.45);white-space:nowrap}
.dw-ink{position:absolute;left:-2px;right:-4px;bottom:0;width:calc(100% + 6px);height:6px}
/* new page */
.dw-new{display:flex;align-items:center;gap:10px;margin:18px -8px 6px -10px;padding:10px 12px;border-radius:3px;cursor:pointer;
 border:1px dashed rgba(124,143,184,.55);background:rgba(255,255,255,.42);transition:background .25s,transform .35s cubic-bezier(.22,1,.36,1)}
.dw-new i{width:20px;height:20px;border-radius:50%;display:grid;place-items:center;font-style:normal;font-size:12px;color:#5E6F8E;
 background:radial-gradient(circle at 35% 30%,#FFFFFF,#D7DCE6 70%,#B6BDCB);box-shadow:0 1px 2px rgba(60,70,100,.25)}
.dw-new b{font-weight:600;font-size:13px;letter-spacing:.14em;color:#3E4C76}
.dw-new em{margin-left:auto;font-family:"Pinyon",serif;font-style:normal;font-size:15px;color:#9AA8C6}
.dw-new:hover{background:rgba(255,255,255,.8)}
/* list + custom scroll */
.dw-list{position:relative;flex:1;min-height:0;overflow:hidden;margin:0 -14px 0 -14px;padding:0 14px;
 -webkit-mask:linear-gradient(180deg,transparent 0,#000 var(--ft,0px),#000 calc(100% - 56px),transparent);
 mask:linear-gradient(180deg,transparent 0,#000 var(--ft,0px),#000 calc(100% - 56px),transparent)}
.dw-scr{padding:4px 0 46px;will-change:transform}
.dw-bar{position:absolute;right:9px;top:var(--bt,200px);height:var(--bh,500px);width:2px;border-radius:2px;background:rgba(124,143,184,.16);opacity:.55;transition:opacity .4s}
.dw-bar b{position:absolute;left:-1px;width:4px;top:0;height:var(--th,80px);border-radius:3px;transform:translateY(var(--ty,0px));
 background:linear-gradient(90deg,#9AA3B6,#F2F4F8 45%,#A9B1C2);box-shadow:0 0 0 .5px rgba(90,104,140,.35),0 1px 2px rgba(40,52,95,.2)}
.drw:hover .dw-bar,.dw-bar.on{opacity:1}
/* group headers */
.dw-grp{display:flex;align-items:baseline;gap:9px;margin:22px 0 6px;font-size:10.5px;letter-spacing:.34em;color:rgba(46,58,99,.5);white-space:nowrap}
.dw-grp em{font-family:"Pinyon",serif;font-style:normal;font-size:19px;letter-spacing:0;color:#6F82AC;line-height:1}
.dw-grp::after{content:"";flex:1;align-self:center;height:1px;margin-left:4px;background:linear-gradient(90deg,rgba(124,143,184,.38),rgba(124,143,184,0))}
.dw-pin-h{margin-top:14px}
/* session line -> slip */
.dw-ses{position:relative;margin:0 -10px;padding:8px 12px 8px 12px;border-radius:2px;cursor:pointer;
 transition:background-color .26s,box-shadow .3s,transform .34s cubic-bezier(.22,1,.36,1)}
.dw-t{font-size:13.4px;font-weight:500;color:#2E3A63;letter-spacing:.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.45;padding-right:6px}
.dw-m{display:flex;align-items:baseline;gap:10px;margin-top:2px;height:15px}
.dw-tag{font-size:8.6px;letter-spacing:.2em;text-transform:uppercase;color:rgba(78,94,140,.55)}
.dw-when{margin-left:auto;font-family:"CormI",serif;font-style:italic;font-size:12.5px;color:rgba(46,58,99,.5);transition:opacity .2s;white-space:nowrap}
.dw-pen{display:flex;align-items:center;gap:5px;font-family:var(--serif);font-style:normal;font-size:10.5px;letter-spacing:.2em;color:#9A7584}
.dw-spin{display:block;animation:dwspin 3.6s linear infinite;filter:drop-shadow(0 .6px .8px rgba(56,68,108,.22))}
@keyframes dwspin{to{transform:rotate(360deg)}}
.dw-more{position:absolute;right:9px;bottom:6px;width:22px;height:18px;display:grid;place-items:center;opacity:0;transform:translateX(-3px);
 border-radius:9px;transition:opacity .2s,transform .3s cubic-bezier(.22,1,.36,1)}
.dw-ses:hover{background-color:#FFFDF9;transform:translate(-1px,-2px) rotate(-.45deg);
 box-shadow:0 9px 14px -9px rgba(40,52,95,.42),0 1px 2px rgba(40,52,95,.12),inset 0 0 0 1px rgba(255,255,255,.9)}
.dw-ses:hover .dw-when{opacity:0}
.dw-ses+.dw-ses{margin-top:3px}
.dw-pen{transition:transform .3s cubic-bezier(.22,1,.36,1)}
.dw-ses:hover .dw-when.dw-pen{opacity:1;transform:translateX(-28px)}
.dw-ses:hover .dw-more{opacity:1;transform:none;background:rgba(124,143,184,.12)}
/* current: pressed pale-blue slip + die-cut blossom sticker */
.dw-ses.cur{background:#E7EDF5;box-shadow:inset 0 1px 2px rgba(40,52,95,.16),inset 0 0 0 1px rgba(124,143,184,.30);transform:none}
.dw-ses.cur .dw-t{font-weight:600;color:#25305A}
.dw-ses.cur::before{content:"";position:absolute;left:-1px;top:8px;bottom:8px;width:2px;border-radius:2px;background:linear-gradient(180deg,#B8C2D6,#7F93BC)}
.dw-stk{position:absolute;right:2px;top:-11px;transform:rotate(16deg);filter:drop-shadow(0 1.5px 1.5px rgba(56,68,108,.25))}
.dw-ses.cur:hover{background:#E9EFF7;transform:none;box-shadow:inset 0 1px 2px rgba(40,52,95,.16),inset 0 0 0 1px rgba(124,143,184,.36)}
/* pinned packet held by a silver clip */
.dw-pack{position:relative;margin:4px -6px 0 -4px;padding:6px 6px 4px;background:linear-gradient(180deg,#EEF2F8,#E8EDF5);transform:rotate(-.5deg);border-radius:1px;
 box-shadow:0 6px 10px -8px rgba(40,52,95,.4),0 1px 1px rgba(40,52,95,.1),3px 3px 0 -1px #F6F4EE,3px 3px 0 0 rgba(124,143,184,.22)}
.dw-pack .dw-ses{margin:0 -4px}
.dw-pack .dw-ses+.dw-ses::after{content:"";position:absolute;left:12px;right:12px;top:0;height:1px;background:rgba(124,143,184,.22)}
.dw-pack .dw-ses:hover{background-color:#F7F9FC}
.dw-clip{position:absolute;right:22px;top:-21px;z-index:2;transform:rotate(7deg) scale(1.12);pointer-events:none}
.dw-end{text-align:center;margin:26px 0 0;font-family:"CormI",serif;font-style:italic;font-size:12px;letter-spacing:.2em;color:rgba(46,58,99,.32)}
.dw-ft{display:flex;justify-content:center;align-items:baseline;gap:6px;padding:10px 0 20px;font-size:10.5px;letter-spacing:.2em;color:rgba(70,85,120,.45)}
.dw-ft em{font-family:"CormI",serif;font-style:italic;letter-spacing:.04em;font-size:12.5px}.dw-ft b{font-weight:400;color:#B9A27A;margin:0 4px}
@media (prefers-reduced-motion:reduce){.dw-spin{animation:none}.dw-ses,.dw-ses:hover{transform:none!important}}
</style>
'''.replace('__DECKLE__', DECKLE)

JS = r'''<script>
(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)');
const b=document.body,drw=document.getElementById('drw'),mv=document.getElementById('drwMv'),scrim=document.getElementById('drwScrim');
const hgIt=document.querySelectorAll('.rail .it')[1],hg=hgIt.querySelector('.hgw'),sand=hgIt.querySelector('.hg-sand');
const list=document.getElementById('dwList'),scr=document.getElementById('dwScr'),bar=document.getElementById('dwBar');
const cs=[...drw.querySelectorAll('.dw-c')];
let open=false,anims=[],flip=0,clT=0;
const spring=(z,w,t)=>{if(z>=1)return (1+w*t)*Math.exp(-w*t);const wd=w*Math.sqrt(1-z*z);return Math.exp(-z*w*t)*(Math.cos(wd*t)+(z*w/wd)*Math.sin(wd*t))};
const stop=()=>{anims.forEach(a=>a.cancel());anims=[]};
const A=(el,kf,o)=>{const a=el.animate(kf,o);anims.push(a);return a};
/* drawer travel: ease-out slide with a paper settle (tilt + tiny overshoot), sampled spring */
const openFrames=()=>{const f=[],N=30,D=.56;for(let i=0;i<=N;i++){const t=i/N*D,u=i/N;
  const x=spring(.82,11.5,t),r=spring(.42,15,t),sy=spring(.5,18,t);
  f.push({offset:u,transform:`translateX(${(-104*x).toFixed(2)}%) rotate(${(-1.6*r).toFixed(3)}deg) scaleY(${(1-.012*sy).toFixed(4)})`})}
  f[N].transform='none';return f};
const sandRun=(dly)=>{const st=sand.querySelector('.st'),hp=sand.querySelector('.hp'),gs=[...sand.querySelectorAll('.g')];
  A(sand,[{opacity:0},{opacity:1,offset:.12},{opacity:1,offset:.8},{opacity:0}],{duration:1050,delay:dly,fill:'backwards'});
  A(st,[{strokeDashoffset:19},{strokeDashoffset:0,offset:.3},{strokeDashoffset:0,offset:.72},{strokeDashoffset:-19}],{duration:1000,delay:dly,easing:'cubic-bezier(.4,0,.6,1)',fill:'backwards'});
  A(hp,[{opacity:0,transform:'scale(.2,.1)'},{opacity:1,transform:'scale(1,1)'}],{duration:900,delay:dly+120,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
  gs.forEach((g,k)=>A(g,[{opacity:0,transform:'translate(0,2px)'},{opacity:1,transform:`translate(${[-1.1,.9,-.4][k]}px,10px)`,offset:.4},{opacity:0,transform:`translate(${[-1.8,1.6,-.9][k]}px,27px)`}],
    {duration:520,delay:dly+180+k*150,easing:'cubic-bezier(.5,0,.9,.6)',fill:'backwards'}))};
const doOpen=()=>{stop();open=true;b.classList.remove('drw-closing');b.classList.add('drw-open');drw.setAttribute('aria-hidden','false');setScroll(0,true);
  if(RM.matches){A(drw,[{opacity:0},{opacity:1}],{duration:140});A(scrim,[{opacity:0},{opacity:1}],{duration:140});scrim.style.opacity=1;return}
  drw.classList.add('anim');
  // hourglass tips over (0 -> 180), a short trickle once it has turned
  A(hg,[{transform:`rotate(${flip}deg)`},{transform:`rotate(${flip+196}deg)`,offset:.62},{transform:`rotate(${flip+174}deg)`,offset:.82},{transform:`rotate(${flip+180}deg)`}],
    {duration:560,easing:'cubic-bezier(.45,0,.3,1)'});flip+=180;hg.style.transform=`rotate(${flip}deg)`;
  sandRun(430);
  A(scrim,[{opacity:0},{opacity:1}],{duration:420,delay:60,easing:'ease-out',fill:'backwards'});scrim.style.opacity=1;
  A(mv,openFrames(),{duration:600,delay:70,easing:'linear',fill:'backwards'});
  cs.forEach((e,i)=>A(e,[{opacity:0,transform:'translate(-16px,3px) rotate(-1.4deg)'},{opacity:1,transform:'none'}],
    {duration:360,delay:200+i*32,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}))};
const doClose=()=>{stop();open=false;b.classList.remove('drw-open');b.classList.add('drw-closing');clearTimeout(clT);clT=setTimeout(()=>b.classList.remove('drw-closing'),700);drw.setAttribute('aria-hidden','true');
  if(RM.matches){drw.classList.add('anim');A(drw,[{opacity:1},{opacity:0}],{duration:140,fill:'forwards'}).onfinish=()=>{if(!open)drw.classList.remove('anim')};A(scrim,[{opacity:1},{opacity:0}],{duration:140});scrim.style.opacity=0;return}
  drw.classList.add('anim');
  A(hg,[{transform:`rotate(${flip}deg)`},{transform:`rotate(${flip+192}deg)`,offset:.65},{transform:`rotate(${flip+180}deg)`}],{duration:480,easing:'cubic-bezier(.45,0,.3,1)'});flip+=180;hg.style.transform=`rotate(${flip}deg)`;
  sandRun(360);
  const n=cs.length;cs.forEach((e,i)=>A(e,[{opacity:1,transform:'none'},{opacity:0,transform:'translate(-10px,0) rotate(-.8deg)'}],{duration:170,delay:(n-1-i)*6,easing:'cubic-bezier(.4,0,1,1)',fill:'both'}));
  A(mv,[{transform:'none'},{transform:'translateX(-2%) rotate(-.4deg)',offset:.25},{transform:'translateX(-104%) rotate(-1.2deg)'}],{duration:380,delay:70,easing:'cubic-bezier(.55,0,.75,.2)',fill:'both'})
    .onfinish=()=>{if(!open)drw.classList.remove('anim')};
  A(scrim,[{opacity:1},{opacity:0}],{duration:380,delay:120,easing:'ease-in',fill:'backwards'});scrim.style.opacity=0};
const toggle=v=>{v=v===undefined?!open:v;if(v===open)return;v?doOpen():doClose()};
window.__v13toggle=toggle;
hgIt.addEventListener('click',()=>toggle());
scrim.addEventListener('click',()=>toggle(false));
addEventListener('keydown',e=>{if(e.key==='Escape')toggle(false);if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='h'){e.preventDefault();toggle()}});
/* custom smooth scroll (wheel -> eased target), silver thumb, top fade only once scrolled */
let sy=0,ty=0,raf=0,last=0,barT=0;
const maxS=()=>Math.max(0,scr.offsetHeight-list.clientHeight);
const paint=()=>{scr.style.transform=`translateY(${(-sy).toFixed(2)}px)`;list.style.setProperty('--ft',Math.min(26,sy*.6).toFixed(1)+'px');
  const H=list.clientHeight,m=maxS(),th=Math.max(44,H*H/scr.offsetHeight);
  bar.style.setProperty('--bt',(list.offsetTop+6)+'px');bar.style.setProperty('--bh',(H-58)+'px');
  bar.style.setProperty('--th',th.toFixed(1)+'px');bar.style.setProperty('--ty',(m?(H-58-th)*sy/m:0).toFixed(1)+'px')};
const step=n=>{const dt=Math.min(64,n-last);last=n;const a=RM.matches?1:1-Math.exp(-dt/110);sy+=(ty-sy)*a;
  if(Math.abs(ty-sy)<.1)sy=ty;paint();if(sy!==ty)raf=requestAnimationFrame(step);else raf=0};
const setScroll=(v,now)=>{ty=Math.max(0,Math.min(maxS(),v));if(now){sy=ty;paint();return}
  bar.classList.add('on');clearTimeout(barT);barT=setTimeout(()=>bar.classList.remove('on'),900);
  if(!raf){last=performance.now();raf=requestAnimationFrame(step)}};
list.addEventListener('wheel',e=>{e.preventDefault();setScroll(ty+e.deltaY)},{passive:false});
window.__v13scroll=v=>setScroll(v);
paint();
if(location.hash.includes('hist')){open=true;b.classList.add('drw-open');drw.setAttribute('aria-hidden','false');flip=180;hg.style.transform='rotate(180deg)';scrim.style.opacity=1}
else scrim.style.opacity=0;
})();
</script>'''

# --- hourglass wrapper + sand overlay (rail item #2) ---
nav0 = s.index('<nav class="rail">'); nav1 = s.index('</nav>', nav0)
nav = s[nav0:nav1]
m = re.search(r'(<div class="it" style="--i:1">)(<img src="data:image/png;base64,[A-Za-z0-9+/=]+" alt="">)', nav)
assert m
nav = nav[:m.start()] + m.group(1) + '<b class="hgw">' + m.group(2) + '</b>' + SAND + nav[m.end():]
s = s[:nav0] + nav + s[nav1:]

# --- rail must not hide while the drawer is open (pointer is over the drawer) ---
sub1("else{if(x>rail.getBoundingClientRect().right+36){",
     "else{if(x>(b.classList.contains('drw-open')?document.getElementById('drw').getBoundingClientRect().right:rail.getBoundingClientRect().right)+36){")
sub1("document.addEventListener('pointerleave',()=>{clearTimeout(tOpen);tOpen=0;if(open&&!tClose)",
     "document.addEventListener('pointerleave',()=>{clearTimeout(tOpen);tOpen=0;if(open&&!tClose&&!b.classList.contains('drw-open'))")

sub1('<title>Kimi Code · 蓝雾厅 v8</title>', '<title>Kimi Code · 蓝雾厅 v13 · 历史会话</title>')
sub1('</head>', CSS + '</head>')
idx = s.rfind('</body>')
s = s[:idx] + DEFS + DRAWER + JS + s[idx:]
open(OUT, 'w', encoding='utf-8').write(s)
print('wrote', OUT, len(s), 'sessions', NSES)
