!function (document, window) {
    'use strict';

    var Body = document.body,
        removeWatchers;

    window.openPgModal = openPgModal;
    window.closePgModal = closePgModal;

    function isFocusable (element) {
        if (element.tabIndex > 0 || (element.tabIndex === 0 && element.getAttribute('tabIndex') !== null)) {
            return true;
        }

        if (element.disabled) {
            return false;
        }

        switch (element.nodeName) {
            case 'A':
                return !!element.href && element.rel !== 'ignore';
            case 'INPUT':
                return element.type !== 'hidden' && element.type !== 'file';
            case 'BUTTON':
            case 'SELECT':
            case 'TEXTAREA':
                return true;
            default:
                return false;
        }
    }

    function attemptFocus (element) {
        if (!isFocusable(element)) {
            return false;
        }

        try {
            element.focus();
        }
        catch (e) {
        }
        return (document.activeElement === element);
    }

    function focusFirstDescendant (element) {
        for (var i = 0; i < element.childNodes.length; i++) {
            var child = element.childNodes[i];
            if (attemptFocus(child) || focusFirstDescendant(child)) {
                return true;
            }
        }
        return false;
    }

    function focusLastDescendant (element) {
        for (var i = element.childNodes.length - 1; i >= 0; i--) {
            var child = element.childNodes[i];
            if (attemptFocus(child) || focusLastDescendant(child)) {
                return true;
            }
        }
        return false;
    }

    function openPgModal (id) {
        var _this = {};

        _this.modalContainer = document.getElementById(id);
        _this.modal = _this.modalContainer.getElementsByClassName('pg-modal')[0];
        _this.modalOverlay = _this.modalContainer.getElementsByClassName('pg-modal__overlay')[0];
        _this.closeModals = _this.modalContainer.getElementsByClassName('pg-modal-close');

        _this.openModal = function () {
            _this.previousActiveElement = document.activeElement;
            Body.classList.add('pg-modal-open');
            _this.modalContainer.classList.add('pg-modal-show');

            _this.addWatchers();
            focusFirstDescendant(_this.modal);
        };


        _this.closeModal = function () {
            Body.classList.remove('pg-modal-open');
            _this.modalContainer.classList.remove('pg-modal-show');

            _this.removeWatchers();
            _this.focusPreviousElement();
        };

        _this.focusPreviousElement = function () {
            if (_this.previousActiveElement) {
                _this.previousActiveElement.focus();
            }
        };

        _this.addMissingElementAndAttributed = function () {
            _this.prevNode = _this.modalContainer.getElementsByClassName('pg-modal__prev-node')[0];
            if (!_this.prevNode) {
                _this.prevNode = document.createElement('DIV');
                _this.prevNode.classList.add('pg-modal__prev-node');
                _this.prevNode.tabIndex = 0;
                _this.modalContainer.insertBefore(_this.prevNode, _this.modal);
            }

            _this.postNode = _this.modalContainer.getElementsByClassName('pg-modal__post-node')[0];
            if (!_this.postNode) {
                _this.postNode = document.createElement('DIV');
                _this.postNode.classList.add('pg-modal__post-node');
                _this.postNode.tabIndex = 0;
                _this.modalContainer.appendChild(_this.postNode);
            }

            _this.modal.setAttribute('role', 'dialog');
            _this.modal.setAttribute('aria-modal', 'true');

            for (var i = 0; i < _this.closeModals.length; i++) {
                if (!_this.closeModals[i].getAttribute('aria-label')) {
                    _this.closeModals[i].setAttribute('aria-label', 'Close Modal');
                }
            }
        };

        _this.prevNodeFocused = function () {
            focusLastDescendant(_this.modal);
        };

        _this.postNodeFocused = function () {
            focusFirstDescendant(_this.modal);
        };

        _this.windowKeyPressed = function (event) {
            if (event.keyCode === 27) { // Escape pressed
                _this.closeModal();
                event.preventDefault();
            }
        };

        _this.addWatchers = function () {
            _this.modalOverlay.addEventListener('click', _this.closeModal);

            for (var i = 0; i < _this.closeModals.length; i++) {
                _this.closeModals[i].addEventListener('click', _this.closeModal);
            }
            _this.prevNode.addEventListener('focus', _this.prevNodeFocused);
            _this.postNode.addEventListener('focus', _this.postNodeFocused);

            window.addEventListener('keydown', _this.windowKeyPressed);
        };

        _this.removeWatchers = function () {
            _this.modalOverlay.removeEventListener('click', _this.closeModal);

            for (var i = 0; i < _this.closeModals.length; i++) {
                _this.closeModals[i].removeEventListener('click', _this.closeModal);
            }

            _this.prevNode.removeEventListener('focus', _this.prevNodeFocused);
            _this.postNode.removeEventListener('focus', _this.postNodeFocused);

            window.removeEventListener('keydown', _this.windowKeyPressed);
        };

        removeWatchers = function () {
            _this.removeWatchers();
            _this.focusPreviousElement();
        };

        _this.addMissingElementAndAttributed();
        _this.openModal();
    }

    function closePgModal (id) {
        Body.classList.remove('pg-modal-open');
        document.getElementById(id).classList.remove('pg-modal-show');
        if (removeWatchers) {
            removeWatchers();
        }
    }

}(document, window);