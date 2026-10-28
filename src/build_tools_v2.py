#!/usr/bin/env python3
"""Build tools_v2.html (tool calls + code diff state) from v8.html. v8 / v11 / v12 / v13 / sessions_v2 / approval_v2 are read only.
v2 = tools v1 + the model layer from sessions_v2 (taken from build_sessions_v2.py at build time, never copied by hand):
  composer luggage-tag chip "K3.1 Pro · Max" -> menu-card popover (subscription, six models, 思考 Low/High/Max, cache hint,
  更多模型…) -> catalogue sheet (search, 全部/Kimi 订阅/volcengine/zai-coding-plan tabs, meta, ✓, silver-star favourites, key caps).
  The chip shares the composer with the pocket-watch stop ring while tools run. Dossier Context now names K3.1 Pro.
  Capture: the demo cursor opens the popover at ~9.55 s and closes it at ~11.4 s. Still hash #model = t 10.4 with the popover open.
One Kimi turn on paper:
  user asks -> Kimi streams one line -> ReadFile / Grep / ReadFile run as paper "tool notes" (sticker-badge type mark, mono name +
  argument, status; the running note is traced round by ink, done notes get an ink tick) -> the three reads gather into one line
  "读取了 2 个文件 · 搜索了 1 处" (click to re-open) -> StrReplaceFile unfolds a proof sheet (diff) pinned to its note -> the sheet
  folds back -> test edit -> Shell typecheck (output folds away when it passes) -> Shell npm test fails (rose ink, paper tag) ->
  Kimi explains, fixes, re-runs -> pass -> summary line + "改动了 2 个文件 +18 −9" bar that opens a file list.
  The dossier column follows along: Plan steps tick through, Changes rows appear/update, Context creeps up.
Deterministic: every visual is a function of timeline seconds -> window.__tvframe(t).
Hooks: window.__tvCapture=true (before load) disables the page loop and shows the demo cursor; #diff / #fail / #end freeze for stills."""
import os, json, html as H

HERE = os.environ.get('KB_DIR', '.') + '/'
SRC = HERE + 'v8.html'
OUT = HERE + 'tools_v2.html'
s = open(SRC, encoding='utf-8').read()

def sub1(old, new):
    global s
    assert s.count(old) == 1, (old[:90], s.count(old))
    s = s.replace(old, new)

# ---------------------------------------------------------------- glyphs
GL = {
 'read': '<path d="M6 3.6h5.8l3.1 3.1v9.7H6z" fill="#FBFAF6"/><path d="M6 3.6h5.8l3.1 3.1v9.7H6zM11.8 3.6v3.1h3.1M8.1 9.6h4.6M8.1 11.9h4.6M8.1 14.1h3"/>',
 'grep': '<circle cx="8.6" cy="8.6" r="4.3" fill="#FBFAF6"/><circle cx="8.6" cy="8.6" r="4.3"/><path d="M11.8 11.8l3.7 3.7M6.6 8.6h4"/>',
 'shell': '<rect x="3.4" y="4.8" width="13.2" height="10.4" rx="1.6" fill="#FBFAF6"/><rect x="3.4" y="4.8" width="13.2" height="10.4" rx="1.6"/><path d="M6.4 8.6l2.1 1.5-2.1 1.5M10.2 12.4h3.6"/>',
 'edit': '<path d="M5.6 3.6h6.8l2.6 2.6v10.2H5.6z" fill="#FBFAF6"/><path d="M5.6 3.6h6.8l2.6 2.6v10.2H5.6zM8.2 8.8h4.2M10.3 6.7v4.2M8.2 13.2h4.2"/>',
}
def badge(kind, rot):
    return (f'<i class="tv-bd k-{kind}" style="--br:{rot}deg" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" '
            f'stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round">{GL[kind]}</svg></i>')
TICK = ('<svg class="tv-tk" width="15" height="15" viewBox="0 0 20 20" aria-hidden="true"><path pathLength="1" d="M3.4 10.6c1.4.9 2.6 2.3 3.5 4.1.3.5.7.5.9 0 2-4.4 5-8.2 9.1-10.8" '
        'fill="none" stroke="#56698F" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>')
CROSS = ('<svg class="tv-x" width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path pathLength="1" d="M5 5.2c3.4 3 6.4 6.3 10 9.8" fill="none" stroke="#A0667A" stroke-width="2" stroke-linecap="round"/>'
         '<path pathLength="1" d="M15 5c-3.6 3.1-6.6 6.4-10 10" fill="none" stroke="#A0667A" stroke-width="2" stroke-linecap="round"/></svg>')
CHEV = '<svg class="tv-cv" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.6l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
STACK = ('<svg width="22" height="20" viewBox="0 0 22 20" aria-hidden="true"><rect x="7.5" y="2.5" width="10" height="12.5" rx="1" transform="rotate(8 12.5 9)" fill="#F2F4F8" stroke="#8796B4" stroke-width=".9"/>'
         '<rect x="5.5" y="3.5" width="10" height="12.5" rx="1" transform="rotate(-3 10.5 10)" fill="#F8F9FB" stroke="#8796B4" stroke-width=".9"/>'
         '<rect x="4" y="5" width="10" height="12.5" rx="1" fill="#FFFEFB" stroke="#6F82AA" stroke-width=".95"/><path d="M6.3 9h5.4M6.3 11.3h5.4M6.3 13.6h3.4" stroke="#8796B4" stroke-width=".85" stroke-linecap="round"/></svg>')
# pearl-head dressmaker pin that holds the proof sheet to its note
PIN = ('<svg class="tv-pin" width="38" height="50" viewBox="0 0 30 40" aria-hidden="true"><defs><radialGradient id="tvPearl" cx=".36" cy=".32" r=".75">'
       '<stop offset="0" stop-color="#FFFDFB"/><stop offset=".5" stop-color="#F1DEE2"/><stop offset="1" stop-color="#C9A4AF"/></radialGradient>'
       '<linearGradient id="tvSteel" x1="0" x2="1"><stop offset="0" stop-color="#8A94A8"/><stop offset=".5" stop-color="#E9EDF3"/><stop offset="1" stop-color="#7C879C"/></linearGradient></defs>'
       '<g transform="translate(30 0) scale(-1 1)"><path d="M10.6 11.2 L22.6 36.6" stroke="rgba(40,52,95,.22)" stroke-width="2.2" stroke-linecap="round" transform="translate(1.6 1.4)"/>'
       '<path d="M10.6 11.2 L22.6 36.6" stroke="url(#tvSteel)" stroke-width="1.5" stroke-linecap="round"/>'
       '<circle cx="9.4" cy="9" r="6.2" fill="url(#tvPearl)" stroke="rgba(150,110,124,.45)" stroke-width=".5"/><ellipse cx="7.6" cy="6.9" rx="2" ry="1.3" fill="#fff" opacity=".85"/></g></svg>')

def status(dur, fail=False, fdesc='exit 1'):
    return (f'<span class="tv-st"><span class="s-run"><i class="tv-ink"></i>运行中</span>'
            f'<span class="s-ok">{TICK}<em>{dur}</em></span>'
            + (f'<span class="s-fail">{CROSS}<b>失败</b><em>{fdesc}</em></span>' if fail else '') + '</span>')

def esc(x): return H.escape(x, quote=False)

def diff_rows(rows):
    out = []
    for r in rows:
        k = r[0]
        if k == 'h':
            out.append(f'<div class="dh"><span>{esc(r[1])}</span><i>{esc(r[2])}</i></div>')
        elif k == 'f':
            out.append(f'<div class="dfold"><span>⋯ {r[1]} 行未改动</span></div>')
        else:
            cls = {'c': 'dc', 'a': 'da', 'd': 'dd'}[k]; sg = {'c': ' ', 'a': '+', 'd': '−'}[k]
            out.append(f'<div class="dl {cls}"><i class="ln">{r[1]}</i><b>{sg}</b><span class="cd">{esc(r[2]) or " "}</span></div>')
    return ''.join(out)

D1 = [('h', '@@ −12,7 +12,7 @@', 'createStream()'),
      ('c', 12, 'const pending: Delta[] = []'),
      ('d', 13, 'let scheduled = false'),
      ('a', 13, 'let frame = 0'),
      ('c', 14, ''),
      ('c', 15, 'export function onDelta(d: Delta) {'),
      ('d', 16, '  store.commit(d)'),
      ('d', 17, '  view.reflow()'),
      ('a', 16, '  pending.push(d)'),
      ('a', 17, '  if (!frame) frame = requestAnimationFrame(flushFrame)'),
      ('c', 18, '}'),
      ('f', 18),
      ('h', '@@ −37,5 +37,13 @@', 'onEnd()'),
      ('c', 37, 'export function onEnd(msg: Message) {'),
      ('c', 38, '  store.upsert(msg.id, msg)'),
      ('c', 39, '  view.reflow()'),
      ('c', 40, '}'),
      ('d', 41, '// TODO: 按帧合批'),
      ('a', 41, ''),
      ('a', 42, '/** 把这一帧攒下的 delta 一次提交 */'),
      ('a', 43, 'export function flushFrame() {'),
      ('a', 44, '  frame = 0'),
      ('a', 45, '  const batch = pending.splice(0)'),
      ('a', 46, '  if (!batch.length) return'),
      ('a', 47, '  store.commitMany(batch)'),
      ('a', 48, '  view.reflow()   // 一帧只重排一次'),
      ('a', 49, '}')]
D2 = [('h', '@@ −31,6 +31,8 @@', "describe('flushFrame')"),
      ('c', 31, "it('每帧只提交一次', async () => {"),
      ('d', 32, "  stream.onDelta(d('a'))"),
      ('d', 33, "  stream.onDelta(d('b'))"),
      ('a', 32, "  for (const t of 'abc') stream.onDelta(d(t))"),
      ('c', 33, '  await nextFrame()'),
      ('d', 35, '  expect(store.commit).toHaveBeenCalledTimes(2)'),
      ('a', 34, '  expect(store.commitMany).toHaveBeenCalledTimes(1)'),
      ('c', 35, '})'),
      ('a', 36, "it('结束事件并入同一帧', async () => {"),
      ('a', 37, "  stream.onDelta(d('a')); stream.onEnd(msg('m1'))"),
      ('a', 38, '  await nextFrame(); expect(view.reflow).toHaveBeenCalledTimes(1) })')]
D3 = [('h', '@@ −37,4 +37,3 @@', 'onEnd()'),
      ('c', 37, 'export function onEnd(msg: Message) {'),
      ('d', 38, '  store.upsert(msg.id, msg)'),
      ('d', 39, '  view.reflow()'),
      ('a', 38, '  pending.push(final(msg)); flushFrame()   // 并进同一帧'),
      ('c', 39, '}')]

def sheet(sid, path_dir, fname, a, d, rows):
    return (f'<div class="pf-w" id="{sid}"><div class="pf"><div class="pf-sh" aria-hidden="true"></div>'
            f'<div class="pf-tabs"><span class="pf-tab"><em>Feuillet</em><span class="p"><i>{path_dir}</i>{fname}</span></span>'
            f'<span class="n a">+{a}</span><span class="n d">−{d}</span><span class="pf-note">校 样</span></div>'
            f'<div class="pf-code">{diff_rows(rows)}</div></div>{PIN}</div>')

def note(nid, kind, rot, name, arg, dur, extra='', after='', fail=False, cls='', meta=''):
    return (f'<div class="tn {cls}" id="{nid}"><div class="tn-p"><svg class="tv-tr" aria-hidden="true"><rect class="ink"/><circle class="hb2" r="5"/><circle class="hd" r="2.1"/></svg>'
            f'<div class="tn-h" role="button" tabindex="0">{badge(kind, rot)}<b class="nm">{name}</b><span class="ar">{arg}</span>'
            f'{f"<span class=meta>{meta}</span>" if meta else ""}{status(dur, fail)}{CHEV if extra or after else ""}</div>{extra}</div>{after}</div>')

def shell_out(oid, cmd, lines):
    ls = ''.join(f'<div class="so-l {c}">{t}</div>' for c, t in lines)
    return f'<div class="so-w" id="{oid}"><div class="so"><div class="so-l cmd"><i>$</i> {esc(cmd)}</div>{ls}</div></div>'

S1L = [('', '&gt; rococo-workbench@0.1.0 typecheck'), ('', '&gt; vue-tsc --noEmit'),
       ('ok', '<span class="ok-m">✓</span> 没有类型错误<em>exit 0 · 2.1s</em>')]
S2L = [('ok', '<span class="ok-m">✓</span> tests/transcript.test.ts <em>(18)</em>'),
       ('bad', '<span class="bad-m">✕</span> tests/stream.test.ts › 结束事件并入同一帧'),
       ('bad sub', 'expected reflow to be called 1 time, but got 2'),
       ('sum bad', 'Tests  <b>1 failed</b> | 23 passed <em>(24)</em>')]
S3L = [('ok', '<span class="ok-m">✓</span> tests/transcript.test.ts <em>(18)</em>'),
       ('ok', '<span class="ok-m">✓</span> tests/stream.test.ts <em>(6)</em>'),
       ('sum ok', 'Tests  <b>24 passed</b> <em>(24)</em><em class="r">exit 0 · 1.4s</em>')]

FAILTAG = '<i class="tv-ftag" aria-hidden="true"><em>Erreur</em>· 未通过</i>'

GROUP = f'''<div class="tgrp" id="tvG">
 <div class="tg-l" id="tvGL" role="button" tabindex="0" aria-expanded="false"><i class="tg-ic">{STACK}</i><b>读取了 2 个文件 · 搜索了 1 处</b>
  <span class="tg-f">stream.ts · stream.test.ts · “flushFrame”</span><em class="tg-d">1.6s</em>{CHEV}</div>
 <div class="tg-b" id="tvGB">
  {note('tvR1', 'read', -7, 'ReadFile', 'src/renderer/stream.ts', '0.4s', meta='96 行')}
  {note('tvR2', 'grep', 5, 'Grep', '"flushFrame|commit\\(" src/renderer', '0.3s', meta='3 处匹配')}
  {note('tvR3', 'read', -4, 'ReadFile', 'tests/stream.test.ts', '0.4s', meta='58 行')}
 </div></div>'''

E1 = note('tvE1', 'edit', 6, 'StrReplaceFile', 'src/renderer/stream.ts', '0.6s', cls='ed',
          meta='<span class="n a">+12</span><span class="n d">−4</span>',
          after=sheet('tvP1', 'src/renderer/', 'stream.ts', 12, 4, D1))
E2 = note('tvE2', 'edit', -5, 'StrReplaceFile', 'tests/stream.test.ts', '0.4s', cls='ed',
          meta='<span class="n a">+5</span><span class="n d">−3</span>',
          after=sheet('tvP2', 'tests/', 'stream.test.ts', 5, 3, D2))
SH1 = note('tvS1', 'shell', -6, 'Shell', 'npm run typecheck', '2.1s', extra=shell_out('tvO1', 'npm run typecheck', S1L), cls='sh')
SH2 = note('tvS2', 'shell', 4, 'Shell', 'npm test', '3.2s', extra=shell_out('tvO2', 'npm test', S2L), after=FAILTAG, fail=True, cls='sh')
E3 = note('tvE3', 'edit', -6, 'StrReplaceFile', 'src/renderer/stream.ts', '0.3s', cls='ed',
          meta='<span class="n a">+1</span><span class="n d">−2</span>',
          after=sheet('tvP3', 'src/renderer/', 'stream.ts', 1, 2, D3))
SH3 = note('tvS3', 'shell', 6, 'Shell', 'npm test', '1.4s', extra=shell_out('tvO3', 'npm test', S3L), cls='sh')

SUM = f'''<div class="tsum" id="tvSum"><div class="ts-p">
 <div class="ts-h" role="button" tabindex="0" aria-expanded="false"><i class="ts-ic">✦</i><b>改动了 2 个文件</b><span class="n a">+18</span><span class="n d">−9</span>
  <em class="ts-bl">Bilan</em><span class="ts-v">查看</span>{CHEV}</div>
 <div class="ts-w" id="tvSL"><div class="ts-list">
  <div class="ts-r">{badge('edit', 5)}<span class="p"><i>src/renderer/</i>stream.ts</span><span class="ts-c">改了 2 次</span><span class="n a">+13</span><span class="n d">−6</span></div>
  <div class="ts-r">{badge('edit', -6)}<span class="p"><i>tests/</i>stream.test.ts</span><span class="ts-c">新增 1 条测试</span><span class="n a">+5</span><span class="n d">−3</span></div>
  <div class="ts-f"><span>撤销全部改动</span><em>retouches · 16:48</em></div>
 </div></div></div></div>'''

NEWCOL = f'''<div class="row in tv-row" id="tvRow"><div class="col">
  <div class="b tl" id="tvB1">好，按帧合批。先看一眼现在的提交路径。</div>
  {GROUP}
  <div class="b" id="tvB2">找到了：每个 delta 都直接 commit，再重排一次。改成先攒着，下一帧一次提交：</div>
  {E1}
  {E2}
  {SH1}
  {SH2}
  <div class="b" id="tvB3">有一条没过：结束事件在同一帧里又单独重排了一次。让它也走 flushFrame。</div>
  {E3}
  {SH3}
  <div class="b" id="tvB4">好了。delta 按帧合批，一帧只重排一次，结束事件也并进同一帧；测试改了 1 条、补了 1 条，24 条全部通过。</div>
  {SUM}
</div></div>'''

HISTNOTE = note('tvH0', 'read', -6, 'ReadFile', 'src/renderer/stream.ts', '0.4s', cls='hist done', meta='96 行')

STOP = '''<i class="tv-stop" id="tvStop" aria-hidden="true"><svg width="40" height="40" viewBox="-20 -20 40 40">
 <circle r="14.6" fill="none" stroke="rgba(143,161,196,.28)" stroke-width=".9"/>
 <circle id="tvStArc" r="14.6" fill="none" stroke="#7F93BC" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="20 72"/>
 <circle r="10.2" fill="rgba(249,250,253,.94)" stroke="rgba(91,108,147,.42)" stroke-width=".6"/>
 <rect x="-3.3" y="-3.3" width="6.6" height="6.6" rx="1.5" fill="#5B6C93"/></svg></i>'''

CHECK = '<svg width="15" height="15" viewBox="0 0 20 20"><path d="M3.2 10.4c1.4.9 2.6 2.4 3.6 4.3.3.5.7.5.9 0 2-4.6 5.1-8.6 9.4-11.3" fill="none" stroke="#B9A06A" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'

# streaming blossom (same as the approved v12 streaming)
PETAL = 'M0,-1.4 C-3.7,-3.1 -5.5,-7.3 -3.3,-10.1 C-2.1,-11.5 -0.8,-11.1 0,-9.9 C0.8,-11.1 2.1,-11.5 3.3,-10.1 C5.5,-7.3 3.7,-3.1 0,-1.4Z'
petals = ''.join(f'<g transform="rotate({k*72})"><g class="po"><path d="{PETAL}" fill="url(#tvPg)" stroke="rgba(166,122,138,.5)" stroke-width=".42"/>'
                 f'<path d="M0,-2.6 L0,-6.6" stroke="rgba(186,146,158,.32)" stroke-width=".38" stroke-linecap="round"/></g></g>' for k in range(5))
DEFS = '''<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
 <linearGradient id="tvPg" x1="0" y1="-1" x2="0" y2="-11" gradientUnits="userSpaceOnUse">
  <stop offset="0" stop-color="#E6C9CF"/><stop offset=".45" stop-color="#F2E1E1"/><stop offset="1" stop-color="#FCF8F2"/></linearGradient>
 <radialGradient id="tvCg" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#F4F7FB"/><stop offset=".55" stop-color="#A9B8D3"/><stop offset="1" stop-color="#7386AD"/></radialGradient>
 <radialGradient id="tvHg"><stop offset="0" stop-color="#FFF4F2" stop-opacity=".9"/><stop offset=".5" stop-color="#F3DCE0" stop-opacity=".35"/><stop offset="1" stop-color="#F3DCE0" stop-opacity="0"/></radialGradient>
</defs></svg>'''
FLOWER = f'''<div class="tv-flw" id="tvFlw" aria-hidden="true">
 <svg class="halo" width="44" height="44" viewBox="-22 -22 44 44"><circle r="21" fill="url(#tvHg)"/></svg>
 <svg class="bl" width="22" height="22" viewBox="-12 -12 24 24"><g id="tvFlRot">{petals}
  <circle r="2.35" fill="url(#tvCg)" stroke="rgba(92,108,148,.35)" stroke-width=".35"/><circle cx="-.7" cy="-.8" r=".65" fill="#fff" opacity=".75"/></g></svg></div>'''

CSS = r'''
<style id="toolsV2">
/* ===== tools v1: paper tool notes + proof-sheet diffs ===== */
:root{--ivory:#FBF8F1;--mid:#2E3A63;--slate:#5B6C93;--frame:#8796B4}
.thread{will-change:transform}
.tv-row .col{width:640px}
.tv-row .b{margin-top:0}
.tv-row .col>*+*{margin-top:12px}
.in .col>.tn.hist{margin-top:10px}.in .col>.tn.hist+.b{margin-top:10px}
.tn.done .s-ok{opacity:1}.tn.done .tv-tr{display:none}
.ch{opacity:0}.ch.on{opacity:var(--fo,1)}
/* ---------- tool note: a paper slip ---------- */
.tn{position:relative}
.tn-p{position:relative;z-index:1;border-radius:4px;overflow:hidden;
 background:
  radial-gradient(120% 80% at 88% 0,rgba(255,255,255,.8),rgba(255,255,255,0) 60%),
  linear-gradient(180deg,#FCFAF6 0,#F8F6F0 100%);
 border:1px solid rgba(135,150,180,.5);
 box-shadow:0 10px 18px -14px rgba(40,52,95,.42),0 1px 2px rgba(40,52,95,.08),inset 0 1px 0 #fff}
.tn-p::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.5;mix-blend-mode:multiply;
 background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='200'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.011 .03' numOctaves='3' seed='7'/%3E%3CfeColorMatrix values='0 0 0 0 .55 0 0 0 0 .6 0 0 0 0 .72 0 0 0 .07 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")}
/* blush margin rule, like an index card */
.tn-p::before{content:"";position:absolute;left:44px;top:0;bottom:0;width:1px;background:rgba(214,166,178,.42);pointer-events:none}
.tn-h{position:relative;z-index:1;display:flex;align-items:center;gap:9px;height:40px;padding:0 14px 0 9px;white-space:nowrap;cursor:pointer;outline:none}
.tn-h:focus-visible{box-shadow:inset 0 0 0 1.5px rgba(124,143,184,.6)}
.tn-h .nm{margin-left:9px;font-family:var(--mono);font-size:12px;font-weight:600;color:#2E3A63;letter-spacing:.01em}
.tn-h .ar{min-width:0;overflow:hidden;text-overflow:ellipsis;font-family:var(--mono);font-size:11.4px;color:rgba(40,50,85,.56)}
.tn-h .meta{display:flex;align-items:center;gap:5px;font-size:11px;letter-spacing:.08em;color:rgba(40,50,85,.42)}
.n{font-family:var(--mono);font-size:10.5px;padding:1px 6px;border-radius:7px;line-height:1.5;letter-spacing:0}
.n.a{color:#3F6B5E;background:rgba(70,125,105,.12)}.n.d{color:#95566C;background:rgba(160,90,115,.11)}
.tn-h.hov,.tn-h:hover{background:linear-gradient(90deg,rgba(124,143,184,0),rgba(124,143,184,.07) 30%,rgba(124,143,184,.07))}
/* sticker-badge type mark: die-cut white edge */
.tv-bd{flex:none;display:grid;place-items:center;width:26px;height:26px;border-radius:50%;color:#5B6C93;font-style:normal;
 transform:rotate(var(--br,0deg));box-shadow:0 0 0 2px #FFFFFF,0 2px 4px 1px rgba(40,52,95,.2)}
.tv-bd svg{display:block}
.tv-bd.k-read{background:radial-gradient(circle at 38% 30%,#F4F7FC,#DCE4F1)}
.tv-bd.k-grep{background:radial-gradient(circle at 38% 30%,#F2F6FA,#D6E1EC)}
.tv-bd.k-shell{background:radial-gradient(circle at 38% 30%,#F6F7F9,#DADFE7);color:#56627F}
.tv-bd.k-edit{background:radial-gradient(circle at 38% 30%,#FBF4F5,#EBD7DD);color:#86677A}
.tn.failed .tv-bd{background:radial-gradient(circle at 38% 30%,#FBF1F3,#EDD3DA);color:#9A6A78}
/* status */
.tv-st{position:relative;margin-left:auto;flex:none;height:20px;min-width:78px;display:flex;justify-content:flex-end;align-items:center}
.tv-st>span{position:absolute;right:0;top:0;height:20px;display:flex;align-items:center;gap:6px;opacity:0;white-space:nowrap}
.s-run{font-size:11px;letter-spacing:.2em;color:#5B6C93}
.tv-ink{position:relative;width:7px;height:7px;border-radius:50%;background:#6F82AA}
.tv-ink::after{content:"";position:absolute;inset:-5px;border-radius:50%;background:radial-gradient(closest-side,rgba(111,130,170,.35),rgba(111,130,170,0));transform:scale(var(--hb,1))}
.s-ok em,.s-fail em{font-family:"CormI",serif;font-style:italic;font-size:13px;color:rgba(46,58,99,.5);letter-spacing:.02em}
.s-fail b{font-weight:600;font-size:11.5px;letter-spacing:.2em;color:#9A5A70}
.s-fail em{color:rgba(154,90,112,.7)}
.tv-tk path,.tv-x path{stroke-dasharray:1 1;stroke-dashoffset:var(--dk,0)}
.tv-x path+path{stroke-dashoffset:var(--dk2,0)}
.tv-cv{flex:none;color:rgba(70,85,120,.5);transform:rotate(var(--cv,0deg));margin-left:-2px}
/* the running note is traced round by ink */
.tv-tr{position:absolute;left:0;top:0;width:100%;height:100%;z-index:2;pointer-events:none;overflow:visible}
.tv-tr rect{x:.6px;y:.6px;width:calc(100% - 1.2px);height:calc(100% - 1.2px);rx:3.4px;fill:none}
.tv-tr .hd{fill:#4E618C;opacity:0}.tv-tr .hb2{fill:rgba(90,110,155,.22);opacity:0}
.tv-tr .ink{stroke:#55689A;stroke-width:1.7;stroke-linecap:round;stroke-dasharray:0 100;opacity:0}
.tn.failed .tn-p{border-color:rgba(170,110,130,.55);background:radial-gradient(120% 80% at 88% 0,rgba(255,255,255,.7),rgba(255,255,255,0) 60%),linear-gradient(180deg,#FCF8F6,#F8F1F0)}
.tn.failed .tn-p::before{background:rgba(196,128,150,.6)}
/* ---------- shell output: a receipt strip inside the note ---------- */
.so-w{position:relative;z-index:1;overflow:hidden;height:0}
.so{margin:0 12px 11px 53px;padding:7px 12px 8px;border-radius:3px;background:linear-gradient(180deg,rgba(236,240,246,.75),rgba(242,244,248,.55));
 box-shadow:inset 1.5px 0 0 rgba(135,150,180,.55);font-family:var(--mono);font-size:11.2px;line-height:19px;color:#4A5474}
.so-l{white-space:pre;height:19px;overflow:hidden}
.so-l.cmd{color:#2E3A63}.so-l.cmd i{font-style:normal;color:#8796B4;margin-right:4px}
.so-l em{font-family:"CormI",serif;font-style:italic;font-size:12.5px;color:rgba(46,58,99,.5);margin-left:6px}
.so-l em.r{float:right}
.so-l .ok-m{color:#4C7A69;margin-right:3px}.so-l.ok{color:#3F5A57}
.so-l.bad{color:#94566C}.so-l .bad-m{color:#A0607A;margin-right:3px}
.so-l.sub{padding-left:22px;color:rgba(148,86,108,.78)}
.so-l.sum b{font-weight:600}.so-l.sum.ok b{color:#3F6B5E}.so-l.sum.bad b{color:#94566C}
.tn.failed .so{background:linear-gradient(180deg,rgba(246,232,236,.75),rgba(248,240,242,.5));box-shadow:inset 1.5px 0 0 rgba(196,128,150,.6)}
.tv-ftag{position:absolute;right:26px;top:-12px;z-index:3;display:flex;align-items:baseline;gap:5px;height:19px;padding:0 9px 0 8px;white-space:nowrap;
 font-style:normal;font-size:10.5px;letter-spacing:.18em;color:#86606F;opacity:0;transform-origin:100% 0;height:21px;
 background:linear-gradient(180deg,#FFFDF8,#F8EEEC);box-shadow:inset 2px 0 0 rgba(214,150,170,.6),inset 0 0 0 .6px rgba(166,122,138,.38),0 3px 5px -3px rgba(40,52,95,.35);border-radius:1px}
.tv-ftag em{font-family:"Pinyon",serif;font-style:normal;font-size:15.5px;letter-spacing:0;color:#946A7C;line-height:21px}
.tv-row .col>#tvS2{margin-top:20px}
.tn.sh .tn-h .tv-st{margin-left:auto}
/* ---------- proof sheet (diff) pinned to its note ---------- */
.pf-w{position:relative;z-index:2;height:0;margin-left:30px;margin-right:-4px;perspective:1100px}
.pf-w.on{overflow:visible}
.pf{position:relative;margin-top:3px;padding:10px 12px 12px;border-radius:3px;transform-origin:50% 0;
 background:
  radial-gradient(110% 60% at 90% 0,rgba(255,255,255,.85),rgba(255,255,255,0) 60%),
  linear-gradient(180deg,#FDFBF7,#F8F6F1);
 border:1px solid rgba(135,150,180,.45);
 box-shadow:0 18px 28px -20px rgba(40,52,95,.45),0 2px 4px rgba(40,52,95,.08),inset 0 1px 0 #fff}
.pf::after{content:"";position:absolute;inset:4px;border:1px solid rgba(135,150,180,.2);border-radius:2px;pointer-events:none}
.pf-sh{position:absolute;inset:0;z-index:5;border-radius:3px;pointer-events:none;opacity:0;
 background:linear-gradient(180deg,rgba(60,72,110,.0),rgba(60,72,110,.22))}
.pf-tabs{position:relative;display:flex;align-items:center;gap:7px;height:24px;margin:0 2px 8px}
.pf-tab{position:relative;display:flex;align-items:baseline;gap:8px;height:24px;padding:0 13px 0 11px;margin-top:-14px;border-radius:4px 4px 0 0;
 background:linear-gradient(180deg,#F0F3F8,#FBFAF6);box-shadow:inset 1px 1px 0 rgba(135,150,180,.38),inset -1px 0 0 rgba(135,150,180,.38);align-items:center}
.pf-tab em{font-family:"Pinyon",serif;font-style:normal;font-size:15px;color:#7C8FB8;line-height:1}
.pf-tab .p{font-family:var(--mono);font-size:11.4px;color:#2E3A63}.pf-tab .p i{font-style:normal;color:rgba(40,50,85,.42)}
.pf-tabs .n{margin-top:-6px}
.pf-note{margin-left:auto;margin-right:34px;margin-top:-6px;font-size:10px;letter-spacing:.4em;color:rgba(46,58,99,.4)}
.pf-code{border:1.6px solid #8796B4;border-radius:14px;box-shadow:inset 0 0 0 4px #F8FAFD;background:linear-gradient(180deg,#FCFBF7,#F5F4F0);
 padding:9px 8px 10px;font-family:var(--mono);font-size:11.4px;line-height:19px;color:#36405E}
.dl{display:grid;grid-template-columns:30px 15px 1fr;align-items:center;height:19px;border-radius:4px;white-space:pre}
.dl .ln{font-family:"CormI",serif;font-style:italic;font-size:12.5px;text-align:right;padding-right:7px;color:rgba(70,85,125,.48)}
.dl b{font-weight:400;color:rgba(54,64,94,.32);text-align:center}
.dl .cd{overflow:hidden;text-overflow:ellipsis}
.dd{background:rgba(196,122,146,.10);color:#8E5468}.dd b{color:#A06A7C}.dd .ln{color:rgba(160,96,120,.55)}
.dd .cd{text-decoration:line-through;text-decoration-thickness:.8px;text-decoration-color:rgba(142,84,104,.42)}
.da{background:rgba(112,156,136,.12);color:#3D6A5C}.da b{color:#5E8A7B}.da .ln{color:rgba(70,120,100,.6)}
.dh{display:flex;gap:10px;align-items:center;height:19px;padding-left:12px;color:rgba(54,64,94,.4);font-size:10.8px}
.dh i{font-family:"CormI",serif;font-size:12.5px;color:#A0708A;opacity:.85}
.dh+.dl,.dfold+.dh{margin-top:1px}
.dfold{display:flex;align-items:center;gap:10px;height:24px;margin:3px 0;padding:0 14px;color:rgba(70,85,125,.5);font-family:var(--serif);font-size:11px;letter-spacing:.14em}
.dfold::before,.dfold::after{content:"";flex:1;height:0;border-top:1px dashed rgba(135,150,180,.45)}
.dfold span{flex:none}
.tv-pin{position:absolute;right:-2px;top:-21px;z-index:6;pointer-events:none;opacity:0}
/* ---------- the gathered reads ---------- */
.tgrp{position:relative}
.tg-b{position:relative}
.tg-b .tn+.tn{margin-top:8px}
.tg-l{position:absolute;left:0;right:0;top:0;z-index:4;display:flex;align-items:center;gap:9px;height:38px;padding:0 14px 0 12px;white-space:nowrap;cursor:pointer;outline:none;opacity:0;pointer-events:none;
 border-radius:4px;background:linear-gradient(180deg,#FCFAF6,#F6F4EF);border:1px solid rgba(135,150,180,.5);
 box-shadow:0 1px 0 #fff inset,0 2px 0 -1px #F3F1EC,0 3px 0 -1px rgba(135,150,180,.35),0 5px 0 -2px #F1EFEA,0 6px 0 -2px rgba(135,150,180,.28),0 10px 14px -10px rgba(40,52,95,.35)}
.tg-l .tg-ic{flex:none;display:grid;place-items:center;width:24px;height:22px}
.tg-l b{font-weight:600;font-size:12.6px;letter-spacing:.12em;color:#3E4F7A}
.tg-l .tg-f{min-width:0;overflow:hidden;text-overflow:ellipsis;font-family:var(--mono);font-size:10.8px;color:rgba(40,50,85,.42)}
.tg-l .tg-d{margin-left:auto;font-family:"CormI",serif;font-size:13px;color:rgba(46,58,99,.45)}
.tg-l.hov,.tg-l:hover{background:linear-gradient(180deg,#FFFFFF,#F7F6F2)}
/* ---------- summary bar ---------- */
.tsum{position:relative}
.ts-p{position:relative;border-radius:4px;overflow:hidden;background:linear-gradient(180deg,#FCFAF5,#F6F3EC);border:1px solid rgba(135,150,180,.5);
 box-shadow:0 12px 20px -16px rgba(40,52,95,.45),0 1px 2px rgba(40,52,95,.08),inset 0 1px 0 #fff}
.ts-p::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,#D9C796,#C8B27C)}
.ts-h{display:flex;align-items:center;gap:9px;height:42px;padding:0 14px 0 18px;white-space:nowrap;cursor:pointer;outline:none}
.ts-h .ts-ic{font-style:normal;font-size:12px;color:#B9A06A;text-shadow:0 0 6px rgba(255,244,214,.9)}
.ts-h b{font-weight:600;font-size:13px;letter-spacing:.14em;color:#2E3A63}
.ts-bl{margin-left:auto;font-family:"Pinyon",serif;font-style:normal;font-size:17px;color:#8C9DC0;line-height:1}
.ts-v{font-size:11px;letter-spacing:.24em;color:rgba(70,85,120,.6)}
.ts-h.hov,.ts-h:hover{background:linear-gradient(90deg,rgba(124,143,184,0),rgba(124,143,184,.07))}
.ts-w{overflow:hidden;height:0}
.ts-list{margin:0 14px 12px 18px;border-top:1px dashed rgba(135,150,180,.45);padding-top:6px}
.ts-r{display:flex;align-items:center;gap:10px;height:34px;padding:0 4px}
.ts-r .tv-bd{width:20px;height:20px;box-shadow:0 0 0 1.6px #fff,0 1px 3px rgba(40,52,95,.2)}
.ts-r .tv-bd svg{width:15px;height:15px}
.ts-r .p{font-family:var(--mono);font-size:11.6px;color:#2E3A63}.ts-r .p i{font-style:normal;color:rgba(40,50,85,.42)}
.ts-r .ts-c{margin-left:auto;font-size:11px;letter-spacing:.1em;color:rgba(40,50,85,.45)}
.ts-f{display:flex;align-items:center;justify-content:space-between;margin-top:4px;padding:6px 4px 0;border-top:1px solid rgba(135,150,180,.18);font-size:11px;letter-spacing:.16em;color:rgba(70,85,120,.55)}
.ts-f em{font-family:"CormI",serif;font-size:12.5px;letter-spacing:.02em;color:rgba(46,58,99,.4)}
/* ---------- dossier: changes rows ---------- */
.fx.tv-fx{overflow:hidden;max-height:0;opacity:0;padding:0}
.fx .tv-num{display:inline-block}
.tv-none{font-family:"CormI",serif;font-style:italic;font-size:13px;color:rgba(46,58,99,.45);padding:4px 0;overflow:hidden}
.tv-none span{font-family:var(--serif);font-style:normal;font-size:11px;letter-spacing:.24em;margin-left:8px}
.tv-tot{display:flex;justify-content:flex-end;align-items:center;gap:6px;padding-top:4px;font-family:"CormI",serif;font-style:italic;font-size:12.5px;color:rgba(46,58,99,.45);overflow:hidden}
.tv-tot .n{font-style:normal}
.td{position:relative}
/* ---------- composer clock: stop ring while Kimi works ---------- */
.send .tv-stop{position:absolute;left:50%;top:57%;width:40px;height:40px;margin:-20px 0 0 -20px;z-index:3;pointer-events:none;opacity:0}
.send .tv-stop svg{display:block!important}
.send .sl{transition:none}.send .sl.s1{opacity:0}
/* ---------- streaming blossom ---------- */
.tv-flw{position:fixed;left:0;top:0;width:0;height:0;z-index:30;pointer-events:none;opacity:0;will-change:transform,opacity}
.tv-flw svg{position:absolute;left:0;top:0;overflow:visible}
.tv-flw .bl{width:20px;height:20px;margin:-10px 0 0 -10px;filter:drop-shadow(0 1.4px 1.6px rgba(56,68,108,.26))}
.tv-flw .halo{margin:-22px 0 0 -22px;opacity:.55}
/* controlled collage stickers on new Kimi paper (outside the text) */
.rnd.tv-stk{z-index:5}
#tvCur{position:fixed;left:0;top:0;z-index:99999;pointer-events:none;width:22px;height:26px;opacity:0;will-change:transform}
@media (prefers-reduced-motion:reduce){.tv-flw .halo{display:none}}
</style>
'''

JS = r'''<script>
(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)');
const $=id=>document.getElementById(id);
const b=document.body,thread=document.querySelector('.thread'),scrollEl=document.querySelector('.scroll');
/* ---- v8 transcript surgery: the earlier read becomes a paper note, the half-done edit leaves (Kimi only proposed it) ---- */
const oldTools=[...thread.querySelectorAll('.tool')];
const rf=oldTools[0];rf.insertAdjacentHTML('afterend',window.__tvHist);const hn=rf.nextElementSibling;
[...rf.querySelectorAll('.rnd')].forEach(im=>hn.appendChild(im));rf.remove();
oldTools.slice(1).forEach(e=>e.remove());
const typ=thread.querySelector('.typing').closest('.row');typ.insertAdjacentHTML('afterend',window.__tvCol);typ.remove();
const uRow=[...thread.querySelectorAll('.row.out')].pop();
/* ---- dossier: this turn's plan, empty changes, context ---- */
const tds=[...document.querySelectorAll('.folio .td')];
const PLAN=['读 stream.ts，找到提交入口','delta 缓冲，按帧合批提交','补帧合批测试','类型检查与测试全绿'];
tds.forEach((e,k)=>{e.querySelector('.tx').textContent=PLAN[k]});
const planH=[...document.querySelectorAll('.folio .sec h5 small')].find(e=>/ of iv/.test(e.textContent));
const leaves=[...document.querySelectorAll('.folio .sec h5 small')].find(e=>e.textContent.includes('leaves'));
const fx0=[...document.querySelectorAll('.folio .fx')];const fxSec=fx0[0].parentNode;fx0.forEach(e=>e.remove());
fxSec.insertAdjacentHTML('beforeend','<div class="tv-none" id="tvNone">rien encore<span>尚无改动</span></div>'+
 '<div class="fx tv-fx" id="tvFxA"><span class="p"><em>src/renderer/</em>stream.ts</span><span class="n a tv-num" id="tvFxAa">+12</span><span class="n d tv-num" id="tvFxAd">−4</span></div>'+
 '<div class="fx tv-fx" id="tvFxB"><span class="p"><em>tests/</em>stream.test.ts</span><span class="n a">+5</span><span class="n d">−3</span></div>'+
 '<div class="tv-tot" id="tvTot">total <span class="n a" id="tvTa">+12</span><span class="n d" id="tvTd">−4</span></div>');
const pcEl=document.querySelector('.folio .ctxp .pc'),ofEl=document.querySelector('.folio .ctxp .of'),grI=document.querySelector('.folio .ctxp .groove i'),grB=document.querySelector('.folio .ctxp .gauge b');
/* ---- composer: stop ring over the pocket watch while Kimi works ---- */
const send=document.querySelector('.send'),sl0=send.querySelector('.sl');
sl0.insertAdjacentHTML('afterend','<span class="sl s1">Stopper</span>'+window.__tvStop);const sl1=send.querySelector('.sl.s1');
const stopI=$('tvStop'),stArc=$('tvStArc');
/* ---- demo cursor (capture only) ---- */
const cur=document.createElement('div');cur.id='tvCur';
cur.innerHTML='<svg width="22" height="26" viewBox="0 0 22 26"><path d="M3 2 L3 20.5 L7.6 16.3 L10.9 23.6 L14 22.2 L10.8 15.1 L17 14.6 Z" fill="#FBFAF6" stroke="#3E4C76" stroke-width="1.25" stroke-linejoin="round" style="filter:drop-shadow(0 1.5px 1.5px rgba(30,40,70,.35))"/></svg>';
b.appendChild(cur);

/* ---- controlled stickers for the new paper: picked once at load from the page's collage pool, kept off Kimi's text ---- */
(()=>{const pool=[...new Set([...document.querySelectorAll('.thread .rnd')].map(i=>i.src))];if(!pool.length)return;
 const R=(a,z)=>a+Math.random()*(z-a);const pick=()=>pool.splice(Math.floor(Math.random()*pool.length),1)[0]||pool[0];
 const put=(el,side,w)=>{const im=new Image();im.src=pick();im.className='rnd tv-stk';im.style.width=w+'px';im.style.setProperty('--r',R(-16,16).toFixed(1)+'deg');
  im.style[side]=(-w*R(.8,.9)).toFixed(0)+'px';im.style.top=(-w*R(.15,.35)).toFixed(0)+'px';el.appendChild(im)};
 put($('tvG'),'left',Math.round(R(38,46)));put($('tvSum'),'right',Math.round(R(42,52)))})();

/* ---- guard: random collage stickers may sit on the user's bubbles, never on Kimi's words ---- */
const guard=()=>{document.querySelectorAll('.thread .row.in .rnd:not(.tv-stk)').forEach(im=>{const el=im.parentNode;if(!el||!im.offsetWidth)return;
  const er=el.getBoundingClientRect();const rs=[];const tw=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
  while(tw.nextNode()){const n=tw.currentNode;if(!n.data.trim())continue;const rg=document.createRange();rg.selectNodeContents(n);
    for(const q of rg.getClientRects())if(q.width>0)rs.push({l:q.left-er.left-4,r:q.right-er.left+4,t:q.top-er.top-3,b:q.bottom-er.top+3})}
  const sh=.1*im.offsetWidth;let L=im.offsetLeft+sh,Rr=im.offsetLeft+im.offsetWidth-sh;const Tt=im.offsetTop+sh,Bb=im.offsetTop+im.offsetHeight-sh;
  const hit=rs.filter(q=>q.r>L&&q.l<Rr&&q.b>Tt&&q.t<Bb);if(!hit.length)return;
  const left=im.style.left!=='';
  if(left){const need=Rr-Math.min(...hit.map(q=>q.l));im.style.left=(parseFloat(im.style.left)-need).toFixed(0)+'px'}
  else{const need=Math.max(...hit.map(q=>q.r))-L;im.style.right=(parseFloat(im.style.right)-need).toFixed(0)+'px'}})};
window.__tvGuard=guard;
/* ---- element handles ---- */
const B=[1,2,3,4].map(k=>$('tvB'+k));
const NT=id=>{const el=$(id),p=el.querySelector('.tn-p');return {el,p,h:el.querySelector('.tn-h'),ink:el.querySelector('.tv-tr .ink'),
  run:el.querySelector('.s-run'),ok:el.querySelector('.s-ok'),fail:el.querySelector('.s-fail'),tk:el.querySelector('.tv-tk'),x:el.querySelector('.tv-x'),
  hb:el.querySelector('.tv-ink'),meta:el.querySelector('.tn-h .meta'),cv:el.querySelector('.tv-cv'),pf:el.querySelector('.pf-w'),so:el.querySelector('.so-w'),tag:el.querySelector('.tv-ftag')}};
const R1=NT('tvR1'),R2=NT('tvR2'),R3=NT('tvR3'),E1=NT('tvE1'),E2=NT('tvE2'),S1=NT('tvS1'),S2=NT('tvS2'),E3=NT('tvE3'),S3=NT('tvS3');
const G=$('tvG'),GL=$('tvGL'),GB=$('tvGB'),SUM=$('tvSum'),SH=SUM.querySelector('.ts-h'),SW=$('tvSL'),scv=SH.querySelector('.tv-cv');
const fxA=$('tvFxA'),fxB=$('tvFxB'),fxAa=$('tvFxAa'),fxAd=$('tvFxAd'),none=$('tvNone'),tot=$('tvTot'),tA=$('tvTa'),tD=$('tvTd');
const CHIP=$('mchip'),flw=$('tvFlw'),flRot=$('tvFlRot'),pos=[...flw.querySelectorAll('.po')];

/* ---- character streaming (seeded chunks, ink settle) — as in the approved streaming state ---- */
const wrap=root=>{const out=[];const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const ns=[];while(tw.nextNode())ns.push(tw.currentNode);
  ns.forEach(n=>{const f=document.createDocumentFragment();for(const c of n.data){const e=document.createElement('span');e.className='ch';e.textContent=c;f.appendChild(e);out.push({el:e,c})}
   n.parentNode.replaceChild(f,n)});return out};
let seed=20261427;const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const sched=(chars,a,z)=>{let t=0,i=0;const P='，。：；！？、';
  while(i<chars.length){const n=P.includes(chars[i].c)?1:(rnd()<.45?1:(rnd()<.7?2:3));const d=n*.034;
    for(let k=0;k<n&&i<chars.length;k++,i++)chars[i].a=t+d*(k+1)/n;
    t+=d+n*.022*(.7+rnd()*.8)+(P.includes(chars[i-1].c)?.2:0)+(rnd()<.08?.15:0)}
  const end=chars[chars.length-1].a;chars.forEach(c=>c.a=a+(c.a/end)*(z-a))};
const C=B.map(wrap);

/* ---- timeline (s) ---- */
const T={u:.15,
 b1:.8,c1a:.9,c1z:1.75,
 r1:1.9,r1d:2.45, r2:2.55,r2d:3.0, r3:3.1,r3d:3.55, gf0:3.75,gf1:4.3,
 b2:4.35,c2a:4.45,c2z:5.5,
 e1:5.6,e1d:6.2, p1o0:6.25,p1o1:6.95, p1c0:8.35,p1c1:8.8,
 e2:8.9,e2d:9.35,
 s1:9.45,s1l:[9.62,9.8,10.15],s1d:10.15, s1f0:10.55,s1f1:10.95,
 s2:10.6,s2l:[10.85,11.15,11.38,11.6],s2d:11.6,
 b3:12.25,c3a:12.35,c3z:13.25,
 e3:13.35,e3d:13.75,
 s3:13.85,s3l:[14.05,14.3,14.6],s3d:14.6,
 b4:14.8,c4a:14.9,c4z:16.0,
 sum:16.1, so0:16.75,so1:17.2, mp0:9.56,mp1:11.42, END:18.0};
sched(C[0],T.c1a,T.c1z);sched(C[1],T.c2a,T.c2z);sched(C[2],T.c3a,T.c3z);sched(C[3],T.c4a,T.c4z);
const cl=u=>Math.max(0,Math.min(1,u)),eo=u=>1-Math.pow(1-cl(u),3),eio=u=>{u=cl(u);return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2},sm=u=>{u=cl(u);return u*u*(3-2*u)};
const spring=(z,w,t)=>{if(t<=0)return 1;const wd=w*Math.sqrt(1-z*z);return Math.exp(-z*w*t)*(Math.cos(wd*t)+(z*w/wd)*Math.sin(wd*t))};
let lastT=-1,userMode=false;

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
const arrive=(el,t,t0,dur=.5,dy=18)=>{
  if(t<t0){if(el.style.display!=='none')el.style.display='none';return false}
  if(el.style.display==='none')el.style.display='';const u=(t-t0)/dur;
  if(RM.matches){el.style.opacity=cl(u*2.5).toFixed(3);el.style.transform='none';return true}
  if(u>=1.6){el.style.opacity='';el.style.transform='';return true}
  const y=dy*spring(.8,11,(t-t0)),r=-.5*spring(.5,13,(t-t0));
  el.style.opacity=cl(u*1.9).toFixed(3);el.style.transform=`translateY(${y.toFixed(2)}px) rotate(${r.toFixed(3)}deg)`;return true};

/* ---- measurement (natural heights of everything that folds) ---- */
const M={};
const measure=()=>{const hidden=[...document.querySelectorAll('#tvRow .col>*, #tvGB .tn')].filter(e=>e.style.display==='none');hidden.forEach(e=>e.style.display='');
  const ws=[...document.querySelectorAll('#tvRow .pf-w, #tvRow .so-w, #tvSL, #tvGB')];const hs=ws.map(w=>w.style.height);ws.forEach(w=>w.style.height='auto');
  M.p1=E1.pf.firstElementChild.offsetHeight+3;M.p2=E2.pf.firstElementChild.offsetHeight+3;M.p3=E3.pf.firstElementChild.offsetHeight+3;
  M.sl=SW.firstElementChild.offsetHeight+12;M.gb=GB.offsetHeight;M.nt=R1.el.offsetHeight;
  [S1,S2,S3].forEach(S=>{const so=S.so.firstElementChild;S._pad=so.offsetHeight-so.children.length*19+11;S._n=so.children.length});
  ws.forEach((w,k)=>w.style.height=hs[k]);hidden.forEach(e=>e.style.display='none')};

/* ---- user toggles (live only): openness glides from where it was ---- */
const TG={};let NOW=0;
const open=(key,auto)=>{const g=TG[key];let v=auto;if(g){const u=RM.matches?1:eio((NOW-g.t0)/.5);v=g.from+(g.to-g.from)*u}TG['_'+key]=v;return v};
const toggle=key=>{const v=TG['_'+key]||0;TG[key]={from:v,to:v>.5?0:1,t0:NOW};userMode=true};

/* ---- tool note state ---- */
const runP=(t,t0,td)=>t<td?92*(1-Math.exp(-3*(t-t0)/Math.max(.2,td-t0))):92+8*eo((t-td)/.22);
const noteFrame=(N,t,t0,td,fail)=>{
  const on=arrive(N.el,t,t0,.42,14);if(!on)return false;const rm=RM.matches;
  const running=t<td,done=!running;
  N.el.classList.toggle('failed',!!fail&&done);
  // ink trace round the slip
  const p=runP(t,t0,td),fade=done?cl((t-td-.22)/.4):0;
  const per=2*(N.p.offsetWidth+N.p.offsetHeight);
  if(rm){N.ink.style.opacity=running?.9:0;N.ink.style.strokeDasharray=per+' 0'}
  else{N.ink.style.strokeDasharray=`${(p/100*per).toFixed(1)} ${((100-p)/100*per+1).toFixed(1)}`;N.ink.style.opacity=((running?cl((t-t0)/.15):1-fade)*.85).toFixed(3);
   N.ink.style.stroke=fail&&done?'#B07A8C':'#6A7EA8'}
  if(N.meta)N.meta.style.opacity=done?(rm?1:cl((t-td-.1)/.35)).toFixed(3):0;
  // ink head: a small wet drop at the leading end of the line
  const hd=N.el._hd||(N.el._hd=N.el.querySelector('.tv-tr .hd')),hb2=N.el._hb2||(N.el._hb2=N.el.querySelector('.tv-tr .hb2'));
  if(!rm&&running){const w=N.p.offsetWidth-1.2,h=N.p.offsetHeight-1.2;let d=p/100*per%(2*(w+h)),x,y;
    if(d<w){x=d;y=0}else if((d-=w)<h){x=w;y=d}else if((d-=h)<w){x=w-d;y=h}else{d-=w;x=0;y=h-d}
    x+=.6;y+=.6;const o=cl((t-t0)/.15);[hd,hb2].forEach(c=>{c.setAttribute('cx',x.toFixed(1));c.setAttribute('cy',y.toFixed(1));c.style.opacity=o.toFixed(3)});
    hb2.setAttribute('r',(4.2+1.2*Math.sin((t-t0)*2*Math.PI/1.3)).toFixed(2))}
  else{hd.style.opacity=0;hb2.style.opacity=0}
  // status
  N.run.style.opacity=running?1:(rm?0:(1-cl((t-td)/.15)).toFixed(3));
  if(N.hb&&running){const k=.5+.5*Math.sin((t-t0)*2*Math.PI/1.3);N.hb.style.setProperty('--hb',(rm?1:.75+.5*k).toFixed(3));N.hb.style.opacity=rm?1:(.65+.35*k).toFixed(3)}
  const st=fail?N.fail:N.ok;const oth=fail?N.ok:N.fail;if(oth)oth.style.opacity=0;
  if(done){const u=rm?1:cl((t-td)/.3);st.style.opacity=cl(u*3).toFixed(3);
    if(!fail)N.tk.style.setProperty('--dk',(1-eo(u)).toFixed(3));
    else{N.x.style.setProperty('--dk',(1-eo(u*1.8)).toFixed(3));N.x.style.setProperty('--dk2',(1-eo(u*1.8-.8)).toFixed(3))}}
  else st.style.opacity=0;
  return true};
/* fold helpers */
const flip=(W,inner,Hn,u,pin)=>{const rm=RM.matches,pf=W.firstElementChild,sh=pf.querySelector('.pf-sh');
  if(u<=0.0005){W.style.height='0px';W.style.visibility='hidden';W.classList.remove('on');if(pin)pin.style.opacity=0;return}
  W.style.visibility='';W.classList.add('on');
  if(rm){W.style.height=(u>.5?Hn:0)+'px';pf.style.transform='none';pf.style.opacity=u>.5?1:0;sh.style.opacity=0;if(pin)pin.style.opacity=u>.5?1:0;return}
  const a=-82*(1-eo(u));W.style.height=(Hn*Math.cos(a*Math.PI/180)*cl(u*4)).toFixed(2)+'px';pf.style.transform=`rotateX(${a.toFixed(2)}deg) translateY(${(-6*(1-u)).toFixed(2)}px)`;pf.style.opacity=cl(u*4).toFixed(3);
  sh.style.opacity=(.9*(1-sm(u))).toFixed(3);
  if(pin){const pu=cl((u-.55)/.45);pin.style.opacity=cl(pu*3).toFixed(3);pin.style.transform=`translate(${(6*(1-eo(pu))).toFixed(2)}px,${(-9*(1-eo(pu))).toFixed(2)}px) rotate(${(14*(1-eo(pu))).toFixed(2)}deg)`}};
const shellOut=(S,t,lt,fold)=>{let h=0;const ls=S.so.firstElementChild.children;
  // the command line shows with the note; output lines come in one by one
  [0,...lt].forEach((a,k)=>{const el=ls[k];if(!el)return;const at=k===0?a:a;const u=k===0?1:(RM.matches?(t>=at?1:0):eo((t-at)/.2));
    el.style.opacity=(k===0?1:cl(u*1.6)).toFixed(3);el.style.transform=`translateX(${(-4*(1-u)).toFixed(2)}px)`;h+=19*(k===0?1:u)});
  const full=S._pad+h-0;return full*(1-fold)};

/* ---- thread follower ---- */
let sc=-1;
const target=()=>{const ch=[...$('tvRow').querySelector('.col').children].filter(e=>e.style.display!=='none');let lastEl=ch[ch.length-1];if(!lastEl){const rows=[...thread.querySelectorAll('.row')].filter(e=>e.style.display!=='none'&&e.offsetHeight>0);lastEl=rows[rows.length-1]}
  const bot=lastEl.getBoundingClientRect().bottom+Math.max(0,sc);const vb=scrollEl.getBoundingClientRect().bottom-70;return Math.max(0,bot-vb)};
/* ---- demo cursor waypoints (evaluated live) ---- */
const ctr=(el,fx=.5,fy=.5)=>{const r=el.getBoundingClientRect();return [r.left+r.width*fx,r.top+r.height*fy]};
const off=(p,dx,dy)=>[p[0]+dx,p[1]+dy];
const WP=[[0,()=>[1010,640]],[7.3,()=>[1010,640]],[7.95,()=>ctr(E1.h,.42,.55)],[8.4,()=>ctr(E1.h,.42,.55)],[9.1,()=>[1010,560]],
  [9.45,()=>ctr(CHIP,.5,.55)],[9.65,()=>ctr(CHIP,.5,.55)],[10.3,()=>ctr(document.querySelector('.mp-row.on')||CHIP,.35,.55)],[10.75,()=>ctr(document.querySelector('.mp-row.on')||CHIP,.35,.55)],[11.25,()=>ctr(CHIP,.5,.55)],[11.45,()=>ctr(CHIP,.5,.55)],[11.9,()=>[1010,560]],
  [15.9,()=>[1010,560]],[16.5,()=>ctr(SH,.32,.55)],[16.95,()=>ctr(SH,.32,.55)],[17.5,()=>off(ctr(SH,.32,.55),70,60)],[18,()=>off(ctr(SH,.32,.55),70,60)]];
const curAt=t=>{for(let i=0;i<WP.length-1;i++){const [a,fa]=WP[i],[z,fz]=WP[i+1];if(t>=a&&t<=z){const p=fa(),q=fz();const u=eio((t-a)/(z-a));return [p[0]+(q[0]-p[0])*u,p[1]+(q[1]-p[1])*u]}}return WP[WP.length-1][1]()};
const inside=(el,x,y)=>{const r=el.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom};
const roman=['i','ii','iii','iv'];

const frame=t=>{if(!M.p1)measure();const rm=RM.matches;
  if(t<lastT-.001)sc=-1;
  /* user bubble */
  if(t<T.u){uRow.style.display='none'}else{uRow.style.display='';const u=(t-T.u)/.45;
    if(rm){uRow.style.opacity=cl(u*2.5)}else{uRow.style.opacity=cl(u*1.9).toFixed(3);uRow.style.transform=u>=1.6?'':`translateY(${(16*spring(.8,11,t-T.u)).toFixed(2)}px)`}}
  /* Kimi bubbles */
  arrive(B[0],t,T.b1,.4);const l1=charFrame(C[0],t);
  /* reads + gather */
  arrive(G,t,T.r1,.42,14);
  noteFrame(R1,t,T.r1,T.r1d);noteFrame(R2,t,T.r2,T.r2d);noteFrame(R3,t,T.r3,T.r3d);
  const g=open('grp',t>=T.gf0?(rm?(t>=T.gf1?1:0):eio((t-T.gf0)/(T.gf1-T.gf0))):0); // g: 1 = gathered
  const ns=[R1,R2,R3],step=M.nt+8;
  if(g<=0.0005){GB.style.height='';GL.style.opacity=0;GL.style.pointerEvents='none';ns.forEach(N=>{if(N.el.style.display!=='none'){N.el.style.transform=N.el.style.transform||''}});GL.setAttribute('aria-expanded','true');GL.querySelector('.tv-cv').style.setProperty('--cv','180deg')}
  else{GB.style.height=(M.gb+(38-M.gb)*g).toFixed(2)+'px';
    ns.forEach((N,k)=>{if(N.el.style.display==='none')return;const y=-k*step*g,r=rm?0:(k===1?-1.1:k===2?1.4:0)*Math.sin(Math.PI*cl(g*1.15));
      N.el.style.transform=`translateY(${y.toFixed(2)}px) rotate(${r.toFixed(3)}deg) scale(${(1-.015*k*g).toFixed(4)})`;N.el.style.opacity=(1-cl((g-.45)/.4)).toFixed(3);N.el.style.zIndex=3-k});
    GL.style.opacity=cl((g-.55)/.4).toFixed(3);GL.style.pointerEvents=g>.9?'auto':'none';GL.setAttribute('aria-expanded',g>.5?'false':'true');
    GL.querySelector('.tv-cv').style.setProperty('--cv',`${(180*(1-g)).toFixed(1)}deg`)}
  arrive(B[1],t,T.b2,.4);const l2=charFrame(C[1],t);
  /* edit 1 + proof sheet */
  noteFrame(E1,t,T.e1,T.e1d);
  const p1=open('p1',t<T.p1o0?0:t<T.p1c0?(rm?1:eo((t-T.p1o0)/(T.p1o1-T.p1o0))):(rm?(t>=T.p1c1?0:1):1-eio((t-T.p1c0)/(T.p1c1-T.p1c0))));
  flip(E1.pf,null,M.p1,p1,E1.pf.querySelector('.tv-pin'));E1.cv.style.setProperty('--cv',`${(180*p1).toFixed(1)}deg`);
  noteFrame(E2,t,T.e2,T.e2d);const p2=open('p2',0);flip(E2.pf,null,M.p2,p2,E2.pf.querySelector('.tv-pin'));E2.cv.style.setProperty('--cv',`${(180*p2).toFixed(1)}deg`);
  /* shell 1 (typecheck, folds away once it passes) */
  if(noteFrame(S1,t,T.s1,T.s1d)){const f=open('o1',1-(t>=T.s1f0?(rm?1:eio((t-T.s1f0)/(T.s1f1-T.s1f0))):0));S1.so.style.height=shellOut(S1,t,T.s1l,1-f).toFixed(2)+'px';S1.cv.style.setProperty('--cv',`${(180*f).toFixed(1)}deg`)}
  /* shell 2 (npm test, fails) */
  if(noteFrame(S2,t,T.s2,T.s2d,true)){const f=open('o2',1);S2.so.style.height=shellOut(S2,t,T.s2l,1-f).toFixed(2)+'px';S2.cv.style.setProperty('--cv',`${(180*f).toFixed(1)}deg`);
    const au=t>=T.s2d+.12?(rm?1:cl((t-T.s2d-.12)/.4)):0;S2.tag.style.opacity=cl(au*3).toFixed(3);
    S2.tag.style.clipPath=rm?'none':`inset(-4px -4px ${(100-100*eio(au)).toFixed(2)}% -4px)`;S2.tag.style.transform=`rotate(${(2.2-1*eo(au)).toFixed(2)}deg)`}
  arrive(B[2],t,T.b3,.4);const l3=charFrame(C[2],t);
  noteFrame(E3,t,T.e3,T.e3d);const p3=open('p3',0);flip(E3.pf,null,M.p3,p3,E3.pf.querySelector('.tv-pin'));E3.cv.style.setProperty('--cv',`${(180*p3).toFixed(1)}deg`);
  if(noteFrame(S3,t,T.s3,T.s3d)){const f=open('o3',1);S3.so.style.height=shellOut(S3,t,T.s3l,1-f).toFixed(2)+'px';S3.cv.style.setProperty('--cv',`${(180*f).toFixed(1)}deg`)}
  arrive(B[3],t,T.b4,.4);const l4=charFrame(C[3],t);
  /* summary bar */
  if(arrive(SUM,t,T.sum,.45,14)){const so=open('sl',t>=T.so0?(rm?1:eio((t-T.so0)/(T.so1-T.so0))):0);
    SW.style.height=(M.sl*so).toFixed(2)+'px';SW.firstElementChild.style.opacity=cl(so*1.6).toFixed(3);
    SW.firstElementChild.style.transform=rm?'none':`perspective(800px) rotateX(${(-40*(1-eo(so))).toFixed(2)}deg)`;SW.firstElementChild.style.transformOrigin='50% 0';
    scv.style.setProperty('--cv',`${(180*so).toFixed(1)}deg`);SH.setAttribute('aria-expanded',so>.5)}
  /* ---- dossier ---- */
  const ph=[T.r3d,T.e1d,T.e2d,T.s3d];let k=0;while(k<4&&t>=ph[k])k++;
  tds.forEach((e,i)=>{const st=i<k?'ok':i===k?'now':'todo';if(e._st!==st){e._st=st;e.classList.remove('ok','now','todo');e.classList.add(st);
    e.querySelector('.mk').innerHTML=st==='ok'?window.__tvCheck:st==='now'?'✦':'◇'}});
  if(planH)planH.textContent=(k>=4?'iv':roman[k])+' of iv';
  const fa=t>=T.e1d?(rm?1:eo((t-T.e1d)/.5)):0,fb=t>=T.e2d?(rm?1:eo((t-T.e2d)/.5)):0;
  fxA.style.maxHeight=(fa*30).toFixed(1)+'px';fxA.style.opacity=fa.toFixed(3);fxA.style.padding=`${(4*fa).toFixed(2)}px 0`;
  fxB.style.maxHeight=(fb*30).toFixed(1)+'px';fxB.style.opacity=fb.toFixed(3);fxB.style.padding=`${(4*fb).toFixed(2)}px 0`;
  none.style.maxHeight=((1-fa)*26).toFixed(1)+'px';none.style.opacity=(1-fa).toFixed(3);
  tot.style.maxHeight=(fa*24).toFixed(1)+'px';tot.style.opacity=(fa*.95).toFixed(3);
  const fixU=t>=T.e3d?1:0;
  const flipN=(el,txt,t0)=>{if(el.textContent!==txt)el.textContent=txt;if(rm||t<t0||t>t0+.45){el.style.transform='';el.style.filter='';return}
    const u=(t-t0)/.45;el.style.transform=`translateY(${(-3*Math.sin(Math.PI*u)).toFixed(2)}px) scale(${(1+.12*Math.sin(Math.PI*u)).toFixed(3)})`;el.style.filter=`drop-shadow(0 0 ${(4*Math.sin(Math.PI*u)).toFixed(2)}px rgba(232,214,160,.9))`};
  flipN(fxAa,fixU?'+13':'+12',T.e3d);flipN(fxAd,fixU?'−6':'−4',T.e3d);
  const ta=12+(t>=T.e2d?5:0)+(fixU?1:0),td=4+(t>=T.e2d?3:0)+(fixU?2:0);
  flipN(tA,'+'+ta,t>=T.e3d?T.e3d:T.e2d);flipN(tD,'−'+td,t>=T.e3d?T.e3d:T.e2d);
  if(leaves)leaves.textContent=t>=T.e2d?'two leaves':t>=T.e1d?'one leaf':'no leaves';
  const ctx=42+2*cl((t-T.r1)/2)+3*cl((t-T.e1)/4)+2*cl((t-T.s2)/4)+1*cl((t-T.b4)/1.5);
  pcEl.textContent=Math.round(ctx)+'%';ofEl.textContent=Math.round(262*ctx/100)+'k of 262k';grI.style.width=ctx.toFixed(2)+'%';grB.style.left=ctx.toFixed(2)+'%';
  /* ---- composer stop ring ---- */
  const busy=t>=T.b1&&t<T.c4z+.3?1:0;send._bv=(send._bv===undefined||lastT<0||t<lastT)?busy:send._bv+(busy-send._bv)*(rm?1:1-Math.exp(-Math.max(0,Math.min(.1,t-lastT))/.12));
  const bv=send._bv;stopI.style.opacity=bv.toFixed(3);stopI.style.transform=`scale(${(.86+.14*bv).toFixed(3)})`;sl0.style.opacity=(1-bv).toFixed(3);sl1.style.opacity=bv.toFixed(3);
  if(!rm)stArc.setAttribute('transform',`rotate(${((t*150)%360).toFixed(1)})`);
  /* ---- blossom on the writing tip ---- */
  const tips=[[l1,T.c1a,T.c1z],[l2,T.c2a,T.c2z],[l3,T.c3a,T.c3z],[l4,T.c4a,T.c4z]];let tip=null;
  for(const [l,a,z] of tips)if(l&&t<z+.9){tip={l,a,z};break}
  if(tip&&!rm){const r=tip.l.el.getBoundingClientRect();const after=t-tip.z;
    const o=after<0?cl((t-tip.a+.1)/.3):1-cl((after-.35)/.5);const bl=after>0?Math.sin(Math.PI*cl(after/.7)):0;
    flw.style.opacity=o.toFixed(3);flw.style.transform=`translate(${(r.right+8+5*cl(after/.3)).toFixed(2)}px,${((r.top+r.bottom)/2-1).toFixed(2)}px) scale(${(1+.18*bl-.2*cl(after/.8)).toFixed(3)})`;
    flRot.setAttribute('transform',`rotate(${(Math.min(t,tip.z)*34+7*Math.sin(t*2*Math.PI/1.8)).toFixed(2)})`);
    pos.forEach((g2,k2)=>g2.setAttribute('transform',`translate(0 ${(-1.4*bl).toFixed(2)}) rotate(${(bl*(k2%2?3:-3)).toFixed(2)})`))}
  else flw.style.opacity=0;
  /* ---- thread follower ---- */
  const tg=target();if(sc<0||rm)sc=tg;else{const dt=Math.max(0,Math.min(.1,t-lastT));sc+=(tg-sc)*(1-Math.exp(-dt/.2))}
  thread.style.transform=`translateY(${(-sc).toFixed(2)}px)`;
  /* ---- demo cursor + hover ---- */
  let cx=-99,cy=-99;
  if(window.__tvCapture&&!window.__tvNoCur){const [x,y]=curAt(t);cx=x;cy=y;const down=(t>=8.24&&t<8.36)||(t>=9.5&&t<9.62)||(t>=11.32&&t<11.44)||(t>=16.62&&t<16.74);
    const co=cl((t-7.3)/.3)*(1-cl((t-T.END+.3)/.3));cur.style.opacity=co.toFixed(3);cur.style.transform=`translate(${(x-3).toFixed(2)}px,${(y-2).toFixed(2)}px) scale(${down?.88:1})`}
  else cur.style.opacity=0;
  [E1.h,SH].forEach(h=>h.classList.toggle('hov',window.__tvCapture&&inside(h,cx,cy)));
  /* ---- model popover in the recording: opened by the demo cursor mid-turn, beside the stop ring ---- */
  if(window.__tvCapture&&window.__s2pop){const want=t>=T.mp0&&t<T.mp1;if(want!==!!CHIP._pop){CHIP._pop=want;window.__s2pop(want)}}
  lastT=t};

window.__tvframe=frame;window.__tvT=T;
/* ---- live: plays, holds, loops; any click on a note / line / bar takes over and the turn rests at its end ---- */
const bind=(el,key)=>{el.addEventListener('click',()=>toggle(key));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle(key)}})};
bind(GL,'grp');bind(E1.h,'p1');bind(E2.h,'p2');bind(E3.h,'p3');bind(S1.h,'o1');bind(S2.h,'o2');bind(S3.h,'o3');bind(SH,'sl');
let t0=null,tt=0,lastN=0;
const live=n=>{if(t0===null){t0=n;lastN=n}const dt=(n-lastN)/1000;lastN=n;NOW=n/1000;
  let nt=tt+dt;if(nt>=T.END){nt=userMode?T.END:(nt>=T.END+2.5?0:nt)}
  if(nt===0&&tt>0){Object.keys(TG).forEach(k=>delete TG[k])}
  tt=nt;frame(Math.min(tt,T.END));requestAnimationFrame(live)};
const hm=location.hash.match(/t=([\d.]+)/);const still=hm?+hm[1]:location.hash.includes('diff')?7.9:location.hash.includes('fail')?12.05:location.hash.includes('end')?17.8:location.hash.includes('model')?10.4:null;
const start=()=>{measure();Promise.all([...document.querySelectorAll('.thread .rnd')].map(i=>i.decode?i.decode().catch(()=>0):0)).then(guard);if(window.__tvCapture){frame(0);return}
  if(still!==null){userMode=true;tt=still;for(let x=0;x<=still;x+=1/30)frame(x);frame(still);
    const loopS=n=>{NOW=n/1000;frame(still);requestAnimationFrame(loopS)};requestAnimationFrame(loopS);
    if(location.hash.includes('model'))setTimeout(()=>window.__s2pop&&window.__s2pop(true),120);return}
  requestAnimationFrame(live)};
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>requestAnimationFrame(start));
frame(0);
})();
</script>'''

# ---------------------------------------------------------------- model layer, lifted from build_sessions_v2.py
_s2 = open(HERE + 'build_sessions_v2.py', encoding='utf-8').read().split('# ---------- assemble')[0]
_ns = {}
exec(compile(_s2, 'build_sessions_v2_defs', 'exec'), _ns)
CHIP, POP, MODAL, DEFS13, CSS2, CSS13, JS2 = (_ns[k] for k in ('CHIP', 'POP', 'MODAL', 'DEFS', 'CSS2', 'CSS13', 'JS2'))
import re as _re
def _between(txt, a, z):
    i = txt.index(a); j = txt.index(z, i); return txt[i:j]
# CSS: shared paper tabs + chip/popover/catalogue (the drawer's .pf project folders are left out: tools uses .pf for proof sheets)
_ptabs = _between(CSS2, '/* shared paper index tabs */', '.tb-dot{')
_mcss = _between(CSS2, '/* ---------- composer model chip', '@media (prefers-reduced-motion:reduce)')
# drawer pieces the catalogue borrows: inked search line, silver ribbon, ink rule
_borrow = '\n'.join(m.group(0).strip() for m in _re.finditer(r'[^{}]*\.(?:dw-q|drw-ribbon|dw-ink)\b[^{}]*\{[^}]*\}', CSS13))
assert '.dw-q{' in _borrow and '.drw-ribbon{' in _borrow and '.dw-ink{' in _borrow
MCSS = ('<style id="toolsV2model">\n/* ===== model chip, popover and catalogue (from sessions v2) ===== */\n' + _borrow + '\n' + _ptabs + _mcss +
        '/* tools v2: the tag and the pocket-watch stop ring share the composer; the tag never runs under the bow/pen */\n'
        '.composer .field .bar .mchip{flex:none;margin-right:6px}\n'
        '@media (prefers-reduced-motion:reduce){.ptab,.sld-th,.mchip,.mp-row,.md-row{transition:none!important;transform:none}}\n</style>\n')
# JS: everything from the chip on (drawer code stays behind)
_mjs = JS2[JS2.index('/* ---------- model chip + popover ---------- */'):]
MJS = ('<script>\n(()=>{\nconst RM=matchMedia(\'(prefers-reduced-motion: reduce)\');\n'
       'const b=document.body,$=(q,r=document)=>r.querySelector(q),$$=(q,r=document)=>[...r.querySelectorAll(q)];\n'
       "const EO='cubic-bezier(.22,1,.36,1)',SPR='cubic-bezier(.3,1.32,.45,1)';\n"
       'const spring=(z,w,t)=>{if(z>=1)return (1+w*t)*Math.exp(-w*t);const wd=w*Math.sqrt(1-z*z);return Math.exp(-z*w*t)*(Math.cos(wd*t)+(z*w/wd)*Math.sin(wd*t))};\n'
       + _mjs)
assert MJS.rstrip().endswith('</script>')
CURM = _ns['CURM']

pre = ('<script>window.__tvCol=' + json.dumps(NEWCOL) + ';window.__tvHist=' + json.dumps(HISTNOTE) +
       ';window.__tvStop=' + json.dumps(STOP) + ';window.__tvCheck=' + json.dumps(CHECK) + ';</script>')

sub1('<title>Kimi Code · 蓝雾厅 v8</title>', '<title>Kimi Code · 蓝雾厅 · 工具调用与改动 tools v2</title>')
# history: the earlier read was of stream.ts; the user now approves the proposal
sub1('看过 <code>transcript.ts</code> 了。', '看过 <code>stream.ts</code> 了。')
sub1('<div class="row out"><div class="b">好，顺便把去重也补上。</div></div>', '<div class="row out"><div class="b">可以，就这么改：流式渲染按帧合批，顺便把测试补上。</div></div>')
sub1('</head>', CSS + MCSS + '</head>')
# composer: the luggage-tag model chip after "@ 文件" (same spot as sessions_v2)
sub1('<div class="pill rb blue">@ 文件</div></div>', '<div class="pill rb blue">@ 文件</div>' + CHIP + '</div>')
# dossier Context names the composer's current model
sub1('<h5><em>Context</em>上 下 文<small>Kimi K2.5</small></h5>', f'<h5><em>Context</em>上 下 文<small>{CURM}</small></h5>')
idx = s.rfind('</body>')
s = s[:idx] + DEFS + DEFS13 + FLOWER + POP + MODAL + pre + JS + MJS + s[idx:]
open(OUT, 'w', encoding='utf-8').write(s)
print('wrote', OUT, len(s))
