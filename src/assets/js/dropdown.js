!function(document, window) {
    'use strict';

    window.pgDropdown = pgDropdown;

    var Dropdowns = document.getElementsByClassName('pg-dropdown'),
        idCounter = 0;

    for (var i = 0; i < Dropdowns.length; i++) {
        pgDropdown(Dropdowns[i]);
    }

    function pgDropdown (element) {
        var dropdown = element,
            input = dropdown.getElementsByTagName('INPUT')[0],
            dropdownList = dropdown.getElementsByClassName('pg-dropdown__list')[0],
            optionsList = dropdownList.getElementsByTagName('UL')[0],
            dropdownPlaceholder = dropdown.getAttribute('data-placeholder'),
            dropdownType = dropdown.getAttribute('data-dropdown-type') || 'single', // 'single' || 'multi'
            dropdownMultiSeparator = dropdown.getAttribute('data-multi-separator') || ',',
            dropdownWithSearch = dropdown.getAttribute('data-dropdown-search') === 'true',
            dropdownSearchPlaceholder = dropdown.getAttribute('data-dropdown-search-placeholder') || 'Search',
            value = input.value,
            searchInput,
            selectAllButton,
            deselectAllButton,
            dropdownOverlay,
            multiValue = [],
            displayValue,
            dropdownInput,
            prevNode,
            postNode;

        createDropdownComponents();
        setWatchers();
        parsDropdownValue();
        setDropdownOptionsIds();
        setSelectedValues();
        setAccessibilityAttributes();

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

        function prevNodeFocused () {
            focusLastDescendant(dropdownList);
        }

        function postNodeFocused () {
            focusFirstDescendant(dropdownList);
        }

        function setAccessibilityAttributes () {
            dropdownInput.id = 'pg_dropdown_'+idCounter;
            optionsList.setAttribute('aria-labelledby', 'pg_dropdown_'+idCounter);
            dropdownInput.setAttribute('aria-haspopup', 'listbox');
            optionsList.setAttribute('role', 'listbox');
            optionsList.tabIndex = 0;

            var dropdownOptions = optionsList.getElementsByTagName('LI');

            for (var i=0; i<dropdownOptions.length; i++) {
                dropdownOptions[i].setAttribute('role', 'option')
            }
        }

        function createDropdownComponents () {
            dropdownInput = document.createElement('BUTTON');
            dropdownInput.classList.add('pg-dropdown__input');
            dropdown.insertBefore(dropdownInput, dropdownList);

            dropdownOverlay = document.createElement('DIV');
            dropdownOverlay.classList.add('pg-dropdown__overlay');
            dropdown.insertBefore(dropdownOverlay, dropdown.childNodes[0]);

            prevNode = document.createElement('DIV');
            prevNode.tabIndex = -1;
            dropdown.insertBefore(prevNode, dropdownList);

            postNode = document.createElement('DIV');
            postNode.tabIndex = -1;
            dropdown.appendChild(postNode);

            if (dropdownType === 'multi') {
                dropdownList.classList.add('pg-dropdown__multi-list');
            }

            if (dropdownWithSearch) {
                dropdownList.classList.add('long');

                var searchContainer = document.createElement('DIV');
                searchContainer.classList.add('pg-dropdown__search-container');
                dropdownList.insertBefore(searchContainer, dropdownList.childNodes[0]);

                var search = document.createElement('DIV');
                search.classList.add('pg-dropdown__search');
                searchContainer.appendChild(search);

                searchInput = document.createElement('INPUT');
                searchInput.placeholder = dropdownSearchPlaceholder;
                search.appendChild(searchInput);

                var searchButton = document.createElement('DIV');
                searchButton.classList.add('pg-dropdown__search-button');
                search.appendChild(searchButton);

                if (dropdownType === 'multi') {
                    deselectAllButton = document.createElement('BUTTON');
                    deselectAllButton.classList.add('pg-dropdown__button');
                    deselectAllButton.innerText = 'Deselect All';
                    searchContainer.appendChild(deselectAllButton);

                    selectAllButton = document.createElement('BUTTON');
                    selectAllButton.classList.add('pg-dropdown__button');
                    selectAllButton.innerText = 'Select All';
                    searchContainer.appendChild(selectAllButton);
                }
            }
        }

        function parsDropdownValue () {
            if (dropdownType === 'multi') {
                multiValue = value.split(',');
            }
        }

        function getDropdownOptions () {
            var dropdownOptions = Array.from(optionsList.getElementsByTagName('LI'));

            for (var i=0; i<dropdownOptions.length; i++) {
                if (dropdownOptions[i].offsetParent === null) {
                    dropdownOptions.splice(i, 1);
                    i--;
                }
            }

            return dropdownOptions;
        }

        function setDropdownOptionsIds () {
            var dropdownOptions = optionsList.getElementsByTagName('LI');

            for (var i=0; i<dropdownOptions.length; i++) {
                if (!dropdownOptions[i].id) {
                    dropdownOptions[i].id = 'pd_dropdown_option_'+idCounter++;
                }
            }
        }

        function setSelectedValues () {
            var dropdownOptions = optionsList.getElementsByTagName('LI');

            displayValue = '';

            for (var i=0; i<dropdownOptions.length; i++) {
                if (dropdownType === 'multi') {
                    if (multiValue.indexOf(dropdownOptions[i].getAttribute('value')) !== -1) {
                        dropdownOptions[i].classList.add('checked');
                        if (displayValue) {
                            displayValue += dropdownMultiSeparator+'<div class="pg-dropdown__separator"></div>'
                        }
                        displayValue += dropdownOptions[i].innerHTML
                    } else {
                        dropdownOptions[i].classList.remove('checked');
                    }
                } else {
                    if (dropdownOptions[i].getAttribute('value') === value) {
                        dropdownOptions[i].classList.add('selected');
                        displayValue = dropdownOptions[i].innerHTML;
                    } else {
                        dropdownOptions[i].classList.remove('selected');
                    }
                }
            }

            setDropdownInputValue();
        }

        function setDropdownInputValue () {
            if (dropdownType === 'multi') {
                value = multiValue.join(',');
            }
            if (value) {
                dropdownInput.innerHTML = displayValue;
                dropdownInput.classList.remove('empty')
            } else {
                dropdownInput.innerHTML = dropdownPlaceholder;
                dropdownInput.classList.add('empty')
            }
            input.value = value;
        }

        function setWatchers () {
            dropdownList.addEventListener('click', dropdownOptionClicked);
            dropdownInput.addEventListener('click', inputClicked);
            optionsList.addEventListener('focus', setActiveOption);
            optionsList.addEventListener('mousedown', preventEvent);
            prevNode.addEventListener('focus', prevNodeFocused);
            postNode.addEventListener('focus', postNodeFocused);
            optionsList.addEventListener('keydown', optionsListKeyPressed);
            dropdownOverlay.addEventListener('click', closeDropdown);

            if (deselectAllButton) {
                deselectAllButton.addEventListener('click', deselectAllOptions);
                deselectAllButton.addEventListener('mousedown', preventEvent);
            }
            if (selectAllButton) {
                selectAllButton.addEventListener('click', selectAllOptions);
                selectAllButton.addEventListener('mousedown', preventEvent);
            }
            if (searchInput) {
                searchInput.addEventListener('input', filterDropdownList);
            }
        }

        function preventEvent (event) {
            event.preventDefault();
        }

        function inputClicked (event) {
            if (event.clientX && event.clientY) {
                toggleDropdown();
            } else {
                openDropdown();
                focusFirstDescendant(dropdownList);
            }
        }

        function toggleDropdown () {
            if (dropdown.classList.contains('active')) {
                closeDropdown();
            } else {
                openDropdown();
            }
        }

        function windowKeyPressed (event) {
            if (event.keyCode === 27) { // Escape pressed
                closeDropdown();
                dropdownInput.focus();
                event.preventDefault();
            }
        }

        function openDropdown () {
            prevNode.tabIndex = 0;
            postNode.tabIndex = 0;
            dropdownInput.setAttribute('aria-expanded', 'true');
            dropdownList.setAttribute('aria-hidden', 'false');
            dropdownList.setAttribute('role', 'dialog');
            dropdownList.setAttribute('aria-modal', 'true');
            dropdown.classList.add('active');
            if (dropdownWithSearch) {
                searchInput.value = '';
                filterDropdownList();
            }
            window.addEventListener('click', checkDropdownOutClick);
            window.addEventListener('keydown', windowKeyPressed);
        }

        function setActiveOption () {
            var dropdownOptions = getDropdownOptions(),
                focusedOption = optionsList.getElementsByClassName('focused')[0];

            if (focusedOption) {
                if (focusedOption.offsetParent === null) {
                    focusedOption.classList.remove('focused');
                    if (dropdownOptions.length) {
                        scrollOptionIntoView(dropdownOptions[0]);
                        dropdownOptions[0].classList.add('focused');
                        optionsList.setAttribute('aria-activedescendant', dropdownOptions[0].id)
                    }
                } else {
                    scrollOptionIntoView(focusedOption);
                }
            } else {
                if (value && dropdownType !== 'multi') {
                    for (var i=0; i<dropdownOptions.length; i++) {
                        if (dropdownOptions[i].getAttribute('value') === value) {
                            dropdownOptions[i].classList.add('focused');
                            scrollOptionIntoView(dropdownOptions[i]);
                            optionsList.setAttribute('aria-activedescendant', dropdownOptions[i].id);
                        }
                    }
                } else if (dropdownOptions.length) {
                    scrollOptionIntoView(dropdownOptions[0]);
                    dropdownOptions[0].classList.add('focused');
                    optionsList.setAttribute('aria-activedescendant', dropdownOptions[0].id)
                }
            }
        }

        function scrollOptionIntoView (element) {
            var listPosition = optionsList.getBoundingClientRect(),
                elementPosition = element.getBoundingClientRect();

            if (elementPosition.top < listPosition.top) {
                optionsList.scrollTop = optionsList.scrollTop + elementPosition.top - listPosition.top;
            } else if (elementPosition.bottom > listPosition.bottom) {
                optionsList.scrollTop = optionsList.scrollTop + elementPosition.bottom - listPosition.bottom;
            }
        }

        function changeActiveOption (changeIndex) {
            var dropdownOptions = getDropdownOptions(),
                activeIndex = 0;

            for (; activeIndex<dropdownOptions.length; activeIndex++) {
                if (dropdownOptions[activeIndex].classList.contains('focused')) {
                    dropdownOptions[activeIndex].classList.remove('focused');
                    break;
                }
            }

            activeIndex += changeIndex;
            if (activeIndex >= dropdownOptions.length) {
                activeIndex = 0;
            } else if (activeIndex < 0) {
                activeIndex = dropdownOptions.length - 1;
            }

            dropdownOptions[activeIndex].classList.add('focused');
            scrollOptionIntoView(dropdownOptions[activeIndex]);
            optionsList.setAttribute('aria-activedescendant', dropdownOptions[activeIndex].id);
        }

        function optionsListKeyPressed (event) {
            if ([13, 32].indexOf(event.keyCode) !== -1) { // Enter or Spacebar pressed
                var focused = optionsList.getElementsByClassName('focused')[0];
                if (focused) {
                    selectOption(focused);
                }
                event.preventDefault();
            } else if (event.keyCode === 38) { // Up arrow pressed
                changeActiveOption(-1);
                event.preventDefault();
            } else if (event.keyCode === 40) { // Down arrow pressed
                changeActiveOption(1);
                event.preventDefault();
            }
        }

        function dropdownOptionClicked (event) {
            var element = event.target;

            while (element && element.tagName !== 'LI') {
                element = element.parentNode;
            }

            if (!element) {
                return;
            }

            selectOption(element);

        }

        function selectOption (element) {
            if (dropdownType === 'multi') {
                if (element.classList.contains('checked')) {
                    multiValue.splice(multiValue.indexOf(element.getAttribute('value')),1)
                } else {
                    multiValue.push(element.getAttribute('value'))
                }
            } else {
                value = element.getAttribute('value');
                closeDropdown();
                dropdownInput.focus();
            }
            setSelectedValues();
        }

        function checkDropdownOutClick (event) {
            if (dropdown.classList.contains('active')) {
                var element = event.target;

                while (element && element !== dropdown) {
                    element = element.parentNode;
                }

                if (element !== dropdown) {
                    closeDropdown();
                }
            }
        }

        function selectAllOptions () {
            var dropdownOptions = dropdownList.getElementsByTagName('LI');

            for (var i=0; i<dropdownOptions.length; i++) {
                if (!dropdownOptions[i].classList.contains('checked')
                    && !dropdownOptions[i].classList.contains('hide')) {
                    multiValue.push(dropdownOptions[i].getAttribute('value'))
                }
            }

            setSelectedValues();
        }


        function deselectAllOptions () {
            var dropdownOptions = dropdownList.getElementsByTagName('LI');

            for (var i=0; i<dropdownOptions.length; i++) {
                if (dropdownOptions[i].classList.contains('checked')
                    && !dropdownOptions[i].classList.contains('hide')) {
                    multiValue.splice(multiValue.indexOf(dropdownOptions[i].getAttribute('value')), 1);
                }
            }

            setSelectedValues();
        }

        function filterDropdownList () {
            var dropdownOptions = dropdownList.getElementsByTagName('LI');

            for (var i=0; i<dropdownOptions.length; i++) {
                if (dropdownOptions[i].innerText.toLocaleLowerCase().indexOf(searchInput.value.toLocaleLowerCase()) === -1) {
                    dropdownOptions[i].classList.add('hide');
                    dropdownOptions[i].setAttribute('aria-hidden','true');
                } else {
                    dropdownOptions[i].classList.remove('hide');
                    dropdownOptions[i].removeAttribute('aria-hidden');
                }
            }
        }

        function closeDropdown () {
            prevNode.tabIndex = -1;
            postNode.tabIndex = -1;
            dropdown.classList.remove('active');
            dropdownList.removeAttribute('aria-hidden');
            dropdownInput.removeAttribute('aria-expanded');
            window.removeEventListener('click', checkDropdownOutClick);
            window.removeEventListener('keydown', windowKeyPressed);
        }
    }

}(document, window);