#!/usr/bin/env python3
"""Build sessions_v2.html from v8.html, reusing build_v13.py's drawer code (definitions are exec'd from its
source; build_v13.py / v13_sessions.html / v8.html are read only).
New in v2:
  1) drawer: paper index-tab dividers 进行中 / 已完成 / 工作空间; sessions grouped under collapsible project folders
     (paper label tab + envelope that opens/closes), collapse-all + filter controls. Pinned clip packet, current slip
     + blossom sticker, streaming blossom, hover slip all kept.
  2) composer model chip "K3.1 Pro · Max" (paper luggage tag) -> menu-card popover (models, 思考 Low/High/Max slider,
     cache hint, 更多模型…).
  3) 更多模型 -> centred ivory catalogue sheet (inked search, provider index tabs, rows w/ small-caps meta, ✓, silver
     star sticker favourites, paper key-cap footer). Esc / ↑↓ / Enter work.
Hooks: window.__v13toggle(open?), window.__s2pop(open?), window.__s2modal(open?), #hist opens the drawer."""
import re, random, math, urllib.parse

HERE = './'
SRC = HERE + 'v8.html'
OUT = HERE + 'sessions_v2.html'

# ---- reuse build_v13 definitions (CSS, JS, blossom, clip, deckle ...) without running its write step ----
v13src = open(HERE + 'build_v13.py', encoding='utf-8').read()
v13defs = v13src.split('# --- hourglass wrapper')[0]
ns = {}
exec(compile(v13defs, 'build_v13_defs', 'exec'), ns)
blossom, DEFS, CLIP, MAG, LINE, MORE, SAND = (ns[k] for k in ('blossom', 'DEFS', 'CLIP', 'MAG', 'LINE', 'MORE', 'SAND'))
CSS13, JS13 = ns['CSS'], ns['JS']

s = open(SRC, encoding='utf-8').read()
def sub1(old, new):
    global s
    assert s.count(old) == 1, (old[:80], s.count(old))
    s = s.replace(old, new)
def rep1(src, old, new):
    assert src.count(old) == 1, (old[:80], src.count(old))
    return src.replace(old, new)

def roman(n):
    out = ''
    for v, r in ((10, 'x'), (9, 'ix'), (5, 'v'), (4, 'iv'), (1, 'i')):
        while n >= v: out += r; n -= v
    return out

# ---------- soft deckle mask for cards (all four edges, low amplitude, irregular) ----------
def deckle(W, H, seed, amp=1.0):
    rnd = random.Random(seed)
    def edge(n0, n1, fixed, axis, sign):
        pts = []; t = n0; step = 1 if n1 > n0 else -1
        while (t - n1) * step < 0:
            off = amp * (0.9 * math.sin(t / 23.0 + seed) + rnd.uniform(-.8, .8))
            v = fixed + sign * (1.4 + off)
            pts.append((t, v) if axis == 'x' else (v, t))
            t += step * rnd.uniform(6, 12)
        return pts
    pts = edge(0, W, 0, 'x', 1) + edge(0, H, W, 'y', -1) + edge(W, 0, H, 'x', -1) + edge(H, 0, 0, 'y', 1)
    d = 'M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in pts) + ' Z'
    return 'data:image/svg+xml,' + urllib.parse.quote(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="none"><path d="{d}" fill="#000"/></svg>')
DK_POP = deckle(312, 470, 31, .7)
DK_MDL = deckle(780, 660, 57, .9)

# ---------- small inked icons ----------
ENV = ('<svg class="pf-env" width="17" height="13" viewBox="0 0 17 13" aria-hidden="true">'
       '<rect x="1" y="3.2" width="15" height="9" rx="1" fill="#FBF9F3" stroke="#6F82AC" stroke-width="1"/>'
       '<path d="M1.6,11.6 L6.6,7.4 M15.4,11.6 L10.4,7.4" stroke="rgba(111,130,172,.55)" stroke-width=".8" fill="none"/>'
       '<path class="flap" d="M1.2,3.4 L8.5,8.6 L15.8,3.4" fill="#EEF2F8" stroke="#6F82AC" stroke-width="1" stroke-linejoin="round"/>'
       '<circle class="seal" cx="8.5" cy="7.9" r="1.5" fill="#D9B8C1"/></svg>')
CHEV = '<svg class="pf-chev" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2.4,3.6 L5,6.3 L7.6,3.6" fill="none" stroke="#6F82AC" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
I_FOLD = ('<svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"><path class="a1" d="M4.6,2.6 L8,5.8 L11.4,2.6" fill="none" stroke="#5B6C93" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>'
          '<path class="a2" d="M4.6,13.4 L8,10.2 L11.4,13.4" fill="none" stroke="#5B6C93" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>'
          '<path d="M3,8 H13" stroke="rgba(91,108,147,.45)" stroke-width="1" stroke-linecap="round"/></svg>')
I_FILT = ('<svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5,5 H13.5 M2.5,11 H13.5" stroke="#5B6C93" stroke-width="1.15" stroke-linecap="round"/>'
          '<circle cx="10.4" cy="5" r="1.9" fill="#FBF9F3" stroke="#5B6C93" stroke-width="1.15"/><circle cx="5.6" cy="11" r="1.9" fill="#FBF9F3" stroke="#5B6C93" stroke-width="1.15"/></svg>')
CHECK = '<svg class="ck" width="15" height="13" viewBox="0 0 15 13" aria-hidden="true"><path d="M1.8,7.2 C3.3,8.4 4.6,9.8 5.7,11.3 C7.9,7.2 10.6,3.9 13.4,1.6" fill="none" stroke="#4A5A86" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/></svg>'
STARP = 'M0,-7.2 L2.05,-2.55 L7,-2.2 L3.2,1.05 L4.4,6 L0,3.35 L-4.4,6 L-3.2,1.05 L-7,-2.2 L-2.05,-2.55 Z'
STAR = (f'<svg class="st" width="22" height="22" viewBox="-11 -11 22 22" aria-hidden="true"><g class="off"><path d="{STARP}" fill="none" stroke="rgba(79,97,136,.62)" stroke-width="1.05" stroke-linejoin="round"/></g>'
        f'<g class="onn"><path d="{STARP}" fill="#FFFDF8" stroke="#FFFDF8" stroke-width="3.8" stroke-linejoin="round"/>'
        f'<path d="{STARP}" fill="url(#sv2s)" stroke="rgba(58,70,106,.62)" stroke-width=".65" stroke-linejoin="round"/>'
        '<path d="M-1.2,-4.4 L-.3,-2.2" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".9"/></g></svg>')
BOOK = ('<svg width="16" height="15" viewBox="0 0 16 15" aria-hidden="true"><path d="M8,3.2 C6,2 3.6,1.8 1.6,2.4 V12.6 C3.6,12 6,12.2 8,13.4 C10,12.2 12.4,12 14.4,12.6 V2.4 C12.4,1.8 10,2 8,3.2 Z" fill="#FBF9F3" stroke="#5B6C93" stroke-width="1.05" stroke-linejoin="round"/>'
        '<path d="M8,3.2 V13.3" stroke="#5B6C93" stroke-width=".9"/><path d="M11.6,1.9 V6.2 L12.5,5.4 L13.4,6.2 V2.2" fill="#D9B8C1" stroke="none"/></svg>')
XMARK = '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.4,2.6 C5,5.1 7.2,7.3 9.6,9.5 M9.5,2.4 C7,5 5,7 2.5,9.6" fill="none" stroke="#4A5A86" stroke-width="1.35" stroke-linecap="round"/></svg>'
CARET = '<svg class="mc-car" width="9" height="9" viewBox="0 0 10 10" aria-hidden="true"><path d="M2.4,6.4 L5,3.7 L7.6,6.4" fill="none" stroke="#5B6C93" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>'

# ---------- drawer content ----------
P1 = 'trianon-workbench'
PINNED = [('阶段 3 骨架 · 交接说明', P1, '10/25'), ('contracts · 事件形状', P1, '10/24')]
# 进行中: project folders, most recently active project first; inside each folder newest first.
ACTIVE = [
    (P1, True, [('重构聊天工作台的流式渲染', '刚刚', 'cur'), ('WebContentsView 内置浏览器', '', 'live'),
                ('流式输出落笔动效', '11:42', ''), ('Pinia 会话状态持久化', 'hier', '')]),
    ('workspace', False, [('修复 Vite HMR 白屏', 'hier', ''), ('Electron 窗口无边框拖拽', 'jeu.', '')]),
    ('project', True, [('CDP 截图接口', 'hier', ''), ('会话列表分页与缓存', 'mar.', ''), ('主进程模块梳理', '10 · 18', '')]),
    ('atelier', True, [('立绘裁切与透明边处理', 'mer.', '')]),
    ('ada', True, [('配色与字体试样', '10 · 12', '')]),
]
DONE = [
    (P1, True, [('阶段 2 · 契约冻结与评审', '10/22'), ('图标集 · 银线描边重绘', '10/19')]),
    ('project', True, [('依赖升级到 Electron 33', '10/09')]),
    ('ada', True, [('首页插画排版', '10/16')]),
]
WORKSPACES = [(P1, '~/code/trianon-workbench', 7, '刚刚'), ('workspace', '~/playground', 2, 'hier'),
              ('project', '~/project', 3, 'mar.'), ('atelier', 'D:\\atelier', 1, 'mer.'), ('ada', '~/ada', 1, '10 · 12')]

def ses_one(title, when, kind=''):
    cls = 'dw-ses one dw-c' + (' cur' if kind == 'cur' else '') + (' live' if kind == 'live' else '')
    w = f'<span class="dw-when">{when}</span>' if when else ''
    if kind == 'live':
        w = f'<span class="dw-when dw-pen">{blossom("dw-spin", 13)}落笔中</span>'
    extra = ''
    if kind == 'cur':
        extra = blossom('dw-stk', 26, die_cut=True); w = ''
    return f'<div class="{cls}" role="button" tabindex="-1">{extra}<div class="dw-t">{title}</div>{w}{MORE}</div>'

def ses_two(title, tag, when):
    return (f'<div class="dw-ses" role="button" tabindex="-1"><div class="dw-t">{title}</div>'
            f'<div class="dw-m"><span class="dw-tag">{tag}</span><span class="dw-when">{when}</span>{MORE}</div></div>')

def folder(name, opened, inner, n, cur=False):
    return (f'<div class="pf{"" if opened else " col"}{" curp" if cur else ""}" data-p="{name}">'
            f'<div class="pf-h dw-c" role="button" tabindex="-1" aria-expanded="{"true" if opened else "false"}">'
            f'<span class="pf-tab">{ENV}<b>{name}</b></span><i class="pf-rule"></i><em class="pf-n">{roman(n)}</em>{CHEV}</div>'
            f'<div class="pf-b"><div class="pf-bi">{inner}</div></div></div>')

nact = len(PINNED)
pane_a = '<div class="dw-grp dw-c dw-pin-h"><em>Épinglé</em>置 顶</div><div class="dw-pack dw-c">' + CLIP
for t, tag, w in PINNED: pane_a += ses_two(t, tag, w)
pane_a += '</div>'
pane_a += (f'<div class="dw-grp dw-c dw-sh"><em>Séances</em>会 话<span class="sh-bt">'
           f'<i class="sh-b" id="dwFold" role="button" aria-label="全部折叠" title="全部折叠">{I_FOLD}</i>'
           f'<i class="sh-b" id="dwFilt" role="button" aria-label="筛选" title="筛选">{I_FILT}</i></span></div>')
for name, opened, items in ACTIVE:
    pane_a += folder(name, opened, ''.join(ses_one(*it) for it in items), len(items), cur=(name == P1)); nact += len(items)
pane_a += '<div class="dw-end dw-c">— fin —</div>'

ndone = 0
pane_d = '<div class="dw-grp dw-c dw-sh"><em>Achevé</em>已 完 成<span class="sh-note">本周 iv 项</span></div>'
for name, opened, items in DONE:
    pane_d += folder(name, opened, ''.join(ses_one(t, w) for t, w in items), len(items)); ndone += len(items)
pane_d += '<div class="dw-end dw-c">— fin —</div>'

pane_w = '<div class="dw-grp dw-c dw-sh"><em>Ateliers</em>工 作 空 间</div>'
for name, path, n, w in WORKSPACES:
    pane_w += (f'<div class="ws dw-c{" curp" if name == P1 else ""}" role="button" tabindex="-1"><span class="pf-tab">{ENV}<b>{name}</b></span>'
               f'<div class="ws-m"><code>{path}</code><span class="dw-when">{w}</span></div>'
               f'<div class="ws-n"><em>{roman(n)}</em> séance{"s" if n > 1 else ""}</div></div>')
pane_w += '<div class="dw-new ws-add dw-c" role="button"><i>＋</i><b>打开文件夹…</b><em>Ouvrir</em></div><div class="dw-end dw-c">— fin —</div>'

TABS_D = [('进行中', ''), ('已完成', blossom('tb-dot', 11)), ('工作空间', '')]
tabs_html = ''.join(f'<div class="ptab{" on" if i == 0 else ""}" data-t="{i}" role="tab" aria-selected="{"true" if i == 0 else "false"}">{lbl}{x}</div>'
                    for i, (lbl, x) in enumerate(TABS_D))
FEUILLETS = [f'{roman(nact)} feuillets', f'{roman(ndone)} achevés', f'{roman(len(WORKSPACES))} ateliers']

DRAWER = f'''<div class="drw-scrim" id="drwScrim" aria-hidden="true"></div>
<aside class="drw" id="drw" aria-label="历史会话" aria-hidden="true">
 <div class="drw-mv" id="drwMv">
  <div class="drw-paper"></div>
  <i class="drw-ribbon" aria-hidden="true"></i>
  <div class="drw-in">
   <header class="dw-hd dw-c"><em>Mémoire</em><span>历 史 会 话</span></header>
   <label class="dw-q dw-c">{MAG}<em>Chercher</em><span>搜索会话、项目、代码片段</span><kbd>Ctrl K</kbd>{LINE}</label>
   <div class="dw-new dw-c" role="button"><i>＋</i><b>新的一页</b><em>Nouvelle page</em></div>
   <div class="ptabs dw-tabs dw-c" id="dwTabs" role="tablist">{tabs_html}</div>
   <div class="dw-list" id="dwList"><div class="dw-scr" id="dwScr">
     <div class="dw-pane on" data-pane="0">{pane_a}</div>
     <div class="dw-pane" data-pane="1">{pane_d}</div>
     <div class="dw-pane" data-pane="2">{pane_w}</div>
   </div></div>
   <i class="dw-bar" id="dwBar" aria-hidden="true"><b></b></i>
   <footer class="dw-ft dw-c"><em id="dwCount">{FEUILLETS[0]}</em><b>✦</b><em>Esc</em> 收起</footer>
   <div class="fmenu" id="fMenu" aria-hidden="true">
     <div class="fm-r on" role="menuitemcheckbox"><span>按项目分组</span>{CHECK}</div>
     <div class="fm-r on" role="menuitemcheckbox"><span>按最近活动排序</span>{CHECK}</div>
     <div class="fm-r" role="menuitemcheckbox"><span>只看有更新的</span>{CHECK}</div>
   </div>
  </div>
 </div>
</aside>'''

# ---------- models ----------
MODELS = [  # provider id, provider label, name, extra tag, meta (latin items are rendered as small caps)
    ('kimi', 'Kimi 订阅', 'K2.8 Preview', '', ['1M ctx', '思考', '始终思考', '图片输入', '视频输入', '工具调用', 'dynamically loaded tools']),
    ('kimi', 'Kimi 订阅', 'K2.7 Code Highspeed', '', ['256k ctx', '思考', '始终思考', '图片输入', '视频输入', '工具调用']),
    ('kimi', 'Kimi 订阅', 'K3', '', ['1M ctx', '思考', '始终思考', '图片输入', '视频输入', '工具调用', 'dynamically loaded tools']),
    ('kimi', 'Kimi 订阅', 'K3-256k', '', ['256k ctx', '思考', '始终思考', '图片输入', '工具调用', 'dynamically loaded tools']),
    ('kimi', 'Kimi 订阅', 'K3.1 Pro', '', ['1M ctx', '思考', '始终思考', '图片输入', '视频输入', '工具调用', 'dynamically loaded tools']),
    ('kimi', 'Kimi 订阅', 'K3.1 Pro Highspeed', '2× usage cost', ['1M ctx', '思考', '始终思考', '图片输入', '视频输入', '工具调用', 'dynamically loaded tools']),
    ('volc', 'volcengine', 'doubao-seed-code', '', ['256k ctx', '思考', '图片输入', '工具调用']),
    ('volc', 'volcengine', 'deepseek-v3.1', '', ['128k ctx', '思考', '工具调用']),
    ('volc', 'volcengine', 'kimi-k2-turbo', '', ['256k ctx', '工具调用']),
    ('zai', 'zai-coding-plan', 'glm-4.6', '', ['200k ctx', '思考', '工具调用']),
    ('zai', 'zai-coding-plan', 'glm-4.5-air', '', ['128k ctx', '思考', '工具调用']),
]
CURM = 'K3.1 Pro'
def is_latin(t): return re.fullmatch(r'[\x00-\x7f×]+', t) is not None

pop_rows = ''.join(f'<div class="mp-row{" on" if n == CURM else ""}" data-m="{n}" role="menuitemradio" aria-checked="{"true" if n == CURM else "false"}">'
                   f'<b>{n}</b>{f"<span class=mp-x>{x}</span>" if x else ""}{CHECK}</div>'
                   for p, pl, n, x, m in MODELS if p == 'kimi')
POP = f'''<div class="mpop" id="mpop" role="menu" aria-label="选择模型" aria-hidden="true">
 <div class="mp-mv" id="mpMv">
  <div class="mp-paper"></div>
  {blossom('mp-stk', 24, die_cut=True)}
  <div class="mp-in">
   <div class="mp-hd mp-c"><em>Modèles</em><span>subscription</span></div>
   <div class="mp-list">{pop_rows}</div>
   <div class="mp-rule mp-c">{LINE}</div>
   <div class="mp-think mp-c"><span class="mp-tl"><em>Pensée</em>思 考</span>
     <div class="sld" id="mpSld" data-v="2" role="radiogroup" aria-label="思考程度"><i class="sld-th"></i>
       <button data-v="0" role="radio">Low</button><button data-v="1" role="radio">High</button><button data-v="2" role="radio" class="on">Max</button></div></div>
   <p class="mp-hint mp-c">提示：切换模型或思考程度会使已有的提示词缓存失效。建议新建会话，避免额外的 token 消耗。</p>
   <div class="mp-rule mp-c">{LINE}</div>
   <div class="mp-more mp-c" id="mpMore" role="button">{BOOK}<b>更多模型…</b><em>Catalogue</em></div>
  </div>
 </div>
</div>'''
# rows of popover are tagged with mp-c individually
POP = POP.replace('<div class="mp-row', '<div class="mp-c mp-row')

def meta_html(pl, m):
    parts = [f'<span>{pl}</span>'] + [f'<span class="{"sc" if is_latin(t) else ""}">{t}</span>' for t in m]
    return '<i class="sep"></i>'.join(parts)
md_rows = ''
lastp = None
PROV = {'kimi': ('Kimi 订阅', 'subscription'), 'volc': ('volcengine', 'api key · cn-beijing'), 'zai': ('zai-coding-plan', 'coding plan · lite')}
for p, pl, n, x, m in MODELS:
    if p != lastp:
        md_rows += f'<div class="md-pv" data-p="{p}"><em>{PROV[p][0]}</em><span>{PROV[p][1]}</span></div>'; lastp = p
    on = n == CURM
    md_rows += (f'<div class="md-row{" on" if on else ""}" data-p="{p}" data-m="{n}" role="option" aria-selected="{"true" if on else "false"}" tabindex="-1">'
                f'<div class="md-tx"><b>{n}{f"<span class=mp-x>{x}</span>" if x else ""}</b><div class="md-meta">{meta_html(pl, m)}</div></div>'
                f'{CHECK}<button class="md-star" aria-pressed="false" aria-label="收藏">{STAR}</button></div>')
MTABS = [('all', '全部'), ('kimi', 'Kimi 订阅'), ('volc', 'volcengine'), ('zai', 'zai-coding-plan')]
mtabs = ''.join(f'<div class="ptab{" on" if k == "kimi" else ""}" data-t="{k}" role="tab">{l}</div>' for k, l in MTABS)
SV2 = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="sv2s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3F5F9"/><stop offset=".38" stop-color="#A3AEC4"/><stop offset=".55" stop-color="#E4E8F0"/><stop offset=".82" stop-color="#76829C"/><stop offset="1" stop-color="#C3CAD8"/></linearGradient></defs></svg>'
MODAL = f'''{SV2}<div class="mscrim" id="mscrim" aria-hidden="true"></div>
<div class="mdl" id="mdl" role="dialog" aria-modal="true" aria-label="切换模型" aria-hidden="true">
 <div class="mdl-mv" id="mdlMv">
  <div class="mdl-paper"></div>
  <i class="drw-ribbon mdl-rib" aria-hidden="true"></i>
  <div class="mdl-in">
   <header class="md-hd md-c"><em>Catalogue</em><span>切 换 模 型</span><button class="md-x" id="mdX" aria-label="关闭">{XMARK}</button></header>
   <label class="md-q dw-q md-c">{MAG}<em>Chercher</em><input id="mdIn" type="text" placeholder="搜索模型或提供商…" autocomplete="off" spellcheck="false"><kbd>/</kbd>{LINE}</label>
   <div class="ptabs md-tabs md-c" id="mdTabs" role="tablist">{mtabs}</div>
   <div class="md-list" id="mdList" role="listbox">{md_rows}<div class="md-empty">— 没有匹配的模型 —</div></div>
   <footer class="md-ft md-c"><span class="kc">↑</span><span class="kc">↓</span><span class="kl">导航</span><b>✦</b><span class="kc">Enter</span><span class="kl">选择</span><b>✦</b><span class="kc">Esc</span><span class="kl">关闭</span>
     <em class="md-cnt" id="mdCnt">vi modèles</em></footer>
  </div>
 </div>
</div>'''

CHIP = (f'<div class="mchip" id="mchip" role="button" tabindex="0" aria-haspopup="menu" aria-expanded="false">'
        f'<i class="mc-eye"></i><b class="mc-m" id="mcM">{CURM}</b><i class="mc-d">·</i><em class="mc-t" id="mcT">Max</em>{CARET}</div>')

CSS2 = r'''
<style id="s2sessions">
/* ===== sessions v2: tabs, project folders, model chip, popover, catalogue ===== */
/* shared paper index tabs */
.ptabs{position:relative;display:flex;align-items:flex-end;gap:5px;height:33px;padding:0 3px}
.ptabs::after{content:"";position:absolute;left:-8px;right:-8px;bottom:0;height:1px;z-index:1;
 background:linear-gradient(90deg,rgba(124,143,184,0),rgba(124,143,184,.42) 7%,rgba(124,143,184,.42) 93%,rgba(124,143,184,0))}
.ptab{position:relative;flex:1;height:28px;display:flex;align-items:center;justify-content:center;gap:5px;cursor:pointer;white-space:nowrap;
 font-size:12px;letter-spacing:.2em;color:rgba(46,58,99,.5);border-radius:7px 7px 0 0;transform:translateY(3px);
 background:linear-gradient(180deg,#E8EDF5,#DFE5EF);box-shadow:inset 0 1px 0 rgba(255,255,255,.75),0 0 0 .6px rgba(124,143,184,.34);
 transition:transform .42s cubic-bezier(.3,1.35,.45,1),background-color .3s,color .3s}
.ptab:hover{transform:translateY(1px);color:rgba(46,58,99,.72)}
.ptab.on{z-index:2;transform:none;color:#2E3A63;font-weight:600;background:linear-gradient(180deg,#FFFEFA,#FAF8F2);
 box-shadow:inset 0 1px 0 #fff,0 0 0 .6px rgba(124,143,184,.38),0 -5px 9px -7px rgba(40,52,95,.35)}
.ptab.on::after{content:"";position:absolute;left:.6px;right:.6px;bottom:-1px;height:2px;background:#FAF8F2;z-index:3}
.ptab.on::before{content:"";position:absolute;left:30%;right:30%;top:4px;height:1.5px;border-radius:2px;background:linear-gradient(90deg,#C9CFDA,#8E9BB8,#C9CFDA)}
.tb-dot{display:block;flex:none;margin-left:1px;filter:drop-shadow(0 .5px .6px rgba(56,68,108,.25))}
.dw-tabs{margin:14px -2px 0}
/* panes */
.dw-pane{display:none}.dw-pane.on{display:block}
.dw-grp.dw-sh{margin-top:22px}
.sh-bt{order:3;display:flex;gap:2px;margin-left:6px;align-self:center}
.sh-b{width:24px;height:22px;display:grid;place-items:center;border-radius:11px;cursor:pointer;transition:background-color .25s,transform .3s cubic-bezier(.22,1,.36,1)}
.sh-b:hover{background:rgba(124,143,184,.13)}.sh-b.on{background:rgba(124,143,184,.18)}
.sh-b svg path.a1,.sh-b svg path.a2{transition:transform .4s cubic-bezier(.3,1.35,.45,1);transform-origin:8px 8px}
#dwFold.all-col .a1{transform:translateY(-1px) scaleY(-1)}#dwFold.all-col .a2{transform:translateY(1px) scaleY(-1)}
.sh-note{margin-left:8px;font-family:"CormI",serif;font-style:italic;letter-spacing:.04em;font-size:12px;color:rgba(46,58,99,.42)}
/* project folders */
.pf{margin-top:12px}
.pf-h{position:relative;display:flex;align-items:flex-end;gap:8px;height:28px;cursor:pointer;margin:0 -2px}
.pf-tab{position:relative;display:flex;align-items:center;gap:5px;height:24px;padding:0 8px 0 7px;border-radius:6px 6px 0 0;max-width:calc(100% - 40px);min-width:0;
 background:linear-gradient(180deg,#F1F4F9,#E8EDF5);box-shadow:inset 0 1px 0 rgba(255,255,255,.85),0 0 0 .6px rgba(124,143,184,.32);
 transition:transform .34s cubic-bezier(.22,1,.36,1),box-shadow .3s,background-color .3s}
.pf-tab b{font-weight:600;font-size:8.6px;letter-spacing:.06em;text-transform:uppercase;color:#46557F;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pf-env{flex:none;overflow:visible}
.pf-env .flap{transform-origin:8.5px 3.4px;transition:transform .45s cubic-bezier(.3,1.3,.45,1)}
.pf-env .seal{transition:opacity .25s}
.pf:not(.col) .pf-env .flap{transform:scaleY(-.62)}.pf:not(.col) .pf-env .seal{opacity:0}
.pf-rule{flex:1;min-width:10px;height:1px;margin-bottom:0;align-self:flex-end;background:linear-gradient(90deg,rgba(124,143,184,.42),rgba(124,143,184,.12))}
.pf-n{font-family:"CormI",serif;font-style:italic;font-size:12.5px;color:rgba(46,58,99,.45);line-height:1;align-self:center;margin-top:5px}
.pf-chev{flex:none;align-self:center;margin:5px 2px 0 0;transition:transform .42s cubic-bezier(.3,1.35,.45,1)}
.pf.col .pf-chev{transform:rotate(-90deg)}
.pf-h:hover .pf-tab{transform:translateY(-1.5px);background:linear-gradient(180deg,#FBFCFE,#EEF2F8)}
.pf.curp .pf-tab{background:linear-gradient(180deg,#E9EFF7,#DCE4F0)}
.pf.curp .pf-tab b{color:#2E3A63}
.pf.col .pf-tab{box-shadow:inset 0 1px 0 rgba(255,255,255,.85),0 0 0 .6px rgba(124,143,184,.32),2px -2px 0 -.4px #F6F4EE,2px -2px 0 .2px rgba(124,143,184,.26)}
.pf.col .pf-h{opacity:.92}
.pf-b{overflow:hidden}
.pf.col .pf-b{display:none}
.pf-bi{position:relative;padding:6px 0 2px 14px}
.pf-bi::before{content:"";position:absolute;left:7px;top:2px;bottom:12px;width:1px;background:linear-gradient(180deg,rgba(150,164,196,.55),rgba(150,164,196,.12))}
/* one-line slips inside folders */
.dw-ses.one{display:flex;align-items:baseline;gap:10px;padding:7px 12px 7px 10px}
.dw-ses.one .dw-t{flex:1;min-width:0;font-size:13.2px}
.dw-ses.one .dw-more{bottom:auto;top:50%;margin-top:-9px}
.dw-ses.one .dw-stk{right:6px;top:-6px}
.dw-ses.one.cur::before{top:7px;bottom:7px}
.dw-ses.one.live .dw-t{padding-right:2px}
.dw-ses.one+.dw-ses.one{margin-top:2px}
/* workspace cards */
.ws{position:relative;margin:12px -6px 0;padding:8px 12px 9px 10px;border-radius:2px;cursor:pointer;transition:background-color .26s,box-shadow .3s,transform .34s cubic-bezier(.22,1,.36,1)}
.ws .pf-tab{display:inline-flex;margin:0 0 6px -2px}
.ws-m{display:flex;align-items:baseline;gap:10px}
.ws-m code{font-family:var(--mono);font-size:10.6px;color:rgba(46,58,99,.6);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ws-n{position:absolute;right:12px;top:11px;font-size:10px;letter-spacing:.14em;color:rgba(46,58,99,.45)}
.ws-n em{font-family:"CormI",serif;font-style:italic;font-size:13px;letter-spacing:0}
.ws:hover{background-color:#FFFDF9;transform:translate(-1px,-2px) rotate(-.4deg);box-shadow:0 9px 14px -9px rgba(40,52,95,.42),0 1px 2px rgba(40,52,95,.12)}
.ws.curp{background:#E9EFF7;box-shadow:inset 0 1px 2px rgba(40,52,95,.12),inset 0 0 0 1px rgba(124,143,184,.26)}
.ws-add{margin:16px -6px 0 -6px}
/* filter menu card */
.fmenu{position:absolute;right:18px;top:0;width:168px;padding:8px 6px;z-index:5;display:none;border-radius:2px;
 background:linear-gradient(180deg,#FFFEFA,#F8F6F0);box-shadow:0 14px 22px -12px rgba(40,52,95,.42),0 1px 3px rgba(40,52,95,.16),inset 0 0 0 1px rgba(255,255,255,.9)}
.fmenu.on{display:block}
.fm-r{display:flex;align-items:center;justify-content:space-between;padding:7px 10px;font-size:12px;letter-spacing:.08em;color:#2E3A63;cursor:pointer;border-radius:2px}
.fm-r:hover{background:#EEF2F8}.fm-r .ck{opacity:0;transition:opacity .2s}.fm-r.on .ck{opacity:1}

/* ---------- composer model chip: paper luggage tag ---------- */
.field .bar{position:relative}
.mchip{position:relative;margin-left:auto;margin-right:2px;display:flex;align-items:center;gap:6px;height:25px;padding:0 11px 0 19px;cursor:pointer;user-select:none;
 color:#3E4C76;background:linear-gradient(180deg,#FDFCF8,#EFF2F7);
 clip-path:polygon(9px 0,100% 0,100% 100%,9px 100%,0 50%);
 filter:drop-shadow(0 1px 1px rgba(40,52,95,.18));transition:transform .4s cubic-bezier(.3,1.35,.45,1)}
.mchip::before{content:"";position:absolute;inset:0;clip-path:inherit;pointer-events:none;
 background:linear-gradient(180deg,rgba(124,143,184,.0),rgba(124,143,184,.0));box-shadow:inset 0 0 0 1px rgba(124,143,184,.45)}
.mchip::after{content:"";position:absolute;left:1px;top:1px;bottom:1px;width:9px;background:linear-gradient(90deg,rgba(124,143,184,.18),rgba(124,143,184,0))}
.mc-eye{position:absolute;left:9px;top:50%;width:6px;height:6px;margin-top:-3px;border-radius:50%;
 background:radial-gradient(circle at 50% 50%,#EEF1F6 0 1.2px,#9AA3B6 1.6px,#E9ECF2 2.2px,#A7AFC0 3px)}
.mc-m{font-family:"CormI",serif;font-style:italic;font-weight:600;font-size:14px;letter-spacing:.01em;line-height:1;white-space:nowrap}
.mc-d{font-style:normal;color:rgba(91,108,147,.55);font-size:12px;line-height:1}
.mc-t{display:inline-block;font-style:normal;font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:#9A7584;line-height:1;min-width:26px}
.mc-car{transition:transform .4s cubic-bezier(.3,1.35,.45,1);margin-left:1px}
.mchip:hover{transform:translateY(-1.5px) rotate(-.6deg)}
.mchip.on{transform:translateY(-2px) rotate(-1deg)}.mchip.on .mc-car{transform:rotate(180deg)}

/* ---------- popover: menu card rising from the chip ---------- */
.mpop{position:fixed;left:0;top:0;width:312px;z-index:60;pointer-events:none;visibility:hidden}
body.pop-open .mpop{pointer-events:auto;visibility:visible}.mpop.anim{visibility:visible}
.mp-mv{position:relative;transform-origin:88% 100%;will-change:transform;
 filter:drop-shadow(0 20px 22px rgba(40,52,95,.24)) drop-shadow(0 2px 3px rgba(40,52,95,.16))}
.mp-paper{position:absolute;inset:0;
 -webkit-mask:url("__DKPOP__") 0 0/100% 100% no-repeat;mask:url("__DKPOP__") 0 0/100% 100% no-repeat;
 background:radial-gradient(110% 50% at 85% 0,rgba(255,255,255,.75),rgba(255,255,255,0) 60%),
  radial-gradient(90% 40% at 10% 100%,rgba(214,222,238,.6),rgba(214,222,238,0) 70%),linear-gradient(180deg,#FDFBF6,#F6F5F0)}
.mp-paper::after{content:"";position:absolute;inset:0;opacity:.45;mix-blend-mode:multiply;
 background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.014 .028' numOctaves='3' seed='11'/%3E%3CfeColorMatrix values='0 0 0 0 .55 0 0 0 0 .6 0 0 0 0 .72 0 0 0 .09 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")}
.mp-stk{position:absolute;right:-7px;top:-10px;z-index:3;transform:rotate(14deg);filter:drop-shadow(0 1.5px 1.5px rgba(56,68,108,.25))}
.mp-in{position:relative;padding:18px 18px 12px 20px}
.mp-hd{display:flex;align-items:baseline;gap:10px;margin:0 0 8px 2px}
.mp-hd em{font-family:"Pinyon",serif;font-style:normal;font-size:23px;color:#5B6C93;line-height:1}
.mp-hd span{font-family:"CormI",serif;font-style:italic;font-size:12.5px;letter-spacing:.06em;color:rgba(46,58,99,.5)}
.mp-row{position:relative;display:flex;align-items:center;gap:8px;height:33px;margin:0 -8px;padding:0 12px 0 12px;border-radius:2px;cursor:pointer;
 transition:background-color .24s,box-shadow .28s,transform .32s cubic-bezier(.22,1,.36,1)}
.mp-row b{font-weight:500;font-size:13.2px;color:#2E3A63;letter-spacing:.02em;white-space:nowrap}
.mp-x{font-weight:400;font-size:8.6px;letter-spacing:.16em;text-transform:uppercase;color:#9A7584;white-space:nowrap;padding:2px 6px 2px 7px;margin-left:2px;
 background:linear-gradient(180deg,#F5E9EC,#EDDDE2);clip-path:polygon(4px 0,100% 0,100% 100%,4px 100%,0 50%)}
.mp-row .ck{margin-left:auto;opacity:0;transform:scale(.6) rotate(-12deg);transition:opacity .2s,transform .4s cubic-bezier(.3,1.5,.45,1)}
.mp-row:hover{background-color:#FFFEFB;transform:translate(-1px,-1px) rotate(-.35deg);box-shadow:0 8px 12px -9px rgba(40,52,95,.42),0 1px 2px rgba(40,52,95,.1)}
.mp-row.on{background:#E7EDF5;box-shadow:inset 0 1px 2px rgba(40,52,95,.14),inset 0 0 0 1px rgba(124,143,184,.28);transform:none}
.mp-row.on b{font-weight:600;color:#25305A}.mp-row.on .ck{opacity:1;transform:none}
.mp-rule{position:relative;height:6px;margin:8px -4px}.mp-rule .dw-ink{left:0;right:0;width:100%}
.mp-think{display:flex;align-items:center;justify-content:space-between;margin:2px 0 2px 2px}
.mp-tl{display:flex;align-items:baseline;gap:8px;font-size:11.5px;letter-spacing:.3em;color:rgba(46,58,99,.62)}
.mp-tl em{font-family:"Pinyon",serif;font-style:normal;font-size:19px;letter-spacing:0;color:#6F82AC;line-height:1}
.sld{position:relative;display:flex;width:156px;height:28px;padding:2px;border-radius:3px;
 background:linear-gradient(180deg,#E3E8F0,#ECEFF4);box-shadow:inset 0 1px 2px rgba(40,52,95,.18),inset 0 0 0 1px rgba(124,143,184,.22)}
.sld button{position:relative;z-index:1;flex:1;border:0;background:none;cursor:pointer;font-family:"CormI",serif;font-style:italic;font-size:13.5px;color:rgba(46,58,99,.5);transition:color .3s}
.sld button.on{color:#25305A;font-weight:600}
.sld button:hover{color:rgba(46,58,99,.8)}
.sld-th{position:absolute;left:2px;top:2px;bottom:2px;width:calc((100% - 4px)/3);border-radius:2px;
 transform:translateX(calc(var(--v,2) * 100%));transition:transform .5s cubic-bezier(.3,1.32,.45,1);
 background:linear-gradient(180deg,#FFFEFA,#F6F4EE);box-shadow:0 2px 3px -1px rgba(40,52,95,.3),0 0 0 .6px rgba(124,143,184,.45),inset 0 1px 0 #fff}
.sld-th::after{content:"";position:absolute;left:50%;bottom:3px;width:12px;height:1.5px;margin-left:-6px;border-radius:2px;background:linear-gradient(90deg,#C9CFDA,#8E9BB8,#C9CFDA)}
.mp-hint{margin:10px 2px 0;font-size:11px;line-height:1.75;font-style:italic;letter-spacing:.03em;color:rgba(62,76,116,.74)}
.mp-more{display:flex;align-items:center;gap:9px;height:32px;margin:0 -8px;padding:0 12px;border-radius:2px;cursor:pointer;transition:background-color .24s,transform .32s cubic-bezier(.22,1,.36,1)}
.mp-more b{font-weight:600;font-size:12.6px;letter-spacing:.14em;color:#3E4C76}
.mp-more em{margin-left:auto;font-family:"Pinyon",serif;font-style:normal;font-size:16px;color:#9AA8C6;transition:transform .32s cubic-bezier(.22,1,.36,1)}
.mp-more:hover{background:#FFFEFB;box-shadow:0 8px 12px -9px rgba(40,52,95,.4)}.mp-more:hover em{transform:translateX(3px)}

/* ---------- catalogue modal ---------- */
.mscrim{position:fixed;inset:0;z-index:70;pointer-events:none;opacity:0;background:rgba(48,58,92,.17)}
body.mdl-open .mscrim{pointer-events:auto;opacity:1}
.mdl{position:fixed;left:50%;top:50%;width:780px;height:660px;margin:-338px 0 0 -390px;z-index:71;pointer-events:none;visibility:hidden}
body.mdl-open .mdl{pointer-events:auto;visibility:visible}.mdl.anim{visibility:visible}
.mdl-mv{position:absolute;inset:0;will-change:transform;filter:drop-shadow(0 26px 30px rgba(40,52,95,.26)) drop-shadow(0 2px 4px rgba(40,52,95,.16))}
.mdl-paper{position:absolute;inset:0;
 -webkit-mask:url("__DKMDL__") 0 0/100% 100% no-repeat;mask:url("__DKMDL__") 0 0/100% 100% no-repeat;
 background:linear-gradient(180deg,transparent 0,transparent 86px,rgba(214,166,178,.34) 86px,rgba(214,166,178,.34) 87px,transparent 87px),
  radial-gradient(90% 45% at 85% 4%,rgba(255,255,255,.75),rgba(255,255,255,0) 60%),
  radial-gradient(70% 40% at 10% 100%,rgba(212,220,236,.5),rgba(212,220,236,0) 70%),linear-gradient(180deg,#FDFBF5,#F8F6F0 55%,#F3F3F1)}
.mdl-paper::after{content:"";position:absolute;inset:0;opacity:.5;mix-blend-mode:multiply;
 background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.011 .026' numOctaves='3' seed='4'/%3E%3CfeColorMatrix values='0 0 0 0 .55 0 0 0 0 .6 0 0 0 0 .72 0 0 0 .085 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")}
.mdl-rib{right:128px;height:84px}
.mdl-in{position:absolute;inset:0;display:flex;flex-direction:column;padding:28px 46px 0 48px}
.md-hd{display:flex;align-items:baseline;gap:14px;height:40px;padding-right:70px}
.md-hd em{font-family:"Pinyon",serif;font-style:normal;font-size:34px;color:#5B6C93;line-height:1}
.md-hd span{font-size:12px;letter-spacing:.44em;color:rgba(46,58,99,.6)}
.md-x{position:absolute;right:20px;top:20px;width:30px;height:30px;border:0;border-radius:50%;display:grid;place-items:center;cursor:pointer;
 background:radial-gradient(circle at 35% 30%,#FFFFFF,#E3E7EE 70%,#C9CFDA);box-shadow:0 1px 2px rgba(60,70,100,.25);transition:transform .4s cubic-bezier(.3,1.35,.45,1)}
.md-x:hover{transform:rotate(90deg)}
.md-q{margin:30px 0 0!important}
.md-q input{flex:1;min-width:0;border:0;outline:0;background:none;padding:0;font:inherit;font-size:13px;letter-spacing:.06em;color:#2E3A63}
.md-q input::placeholder{color:rgba(70,85,120,.42)}
.md-tabs{margin:20px -2px 0;justify-content:flex-start}
.md-tabs .ptab{flex:none;padding:0 17px;letter-spacing:.12em}
.md-list{position:relative;flex:1;min-height:0;overflow-y:auto;margin:0 -14px;padding:10px 14px 18px}
.md-list::-webkit-scrollbar{width:6px;background:transparent}.md-list::-webkit-scrollbar-track{background:transparent}.md-list::-webkit-scrollbar-button{display:none;height:0}.md-list::-webkit-scrollbar-thumb{background:linear-gradient(90deg,#9AA3B6,#F2F4F8 45%,#A9B1C2);border-radius:3px}
.md-pv{display:none;align-items:baseline;gap:10px;margin:14px 0 4px;white-space:nowrap}
.md-list.all .md-pv{display:flex}.md-list.all .md-pv:first-child{margin-top:4px}
.md-pv em{font-family:"Pinyon",serif;font-style:normal;font-size:19px;color:#6F82AC;line-height:1}
.md-pv span{font-family:"CormI",serif;font-style:italic;font-size:12px;color:rgba(46,58,99,.45)}
.md-pv::after{content:"";flex:1;align-self:center;height:1px;background:linear-gradient(90deg,rgba(124,143,184,.38),rgba(124,143,184,0))}
.md-row{position:relative;display:flex;align-items:center;gap:14px;margin:0 -12px;padding:9px 14px 10px 16px;border-radius:2px;cursor:pointer;outline:none;
 transition:background-color .24s,box-shadow .3s,transform .34s cubic-bezier(.22,1,.36,1)}
.md-row+.md-row{margin-top:2px}
.md-tx{flex:1;min-width:0}
.md-tx b{display:flex;align-items:center;gap:8px;font-weight:500;font-size:14.6px;color:#2E3A63;letter-spacing:.02em;line-height:1.45}
.md-meta{display:flex;align-items:baseline;margin-top:3px;font-size:10.6px;letter-spacing:.06em;color:rgba(70,85,125,.62);white-space:nowrap;overflow:hidden}
.md-meta .sc{font-size:9.2px;letter-spacing:.15em;text-transform:uppercase}
.md-meta .sep{flex:none;width:1px;height:8px;margin:0 8px;align-self:center;background:rgba(124,143,184,.45)}
.md-row .ck{flex:none;opacity:0;transform:scale(.6) rotate(-12deg);transition:opacity .2s,transform .42s cubic-bezier(.3,1.5,.45,1)}
.md-star{flex:none;width:30px;height:30px;border:0;padding:0;background:none;cursor:pointer;display:grid;place-items:center;border-radius:50%;opacity:0;transition:opacity .2s,background-color .2s}
.md-star .st{overflow:visible}.md-star .onn{opacity:0;transform:scale(.4);transform-origin:0 0}
.md-star[aria-pressed="true"]{opacity:1}
.md-star[aria-pressed="true"] .off{opacity:0}.md-star[aria-pressed="true"] .onn{opacity:1;transform:rotate(-12deg) scale(1.18);filter:drop-shadow(0 1.6px 1.4px rgba(56,68,108,.38))}
.md-star:hover{background:rgba(124,143,184,.12)}
.md-row:hover,.md-row.kb{background-color:#FFFEFB;transform:translate(-1px,-2px) rotate(-.3deg);box-shadow:0 10px 15px -10px rgba(40,52,95,.42),0 1px 2px rgba(40,52,95,.1),inset 0 0 0 1px rgba(255,255,255,.9)}
.md-row:hover .md-star,.md-row.kb .md-star,.md-row.on .md-star{opacity:1}
.md-row.on{background:#E7EDF5;box-shadow:inset 0 1px 2px rgba(40,52,95,.14),inset 0 0 0 1px rgba(124,143,184,.28);transform:none}
.md-row.on.kb,.md-row.on:hover{background:#E9EFF7}
.md-row.on b{font-weight:600;color:#25305A}.md-row.on .ck{opacity:1;transform:none}
.md-row.hide,.md-pv.hide{display:none!important}
.md-empty{display:none;text-align:center;margin-top:60px;font-family:"CormI",serif;font-style:italic;font-size:13px;letter-spacing:.16em;color:rgba(46,58,99,.4)}
.md-list.none .md-empty{display:block}
.md-ft{display:flex;align-items:center;gap:6px;height:52px;margin:0 -10px;padding:0 10px;border-top:1px solid rgba(124,143,184,.24);font-size:11px;letter-spacing:.14em;color:rgba(70,85,120,.55)}
.md-ft b{font-weight:400;color:#B9A27A;margin:0 8px;font-size:10px}
.kc{display:inline-grid;place-items:center;min-width:22px;height:21px;padding:0 6px;border-radius:3px;font-family:"CormI",serif;font-style:italic;font-size:12.5px;letter-spacing:.02em;color:#3E4C76;
 background:linear-gradient(180deg,#FFFEFA,#F2F1EC);box-shadow:0 1.5px 0 rgba(124,143,184,.45),0 2px 3px -1px rgba(40,52,95,.25),inset 0 0 0 .6px rgba(124,143,184,.4)}
.kl{margin-left:3px}
.md-cnt{margin-left:auto;font-family:"CormI",serif;font-style:italic;font-size:12.5px;letter-spacing:.06em;color:rgba(46,58,99,.45)}
@media (prefers-reduced-motion:reduce){.ptab,.pf-chev,.pf-env .flap,.sld-th,.mchip,.mp-row,.md-row,.ws{transition:none!important;transform:none}}
</style>
'''.replace('__DKPOP__', DK_POP).replace('__DKMDL__', DK_MDL)

# ---------- patch v13 drawer JS for the new structure ----------
JS = JS13
JS = rep1(JS, "const cs=[...drw.querySelectorAll('.dw-c')];",
          "let cs=[];const csv=()=>{cs=[...drw.querySelectorAll('.dw-c')].filter(e=>e.offsetParent!==null&&e.getBoundingClientRect().top<innerHeight+20)};")
JS = rep1(JS, "const doOpen=()=>{stop();", "const doOpen=()=>{stop();csv();")
JS = rep1(JS, "const doClose=()=>{stop();", "const doClose=()=>{stop();csv();")
JS = rep1(JS, "window.__v13scroll=v=>setScroll(v);", "window.__v13scroll=v=>setScroll(v);window.__v13set=setScroll;window.__v13ty=()=>ty;")

JS2 = r'''<script>
(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)');
const b=document.body,$=(q,r=document)=>r.querySelector(q),$$=(q,r=document)=>[...r.querySelectorAll(q)];
const EO='cubic-bezier(.22,1,.36,1)',SPR='cubic-bezier(.3,1.32,.45,1)';
const spring=(z,w,t)=>{if(z>=1)return (1+w*t)*Math.exp(-w*t);const wd=w*Math.sqrt(1-z*z);return Math.exp(-z*w*t)*(Math.cos(wd*t)+(z*w/wd)*Math.sin(wd*t))};
const FEU=__FEU__;
/* ---------- drawer: tabs ---------- */
const drw=$('#drw'),tabs=$$('#dwTabs .ptab'),panes=$$('.dw-pane'),cnt=$('#dwCount');
let tabI=0,tabT=0;
const track=ms=>{const t0=performance.now();const f=n=>{window.__v13set(window.__v13ty(),true);if(n-t0<ms)requestAnimationFrame(f)};requestAnimationFrame(f)};
const setTab=i=>{if(i===tabI)return;const old=panes[tabI],nw=panes[i],dir=i>tabI?1:-1;tabI=i;
  tabs.forEach((t,k)=>{t.classList.toggle('on',k===i);t.setAttribute('aria-selected',k===i)});cnt.textContent=FEU[i];closeF();
  if(RM.matches){old.classList.remove('on');nw.classList.add('on');window.__v13set(0,true);return}
  old.getAnimations().forEach(a=>a.cancel());
  const fo=old.animate([{opacity:1,transform:'none'},{opacity:0,transform:`translate(${-12*dir}px,2px) rotate(${-.6*dir}deg)`}],{duration:150,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});
  clearTimeout(tabT);tabT=setTimeout(()=>{fo.cancel();
    panes.forEach(p=>p.classList.remove('on'));nw.classList.add('on');window.__v13set(0,true);
    const its=[...nw.querySelectorAll('.dw-c')].filter(e=>e.offsetParent!==null).slice(0,16);
    its.forEach((e,k)=>e.animate([{opacity:0,transform:`translate(${14*dir}px,3px) rotate(${.8*dir}deg)`},{opacity:1,transform:'none'}],{duration:340,delay:k*26,easing:EO,fill:'backwards'}))},150)};
tabs.forEach((t,k)=>t.addEventListener('click',()=>setTab(k)));
/* ---------- drawer: project folders ---------- */
const fold=(pf,col)=>{if(col===pf.classList.contains('col'))return;const body=pf.querySelector('.pf-b'),h=pf.querySelector('.pf-h');
  h.setAttribute('aria-expanded',!col);body.getAnimations().forEach(a=>a.cancel());
  if(RM.matches){pf.classList.toggle('col',col);window.__v13set(window.__v13ty(),true);syncFold();return}
  const its=[...body.querySelectorAll('.dw-ses')];
  if(col){const H=body.offsetHeight;pf.classList.add('col');body.style.display='block';
    const ha=body.animate([{height:H+'px'},{height:'0px'}],{duration:330,easing:'cubic-bezier(.5,0,.2,1)',fill:'forwards'});
    const ia=its.map((e,k)=>e.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-6px) scaleY(.92)'}],{duration:220,delay:(its.length-1-k)*25,easing:'ease-in',fill:'forwards'}));
    clearTimeout(pf.__t);pf.__t=setTimeout(()=>{if(!pf.classList.contains('col'))return;body.style.display='';ha.cancel();ia.forEach(a=>a.cancel())},350);
    track(380)}
  else{clearTimeout(pf.__t);body.style.display='';pf.classList.remove('col');const H=body.offsetHeight;
    body.animate([{height:'0px'},{height:H+'px'}],{duration:420,easing:EO});
    its.forEach((e,k)=>e.animate([{opacity:0,transform:'translateY(-8px) rotate(-.6deg)'},{opacity:1,transform:'none'}],{duration:360,delay:60+k*45,easing:EO,fill:'backwards'}));
    track(480)}
  syncFold()};
const fbtn=$('#dwFold');
const syncFold=()=>{const pfs=$$('.dw-pane.on .pf');fbtn.classList.toggle('all-col',pfs.length&&pfs.every(p=>p.classList.contains('col')))};
$$('.pf-h').forEach(h=>h.addEventListener('click',()=>{const pf=h.parentNode;fold(pf,!pf.classList.contains('col'))}));
fbtn.addEventListener('click',()=>{const pfs=$$('.dw-pane.on .pf'),allc=pfs.every(p=>p.classList.contains('col'));
  pfs.forEach((p,k)=>setTimeout(()=>fold(p,!allc),RM.matches?0:k*60))});
const fm=$('#fMenu'),fb=$('#dwFilt');
const closeF=()=>{fm.classList.remove('on');fb.classList.remove('on')};
fb.addEventListener('click',e=>{e.stopPropagation();const on=!fm.classList.contains('on');if(!on)return closeF();
  const r=fb.getBoundingClientRect(),dr=$('.drw-in').getBoundingClientRect();fm.style.top=(r.bottom-dr.top+6)+'px';fm.classList.add('on');fb.classList.add('on');
  if(!RM.matches)fm.animate([{opacity:0,transform:'translateY(-6px) rotate(-1deg)'},{opacity:1,transform:'none'}],{duration:280,easing:EO})});
$$('.fm-r').forEach(r=>r.addEventListener('click',e=>{e.stopPropagation();r.classList.toggle('on')}));
drw.addEventListener('click',e=>{if(!fm.contains(e.target))closeF()});
syncFold();
/* ---------- model chip + popover ---------- */
const chip=$('#mchip'),pop=$('#mpop'),pmv=$('#mpMv'),mcM=$('#mcM'),mcT=$('#mcT'),sld=$('#mpSld'),LV=['Low','High','Max'];
let popOpen=false,pAn=[];
const place=()=>{const r=chip.getBoundingClientRect(),W=pop.offsetWidth,H=pmv.offsetHeight;
  const f=chip.closest('.field').getBoundingClientRect();
  pop.style.left=Math.round(r.right-W-58)+'px';pop.style.top=Math.round(Math.min(r.top,f.top)-H-8)+'px'};
const pstop=()=>{pAn.forEach(a=>a.cancel());pAn=[]};
const popFrames=()=>{const f=[],N=24,D=.5;for(let i=0;i<=N;i++){const t=i/N*D,u=i/N;const y=spring(.62,15,t),r=spring(.45,16,t);
  f.push({offset:u,opacity:Math.min(1,u*4),transform:`translateY(${(22*y).toFixed(2)}px) rotate(${(2.2*r).toFixed(3)}deg) scale(${(1-.06*y).toFixed(4)})`})}
  f[N].transform='none';return f};
const setPop=(v,fast)=>{if(v===popOpen)return;popOpen=v;pstop();chip.classList.toggle('on',v);chip.setAttribute('aria-expanded',v);pop.setAttribute('aria-hidden',!v);
  if(v){b.classList.add('pop-open');place();if(RM.matches)return;pop.classList.add('anim');
    pAn.push(pmv.animate(popFrames(),{duration:520,easing:'linear'}));
    $$('.mp-c',pop).forEach((e,k)=>pAn.push(e.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:300,delay:90+k*24,easing:EO,fill:'backwards'})))}
  else{b.classList.remove('pop-open');if(RM.matches)return;pop.classList.add('anim');
    const a=pmv.animate([{opacity:1,transform:'none'},{opacity:0,transform:`translateY(${fast?-6:14}px) rotate(${fast?0:1.4}deg) scale(${fast?1.01:.95})`}],{duration:fast?160:200,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});
    pAn.push(a);setTimeout(()=>{if(!popOpen){pop.classList.remove('anim');a.cancel()}},(fast?160:200)+20)}};
window.__s2pop=v=>setPop(v===undefined?!popOpen:v);
chip.addEventListener('click',e=>{e.stopPropagation();setPop(!popOpen)});
chip.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setPop(!popOpen)}});
pop.addEventListener('pointerdown',e=>e.stopPropagation());
document.addEventListener('pointerdown',()=>{if(popOpen)setPop(false)});
const swapTxt=(el,txt)=>{if(el.textContent===txt)return;el.textContent=txt;if(!RM.matches)el.animate([{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'none'}],{duration:320,easing:EO})};
const setModel=m=>{$$('.mp-row').forEach(r=>{const on=r.dataset.m===m;r.classList.toggle('on',on);r.setAttribute('aria-checked',on)});
  $$('.md-row').forEach(r=>{const on=r.dataset.m===m;r.classList.toggle('on',on);r.setAttribute('aria-selected',on)});swapTxt(mcM,m)};
$$('.mp-row').forEach(r=>r.addEventListener('click',()=>{setModel(r.dataset.m)}));
const setThink=v=>{sld.style.setProperty('--v',v);sld.dataset.v=v;$$('button',sld).forEach((x,k)=>{x.classList.toggle('on',k===v);x.setAttribute('aria-checked',k===v)});swapTxt(mcT,LV[v])};
$$('button',sld).forEach((x,k)=>x.addEventListener('click',()=>setThink(k)));
/* ---------- catalogue modal ---------- */
const mdl=$('#mdl'),mmv=$('#mdlMv'),msc=$('#mscrim'),list=$('#mdList'),inp=$('#mdIn'),mtabs=$$('#mdTabs .ptab'),mcnt=$('#mdCnt');
const RN=['','i','ii','iii','iv','v','vi','vii','viii','ix','x','xi','xii'];
let mdlOpen=false,mAn=[],prov='kimi',kb=-1;
const vis=()=>$$('.md-row',list).filter(r=>!r.classList.contains('hide'));
const applyF=(anim)=>{const q=inp.value.trim().toLowerCase();list.classList.toggle('all',prov==='all');
  $$('.md-row',list).forEach(r=>{const ok=(prov==='all'||r.dataset.p===prov)&&(!q||r.textContent.toLowerCase().includes(q));r.classList.toggle('hide',!ok)});
  $$('.md-pv',list).forEach(p=>p.classList.toggle('hide',!$$(`.md-row[data-p="${p.dataset.p}"]`,list).some(r=>!r.classList.contains('hide'))));
  const v=vis();list.classList.toggle('none',!v.length);mcnt.textContent=(RN[v.length]||v.length)+' modèle'+(v.length>1?'s':'');kbSet(-1);
  if(anim&&!RM.matches){list.scrollTop=0;[...list.children].filter(e=>e.offsetParent!==null).slice(0,9).forEach((e,k)=>e.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:320,delay:k*28,easing:EO,fill:'backwards'}))}};
const kbSet=i=>{const v=vis();$$('.md-row.kb',list).forEach(r=>r.classList.remove('kb'));kb=i;if(i>=0&&v[i]){v[i].classList.add('kb');v[i].scrollIntoView({block:'nearest'})}};
mtabs.forEach(t=>t.addEventListener('click',()=>{if(prov===t.dataset.t)return;prov=t.dataset.t;mtabs.forEach(x=>x.classList.toggle('on',x===t));applyF(true)}));
inp.addEventListener('input',()=>applyF(false));
const setMdl=v=>{if(v===mdlOpen)return;mdlOpen=v;mAn.forEach(a=>a.cancel());mAn=[];mdl.setAttribute('aria-hidden',!v);
  if(v){b.classList.add('mdl-open');applyF(false);if(RM.matches){inp.focus({preventScroll:true});return}mdl.classList.add('anim');
    const f=[],N=26,D=.55;for(let i=0;i<=N;i++){const t=i/N*D,u=i/N,y=spring(.7,13,t),r=spring(.5,14,t);
      f.push({offset:u,opacity:Math.min(1,u*3.5),transform:`translateY(${(26*y).toFixed(2)}px) rotate(${(-1.1*r).toFixed(3)}deg) scale(${(1-.035*y).toFixed(4)})`})}f[N].transform='none';
    mAn.push(msc.animate([{opacity:0},{opacity:1}],{duration:260,easing:'ease-out'}));
    mAn.push(mmv.animate(f,{duration:560,easing:'linear'}));
    $$('.md-c',mdl).concat(vis().slice(0,7)).forEach((e,k)=>mAn.push(e.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:340,delay:110+k*30,easing:EO,fill:'backwards'})));
    inp.focus({preventScroll:true})}
  else{b.classList.remove('mdl-open');inp.blur();if(RM.matches)return;mdl.classList.add('anim');
    const a=mmv.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(16px) rotate(.6deg) scale(.975)'}],{duration:230,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});
    mAn.push(a,msc.animate([{opacity:1},{opacity:0}],{duration:260,easing:'ease-in',fill:'forwards'}));setTimeout(()=>{if(!mdlOpen){mdl.classList.remove('anim');mAn.forEach(x=>x.cancel());mAn=[]}},280)}};
window.__s2modal=v=>setMdl(v===undefined?!mdlOpen:v);
$('#mpMore').addEventListener('click',()=>{setPop(false,true);setMdl(true)});
$('#mdX').addEventListener('click',()=>setMdl(false));msc.addEventListener('click',()=>setMdl(false));
$$('.md-row',list).forEach(r=>r.addEventListener('click',e=>{if(e.target.closest('.md-star'))return;setModel(r.dataset.m);setTimeout(()=>setMdl(false),RM.matches?0:260)}));
$$('.md-star',list).forEach(s=>s.addEventListener('click',e=>{e.stopPropagation();const on=s.getAttribute('aria-pressed')!=='true';s.setAttribute('aria-pressed',on);
  if(on&&!RM.matches){const g=s.querySelector('.onn');g.animate([{transform:'scale(.3) rotate(-40deg)',opacity:0},{transform:'scale(1.42) rotate(-6deg)',opacity:1,offset:.55},{transform:'scale(1.1) rotate(-14deg)',offset:.8},{transform:'rotate(-12deg) scale(1.18)',opacity:1}],{duration:520,easing:'cubic-bezier(.3,.8,.4,1)'})}}));
/* keyboard: Esc closes the topmost layer first; ↑↓ Enter in the catalogue; / focuses search */
addEventListener('keydown',e=>{
  if(mdlOpen){if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();setMdl(false);return}
    const v=vis();if(e.key==='ArrowDown'){e.preventDefault();kbSet(Math.min(v.length-1,kb+1))}else if(e.key==='ArrowUp'){e.preventDefault();kbSet(Math.max(0,kb-1))}
    else if(e.key==='Enter'&&kb>=0&&v[kb]){e.preventDefault();v[kb].click()}e.stopImmediatePropagation();return}
  if(popOpen&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();setPop(false);chip.focus({preventScroll:true})}},true);
if(location.hash.includes('pop'))setTimeout(()=>setPop(true),50);
if(location.hash.includes('cat'))setTimeout(()=>setMdl(true),50);
})();
</script>'''.replace('__FEU__', '[' + ','.join(f'"{x}"' for x in FEUILLETS) + ']')

# ---------- assemble (same insertion steps as build_v13) ----------
nav0 = s.index('<nav class="rail">'); nav1 = s.index('</nav>', nav0)
nav = s[nav0:nav1]
m = re.search(r'(<div class="it" style="--i:1">)(<img src="data:image/png;base64,[A-Za-z0-9+/=]+" alt="">)', nav)
assert m
nav = nav[:m.start()] + m.group(1) + '<b class="hgw">' + m.group(2) + '</b>' + SAND + nav[m.end():]
s = s[:nav0] + nav + s[nav1:]
sub1("else{if(x>rail.getBoundingClientRect().right+36){",
     "else{if(x>(b.classList.contains('drw-open')?document.getElementById('drw').getBoundingClientRect().right:rail.getBoundingClientRect().right)+36){")
sub1("document.addEventListener('pointerleave',()=>{clearTimeout(tOpen);tOpen=0;if(open&&!tClose)",
     "document.addEventListener('pointerleave',()=>{clearTimeout(tOpen);tOpen=0;if(open&&!tClose&&!b.classList.contains('drw-open'))")
sub1('<title>Kimi Code · 蓝雾厅 v8</title>', '<title>Kimi Code · 蓝雾厅 · 会话 v2</title>')
# model chip at the end of the composer bar, next to the pen and the clock
sub1('<div class="pill rb blue">@ 文件</div></div>', '<div class="pill rb blue">@ 文件</div>' + CHIP + '</div>')
sub1('</head>', CSS13 + CSS2 + '</head>')
idx = s.rfind('</body>')
s = s[:idx] + DEFS + DRAWER + POP + MODAL + JS + JS2 + s[idx:]
open(OUT, 'w', encoding='utf-8').write(s)
print('wrote', OUT, len(s), 'active', nact, 'done', ndone)
