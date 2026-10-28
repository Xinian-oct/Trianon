#!/usr/bin/env python3
"""Build approval_v2.html (manual-permission state: approval slip + question card) from v8.html. v8/v12/v13 are read only.
v2 (from approval_v1): only the question ending changes. On select the chosen index card lifts, an ink tick is pen-drawn onto it
(stroke-dashoffset, ink bleed settles), a blush flower sticker presses into its corner and a "Choisi · 已选择" paper tag is written; the
other cards dim and fan back; the confirmed state holds ~1.1s, then the cards gather under the chosen one, the stack folds into the
one-line record carrying the same ink tick, and Kimi acknowledges in-stream. The slip also holds ~0.5s (seal at rest) before folding.
Plan header reads "iii of iv".
Mid-turn, Kimi pauses: a paper permission slip with a silver wax-like seal arrives inline; on 允许 the seal presses an
ink stamp onto the slip, the slip folds into a one-line record, a tool row runs, the blossom streams a line, then a
question card (paper index-card options) arrives and is answered.
Deterministic: every visual is a function of timeline seconds -> window.__apframe(t). Hooks:
  window.__apCapture=true (before load) disables the page's own loop; #cmd shows the command variant of the slip;
  #pend / #q freeze on the pending slip / question card for stills."""
import re, math, random

SRC = './v8.html'
OUT = './approval_v2.html'
s = open(SRC, encoding='utf-8').read()

def sub1(old, new):
    global s
    assert s.count(old) == 1, (old[:90], s.count(old))
    s = s.replace(old, new)

# ---------- silver seal: wax-like irregular rim (low-frequency wobble, no repeats) ----------
rnd = random.Random(1426)
ph1, ph2 = rnd.uniform(0, 6.28), rnd.uniform(0, 6.28)
pts = []
for k in range(72):
    a = k / 72 * 2 * math.pi
    r = 26.2 + 1.25 * math.sin(5 * a + ph1) + .7 * math.sin(9 * a + ph2) + rnd.uniform(-.25, .25)
    pts.append((r * math.cos(a), r * math.sin(a)))
RIM = 'M' + ' L'.join(f'{x:.2f},{y:.2f}' for x, y in pts) + 'Z'
SEAL = f'''<svg width="64" height="64" viewBox="-32 -32 64 64" aria-hidden="true">
 <path d="{RIM}" fill="rgba(52,62,92,.28)" transform="translate(.9 1.6)"/>
 <path d="{RIM}" fill="url(#apSv)" stroke="rgba(96,108,140,.55)" stroke-width=".5"/>
 <circle r="20.6" fill="url(#apSv2)" stroke="rgba(88,100,134,.42)" stroke-width=".7"/>
 <circle r="14.2" fill="none" stroke="rgba(88,100,134,.38)" stroke-width=".55"/>
 <path id="apRing" d="M0,-17.4 A17.4,17.4 0 1 1 -.01,-17.4" fill="none"/>
 <text font-size="4.6" letter-spacing="1.05" fill="rgba(62,74,108,.78)" font-family="CormI,serif" font-style="italic"><textPath href="#apRing">PERMISSION · 许 可 · PERMISSION · 许 可 ·</textPath></text>
 <text y="5.2" text-anchor="middle" font-size="15" fill="rgba(70,84,120,.72)" font-family="Pinyon,serif">K</text>
 <path d="M-18,-12 C-12,-21 2,-24 12,-19" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>
</svg>'''

# ---------- ink stamp impression (rough ink edge via low displacement) ----------
def ink(word, cn, mark, cls):
    m = ('<path d="M100,36.5 c1.6,1 3,2.6 4,4.6 .3.5.6.5.8 0 2.2-4.8 5.4-8.8 9.6-11.6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'
         if mark == 'ok' else '<path d="M101,30.5 l9,9 M110,30.5 l-9,9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>')
    return f'''<svg class="{cls}" width="176" height="62" viewBox="0 0 176 62" aria-hidden="true">
 <g filter="url(#apRough)" opacity=".9">
  <rect x="3" y="4" width="170" height="54" rx="7" fill="none" stroke="currentColor" stroke-width="2.1"/>
  <rect x="7.5" y="8.5" width="161" height="45" rx="4.5" fill="none" stroke="currentColor" stroke-width=".9"/>
  <text x="17" y="39" font-family="Pinyon,serif" font-size="22" fill="currentColor">{word}</text>
  {m}
  <text x="120" y="40" font-family="Noto Serif CJK SC,serif" font-weight="700" font-size="13.5" letter-spacing="2" fill="currentColor">{cn}</text>
 </g></svg>'''

DEFS = '''<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
 <linearGradient id="apSv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6F7FA"/><stop offset=".3" stop-color="#C3C9D6"/>
  <stop offset=".52" stop-color="#EEF1F6"/><stop offset=".78" stop-color="#97A0B3"/><stop offset="1" stop-color="#D5DAE3"/></linearGradient>
 <radialGradient id="apSv2" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#F7F8FB"/><stop offset=".6" stop-color="#D3D8E2"/><stop offset="1" stop-color="#AEB6C6"/></radialGradient>
 <filter id="apRough" x="-5%" y="-10%" width="110%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="4"/>
  <feDisplacementMap in="SourceGraphic" scale="1.7"/></filter>
 <linearGradient id="apPg" x1="0" y1="-1" x2="0" y2="-11" gradientUnits="userSpaceOnUse">
  <stop offset="0" stop-color="#E6C9CF"/><stop offset=".45" stop-color="#F2E1E1"/><stop offset="1" stop-color="#FCF8F2"/></linearGradient>
 <radialGradient id="apCg" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#F4F7FB"/><stop offset=".55" stop-color="#A9B8D3"/><stop offset="1" stop-color="#7386AD"/></radialGradient>
 <radialGradient id="apHg"><stop offset="0" stop-color="#FFF4F2" stop-opacity=".9"/><stop offset=".5" stop-color="#F3DCE0" stop-opacity=".35"/><stop offset="1" stop-color="#F3DCE0" stop-opacity="0"/></radialGradient>
 <filter id="apInkBl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.1"/></filter>
 <filter id="apTickR" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".18" numOctaves="2" seed="9"/>
  <feDisplacementMap in="SourceGraphic" scale=".9"/></filter>
 <linearGradient id="apInkL" x1="0" x2="1"><stop offset="0" stop-color="#5B6C93" stop-opacity="0"/><stop offset=".08" stop-color="#5B6C93" stop-opacity=".55"/>
  <stop offset=".85" stop-color="#5B6C93" stop-opacity=".45"/><stop offset="1" stop-color="#5B6C93" stop-opacity="0"/></linearGradient>
</defs></svg>'''

PETAL = 'M0,-1.4 C-3.7,-3.1 -5.5,-7.3 -3.3,-10.1 C-2.1,-11.5 -0.8,-11.1 0,-9.9 C0.8,-11.1 2.1,-11.5 3.3,-10.1 C5.5,-7.3 3.7,-3.1 0,-1.4Z'
petals = ''.join(f'<g transform="rotate({k*72})"><g class="po"><path d="{PETAL}" fill="url(#apPg)" stroke="rgba(166,122,138,.5)" stroke-width=".42"/>'
                 f'<path d="M0,-2.6 L0,-6.6" stroke="rgba(186,146,158,.32)" stroke-width=".38" stroke-linecap="round"/></g></g>' for k in range(5))
FLOWER = f'''<div class="ap-flw" id="apFlw" aria-hidden="true">
 <svg class="halo" width="44" height="44" viewBox="-22 -22 44 44"><circle r="21" fill="url(#apHg)"/></svg>
 <svg class="bl" width="22" height="22" viewBox="-12 -12 24 24"><g id="apFlRot">{petals}
  <circle r="2.35" fill="url(#apCg)" stroke="rgba(92,108,148,.35)" stroke-width=".35"/><circle cx="-.7" cy="-.8" r=".65" fill="#fff" opacity=".75"/></g></svg></div>'''

LINE = '<svg class="q-ink" viewBox="0 0 260 6" preserveAspectRatio="none" aria-hidden="true"><path d="M1,3.6 C40,2.2 70,4.4 112,3.1 C150,2 190,4.2 259,2.8" fill="none" stroke="url(#apInkL)" stroke-width="1.1" stroke-linecap="round"/></svg>'
ULINE = '<svg class="u-ink" viewBox="0 0 60 4" preserveAspectRatio="none" aria-hidden="true"><path d="M1,2.4 C14,1.4 30,3 59,1.8" fill="none" stroke="rgba(91,108,147,.45)" stroke-width="1" stroke-linecap="round"/></svg>'
CHECK = '<svg width="15" height="15" viewBox="0 0 20 20"><path d="M3.2 10.4c1.4.9 2.6 2.4 3.6 4.3.3.5.7.5.9 0 2-4.6 5.1-8.6 9.4-11.3" fill="none" stroke="#B9A06A" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'

CK = '<svg width="11" height="11" viewBox="0 0 20 20"><path d="M4 10.6c1.3.8 2.4 2.1 3.3 3.8.3.5.6.5.8 0 1.9-4.2 4.6-7.6 8.2-10" fill="none" stroke="#FBF8F1" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
XX = '<svg width="9" height="9" viewBox="0 0 20 20"><path d="M5 5l10 10M15 5L5 15" stroke="#FBF8F1" stroke-width="2.6" stroke-linecap="round"/></svg>'

DIFF = '''<div class="sl-diff"><div class="hk">@@ -61,4 +61,6 @@ <i>finish(msg)</i></div>
<div class="ln"><b> </b>  const done = this.store.byId(msg.id)</div>
<div class="ln del"><b>−</b>  this.store.push(msg)</div>
<div class="ln add"><b>+</b>  if (done) return done.merge(msg)</div>
<div class="ln add"><b>+</b>  this.store.push(msg)</div>
<div class="ln add"><b>+</b>  this.seen.add(msg.id)</div></div>'''
CMD = '''<div class="sl-cmd"><i>$</i> npm run build<span>cwd · ~/trianon</span></div>'''

SLIP = f'''<div class="slip" id="slip" role="alertdialog" aria-labelledby="slTt" aria-describedby="slWhy">
 <i class="sl-hair" id="slHair" aria-hidden="true"></i>
 <div class="sl-paper" id="slPaper">
  <div class="sl-full" id="slFull">
   <div class="sl-eb"><em>Permission</em><span>需 要 你 的 许 可</span></div>
   <h3 class="sl-tt" id="slTt"><em>Kimi</em><span class="v-file">想修改一个文件</span><span class="v-cmd">想执行一条命令</span></h3>
   <div class="sl-file v-file"><span class="tg">edit_file</span><span class="p"><em>src/renderer/engine/</em>adapter.ts</span><span class="n a">+3</span><span class="n d">−1</span></div>
   <div class="sl-file v-cmd"><span class="tg">run_shell</span><span class="p"><em>trianon /</em>package.json · build</span></div>
   <div class="v-file">{DIFF}</div><div class="v-cmd">{CMD}</div>
   <p class="sl-why" id="slWhy"><em>Raison</em><span class="v-file">流式结束时按 message id 去重，已完成的消息不再整条重复插入。</span><span class="v-cmd">改完 adapter 后做一次完整构建，确认没有类型错误。</span></p>
   <div class="sl-act">
    <button class="sl-ok" id="slOk" type="button"><b>允许</b><kbd>Enter</kbd></button>
    <button class="sl-all" id="slAll" type="button">本会话都允许</button>
    <button class="sl-no" id="slNo" type="button"><span>拒绝{ULINE}</span><kbd>Esc</kbd></button>
   </div>
   {ink('Accordé', '已允许', 'ok', 'sl-stamp ok')}{ink('Refusé', '已拒绝', 'no', 'sl-stamp no')}
  </div>
  <div class="rec" id="slRec" aria-live="polite"><i class="rk"><svg width="11" height="11" viewBox="0 0 20 20"><path d="M4 10.6c1.3.8 2.4 2.1 3.3 3.8.3.5.6.5.8 0 1.9-4.2 4.6-7.6 8.2-10" fill="none" stroke="#FBF8F1" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></i><b class="rw">已允许</b><span class="rt"> · 编辑 <code>adapter.ts</code></span><span class="n a">+3</span><span class="n d">−1</span><em class="rr">Accordé · 16:42</em></div>
 </div>
 <div class="seal" id="seal">{SEAL}</div>
</div>'''

stkpet = ''.join(f'<g transform="rotate({k*72})"><path d="{PETAL}" fill="url(#apPg)" stroke="rgba(166,122,138,.55)" stroke-width=".45"/></g>' for k in range(5))
TAGSTK = '''<i class="q-tag" aria-hidden="true"><em>Choisi</em>· 已选择</i><i class="q-stk" aria-hidden="true"><svg width="22" height="22" viewBox="-12 -12 24 24">{FPET}<circle r="2.2" fill="url(#apCg)" stroke="rgba(92,108,148,.35)" stroke-width=".35"/></svg></i>'''
TICK = '''<svg class="q-tick" id="qTick" width="36" height="32" viewBox="0 0 36 32" aria-hidden="true">
 <path class="bleed" d="M4.2,17.6 C7.6,19.1 10.7,22.5 12.9,26.9 C13.5,28.1 14.4,28.1 15,26.9 C19.6,17.5 25.3,9.7 32.4,4.3" fill="none" stroke="#6F82AA" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round" filter="url(#apInkBl)"/>
 <path class="pen" d="M4.2,17.6 C7.6,19.1 10.7,22.5 12.9,26.9 C13.5,28.1 14.4,28.1 15,26.9 C19.6,17.5 25.3,9.7 32.4,4.3" fill="none" stroke="#56698F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#apTickR)"/>
</svg>'''
OPTS = [('A', '定时批处理', '每 50ms 刷新一次'),
        ('B', '按帧批处理', '每帧合并，只提交一次'),
        ('C', '按句批处理', '遇到标点或换行再提交')]
opts_html = ''.join(f'''<div class="q-opt" data-i="{k}" role="radio" aria-checked="false" tabindex="-1"><i class="q-tab">{L}</i>
 <div class="q-top"><i class="q-rad"></i><b>{t}</b></div><span>{d}</span>{'<em class="q-rec">conseillé</em>' if k == 1 else ''}{TAGSTK.replace('{FPET}', stkpet)}</div>''' for k, (L, t, d) in enumerate(OPTS))
QCARD = f'''<div class="qcard" id="qc" role="radiogroup" aria-labelledby="qTt">
 <i class="sl-hair" id="qHair" aria-hidden="true"></i>
 <div class="sl-paper q-paper" id="qPaper">
  <div class="sl-full" id="qFull">
   <div class="sl-eb"><em>Une question</em><span>KIMI 想 问 你</span></div>
   <h3 class="sl-tt q-tt" id="qTt">流式渲染用哪种批处理？</h3>
   <div class="q-opts">{opts_html}</div>
   <div class="q-foot"><label class="q-other"><em>Autre</em><input id="qIn" type="text" placeholder="其他⋯" autocomplete="off">{LINE}</label>
    <span class="q-keys"><em>1 · 2 · 3</em> 选择</span><button class="sl-no q-skip" id="qSkip" type="button"><span>跳过{ULINE}</span><kbd>Esc</kbd></button></div>
  </div>
  <div class="rec q-recl inkrk" id="qRec" aria-live="polite"><i class="rk"><svg width="11" height="11" viewBox="0 0 20 20"><path d="M4 10.6c1.3.8 2.4 2.1 3.3 3.8.3.5.6.5.8 0 1.9-4.2 4.6-7.6 8.2-10" fill="none" stroke="#FBF8F1" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></i><b class="rw">已回答</b><span class="rt"> · <span id="qAns">按帧批处理</span></span><em class="rr">Réponse · 16:43</em></div>
 </div>
 {TICK}
</div>'''

DENIED = '''<div class="rec deny static" aria-label="已拒绝的操作"><i class="rk"><svg width="9" height="9" viewBox="0 0 20 20"><path d="M5 5l10 10M15 5L5 15" stroke="#FBF8F1" stroke-width="2.6" stroke-linecap="round"/></svg></i><b class="rw">已拒绝</b><span class="rt"> · 执行 <code>rm -rf node_modules/.vite</code></span><em class="rr">Refusé · 16:31</em></div>'''

TOOL = '''<div class="tool ap-tool" id="apTool"><div class="th"><span class="dot"></span><span class="nm">edit_file</span><span class="ar">src/renderer/engine/adapter.ts</span>
 <span class="d" id="apToolD">进行中</span></div></div>'''

NEWCOL = f'''<div class="row in ap-row" id="apRow"><div class="col">
  <div class="b tl" id="apB1">好。先在 adapter 里按 message id 去重，改完我再跑一次构建。</div>
  {SLIP}
  {TOOL}
  <div class="b" id="apB2">已写入，三处改动都在 finish() 里。动测试之前，有个取舍想听你的：</div>
  {QCARD}
  <div class="b" id="apB3">好，按帧批处理。我先写帧缓冲，再补流式测试。</div>
</div></div>'''

STOP = '''<i class="ap-stop" id="apStop" aria-hidden="true"><svg width="40" height="40" viewBox="-20 -20 40 40">
 <circle r="14.6" fill="none" stroke="rgba(143,161,196,.28)" stroke-width=".9"/>
 <circle id="apStArc" r="14.6" fill="none" stroke="#7F93BC" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="20 72"/>
 <circle r="10.2" fill="rgba(249,250,253,.94)" stroke="rgba(91,108,147,.42)" stroke-width=".6"/>
 <rect x="-3.3" y="-3.3" width="6.6" height="6.6" rx="1.5" fill="#5B6C93"/></svg></i>
<i class="ap-wait" id="apWait" aria-hidden="true"><svg width="40" height="40" viewBox="-20 -20 40 40">
 <circle id="apWRing" r="15" fill="none" stroke="rgba(127,147,188,.55)" stroke-width="1"/>
 <circle r="10.6" fill="rgba(251,249,244,.96)" stroke="rgba(91,108,147,.42)" stroke-width=".6"/>
 <g id="apHg"><path d="M-3.6,-6.2 L3.6,-6.2 M-3.6,6.2 L3.6,6.2" stroke="#5B6C93" stroke-width="1" stroke-linecap="round"/>
  <path d="M-3,-6 C-3,-2.2 -.6,-1.4 -.6,0 C-.6,1.4 -3,2.2 -3,6 L3,6 C3,2.2 .6,1.4 .6,0 C.6,-1.4 3,-2.2 3,-6 Z" fill="none" stroke="#5B6C93" stroke-width=".8" stroke-linejoin="round"/>
  <clipPath id="apHgT"><rect id="apSandT" x="-3" y="-6" width="6" height="6"/></clipPath><clipPath id="apHgB"><rect id="apSandB" x="-3" y="3" width="6" height="3"/></clipPath>
  <path d="M-2.4,-5.4 C-2.4,-2.4 -.5,-1.4 -.5,0 L.5,0 C.5,-1.4 2.4,-2.4 2.4,-5.4 Z" fill="#CDBB8E" clip-path="url(#apHgT)"/>
  <path d="M-2.4,5.4 C-2.4,2.6 -.5,1.4 -.5,0 L.5,0 C.5,1.4 2.4,2.6 2.4,5.4 Z" fill="#CDBB8E" clip-path="url(#apHgB)"/></g>
</svg></i>'''

CSS = r'''
<style id="approvalV2">
/* ===== approval v2: permission slip + question card (纸质许可单) ===== */
:root{--ivory:#FBF8F1;--mid:#2E3A63;--slate:#5B6C93;--inkb:#55688F;--blush-ink:#9A7584}
/* earlier edit has finished by now */
.thread{will-change:transform}
.ap-row .col{width:640px}
.ap-row .b{margin-top:0}
.ap-row .col>*+*{margin-top:12px}
.ch{opacity:0}.ch.on{opacity:var(--fo,1)}
/* ---------- paper ---------- */
.slip,.qcard{position:relative;width:612px;margin-left:2px}
.sl-hair{position:absolute;inset:-7px;border-radius:9px;pointer-events:none;border:1px solid rgba(143,161,196,.9);opacity:0}
.sl-paper{position:relative;overflow:hidden;border-radius:4px;
 background:
  linear-gradient(90deg,transparent 25px,rgba(214,166,178,.38) 25px,rgba(214,166,178,.38) 26px,transparent 26px),
  radial-gradient(120% 70% at 85% 0,rgba(255,255,255,.75),rgba(255,255,255,0) 60%),
  radial-gradient(90% 60% at 10% 100%,rgba(214,222,236,.45),rgba(214,222,236,0) 70%),
  linear-gradient(180deg,#FCFAF5 0,#F8F5EE 60%,#F3F2EE 100%);
 border:1px solid rgba(135,150,180,.5);
 box-shadow:0 16px 26px -18px rgba(40,52,95,.42),0 2px 4px rgba(40,52,95,.10),inset 0 1px 0 #fff}
.sl-paper::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.55;mix-blend-mode:multiply;
 background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='300'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.011 .028' numOctaves='3' seed='11'/%3E%3CfeColorMatrix values='0 0 0 0 .55 0 0 0 0 .6 0 0 0 0 .72 0 0 0 .08 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")}
.sl-paper::before{opacity:var(--rule,1);content:"";position:absolute;inset:5px;border:1px solid rgba(135,150,180,.26);border-radius:2px;pointer-events:none;z-index:1}
.sl-full{position:relative;padding:17px 30px 16px 44px;transform-origin:50% 0}
.sl-eb{display:flex;align-items:baseline;gap:10px;font-size:10px;letter-spacing:.34em;color:rgba(46,58,99,.5);white-space:nowrap}
.sl-eb em{font-family:"Pinyon",serif;font-style:normal;font-size:17px;letter-spacing:0;color:#7C8FB8;line-height:1}
.sl-tt{margin:5px 0 0;font-size:17px;font-weight:600;letter-spacing:.08em;color:#2B3558;display:flex;align-items:baseline;gap:9px}
.sl-tt em{font-family:"Pinyon",serif;font-style:normal;font-weight:400;font-size:27px;letter-spacing:0;color:#4E5F8A;line-height:1}
.sl-file{display:flex;align-items:center;gap:8px;margin:9px 0 0;font-family:var(--mono);font-size:11.6px;color:#3A4466}
.sl-file .tg{font-family:var(--serif);font-size:8.8px;letter-spacing:.22em;text-transform:uppercase;color:rgba(78,94,140,.62);padding:2px 7px 2px 8px;border-radius:2px;
 background:rgba(124,143,184,.12);box-shadow:inset 0 0 0 .6px rgba(124,143,184,.4)}
.sl-file .p em{font-style:normal;color:rgba(40,50,85,.42)}
.n{font-family:var(--mono);font-size:10.5px;padding:1px 6px;border-radius:7px;line-height:1.5}
.n.a{color:#3F6B5E;background:rgba(70,125,105,.12)}.n.d{color:#95566C;background:rgba(160,90,115,.11)}
/* diff: v8 code frame (silver-blue frame + ivory inner ring) */
.sl-diff,.sl-cmd{margin:10px 0 0;border:1.6px solid #8796B4;border-radius:16px;box-shadow:inset 0 0 0 4px #F8FAFD;
 background:linear-gradient(180deg,#F3F5F9,#E9EDF4);padding:10px 8px 10px;font-family:var(--mono);font-size:11.6px;line-height:1.72;color:#36405E}
.sl-diff .hk{padding:0 12px 2px;color:rgba(54,64,94,.42)}.sl-diff .hk i{font-style:normal;color:#A0708A;opacity:.8}
.sl-diff .ln{padding:0 12px;border-radius:5px;white-space:pre}
.sl-diff .ln b{display:inline-block;width:12px;font-weight:400;color:rgba(54,64,94,.35)}
.sl-diff .del{background:rgba(160,90,115,.075);color:#8E5468}.sl-diff .del b{color:#A06A7C}
.sl-diff .add{background:rgba(70,125,105,.075);color:#3D6A5C}.sl-diff .add b{color:#5E8A7B}
.sl-cmd{display:flex;align-items:baseline;gap:10px;padding:12px 20px;font-size:13px;color:#2E3A63}
.sl-cmd i{font-style:normal;color:#8796B4}.sl-cmd span{margin-left:auto;font-family:"CormI",serif;font-style:italic;font-size:12.5px;color:rgba(54,64,94,.5)}
.v-cmd{display:none!important}
body.ap-cmd .v-cmd{display:revert!important}body.ap-cmd .v-file{display:none!important}
body.ap-cmd .sl-tt .v-cmd{display:inline!important}body.ap-cmd .sl-file.v-cmd{display:flex!important}
.sl-why{margin:9px 0 0;font-size:12.6px;line-height:1.6;letter-spacing:.03em;color:rgba(40,50,85,.72)}
.sl-why em{font-family:"CormI",serif;font-size:13.5px;color:#7C8FB8;margin-right:9px;letter-spacing:.02em}
/* actions */
.sl-act{display:flex;align-items:center;gap:12px;margin:13px 0 0}
.sl-act button,.q-foot button{font:inherit;border:0;background:none;cursor:pointer;-webkit-tap-highlight-color:transparent}
.sl-act .sl-ok{position:relative;display:flex;align-items:baseline;gap:10px;height:36px;padding:0 18px 0 22px;border-radius:3px;color:#FBF8F1;
 background:
  radial-gradient(70% 90% at 22% 30%,rgba(255,255,255,.10),rgba(255,255,255,0) 70%),
  radial-gradient(60% 80% at 85% 85%,rgba(30,40,70,.16),rgba(30,40,70,0) 70%),
  linear-gradient(180deg,#6577A0,#566992);
 box-shadow:inset 0 0 0 2px #5B6D96,inset 0 0 0 3px rgba(251,248,241,.55),0 6px 12px -7px rgba(40,52,95,.6),0 1px 1px rgba(40,52,95,.2);
 align-items:center;transform:translateY(var(--oky,0px)) scale(var(--oks,1));transition:filter .25s}
.sl-ok b{font-weight:600;font-size:13.5px;letter-spacing:.42em;padding-left:.2em}
.sl-ok kbd{font-family:"CormI",serif;font-style:italic;font-size:12px;letter-spacing:.04em;color:rgba(251,248,241,.62)}
.sl-act .sl-ok.hov,.sl-act .sl-ok:hover{filter:brightness(.93) saturate(1.05);box-shadow:inset 0 0 0 2px #53648C,inset 0 0 0 3px rgba(251,248,241,.62),0 10px 16px -8px rgba(40,52,95,.6),0 1px 1px rgba(40,52,95,.2)}
.sl-all{height:32px;padding:0 15px;border-radius:3px;font-size:12.5px!important;letter-spacing:.14em;color:#4F6188;
 background:linear-gradient(180deg,#F6F8FB,#ECF0F6)!important;box-shadow:inset 0 0 0 1px rgba(124,143,184,.5),0 1px 2px rgba(40,52,95,.08);transition:transform .3s cubic-bezier(.22,1,.36,1),background .25s}
.sl-all.hov,.sl-all:hover{transform:translateY(-1px);background:linear-gradient(180deg,#FFFFFF,#F0F3F8)!important}
.sl-no{margin-left:auto;display:flex;align-items:baseline;gap:9px;font-size:12.5px!important;letter-spacing:.2em;color:rgba(70,85,120,.62)}
.sl-no span{position:relative;padding-bottom:3px}
.u-ink{position:absolute;left:-2px;right:-2px;bottom:-1px;width:calc(100% + 4px);height:4px;opacity:.6;transition:opacity .25s}
.sl-no:hover .u-ink,.sl-no.hov .u-ink{opacity:1}
.sl-no:hover,.sl-no.hov{color:rgba(60,72,110,.85)}
.sl-no kbd,.q-keys em{font-family:"CormI",serif;font-style:italic;font-size:12px;letter-spacing:.04em;color:rgba(70,85,120,.45)}
/* seal + stamp */
.seal{position:absolute;right:20px;top:-18px;width:64px;height:64px;z-index:5;pointer-events:none;will-change:transform;
 filter:drop-shadow(0 3px 3px rgba(40,52,95,.22))}
.seal svg{display:block}
.sl-stamp{position:absolute;right:48px;top:128px;color:#50648E;opacity:0;pointer-events:none;z-index:2;mix-blend-mode:multiply;transform:rotate(-8deg)}
.sl-stamp.no{color:#946B7B}
/* one-line record */
.rec{position:relative;display:flex;align-items:center;gap:9px;height:36px;padding:0 16px 0 14px;border-radius:3px;font-size:12.5px;letter-spacing:.04em;color:rgba(40,50,85,.72);
 white-space:nowrap}
.sl-paper>.rec{position:absolute;left:0;right:0;top:0;opacity:0;padding-left:14px}
.rec .rk{flex:none;width:19px;height:19px;border-radius:50%;display:grid;place-items:center;font-style:normal;font-size:10.5px;color:#FBF8F1;
 background:radial-gradient(circle at 38% 32%,#7184AD,#53668F);box-shadow:inset 0 0 0 1.2px rgba(251,248,241,.5)}
.rec .rw{font-weight:600;color:#3E4F7A;letter-spacing:.14em}
.rec code{font-family:var(--mono);font-size:11.3px;color:#3A4466}
.rec .rr{margin-left:auto;font-family:"CormI",serif;font-size:12.5px;color:rgba(46,58,99,.45)}
.rec.static{background:linear-gradient(180deg,#F9F7F2,#F2F1EE);box-shadow:inset 0 0 0 1px rgba(135,150,180,.42),0 4px 8px -6px rgba(40,52,95,.3);margin:10px 0}
.rec.deny{color:rgba(60,66,90,.5)}
.rec.deny .rk{background:radial-gradient(circle at 38% 32%,#B39AA5,#957885)}
.rec.deny .rw{color:#8D6F7D}
.rec.deny code{color:rgba(58,68,102,.55)}
/* tool row after approval */
.ap-tool .dot{transition:none}
/* ---------- question card ---------- */
.q-tt{font-size:17.5px;margin-top:4px}
.q-opts{display:flex;gap:14px;margin:18px 0 0}
.q-opt{position:relative;flex:1;min-width:0;padding:15px 13px 12px 14px;border-radius:2px;cursor:pointer;
 background:
  linear-gradient(180deg,transparent 33px,rgba(124,143,184,.34) 33px,rgba(124,143,184,.34) 34px,transparent 34px),
  linear-gradient(180deg,#FFFEFB,#FAF8F3);
 box-shadow:0 6px 10px -8px rgba(40,52,95,.42),0 1px 1px rgba(40,52,95,.10),inset 0 0 0 1px rgba(135,150,180,.34);
 transform:translateY(var(--qy,0px)) rotate(var(--qr,0deg));transition:background-color .25s}
.q-tab{position:absolute;left:12px;top:-11px;height:13px;padding:0 9px;border-radius:3px 3px 0 0;font-style:italic;font-family:"CormI",serif;font-size:11.5px;line-height:13px;color:#6F82AC;
 background:linear-gradient(180deg,#F1F4F9,#FBF9F4);box-shadow:inset 1px 1px 0 rgba(135,150,180,.32),inset -1px 0 0 rgba(135,150,180,.32)}
.q-top{display:flex;align-items:center;gap:8px}
.q-rad{flex:none;position:relative;width:13px;height:13px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(91,108,147,.55)}
.q-rad::after{content:"";position:absolute;inset:2.6px;border-radius:50%;background:#53668F;transform:scale(var(--rs,0))}
.q-opt b{font-size:13.6px;font-weight:600;letter-spacing:.1em;color:#2E3A63}
.q-opt span{display:block;margin-top:9px;font-size:11.4px;line-height:1.55;letter-spacing:.02em;color:rgba(40,50,85,.58)}
.q-opt .q-rec{position:absolute;right:8px;top:-17px;font-family:"Pinyon",serif;font-style:normal;font-size:13.5px;color:#9A7584;line-height:1}
.q-opt.hov,.q-opt:hover{--qy:-3px;--qr:-.45deg;box-shadow:0 12px 16px -10px rgba(40,52,95,.45),0 1px 2px rgba(40,52,95,.12),inset 0 0 0 1px rgba(124,143,184,.5)}
.q-opt.sel{background:
  linear-gradient(180deg,transparent 33px,rgba(91,108,147,.4) 33px,rgba(91,108,147,.4) 34px,transparent 34px),
  linear-gradient(180deg,#EEF2F8,#E7EDF5);box-shadow:inset 0 1px 2px rgba(40,52,95,.14),inset 0 0 0 1px rgba(124,143,184,.55)}
.q-opt.sel .q-tab{background:linear-gradient(180deg,#E3E9F3,#EEF2F8);color:#4E5F8A}
.q-foot{display:flex;align-items:center;gap:18px;margin:16px 0 0}
.q-other{position:relative;flex:1;display:flex;align-items:baseline;gap:9px;padding:0 2px 7px;cursor:text}
.q-other em{font-family:"Pinyon",serif;font-style:normal;font-size:16px;color:#8C9DC0;line-height:1}
.q-other input{flex:1;min-width:0;border:0;outline:0;background:none;font:inherit;font-size:12.5px;letter-spacing:.06em;color:#2E3A63}
.q-other input::placeholder{color:rgba(70,85,120,.42)}
.q-ink{position:absolute;left:0;right:0;bottom:0;width:100%;height:6px}
.q-keys{font-size:11px;letter-spacing:.16em;color:rgba(70,85,120,.45);white-space:nowrap}
.q-skip{margin-left:0}
/* ---------- v2: confirmed choice ---------- */
.q-opts{position:relative}
.q-opt .q-tag{position:absolute;right:-9px;top:-25px;z-index:3;display:flex;align-items:baseline;gap:5px;height:19px;padding:0 9px 0 8px;white-space:nowrap;
 font-style:normal;font-size:10px;letter-spacing:.18em;color:#7C6573;opacity:0;transform-origin:0 100%;
 background:linear-gradient(180deg,#FFFDF8,#F8F2EC);box-shadow:inset 2px 0 0 rgba(214,166,178,.55),inset 0 0 0 .6px rgba(166,122,138,.35),0 3px 5px -3px rgba(40,52,95,.35);border-radius:1px}
.q-opt .q-tag em{font-family:"Pinyon",serif;font-style:normal;font-size:14px;letter-spacing:0;color:#8C6E7E;line-height:19px}
.q-opt .q-stk{position:absolute;right:-7px;bottom:-8px;z-index:3;width:22px;height:22px;opacity:0;filter:drop-shadow(0 1px 1px rgba(56,68,108,.25))}
.q-opt .q-stk svg{display:block}
.q-tick{position:absolute;left:0;top:0;z-index:6;pointer-events:none;overflow:visible;opacity:0;transform-origin:0 0;will-change:transform}
.rec.inkrk .rk{background:radial-gradient(circle at 40% 35%,#FFFEFA,#F3F1EC);box-shadow:inset 0 0 0 1px rgba(91,108,147,.48)}
.rec.inkrk .rk svg{visibility:hidden}
/* ---------- streaming blossom ---------- */
.ap-flw{position:fixed;left:0;top:0;width:0;height:0;z-index:30;pointer-events:none;opacity:0;will-change:transform,opacity}
.ap-flw svg{position:absolute;left:0;top:0;overflow:visible}
.ap-flw .bl{width:20px;height:20px;margin:-10px 0 0 -10px;filter:drop-shadow(0 1.4px 1.6px rgba(56,68,108,.26))}
.ap-flw .halo{margin:-22px 0 0 -22px;opacity:.55}
/* ---------- composer clock: streaming stop / waiting hourglass ---------- */
.send .ap-stop,.send .ap-wait{position:absolute;left:50%;top:57%;width:40px;height:40px;margin:-20px 0 0 -20px;z-index:3;pointer-events:none;opacity:0}
.send .ap-stop svg,.send .ap-wait svg{display:block!important}
.send .sl{transition:none}
.send .sl.s1,.send .sl.s2{opacity:0}
/* ---------- notepad plan: waiting tag ---------- */
.td{position:relative}
.td .ap-wt{position:absolute;left:27px;top:calc(100% - 1px);display:flex;align-items:baseline;gap:6px;white-space:nowrap;font-size:10.5px;letter-spacing:.22em;color:#8D6F7D;opacity:0}
.td .ap-wt em{font-family:"Pinyon",serif;font-style:normal;font-size:14px;letter-spacing:0;color:#A3899A;line-height:1}
.td.ap-hold .mk{animation-play-state:paused!important;opacity:.5}
.td.ap-hold .mk::after{animation-play-state:paused!important;opacity:.15}
.fx.ap-new{overflow:hidden;max-height:0;opacity:0;padding:0}
/* demo cursor */
#apCur{position:fixed;left:0;top:0;z-index:99999;pointer-events:none;width:22px;height:26px;opacity:0;will-change:transform}
@media (prefers-reduced-motion:reduce){.ap-flw .halo{display:none}.q-opt,.sl-ok,.sl-all{transition:none}}
</style>
'''

JS = r'''<script>
(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)');
const $=id=>document.getElementById(id);
const b=document.body;
if(location.hash.includes('cmd'))b.classList.add('ap-cmd');
/* ---- v8 transcript: earlier edit finished; a denied record sits between the two earlier tools ---- */
const oldRun=document.querySelector('.thread .tool.run');oldRun.classList.remove('run');oldRun.querySelector('.d').textContent='0.6s';
const firstTool=document.querySelector('.thread .tool');firstTool.insertAdjacentHTML('afterend',window.__apDenied);
/* typing row -> our new assistant column */
const typ=document.querySelector('.thread .typing').closest('.row');typ.insertAdjacentHTML('afterend',window.__apCol);typ.remove();
/* notepad: step 3 done, step 4 current (+ waiting tag); a third changes leaf appears when the edit lands */
const tds=[...document.querySelectorAll('.folio .td')];
tds[2].classList.remove('now');tds[2].classList.add('ok');tds[2].querySelector('.mk').innerHTML=window.__apCheck;
tds[3].classList.remove('todo');tds[3].classList.add('now');tds[3].querySelector('.mk').textContent='✦';
tds[3].insertAdjacentHTML('beforeend','<span class="ap-wt" id="apWt"><em>attente</em><span id="apWtx">等待许可</span></span>');
const fxs=document.querySelectorAll('.folio .fx');fxs[fxs.length-1].insertAdjacentHTML('afterend','<div class="fx ap-new" id="apFx"><span class="p"><em>src/renderer/engine/</em>adapter.ts</span><span class="n a">+3</span><span class="n d">−1</span></div>');
const planH=[...document.querySelectorAll('.folio .sec h5 small')].find(e=>/ of iv/.test(e.textContent));if(planH)planH.textContent='iii of iv';
const leaves=[...document.querySelectorAll('.folio .sec h5 small')].find(e=>e.textContent.includes('leaves'));
/* composer: stop ring + waiting hourglass over the pocket watch */
const send=document.querySelector('.send'),sl0=send.querySelector('.sl');
sl0.insertAdjacentHTML('afterend','<span class="sl s1">Stopper</span><span class="sl s2">Patience</span>'+window.__apStop);
const sl1=send.querySelector('.sl.s1'),sl2=send.querySelector('.sl.s2');
/* demo cursor */
const cur=document.createElement('div');cur.id='apCur';
cur.innerHTML='<svg width="22" height="26" viewBox="0 0 22 26"><path d="M3 2 L3 20.5 L7.6 16.3 L10.9 23.6 L14 22.2 L10.8 15.1 L17 14.6 Z" fill="#FBFAF6" stroke="#3E4C76" stroke-width="1.25" stroke-linejoin="round" style="filter:drop-shadow(0 1.5px 1.5px rgba(30,40,70,.35))"/></svg>';
b.appendChild(cur);

const thread=document.querySelector('.thread'),scrollEl=document.querySelector('.scroll');
const B1=$('apB1'),B2=$('apB2'),slip=$('slip'),slPaper=$('slPaper'),slFull=$('slFull'),slRec=$('slRec'),slHair=$('slHair'),seal=$('seal');
const okB=$('slOk'),allB=$('slAll'),noB=$('slNo'),stOk=slip.querySelector('.sl-stamp.ok'),stNo=slip.querySelector('.sl-stamp.no');
const tool=$('apTool'),toolD=$('apToolD'),qc=$('qc'),qPaper=$('qPaper'),qFull=$('qFull'),qRec=$('qRec'),qHair=$('qHair'),qAns=$('qAns');
const opts=[...qc.querySelectorAll('.q-opt')],qSkip=$('qSkip'),qIn=$('qIn');
const B3=$('apB3'),qTick=$('qTick'),tkPen=qTick.querySelector('.pen'),tkBl=qTick.querySelector('.bleed'),qHead=[...qFull.children].filter(e=>!e.classList.contains('q-opts'));
const flw=$('apFlw'),flRot=$('apFlRot'),pos=[...flw.querySelectorAll('.po')];
const stopI=$('apStop'),waitI=$('apWait'),stArc=$('apStArc'),wRing=$('apWRing'),hgG=$('apHg'),sandT=$('apSandT'),sandB=$('apSandB');
const wt=$('apWt'),wtx=$('apWtx'),fxN=$('apFx');

/* ---- character streaming (seeded chunks, ink settle) ---- */
const wrap=root=>{const out=[];const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const ns=[];while(tw.nextNode())ns.push(tw.currentNode);
  ns.forEach(n=>{const f=document.createDocumentFragment();for(const c of n.data){const e=document.createElement('span');e.className='ch';e.textContent=c;f.appendChild(e);out.push({el:e,c})}
   n.parentNode.replaceChild(f,n)});return out};
let seed=20261426;const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const sched=(chars,a,z)=>{let t=0,i=0;const P='，。：；！？、';
  while(i<chars.length){const n=P.includes(chars[i].c)?1:(rnd()<.45?1:(rnd()<.7?2:3));const d=n*.034;
    for(let k=0;k<n&&i<chars.length;k++,i++)chars[i].a=t+d*(k+1)/n;
    t+=d+n*.022*(.7+rnd()*.8)+(P.includes(chars[i-1].c)?.2:0)+(rnd()<.08?.15:0)}
  const end=chars[chars.length-1].a;chars.forEach(c=>c.a=a+(c.a/end)*(z-a))};
const C1=wrap(B1),C2=wrap(B2);let C3=wrap(B3);

/* ---- timeline (s) ---- */
/* v2: slip holds .5s with the seal at rest (rest -> cp0); question: select -> tick (450ms) -> hold -> gather -> fold -> B3 */
const T={b1:0,c1a:.45,c1z:1.85,sl:2.2,pr:5.3,lift:5.42,trav:5.62,press:5.9,ink:5.95,back:6.12,rest:6.75,cp0:7.25,cp1:7.85,tl:7.9,tlD:8.8,
  b2:8.95,c2a:9.1,c2z:10.45,q:10.65,sel:13.2,tk0:13.3,tk1:13.75,stk:13.62,tag:13.66,g0:14.85,g1:15.4,qc0:15.28,qc1:15.78,
  b3:15.9,c3a:16.05,c3z:17.0,END:18.4};
sched(C1,T.c1a,T.c1z);sched(C2,T.c2a,T.c2z);sched(C3,T.c3a,T.c3z);
const cl=u=>Math.max(0,Math.min(1,u)),eo=u=>1-Math.pow(1-cl(u),3),eio=u=>{u=cl(u);return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2},sm=u=>{u=cl(u);return u*u*(3-2*u)};
const back=u=>{u=cl(u);const c=1.5;return 1+(c+1)*Math.pow(u-1,3)+c*Math.pow(u-1,2)};
const spring=(z,w,t)=>{if(t<=0)return 1;const wd=w*Math.sqrt(1-z*z);return Math.exp(-z*w*t)*(Math.cos(wd*t)+(z*w/wd)*Math.sin(wd*t))};
/* user choices (real clicks) */
let verdict='ok',choice=1,userMode=false,holdA=false,holdQ=false;

const charFrame=(chars,t)=>{const rm=RM.matches;let last=null;
  for(const c of chars){const age=t-c.a,e=c.el;
    if(age<0){if(e._s!==0){e.className='ch';e.removeAttribute('style');e._s=0}continue}
    last=c;const D=rm?.12:.27;
    if(age>=D){if(e._s!==2){e.className='ch on';e.removeAttribute('style');e._s=2}continue}
    const k=eo(age/D);e.className='ch on';e._s=1;
    if(rm){e.style.cssText=`opacity:${k.toFixed(3)}`;continue}
    e.style.cssText=`opacity:${Math.pow(k,.7).toFixed(3)};position:relative;top:${(-1.6*(1-k)).toFixed(2)}px;`+
      `-webkit-text-fill-color:color-mix(in srgb,currentColor ${(k*k*100).toFixed(0)}%,transparent);`+
      `text-shadow:0 0 ${(5*(1-k)).toFixed(2)}px color-mix(in srgb,currentColor ${(70*(1-k)).toFixed(0)}%,transparent)`}
  return last};
const arrive=(el,t,t0,dur=.5)=>{ // slide up + settle
  if(t<t0){el.style.display='none';return false}
  el.style.display='';const u=(t-t0)/dur;
  if(RM.matches){el.style.opacity=cl(u*2.5).toFixed(3);el.style.transform='none';return true}
  if(u>=1.6){el.style.opacity='';el.style.transform='';return true}
  const y=22*spring(.78,11,(t-t0)),r=-.6*spring(.5,13,(t-t0));
  el.style.opacity=cl(u*1.9).toFixed(3);el.style.transform=`translateY(${y.toFixed(2)}px) rotate(${r.toFixed(3)}deg)`;return true};

/* slip / card fold: explicit height from full -> record */
let H={};
const measure=()=>{const sd=slip.style.display,qd=qc.style.display;slip.style.display='';qc.style.display='';
  slPaper.style.height='';qPaper.style.height='';H.sl=slFull.offsetHeight;H.q=qFull.offsetHeight;
  // stamp target: centre of the ink impression inside the slip, seal resting centre
  const sx=slip.offsetWidth-20-32,sy=-18+32;const sr=slip.getBoundingClientRect(),ir=stOk.getBoundingClientRect();const ix=ir.left-sr.left+ir.width/2,iy=ir.top-sr.top+ir.height/2;H.dx=ix-sx;H.dy=iy-sy;
  const qr=qc.getBoundingClientRect();H.op=opts.map(o=>{const r=o.getBoundingClientRect();return {x:r.left-qr.left,y:r.top-qr.top,w:r.width,h:r.height}});
  const kr=qRec.querySelector('.rk').getBoundingClientRect();H.rk={x:kr.left-qr.left+kr.width/2,y:kr.top-qr.top+kr.height/2};
  H.tl=tkPen.getTotalLength();
  slip.style.display=sd;qc.style.display=qd};
const fold=(paper,full,rec,hair,t,c0,c1,Hf)=>{
  const u=RM.matches?(t>=(c0+c1)/2?1:0):eio((t-c0)/(c1-c0));
  if(u<=0){paper.style.setProperty('--rule',1);paper.style.height='';full.style.opacity='';full.style.transform='';rec.style.opacity=0;rec.style.pointerEvents='none';return 0}
  paper.style.height=(Hf+(36-Hf)*u).toFixed(2)+'px';
  full.style.opacity=(1-cl((u-.22)/.42)).toFixed(3);full.style.transform=`translateY(${(-14*u).toFixed(2)}px) scaleY(${(1-.04*u).toFixed(4)})`;
  rec.style.opacity=cl((u-.5)/.45).toFixed(3);paper.style.setProperty('--rule',(1-cl(u/.6)).toFixed(3));rec.style.pointerEvents=u>=1?'auto':'none';return u};

/* thread follower (keeps the newest element in view) */
let sc=-1,lastT=-1;
const target=()=>{const ch=[...$('apRow').querySelector('.col').children].filter(e=>e.style.display!=='none');const lastEl=ch[ch.length-1];if(!lastEl)return Math.max(0,sc);
  const bot=lastEl.getBoundingClientRect().bottom+Math.max(0,sc);const vb=scrollEl.getBoundingClientRect().bottom-62;return Math.max(0,bot-vb)};

/* cursor path: waypoints evaluated live */
const ctr=el=>{const r=el.getBoundingClientRect();return [r.left+r.width*.5,r.top+r.height*.52]};
const off=(p,dx,dy)=>[p[0]+dx,p[1]+dy];
const WP=[[0,()=>[990,700]],[3.0,()=>[990,700]],[4.1,()=>off(ctr(okB),6,4)],[5.5,()=>off(ctr(okB),6,4)],[6.2,()=>off(ctr(okB),150,74)],
  [11.25,()=>off(ctr(okB),150,74)],[11.85,()=>off(ctr(opts[0]),10,8)],[12.3,()=>off(ctr(opts[0]),10,8)],[12.7,()=>off(ctr(opts[1]),-22,6)],[13.3,()=>off(ctr(opts[1]),-22,6)],
  [14.0,()=>off(ctr(opts[1]),60,112)],[18.4,()=>off(ctr(opts[1]),60,112)]];
const curAt=t=>{for(let i=0;i<WP.length-1;i++){const [a,fa]=WP[i],[z,fz]=WP[i+1];if(t>=a&&t<=z){const p=fa(),q=fz();const u=eio((t-a)/(z-a));return [p[0]+(q[0]-p[0])*u,p[1]+(q[1]-p[1])*u]}}return WP[WP.length-1][1]()};
const inside=(el,x,y)=>{const r=el.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom};

/* ---- v2: confirmed-choice beat on the question card ---- */
const qConfirm=(t,rm)=>{const ch=choice>=0&&choice<=2?choice:-1;
  const dimU=t>=T.sel?(rm?1:eo((t-T.sel-.05)/.5)):0, gU=t>=T.g0?(rm?(t>=T.qc0?1:0):eio((t-T.g0)/(T.g1-T.g0))):0;
  const liftU=t>=T.sel?(rm?0:eo((t-T.sel)/.4)):0;
  opts.forEach((o,k)=>{const tag=o.querySelector('.q-tag'),stk=o.querySelector('.q-stk'),rec=o.querySelector('.q-rec');
    if(t<T.sel||ch<0){o.style.transform='';o.style.opacity='';o.style.zIndex='';o.style.boxShadow='';tag.style.opacity=0;stk.style.opacity=0;if(rec)rec.style.opacity='';return}
    if(k===ch){const y=-5*liftU+3*gU,r=-.5*liftU*(1-gU);o.style.zIndex=4;o.style.opacity='';
      o.style.transform=rm?'none':`translateY(${y.toFixed(2)}px) rotate(${r.toFixed(3)}deg)`;
      o.style.boxShadow=rm?'':`0 ${(6+8*liftU*(1-gU)).toFixed(1)}px ${(10+8*liftU*(1-gU)).toFixed(1)}px -${(8+2*liftU).toFixed(1)}px rgba(40,52,95,.45),0 1px 2px rgba(40,52,95,.12),inset 0 1px 2px rgba(40,52,95,.10),inset 0 0 0 1px rgba(124,143,184,.55)`;
      // flower sticker pressed into the corner
      const su=t>=T.stk?(rm?1:cl((t-T.stk)/.32)):0;stk.style.opacity=cl(su*2.2).toFixed(3);
      stk.style.transform=`rotate(${(-14+6*eo(su)).toFixed(2)}deg) scale(${(rm?1:1.35-.35*eo(su)).toFixed(3)})`;
      stk.style.filter=`drop-shadow(0 ${(1+3*(1-eo(su))).toFixed(2)}px ${(1+3*(1-eo(su))).toFixed(2)}px rgba(56,68,108,${(.25+.1*(1-su)).toFixed(3)}))`;
      // paper tag written in (wipe) beside the corner
      const au=t>=T.tag?(rm?1:cl((t-T.tag)/.42)):0;tag.style.opacity=cl(au*3).toFixed(3);
      tag.style.clipPath=rm?'none':`inset(-4px ${(100-100*eio(au)).toFixed(2)}% -4px -4px)`;
      tag.style.transform=`rotate(${(3.2-1.2*eo(au)).toFixed(2)}deg) translateY(${(rm?0:-2*(1-eo(au))).toFixed(2)}px)`;
      if(rec)rec.style.opacity=(1-cl(au*2.5)).toFixed(3)}
    else{const sd=k<ch?-1:1,d=Math.abs(k-ch);
      const fx=sd*(7+3*d)*dimU,fy=4*dimU,fr=sd*1.5*dimU,fs=1-.03*dimU;
      const gx=(H.op[ch].x-H.op[k].x)+sd*(5+2*d),gy=(H.op[ch].y-H.op[k].y)+4+2*d,gr=k<ch?-(2.1+.7*(d-1)):(1.7+.7*(d-1)),gs=.985;
      const x=fx+(gx-fx)*gU,y=fy+(gy-fy)*gU,r=fr+(gr-fr)*gU,sc=fs+(gs-fs)*gU;
      o.style.zIndex=3-d;o.style.opacity=(rm?(1-.45*dimU)*(1-gU):1-.45*dimU+.2*gU).toFixed(3);
      o.style.transform=rm?'none':`translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${r.toFixed(3)}deg) scale(${sc.toFixed(4)})`;o.style.boxShadow='';
      tag.style.opacity=0;stk.style.opacity=0;if(rec)rec.style.opacity=(1-dimU*.6).toFixed(3)}});
  // header/foot of the card quieten while the stack gathers
  const hq=t>=T.sel?.15*dimU+.25*gU:0;qHead.forEach(e=>e.style.opacity=(1-hq).toFixed(3));
  return gU};
/* the ink tick: pen-drawn on the chosen card, then carried into the record's ring */
const qTickPos=(t,rm)=>{const ch=choice>=0&&choice<=2?choice:-1;qRec.classList.toggle('inkrk',ch>=0);
  if(ch<0||t<T.tk0-(rm?.1:0)){qTick.style.opacity=0;return}
  const c=H.op[ch],liftU=rm?0:eo((t-T.sel)/.4),gU=t>=T.g0&&!rm?eio((t-T.g0)/(T.g1-T.g0)):0;
  const x0=c.x+c.w-46,y0=c.y+10-5*liftU+3*gU;
  const fu=rm?(t>=(T.qc0+T.qc1)/2?1:0):eio((t-T.qc0)/(T.qc1-T.qc0));
  const ff=qFull.style.transform?-14*fu:0;
  const s1=.52,x1=H.rk.x-18*s1+.8,y1=H.rk.y-17*s1-.6;
  const x=(x0)+(x1-x0)*fu,y=(y0+ff)+(y1-(y0+ff))*fu,sc=1+(s1-1)*fu,ar=(1-fu)*0;
  qTick.style.opacity=1;qTick.style.transform=`translate(${x.toFixed(2)}px,${(y-(fu>0&&fu<1?10*Math.sin(Math.PI*fu):0)).toFixed(2)}px) scale(${sc.toFixed(4)})`;
  // pen stroke + bleed settling
  const L=H.tl||60,du=rm?1:eio((t-T.tk0)/(T.tk1-T.tk0));
  tkPen.style.strokeDasharray=`${L+2} ${L+2}`;tkPen.style.strokeDashoffset=((L+2)*(1-du)).toFixed(2);
  const settle=rm?1:cl((t-T.tk0-.25)/.7);
  tkPen.setAttribute('stroke-width',(2.5+.5*(1-settle)*cl(du*3)+1.6*fu).toFixed(2));
  tkBl.style.strokeDasharray=`${L+2} ${L+2}`;tkBl.style.strokeDashoffset=((L+2)*(1-cl(du*1.02-.02))).toFixed(2);
  tkBl.style.opacity=(rm?.12:(.3*(1-settle)+.13)*cl(du*2)*(1-.6*fu)).toFixed(3);
  tkBl.setAttribute('stroke-width',(5.2+1.8*settle).toFixed(2))};
const frame=t=>{if(!H.sl)measure();const rm=RM.matches;
  if(t<lastT-.001)sc=-1;   // jumped back: snap
  /* ---- B1 streaming ---- */
  arrive(B1,t,T.b1,.4);const l1=charFrame(C1,t);
  /* ---- slip ---- */
  const slOn=arrive(slip,t,T.sl);
  const pend=t>=T.sl&&t<T.pr+.12;
  const breath=rm?.5:.5+.5*Math.sin((t-T.sl)*2*Math.PI/2.6-Math.PI/2);
  slHair.style.opacity=pend?(cl((t-T.sl-.35)/.4)*(.18+.42*breath)).toFixed(3):(t<T.cp0&&t>=T.pr?(.6*(1-cl((t-T.pr)/.4))*.5).toFixed(3):0);
  // press feedback on 允许 (or the chosen button)
  const pb=verdict==='all'?allB:verdict==='no'?noB:okB;
  const pu=t>=T.pr&&t<T.pr+.25?Math.sin(Math.PI*cl((t-T.pr)/.25)):0;
  okB.style.setProperty('--oky',(pb===okB?1.2*pu:0).toFixed(2)+'px');okB.style.setProperty('--oks',(pb===okB?1-.025*pu:1).toFixed(4));
  // seal travel + press
  let sx=0,sy=0,ss=1,sr=0,so=1,shd=.22;
  if(!rm&&verdict!=='none'){
    if(t>=T.lift&&t<T.trav){const u=eo((t-T.lift)/(T.trav-T.lift));sy=-10*u;ss=1+.08*u;sr=-8*u;shd=.22+.12*u}
    else if(t>=T.trav&&t<T.press){const u=eio((t-T.trav)/(T.press-T.trav));sx=H.dx*u;sy=-10+(H.dy+10-16)*u-14*Math.sin(Math.PI*u);ss=1.08+.12*u;sr=-8+2*u;shd=.34+.06*u}
    else if(t>=T.press&&t<T.back){const u=(t-T.press)/(T.back-T.press);sx=H.dx;sy=H.dy-16+16*Math.sin(Math.PI*Math.min(1,u*1.6));ss=1.2-.26*Math.sin(Math.PI*Math.min(1,u*1.6));sr=-6;shd=.1}
    else if(t>=T.back&&t<T.cp0){const u=eio((t-T.back)/(T.rest-T.back-.05));sx=H.dx*(1-u);sy=(H.dy-16)*(1-u)-12*Math.sin(Math.PI*u);ss=1.2-.2*u;sr=-6+6*u;shd=.3-.08*u}}
  if(t>=T.cp0)so=1-cl((t-T.cp0)/(rm?.05:.3)),ss*=1-.3*cl((t-T.cp0)/.3);
  seal.style.transform=`translate(${sx.toFixed(2)}px,${sy.toFixed(2)}px) rotate(${sr.toFixed(2)}deg) scale(${ss.toFixed(3)})`;
  seal.style.opacity=so.toFixed(3);seal.style.filter=`drop-shadow(0 ${(3+10*(shd-.22)/.18).toFixed(1)}px ${(3+8*(shd-.22)/.18).toFixed(1)}px rgba(40,52,95,${shd.toFixed(3)}))`;
  // ink impression
  const st=verdict==='no'?stNo:stOk,stO=verdict==='no'?stOk:stNo;stO.style.opacity=0;
  const ti=rm?T.pr+.2:T.ink;
  if(t>=ti){const u=cl((t-ti)/(rm?.25:.18));st.style.opacity=(.88*u).toFixed(3);
    st.style.transform=`rotate(-8deg) scale(${(1.05-.05*eo(u)).toFixed(3)})`;st.style.filter=`blur(${(1.2*(1-u)).toFixed(2)}px)`}else st.style.opacity=0;
  if(!rm&&t>=T.press&&t<T.press+.2){slPaper.style.transform=`translateY(${(1.2*Math.sin(Math.PI*(t-T.press)/.2)).toFixed(2)}px)`}else slPaper.style.transform='';
  const fu=fold(slPaper,slFull,slRec,slHair,t,T.cp0,T.cp1,H.sl);
  /* ---- tool row + B2 + question (only when allowed) ---- */
  const go=verdict!=='no';
  if(go){arrive(tool,t,T.tl,.45);const run=t>=T.tl&&t<T.tlD;tool.classList.toggle('run',run);toolD.textContent=run?'进行中':(t>=T.tlD?'0.3s':'');}else tool.style.display='none';
  const l2=go?(arrive(B2,t,T.b2,.4),charFrame(C2,t)):(B2.style.display='none',null);
  if(go)arrive(qc,t,T.q);else qc.style.display='none';
  const l3=go?(arrive(B3,t,T.b3,.4),charFrame(C3,t)):(B3.style.display='none',null);
  const qPend=go&&t>=T.q&&t<T.sel+.1;
  qHair.style.opacity=qPend?(cl((t-T.q-.35)/.4)*(.18+.42*(rm?.5:.5+.5*Math.sin((t-T.q)*2*Math.PI/2.6-Math.PI/2)))).toFixed(3):0;
  const selU=t>=T.sel?eo((t-T.sel)/.3):0;
  opts.forEach((o,k)=>{const on=k===choice&&t>=T.sel;o.classList.toggle('sel',on);o.setAttribute('aria-checked',on);o.style.setProperty('--rs',on?(rm?1:back(selU)).toFixed(3):0)});
  const qu=qConfirm(t,rm);
  fold(qPaper,qFull,qRec,qHair,t,T.qc0,T.qc1,H.q);qTickPos(t,rm);
  /* ---- notepad + changes ---- */
  const waitA=t>=T.sl+.3&&t<T.pr,waitQ=go&&t>=T.q+.3&&t<T.sel;
  tds3(waitA||waitQ);wtx.textContent=waitQ?'等待回答':'等待许可';
  wt.style.opacity=(waitA?cl((t-T.sl-.3)/.35)*(1-cl((t-T.pr+.15)/.15)):waitQ?cl((t-T.q-.3)/.35)*(1-cl((t-T.sel+.15)/.15)):0).toFixed(3);
  const fxU=go&&t>=T.tlD?eo((t-T.tlD)/.5):0;fxN.style.maxHeight=(fxU*30).toFixed(1)+'px';fxN.style.opacity=fxU.toFixed(3);fxN.style.padding=`${(4*fxU).toFixed(2)}px 0`;
  if(leaves)leaves.textContent=fxU>.5?'three leaves':'two leaves';
  /* ---- composer clock ---- */
  const streaming=(t>=T.b1&&t<T.c1z+.25)||(go&&t>=T.tl&&t<T.tlD)||(go&&t>=T.b2&&t<T.c2z+.25)||(go&&t>=T.b3&&t<T.c3z+.25);
  const waiting=(t>=T.sl+.25&&t<T.pr+.1)||qPend;
  const busyV=streaming?1:0,waitV=waiting?1:0;
  send._bv=send._bv===undefined?busyV:send._bv;send._wv=send._wv===undefined?waitV:send._wv;
  const dtc=Math.max(0,Math.min(.1,t-lastT));const kk=rm?1:1-Math.exp(-dtc/.12);
  send._bv+=(busyV-send._bv)*kk;send._wv+=(waitV-send._wv)*kk;if(lastT<0||t<lastT){send._bv=busyV;send._wv=waitV}
  const bv=send._bv,wv=send._wv;
  stopI.style.opacity=bv.toFixed(3);stopI.style.transform=`scale(${(.86+.14*bv).toFixed(3)})`;
  waitI.style.opacity=wv.toFixed(3);waitI.style.transform=`scale(${(.86+.14*wv).toFixed(3)})`;
  sl0.style.opacity=(1-Math.max(bv,wv)).toFixed(3);sl1.style.opacity=bv.toFixed(3);sl2.style.opacity=wv.toFixed(3);
  if(!rm){stArc.setAttribute('transform',`rotate(${((t*150)%360).toFixed(1)})`);
    const hp=((t%3.2)+3.2)%3.2,flow=cl(hp/2.6),flip=cl((hp-2.7)/.5);
    sandT.setAttribute('y',(-6+6*flow).toFixed(2));sandT.setAttribute('height',(6-6*flow).toFixed(2));
    sandB.setAttribute('y',(6-6*flow).toFixed(2));sandB.setAttribute('height',(6*flow).toFixed(2));
    hgG.setAttribute('transform',`rotate(${(180*eio(flip)).toFixed(1)})`);
    wRing.setAttribute('opacity',(.35+.5*(.5+.5*Math.sin(t*2*Math.PI/2.6))).toFixed(2))}
  /* ---- blossom on the writing tip ---- */
  const tip=(l1&&t<T.c1z+.9)?{l:l1,z:T.c1z,a:T.c1a}:(l2&&t<T.c2z+.9?{l:l2,z:T.c2z,a:T.c2a}:(l3&&t<T.c3z+.9?{l:l3,z:T.c3z,a:T.c3a}:null));
  if(tip&&!rm){const r=tip.l.el.getBoundingClientRect();const after=t-tip.z;
    const o=after<0?cl((t-tip.a+.1)/.3):1-cl((after-.35)/.5);const bl=after>0?Math.sin(Math.PI*cl(after/.7)):0;
    flw.style.opacity=o.toFixed(3);flw.style.transform=`translate(${(r.right+8+5*cl(after/.3)).toFixed(2)}px,${((r.top+r.bottom)/2-1).toFixed(2)}px) scale(${(1+.18*bl-.2*cl(after/.8)).toFixed(3)})`;
    flRot.setAttribute('transform',`rotate(${(Math.min(t,tip.z)*34+7*Math.sin(t*2*Math.PI/1.8)).toFixed(2)})`);
    pos.forEach((g,k)=>g.setAttribute('transform',`translate(0 ${(-1.4*bl).toFixed(2)}) rotate(${(bl*(k%2?3:-3)).toFixed(2)})`))}
  else flw.style.opacity=0;
  /* ---- thread follower ---- */
  const tg=target();if(sc<0||rm)sc=tg;else{const dt=Math.max(0,Math.min(.1,t-lastT));sc+=(tg-sc)*(1-Math.exp(-dt/.2))}
  thread.style.transform=`translateY(${(-sc).toFixed(2)}px)`;
  /* ---- demo cursor + hover ---- */
  let cx=-99,cy=-99;
  if(!userMode){const [x,y]=curAt(t);cx=x;cy=y;const down=(t>=T.pr&&t<T.pr+.12)||(t>=T.sel&&t<T.sel+.12);
    const co=cl((t-3.0)/.3)*(1-cl((t-T.END+.5)/.35));cur.style.opacity=co.toFixed(3);cur.style.transform=`translate(${(x-3).toFixed(2)}px,${(y-2).toFixed(2)}px) scale(${down?.88:1})`}
  else cur.style.opacity=0;
  const hovOk=pend&&inside(okB,cx,cy);[okB,allB,noB].forEach(e=>e.classList.toggle('hov',pend&&inside(e,cx,cy)));
  opts.forEach(o=>o.classList.toggle('hov',qPend&&t<T.sel&&inside(o,cx,cy)));
  lastT=t};
const tds3=on=>tds[3].classList.toggle('ap-hold',on);

window.__apframe=frame;window.__apT=T;
/* ---- live mode: loop, real interaction holds at the decision points ---- */
let t0=null,tt=0,lastN=0,hold=null;
const jump=v=>{tt=v};
const decideA=v=>{if(!(tt>=T.sl&&tt<T.pr+.05))return;verdict=v;
  slRec.classList.toggle('deny',v==='no');slRec.querySelector('.rk').innerHTML=v==='no'?window.__apX:window.__apCk;
  slRec.querySelector('.rw').textContent=v==='no'?'已拒绝':v==='all'?'本会话都允许':'已允许';
  slRec.querySelector('.rr').textContent=v==='no'?'Refusé · 16:42':'Accordé · 16:42';jump(T.pr)};
const decideQ=k=>{if(!(tt>=T.q&&tt<T.sel+.05))return;choice=k;qAns.textContent=k<0?'已跳过':(k>2?qIn.value||'其他':opts[k].querySelector('b').textContent);
  qRec.querySelector('.rw').textContent=k<0?'已跳过':'已回答';
  setB3(k<0?'好，那我先按帧批处理，之后随时可以改。':'好，'+qAns.textContent+'。我先写'+(k===0?'定时刷新':k===2?'按句提交':k>2?'这个方案':'帧缓冲')+'，再补流式测试。');jump(T.sel)};
const setB3=txt=>{B3.textContent=txt;C3=wrap(B3);sched(C3,T.c3a,T.c3z)};
okB.addEventListener('click',()=>decideA('ok'));allB.addEventListener('click',()=>decideA('all'));noB.addEventListener('click',()=>decideA('no'));
opts.forEach((o,k)=>o.addEventListener('click',()=>decideQ(k)));qSkip.addEventListener('click',()=>decideQ(-1));
qIn.addEventListener('keydown',e=>{if(e.key==='Enter'&&qIn.value.trim()){e.stopPropagation();choice=9;decideQ(9)}});
addEventListener('keydown',e=>{if(document.activeElement===qIn)return;
  if(tt>=T.sl&&tt<T.pr){if(e.key==='Enter')decideA('ok');if(e.key==='Escape')decideA('no')}
  else if(tt>=T.q&&tt<T.sel){if('123'.includes(e.key))decideQ(+e.key-1);if(e.key==='Escape')decideQ(-1)}});
addEventListener('pointermove',e=>{if(!window.__apCapture&&e.isTrusted&&!userMode){userMode=true}},{passive:true});
const live=n=>{if(t0===null){t0=n;lastN=n}const dt=(n-lastN)/1000;lastN=n;
  let nt=tt+dt;
  if(userMode){ // wait for the user at each decision
    if(tt<T.pr&&nt>=T.pr-.02&&tt>=T.sl)nt=T.pr-.02;
    if(tt<T.sel&&nt>=T.sel-.02&&tt>=T.q)nt=T.sel-.02;
    if(verdict==='no'&&nt>T.cp1+1)nt=T.cp1+1}
  if(nt>=T.END){nt=0;verdict='ok';choice=1;decideReset()}
  tt=nt;frame(tt);requestAnimationFrame(live)};
const decideReset=()=>{slRec.classList.remove('deny');slRec.querySelector('.rk').innerHTML=window.__apCk;slRec.querySelector('.rw').textContent='已允许';
  slRec.querySelector('.rr').textContent='Accordé · 16:42';qAns.textContent='按帧批处理';qRec.querySelector('.rw').textContent='已回答';setB3('好，按帧批处理。我先写帧缓冲，再补流式测试。')};
const still=location.hash.includes('pend')?4.6:location.hash.includes('qok')?14.5:location.hash.includes('#q')?12.9:null;
const start=()=>{measure();if(window.__apCapture){frame(0);return}
  if(still!==null){userMode=true;tt=still;for(let x=0;x<=still;x+=1/30)frame(x);frame(still);return}
  requestAnimationFrame(live)};
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>requestAnimationFrame(start));
frame(0);
})();
</script>'''

import json
pre = ('<script>window.__apCol=' + json.dumps(NEWCOL) + ';window.__apDenied=' + json.dumps(DENIED) +
       ';window.__apStop=' + json.dumps(STOP) + ';window.__apCheck=' + json.dumps(CHECK) + ';window.__apCk=' + json.dumps(CK) + ';window.__apX=' + json.dumps(XX) + ';</script>')

sub1('<title>Kimi Code · 蓝雾厅 v8</title>', '<title>Kimi Code · 蓝雾厅 · 许可与提问 approval v2</title>')
sub1('</head>', CSS + '</head>')
idx = s.rfind('</body>')
s = s[:idx] + DEFS + FLOWER + pre + JS + s[idx:]
open(OUT, 'w', encoding='utf-8').write(s)
print('wrote', OUT, len(s))
