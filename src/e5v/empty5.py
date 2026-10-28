"""rococo v2 · 空白页中心区 v5「欧式复古拼贴 · 用户动效规格版」markup generator (imported by build_rococo_v2.py).
Upgrades e4v/empty4.py to the user's own centre-motion spec (2026-10-27 13:10). #invite-local px, box 700 × 560.
  base layer (parallax 2px)   left-back gothic door card (Cotman litho, BM) · right-back baroque gallery card (Guardi, Met CC0)
                              = the top card of a sheaf: two blank sheets peek out under it, a pewter binder clip clamps them
  middle layer (5px)          the main letter (centre, on top of the cards) with a fog-blue armorial letterhead (1865 bookplate,
                              multiply) and a pewter paper clip at its lower-left edge · the postmark (pressed, multiply) · Envoyé
  script                      Bonjour / Bon après-midi / Bonsoir, + Colette in copperplate, laid ACROSS the seams
                              (line 1 starts on the gothic card, line 2 runs off the letter onto the gallery card)
  top layer (10–14px)         thick white die-cut stickers: blue-and-white botanical plate (Chelsea, Met CC0) · silver teapot
                              (Decourchelle c.1752, Met CC0) · gothic canopy (Letarouilly) · camellia hang tag on a near-black cord
                              with a pewter clasp, hanging from the binder clip
  quick starts                three die-cut labels (same <button class="tag tN"> elements / order / handlers)
No pocket watch in the collage any more: the send key is the (one) watch.
Every piece is a .c5p with data-r (resting tilt), data-z (parallax px), data-sd (exit side) read by rococo_v2_empty.js.
"""
import base64, json, os, sys

HERE5 = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE5, '..', 'e4v'))
from script4 import text_paths   # Pinyon Script → svg paths (HarfBuzz + fontTools)

BOX_W, BOX_H = 700, 560


def uri(path, mime='image/webp'):
    return f'data:{mime};base64,' + base64.b64encode(open(path, 'rb').read()).decode()


def star4(x, y, s, fill='#FBF9F4', stroke='#8D97B4', sw=.6):
    k = s * .22
    d = (f"M{x},{y - s} C{x + k},{y - k} {x + k},{y - k} {x + s},{y} C{x + k},{y + k} {x + k},{y + k} {x},{y + s} "
         f"C{x - k},{y + k} {x - k},{y + k} {x - s},{y} C{x - k},{y - k} {x - k},{y - k} {x},{y - s}Z")
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"/>'


def piece(cls, pid, x, y, w, h, r, z, sd, inner, extra=''):
    return (f'<div class="c5p {cls}" id="{pid}" data-r="{r}" data-z="{z}" data-sd="{sd}" '
            f'style="left:{x}px;top:{y}px;width:{w}px;height:{h}px" {extra}>{inner}</div>')


# ---------------------------------------------------------------- geometry (box px)
GO = dict(x=40, y=30, w=180, h=256, r=-5)        # gothic door card (left back)
GA = dict(x=398, y=118, w=292, h=212, r=4)       # baroque gallery card (right back, top of the sheaf)
LE = dict(x=160, y=150, w=350, h=210, r=-1.5)    # main letter (centre)
CLIP = dict(x=212, y=-15, w=56, h=60)            # binder clip, gallery-local (clamps the top edge)
HANG = (CLIP['x'] + 28, CLIP['y'] + 5)           # top of the clip's wire handle loop, gallery-local → the cord hangs here


def script_group(text, size, x, y, gid, cls=''):
    gl, w = text_paths(text, size)
    d = ' '.join(g['d'] for g in gl)
    return f'<g id="{gid}" class="c5w {cls}" transform="translate({x} {y})"><path d="{d}"/></g>', w, d


def build(here):
    A = json.load(open(HERE5 + '/out/assets.json'))
    U = {k: uri(HERE5 + '/out/' + k + '.webp') for k in A}
    cam_src = here + 'e4v/s_camellia.webp'
    CA = json.load(open(here + 'e4v/assets.json'))['s_camellia']

    # ------------------------------------------------------------ base layer
    gph_h = round(164 * A['c_gothic']['h'] / A['c_gothic']['w'])
    gothic = piece('c5-card', 'c5Go', GO['x'], GO['y'], GO['w'], GO['h'], GO['r'], 2, -1,
                   f'<i class="c5-ph" style="left:8px;top:8px;width:164px;height:{gph_h}px;background-image:url({U["c_gothic"]})"></i>'
                   f'<b class="c5-cap" style="left:0;right:0;top:{8 + gph_h + 7}px;text-align:center;font-size:17px">Porte romane</b>'
                   f'<em class="c5-sm" style="right:12px;top:{8 + gph_h + 9}px">N° 03</em>')
    aph_h = round(276 * A['c_gallery']['h'] / A['c_gallery']['w'])
    clip = (f'<div class="c5-clip" style="left:{CLIP["x"]}px;top:{CLIP["y"]}px">'
            f'<svg width="{CLIP["w"]}" height="{CLIP["h"]}" viewBox="0 0 56 60" aria-hidden="true"><defs>'
            '<linearGradient id="c5bcF" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4F6FA"/><stop offset=".38" stop-color="#C3CAD9"/>'
            '<stop offset=".62" stop-color="#E9ECF3"/><stop offset="1" stop-color="#8C96AE"/></linearGradient>'
            '<linearGradient id="c5bcW" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7D879F"/><stop offset=".5" stop-color="#F2F4F9"/><stop offset="1" stop-color="#8A94AC"/></linearGradient></defs>'
            # wire handles folded up: the back one (fainter, a little higher) and the front one; the cord hangs from the front loop
            '<path d="M16,24 L13,7 Q12.5,3.5 16,3.5 L40,3.5 Q43.5,3.5 43,7 L40,24" fill="none" stroke="#9AA3B9" stroke-width="1.7" stroke-linecap="round" transform="translate(1.5 -2.5)"/>'
            '<path d="M14,26 L11,9 Q10.5,5 14.5,5 L41.5,5 Q45.5,5 45,9 L42,26" fill="none" stroke="rgba(30,39,72,.35)" stroke-width=".6" transform="translate(.7 .9)"/>'
            '<path d="M14,26 L11,9 Q10.5,5 14.5,5 L41.5,5 Q45.5,5 45,9 L42,26" fill="none" stroke="url(#c5bcW)" stroke-width="2.1" stroke-linecap="round"/>'
            # front plate (pewter), clamping the sheaf; a little roll at the top edge
            '<path d="M10,19 Q10,16.5 13,16.5 L43,16.5 Q46,16.5 46,19 L52,41 Q52.6,44 49.5,44 L6.5,44 Q3.4,44 4,41Z" fill="url(#c5bcF)" stroke="rgba(30,39,72,.45)" stroke-width=".7"/>'
            '<path d="M11,21 H45" stroke="rgba(255,255,255,.95)" stroke-width="1"/><path d="M10.5,23 H45.5" stroke="rgba(30,39,72,.2)" stroke-width=".6"/>'
            '<path d="M9,40.5 H47" stroke="rgba(30,39,72,.22)" stroke-width=".6"/>'
            '<ellipse cx="14" cy="21.3" rx="2.3" ry="1.6" fill="#B9C1D2" stroke="rgba(30,39,72,.4)" stroke-width=".5"/>'
            '<ellipse cx="42" cy="21.3" rx="2.3" ry="1.6" fill="#B9C1D2" stroke="rgba(30,39,72,.4)" stroke-width=".5"/></svg></div>')
    gallery = piece('c5-card c5-stack', 'c5Ga', GA['x'], GA['y'], GA['w'], GA['h'], GA['r'], 2, 1,
                    '<i class="c5-sheet s1"></i><i class="c5-sheet s2"></i>'
                    '<div class="c5-face c5-silver">'
                    f'<i class="c5-ph" style="left:8px;top:8px;width:276px;height:{aph_h}px;background-image:url({U["c_gallery"]})"></i>'
                    f'<b class="c5-cap" style="left:13px;top:{8 + aph_h + 4}px;font-size:15px">Galerie baroque</b>'
                    f'<em class="c5-sm" style="right:12px;top:{8 + aph_h + 7}px">d\'après Guardi</em></div>' + clip,
                    f'data-hx="{HANG[0]}" data-hy="{HANG[1]}"')

    # ------------------------------------------------------------ middle layer: the letter
    W, H = LE['w'], LE['h']
    cw = 84; chh = round(cw * A['crest']['h'] / A['crest']['w'])
    pclip = ('<svg class="c5-pclip" width="22" height="64" viewBox="0 0 22 64" aria-hidden="true"><defs>'
             '<linearGradient id="c5pc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7F89A2"/><stop offset=".45" stop-color="#F5F7FB"/><stop offset="1" stop-color="#8E98B0"/></linearGradient></defs>'
             '<path d="M6,46 V12 Q6,4 11,4 Q16,4 16,12 V52 Q16,60 11,60 Q4,60 4,52 V18 Q4,14 7,14" fill="none" stroke="rgba(30,39,72,.32)" stroke-width="2.4" stroke-linecap="round" transform="translate(.7 1)"/>'
             '<path d="M6,46 V12 Q6,4 11,4 Q16,4 16,12 V52 Q16,60 11,60 Q4,60 4,52 V18 Q4,14 7,14" fill="none" stroke="url(#c5pc)" stroke-width="2" stroke-linecap="round"/></svg>')
    letter = piece('c5-paper c5-letter', 'c5Le', LE['x'], LE['y'], W, H, LE['r'], 5, 0,
                   f'<svg class="c5-lpaper" width="{W}" height="{H}" viewBox="0 0 {W} {H}" aria-hidden="true">'
                   f'<rect x="0" y="0" width="{W}" height="{H}" rx="2.5" fill="#FBF9F4" stroke="rgba(102,113,143,.2)" stroke-width=".6"/>'
                   f'<rect x="9" y="9" width="{W - 18}" height="{H - 18}" rx="1.5" fill="none" stroke="#BFC8E0" stroke-width=".9"/>'
                   f'<rect x="13" y="13" width="{W - 26}" height="{H - 26}" rx="1" fill="none" stroke="rgba(191,200,224,.6)" stroke-width=".55"/>'
                   + star4(13, 13, 5.5) + star4(W - 13, H - 13, 5.5) +
                   f'<path d="M{W / 2 - 64},{14 + chh + 10} H{W / 2 - 14} M{W / 2 + 14},{14 + chh + 10} H{W / 2 + 64}" stroke="rgba(141,151,180,.7)" stroke-width=".6"/>'
                   + star4(W / 2, 14 + chh + 10, 3.2, fill='#BFC8E0', stroke='none') + '</svg>'
                   f'<img class="c5-crest" src="{U["crest"]}" alt="" draggable="false" style="left:{(W - cw) / 2:.1f}px;top:12px;width:{cw}px;height:{chh}px">'
                   f'<em class="c5-note" style="left:30px;bottom:21px">le salon du code est ouvert</em>'
                   f'<i class="c5-pc" style="left:-6px;top:{H - 82}px">{pclip}</i>')

    # postmark (pressed; multiply) — ring centre sits on the letter's top-right corner, half over the gallery card
    R = 44
    ring = f'M{100 - 33},50 A33,33 0 1 1 {100 + 33},50 A33,33 0 1 1 {100 - 33},50'
    waves = ''.join(f'<path d="M150,{50 + dy} q12.5,-5.5 25,0 t25,0"/>' for dy in (-11, 0, 11))
    postmark = piece('c5-inkp c5-pm', 'c5Pm', 404, 112, 250, 100, -9, 5, 1,
                     '<svg width="250" height="100" viewBox="0 0 250 100" aria-hidden="true">'
                     '<defs><path id="c5pmR" d="' + ring + '"/>'
                     '<filter id="c5rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="1" seed="4"/>'
                     '<feDisplacementMap in="SourceGraphic" scale="1.3"/></filter></defs>'
                     '<g filter="url(#c5rough)">'
                     f'<circle cx="100" cy="50" r="{R}" fill="none" stroke-width="1.8"/><circle cx="100" cy="50" r="{R - 4.5}" fill="none" stroke-width=".8"/>'
                     '<text class="c5-pmr"><textPath href="#c5pmR" startOffset="0">KIMI CODE · LE SALON · PARIS ·</textPath></text>'
                     '<text class="c5-pmd" id="c5PmD" x="100" y="56" text-anchor="middle">27</text>'
                     '<text class="c5-pmm" id="c5PmM" x="100" y="66" text-anchor="middle">OCT 2026</text>'
                     '<path d="M100,24 l1.6,4 4,1.6 -4,1.6 -1.6,4 -1.6,-4 -4,-1.6 4,-1.6Z" stroke="none"/>'
                     f'<g class="c5-wv" fill="none" stroke-width="1.3">{waves}</g></g></svg>')
    envoye = piece('c5-inkp c5-env', 'c5Env', 268, 226, 168, 62, -8, 5, 0,
                   '<svg width="168" height="62" viewBox="0 0 168 62" aria-hidden="true"><g filter="url(#c5rough)">'
                   '<rect x="3" y="3" width="162" height="56" rx="7" fill="none" stroke-width="1.8"/>'
                   '<rect x="8" y="8" width="152" height="46" rx="4" fill="none" stroke-width=".8"/>'
                   '<text class="c5-envt" x="84" y="39" text-anchor="middle">Envoyé</text>'
                   '<path d="M24,31 h14 M130,31 h14" stroke-width=".9"/></g></svg>')

    # ------------------------------------------------------------ script across the seams
    L1X, L1Y, L2X, L2Y = 116, 252, 288, 324
    l1 = ''
    for k, txt in [('morning', 'Bonjour,'), ('noon', 'Bon après-midi,'), ('night', 'Bonsoir,')]:
        x = L1X if k != 'noon' else L1X - 14
        g, w, _ = script_group(txt, 46, x, L1Y, 'c5L1' + k, 'l1 g-' + k)
        l1 += g
    g2, w2, d2 = script_group('Colette', 78, L2X, L2Y, 'c5L2', 'l2')
    xe = L2X + w2
    fl = (f'M{xe - 6:.1f},{L2Y - 9} C{xe + 4:.1f},{L2Y + 3} {xe + 20:.1f},{L2Y + 8} {xe + 34:.1f},{L2Y + 2} '
          f'C{xe + 44:.1f},{L2Y - 3} {xe + 44:.1f},{L2Y - 14} {xe + 37:.1f},{L2Y - 15} C{xe + 30:.1f},{L2Y - 16} {xe + 32:.1f},{L2Y - 4} {xe + 41:.1f},{L2Y - 2} '
          f'C{xe + 47:.1f},{L2Y - 1} {xe + 51:.1f},{L2Y - 7} {xe + 54:.1f},{L2Y - 12}')
    ink = f'{l1}{g2}<path class="c5fl" d="{fl}"/>'
    import re
    noid = re.sub(r' id="c5L[^"]*"', '', ink)
    script = ('<div class="c5-script" id="c5Sc"><svg width="700" height="560" viewBox="0 0 700 560" aria-hidden="true">'
              '<defs><linearGradient id="c5ShG" gradientUnits="userSpaceOnUse" x1="-80" y1="0" x2="80" y2="0" gradientTransform="translate(-200 0) rotate(15)">'
              '<stop offset="0" stop-color="#F3F5FA" stop-opacity="0"/><stop offset=".3" stop-color="#E6EAF4" stop-opacity="0"/>'
              '<stop offset=".5" stop-color="#FFFFFF" stop-opacity="1"/><stop offset=".7" stop-color="#DDE3F1" stop-opacity="0"/>'
              '<stop offset="1" stop-color="#F3F5FA" stop-opacity="0"/></linearGradient></defs>'
              f'<g class="c5-halo">{noid}</g><g class="c5-ink">{ink}</g><g class="c5-sh" id="c5Sh">{noid}</g></svg></div>')

    # ------------------------------------------------------------ top layer: die-cut stickers
    def stk(pid, key, x, y, w, r, z, sd, alt=''):
        a = A[key]; h = round(w * a['h'] / a['w'], 1)
        return piece('c5-stk', pid, x, y, w, h, r, z, sd,
                     f'<div class="c5s-in"><img src="{U[key]}" alt="{alt}" draggable="false" width="{w}" height="{h}"></div>')
    plate = stk('c5Pl', 's_plate', 236, 4, 118, -7, 12, -1)
    arch = stk('c5Ar', 's_arch', 22, 292, 60, -6, 11, -1)
    teapot = stk('c5Tp', 's_teapot', 524, 352, 126, 5, 13, 1)
    # camellia hang tag: near-black cord from the binder clip's handle, pewter swivel clasp + split ring through the punched hole
    tw = 94; th = round(tw * CA['h'] / CA['w'], 1)
    gx, gy = round(30 * tw / 106, 1), round(20 * tw / 106, 1)      # grommet (punched hole) in tag px
    CL = 84                                                          # hang point → split ring distance (cord + clasp)
    tag = (f'<div class="c5-tagw" id="c5Tag" data-z="14" style="left:0;top:0;width:{tw}px;height:{th + CL}px">'
           f'<svg class="c5-clasp" width="{tw}" height="{CL + gy + 8}" aria-hidden="true"><defs>'
           '<linearGradient id="c5cl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7C869E"/><stop offset=".5" stop-color="#F4F6FA"/><stop offset="1" stop-color="#8892AA"/></linearGradient></defs>'
           # swivel clasp body (pewter) at the end of the cord, then the split ring through the hole
           f'<path d="M{gx - 3.2},{CL - 20} Q{gx - 3.6},{CL - 12} {gx - 1.6},{CL - 7} L{gx + 1.6},{CL - 7} Q{gx + 3.6},{CL - 12} {gx + 3.2},{CL - 20}Z" fill="url(#c5cl)" stroke="rgba(30,39,72,.45)" stroke-width=".6"/>'
           f'<circle cx="{gx}" cy="{CL - 21.5}" r="2.4" fill="none" stroke="url(#c5cl)" stroke-width="1.5"/>'
           f'<ellipse cx="{gx}" cy="{CL + gy - 6}" rx="6.6" ry="8.6" fill="none" stroke="rgba(30,39,72,.38)" stroke-width="2.6" transform="translate(.5 .7)"/>'
           f'<ellipse cx="{gx}" cy="{CL + gy - 6}" rx="6.6" ry="8.6" fill="none" stroke="url(#c5cl)" stroke-width="2.1"/></svg>'
           f'<div class="c5-tag" style="left:0;top:{CL}px;width:{tw}px;height:{th}px"><div class="c5s-in" style="transform-origin:{gx}px {gy}px">'
           f'<img src="{uri(cam_src)}" alt="" draggable="false" width="{tw}" height="{th}">'
           f'<svg class="c5-grom" width="{tw}" height="{th}" aria-hidden="true"><circle cx="{gx}" cy="{gy}" r="5.6" fill="#FFFEFB" stroke="#BFC8E0" stroke-width=".9"/>'
           f'<circle cx="{gx}" cy="{gy}" r="3.4" fill="#59617A"/></svg></div></div></div>')
    cord = ('<svg class="c5-cord" width="700" height="560" viewBox="0 0 700 560" aria-hidden="true">'
            '<path id="c5Cord" d="M0,0" fill="none" stroke="#262C3E" stroke-width="1.5" stroke-linecap="round"/>'
            '<path id="c5Cord2" d="M0,0" fill="none" stroke="rgba(120,130,160,.55)" stroke-width=".5" stroke-linecap="round"/></svg>')
    camellia = (f'<div class="c5-cam" id="c5Cam" data-gx="{gx}" data-cl="{CL}">' + cord + tag + '</div>')

    # ------------------------------------------------------------ quick starts: three die-cut labels (unchanged from v4)
    T1 = 'M9,0 H141 A9,9 0 0 0 150,9 V37 A9,9 0 0 0 141,46 H9 A9,9 0 0 0 0,37 V9 A9,9 0 0 0 9,0Z'
    T2 = 'M4,0 H146 Q150,0 150,4 V14 A9,9 0 0 0 150,32 V42 Q150,46 146,46 H4 Q0,46 0,42 V32 A9,9 0 0 0 0,14 V4 Q0,0 4,0Z'
    T3 = 'M20,0 H130 C142,0 150,12 150,23 C150,34 142,46 130,46 H20 C8,46 0,34 0,23 C0,12 8,0 20,0Z'
    I1 = 'M12,5 H138 A7,7 0 0 0 145,12 V34 A7,7 0 0 0 138,41 H12 A7,7 0 0 0 5,34 V12 A7,7 0 0 0 12,5Z'
    I2 = 'M6,5 H144 V16 A7,7 0 0 0 144,30 V41 H6 V30 A7,7 0 0 0 6,16Z'
    I3 = 'M21,5 H129 C138,5 145,14 145,23 C145,32 138,41 129,41 H21 C12,41 5,32 5,23 C5,14 12,5 21,5Z'

    def tagb(n, d, di, a, b, label, r):
        return (f'<button class="tag t{n} c5t" data-r="{r}" data-z="4" data-sd="{(-1, 0, 1)[n - 1]}"><div class="c5t-in">'
                f'<svg width="166" height="62" viewBox="-8 -8 166 62" aria-hidden="true"><defs><linearGradient id="c5tg{n}" x1="0" y1="0" x2="0" y2="1">'
                f'<stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient></defs>'
                f'<path d="{d}" fill="#FFFEFB" stroke="rgba(102,113,143,.2)" stroke-width="13.2" stroke-linejoin="round"/>'
                f'<path d="{d}" fill="#FFFEFB" stroke="#FFFEFB" stroke-width="12" stroke-linejoin="round"/>'
                f'<path d="{d}" fill="url(#c5tg{n})"/>'
                f'<path d="{di}" fill="none" stroke="rgba(255,255,255,.85)" stroke-width=".9" transform="translate(0 .8)"/>'
                f'<path d="{di}" fill="none" stroke="rgba(30,39,72,.26)" stroke-width=".7"/></svg>'
                f'<span>{label}</span></div></button>')
    tags = ('<div class="tagcap"><span>或 者 ， 从 这 里 开 始</span></div>'
            '<div class="tags">'
            + tagb(1, T1, I1, '#E6EAF5', '#CDD5E9', 'Tidy this repo', -2)
            + tagb(2, T2, I2, '#FFFEFA', '#F1EEE6', 'Fix a bug', 1.2)
            + tagb(3, T3, I3, '#FAF3F5', '#EFE3E8', 'Just chat', -1) + '</div>')

    html = ('<div class="invite c5i" id="invite"><div class="c5" id="c5">'
            + gothic + gallery + letter + postmark + script + plate + arch + teapot + camellia + envoye
            + tags + '</div></div>')
    return html


if __name__ == '__main__':
    print(len(build('./')))
