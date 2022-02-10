from shutil import ExecError
from django.shortcuts import render
from flask import Flask, render_template, request
from .parser import bibtexParser
import io

app = Flask('bibtexparser')
_sample_bib = '''@ARTICLE{1948PhRv...73..803A,
       author = {{Alpher}, R.~A. and {Bethe}, H. and {Gamow}, G.},
        title = "{The Origin of Chemical Elements}",
      journal = {Physical Review},
         year = 1948,
        month = apr,
       volume = {73},
       number = {7},
        pages = {803-804},
          doi = {10.1103/PhysRev.73.803},
       adsurl = {https://ui.adsabs.harvard.edu/abs/1948PhRv...73..803A},
      adsnote = {Provided by the SAO/NASA Astrophysics Data System}
}
}'''

bibdata = io.StringIO()
bibdata.write(_sample_bib)
bibdata.seek(0)

testparser = bibtexParser('test', bibdata)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/parse/', methods=['GET', 'POST'])
def parse():
    if request.method=='POST':
        bib  = request.form['bibdata']
        bibdata  = io.StringIO()
        bibdata.write(bib)
        temp_raw = request.form['template']
        template = io.StringIO()
        template.write(temp_raw)

        sort  = request.form['sort']
        clean = request.form['clean']

        if sort=="true":
            sort = True
        else:
            sort = False

        if clean=="true":
            clean = True
        else:
            clean = False
        bibdata.seek(0); template.seek(0)
    elif request.method=='GET':
        return 0
    else:
        return 0

    if (bib=="") or (temp_raw==""):
        return "Please enter/upload both the bibtex entries and a template!"

    strfile = io.StringIO()

    try:
        parser = bibtexParser('test', bibdata)

        if len(parser.records)==0:
            return "No records found in bibtex!"

        parser.to_out(strfile, template, sort=sort, clean=clean)
    except Exception as e:
        raise e
        return f"Please enter a valid bibtex entry and template! Error: {e}"

    strfile.seek(0)
    output = strfile.read()

    return output

@app.route('/upload/', methods=['POST'])
def upload():
    if request.method=='POST':
        try:
            file  = request.files['bibfile']
        except KeyError:
            file  = request.files['templatefile']
        except Exception as e:
            raise e
    elif request.method=='GET':
        return ""
    else:
        return ""
    data = str(file.stream.read(), encoding='utf-8')
    
    return data #render_template('show_output.html', output=output)

if __name__=='__main__':
    app.run(port=5000, debug=True)