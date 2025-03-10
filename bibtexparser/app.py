from flask import Flask, render_template, request
from .parser import bibtexParser
import json
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
    if request.method == 'POST':
        bib = request.json['bibdata']
        bibdata = io.StringIO()
        bibdata.write(bib)
        temp_raw = request.json['template']
        template = io.StringIO()
        template.write(temp_raw)
        bibdata.seek(0)
        template.seek(0)
    elif request.method == 'GET':
        return 0
    else:
        return 0

    if (bib == "") or (temp_raw == ""):
        return json.dumps({'data': "Please enter/upload both the bibtex entries and a template!"})

    strfile = io.StringIO()

    try:
        parser = bibtexParser('test', bibdata)

        if len(parser.records) == 0:
            return "No records found in bibtex!"

        parser.to_out(strfile, template, sort=False, clean=False)
    except Exception as e:
        # raise(e)
        return json.dumps({'error': f"Error: {e}"})

    strfile.seek(0)
    output = strfile.read()

    return json.dumps({'data': output})


@app.route('/upload/', methods=['POST'])
def upload():
    if request.method == 'POST':
        try:
            file = request.files['file']
        except Exception as e:
            raise e
    elif request.method == 'GET':
        return ""
    else:
        return ""

    data = str(file.stream.read(), encoding='utf-8')

    # render_template('show_output.html', output=output)
    return json.dumps({'data': data})


@app.route('/clean/', methods=['POST'])
def clean():
    if request.method == 'POST':
        bib = request.json['text']
        bibdata = io.StringIO()
        bibdata.write(bib)
        bibdata.seek(0)
    elif request.method == 'GET':
        return 0
    else:
        return 0

    if bib == "":
        return json.dumps({'data': "Please enter/upload a bibtex file!"})

    clean_data = io.StringIO()

    try:
        parser = bibtexParser('test', bibdata)

        clean_data = io.StringIO()

        parser.cleanup(sort=True, save=True, outfile=clean_data)
        data = clean_data.getvalue()
    except Exception as e:
        return json.dumps({'error': f"Error: {e}"})

    return json.dumps({'data': data})


if __name__ == '__main__':
    app.run(port=5000, debug=True)
