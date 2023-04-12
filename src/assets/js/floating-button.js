!function (document, window) {
    'use strict';

    window.pgFloatingButton = pgFloatingButton;

    var floatingButtons = document.getElementsByClassName('pg-floating');

    for (var i = 0; i < floatingButtons.length; i++) {
        pgFloatingButton(floatingButtons[i]);
    }

    function pgFloatingButton (element) {
        var floatingContainer = element,
            floatingButton = floatingContainer.getElementsByClassName('pg-floating__toggle')[0],
            floatingMenu = floatingContainer.getElementsByClassName('pg-floating__menu')[0],
            floatingMenuActiveClass = 'pg-floating__menu--active';

        setAccessibilityOptions();
        if (floatingButton) {
            floatingButton.addEventListener('click', toggleFloatingMenu);
        }

        function setAccessibilityOptions () {
            floatingMenu.setAttribute('aria-hidden', 'true');
        }

        function toggleFloatingMenu () {
            if (floatingMenu.classList.contains(floatingMenuActiveClass)) {
                closeFloatingMenu();
            } else {
                openFloatingMenu();
            }
        }

        function floatingButtonOutClick (event) {
            var element = event.target;

            while (element) {
                if (element === floatingButton) {
                    return;
                }
                element = element.parentElement;
            }

            if (!element) {
                closeFloatingMenu();
            }
        }

        function openFloatingMenu () {
            floatingMenu.removeAttribute('aria-hidden');
            floatingMenu.classList.add(floatingMenuActiveClass);
            window.addEventListener('click', floatingButtonOutClick);
        }

        function closeFloatingMenu () {
            floatingMenu.setAttribute('aria-hidden', 'true');
            floatingMenu.classList.remove(floatingMenuActiveClass);
            window.removeEventListener('click', floatingButtonOutClick);
        }
    }
}(document, window);
