import re, unicodedata
from string import Template
import io

journal_macros = {
   "\\aj":"Astronomical Journal",
   "\\actaa":"Acta Astronomica",
   "\\araa":"Annual Review of Astron and Astrophys",
   "\\apj":"Astrophysical Journal",
   "\\apjl":"Astrophysical Journal, Letters",
   "\\apjs":"Astrophysical Journal, Supplement",
   "\\ao":"Applied Optics",
   "\\apss":"Astrophysics and Space Science",
   "\\aap":"Astronomy and Astrophysics",
   "\\aapr":"Astronomy and Astrophysics Reviews",
   "\\aaps":"Astronomy and Astrophysics, Supplement",
   "\\azh":"Astronomicheskii Zhurnal",
   "\\baas":"Bulletin of the AAS",
   "\caa":"Chinese Astronomy and Astrophysics",
   "\cjaa":"Chinese Journal of Astronomy and Astrophysics",
   "\icarus":"Icarus",
   "\jcap":"Journal of Cosmology and Astroparticle Physics",
   "\jrasc":"Journal of the RAS of Canada",
   "\memras":"Memoirs of the RAS",
   "\mnras":"Monthly Notices of the RAS",
   "\\na":"New Astronomy",
   "\\nar":"New Astronomy Review",
   "\pra":"Physical Review A: General Physics",
   "\prb":"Physical Review B: Solid State",
   "\prc":"Physical Review C",
   "\prd":"Physical Review D",
   "\pre":"Physical Review E",
   "\prl":"Physical Review Letters",
   "\pasa":"Publications of the Astron. Soc. of Australia",
   "\pasp":"Publications of the ASP",
   "\pasj":"Publications of the ASJ",
   "\rmxaa":"Revista Mexicana de Astronomia y Astrofisica",
   "\qjras":"Quarterly Journal of the RAS",
   "\skytel":"Sky and Telescope",
   "\solphys":"Solar Physics",
   "\sovast":"Soviet Astronomy",
   "\ssr":"Space Science Reviews",
   "\zap":"Zeitschrift fuer Astrophysik",
   "\\nat":"Nature",
   "\iaucirc":"IAU Cirulars",
   "\\aplett":"Astrophysics Letters",
   "\\apspr":"Astrophysics Space Physics Research",
   "\\bain":"Bulletin Astronomical Institute of the Netherlands",
   "\fcp":"Fundamental Cosmic Physics",
   "\gca":"Geochimica Cosmochimica Acta",
   "\grl":"Geophysics Research Letters",
   "\jcp":"Journal of Chemical Physics",
   "\jgr":"Journal of Geophysics Research",
   "\jqsrt":"Journal of Quantitiative Spectroscopy and Radiative Transfer",
   "\memsai":"Mem. Societa Astronomica Italiana",
   "\\nphysa":"Nuclear Physics A",
   "\physrep":"Physics Reports",
   "\physscr":"Physica Scripta",
   "\planss":"Planetary Space Science",
   "\procspie":"Proceedings of the SPIE"
}

accent2combining = {
    "`": u"\u0300", "'": u"\u0301", "^": u"\u0302", "~": u"\u0303", ":": u"\u0308", "v": u"\u030C", "c": u"\u0327"
}

months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]

def tex2unicode(text):
    ## do the obvious ones
    text = text.replace('\\&','&')
    text = text.replace('\\#','#')

    ## function to replace all latex accented characters
    ## with their unicode equivalent
    pattern   = r"\{?\\(['\":cv\~]?)\{?\\?([a-zA-Z])\}?\}?"
    p_replace = r"(\{?\\['\":cv\~]?\{?\\?[a-zA-Z]\}?\}?)"

    match        = re.findall(pattern, text)
    replace_text = re.findall(p_replace, text)

    if(match):
        nmatches = len(match)

        ## for multiple matches
        for matchi in range(nmatches):
            accent = match[matchi][0]
            letter = match[matchi][1]

            if(accent==''):
                continue

            if(accent=='"'):
                accent = ':'

            ## find the new accented character in the unicode database
            accent_name = unicodedata.name(accent2combining[accent]).replace("COMBINING", "WITH")
            accent_name = accent_name.replace(" ACCENT", "")
            letter_name = unicodedata.name(letter)

            accented    = unicodedata.lookup("%s %s"%(letter_name, accent_name))
            accented    = accented.encode('utf-8').decode('utf-8')

            ## replace the text
            text = text.replace(replace_text[matchi], accented)
        return text
    else:
        return text


def get_month_num(month):
    try:
        monthnum = int(month)
    except:
        monthnum = months.index(month[:3].lower())
    return monthnum

class Author:
    ## author structure which parses an author's
    ## first and last name from the bibtex entry
    def __init__(self, bib_entry):
        #bib_entry = bib_entry.replace("~"," ")
        bib_entry  = re.sub(r'[^\\]~',' ', bib_entry)

        ## figure out if it is lastname, firstname 
        ## or firstname lastname

        if("," in bib_entry):
            nnames = bib_entry.split(', ')
            try:
                self.firstname = nnames[1]
                self.lastname  = nnames[0]
            except:
                self.lastname = nnames[0]
                self.firstname = ""
        else:
            nnames  = re.findall('[{]?(.*)[}]?', bib_entry)
            self.lastname = nnames[0]
            self.firstname = ""
        
        if(self.lastname[0]=="{"):
            self.lastname = self.lastname.replace("{", "")
            self.lastname = self.lastname.replace("}", "")
        if(len(nnames) == 3):
            self.suffix = nnames[2]

    def short_name(self):
        ## format as [last name], [first name letters].
        ## e.g. Sankar, R. or Sankar, R. G.
        first = self.firstname.split(' ')
        short_first = ""
        if(first[0] != ''):
            for name in first:
                ## account for first letter unicodes
                if(name[0] == "{"):
                    fname = re.findall(r'(\{.+\})', name)[0]
                else:
                    fname = name[0]
                short_first = short_first + fname + ". "
        return "%s, %s"%(self.lastname, short_first[:-1])
    
    def long_name(self):
        ## format as [last name], [first names].
        ## e.g. Sankar, Ramanakumar  or Sankar, Ramanakumar Ganapathy
        first = self.firstname.split(' ')
        long_first = ""
        for name in first:
            long_first = long_first + name + " "
        return "%s %s"%(long_first[:-1], self.lastname)

class Records:
    def __init__(self, rec_type, entry_name):
        self.authors = []
        self.rec_type   = rec_type
        self.entry_name = entry_name

    def parse_text(self, text):
        self.text = text

        keywords = []
        entry    = []

        ## first find all the keywords
        done  = False
        index = 0

        ## the entry pattern is [key] = [entry], 
        key_text_pattern = r"([a-zA-Z]+)\s?\=\s?(.*?),\s?$"
        ## except for the last entry which is [key] = [entry]
        key_text_last    = r"([a-zA-Z]+)\s?\=\s?(.*?)\s?$"

        ## loop through all the lines and find all keys
        ## and matching entries 
        while not done:
            line = text[index]
            if(index < (len(text) - 1)):
                match = re.search(key_text_pattern, line)
            else:
                match = re.search(key_text_last, line)

            ## if the line does not end in comma
            ## add the next line and check
            while not match:
                line   = line.replace("\n","").strip() + text[index+1].strip()
                index += 1
                match = re.search(key_text_pattern, line)
            
            ## add the entry once the format is complete
            keywords.append(match.group(1))
            entry.append(match.group(2))
            
            index += 1
            if(index>=len(text)):
                done = True
                break

        ## the entry could be of the form
        ## { ... } or 
        ## "{ ... }" so retrieve the text within
        search_pattern = r"^\"?\{?\"?(.*?)\"?\}?\"?,?$"
        for i, key in enumerate(keywords):
            line = entry[i]

            ## special case author list 
            ## break down individual authors
            if(key=='author'):
                match = re.search(search_pattern, line)
                authors = match.group(1).split(' and')
                for author in authors:
                    authi = Author(author.strip())
                    self.authors.append(authi)

            ## if the journaly contains a macro,
            ## parse it using the dictionary
            elif(key == "journal"):
                match = re.search(search_pattern, line)
                self.journal = match.group(1)

                if(self.journal[0] == '\\'):
                    try:
                        self.journal = journal_macros[self.journal]
                    except KeyError:
                        print("Found macro %s for journal name but no matching journal name..."%self.journal)

            ## year and volume are numbers
            elif(key == "year"):
                match = re.search(search_pattern, line)
                try:
                    self.year = int(match.group(1))
                except ValueError:
                    self.year = match.group(1)
            
            elif(key == "month"):
                match = re.search(search_pattern, line)
                try:
                    self.month = int(match.group(1))
                except ValueError:
                    self.month = match.group(1)
            
            elif(key == "volume"):
                match = re.search(search_pattern, line)
                self.volume = int(match.group(1))
            
            ## parse the DOI into a URL
            elif(key == "doi"):
                match = re.search(search_pattern, line)
                self.doi = match.group(1)
                self.doiurl = "https://doi.org/%s"%self.doi

            ## default case, save the entry as self.[key] = [entry]
            else:
                match = re.search(search_pattern, line)
                setattr(self, key, match.group(1))


class bibtexParser:
    ''' 
        Parses bibtex entries from a file and creates
        a Record object of each entry

        Attributes
        ----------
        records : list
            array of ``records`` objects

        Methods
        -------
        get_records()
            Gets the records from input filename (run automatically)
        to_html()
            Parse the entries as HTML output with each entry as an <li> element
        to_latex_item()
            Parse the entries to a .text file with each entry as an \item
        to_text()
            Parse all entries as a plain text (.txt) file with each entry separated by a newline

    '''
    def __init__(self, fname, fileIO=None):
        '''
            Initialize
            
            Pareters
            ------
            fname : str
                Input filename (.bib)

        '''
        self.fname = fname

        if (fileIO is not None) and isinstance(fileIO, io.StringIO):
            self.lines = fileIO.readlines()
            # print(self.lines)
            fileIO.close()
        else:
            file = open(self.fname, "r")
            self.lines = file.readlines()
            file.close()
        
        self.get_records()

    def get_records(self):
        self.records = []

        ## start pattern is @[type]{[name],
        start_pattern = r"^@([A-Za-z]+){([A-Za-z0-9./]+),$"
        ## ending is a }
        end_pattern   = r"^}$"

        index = 0

        done = False

        ## loop over the entire file and find entries 
        while not done:
            line = self.lines[index]

            matches = re.match(start_pattern, line)

            ## if start pattern has been found, loop and 
            ## find the end }
            if(matches):
                ref_type   = matches.group(1)
                entry_name = matches.group(2)

                reci = Records(ref_type, entry_name)
                
                end  = False
                ind2 = 1
                while not end:
                    line2 = self.lines[index+ind2]
                    endmatch = re.match(end_pattern, line2)

                    if(endmatch):
                        end = True
                        break

                    ind2 += 1


                ref_text = self.lines[(index+1):(index+ind2)]

                ## parse the entry into keywords
                reci.parse_text(ref_text)

                self.records.append(reci)

            index += 1
            if(index >= len(self.lines)):
                done = True

        print("Found %d records from %s"%(len(self.records), self.fname))

    def to_out(self, outname, templatefile, convunicode=True, clean=False, sort=False):
        ## output to [outname] using the template given

        ## open the output file
        if isinstance(outname, io.StringIO):
            outfile = outname
            outfile.seek(0)
        else:
            outfile = open(outname, "w", encoding='utf-8')

        ## no unicode output for .tex files
        if('tex' in outname):
            encodeunicode = False
        else:
            encodeunicode = True

        ## check if we want to clean or sort
        if(clean):
            recs = self.cleanup()
            records = [reci[0] for reci in recs]
        else:
            if sort:
                names = []
                for record in self.records:
                    if(hasattr(record, "month")):
                        monthnum = get_month_num(record.month)
                    else:
                        monthnum = 0
                    names.append("%s%d%02d"%(record.authors[0].lastname, record.year, monthnum))
                namesort = sorted(names)
                records = [self.records[names.index(name)] for name in namesort]
            else:
                records = self.records

        ## get the template string -- we will replace this for 
        ## each entry
        if isinstance(templatefile, io.StringIO):
            templatelines = templatefile.readlines()
        else:
            templatelines = open(templatefile, 'r').readlines()

        templates = []
        for linei in templatelines:
            if(linei[0] == '@'):
                temptype = re.findall(r'@([A-Za-z]*?):', linei)[0]
                templates.append([temptype.lower(), linei.replace('@%s:'%temptype, '')])
            else:
                templates.append(['all', linei])
        nalls = 0
        for template in templates:
            if(template[0] == 'all'):
                generictempstring = template[1]
                nalls += 1

        if(nalls > 1):
            print("Error! Can only have one general template")
            return

        ## loop through all the records
        for record in records:
            rectype = record.rec_type

            templatestring = generictempstring
            for template in templates:
                if(rectype.lower() == template[0]):
                    templatestring = template[1]

            ## first, find the author template because this is going to 
            ## be common to all
            authtemplate   = re.findall(r'auth([sf])([0-9a]?)', templatestring);
            if(len(authtemplate) != 1):
                raise ValueError("Error! Only one entry for author is allowed!")
            authstring     = "auth%s%s"%(authtemplate[0][0],authtemplate[0][1])
            authstyle = authtemplate[0][0]

            ## find if the author list is short or long
            if(authstyle not in ['s', 'f']):
                raise ValueError("Error! Author style must be s=>short or f=>full")
            
            if(authstyle == 's'):
                if(authtemplate[0][1] != 'a'):
                    authnum = int(authtemplate[0][1])
                else:
                    authnum = int(1e10)
            else:
                authnum   = 1

            ## then find the groups 
            groups = re.findall(r"(?<!\\)([\{]{1}.*?(?<!\\)[\}]{1})", templatestring)

            ## then find all the templates
            kws = re.findall(r'(\$[a-z0-9]+)', templatestring)
            ## copy the template string to replace later
            tempstring = templatestring

            ## this will hold all the attribute values
            tempdict   = {}
            for tempi in kws:

                ## get the variable name
                tempstr = tempi.replace('$','')

                ## special case -- authors
                if("auth" in tempi):
                    authtext = ''
                    if(authstyle=='s'): ## short author style (lastname firstinitials)
                        if(len(record.authors) > authnum):
                            author = record.authors[0]
                            if(encodeunicode):
                                short_name = tex2unicode(author.short_name())
                            else:
                                short_name = author.short_name()

                            authtext = authtext + short_name + " et al."
                        else:
                            nauths = min([len(record.authors), authnum])
                            for authi in range(nauths):
                                author0 = record.authors[authi]
                                if(encodeunicode):
                                    short_name = tex2unicode(author0.short_name())
                                else:
                                    short_name = author0.short_name()

                                authtext = authtext + short_name
                                if(authi==nauths-2):
                                    authtext = authtext + " and "
                                elif(authi==nauths-1):
                                    authtext = authtext + " "
                                else:
                                    authtext = authtext + ", "
                    elif(authstyle=='f'):
                        for i, author in enumerate(record.authors):
                            if(encodeunicode):
                                long_name = tex2unicode(author.long_name())
                            else:
                                long_name = author.long_name()

                            if(i != len(record.authors)-1):
                                authtext = authtext + long_name + ", "
                            else:
                                authtext = authtext + long_name
                    ## save the author string to the output dictionary
                    tempdict[tempstr] = authtext
                else:  ## for everything else
                    if(hasattr(record, tempstr)):
                        if(encodeunicode):
                            try:
                                tempdict[tempstr] = tex2unicode(record.__getattribute__(tempstr))
                            except AttributeError:
                                tempdict[tempstr] = record.__getattribute__(tempstr)
                        else:
                            tempdict[tempstr] = record.__getattribute__(tempstr)

                    else:
                        ## if the record does not have this attribute
                        ## find the group that this attribute is in
                        for groupi in groups:
                            if tempstr in groupi:
                                remgroup = groupi

                        ## remove the group
                        tempstring = tempstring.replace(remgroup, '')
                        tempdict[tempstr] = ''

            ## finally, remove all the group {}'s and replace the string
            for groupi in groups:
                repgroup = re.sub(r'{(.*?)}',r'\1', groupi)
                tempstring = tempstring.replace(groupi, repgroup)

            ## and also replace all the actual escaped \{ to {
            tempstring = tempstring.replace('\\{', '{')
            tempstring = tempstring.replace('\\}', '}')
            ## and then substitute
            newtemplate = Template(tempstring)
            outfile.write(newtemplate.safe_substitute(tempdict))
    
    def cleanup(self):
        outname = self.fname.replace(".bib", "_clean.bib")
        recs     = []
        rec_list = []
        for record in self.records:
            reci = [record.authors[0].short_name(), record.title, record.year]
            ## find duplicates 
            if(reci not in rec_list):
                recs.append([record, record.entry_name])
                rec_list.append(reci)
            else:
                print("Duplicate entry {0}: {1}".format(record.entry_name, reci))

        recs = sorted(recs, key=lambda x: (type2index(x[0].rec_type), x[1]), reverse=True)

        outfile = open(outname, "w")
        for rec in recs:
            outfile.write("@%s{%s,\n"%(rec[0].rec_type,rec[1]))
            for text in rec[0].text:
                outfile.write("%s"%text)
            outfile.write("}\n\n")

        outfile.close()

        return recs


def type2index(type):
    if type.lower()=='article':
        return 100
    elif type.lower()=='inproceedings':
        return 10
    elif type.lower()=='book':
        return 1
    else:
        return 0