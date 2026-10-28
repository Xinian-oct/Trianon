"""e4v · 铜版花体字转路径（Pinyon Script，HarfBuzz 排字，fontTools 取轮廓）。
text_paths(text, size) -> (glyphs, width): glyphs = [{'d': svg path in px (baseline y=0), 'x0','x1'}]
Used to build the greeting so it can be *written* (outline stroke-dashoffset, then fill)."""
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

FONT = './fonts/PinyonScript.ttf'
_tt = TTFont(FONT)
_gs = _tt.getGlyphSet()
_order = _tt.getGlyphOrder()
_blob = hb.Blob.from_file_path(FONT)
_face = hb.Face(_blob)
_font = hb.Font(_face)
UPM = _face.upem


def text_paths(text, size):
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(_font, buf, {'kern': True, 'liga': True, 'calt': True})
    k = size / UPM
    x = 0; out = []
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = _order[info.codepoint]
        gx = x + pos.x_offset; gy = pos.y_offset
        pen = SVGPathPen(_gs, ntos=lambda v: f'{v:.2f}')
        tp = TransformPen(pen, (k, 0, 0, -k, gx * k, -gy * k))
        _gs[name].draw(tp)
        bp = BoundsPen(_gs); _gs[name].draw(bp)
        d = pen.getCommands()
        if d and bp.bounds:
            b = bp.bounds
            out.append({'d': d, 'x0': (gx + b[0]) * k, 'x1': (gx + b[2]) * k, 'y0': -(b[3] + gy) * k, 'y1': -(b[1] + gy) * k, 'ch': name})
        x += pos.x_advance
    return out, x * k


if __name__ == '__main__':
    for t in ['Bonjour,', 'Bon après-midi,', 'Bonsoir,', 'Colette']:
        g, w = text_paths(t, 40)
        print(t, len(g), round(w, 1), [x['ch'] for x in g], round(min(x['y0'] for x in g), 1), round(max(x['y1'] for x in g), 1))
