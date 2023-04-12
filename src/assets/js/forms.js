!function (document) {
    'use strict';

    //iOS hover fix
    var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform),
        buttonGroup = document.getElementsByClassName('button-group'),
        buttonSwitch = document.getElementsByClassName('button-switch');

    document.addEventListener('touchstart', function() {},false);

    //alert(buttonGroup.length);
    if (iOS) {
        for (var i = 0; i < buttonGroup.length; i++) {
            buttonGroup[i].className += ' activeiOS';
        }
        for (i = 0; i < buttonSwitch.length; i++) {
            buttonSwitch[i].className += ' activeiOS';
        }
    }
}(document);