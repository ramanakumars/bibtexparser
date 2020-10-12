import re, unicodedata

bold_author_short = "Sankar, R."

journal_macros = {
    "\mnras": "Monthly Notices of the Royal Astronomical Society",
    "\icarus": "Icarus"
}

accent2combining = {
    "`": u"\u0300", "'": u"\u0301", "^": u"\u0302", "~": u"\u0303", ":": u"\u0308", "v": u"\u030C"
}

def tex2unicode(text):
    ## function to replace all latex accented characters
    ## with their unicode equivalent
    pattern   = r"\{?\\(['\":v]?)\{?\\?([a-zA-Z])\}?\}?"
    p_replace = r"(\{?\\['\":v]?\{?\\?[a-zA-Z]\}?\}?)"

    match        = re.findall(pattern, text)
    replace_text = re.findall(p_replace, text)

    if(match):
        nmatches = len(match)

        ## for multiple matches
        for matchi in range(nmatches):
            accent = match[matchi][0]
            letter = match[matchi][1]

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

class Author:
    ## author structure which parses an author's
    ## first and last name from the bibtex entry
    def __init__(self, bib_entry):
        nnames = bib_entry.split(', ')
        self.firstname = nnames[1]
        self.lastname  = nnames[0]


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
        for name in first:
            short_first = short_first + name[0] + ". "
        return "%s, %s"%(self.lastname, short_first[:-1])
    
    def long_name(self):
        ## format as [last name], [first names].
        ## e.g. Sankar, Ramanakumar  or Sankar, Ramanakumar Ganapathy
        first = self.firstname.split(' ')
        long_first = ""
        for name in first:
            long_first = long_first + name + ". "
        return "%s, %s"%(self.lastname, long_first[:-1])

class Records:
    def __init__(self, rec_type, entry_name):
        self.authors = []

    def parse_text(self, text):
        keywords = []
        entry    = []

        ## first find all the keywords
        done  = False
        index = 0

        ## the entry pattern is [key] = [entry], 
        key_text_pattern = r"([a-zA-Z]+) \= (.*?),\s?$"
        ## except for the last entry which is [key] = [entry]
        key_text_last    = r"([a-zA-Z]+) \= (.*?)\s?$"

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
        search_pattern = r"^\"?\{?(.*?)\}?\"?$"
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
                self.year = int(match.group(1))
            
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


class bibtexParser():
    def __init__(self, fname):
        self.fname = fname
        
        self.get_records()

    def get_records(self):
        file = open(self.fname, "r")
        self.lines = file.readlines()
        file.close()

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

    def to_html(self, outname):
        ## for use as an <li> element of the form:
        ## for papers:
        ## [author list]. [title]. <i>[journal]. [volume],</i> [pages] ([year]) (DOI: <a href="[url]">[doi]</a>
        ## for abstracts:
        ## [author list]. [title]. <i>[booktitle].</i> ([year]) (DOI: <a href="[url]">[doi]</a>
        outfile = open(outname, "w", encoding='utf-8')
        for record in self.records:
            out = "<li>"

            for i, author in enumerate(record.authors):
                short_name = tex2unicode(author.short_name())
                if(short_name == bold_author_short):
                    short_name = "<b>%s</b>"%short_name
                if(i != len(record.authors)-1):
                    out = out + short_name + ", "
                else:
                    out = out + short_name


            out = out + " %s. "%tex2unicode(record.title)
            if(hasattr(record,"journal")):
                out = out + "<i>%s</i>. "%record.journal
                out = out + "<i>%s</i>, "%record.volume
                out = out + "%s. "%(record.pages)
            elif(hasattr(record,"booktitle")):
                out = out + "<i>%s</i>. "%record.booktitle.replace("\#","#")
            
            out = out + "(%d)"%record.year

            if(hasattr(record,"doiurl")):
                out = out + " (DOI: <a href='%s'>%s</a>)"%(record.doiurl, record.doi)
            outfile.write(out + "</li>\n")
    
    def to_latex_item(self, outname):
        outfile = open(outname, "w")
        for record in self.records:
            out = "\item "

            for i, author in enumerate(record.authors):
                short_name = author.short_name()
                if(short_name == bold_author_short):
                    short_name = "{\\bf %s}"%short_name
                if(i != len(record.authors)-1):
                    out = out + short_name + ", "
                else:
                    out = out + short_name


            out = out + " %s. "%record.title
            if(hasattr(record,"journal")):
                out = out + "{\\it %s}. "%record.journal
                out = out + "{\\it %s}, "%record.volume
                out = out + "%s. "%(record.pages)
            elif(hasattr(record,"booktitle")):
                out = out + "{\\it %s}. "%record.booktitle
            
            out = out + "(%d)"%record.year

            outfile.write(out + "\n")
            
