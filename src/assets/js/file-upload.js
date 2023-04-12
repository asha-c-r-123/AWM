!function (document, window) {
    'use strict';

    window.pgFileInput = pgFileInput;

    var fileInputs = document.getElementsByClassName('pg-file-upload');

    for (var i = 0; i < fileInputs.length; i++) {
        pgFileInput(fileInputs[i]);
    }

    function pgFileInput (element) {
        var pgFileElement = element,
            pgFileInput = pgFileElement.getElementsByTagName('input')[0],
            pgFileName = pgFileElement.getElementsByClassName('pg-file-upload__file-name')[0],
            pgFileUploadContainer = pgFileElement.getElementsByClassName('pg-file-upload__container')[0],
            selectText =  pgFileInput.getAttribute('data-select-text'),
            isMultiSelect = typeof pgFileInput.getAttribute('multiple') === 'string',
            pgFileDelete,
            pgFileSelectText;

        createElements();
        pgFileInput.addEventListener('change', pgInputChanged);
        pgFileDelete.addEventListener('click', pgInputClear);
        pgFileInput.addEventListener('focus', pgInputFocus);
        pgFileInput.addEventListener('blur', pgInputBlur);

        function pgInputFocus () {
            pgFileElement.classList.add('focused');
        }

        function pgInputBlur () {
            pgFileElement.classList.remove('focused');
        }

        function pgInputChanged () {

            if (pgFileInput.files.length) {
                pgFileElement.classList.add('file-selected');
                if (pgFileInput.files.length === 1) {
                    pgFileName.innerText = pgFileInput.files[0].name;
                } else {
                    pgFileName.innerText = (pgFileInput.getAttribute('data-multiple-caption') || '{count} files selected')
                        .replace('{count}', pgFileInput.files.length.toString());
                }
            }
        }

        function pgInputClear () {
            pgFileInput.value = '';
            pgFileElement.classList.remove('file-selected')
        }

        function createElements () {
            pgFileSelectText = document.createElement('SPAN');
            pgFileSelectText.classList.add('pg-file-upload__select-text');
            pgFileSelectText.innerText = selectText || (isMultiSelect ? 'Upload Multiple Files' : 'Upload File');
            pgFileUploadContainer.appendChild(pgFileSelectText);

            pgFileDelete = document.createElement('BUTTON');
            pgFileDelete.classList.add('pg-file-upload__remove');
            pgFileElement.appendChild(pgFileDelete);
        }
    }
}(document, window);