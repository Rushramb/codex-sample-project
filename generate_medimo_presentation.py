"""
Genereer een uitgebreide Medimo trainings-PowerPoint voor startende voorschrijvers.
Dekt zowel somatische als psychiatrische context.
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt
import pptx.util as util

# ── Kleurpalet (Medimo-stijl: blauw/wit met accenten) ──────────────────────
C_DARKBLUE  = RGBColor(0x00, 0x3A, 0x6E)   # donkerblauw – titels
C_MIDBLUE   = RGBColor(0x00, 0x6A, 0xB0)   # middenblauw – headers
C_LIGHTBLUE = RGBColor(0xD6, 0xEA, 0xF8)   # lichtblauw  – achtergrond accent
C_WHITE     = RGBColor(0xFF, 0xFF, 0xFF)
C_OFFWHITE  = RGBColor(0xF4, 0xF8, 0xFF)
C_ORANGE    = RGBColor(0xE6, 0x7E, 0x22)   # waarschuwing / accent
C_GREEN     = RGBColor(0x1E, 0x8B, 0x4C)   # positief / tip
C_DARKGRAY  = RGBColor(0x2C, 0x3E, 0x50)
C_LIGHTGRAY = RGBColor(0xEC, 0xF0, 0xF1)

SLIDE_W = Inches(13.33)
SLIDE_H = Inches(7.5)


def new_prs():
    prs = Presentation()
    prs.slide_width  = SLIDE_W
    prs.slide_height = SLIDE_H
    return prs


def blank_layout(prs):
    return prs.slide_layouts[6]   # volledig blanco


def add_rect(slide, l, t, w, h, fill_rgb, line_rgb=None, line_width=None):
    shape = slide.shapes.add_shape(
        pptx.enum.shapes.MSO_SHAPE_TYPE.AUTO_SHAPE if False else 1,  # MSO_AUTO_SHAPE_TYPE.RECTANGLE
        l, t, w, h
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_rgb
    if line_rgb:
        shape.line.color.rgb = line_rgb
        if line_width:
            shape.line.width = line_width
    else:
        shape.line.fill.background()
    return shape


def add_textbox(slide, l, t, w, h, text, font_size=18, bold=False,
                color=C_DARKGRAY, align=PP_ALIGN.LEFT, wrap=True,
                font_name="Calibri", italic=False, line_spacing=None):
    txBox = slide.shapes.add_textbox(l, t, w, h)
    tf = txBox.text_frame
    tf.word_wrap = wrap
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(font_size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    run.font.name = font_name
    if line_spacing:
        p.line_spacing = line_spacing
    return txBox


def add_bullet_textbox(slide, l, t, w, h, items, font_size=16,
                       color=C_DARKGRAY, title=None, title_size=18,
                       title_color=C_MIDBLUE, indent_char="▸ ",
                       sub_items=None):
    """
    items: list of str  (of list van (str, [sub_str, ...]) tuples)
    sub_items: optioneel dict {index: [sub1, sub2]} voor sub-bullets
    """
    txBox = slide.shapes.add_textbox(l, t, w, h)
    tf = txBox.text_frame
    tf.word_wrap = True

    first = True
    if title:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.alignment = PP_ALIGN.LEFT
        run = p.add_run()
        run.text = title
        run.font.size = Pt(title_size)
        run.font.bold = True
        run.font.color.rgb = title_color
        run.font.name = "Calibri"

    for i, item in enumerate(items):
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.alignment = PP_ALIGN.LEFT
        p.space_before = Pt(3)
        run = p.add_run()
        run.text = f"{indent_char}{item}"
        run.font.size = Pt(font_size)
        run.font.color.rgb = color
        run.font.name = "Calibri"

        if sub_items and i in sub_items:
            for sub in sub_items[i]:
                ps = tf.add_paragraph()
                ps.alignment = PP_ALIGN.LEFT
                ps.level = 1
                rs = ps.add_run()
                rs.text = f"    – {sub}"
                rs.font.size = Pt(font_size - 2)
                rs.font.color.rgb = C_DARKGRAY
                rs.font.name = "Calibri"
    return txBox


# ═══════════════════════════════════════════════════════════════════════════
#  SLIDE-FABRIEKEN
# ═══════════════════════════════════════════════════════════════════════════

def make_title_slide(prs):
    slide = prs.slides.add_slide(blank_layout(prs))

    # Achtergrond donkerblauw
    add_rect(slide, 0, 0, SLIDE_W, SLIDE_H, C_DARKBLUE)

    # Decoratieve balk rechtsonder
    add_rect(slide, Inches(9), Inches(5.5), Inches(4.33), Inches(2), C_MIDBLUE)

    # Witte diagonale accentlijn (rechthoek gedraaid — simuleer met smalle balk)
    add_rect(slide, Inches(0), Inches(5.2), SLIDE_W, Inches(0.08), C_MIDBLUE)

    # Hoofd-titel
    add_textbox(slide, Inches(0.8), Inches(1.2), Inches(11.5), Inches(1.5),
                "Medimo Voorschrijfsysteem",
                font_size=44, bold=True, color=C_WHITE, align=PP_ALIGN.LEFT)

    add_textbox(slide, Inches(0.8), Inches(2.65), Inches(11), Inches(1.0),
                "Complete Trainingshandleiding voor Startende Voorschrijvers",
                font_size=24, bold=False, color=RGBColor(0xAA, 0xCC, 0xEE),
                align=PP_ALIGN.LEFT)

    # Sub-info blokken
    add_textbox(slide, Inches(0.8), Inches(4.0), Inches(5), Inches(0.5),
                "Somatische & Psychiatrische Context",
                font_size=16, color=C_LIGHTBLUE, align=PP_ALIGN.LEFT)

    add_textbox(slide, Inches(0.8), Inches(4.5), Inches(5), Inches(0.5),
                "GGZ • JGZ • FACT • Klinisch • Ambulant",
                font_size=14, color=RGBColor(0x88, 0xBB, 0xDD), align=PP_ALIGN.LEFT)

    add_textbox(slide, Inches(0.8), Inches(6.5), Inches(8), Inches(0.7),
                "Enovation Medimo  |  Versie 2025-4 / 2026-1  |  © Trainingsmateriaal",
                font_size=12, color=RGBColor(0x66, 0x99, 0xBB), align=PP_ALIGN.LEFT)

    return slide


def make_agenda_slide(prs):
    slide = prs.slides.add_slide(blank_layout(prs))
    add_rect(slide, 0, 0, SLIDE_W, SLIDE_H, C_OFFWHITE)
    add_rect(slide, 0, 0, SLIDE_W, Inches(1.1), C_DARKBLUE)
    add_rect(slide, 0, Inches(1.1), Inches(0.12), Inches(6.4), C_MIDBLUE)

    add_textbox(slide, Inches(0.4), Inches(0.18), Inches(12), Inches(0.75),
                "Programma van deze training", font_size=28, bold=True,
                color=C_WHITE, align=PP_ALIGN.LEFT)

    modules = [
        ("Module 1", "Introductie Medimo — wat is het en waarom?"),
        ("Module 2", "Inloggen, beveiliging & navigatie"),
        ("Module 3", "Cliënt opzoeken & medicatiestatus"),
        ("Module 4", "Nieuw voorschrift starten — 8 stappen"),
        ("Module 5", "De vier doseerweergaves"),
        ("Module 6", "Medicatiebewaking (G-Standaard)"),
        ("Module 7", "Indicaties & reden van voorschrijven"),
        ("Module 8", "Wijzigen, stoppen & corrigeren"),
        ("Module 9", "Specifieke workflows: GGZ / JGZ / FACT"),
        ("Module 10", "Apotheek, GDS & faxrecept"),
        ("Module 11", "AIOS-supervisie via medicatievoorstel"),
        ("Module 12", "Life hacks, valkuilen & tips"),
    ]

    col1 = modules[:6]
    col2 = modules[6:]

    for i, (mod, title) in enumerate(col1):
        y = Inches(1.3) + i * Inches(0.87)
        add_rect(slide, Inches(0.4), y, Inches(1.1), Inches(0.65), C_MIDBLUE)
        add_textbox(slide, Inches(0.42), y + Pt(6), Inches(1.06), Inches(0.55),
                    mod, font_size=11, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
        add_textbox(slide, Inches(1.6), y + Pt(8), Inches(4.8), Inches(0.55),
                    title, font_size=13, color=C_DARKGRAY)

    for i, (mod, title) in enumerate(col2):
        y = Inches(1.3) + i * Inches(0.87)
        add_rect(slide, Inches(7.0), y, Inches(1.1), Inches(0.65), C_MIDBLUE)
        add_textbox(slide, Inches(7.02), y + Pt(6), Inches(1.06), Inches(0.55),
                    mod, font_size=11, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
        add_textbox(slide, Inches(8.2), y + Pt(8), Inches(4.9), Inches(0.55),
                    title, font_size=13, color=C_DARKGRAY)

    return slide


def make_section_divider(prs, module_nr, title, subtitle=""):
    slide = prs.slides.add_slide(blank_layout(prs))
    add_rect(slide, 0, 0, SLIDE_W, SLIDE_H, C_DARKBLUE)
    add_rect(slide, 0, 0, Inches(0.5), SLIDE_H, C_MIDBLUE)
    add_rect(slide, Inches(0.5), Inches(3.3), Inches(12.83), Inches(0.06), C_ORANGE)

    add_textbox(slide, Inches(1.0), Inches(1.5), Inches(4), Inches(1.0),
                f"Module {module_nr}", font_size=20, bold=False,
                color=C_ORANGE, align=PP_ALIGN.LEFT)

    add_textbox(slide, Inches(1.0), Inches(2.3), Inches(11.2), Inches(1.2),
                title, font_size=38, bold=True, color=C_WHITE, align=PP_ALIGN.LEFT)

    if subtitle:
        add_textbox(slide, Inches(1.0), Inches(3.7), Inches(11), Inches(0.8),
                    subtitle, font_size=18, color=RGBColor(0xAA, 0xCC, 0xEE),
                    align=PP_ALIGN.LEFT)
    return slide


def make_content_slide(prs, title, content_func, subtitle=None):
    """content_func(slide) → vult de slide in"""
    slide = prs.slides.add_slide(blank_layout(prs))
    add_rect(slide, 0, 0, SLIDE_W, SLIDE_H, C_OFFWHITE)
    add_rect(slide, 0, 0, SLIDE_W, Inches(1.15), C_DARKBLUE)
    add_rect(slide, 0, Inches(1.15), SLIDE_W, Inches(0.05), C_ORANGE)

    add_textbox(slide, Inches(0.35), Inches(0.17), Inches(12.5), Inches(0.78),
                title, font_size=26, bold=True, color=C_WHITE, align=PP_ALIGN.LEFT)
    if subtitle:
        add_textbox(slide, Inches(0.35), Inches(0.78), Inches(12), Inches(0.35),
                    subtitle, font_size=13, color=RGBColor(0xAA, 0xCC, 0xEE),
                    align=PP_ALIGN.LEFT)

    content_func(slide)
    return slide


def make_two_col_slide(prs, title, left_items, right_items,
                       left_title="", right_title="", subtitle=None):
    def content(slide):
        if left_title:
            add_rect(slide, Inches(0.3), Inches(1.35), Inches(6.0), Inches(0.4), C_MIDBLUE)
            add_textbox(slide, Inches(0.35), Inches(1.37), Inches(5.9), Inches(0.38),
                        left_title, font_size=14, bold=True, color=C_WHITE)
        if right_title:
            add_rect(slide, Inches(6.8), Inches(1.35), Inches(6.0), Inches(0.4), C_MIDBLUE)
            add_textbox(slide, Inches(6.85), Inches(1.37), Inches(5.9), Inches(0.38),
                        right_title, font_size=14, bold=True, color=C_WHITE)

        add_bullet_textbox(slide, Inches(0.3), Inches(1.85), Inches(6.1), Inches(5.4),
                           left_items, font_size=14, color=C_DARKGRAY)
        add_bullet_textbox(slide, Inches(6.8), Inches(1.85), Inches(6.1), Inches(5.4),
                           right_items, font_size=14, color=C_DARKGRAY)

        # Scheidingslijn
        add_rect(slide, Inches(6.6), Inches(1.2), Inches(0.04), Inches(6.1), C_LIGHTBLUE)

    return make_content_slide(prs, title, content, subtitle)


# ═══════════════════════════════════════════════════════════════════════════
#  MODULE-SPECIFIEKE SLIDES
# ═══════════════════════════════════════════════════════════════════════════

def slides_module1(prs):
    """Introductie Medimo"""
    make_section_divider(prs, 1, "Introductie Medimo",
                         "Wat is het systeem en waarom gebruik je het?")

    def content_wat(slide):
        add_rect(slide, Inches(0.3), Inches(1.25), Inches(8.5), Inches(5.9), C_WHITE)
        add_bullet_textbox(slide, Inches(0.5), Inches(1.35), Inches(8.1), Inches(5.7),
                           [
                               "Medimo is een Elektronisch Voorschrijfsysteem (EVS) van Enovation Medimo (De Bilt)",
                               "Medisch Hulpmiddel klasse I onder MDR-regelgeving",
                               "Gecertificeerd: ISO 27001, ISO 9001, ISO 27799, NEN 7510",
                               "Closed-loop medicatieproces: van voorschrijven tot toedienen",
                               "Varianten: Medimo GGZ (voor instellingen), Medimo Secure (algemeen), Medimo ABC (Caribisch NL)",
                           ],
                           font_size=15, color=C_DARKGRAY,
                           title="Wat is Medimo?", title_size=18)

        add_rect(slide, Inches(9.1), Inches(1.25), Inches(3.9), Inches(5.9), C_LIGHTBLUE)
        add_textbox(slide, Inches(9.2), Inches(1.35), Inches(3.7), Inches(0.5),
                    "Closed-loop proces", font_size=14, bold=True, color=C_MIDBLUE)

        stappen = ["1. Voorschrijver", "↓", "2. Apotheek", "↓",
                   "3. Toedienregistratie (eTDR)", "↓", "4. Zorgmedewerker", "↓",
                   "5. Terug naar voorschrijver"]
        for i, s in enumerate(stappen):
            kleur = C_MIDBLUE if not s.startswith("↓") else C_ORANGE
            add_textbox(slide, Inches(9.2), Inches(1.85) + i * Inches(0.58),
                        Inches(3.6), Inches(0.52),
                        s, font_size=13, color=kleur,
                        bold=not s.startswith("↓"))

    make_content_slide(prs, "Wat is Medimo?", content_wat)

    def content_waarom(slide):
        voordelen = [
            "Veiligheid: automatische medicatiebewaking via G-Standaard",
            "Volledigheid: compleet medicatiedossier per cliënt",
            "Efficiëntie: één systeem voor voorschrijven, apotheek en toediening",
            "Juridisch: wettelijk vereiste vastlegging (Wvggz, Wzd, BIG)",
            "Kwaliteit: formularium-bewaking en doseringsadvies ingebouwd",
            "Overdracht: naadloze klinisch↔ambulant transitie",
        ]
        risicos = [
            "Zonder EVS: handmatige fouten in overdracht en dosering",
            "Zonder bewaking: interacties en contra-indicaties gemist",
            "Zonder registratie: juridische kwetsbaarheid bij incident",
            "Zonder LSP-koppeling: thuismedicatie ontbreekt in overzicht",
        ]
        make_two_col_slide.__wrapped__ = False
        add_rect(slide, Inches(0.3), Inches(1.25), Inches(6.1), Inches(5.9), C_WHITE)
        add_rect(slide, Inches(6.8), Inches(1.25), Inches(6.1), Inches(5.9),
                 RGBColor(0xFF, 0xF3, 0xE0))
        add_rect(slide, Inches(0.3), Inches(1.25), Inches(6.1), Inches(0.42), C_GREEN)
        add_textbox(slide, Inches(0.35), Inches(1.27), Inches(6.0), Inches(0.38),
                    "✔  Voordelen van Medimo", font_size=14, bold=True, color=C_WHITE)
        add_rect(slide, Inches(6.8), Inches(1.25), Inches(6.1), Inches(0.42), C_ORANGE)
        add_textbox(slide, Inches(6.85), Inches(1.27), Inches(6.0), Inches(0.38),
                    "⚠  Risico's zonder EVS", font_size=14, bold=True, color=C_WHITE)
        add_bullet_textbox(slide, Inches(0.4), Inches(1.75), Inches(5.9), Inches(5.3),
                           voordelen, font_size=14, color=C_DARKGRAY)
        add_bullet_textbox(slide, Inches(6.9), Inches(1.75), Inches(5.9), Inches(5.3),
                           risicos, font_size=14, color=C_DARKGRAY)

    make_content_slide(prs, "Waarom Medimo gebruiken?", content_waarom)


def slides_module2(prs):
    """Inloggen & beveiliging"""
    make_section_divider(prs, 2, "Inloggen, Beveiliging & Navigatie",
                         "Token, 2FA en het basisscherm")

    def content_login(slide):
        stappen = [
            ("Stap 1", "Ga naar de Medimo-webomgeving van jouw instelling"),
            ("Stap 2", "Voer je gebruikersnaam en wachtwoord in"),
            ("Stap 3", "Voer de 2FA-tokencode in (app of sms-token)"),
            ("Stap 4", "Klik 'Inloggen' → startscherm opent"),
        ]
        for i, (nr, tekst) in enumerate(stappen):
            y = Inches(1.3) + i * Inches(1.1)
            add_rect(slide, Inches(0.3), y, Inches(1.3), Inches(0.75), C_MIDBLUE)
            add_textbox(slide, Inches(0.32), y + Pt(5), Inches(1.26), Inches(0.65),
                        nr, font_size=13, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
            add_rect(slide, Inches(1.7), y, Inches(8.0), Inches(0.75), C_WHITE)
            add_textbox(slide, Inches(1.8), y + Pt(8), Inches(7.8), Inches(0.65),
                        tekst, font_size=14, color=C_DARKGRAY)

        # Waarschuwingsbox
        add_rect(slide, Inches(0.3), Inches(5.8), Inches(12.5), Inches(1.4), C_ORANGE)
        add_textbox(slide, Inches(0.5), Inches(5.85), Inches(12.0), Inches(1.25),
                    "⚠  Beveiligingsregels:  "
                    "Na 3 foutieve pogingen → token tijdelijk gelocked.  "
                    "Gebruik sms-inlog als fallback.  "
                    "Bij definitieve lock → helpdesk tijdens kantooruren bellen.",
                    font_size=13, color=C_WHITE, wrap=True)

    make_content_slide(prs, "Inloggen — stap voor stap", content_login)

    def content_nav(slide):
        add_rect(slide, Inches(0.3), Inches(1.25), Inches(12.5), Inches(5.9), C_WHITE)
        items = [
            "Startscherm: overzicht van je taken, berichten en geselecteerde cliënten",
            "Cliënt zoeken: knop 'Status', veld 'Zoeken in alles', of knop 'Zoek cliënt'",
            "Cliëntstatus: actueel medicatiedossier — startpunt voor alle voorschrijfacties",
            "Medicatiehistorie: via 'Historie'-knop; logt voorschriften, leveringen, signalen, notities",
            "Navigatie: gebruik altijd het menu bovenin of de knoppen — nooit de browser-terug-knop",
            "Uitloggen: altijd uitloggen na gebruik (sessie-timeout is beveiligingsmaatregel)",
        ]
        add_bullet_textbox(slide, Inches(0.5), Inches(1.45), Inches(12.0), Inches(5.4),
                           items, font_size=15, color=C_DARKGRAY,
                           title="Basisnavigatie", title_size=18)

    make_content_slide(prs, "Navigatie & basisscherm", content_nav)


def slides_module3(prs):
    """Cliënt opzoeken"""
    make_section_divider(prs, 3, "Cliënt opzoeken & Medicatiestatus",
                         "Drie manieren, één doel")

    def content(slide):
        methoden = [
            ("Knop 'Status'",
             "Directe toegang als je de cliënt al hebt geselecteerd in je werklijst"),
            ("Veld 'Zoeken in alles'",
             "Typ naam, geboortedatum of BSN — werkt globaal door het systeem"),
            ("Knop 'Zoek cliënt'",
             "Uitgebreid zoekformulier met filters (afdeling, zorgverlener, etc.)"),
        ]
        for i, (methode, uitleg) in enumerate(methoden):
            y = Inches(1.3) + i * Inches(1.4)
            add_rect(slide, Inches(0.3), y, Inches(3.5), Inches(1.1), C_MIDBLUE)
            add_textbox(slide, Inches(0.4), y + Pt(8), Inches(3.3), Inches(0.9),
                        methode, font_size=15, bold=True, color=C_WHITE)
            add_rect(slide, Inches(3.9), y, Inches(9.0), Inches(1.1), C_WHITE)
            add_textbox(slide, Inches(4.0), y + Pt(12), Inches(8.8), Inches(0.9),
                        uitleg, font_size=14, color=C_DARKGRAY)

        # Medicatiestatus uitleg
        add_rect(slide, Inches(0.3), Inches(5.55), Inches(12.5), Inches(1.65), C_LIGHTBLUE)
        add_textbox(slide, Inches(0.5), Inches(5.65), Inches(12.0), Inches(0.4),
                    "Wat zie je in de Medicatiestatus?", font_size=15, bold=True, color=C_MIDBLUE)
        add_textbox(slide, Inches(0.5), Inches(6.05), Inches(12.0), Inches(1.1),
                    "Lopende voorschriften  •  Recente wijzigingen  •  Medicatiebewakingssignalen  "
                    "•  Knoppen voor Nieuw / Wijzigen / Stoppen  •  Historie-knop",
                    font_size=13, color=C_DARKGRAY, wrap=True)

    make_content_slide(prs, "Cliënt opzoeken — 3 methoden", content)


def slides_module4(prs):
    """Nieuw voorschrift — 8 stappen"""
    make_section_divider(prs, 4, "Nieuw Voorschrift Starten",
                         "De 8 stappen die je altijd volgt")

    def content_stappen(slide):
        stappen = [
            ("1", "Klik 'Nieuw' in de cliëntstatus → lijst voorschrijfbare medicatie verschijnt"),
            ("2", "Zoek geneesmiddel in het zoek-/filterveld (standaard: vigerend formularium)"),
            ("3", "Selecteer het middel → doseerscherm opent"),
            ("4", "Kies de juiste doseerweergave (Regulier / Uitgebreid / Schema / Handmatig)"),
            ("5", "Voer dosering in + optionele extra doseerinformatie voor de toedienlijst"),
            ("6", "Kies indicatie/episode uit de indicatietabel"),
            ("7", "Stel startmoment in: Nu / Vandaag / Morgen / Weekdoos; bij kuur ook stopmoment"),
            ("8", "Handel medicatiebewaking af → klik 'Start' → controleer overzicht"),
        ]
        for i, (nr, tekst) in enumerate(stappen[:4]):
            y = Inches(1.3) + i * Inches(1.35)
            add_rect(slide, Inches(0.3), y, Inches(0.6), Inches(0.6), C_ORANGE)
            add_textbox(slide, Inches(0.3), y, Inches(0.6), Inches(0.6),
                        nr, font_size=18, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
            add_rect(slide, Inches(1.0), y, Inches(5.5), Inches(0.6), C_WHITE)
            add_textbox(slide, Inches(1.1), y + Pt(5), Inches(5.3), Inches(0.55),
                        tekst, font_size=12, color=C_DARKGRAY)

        for i, (nr, tekst) in enumerate(stappen[4:]):
            y = Inches(1.3) + i * Inches(1.35)
            add_rect(slide, Inches(7.0), y, Inches(0.6), Inches(0.6), C_MIDBLUE)
            add_textbox(slide, Inches(7.0), y, Inches(0.6), Inches(0.6),
                        nr, font_size=18, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
            add_rect(slide, Inches(7.7), y, Inches(5.4), Inches(0.6), C_WHITE)
            add_textbox(slide, Inches(7.8), y + Pt(5), Inches(5.2), Inches(0.55),
                        tekst, font_size=12, color=C_DARKGRAY)

        add_rect(slide, Inches(0.3), Inches(6.85), Inches(12.5), Inches(0.45), C_GREEN)
        add_textbox(slide, Inches(0.5), Inches(6.88), Inches(12.0), Inches(0.4),
                    "💡 Niet gevonden in formularium? Klik linksonder 'In hele taxe zoeken'",
                    font_size=13, bold=True, color=C_WHITE)

    make_content_slide(prs, "De 8 stappen van een nieuw voorschrift", content_stappen)

    def content_tips(slide):
        add_bullet_textbox(slide, Inches(0.3), Inches(1.3), Inches(12.5), Inches(5.8),
                           [
                               "Controleer altijd of het de juiste cliënt is vóór je 'Start' klikt",
                               "Indicatie selecteren is verplicht voor alle buiten-formularium middelen",
                               "Bij GDS-medicatie: muteer voorkeur op het leveringsmoment van de weekdoos",
                               "Gebruik het tekstveld 'Toelichting voor apotheek' bij spoedprescripties",
                               "Schema-weergave kiezen voor alle op-/afbouwschema's (titraties)",
                               "Controleer na 'Start' altijd het overzicht medicatiebehandeling",
                           ],
                           font_size=15, color=C_DARKGRAY,
                           title="Aandachtspunten bij nieuw voorschrift", title_size=18)

    make_content_slide(prs, "Nieuw voorschrift — Aandachtspunten", content_tips)


def slides_module5(prs):
    """Vier doseerweergaves"""
    make_section_divider(prs, 5, "De Vier Doseerweergaves",
                         "Wanneer gebruik je welke weergave?")

    def content(slide):
        weergaves = [
            ("REGULIER",   C_GREEN,    "80% van de gevallen",
             "Standaard continue, tijdelijk en zo-nodig medicatie\nSnelste invoer, standaard deeltijden\nVoorbeelden: sertraline 1dd50mg, lorazepam zo-nodig"),
            ("UITGEBREID", C_MIDBLUE,  "Afwijkende situaties",
             "Afwijkende toedientijden of toedienweg\n'Andere voorschrijver'/'Extern voorschrift' markering\nMaximale flexibiliteit per moment"),
            ("SCHEMA",     C_ORANGE,   "Op-/afbouwschema's",
             "Titraties SSRI's, methylfenidaat, antipsychotica\nWisselende dosering per datum\nVoorbeeld: sertraline 25→50→100mg in 3 weken"),
            ("HANDMATIG",  C_DARKGRAY, "Individuele dagdosering",
             "Doseerkaart-stijl\nVoorbeeld: acenocoumarol zonder trombosedienst-koppeling\nPer dag/tijdstip individuele dosering"),
        ]
        for i, (naam, kleur, wanneer, uitleg) in enumerate(weergaves):
            x = Inches(0.3) + i * Inches(3.25)
            add_rect(slide, x, Inches(1.25), Inches(3.0), Inches(0.55), kleur)
            add_textbox(slide, x, Inches(1.27), Inches(3.0), Inches(0.5),
                        naam, font_size=14, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
            add_rect(slide, x, Inches(1.82), Inches(3.0), Inches(0.45), C_LIGHTGRAY)
            add_textbox(slide, x + Inches(0.05), Inches(1.84), Inches(2.9), Inches(0.42),
                        wanneer, font_size=11, bold=True, color=C_DARKGRAY, align=PP_ALIGN.CENTER)
            add_rect(slide, x, Inches(2.3), Inches(3.0), Inches(4.8), C_WHITE)
            add_textbox(slide, x + Inches(0.08), Inches(2.4), Inches(2.85), Inches(4.6),
                        uitleg, font_size=12, color=C_DARKGRAY)

        add_rect(slide, Inches(0.3), Inches(7.15), Inches(12.5), Inches(0.2), C_MIDBLUE)
        add_textbox(slide, Inches(0.5), Inches(7.17), Inches(12.0), Inches(0.18),
                    "🔑  Wisselen van weergave: gebruik de blauwe knop in het doseerscherm",
                    font_size=12, bold=True, color=C_WHITE)

    make_content_slide(prs, "De vier doseerweergaves — overzicht", content)

    def content_schema(slide):
        add_rect(slide, Inches(0.3), Inches(1.25), Inches(12.5), Inches(3.5), C_WHITE)
        add_textbox(slide, Inches(0.5), Inches(1.35), Inches(12.0), Inches(0.5),
                    "Voorbeeld: sertraline opbouwschema voor een 14-jarige",
                    font_size=16, bold=True, color=C_MIDBLUE)
        schema_rows = [
            ("Week 1",  "Sertraline 25 mg",  "1× daags 's ochtends", "7 dagen"),
            ("Week 2",  "Sertraline 50 mg",  "1× daags 's ochtends", "7 dagen"),
            ("Week 3+", "Sertraline 100 mg", "1× daags 's ochtends", "Continu"),
        ]
        headers = ["Periode", "Dosis", "Tijdstip", "Duur"]
        col_x = [Inches(0.4), Inches(2.8), Inches(5.8), Inches(9.2)]
        col_w = [Inches(2.2), Inches(2.8), Inches(3.2), Inches(2.4)]

        for j, h in enumerate(headers):
            add_rect(slide, col_x[j], Inches(1.95), col_w[j], Inches(0.42), C_MIDBLUE)
            add_textbox(slide, col_x[j] + Inches(0.05), Inches(1.97),
                        col_w[j] - Inches(0.1), Inches(0.38),
                        h, font_size=13, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)

        for i, row in enumerate(schema_rows):
            bg = C_LIGHTBLUE if i % 2 == 0 else C_WHITE
            for j, cel in enumerate(row):
                add_rect(slide, col_x[j], Inches(2.4) + i * Inches(0.55),
                         col_w[j], Inches(0.52), bg)
                add_textbox(slide, col_x[j] + Inches(0.05),
                            Inches(2.43) + i * Inches(0.55),
                            col_w[j] - Inches(0.1), Inches(0.48),
                            cel, font_size=13, color=C_DARKGRAY, align=PP_ALIGN.CENTER)

        add_rect(slide, Inches(0.3), Inches(4.9), Inches(12.5), Inches(2.3), C_LIGHTBLUE)
        add_textbox(slide, Inches(0.5), Inches(5.0), Inches(12.0), Inches(0.4),
                    "Hoe doe je dit in Schema-weergave?", font_size=15, bold=True, color=C_MIDBLUE)
        instructies = [
            "1.  Kies Nieuw → selecteer sertraline → klik blauwe knop 'Schema'",
            "2.  Voeg doseerstap toe: startdatum Week 1, dosis 25 mg",
            "3.  Klik '+ Stap toevoegen': startdatum Week 2, dosis 50 mg",
            "4.  Klik '+ Stap toevoegen': startdatum Week 3, dosis 100 mg, geen einddatum",
            "5.  Controleer tijdlijn in preview → klik 'Start'",
        ]
        add_textbox(slide, Inches(0.5), Inches(5.45), Inches(12.0), Inches(1.65),
                    "\n".join(instructies), font_size=12, color=C_DARKGRAY)

    make_content_slide(prs, "Schema-weergave — titratie in de praktijk", content_schema)


def slides_module6(prs):
    """Medicatiebewaking"""
    make_section_divider(prs, 6, "Medicatiebewaking (G-Standaard)",
                         "Signalen herkennen en correct afhandelen")

    def content_signalen(slide):
        signalen = [
            ("Interactie",        C_ORANGE,  "Twee middelen beïnvloeden elkaars werking of veiligheid"),
            ("Contra-indicatie",  RGBColor(0xC0,0x39,0x2B), "Middel is onveilig bij bekende aandoening of conditie van cliënt"),
            ("Dubbelmedicatie",   RGBColor(0x88,0x44,0xAA), "Dezelfde werkzame stof al voorgeschreven"),
            ("Doseringsprobleem", C_MIDBLUE, "Dosering buiten adviesrange (over- of onderdosering)"),
            ("Allergie/overgevoeligheid", C_GREEN, "Bekende overgevoeligheid voor het middel of groep"),
        ]
        for i, (naam, kleur, uitleg) in enumerate(signalen):
            y = Inches(1.3) + i * Inches(1.1)
            add_rect(slide, Inches(0.3), y, Inches(3.2), Inches(0.8), kleur)
            add_textbox(slide, Inches(0.4), y + Pt(8), Inches(3.0), Inches(0.65),
                        naam, font_size=13, bold=True, color=C_WHITE)
            add_rect(slide, Inches(3.6), y, Inches(9.1), Inches(0.8), C_WHITE)
            add_textbox(slide, Inches(3.7), y + Pt(10), Inches(8.9), Inches(0.65),
                        uitleg, font_size=13, color=C_DARKGRAY)

        add_rect(slide, Inches(0.3), Inches(6.95), Inches(12.5), Inches(0.35), C_ORANGE)
        add_textbox(slide, Inches(0.5), Inches(6.98), Inches(12.0), Inches(0.3),
                    "🚨  Signalen met asterisk (*) zijn VERPLICHT af te handelen vóór je 'Start' kunt klikken",
                    font_size=13, bold=True, color=C_WHITE)

    make_content_slide(prs, "Typen medicatiebewakingssignalen", content_signalen)

    def content_afhandeling(slide):
        acties = [
            ("NOTITIE",  C_MIDBLUE,
             "Tabblad 'Notities'\nSla klinische redenering op\nWordt automatisch opgeslagen bij 'Start'\nBlijft bewaard in medicatiehistorie"),
            ("BERICHT",  C_GREEN,
             "Tabblad 'Bericht'\nStuur bericht aan betrokken zorgverleners\nSignaal komt automatisch in het onderwerp\nGoed voor apotheek-/specialistoverleg"),
            ("AKKOORD",  C_ORANGE,
             "Klik vierkantje rechts van signaal\nJe bevestigt bewuste keuze\nZichtbaar in historie én voor apotheek\nVerplicht bij asterisk-signalen (*)"),
        ]
        for i, (naam, kleur, uitleg) in enumerate(acties):
            x = Inches(0.3) + i * Inches(4.25)
            add_rect(slide, x, Inches(1.25), Inches(3.95), Inches(0.55), kleur)
            add_textbox(slide, x, Inches(1.27), Inches(3.95), Inches(0.5),
                        naam, font_size=16, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
            add_rect(slide, x, Inches(1.82), Inches(3.95), Inches(4.5), C_WHITE)
            add_textbox(slide, x + Inches(0.1), Inches(1.95), Inches(3.75), Inches(4.3),
                        uitleg, font_size=13, color=C_DARKGRAY)

        add_rect(slide, Inches(0.3), Inches(6.5), Inches(12.5), Inches(0.75), C_LIGHTBLUE)
        add_textbox(slide, Inches(0.5), Inches(6.58), Inches(12.0), Inches(0.6),
                    "💡 Juridisch advies: Sla ALTIJD je klinische redenering op bij overschreven signalen. "
                    "Dit beschermt jou en helpt opvolgers.",
                    font_size=13, color=C_DARKGRAY, wrap=True)

    make_content_slide(prs, "Medicatiebewaking — 3 afhandelingsacties", content_afhandeling)


def slides_module7(prs):
    """Indicaties"""
    make_section_divider(prs, 7, "Indicaties & Reden van Voorschrijven",
                         "Meer dan een administratieve verplichting")

    def content(slide):
        left = [
            "Wettelijk verplicht bij bepaalde middelen (opiumwet, bijzondere verstrekkingen)",
            "Verplicht bij alle buiten-formularium voorschriften",
            "Bepaalt de 'begrijpelijke gebruiksinstructie' voor cliënt en zorgmedewerker",
            "Beïnvloedt medicatiebewaking — doseringsadvies bij OCD vs. depressie verschilt voor SSRI's",
            "Gebruik bestaande episodes uit ECD waar mogelijk",
            "Maak nieuwe episode alleen bij echt nieuwe behandeling",
        ]
        right = [
            "Vrije tekst vermijden — gebruik altijd gestructureerde indicatietabel",
            "Dubbele indicaties voorkomen door bestaande episode te hergebruiken",
            "Verkeerde indicatie → verkeerde bewakingscontext → gemiste signalen",
            "Bij ambulant → klinisch transitie: indicatie blijft actief, geen nieuwe aanmaken",
            "Wvggz/Wzd-context: indicatie essentieel voor juridisch kader vastlegging",
        ]
        make_two_col_slide.__wrapped__ = False
        add_rect(slide, Inches(0.3), Inches(1.25), Inches(6.1), Inches(5.9), C_WHITE)
        add_rect(slide, Inches(6.8), Inches(1.25), Inches(6.1), Inches(5.9),
                 RGBColor(0xFF, 0xF3, 0xE0))
        add_rect(slide, Inches(0.3), Inches(1.25), Inches(6.1), Inches(0.42), C_GREEN)
        add_textbox(slide, Inches(0.35), Inches(1.27), Inches(6.0), Inches(0.38),
                    "Waarom indicaties belangrijk zijn", font_size=13, bold=True, color=C_WHITE)
        add_rect(slide, Inches(6.8), Inches(1.25), Inches(6.1), Inches(0.42), C_ORANGE)
        add_textbox(slide, Inches(6.85), Inches(1.27), Inches(6.0), Inches(0.38),
                    "⚠  Valkuilen", font_size=13, bold=True, color=C_WHITE)
        add_bullet_textbox(slide, Inches(0.4), Inches(1.75), Inches(5.9), Inches(5.3),
                           left, font_size=13, color=C_DARKGRAY)
        add_bullet_textbox(slide, Inches(6.9), Inches(1.75), Inches(5.9), Inches(5.3),
                           right, font_size=13, color=C_DARKGRAY)

    make_content_slide(prs, "Indicaties — waarom en hoe", content)


def slides_module8(prs):
    """Wijzigen, stoppen, corrigeren"""
    make_section_divider(prs, 8, "Wijzigen, Stoppen & Corrigeren",
                         "De juiste actie voor elke situatie")

    def content(slide):
        acties = [
            ("WIJZIGEN",           C_MIDBLUE,
             "Overzicht medicatiebehandeling → knop 'Wijzigen'",
             "Doseringsaanpassing, indicatie-update\nGebeurtenislog blijft intact\nVorige dosering zichtbaar in historie"),
            ("STOPPEN",            RGBColor(0xC0,0x39,0x2B),
             "Overzicht medicatiebehandeling → knop 'Stoppen'",
             "Definitief beëindigen van medicatie\nStopdatum en reden vastleggen\nMedicatie verdwijnt uit actief overzicht"),
            ("TIJDELIJK STOPPEN",  C_ORANGE,
             "Via afzonderlijke functie op medicatieregel",
             "Onderbreking zonder definitief staken\n'Tot nader order' mogelijk\nBlijft zichtbaar als onderbroken"),
            ("CORRIGEREN",         C_GREEN,
             "Overzicht medicatiebehandeling → knop 'Corrigeren'",
             "Fout gecorrigeerd in recente invoer\nWijzigt feitelijke registratie\nAlleen voor recente fouten, niet historisch"),
            ("ANNULEREN",          C_DARKGRAY,
             "Overzicht medicatiebehandeling → knop 'Annuleren'",
             "Ten onrechte ingevoerd, nooit verstrekt\nVerwijdert de regel logisch (niet wissen)\nGebruik bij verkeerde cliënt of dubbele invoer"),
        ]
        for i, (naam, kleur, locatie, uitleg) in enumerate(acties):
            y = Inches(1.25) + i * Inches(1.2)
            add_rect(slide, Inches(0.3), y, Inches(2.0), Inches(0.95), kleur)
            add_textbox(slide, Inches(0.32), y + Pt(6), Inches(1.96), Inches(0.82),
                        naam, font_size=11, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
            add_rect(slide, Inches(2.4), y, Inches(4.0), Inches(0.95), C_LIGHTGRAY)
            add_textbox(slide, Inches(2.5), y + Pt(8), Inches(3.8), Inches(0.82),
                        locatie, font_size=10, color=C_DARKGRAY)
            add_rect(slide, Inches(6.5), y, Inches(6.3), Inches(0.95), C_WHITE)
            add_textbox(slide, Inches(6.6), y + Pt(5), Inches(6.1), Inches(0.88),
                        uitleg, font_size=10, color=C_DARKGRAY)

        add_rect(slide, Inches(0.3), Inches(7.28), Inches(12.5), Inches(0.12), C_ORANGE)

    make_content_slide(prs, "Acties op bestaande medicatie", content)

    def content_verschil(slide):
        add_rect(slide, Inches(0.3), Inches(1.25), Inches(12.5), Inches(3.5), C_WHITE)
        add_textbox(slide, Inches(0.5), Inches(1.35), Inches(12.0), Inches(0.5),
                    "Corrigeren vs. Annuleren — wanneer wat?", font_size=17, bold=True, color=C_MIDBLUE)

        tabel = [
            ("Situatie", "Juiste actie", "Reden"),
            ("Verkeerde dosis ingevoerd, nog niet verstrekt", "Corrigeren", "Fout in recente registratie herstellen"),
            ("Medicatie ingevoerd voor verkeerde cliënt", "Annuleren", "Nooit verstrekt, ten onrechte aangemaakt"),
            ("Dosis moet permanent omhoog", "Wijzigen", "Beleidswijziging, niet een correctie"),
            ("Behandeling definitief gestopt", "Stoppen", "Vastlegging einde medicatiebehandeling"),
            ("Tijdelijk onderbreken (vakantie, OK)", "Tijdelijk stoppen", "Voortzetting gepland na onderbreking"),
        ]
        headers_col_x = [Inches(0.35), Inches(5.2), Inches(8.6)]
        headers_col_w = [Inches(4.65), Inches(3.2), Inches(4.05)]
        for j, h in enumerate(tabel[0]):
            add_rect(slide, headers_col_x[j], Inches(1.95), headers_col_w[j], Inches(0.42), C_MIDBLUE)
            add_textbox(slide, headers_col_x[j] + Inches(0.05), Inches(1.97),
                        headers_col_w[j] - Inches(0.1), Inches(0.38),
                        h, font_size=12, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)

        for i, row in enumerate(tabel[1:]):
            bg = C_LIGHTBLUE if i % 2 == 0 else C_WHITE
            for j, cel in enumerate(row):
                add_rect(slide, headers_col_x[j], Inches(2.4) + i * Inches(0.5),
                         headers_col_w[j], Inches(0.47), bg)
                add_textbox(slide, headers_col_x[j] + Inches(0.05),
                            Inches(2.42) + i * Inches(0.5),
                            headers_col_w[j] - Inches(0.1), Inches(0.43),
                            cel, font_size=11, color=C_DARKGRAY)

    make_content_slide(prs, "Corrigeren vs. Annuleren vs. Stoppen", content_verschil)


def slides_module9(prs):
    """GGZ/JGZ specifiek"""
    make_section_divider(prs, 9, "Specifieke Workflows: GGZ / JGZ / FACT",
                         "Klinisch, ambulant en forensische jeugdzorg")

    def content_transitie(slide):
        add_rect(slide, Inches(0.3), Inches(1.25), Inches(12.5), Inches(2.5), C_WHITE)
        add_textbox(slide, Inches(0.5), Inches(1.35), Inches(12.0), Inches(0.5),
                    "Klinisch ↔ Ambulant transitie — de gouden regel",
                    font_size=17, bold=True, color=C_MIDBLUE)
        add_textbox(slide, Inches(0.5), Inches(1.9), Inches(12.0), Inches(1.7),
                    "Het medicatiedossier loopt CONTINU door bij overgang klinisch ↔ ambulant.\n"
                    "▸  Bij voortzetting van bestaand middel: NIET nieuw starten — laat ongewijzigd of gebruik 'Wijzigen'\n"
                    "▸  Alleen nieuw starten als het daadwerkelijk een nieuw middel of nieuwe indicatie betreft\n"
                    "▸  Dit voorkomt dubbele voorschriften en fouten in medicatiebewaking",
                    font_size=13, color=C_DARKGRAY, wrap=True)

        scenarios = [
            ("Opname → ontslag naar ambulant",
             "Medicatie ongewijzigd laten als dosering/indicatie gelijk blijft",
             C_GREEN),
            ("Ambulant → crisisopname",
             "Bestaand voorschrift actief — alleen nieuwe of gewijzigde middelen toevoegen/aanpassen",
             C_MIDBLUE),
            ("FACT-team → klinische afdeling",
             "Zorg voor warme overdracht én Medimo-controle vóór opname door klinische arts",
             C_ORANGE),
        ]
        for i, (scen, aanpak, kleur) in enumerate(scenarios):
            y = Inches(4.0) + i * Inches(1.05)
            add_rect(slide, Inches(0.3), y, Inches(0.18), Inches(0.8), kleur)
            add_rect(slide, Inches(0.55), y, Inches(5.5), Inches(0.8), C_LIGHTBLUE)
            add_textbox(slide, Inches(0.65), y + Pt(5), Inches(5.3), Inches(0.72),
                        scen, font_size=12, bold=True, color=C_DARKGRAY)
            add_rect(slide, Inches(6.2), y, Inches(6.6), Inches(0.8), C_WHITE)
            add_textbox(slide, Inches(6.3), y + Pt(5), Inches(6.4), Inches(0.72),
                        aanpak, font_size=12, color=C_DARKGRAY)

    make_content_slide(prs, "Klinisch ↔ Ambulant transitie", content_transitie)

    def content_ggz(slide):
        left = [
            "LSP-actualiteitscontrole apotheek dagelijks aanbevolen",
            "Zonder LSP: thuismedicatie ontbreekt → bewaking mist signalen",
            "Wvggz/Wzd: indicatie en juridisch kader altijd vastleggen",
            "Dwangmedicatie: apart protocol; consulteer juridisch kader",
            "SSRI-titraties via Schema-weergave (1 voorschrift, niet 3 mutaties)",
            "Methylfenidaat: weeklevering GDS afstemmen op schoolrooster",
        ]
        right = [
            "JGZ: vaccinaties via apart formulier (voorschrift + registratie + batchnummer)",
            "Kinderformularium raadplegen voor gewichtsgebonden doseringen",
            "Ouderlijk gezag documenteren bij minderjarigen",
            "Jeugdwet-kaders: toestemming behandeling vastleggen",
            "Bij twijfel doseringen jeugd: altijd Kinderformularium.nl",
            "FACT-team: zorg dat alle teamleden Medimo-toegang en -rechten hebben",
        ]
        add_rect(slide, Inches(0.3), Inches(1.25), Inches(6.1), Inches(5.9), C_WHITE)
        add_rect(slide, Inches(6.8), Inches(1.25), Inches(6.1), Inches(5.9), C_OFFWHITE)
        add_rect(slide, Inches(0.3), Inches(1.25), Inches(6.1), Inches(0.42), C_MIDBLUE)
        add_textbox(slide, Inches(0.35), Inches(1.27), Inches(6.0), Inches(0.38),
                    "GGZ-specifiek", font_size=14, bold=True, color=C_WHITE)
        add_rect(slide, Inches(6.8), Inches(1.25), Inches(6.1), Inches(0.42), C_GREEN)
        add_textbox(slide, Inches(6.85), Inches(1.27), Inches(6.0), Inches(0.38),
                    "JGZ-specifiek", font_size=14, bold=True, color=C_WHITE)
        add_bullet_textbox(slide, Inches(0.4), Inches(1.75), Inches(5.9), Inches(5.3),
                           left, font_size=13, color=C_DARKGRAY)
        add_bullet_textbox(slide, Inches(6.9), Inches(1.75), Inches(5.9), Inches(5.3),
                           right, font_size=13, color=C_DARKGRAY)

    make_content_slide(prs, "GGZ & JGZ — specifieke aandachtspunten", content_ggz)

    def content_somatisch(slide):
        add_rect(slide, Inches(0.3), Inches(1.25), Inches(12.5), Inches(5.9), C_WHITE)
        add_textbox(slide, Inches(0.5), Inches(1.35), Inches(12.0), Inches(0.5),
                    "Somatische context — comorbiditeit en co-prescriptie",
                    font_size=17, bold=True, color=C_MIDBLUE)
        punten = [
            "Comorbide somatische aandoeningen: voer diagnoses/episodes in als indicatie voor bewaking",
            "Co-prescriptie huisarts: gebruik LSP-controle om volledig medicatieoverzicht te krijgen",
            "Coumarines/insulines: eenheden invullen in Medimo; apotheek zet X op tijdstip",
            "  → Wordt verplichte medicatie → zorgmedewerker actief herinnerd",
            "Renale/hepatische insufficiëntie: doseringsprobleem-signalen extra serieus nemen",
            "Ouderen (ook in GGZ): polyfarmacie-check via dubbelmedicatie en interactiesignalen",
            "Perioperatieve situaties: 'Tijdelijk stoppen' gebruiken voor specifieke middelen",
            "Extern voorschrift (bijv. oncoloog): markeer via 'Uitgebreide weergave' → 'Extern voorschrift'",
            "Farmacotherapeutisch Kompas altijd beschikbaar als referentie naast Medimo",
        ]
        add_bullet_textbox(slide, Inches(0.5), Inches(2.0), Inches(12.0), Inches(5.0),
                           punten, font_size=14, color=C_DARKGRAY)

    make_content_slide(prs, "Somatische context — comorbiditeit & co-prescriptie", content_somatisch)


def slides_module10(prs):
    """Apotheek, GDS & faxrecept"""
    make_section_divider(prs, 10, "Apotheek, GDS & Faxrecept",
                         "Externe verstrekking en weeklevering")

    def content(slide):
        flows = [
            ("GDS-weeklevering",
             C_MIDBLUE,
             [
                 "GDS = baxterrol met gedispenseerde weekdosis",
                 "Filter 'GDS medicatie' bij zoeken geeft snel overzicht",
                 "Mutatietijdstip: voorkeur op weeklevering of leveringsmoment",
                 "Bij late mutatie: bel apotheek voor spoedverwerking",
             ]),
            ("Faxrecept (externe apotheek)",
             C_ORANGE,
             [
                 "Poli recept: apotheken met faxnummer in landelijke tabel",
                 "Faxrecept: voorgedefinieerde lijst in systeem",
                 "Onbekende apotheek: voeg faxnummer eerst toe",
                 "Bevestiging van ontvangst altijd navragen",
             ]),
            ("Intake nieuwe cliënt",
             C_GREEN,
             [
                 "Thuismedicatie importeren via 'Actie intakeformulier'",
                 "LSP-actueel ophalen vóór import (vermijd dubbelen)",
                 "Elk middel controleren op dosering en indicatie",
                 "Definitief starten pas na verificatie bij eigen apotheek",
             ]),
        ]
        for i, (titel, kleur, items) in enumerate(flows):
            x = Inches(0.3) + i * Inches(4.25)
            add_rect(slide, x, Inches(1.25), Inches(3.9), Inches(0.55), kleur)
            add_textbox(slide, x, Inches(1.27), Inches(3.9), Inches(0.5),
                        titel, font_size=13, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
            add_rect(slide, x, Inches(1.82), Inches(3.9), Inches(4.9), C_WHITE)
            add_bullet_textbox(slide, x + Inches(0.1), Inches(1.95),
                               Inches(3.7), Inches(4.65),
                               items, font_size=12, color=C_DARKGRAY)

        add_rect(slide, Inches(0.3), Inches(6.9), Inches(12.5), Inches(0.4), C_LIGHTBLUE)
        add_textbox(slide, Inches(0.5), Inches(6.93), Inches(12.0), Inches(0.35),
                    "💡 Toelichting bij mutatie (vrij tekstveld) is zichtbaar voor apotheek — "
                    "gebruik het voor 'spoed', 'bijwerking ouder', 'in overleg HA'",
                    font_size=12, color=C_DARKGRAY)

    make_content_slide(prs, "Apotheek, GDS-weeklevering & Faxrecept", content)


def slides_module11(prs):
    """AIOS supervisie"""
    make_section_divider(prs, 11, "AIOS-supervisie via Medicatievoorstel",
                         "Veilig opleiden met één klik")

    def content(slide):
        add_rect(slide, Inches(0.3), Inches(1.25), Inches(12.5), Inches(1.7), C_WHITE)
        add_textbox(slide, Inches(0.5), Inches(1.35), Inches(12.0), Inches(0.45),
                    "Hoe werkt het Medicatievoorstel?", font_size=17, bold=True, color=C_MIDBLUE)
        add_textbox(slide, Inches(0.5), Inches(1.82), Inches(12.0), Inches(1.0),
                    "AIOS/VSIO bereidt het voorstel voor → arts-supervisor ziet het oranje gemarkeerd boven in het cliëntscherm "
                    "→ accepteert, bewerkt of keurt af. Het voorstel wordt pas actief medicatie ná akkoord van de supervisor.",
                    font_size=13, color=C_DARKGRAY, wrap=True)

        stappen_aios = [
            "AIOS logt in en navigeert naar cliënt",
            "Klik 'Nieuw' → kies 'Medicatievoorstel'",
            "Vul dosering en indicatie in als normaal voorschrift",
            "Klik 'Indienen als voorstel' (niet 'Start')",
        ]
        stappen_arts = [
            "Oranje markering boven in cliëntscherm signaleert openstaand voorstel",
            "Klik op het voorstel → bekijk alle details",
            "Kies: Accepteren / Bewerken / Afkeuren",
            "Bij acceptatie → voorstel wordt direct actief voorschrift",
        ]
        add_rect(slide, Inches(0.3), Inches(3.1), Inches(5.9), Inches(0.45), C_MIDBLUE)
        add_textbox(slide, Inches(0.35), Inches(3.12), Inches(5.8), Inches(0.4),
                    "AIOS — voorstel indienen", font_size=13, bold=True, color=C_WHITE)
        add_rect(slide, Inches(6.8), Inches(3.1), Inches(5.9), Inches(0.45), C_ORANGE)
        add_textbox(slide, Inches(6.85), Inches(3.12), Inches(5.8), Inches(0.4),
                    "Arts-supervisor — voorstel beoordelen", font_size=13, bold=True, color=C_WHITE)

        add_rect(slide, Inches(0.3), Inches(3.57), Inches(5.9), Inches(3.6), C_WHITE)
        add_rect(slide, Inches(6.8), Inches(3.57), Inches(5.9), Inches(3.6), C_WHITE)

        for i, s in enumerate(stappen_aios):
            y = Inches(3.65) + i * Inches(0.82)
            add_rect(slide, Inches(0.35), y, Inches(0.5), Inches(0.5), C_MIDBLUE)
            add_textbox(slide, Inches(0.35), y, Inches(0.5), Inches(0.5),
                        str(i+1), font_size=14, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
            add_textbox(slide, Inches(0.95), y + Pt(5), Inches(5.1), Inches(0.45),
                        s, font_size=12, color=C_DARKGRAY)

        for i, s in enumerate(stappen_arts):
            y = Inches(3.65) + i * Inches(0.82)
            add_rect(slide, Inches(6.85), y, Inches(0.5), Inches(0.5), C_ORANGE)
            add_textbox(slide, Inches(6.85), y, Inches(0.5), Inches(0.5),
                        str(i+1), font_size=14, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
            add_textbox(slide, Inches(7.45), y + Pt(5), Inches(5.1), Inches(0.45),
                        s, font_size=12, color=C_DARKGRAY)

        add_rect(slide, Inches(0.3), Inches(7.25), Inches(12.5), Inches(0.18), C_GREEN)
        add_textbox(slide, Inches(0.5), Inches(7.27), Inches(12.0), Inches(0.15),
                    "🔑  Tip: bewust mutatiedatum kiezen op weeklevering zodat GDS-aanpassing vlot verloopt",
                    font_size=11, bold=True, color=C_WHITE)

    make_content_slide(prs, "Medicatievoorstel — supervisietool voor AIOS", content)


def slides_module12(prs):
    """Life hacks & valkuilen"""
    make_section_divider(prs, 12, "Life Hacks, Valkuilen & Tips",
                         "Werken sneller en veiliger in de praktijk")

    def content_hacks(slide):
        hacks = [
            ("🔑", "Werkvoorraad-filter",
             "Formularium eenmalig opschonen naar FACT-arsenaal → 50% sneller zoeken"),
            ("🔑", "Schema voor titratie",
             "Één voorschrift met doseerstappen i.p.v. drie losse mutaties"),
            ("💡", "Indicatie hergebruiken",
             "Bestaande ECD-episode kiezen → voorkomt dubbele indicaties"),
            ("💡", "Toelichting voor apotheek",
             "Vrij tekstveld gebruiken: 'spoed', 'bijwerking', 'in overleg HA'"),
            ("💡", "Zo-nodig + regulier combineren",
             "Benzo-bridging bij SSRI-start: regulier met 'tijdelijk' én 'zo-nodig'"),
            ("🔑", "LSP-actualiteit",
             "Apotheek vragen om dagelijkse controle voor ambulante cliënten"),
            ("💡", "Token gelocked?",
             "Sms-inlog werkt altijd als fallback — geen tijdverlies door helpdesk-belletje"),
            ("💡", "Notitie bij bewakingssignaal",
             "Klinische redenering altijd opslaan bij overschreven signalen"),
        ]
        cols = [hacks[:4], hacks[4:]]
        for col_i, col in enumerate(cols):
            x = Inches(0.3) + col_i * Inches(6.5)
            for row_i, (icoon, naam, uitleg) in enumerate(col):
                y = Inches(1.25) + row_i * Inches(1.5)
                add_rect(slide, x, y, Inches(0.55), Inches(1.1), C_MIDBLUE)
                add_textbox(slide, x, y + Pt(12), Inches(0.55), Inches(0.8),
                            icoon, font_size=18, color=C_WHITE, align=PP_ALIGN.CENTER)
                add_rect(slide, x + Inches(0.65), y, Inches(5.6), Inches(1.1), C_WHITE)
                add_textbox(slide, x + Inches(0.75), y + Pt(5),
                            Inches(5.4), Inches(0.45),
                            naam, font_size=13, bold=True, color=C_MIDBLUE)
                add_textbox(slide, x + Inches(0.75), y + Pt(25),
                            Inches(5.4), Inches(0.65),
                            uitleg, font_size=12, color=C_DARKGRAY)

    make_content_slide(prs, "Top 8 Life Hacks", content_hacks)

    def content_valkuilen(slide):
        valkuilen = [
            ("Nieuw starten bij transitie",
             "Gebruik Wijzigen of laat ongewijzigd — nieuw starten geeft dubbel voorschrift"),
            ("Indicatie overslaan",
             "Blokkeert medicatiebewaking-logica; verplicht voor buiten-formularium en wettelijk vereist"),
            ("Bewakingssignaal negeren zonder notitie",
             "Juridisch kwetsbaar; opvolgers missen jouw klinische redenering"),
            ("Browser-terug gebruiken",
             "Kan sessie beschadigen; gebruik altijd systeemknoppen"),
            ("GDS-mutatie buiten leveringsvenster",
             "Weekdoos al klaar → apotheek moet opnieuw baxteren; altijd overleggen bij late mutatie"),
            ("Faxrecept zonder bevestiging",
             "Altijd navragen of apotheek fax ontvangen heeft — geen automatische bevestiging"),
            ("Corrigeren voor een oude fout",
             "Corrigeren is alleen voor recente fouten; bij oudere fouten: overleg met apotheek en leg vast"),
            ("Vrije tekst als indicatie",
             "Gebruik gestructureerde indicatietabel voor juiste bewakingscontext"),
        ]
        for i, (valk, aanpak) in enumerate(valkuilen[:4]):
            y = Inches(1.25) + i * Inches(1.5)
            add_rect(slide, Inches(0.3), y, Inches(0.18), Inches(1.1), C_ORANGE)
            add_rect(slide, Inches(0.55), y, Inches(5.7), Inches(1.1), C_WHITE)
            add_textbox(slide, Inches(0.65), y + Pt(5), Inches(5.5), Inches(0.45),
                        f"⚠  {valk}", font_size=13, bold=True, color=C_ORANGE)
            add_textbox(slide, Inches(0.65), y + Pt(27), Inches(5.5), Inches(0.65),
                        aanpak, font_size=12, color=C_DARKGRAY)

        for i, (valk, aanpak) in enumerate(valkuilen[4:]):
            y = Inches(1.25) + i * Inches(1.5)
            add_rect(slide, Inches(6.8), y, Inches(0.18), Inches(1.1), C_ORANGE)
            add_rect(slide, Inches(7.05), y, Inches(5.7), Inches(1.1), C_WHITE)
            add_textbox(slide, Inches(7.15), y + Pt(5), Inches(5.5), Inches(0.45),
                        f"⚠  {valk}", font_size=13, bold=True, color=C_ORANGE)
            add_textbox(slide, Inches(7.15), y + Pt(27), Inches(5.5), Inches(0.65),
                        aanpak, font_size=12, color=C_DARKGRAY)

    make_content_slide(prs, "Top 8 Valkuilen — en hoe te vermijden", content_valkuilen)


def make_escalatie_slide(prs):
    def content(slide):
        items = [
            ("Technische storingen",
             C_ORANGE,
             "enovationmedimo.nl/storingen  |  Helpdesk tijdens kantooruren"),
            ("Trainingen & uitbreiding",
             C_MIDBLUE,
             "enovationmedimo.nl/trainingen"),
            ("Klinische second opinion",
             C_GREEN,
             "Richtlijnendatabase.nl  •  NVvP  •  Kinderformularium.nl  •  Collega-psychiater"),
            ("Juridische vragen (BIG, Wzd, Wvggz)",
             RGBColor(0xC0,0x39,0x2B),
             "Fivoor compliance officer / jurist — geef feitelijke kaders, geen advies"),
            ("Onzekerheid over Medimo-versie",
             C_DARKGRAY,
             "portaal.medimo.nl/portal/nl/kb — versiedocumentatie bij elke release"),
        ]
        for i, (titel, kleur, contact) in enumerate(items):
            y = Inches(1.3) + i * Inches(1.15)
            add_rect(slide, Inches(0.3), y, Inches(4.0), Inches(0.9), kleur)
            add_textbox(slide, Inches(0.4), y + Pt(8), Inches(3.8), Inches(0.75),
                        titel, font_size=13, bold=True, color=C_WHITE)
            add_rect(slide, Inches(4.4), y, Inches(8.4), Inches(0.9), C_WHITE)
            add_textbox(slide, Inches(4.5), y + Pt(10), Inches(8.2), Inches(0.75),
                        contact, font_size=13, color=C_DARKGRAY)

    make_content_slide(prs, "Escalatie & bronnen", content)


def make_closing_slide(prs):
    slide = prs.slides.add_slide(blank_layout(prs))
    add_rect(slide, 0, 0, SLIDE_W, SLIDE_H, C_DARKBLUE)
    add_rect(slide, 0, Inches(3.4), SLIDE_W, Inches(0.08), C_ORANGE)
    add_rect(slide, 0, 0, Inches(0.5), SLIDE_H, C_MIDBLUE)

    add_textbox(slide, Inches(1.0), Inches(1.2), Inches(11.2), Inches(1.0),
                "Klaar om veilig voor te schrijven in Medimo",
                font_size=36, bold=True, color=C_WHITE, align=PP_ALIGN.LEFT)

    add_textbox(slide, Inches(1.0), Inches(2.4), Inches(11.2), Inches(0.8),
                "Onthoud de drie kernprincipes:",
                font_size=18, color=C_ORANGE, align=PP_ALIGN.LEFT)

    principes = [
        "1.  Bewaking nooit negeren zonder notitie — juridisch én klinisch",
        "2.  Bij transitie: geen nieuw voorschrift als het een voortzetting is",
        "3.  Indicatie invullen is geen administratie — het is veiligheid",
    ]
    for i, p in enumerate(principes):
        add_textbox(slide, Inches(1.0), Inches(3.6) + i * Inches(0.75),
                    Inches(11.2), Inches(0.65),
                    p, font_size=16, color=C_WHITE, align=PP_ALIGN.LEFT)

    add_textbox(slide, Inches(1.0), Inches(6.0), Inches(11.2), Inches(0.6),
                "Naslag:  portaal.medimo.nl/portal/nl/kb  •  Kinderformularium.nl  "
                "•  Richtlijnendatabase.nl  •  Farmacotherapeutisch Kompas",
                font_size=13, color=RGBColor(0x88, 0xBB, 0xDD), align=PP_ALIGN.LEFT, wrap=True)

    add_textbox(slide, Inches(1.0), Inches(6.8), Inches(8), Inches(0.5),
                "Medimo Voorschrijfexpert  |  Versie 2025-4 / 2026-1  |  Enovation Medimo",
                font_size=11, color=RGBColor(0x66, 0x88, 0xAA), align=PP_ALIGN.LEFT)
    return slide


# ═══════════════════════════════════════════════════════════════════════════
#  HOOFDPROGRAMMA
# ═══════════════════════════════════════════════════════════════════════════

def main():
    prs = new_prs()

    make_title_slide(prs)
    make_agenda_slide(prs)

    slides_module1(prs)   # 2 content slides
    slides_module2(prs)   # 2 content slides
    slides_module3(prs)   # 1 content slide
    slides_module4(prs)   # 2 content slides
    slides_module5(prs)   # 2 content slides
    slides_module6(prs)   # 2 content slides
    slides_module7(prs)   # 1 content slide
    slides_module8(prs)   # 2 content slides
    slides_module9(prs)   # 3 content slides
    slides_module10(prs)  # 1 content slide
    slides_module11(prs)  # 1 content slide
    slides_module12(prs)  # 2 content slides

    make_escalatie_slide(prs)
    make_closing_slide(prs)

    out_path = "/home/user/codex-sample-project/Medimo_Trainingshandleiding.pptx"
    prs.save(out_path)
    print(f"Presentatie opgeslagen: {out_path}")
    print(f"Aantal slides: {len(prs.slides)}")


if __name__ == "__main__":
    main()
