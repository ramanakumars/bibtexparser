import re
from string import Template
import io
import numpy as np
from .utils import journal_macros, get_month_num, tex2unicode


class Author:
    # author structure which parses an author's
    # first and last name from the bibtex entry
    def __init__(self, bib_entry):
        bib_entry = re.sub(r'[^\\]~', ' ', bib_entry)

        # figure out if it is lastname, firstname
        # or firstname lastname

        if("," in bib_entry):
            nnames = bib_entry.split(', ')
            try:
                self.firstname = nnames[1]
                self.lastname = nnames[0]
            except Exception:
                self.lastname = nnames[0]
                self.firstname = ""
        else:
            nnames = re.findall('[{]?(.*)[}]?', bib_entry)
            self.lastname = nnames[0]
            self.firstname = ""

        if(self.lastname[0] == "{"):
            self.lastname = self.lastname.replace("{", "")
            self.lastname = self.lastname.replace("}", "")
        if(len(nnames) == 3):
            self.suffix = nnames[2]

    def short_name(self):
        # format as [last name], [first name letters].
        # e.g. Sankar, R. or Sankar, R. G.
        first = self.firstname.split(' ')
        short_first = ""
        if(first[0] != ''):
            for name in first:
                # account for first letter unicodes
                if(name[0] == "{"):
                    fname = re.findall(r'(\{.+\})', name)[0]
                else:
                    fname = name[0]
                short_first = short_first + fname + ". "
        return "%s, %s" % (self.lastname, short_first[:-1])

    def long_name(self):
        # format as [last name], [first names].
        # e.g. Sankar, Ramanakumar  or Sankar, Ramanakumar Ganapathy
        first = self.firstname.split(' ')
        long_first = ""
        for name in first:
            long_first = long_first + name + " "
        return "%s %s" % (long_first[:-1], self.lastname)


class Records(object):
    def __init__(self, rec_type, entry_name):
        self.authors = []
        self.rec_type = rec_type
        self.entry_name = entry_name

    def parse_text(self, text):
        self.text = text

        # concatenate the entries together into a single
        # string so that we can parse the entries
        text = re.sub(r"[\s]{2,50}?|[\n?]", r"", text)

        # the entry pattern is [key] = [entry],
        text_pattern = r"(\w+)\s*=\s*\"?\{*\"?(.*?)\"?\}*\"?,?(,|$)"

        matches = re.findall(text_pattern, text)

        # print(text, matches)

        for i, (key, entry, _) in enumerate(matches):
            # print(key, entry)
            key = key.lower().strip()
            line = entry.strip()
            line = line.replace('\"', '')

            # special case author list
            # break down individual authors
            if (key == 'author') or (key == 'authors'):
                authors = entry.split(' and')
                for author in authors:
                    authi = Author(author.strip())
                    self.authors.append(authi)

            # if the journaly contains a macro,
            # parse it using the dictionary
            elif(key == "journal"):
                self.journal = entry

                if(self.journal[0] == '\\'):
                    try:
                        self.journal = journal_macros[self.journal]
                    except KeyError:
                        print(
                            f"Found macro {self.journal} for journal name but"
                            "no matching journal name..."
                        )
                        self.journal = entry

            # year and volume are numbers
            elif(key == "year"):
                try:
                    self.year = int(entry)
                except ValueError:
                    self.year = entry

            elif(key == "month"):
                try:
                    self.month = int(entry)
                except ValueError:
                    self.month = entry

            elif(key == "volume"):
                try:
                    self.volume = int(entry)
                except ValueError:
                    self.volume = entry

            # parse the DOI into a URL
            elif(key == "doi"):
                self.doi = entry
                self.doiurl = "https://doi.org/%s" % self.doi

            # default case, save the entry as self.[key] = [entry]
            else:
                setattr(self, key, entry)

    def __getattribute__(self, __name):
        try:
            value = object.__getattribute__(self, __name)
        except AttributeError:
            raise AttributeError(f"{self.entry_name} has no keyword {__name}")

        if __name == 'year':
            try:
                return int(value)
            except Exception:
                raise ValueError(
                    f"Year entry '{value}' cannot be converted to integer for {self.entry_name}")
        else:
            return value


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
            Parse the entries as HTML output with each entry as an
            <li> element
        to_latex_item()
            Parse the entries to a .text file with each entry as an
            \\item
        to_text()
            Parse all entries as a plain text (.txt) file with
            each entry separated by a newline

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
            self.filetype = 'buffer'
        else:
            file = open(self.fname, "r", encoding='utf-8')
            self.lines = file.readlines()
            file.close()
            self.filetype = 'file'

        self.get_records()

    def get_records(self):
        self.records = []

        # start pattern is @[type]{[name],
        pattern = r"@(\w+)\s*\{(.*?),\n?([\s\S\n\t]*?[^\w\.\)\!])\}\n"

        lines = "".join(self.lines) + "\n"

        records = re.findall(pattern, lines)

        for record in records:
            entry_type, entry_name, ref_text = record
            reci = Records(entry_type, entry_name)
            reci.parse_text(ref_text)

            self.records.append(reci)

        print("Found %d records from %s" % (len(self.records), self.fname))
        
    def to_out(self, outname, templatefile,
               convunicode=True, clean=False, sort=False):
        # output to [outname] using the template given

        # open the output file
        if isinstance(outname, io.StringIO):
            outfile = outname
            outfile.seek(0)
        else:
            outfile = open(outname, "w", encoding='utf-8')

        # no unicode output for .tex files
        if('tex' in outname):
            encodeunicode = False
        else:
            encodeunicode = True

        # check if we want to clean or sort
        if(clean):
            recs = self.cleanup(sort=sort)
            self.records = [reci[0] for reci in recs]

        # get the template string -- we will replace this for
        # each entry
        if isinstance(templatefile, io.StringIO):
            templatelines = templatefile.readlines()
        else:
            templatelines = open(templatefile, 'r').readlines()

        templates = []
        for linei in templatelines:
            if(linei[0] == '@'):
                temptype = re.findall(r'@([A-Za-z]*?):', linei)[0]
                templates.append(
                    [temptype.lower(), linei.replace('@%s:' % temptype, '')])
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

        # loop through all the records
        for record in self.records:
            rectype = record.rec_type

            templatestring = generictempstring
            for template in templates:
                if(rectype.lower() == template[0]):
                    templatestring = template[1]

            # first, find the author template because this is going to
            # be common to all
            authtemplate = re.findall(r'auth([sf])([0-9a]?)', templatestring)
            try:
                if(len(authtemplate) > 1):
                    raise ValueError(
                        "Error! Only one entry for author is allowed!")
                # authstring     = "auth%s%s"%(authtemplate[0][0],authtemplate[0][1])
                authstyle = authtemplate[0][0]
            except IndexError:
                raise IndexError("Please enter an author template")

            # find if the author list is short or long
            if(authstyle not in ['s', 'f']):
                raise ValueError("Author style must be s=>short or f=>full")

            if(authstyle == 's'):
                try:
                    if(authtemplate[0][1] != 'a'):
                        authnum = int(authtemplate[0][1])
                    else:
                        authnum = int(1e10)
                except Exception:
                    raise ValueError(
                        "Please use $authsa for all authors or enter a number after $auths")
            else:
                authnum = 1

            # then find the groups
            groups = re.findall(
                r"(?<!\\)([\{]{1}.*?(?<!\\)[\}]{1})", templatestring)

            # then find all the templates
            kws = re.findall(r'(\$[a-z0-9]+)', templatestring)
            # copy the template string to replace later
            tempstring = templatestring

            # this will hold all the attribute values
            tempdict = {}
            for tempi in kws:

                # get the variable name
                tempstr = tempi.replace('$', '')

                # special case -- authors
                if("auth" in tempi):
                    authtext = ''
                    if(authstyle == 's'):  # short author style (lastname firstinitials)
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
                                    short_name = tex2unicode(
                                        author0.short_name())
                                else:
                                    short_name = author0.short_name()

                                authtext = authtext + short_name
                                if(authi == nauths - 2):
                                    authtext = authtext + " and "
                                elif(authi == nauths - 1):
                                    authtext = authtext + " "
                                else:
                                    authtext = authtext + ", "
                    elif(authstyle == 'f'):
                        for i, author in enumerate(record.authors):
                            if(encodeunicode):
                                long_name = tex2unicode(author.long_name())
                            else:
                                long_name = author.long_name()

                            if(i != len(record.authors) - 1):
                                authtext = authtext + long_name + ", "
                            else:
                                authtext = authtext + long_name
                    # save the author string to the output dictionary
                    tempdict[tempstr] = authtext
                else:  # for everything else
                    if(hasattr(record, tempstr)):
                        if(encodeunicode):
                            try:
                                tempdict[tempstr] = tex2unicode(
                                    record.__getattribute__(tempstr))
                            except AttributeError:
                                tempdict[tempstr] = record.__getattribute__(
                                    tempstr)
                        else:
                            tempdict[tempstr] = record.__getattribute__(
                                tempstr)

                    else:
                        # if the record does not have this attribute
                        # find the group that this attribute is in
                        remgroup = None
                        for groupi in groups:
                            if tempstr in groupi:
                                remgroup = groupi

                        if remgroup is None:
                            raise KeyError(
                                f"entry '{tempstr}' is not available in record {record.entry_name}")

                        # remove the group
                        tempstring = tempstring.replace(remgroup, '')
                        tempdict[tempstr] = ''

            # finally, remove all the group {}'s and replace the string
            for groupi in groups:
                repgroup = re.sub(r'{(.*?)}', r'\1', groupi)
                tempstring = tempstring.replace(groupi, repgroup)

            # and also replace all the actual escaped \{ to {
            tempstring = tempstring.replace('\\{', '{')
            tempstring = tempstring.replace('\\}', '}')
            # and then substitute
            newtemplate = Template(tempstring)
            outfile.write(newtemplate.safe_substitute(tempdict))

    def cleanup(self, sort=False, save=False, outfile=None):
        if save:
            if outfile is None:
                if self.filetype == 'file':
                    outname = self.fname.replace(".bib", "_clean.bib")
                else:
                    raise RuntimeError(
                        "Please provide an output writer for non-file inputs")

        # sort the data first
        if sort:
            names = []

            # create a list of author/year/month so that we can sort by this
            # key later
            record_sub = []
            for record in self.records:
                if 'Yoden' in record.entry_name:
                    print(record.entry_name)
                if(hasattr(record, "month")):
                    monthnum = get_month_num(record.month)
                else:
                    monthnum = 0
                try:
                    namei = "%s%d%02d_%s" % (
                        record.authors[0].lastname, record.year, monthnum, record.title[:5])
                except IndexError:
                    try:
                        namei = "%d%02d" % (record.year, monthnum)
                    except Exception:
                        continue
                except Exception as e:
                    print(f"failing on {record.entry_name}")
                    print(e)
                    continue
                names.append(namei)
                record_sub.append(record)
            # namesort = sorted(names)
            # records = [record_sub[names.index(name)] for name in namesort]
            records = np.asarray(record_sub)[np.argsort(names)]

        else:
            # if we don't want to sort then just use the same list
            records = self.records

        recs = []
        rec_list = []

        for record in records:
            try:
                # [record.authors[0].short_name(), record.title, record.year]
                reci = f"{record.authors[0].lastname}_{record.title[:5]}_{record.year}_{record.entry_name}"
            except IndexError:
                try:
                    reci = f"{record.title[:5]}_{record.year}_{record.entry_name}"
                except Exception as e:
                    print(f"failing on {record.entry_name}")
                    print(e)
                    continue
            # find duplicates
            if reci not in rec_list:
                recs.append([record, record.entry_name])
                rec_list.append(reci)
            # recs.append([record, record.entry_name])
        print(f"Down to {len(recs)} records")

        # check if we want to save this out
        if save:
            # for input from the web UI
            # or if a file handler is passed in
            if outfile is not None:
                for rec in recs:
                    outfile.write("@%s{%s,\n" % (rec[0].rec_type, rec[1]))
                    for text in rec[0].text:
                        outfile.write("%s" % text)
                    outfile.write("\n}\n\n")
            # for a file input
            elif self.filetype == 'file':
                with open(outname, "w", encoding='utf-8') as outfile:
                    for rec in recs:
                        outfile.write("@%s{%s,\n" % (rec[0].rec_type, rec[1]))
                        for text in rec[0].text:
                            outfile.write("%s" % text)
                        outfile.write("\n}\n\n")

        return recs


def type2index(type):
    if type.lower() == 'article':
        return 100
    elif type.lower() == 'inproceedings':
        return 10
    elif type.lower() == 'book':
        return 1
    else:
        return 0
