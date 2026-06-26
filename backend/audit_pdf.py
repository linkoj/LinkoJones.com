"""Render a UX audit report dict into a clean, printable PDF (fpdf2)."""
from datetime import datetime, timezone
from fpdf import FPDF

INK = (12, 22, 48)
BLUE = (0, 75, 200)
GREY = (90, 100, 120)
RED = (240, 84, 84)

_REPL = {
    "\u2018": "'", "\u2019": "'", "\u201c": '"', "\u201d": '"',
    "\u2013": "-", "\u2014": "-", "\u2026": "...", "\u2022": "-",
    "\u20ac": "EUR", "\u2192": "->", "\u2192": "->", "\u00a0": " ",
}


def _t(s):
    s = "" if s is None else str(s)
    for k, v in _REPL.items():
        s = s.replace(k, v)
    return s.encode("latin-1", "replace").decode("latin-1")


class _PDF(FPDF):
    def footer(self):
        self.set_y(-13)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(*GREY)
        self.cell(0, 6, _t("LinkoJones - Senior UX Consultancy  -  linkojones.com"), align="C")
        self.set_text_color(150, 150, 150)
        self.cell(0, 6, _t(f"  -  Page {self.page_no()}"), align="R")


def _bullets(pdf, items):
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(*INK)
    for it in items or []:
        x = pdf.get_x()
        pdf.set_text_color(*BLUE)
        pdf.cell(5, 5.5, _t("-"))
        pdf.set_text_color(*INK)
        pdf.set_x(x + 5)
        pdf.multi_cell(0, 5.5, _t(it))
        pdf.ln(0.5)


def _heading(pdf, text, color=BLUE, size=8):
    pdf.set_font("Helvetica", "B", size)
    pdf.set_text_color(*color)
    pdf.cell(0, 5, _t(text.upper()))
    pdf.ln(6)


def build_pdf(report: dict, url: str, industry=None, business_goal=None) -> bytes:
    pdf = _PDF(format="A4")
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()
    pdf.set_left_margin(18)
    pdf.set_right_margin(18)

    # Title block
    pdf.set_font("Helvetica", "B", 9)
    pdf.set_text_color(*BLUE)
    pdf.cell(0, 5, _t("LINKOJONES  /  UX AUDIT"))
    pdf.ln(8)
    pdf.set_font("Helvetica", "B", 20)
    pdf.set_text_color(*INK)
    pdf.multi_cell(0, 8, _t(url))
    pdf.ln(1)
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(*GREY)
    meta = datetime.now(timezone.utc).strftime("%d %b %Y")
    if industry:
        meta += f"  -  Industry: {industry}"
    if business_goal:
        meta += f"  -  Goal: {business_goal}"
    pdf.cell(0, 5, _t(meta))
    pdf.ln(10)

    # Executive summary
    es = report.get("executiveSummary") or []
    if es:
        _heading(pdf, "Executive summary")
        _bullets(pdf, es)
        pdf.ln(4)

    # Steps
    for s in report.get("steps") or []:
        if pdf.get_y() > 240:
            pdf.add_page()
        pdf.set_font("Helvetica", "B", 12)
        pdf.set_text_color(*INK)
        pdf.multi_cell(0, 6, _t(f"Step {s.get('number')} - {s.get('framework')}: {s.get('title')}"))
        pdf.set_font("Helvetica", "", 8)
        pdf.set_text_color(*GREY)
        pdf.cell(0, 5, _t(f"Confidence: {s.get('confidence')}    Priority: {s.get('priority')}"))
        pdf.ln(6)
        pdf.set_font("Helvetica", "I", 10)
        pdf.set_text_color(*INK)
        pdf.multi_cell(0, 5.2, _t(s.get("description")))
        pdf.ln(1)
        for label, key, color in (("Findings", "findings", INK), ("Issues", "issues", RED), ("Opportunities", "opportunities", BLUE)):
            vals = s.get(key) or []
            if vals:
                pdf.set_font("Helvetica", "B", 8)
                pdf.set_text_color(*color)
                pdf.cell(0, 5, _t(label.upper()))
                pdf.ln(5)
                _bullets(pdf, vals)
        pdf.ln(3)
        pdf.set_draw_color(225, 230, 240)
        pdf.line(18, pdf.get_y(), 192, pdf.get_y())
        pdf.ln(4)

    # Impact map
    im = report.get("impactMap") or {}
    if im:
        if pdf.get_y() > 230:
            pdf.add_page()
        _heading(pdf, "Impact map")
        if im.get("highImpactLowEffort"):
            pdf.set_font("Helvetica", "B", 9)
            pdf.set_text_color(*INK)
            pdf.cell(0, 5, _t("High impact / low effort"))
            pdf.ln(5)
            _bullets(pdf, im["highImpactLowEffort"])
            pdf.ln(2)
        if im.get("highImpactHighEffort"):
            pdf.set_font("Helvetica", "B", 9)
            pdf.set_text_color(*INK)
            pdf.cell(0, 5, _t("High impact / high effort"))
            pdf.ln(5)
            _bullets(pdf, im["highImpactHighEffort"])
        pdf.ln(4)

    # Next action
    na = report.get("nextAction") or {}
    if na:
        if pdf.get_y() > 235:
            pdf.add_page()
        _heading(pdf, f"Suggested next action - {na.get('recommendation','')}")
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(*INK)
        pdf.multi_cell(0, 5.4, _t(na.get("summary")))

    out = pdf.output()
    return bytes(out)
