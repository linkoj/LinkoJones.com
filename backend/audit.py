"""LinkoJones UX Audit — site fetch + AI report generation (Claude Sonnet 4.6)."""
import os
import re
import json
import httpx
from bs4 import BeautifulSoup
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone



FRAMEWORK = [
    ("Evidence", "Usage Data Analytics, Behavioral Insights, Session Recording Insights, On-Site Polling/Surveys, ROI Value Analysis"),
    ("Empathy", "User Testing, On-site Ethnographic Studies, Remote Ethnographic Studies, Task Analysis, Mental Modelling"),
    ("Exploration", "Customer/User Experience Mapping, Opportunity Areas Identification, User Journey Mapping, User Needs vs Business Goals Canvas, Product Performance Map, Process Flow Map, Service Blueprinting"),
    ("Philosophy", "IA Audit, Accessibility, Security, Legal & Compliance, Card Sorting, Labelling, Tree Testing, Navigation Design, Content Hierarchy & Strategy"),
    ("Creativity", "Sketching, Interaction Design, Micro-Copy, Channel & Devices Context Optimization"),
    ("Finesse", "Icon & Graphic Design, Pattern Library Evolution, UI & Visual Design, Micro-Interaction Design, Motion Choreography, Branding"),
    ("Experimentation", "Interactive Prototyping, User Needs Validation, A/B & Multi Variant Testing, MVP & Beta Testing"),
    ("Psychology", "Persuasive Design Techniques, Quantitative Behavioral Science Analysis, Conversion Rate Optimization"),
    ("Collaboration", "Workshop Facilitation, Presentation & Justification, User Testing Facilitation & Involvement, Development Collaboration, Business Goals & Impact Understanding, Design Studios, Service Manual"),
    ("Execution", "Technical Feasibility Design, Platforms & Frameworks, Analytics Tagging & Tracking Process, Technology Stack, Digital Release Process"),
]


def _normalise_url(url: str) -> str:
    url = url.strip()
    if not re.match(r"^https?://", url, re.I):
        url = "https://" + url
    return url


async def fetch_site(url: str) -> dict:
    """Pull grounding signals from the page; never raise — return what we can."""
    url = _normalise_url(url)
    signals = {"url": url, "fetched": False}
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=15.0) as cx:
            r = await cx.get(url, headers={"User-Agent": "Mozilla/5.0 (LinkoJones-UX-Audit)"})
            html = r.text
        soup = BeautifulSoup(html, "lxml")
        for tag in soup(["script", "style", "noscript"]):
            tag.decompose()

        def texts(sel, limit):
            out = []
            for el in soup.select(sel)[:limit]:
                t = " ".join(el.get_text(" ", strip=True).split())
                if t:
                    out.append(t[:160])
            return out

        meta_desc = soup.find("meta", attrs={"name": "description"})
        og_title = soup.find("meta", attrs={"property": "og:title"})
        body_text = " ".join(soup.body.get_text(" ", strip=True).split()) if soup.body else ""
        imgs = soup.find_all("img")
        signals.update({
            "fetched": True,
            "status_code": r.status_code,
            "title": (soup.title.string.strip() if soup.title and soup.title.string else None),
            "og_title": og_title.get("content") if og_title else None,
            "meta_description": meta_desc.get("content") if meta_desc else None,
            "h1": texts("h1", 8),
            "h2": texts("h2", 14),
            "h3": texts("h3", 14),
            "nav_links": texts("nav a", 25),
            "buttons": texts("button, a.btn, .button, [role=button]", 20),
            "forms_count": len(soup.find_all("form")),
            "inputs_count": len(soup.find_all("input")),
            "images_count": len(imgs),
            "images_missing_alt": sum(1 for i in imgs if not i.get("alt")),
            "links_count": len(soup.find_all("a")),
            "word_count": len(body_text.split()),
            "body_excerpt": body_text[:2800],
            "has_viewport_meta": bool(soup.find("meta", attrs={"name": "viewport"})),
            "lang": (soup.html.get("lang") if soup.html else None),
        })
    except Exception as e:
        signals["error"] = f"{type(e).__name__}: {e}"
    return signals


SYSTEM_PROMPT = """You are a Lead UX Consultant at LinkoJones, a senior UX consultancy. \
You produce sharp, opinionated, commercially-aware UX audits. AI is your research and \
acceleration tool — never your replacement. You think in structured frameworks, never in \
random tips.

Voice rules (strict):
- Senior consultancy tone: confident, specific, decision-oriented, commercially aware (conversion, retention, clarity, trust).
- NEVER use phrases like "as an AI", "as a language model", "I cannot", or robotic hedging.
- Be opinionated but grounded. Do NOT invent specific analytics numbers, traffic figures, or conversion rates you cannot verify.
- When a finding is inferred rather than measured, prefix it with: "Heuristic observation based on UX best practices:".
- Reference the page's real content (headings, nav, copy, forms) provided to you wherever possible.

BREVITY (strict, to keep the report scannable): every list item must be ONE punchy line of max ~18 words. Step descriptions max ~22 words. Do not write paragraphs inside lists.

You MUST return ONLY valid JSON (no markdown, no code fences, no prose before/after) matching this exact schema:
{
  "steps": [
    {
      "number": 1,
      "framework": "Evidence",
      "title": "string — a crisp consultancy-style title for this step's focus",
      "description": "1 sentence, consultancy tone, what this lens evaluates (max ~22 words)",
      "findings": ["2-3 grounded one-line findings"],
      "issues": ["0-3 concrete one-line issues; empty array if none"],
      "opportunities": ["2-3 one-line actionable improvements"],
      "confidence": "Low|Medium|High",
      "priority": "Low|Medium|High"
    }
    // ... exactly 10 steps, one per framework in order
  ],
  "executiveSummary": ["5-7 punchy one-line bullets covering key UX risks, conversion opportunities and priority fixes"],
  "impactMap": {
    "highImpactLowEffort": ["3-4 one-line quick wins"],
    "highImpactHighEffort": ["2-3 one-line larger initiatives"]
  },
  "nextAction": {
    "recommendation": "Optimization|Redesign|Full UX Engagement",
    "summary": "2 sentences. Recommend the next step and subtly position LinkoJones consultancy as the partner to deliver it — confident, not salesy."
  }
}

The 10 steps MUST appear in this exact order, each grounded in its methods:
"""
for _i, (_name, _methods) in enumerate(FRAMEWORK, 1):
    SYSTEM_PROMPT += f"Step {_i} — {_name} (methods: {_methods})\n"


def _strip_json(raw: str) -> str:
    raw = raw.strip()
    if raw.startswith("```"):
        raw = re.sub(r"^```[a-zA-Z]*\n?", "", raw)
        raw = re.sub(r"\n?```$", "", raw.strip())
    start, end = raw.find("{"), raw.rfind("}")
    if start != -1 and end != -1:
        raw = raw[start:end + 1]
    return raw


async def generate_audit(signals: dict, industry: str | None, business_goal: str | None) -> dict:
    ctx = {
        "target_url": signals.get("url"),
        "industry": industry or "(not provided)",
        "business_goal": business_goal or "(not provided)",
        "page_signals": signals,
    }
    user_text = (
        "Produce a full UX audit for the following website. Ground every step in the page "
        "signals provided. If the page could not be fetched, clearly rely on heuristic "
        "observations.\n\nCONTEXT:\n" + json.dumps(ctx, ensure_ascii=False)
    )
    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id="ux-audit",
        system_message=SYSTEM_PROMPT,
    ).with_model("anthropic", "claude-sonnet-4-6").with_params(max_tokens=4500)

    reply = ""
    async for ev in chat.stream_message(UserMessage(text=user_text)):
        if isinstance(ev, TextDelta):
            reply += ev.content
        elif isinstance(ev, StreamDone):
            break
    report = json.loads(_strip_json(reply))
    return report
