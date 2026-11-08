from __future__ import annotations

import html
import json
import re
import sys
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
)


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "scripts" / "docs" / "calendar_curator_guide_content.json"
MD_OUT = ROOT / "docs" / "CALENDAR_CURATOR_GUIDE.md"
HTML_OUT = ROOT / "docs" / "guides" / "calendar-curator-guide.html"
PDF_OUT = ROOT / "output" / "pdf" / "daniel-franzese-calendar-curator-guide.pdf"

RASPBERRY = "#9F2E55"
INK = "#1F2730"
MUTED = "#5B6670"
PAPER = "#F8F4EF"
BLUSH = "#F3E1E5"
LINE = "#D9C9CC"


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def md_block(block: dict) -> str:
    kind = block["type"]
    if kind == "paragraph":
        return block["text"]
    if kind == "callout":
        return f"> **{block['label']}:** {block['text']}"
    if kind == "heading":
        return f"### {block['text']}"
    if kind == "bullets":
        return "\n".join(f"- {item}" for item in block["items"])
    if kind == "steps":
        return "\n".join(f"{index}. {item}" for index, item in enumerate(block["items"], start=1))
    if kind == "checklist":
        return "\n".join(f"- [ ] {item}" for item in block["items"])
    if kind == "template":
        body = "\n".join(block["lines"])
        return f"**{block['name']}**\n\n{block['note']}\n\n```text\n{body}\n```"
    if kind == "table":
        headers = block["headers"]
        rows = block["rows"]
        lines = ["| " + " | ".join(headers) + " |", "| " + " | ".join("---" for _ in headers) + " |"]
        lines.extend("| " + " | ".join(row) + " |" for row in rows)
        return "\n".join(lines)
    if kind == "links":
        return "\n".join(f"- [{label}]({url})" for label, url in block["items"])
    raise ValueError(f"Unknown block type: {kind}")


def build_markdown(data: dict) -> str:
    chunks = [f"# {data['title']}", "", data["kicker"], "", data["intro"], ""]
    for section in data["sections"]:
        chunks.extend([f"## {section['title']}", "", section["intro"], ""])
        for block in section["blocks"]:
            chunks.extend([md_block(block), ""])
    return "\n".join(chunks)


def html_block(block: dict, template_index: int) -> str:
    kind = block["type"]
    if kind == "paragraph":
        return f"<p>{esc(block['text'])}</p>"
    if kind == "callout":
        return f"<aside class=\"callout\"><h3>{esc(block['label'])}</h3><p>{esc(block['text'])}</p></aside>"
    if kind == "heading":
        return f"<h3>{esc(block['text'])}</h3>"
    if kind in {"bullets", "checklist"}:
        klass = "checklist" if kind == "checklist" else ""
        items = "".join(f"<li>{'&#9744; ' if kind == 'checklist' else ''}{esc(item)}</li>" for item in block["items"])
        return f"<ul class=\"{klass}\">{items}</ul>"
    if kind == "steps":
        return "<ol>" + "".join(f"<li>{esc(item)}</li>" for item in block["items"]) + "</ol>"
    if kind == "template":
        template_id = f"template-{template_index}"
        text = "\n".join(block["lines"])
        return (
            f"<div class=\"template\"><div class=\"template-head\"><h3>{esc(block['name'])}</h3>"
            f"<button type=\"button\" class=\"copy-button\" data-copy-target=\"{template_id}\" aria-describedby=\"{template_id}-status\">Copy template</button></div>"
            f"<p>{esc(block['note'])}</p><pre id=\"{template_id}\" tabindex=\"0\"><code>{esc(text)}</code></pre>"
            f"<p id=\"{template_id}-status\" class=\"copy-status\" role=\"status\" aria-live=\"polite\"></p></div>"
        )
    if kind == "table":
        head = "".join(f"<th scope=\"col\">{esc(value)}</th>" for value in block["headers"])
        rows = "".join("<tr>" + "".join(f"<td>{esc(value)}</td>" for value in row) + "</tr>" for row in block["rows"])
        return f"<div class=\"table-wrap\"><table><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table></div>"
    if kind == "links":
        return "<ul class=\"source-links\">" + "".join(f"<li><a href=\"{esc(url)}\">{esc(label)}</a></li>" for label, url in block["items"]) + "</ul>"
    raise ValueError(f"Unknown block type: {kind}")


def build_html(data: dict) -> str:
    sections = []
    template_index = 0
    for index, section in enumerate(data["sections"]):
        blocks = []
        for block in section["blocks"]:
            if block["type"] == "template":
                template_index += 1
            blocks.append(html_block(block, template_index))
        sections.append(
            f"<section class=\"guide-section{' page-break' if index else ''}\" aria-labelledby=\"section-{index}\">"
            f"<h2 id=\"section-{index}\">{esc(section['title'])}</h2><p class=\"section-intro\">{esc(section['intro'])}</p>"
            + "".join(blocks) + "</section>"
        )
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(data['title'])}</title>
<style>
:root {{ --ink:{INK}; --muted:{MUTED}; --raspberry:{RASPBERRY}; --paper:{PAPER}; --blush:{BLUSH}; --line:{LINE}; }}
* {{ box-sizing:border-box; }}
html {{ background:#e9e1dc; }}
body {{ margin:0; color:var(--ink); background:var(--paper); font:16px/1.55 'Segoe UI', Arial, Helvetica, sans-serif; }}
main {{ max-width:980px; margin:0 auto; padding:clamp(22px,5vw,64px); background:var(--paper); min-height:100vh; }}
.masthead {{ border-top:9px solid var(--raspberry); padding-top:28px; margin-bottom:40px; }}
.kicker {{ margin:0 0 10px; color:var(--raspberry); font:700 12px/1.2 Arial, sans-serif; letter-spacing:.12em; text-transform:uppercase; }}
h1,h2,h3 {{ font-family:'Segoe UI', Arial, Helvetica, sans-serif; line-height:1.1; }}
h1 {{ max-width:760px; margin:0 0 14px; font-size:clamp(34px,5vw,58px); letter-spacing:-.04em; }}
h2 {{ margin:0 0 14px; font-size:clamp(25px,3vw,36px); color:var(--raspberry); }}
h3 {{ margin:24px 0 8px; font-size:18px; }}
p {{ max-width:75ch; margin:0 0 14px; }}
.intro {{ font-size:20px; max-width:64ch; color:#39424a; }}
.guide-section {{ padding:28px 0 8px; border-top:1px solid var(--line); }}
.guide-section:first-of-type {{ border-top:0; }}
.section-intro {{ font-size:18px; color:#39424a; margin-bottom:22px; }}
li {{ margin:.4em 0; }}
ol,ul {{ padding-left:1.45em; max-width:78ch; }}
.callout {{ background:var(--blush); border-left:5px solid var(--raspberry); padding:16px 18px 10px; margin:20px 0; }}
.callout h3 {{ color:var(--raspberry); margin-top:0; font-size:15px; text-transform:uppercase; letter-spacing:.06em; }}
.callout p {{ margin-bottom:4px; }}
.template {{ border:1px solid var(--line); background:#fff; margin:20px 0; padding:16px; border-radius:6px; }}
.template-head {{ display:flex; gap:12px; align-items:center; justify-content:space-between; }}
.template h3 {{ margin:0; color:var(--raspberry); }}
.template p {{ font-size:15px; color:var(--muted); }}
pre {{ white-space:pre-wrap; margin:12px 0 8px; padding:14px; border-radius:4px; background:#26313a; color:#fff; font:14px/1.55 Consolas, 'Courier New', monospace; overflow:auto; }}
button {{ font:700 14px Arial, sans-serif; border:2px solid var(--raspberry); background:#fff; color:var(--raspberry); border-radius:999px; padding:8px 13px; cursor:pointer; }}
.copy-button {{ min-height:44px; }}
button:hover,button:focus-visible {{ background:var(--raspberry); color:#fff; outline:3px solid #d99aae; outline-offset:2px; }}
.copy-status {{ min-height:1.2em; margin:0; color:var(--raspberry); font:700 13px/1.3 Arial, sans-serif; }}
.table-wrap {{ overflow-x:auto; margin:18px 0; }}
table {{ border-collapse:collapse; width:100%; min-width:560px; font-size:15px; }}
th,td {{ border:1px solid var(--line); text-align:left; vertical-align:top; padding:10px; }}
th {{ background:#ead0d7; color:#532034; font:700 13px Arial, sans-serif; }}
.checklist {{ list-style:none; padding-left:0; }}
.source-links a {{ color:var(--raspberry); }}
:focus-visible {{ outline:3px solid #d99aae; outline-offset:3px; }}
@media (max-width:650px) {{ main {{ padding:24px 18px; }} .template-head {{ align-items:flex-start; flex-direction:column; }} table {{ min-width:0; font-size:14px; }} th,td {{ padding:8px; }} }}
@media print {{
  html,body,main {{ background:#fff; }}
  main {{ max-width:none; padding:0; }}
  .masthead {{ margin-bottom:24px; }}
  .page-break {{ break-before:page; }}
  .copy-button {{ display:none; }}
  pre, pre code {{ background:#fff; color:#000; border:1px solid #888; }}
  .template {{ break-inside:avoid; }}
  a {{ color:inherit; text-decoration:none; }}
  a::after {{ content:' <' attr(href) '>'; font:9px Arial, sans-serif; }}
  .source-links a::after {{ content:none; }}
}}
</style>
</head>
<body>
<main>
  <header class="masthead">
    <p class="kicker">{esc(data['kicker'])}</p>
    <h1>{esc(data['title'])}</h1>
    <p class="intro">{esc(data['intro'])}</p>
  </header>
  {''.join(sections)}
</main>
<script>
function selectTemplate(pre) {{
  const range = document.createRange();
  range.selectNodeContents(pre);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  pre.focus();
}}
async function copyTemplate(button) {{
  const pre = document.getElementById(button.dataset.copyTarget);
  const status = document.getElementById(button.getAttribute('aria-describedby'));
  const text = pre.innerText;
  let copied = false;
  try {{
    if (navigator.clipboard && window.isSecureContext) {{
      await navigator.clipboard.writeText(text);
      copied = true;
    }}
  }} catch (error) {{ copied = false; }}
  if (!copied) {{
    selectTemplate(pre);
    try {{ copied = document.execCommand('copy'); }} catch (error) {{ copied = false; }}
  }}
  if (copied) {{
    status.textContent = 'Copied. Paste into the Google Calendar Description field.';
  }} else {{
    status.textContent = 'Copy was blocked. The template is selected; press Ctrl+C, then paste it into Description.';
  }}
  button.focus();
}}
document.querySelectorAll('.copy-button').forEach((button) => {{
  button.addEventListener('click', () => copyTemplate(button));
}});
</script>
</body>
</html>
'''


def para(text: str, style: ParagraphStyle) -> Paragraph:
    safe = html.escape(text).replace("\n", "<br/>")
    return Paragraph(safe, style)


def pdf_story(data: dict, styles: dict) -> list:
    story = []
    story.append(Paragraph(esc(data["kicker"]).upper(), styles["guide_kicker"]))
    story.append(Spacer(1, 0.12 * inch))
    story.append(Paragraph(esc(data["title"]), styles["guide_title"]))
    story.append(Spacer(1, 0.12 * inch))
    story.append(para(data["intro"], styles["guide_intro"]))
    story.append(Spacer(1, 0.22 * inch))
    template_index = 0
    for section_index, section in enumerate(data["sections"]):
        if section_index == 1:
            story.append(PageBreak())
        story.append(Paragraph(esc(section["title"]), styles["guide_h2"]))
        story.append(para(section["intro"], styles["guide_section_intro"]))
        for block in section["blocks"]:
            kind = block["type"]
            if kind == "paragraph":
                story.append(para(block["text"], styles["guide_body"]))
            elif kind == "heading":
                story.append(Spacer(1, 0.07 * inch))
                story.append(Paragraph(esc(block["text"]), styles["guide_h3"]))
            elif kind in {"bullets", "steps", "checklist"}:
                for index, item in enumerate(block["items"], start=1):
                    prefix = f"{index}. " if kind == "steps" else ("- [ ] " if kind == "checklist" else "- ")
                    story.append(para(prefix + item, styles["guide_body"]))
            elif kind == "callout":
                callout = Table([[Paragraph(esc(block["label"]).upper(), styles["guide_callout_label"])], [para(block["text"], styles["guide_callout_body"])]] , colWidths=[6.95 * inch])
                callout.setStyle(TableStyle([
                    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(BLUSH)),
                    ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor(LINE)),
                    ("LINEBEFORE", (0, 0), (0, -1), 4, colors.HexColor(RASPBERRY)),
                    ("LEFTPADDING", (0, 0), (-1, -1), 11),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 11),
                    ("TOPPADDING", (0, 0), (-1, 0), 8),
                    ("BOTTOMPADDING", (0, 0), (-1, 0), 1),
                    ("TOPPADDING", (0, 1), (-1, 1), 1),
                    ("BOTTOMPADDING", (0, 1), (-1, 1), 8),
                ]))
                story.append(Spacer(1, 0.08 * inch))
                story.append(callout)
                story.append(Spacer(1, 0.08 * inch))
            elif kind == "template":
                template_index += 1
                text = "\n".join(block["lines"])
                box = Table([[Paragraph(esc(block["name"]), styles["guide_template_head"])], [para(block["note"], styles["guide_template_note"])], [Paragraph(esc(text).replace("\n", "<br/>"), styles["guide_template_code"])]] , colWidths=[6.95 * inch])
                box.setStyle(TableStyle([
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(BLUSH)),
                    ("BACKGROUND", (0, 1), (-1, 1), colors.white),
                    ("BACKGROUND", (0, 2), (-1, 2), colors.HexColor("#26313A")),
                    ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor(LINE)),
                    ("LEFTPADDING", (0, 0), (-1, -1), 10),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                    ("TOPPADDING", (0, 0), (-1, -1), 7),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                ]))
                story.append(KeepTogether([Spacer(1, 0.06 * inch), box, Spacer(1, 0.06 * inch)]))
            elif kind == "table":
                table_data = [[Paragraph(esc(h), styles["guide_table_head"]) for h in block["headers"]]]
                table_data.extend([[para(value, styles["guide_table_body"]) for value in row] for row in block["rows"]])
                col_widths = [1.85 * inch, 5.1 * inch] if len(block["headers"]) == 2 else None
                table = Table(table_data, colWidths=col_widths, repeatRows=1, hAlign="LEFT")
                table.setStyle(TableStyle([
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#EAD0D7")),
                    ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor(LINE)),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 7),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ]))
                story.append(Spacer(1, 0.05 * inch))
                story.append(table)
                story.append(Spacer(1, 0.05 * inch))
            elif kind == "links":
                for label, url in block["items"]:
                    story.append(Paragraph(f"- <link href=\"{url}\" color=\"{RASPBERRY}\">{esc(label)}</link>", styles["guide_body"]))
    return story


class GuideDocTemplate(BaseDocTemplate):
    def __init__(self, filename: str, **kwargs):
        super().__init__(filename, **kwargs)
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id="normal")
        self.addPageTemplates([PageTemplate(id="guide", frames=frame, onPage=self.draw_footer)])

    def draw_footer(self, canvas, doc):
        canvas.saveState()
        canvas.setStrokeColor(colors.HexColor(LINE))
        canvas.setLineWidth(0.5)
        canvas.line(doc.leftMargin, 0.45 * inch, LETTER[0] - doc.rightMargin, 0.45 * inch)
        canvas.setFont("Helvetica", 7.5)
        canvas.setFillColor(colors.HexColor(MUTED))
        canvas.drawString(doc.leftMargin, 0.28 * inch, "Daniel Franzese / Calendar curator guide")
        canvas.drawRightString(LETTER[0] - doc.rightMargin, 0.28 * inch, f"Page {doc.page}")
        canvas.restoreState()


def build_pdf(data: dict) -> None:
    styles = getSampleStyleSheet()
    custom_styles = {
        "guide_kicker": ParagraphStyle("guide_kicker", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8.5, leading=10, textColor=colors.HexColor(RASPBERRY), spaceAfter=2),
        "guide_title": ParagraphStyle("guide_title", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=25, leading=28, textColor=colors.HexColor(INK), spaceAfter=2),
        "guide_intro": ParagraphStyle("guide_intro", parent=styles["Normal"], fontName="Helvetica", fontSize=11, leading=14, textColor=colors.HexColor("#39424A"), spaceAfter=4),
        "guide_h2": ParagraphStyle("guide_h2", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=15.5, leading=18, textColor=colors.HexColor(RASPBERRY), spaceBefore=0, spaceAfter=7),
        "guide_h3": ParagraphStyle("guide_h3", parent=styles["Heading3"], fontName="Helvetica-Bold", fontSize=13, leading=16, textColor=colors.HexColor(INK), spaceBefore=8, spaceAfter=7),
        "guide_section_intro": ParagraphStyle("guide_section_intro", parent=styles["Normal"], fontName="Helvetica", fontSize=9.4, leading=12, textColor=colors.HexColor("#39424A"), spaceAfter=7),
        "guide_body": ParagraphStyle("guide_body", parent=styles["Normal"], fontName="Helvetica", fontSize=10.5, leading=14, textColor=colors.HexColor(INK), spaceAfter=7),
        "guide_callout_label": ParagraphStyle("guide_callout_label", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8, leading=9.5, textColor=colors.HexColor(RASPBERRY), spaceAfter=0),
        "guide_callout_body": ParagraphStyle("guide_callout_body", parent=styles["Normal"], fontName="Helvetica", fontSize=8.6, leading=10.7, textColor=colors.HexColor(INK), spaceAfter=0),
        "guide_template_head": ParagraphStyle("guide_template_head", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=9.4, leading=11, textColor=colors.HexColor(RASPBERRY), spaceAfter=0),
        "guide_template_note": ParagraphStyle("guide_template_note", parent=styles["Normal"], fontName="Helvetica", fontSize=9.5, leading=12, textColor=colors.HexColor(MUTED), spaceAfter=0),
        "guide_template_code": ParagraphStyle("guide_template_code", parent=styles["Normal"], fontName="Courier", fontSize=10, leading=14, textColor=colors.white, spaceAfter=0),
        "guide_table_head": ParagraphStyle("guide_table_head", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=9.5, leading=12, textColor=colors.HexColor("#532034"), spaceAfter=0),
        "guide_table_body": ParagraphStyle("guide_table_body", parent=styles["Normal"], fontName="Helvetica", fontSize=9.5, leading=12, textColor=colors.HexColor(INK), spaceAfter=0),
    }
    for name, style in custom_styles.items():
        styles.add(style)
    doc = GuideDocTemplate(
        str(PDF_OUT),
        pagesize=LETTER,
        leftMargin=0.66 * inch,
        rightMargin=0.66 * inch,
        topMargin=0.58 * inch,
        bottomMargin=0.62 * inch,
        title=data["title"],
        author="Daniel Franzese website team",
    )
    doc.build(pdf_story(data, styles))


def main() -> int:
    data = json.loads(SOURCE.read_text(encoding="utf-8-sig"))
    MD_OUT.parent.mkdir(parents=True, exist_ok=True)
    HTML_OUT.parent.mkdir(parents=True, exist_ok=True)
    PDF_OUT.parent.mkdir(parents=True, exist_ok=True)
    MD_OUT.write_text(build_markdown(data), encoding="utf-8")
    HTML_OUT.write_text(build_html(data), encoding="utf-8")
    build_pdf(data)
    print(f"Wrote {MD_OUT}")
    print(f"Wrote {HTML_OUT}")
    print(f"Wrote {PDF_OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
