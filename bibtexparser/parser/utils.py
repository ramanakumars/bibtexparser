import re
import unicodedata


journal_macros = {
    "\\aj": "Astronomical Journal",
    "\\actaa": "Acta Astronomica",
    "\\araa": "Annual Review of Astron and Astrophys",
    "\\apj": "Astrophysical Journal",
    "\\apjl": "Astrophysical Journal, Letters",
    "\\apjs": "Astrophysical Journal, Supplement",
    "\\ao": "Applied Optics",
    "\\apss": "Astrophysics and Space Science",
    "\\aap": "Astronomy and Astrophysics",
    "\\aapr": "Astronomy and Astrophysics Reviews",
    "\\aaps": "Astronomy and Astrophysics, Supplement",
    "\\azh": "Astronomicheskii Zhurnal",
    "\\baas": "Bulletin of the AAS",
    "\\caa": "Chinese Astronomy and Astrophysics",
    "\\cjaa": "Chinese Journal of Astronomy and Astrophysics",
    "\\icarus": "Icarus",
    "\\jcap": "Journal of Cosmology and Astroparticle Physics",
    "\\jrasc": "Journal of the RAS of Canada",
    "\\memras": "Memoirs of the RAS",
    "\\mnras": "Monthly Notices of the RAS",
    "\\na": "New Astronomy",
    "\\nar": "New Astronomy Review",
    "\\pra": "Physical Review A: General Physics",
    "\\prb": "Physical Review B: Solid State",
    "\\prc": "Physical Review C",
    "\\prd": "Physical Review D",
    "\\pre": "Physical Review E",
    "\\prl": "Physical Review Letters",
    "\\pasa": "Publications of the Astron. Soc. of Australia",
    "\\pasp": "Publications of the ASP",
    "\\pasj": "Publications of the ASJ",
    "\rmxaa": "Revista Mexicana de Astronomia y Astrofisica",
    "\\qjras": "Quarterly Journal of the RAS",
    "\\skytel": "Sky and Telescope",
    "\\solphys": "Solar Physics",
    "\\sovast": "Soviet Astronomy",
    "\\ssr": "Space Science Reviews",
    "\\zap": "Zeitschrift fuer Astrophysik",
    "\\nat": "Nature",
    "\\iaucirc": "IAU Cirulars",
    "\\aplett": "Astrophysics Letters",
    "\\apspr": "Astrophysics Space Physics Research",
    "\\bain": "Bulletin Astronomical Institute of the Netherlands",
    "\fcp": "Fundamental Cosmic Physics",
    "\\gca": "Geochimica Cosmochimica Acta",
    "\\grl": "Geophysics Research Letters",
    "\\jcp": "Journal of Chemical Physics",
    "\\jgr": "Journal of Geophysics Research",
    "\\jqsrt": "Journal of Quantitiative Spectroscopy and Radiative Transfer",
    "\\memsai": "Mem. Societa Astronomica Italiana",
    "\\nphysa": "Nuclear Physics A",
    "\\physrep": "Physics Reports",
    "\\physscr": "Physica Scripta",
    "\\planss": "Planetary Space Science",
    "\\procspie": "Proceedings of the SPIE"
}

accent2combining = {
    "`": u"\u0300", "'": u"\u0301", "^": u"\u0302", "~": u"\u0303",
    ":": u"\u0308", "v": u"\u030C", "c": u"\u0327"
}

months = ["jan", "feb", "mar", "apr", "may", "jun",
          "jul", "aug", "sep", "oct", "nov", "dec"]


def tex2unicode(text):
    # do the obvious ones
    text = text.replace('\\&', '&')
    text = text.replace('\\#', '#')

    # function to replace all latex accented characters
    # with their unicode equivalent
    pattern = r"\{?\\(['\":cv\~]?)\{?\\?([a-zA-Z])\}?\}?"
    p_replace = r"(\{?\\['\":cv\~]?\{?\\?[a-zA-Z]\}?\}?)"

    match = re.findall(pattern, text)
    replace_text = re.findall(p_replace, text)

    if match:
        nmatches = len(match)

        # for multiple matches
        for matchi in range(nmatches):
            accent = match[matchi][0]
            letter = match[matchi][1]

            if accent == '':
                continue

            if accent == '"':
                accent = ':'

            # find the new accented character in the unicode database
            accent_name = unicodedata.name(
                accent2combining[accent]).replace("COMBINING", "WITH")
            accent_name = accent_name.replace(" ACCENT", "")
            letter_name = unicodedata.name(letter)

            accented = unicodedata.lookup("%s %s" % (letter_name, accent_name))
            accented = accented.encode('utf-8').decode('utf-8')

            # replace the text
            text = text.replace(replace_text[matchi], accented)
        return text
    else:
        return text


def get_month_num(month):
    try:
        monthnum = int(month)
    except Exception:
        monthnum = months.index(month.replace('"', '')[:3].lower())
    return int(monthnum)
