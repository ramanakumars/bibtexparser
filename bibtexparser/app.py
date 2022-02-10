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
        bibfile  = request.files['bibfile']
        bibdata  = io.StringIO()
        bibdata.write(str(bibfile.stream.read(), encoding='utf-8'))#.save(bibstr)
        template = io.StringIO()
        template.write(str(request.files['template'].stream.read(), encoding='utf-8'))#.save(temstr)

        bibdata.seek(0); template.seek(0)
    elif request.method=='GET':
        return 0
    else:
        return 0

    strfile = io.StringIO()

    parser = bibtexParser(bibfile.filename, bibdata)
    parser.to_out(strfile, template, sort=True, clean=False)

    strfile.seek(0)

    output = strfile.read()

    return output #render_template('show_output.html', output=output)

@app.route('/test/', methods=['GET', 'POST'])
def test_template():
    if request.method=='POST':
        template = io.StringIO()
        template.write(request.form['template'])

        if request.form['template'] == '':
            return ""

        template.seek(0)
    
    strfile = io.StringIO()
    
    try:
        testparser.to_out(strfile, template, sort=True, clean=False)
    except:
        return "Please check your template!"
    strfile.seek(0)

    output = strfile.read()

    return output

if __name__=='__main__':
    app.run(port=5000, debug=True)