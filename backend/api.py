
#  The following pymol2 is part of https://github.com/schrodinger/pymol-open-source
#  Under the license https://github.com/schrodinger/pymol-open-source/blob/master/LICENSE

#  License
#  Open-Source PyMOL Copyright Notice
#  ==================================

#  The Open-Source PyMOL source code is copyrighted, but you can freely
#  use and copy it as long as you don't change or remove any of the
#  Copyright notices. The Open-Source PyMOL product is made available
#  under the following open-source license terms:

#  ----------------------------------------------------------------------
#  Open-Source PyMOL is Copyright (C) Schrodinger, LLC.

#  All Rights Reserved

#  Permission to use, copy, modify, distribute, and distribute modified
#  versions of this software and its built-in documentation for any
#  purpose and without fee is hereby granted, provided that the above
#  copyright notice appears in all copies and that both the copyright
#  notice and this permission notice appear in supporting documentation,
#  and that the name of Schrodinger, LLC not be used in advertising or
#  publicity pertaining to distribution of the software without specific,
#  written prior permission.

#  SCHRODINGER, LLC DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE,
#  INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN
#  NO EVENT SHALL SCHRODINGER, LLC BE LIABLE FOR ANY SPECIAL, INDIRECT OR
#  CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
#  OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
#  OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE
#  USE OR PERFORMANCE OF THIS SOFTWARE.
#  ----------------------------------------------------------------------

#  PyMOL Trademark Notice
#  ======================

#  PyMOL(TM) is a trademark of Schrodinger, LLC. Derivative
#  software which contains PyMOL source code must be plainly
#  distinguished from any and all PyMOL products distributed by Schrodinger,
#  LLC in all publicity, advertising, and documentation.

#  The slogans, "Includes PyMOL(TM).", "Based on PyMOL(TM) technology.",
#  "Contains PyMOL(TM) source code.", and "Built using PyMOL(TM).", may
#  be used in advertising, publicity, and documentation of derivative
#  software provided that the notice, "PyMOL is a trademark of Schrodinger,
#  LLC.", is included in a footnote or at the end of the
#  document.

#  All other endorsements employing the PyMOL trademark require specific,
#  written prior permission.

from flask import Flask, request, jsonify
import pymol2
import os
from flask_cors import CORS
from gemmi import cif, read_structure, CoorFormat

# doc = cif.read_file(
#     '../public/models/molGAN-MOF-Ncopper_paddle_pillar-L113COO-L130COO-L127Pyridine.cif')

# doc = cif.read_file('../public/models/caffeine.pdb')

# print(doc.as_json())

# print(doc)
# doc.write_pdb('output.pdb')
# j = doc.as_json()
# print(j)

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = '../public/models/'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route('/upload_and_convert', methods=['POST'])
def upload_and_convert():
    try:
        # Check if the POST request has a file attached
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'})

        file = request.files['file']

        # Check if the file has a valid name
        if file.filename == '':
            return jsonify({'error': 'No selected file'})

        if file.filename.endswith('.pdb'):
            filename = file.filename
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            print(filename, file_path)

            if os.path.exists(file_path):
                file.save(file_path)
                return jsonify({'success': f'File converted to {file_path}'}), 200

            file.save(file_path)
            return jsonify({'success': f'File converted to {file_path}'}), 200

        # Check if the file is of the desired format (e.g., .cif)
        if not file.filename.endswith('.cif'):
            return jsonify({'error': 'Invalid file format. Only .cif files are allowed'})

        # Save the uploaded file
        file.save(file.filename)

        # Perform the PyMOL functionality
        with pymol2.PyMOL() as pymol:
            pymol.cmd.load(file.filename, 'myprotein')
            current_dir = os.path.dirname(__file__)
            output_dir = os.path.join(current_dir, '..', 'public', 'models')
            output_file_name = os.path.basename(
                file.filename).replace('.cif', '.pdb')
            output_file_path = os.path.join(output_dir, output_file_name)
            pymol.cmd.save(output_file_path, selection='myprotein')

        # Clean up the uploaded file
        os.remove(file.filename)

        return jsonify({'success': f'File converted to {output_file_path}'})

    except Exception as e:
        return jsonify({'error': str(e)})
