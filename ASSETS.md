# Trianon · 素材与字体来源 / Assets & fonts

代码按 MIT 发布（见 `LICENSE`）。**图片和字体不在 MIT 范围内**，各自的条款如下。
The code is MIT. Images and fonts are **not** covered by the MIT license; their terms are listed here.

构建产物 `dist/trianon.html` 是单文件，所有图片和字体都以 data URI 嵌在里面；源文件在 `src/` 下各子目录。
The single-file build embeds every image and font as a data URI; the source files live in the folders under `src/`.

## 1. AI 生成的图片 / AI-generated images

下列目录里的位图是用 AI 图像生成工具（Hark 的 `generate_image`）生成后再处理的（抠底、冷调化、加模切白边）。有些是按设计参考的构图和氛围画的，但**没有复制任何参考图的像素**。生成记录里没写底层模型的名字。
Bitmaps in these folders were made with an AI image generator (Hark `generate_image`) and then post-processed (cut-out, cool-tone grading, die-cut margin). Some prompts followed the composition or mood of design references, but **no reference pixels were copied**. The underlying model was not recorded.

| 目录 / folder | 用在哪 / where |
|---|---|
| `src/r2v/gen/t_*.png` | 左栏模切吊牌 / die-cut hang-tag rail |
| `src/s2v/gen/`, `src/f2v/gen/`, `src/icons/` | 线描与照片质感贴纸 / line-art & photo stickers (files, settings, chat) |
| `src/s3v/gen/w_*.webp` | 设置页摆件（含「跟随系统」银色月相怀表） / settings ornaments (incl. the silver moon-phase watch) |
| `src/s9v/out/`（除 `temple.webp`） | 搜索页天空拼贴 / search sky collage |
| `src/b10v/` | 内置浏览器「Édition du jour」 / built-in browser |
| `src/b11v/` | 收藏相册（绘本水彩小兔） / collection album (watercolour bunny) |
| `src/b12v/out/` | 终端票根 / terminal ticket |
| `src/rpv2/` | 右侧卷宗「Dossier à Rubans」（只用文字提示词生成） / right dossier (text prompts only) |
| `src/o1v/a/wash.webp`, `wax.webp` | 开场动画 / opening |
| `src/e4v/s_camellia.webp` | 空白页山茶花吊牌 / empty-page camellia tag |
| `src/v8.html` 里的「Nocturne」拱窗图 | 右侧卷宗 polaroid（当前版本已隐藏）。只用文字提示词生成 / dossier polaroid (hidden in the current layout), text prompt only |

我们按 **CC0 1.0** 提供这些图片。AI 生成内容在很多法域里可能不受版权保护，我们不保证它们可以登记版权。
We release these images under **CC0 1.0**. AI-generated images may not be protected by copyright in many jurisdictions; no warranty of copyrightability is given.

收藏页的小兔是原创角色，和任何现有绘本角色都没有关系。请不要用别的品牌角色名称呼它。
The collection-page rabbit is an original character, unrelated to any existing picture-book character. Please don't describe it by another brand's character name.

## 2. 程序生成的图片 / Procedurally generated (original)

- `src/cur/out/*.png`：蝴蝶光标，用手写 SVG 渲染 / butterfly cursors rendered from hand-written SVG.
- `src/s2v/grain.png`, `src/b11v/out/paper.webp`, `src/b10v/v8/out/skylight.webp`：用噪声生成的纸纹和天光 / noise-generated paper & skylight.
- `src/b11v/v3/out/n11.webp`：用 Playfair Display（OFL）渲染的「N°11」/ "N°11" set in Playfair Display (OFL).
- 内联 SVG（吊绳、怀表、邮戳、票券、齿孔、蜡封线框）、WebGL 云天着色器、ASCII 地球和 canvas 硫酸纸都写在代码里 / inline SVG, the WebGL sky shader, the ASCII globe and the canvas glassine effect are all in code.
- `src/o1v/a/m_*.webp`：开场动画结尾的定格画面，是本应用自己的截图 / opening landing stills, screenshots of this app itself.
- `src/f1v/thumb_end.jpg`：文件预览里的示例缩略图，是本应用自己的截图 / file-preview sample thumbnail, a screenshot of this app.

## 3. 公有领域 / CC0 馆藏 · Public-domain & CC0 museum images

| 文件 / file | 原作 / work | 来源 / source | 许可 / license |
|---|---|---|---|
| `src/e5v/out/c_gothic.webp` | John Sell Cotman, *Doorway, Heckingham Church*, 1816–18 | The Met 53.510.1 · https://www.metmuseum.org/art/collection/search/363010 | CC0 (Met Open Access) |
| `src/e5v/out/c_gallery.webp` | Francesco Guardi, *Architectural Capriccio: Vaulted Colonnade of a Palace* | The Met 338938 · https://www.metmuseum.org/art/collection/search/338938 | CC0 |
| `src/e5v/out/s_teapot.webp` | Barthélemy Decourchelle, *Teapot*, c. 1752 | The Met 200375 · https://www.metmuseum.org/art/collection/search/200375 | CC0 |
| `src/e5v/out/s_plate.webp` | Chelsea Porcelain, *Botanical dish with spray of lilies*, c. 1755 | The Met · https://commons.wikimedia.org/wiki/File:Botanical_dish_with_spray_of_lilies_MET_DP-1687-039.jpg | CC0 |
| `src/e5v/out/crest.webp` | *Bookplate – William, Duke of Bedford* | https://commons.wikimedia.org/wiki/File:Bookplate-William_Duke_of_Bedford.jpg | Public domain |
| `src/e5v/out/s_arch.webp` | Paul Letarouilly, *Édifices de Rome moderne* (plate) | https://commons.wikimedia.org/wiki/File:Edifices_de_Rome_moderne_1944_(142374199).jpg | Public domain |
| `src/s9v/out/temple.webp` | Félix Bonfils, *The Temple of the Sun at Baalbec*, c. 1870 | The Met 262989 · https://www.metmuseum.org/art/collection/search/262989 | CC0 |

这些图都转成了项目的雾蓝/奶白色调，并降低了对比。改动后的版本同样按 CC0 提供。
All were recoloured to the project palette (misty blue / ivory) with softened contrast. The derivatives are released under CC0 as well.

## 4. `v8.html` 内联 PNG（本项目 AI 生成）

除第 1 节已说明的「Nocturne」拱窗图外，`src/v8.html` 还有下列 **29 张不同的内联 PNG**。它们全部按原字节保留，未删除、替换或重新编码。**作者已确认：全部为本项目用文字提示 AI 生成并抠图的素材（2026-10-26）/ AI-generated for this project from text prompts.** 与仓库其余原创素材一样按 MIT 发布。

| # | 位置 | 尺寸 | 用途 | 来源状态 |
|---|---|---|---|---|
| 1 | `src/v8.html:618`，rail `--i:0`，Nouveau / 新的对话 | 90×128 px | 左侧导航吊牌位图；默认构建替换为 `r2v/gen/t_new.png` | 本项目 AI 生成 |
| 2 | `src/v8.html:618`，rail `--i:1`，Mémoire / 历史 | 65×128 px | 左侧导航吊牌位图；默认构建替换为 `r2v/gen/t_history.png` | 本项目 AI 生成 |
| 3 | `src/v8.html:618`，rail `--i:2`，Dossiers / 文件 | 92×128 px | 左侧导航吊牌位图；默认构建替换为 `r2v/gen/t_files.png` | 本项目 AI 生成 |
| 4 | `src/v8.html:618`，rail `--i:3`，Chercher / 搜索 | 110×128 px | 左侧导航吊牌位图；默认构建替换为 `r2v/gen/t_search.png` | 本项目 AI 生成 |
| 5 | `src/v8.html:618`，rail `--i:4`，Terminal / 终端 | 55×128 px | 左侧导航吊牌位图；默认构建替换为 `r2v/gen/t_terminal.png` | 本项目 AI 生成 |
| 6 | `src/v8.html:618`，rail `--i:5`，Modèle / 模型 | 105×128 px | 左侧导航吊牌位图；默认构建替换为 `r2v/gen/t_model.png` | 本项目 AI 生成 |
| 7 | `src/v8.html:618`，rail `--i:6`，Trésors / 收藏 | 81×128 px | 左侧导航吊牌位图；默认构建替换为 `r2v/gen/t_fav.png` | 本项目 AI 生成 |
| 8 | `src/v8.html:618`，rail `--i:7`，Parure / 外观 | 100×128 px | 左侧导航吊牌位图；默认构建替换为 `r2v/gen/t_look.png` | 本项目 AI 生成 |
| 9 | `src/v8.html:618`，rail `--i:9`，Compte / 账户 | 97×128 px | 左侧导航吊牌位图；默认构建替换为 `r2v/gen/t_account.png` | 本项目 AI 生成 |
| 10 | `src/v8.html:618`，rail `--i:10`，Réglages / 设置 | 65×128 px | 左侧导航吊牌位图；默认构建替换为 `r2v/gen/t_settings.png` | 本项目 AI 生成 |
| 11 | `src/v8.html:619`，`.folio > img.fbow` | 200×240 px | 右侧卷宗栏的蝴蝶结装饰 | 本项目 AI 生成 |
| 12 | `src/v8.html:688`，`.field > img.fbow` | 79×150 px | 输入框左侧的蝴蝶结装饰 | 本项目 AI 生成 |
| 13 | `src/v8.html:691`，`.send > img` | 124×150 px | 发送按钮图案 | 本项目 AI 生成 |
| 14 | `src/v8.html:815`，贴纸池 `P[0]` | 88×170 px | 随机装饰贴纸 | 本项目 AI 生成 |
| 15 | `src/v8.html:815`，贴纸池 `P[1]` | 170×91 px | 随机装饰贴纸 | 本项目 AI 生成 |
| 16 | `src/v8.html:815`，贴纸池 `P[2]` | 135×170 px | 随机装饰贴纸 | 本项目 AI 生成 |
| 17 | `src/v8.html:815`，贴纸池 `P[3]` | 137×170 px | 随机装饰贴纸 | 本项目 AI 生成 |
| 18 | `src/v8.html:815`，贴纸池 `P[4]` | 119×170 px | 随机装饰贴纸 | 本项目 AI 生成 |
| 19 | `src/v8.html:815`，贴纸池 `P[5]` | 85×170 px | 随机装饰贴纸 | 本项目 AI 生成 |
| 20 | `src/v8.html:815`，贴纸池 `P[6]` | 149×170 px | 随机装饰贴纸 | 本项目 AI 生成 |
| 21 | `src/v8.html:815`，贴纸池 `P[7]` | 125×170 px | 随机装饰贴纸 | 本项目 AI 生成 |
| 22 | `src/v8.html:815`，贴纸池 `P[8]` | 107×170 px | 随机装饰贴纸 | 本项目 AI 生成 |
| 23 | `src/v8.html:815`，贴纸池 `P[9]` | 147×170 px | 随机装饰贴纸 | 本项目 AI 生成 |
| 24 | `src/v8.html:815`，贴纸池 `P[10]` | 126×170 px | 随机装饰贴纸 | 本项目 AI 生成 |
| 25 | `src/v8.html:815`，贴纸池 `P[11]` | 67×170 px | 随机装饰贴纸 | 本项目 AI 生成 |
| 26 | `src/v8.html:815`，贴纸池 `P[12]` | 108×170 px | 随机装饰贴纸 | 本项目 AI 生成 |
| 27 | `src/v8.html:815`，贴纸池 `P[13]` | 117×170 px | 随机装饰贴纸 | 本项目 AI 生成 |
| 28 | `src/v8.html:815`，贴纸池 `P[14]` | 170×142 px | 随机装饰贴纸 | 本项目 AI 生成 |
| 29 | `src/v8.html:815`，贴纸池 `P[15]` | 86×170 px | 随机装饰贴纸 | 本项目 AI 生成 |

## 5. 字体 / Fonts

许可证全文在 `licenses/fonts/`。很多字体只嵌入了子集（按 SIL OFL 1.1 第 1 节，子集化属于修改版本）。
Full license texts are in `licenses/fonts/`. Many are embedded as subsets, which counts as a Modified Version under SIL OFL 1.1.

| 文件 / file | 字体 / family | 许可 / license |
|---|---|---|
| `src/s2v/tw.woff`, `twb.woff` | Courier Prime Regular / Bold (subset) | SIL OFL 1.1 |
| `src/s2v/np.woff`, `npr.woff` | Libre Baskerville Bold / Regular 的子集与静态实例；name 表已改名为 **TrianonBaskerville Bold / Regular** | SIL OFL 1.1 |
| `src/s2v/pinyonx.woff`, `src/o1v/a/pinyon.woff2`, `src/fonts/PinyonScript.ttf` | Pinyon Script | SIL OFL 1.1 |
| `src/o1v/a/corm.woff2`, `src/v8.html` 里内联的 CormI / inline CormI in `src/v8.html` | Cormorant Garamond Light Italic | SIL OFL 1.1 |
| `src/o1v/a/play.woff2` | Playfair Display 子集；name 表与 CSS 已改名为 **TrianonPlayfair** | SIL OFL 1.1 |
| `src/o1v/a/bodoni.woff2` | Bodoni Moda | SIL OFL 1.1 |
| `src/o1v/a/mono.woff2` | IBM Plex Mono 子集；name 表与 CSS 已改名为 **TrianonPlexMono** | SIL OFL 1.1 |
| `src/b12v/fonts/jbm_*.woff2` | JetBrains Mono | SIL OFL 1.1 |
| `src/o1v/a/frak.woff2` | UnifrakturMaguntia 的子集，按 OFL 保留字体名条款在 name 表里改名为 "TrianonFraktur" / subset of UnifrakturMaguntia, renamed "TrianonFraktur" in its name table per the OFL Reserved Font Name clause | SIL OFL 1.1 |
| `src/o1v/a/elite.woff2` | Special Elite | Apache License 2.0 |
| `src/music/glyphs.json` | Noto Music 的谱号与升号轮廓（JSON 提取，不是嵌入式字体文件）；来源：https://github.com/notofonts/music | SIL OFL 1.1，见 `licenses/fonts/OFL-notomusic.txt` |

Libre Baskerville、Playfair Display、IBM Plex Mono 的原 OFL 文本均原样保留；改名映射见 `licenses/fonts/RENAMED-FONTS.txt`。Noto Music 轮廓由 `src/build_v11.py` 读取并用于谱号/升号图形。

旧版用过的 URW++ 字体（Nimbus Mono PS、C059，许可是 AGPL-3.0 加字体例外）已经全部换成上表里的 OFL 字体。
Earlier builds used URW++ Nimbus Mono PS and C059 (AGPL-3.0 + font exception); they have been replaced by the OFL fonts above.

## 6. 名称 / Names

「Kimi」「Kimi Code」是 Moonshot AI 的名称。本项目是非官方的界面概念作品，和 Moonshot AI 没有关联，也没有得到它的认可。仓库里没有任何官方 logo 或官方截图；开场字标和邮戳都是用开源字体重新排的字。
"Kimi" and "Kimi Code" are names of Moonshot AI. This is an unofficial UI concept, not affiliated with or endorsed by Moonshot AI. No official logo or screenshot is included; the opening wordmark and postmarks are typeset from open fonts.
