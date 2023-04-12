!function (document, window) {
    'use strict';

    window.pgDatePicker = pgDatePicker;

    var datePickers = document.getElementsByClassName('pg-date-picker'),
        datePickerIdCounter = 1;

    for (var i = 0; i < datePickers.length; i++) {
        pgDatePicker(datePickers[i]);
    }

    function pgDatePicker (element) {
        var datePicker = element,
            datePickerId = datePickerIdCounter++,
            input = datePicker.getElementsByTagName('INPUT')[0],
            value = input.value,
            valueDate = {},
            displayDate = {},
            todayDate = {
                day: (new Date()).getDate(),
                month: (new Date()).getMonth(),
                year: (new Date()).getFullYear()
            },
            datePickerInput,
            datePickerOverlay,
            datePickerContainer,
            datePickerPrevMonthButton,
            datePickerTitle,
            datePickerNextMonthButton,
            datePickerCalendarContainer,
            prevNode,
            postNode,
            weekStartFrom = ~~datePicker.getAttribute('data-week-start-from'),
            dateFormat = datePicker.getAttribute('data-date-format') || 'YYYY-MM-DD',
            placeholder = datePicker.getAttribute('data-placeholder'),
            weekDays = ['S','M','T','W','T','F','S'],
            fullWeekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
            monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'
            ];

        createDatePickerComponents();
        setWatchers();
        setValueParams();
        setValue();
        setAccessibilityAttributes();

        function createDatePickerComponents () {

            datePickerInput = document.createElement('BUTTON');
            datePickerInput.classList.add('pg-date-picker__input');
            datePicker.appendChild(datePickerInput);

            datePickerOverlay = document.createElement('DIV');
            datePickerOverlay.classList.add('pg-date-picker__overlay');
            datePicker.appendChild(datePickerOverlay);

            datePickerContainer = document.createElement('DIV');
            datePickerContainer.classList.add('pg-date-picker__container');
            datePicker.appendChild(datePickerContainer);

            var datePickerControls = document.createElement('DIV');
            datePickerControls.classList.add('pg-date-picker__controls');
            datePickerContainer.appendChild(datePickerControls);

            datePickerPrevMonthButton = document.createElement('BUTTON');
            datePickerPrevMonthButton.setAttribute('aria-label', 'Show previous month');
            datePickerPrevMonthButton.classList.add('pg-date-picker__controls-button');
            datePickerControls.appendChild(datePickerPrevMonthButton);

            datePickerTitle = document.createElement('DIV');
            datePickerTitle.classList.add('pg-date-picker__controls-title');
            datePickerControls.appendChild(datePickerTitle);

            datePickerNextMonthButton = document.createElement('BUTTON');
            datePickerNextMonthButton.setAttribute('aria-label', 'Show next month');
            datePickerNextMonthButton.classList.add('pg-date-picker__controls-button');
            datePickerControls.appendChild(datePickerNextMonthButton);

            var datePickerWeekDaysContainer = document.createElement('DIV');
            datePickerWeekDaysContainer.classList.add('pg-date-picker__week-days');
            datePickerContainer.appendChild(datePickerWeekDaysContainer);

            var i, weekDay;

            for (i=weekStartFrom; i<weekDays.length; i++) {
                weekDay = document.createElement('DIV');
                weekDay.innerText = weekDays[i];
                datePickerWeekDaysContainer.appendChild(weekDay);
            }
            for (i=0; i<weekStartFrom; i++) {
                weekDay = document.createElement('DIV');
                weekDay.innerText = weekDays[i];
                datePickerWeekDaysContainer.appendChild(weekDay);
            }

            datePickerCalendarContainer = document.createElement('DIV');
            datePickerCalendarContainer.classList.add('pg-date-picker__calendar-container');
            datePickerContainer.appendChild(datePickerCalendarContainer);

            prevNode = document.createElement('DIV');
            prevNode.tabIndex = -1;
            datePicker.insertBefore(prevNode, datePickerContainer);

            postNode = document.createElement('DIV');
            postNode.tabIndex = -1;
            datePicker.appendChild(postNode);
        }

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
            focusLastDescendant(datePickerContainer);
        }

        function postNodeFocused () {
            focusFirstDescendant(datePickerContainer);
        }

        function setAccessibilityAttributes () {
            datePickerInput.id = 'pg_dropdown_'+datePickerId;
            datePickerCalendarContainer.setAttribute('aria-labelledby', 'pg_date-picker_'+datePickerId);
            datePickerInput.setAttribute('aria-haspopup', 'listbox');
            datePickerCalendarContainer.setAttribute('role', 'listbox');
            datePickerCalendarContainer.tabIndex = 0;
        }

        function createMonthView () {
            datePickerCalendarContainer.innerHTML = '';
            datePickerTitle.innerText = monthNames[displayDate['month']]+' '+displayDate['year'];

            var monthStartsFrom = new Date(displayDate['year'], displayDate['month'], 1).getDay(),
                daysInWeek = 0,
                dayNumber = 1;

            if (monthStartsFrom !== weekStartFrom) {
                for (
                    var i = monthStartsFrom-weekStartFrom>0 ?
                        weekStartFrom-monthStartsFrom+1 :
                        weekStartFrom-weekDays.length-monthStartsFrom+1;
                    i<=0;
                    i++, daysInWeek++
                ) {
                    datePickerCalendarContainer.appendChild(
                        createDayElement(displayDate['year'], displayDate['month'], i)
                    );
                }
            }

            for (
                ;
                new Date(displayDate['year'], displayDate['month'], dayNumber) .getMonth() === displayDate['month'];
                dayNumber++, daysInWeek++
            ) {
                if (daysInWeek === weekDays.length) {
                    daysInWeek = 0;
                }

                datePickerCalendarContainer.appendChild(
                    createDayElement(displayDate['year'], displayDate['month'], dayNumber)
                );
            }

            for (;daysInWeek !== weekDays.length; daysInWeek++, dayNumber++) {
                datePickerCalendarContainer.appendChild(
                    createDayElement(displayDate['year'], displayDate['month'], dayNumber
                    ));
            }
        }

        function createDayElement (year, month, dayNumber) {
            var dayContainer = document.createElement('DIV'),
                date = new Date(year, month, dayNumber),
                dateYear = date.getFullYear(),
                dateMonth = date.getMonth(),
                dateDay = date.getDate();

            if (
                dateYear === todayDate['year'] &&
                dateMonth === todayDate['month'] &&
                dateDay === todayDate['day']
            ) {
                dayContainer.classList.add('pg-date-picker__today')
            }
            if (
                dateYear === valueDate['year'] &&
                dateMonth === valueDate['month'] &&
                dateDay === valueDate['day']
            ) {
                dayContainer.classList.add('selected');
            }
            if (
                dateYear === displayDate['year'] &&
                dateMonth === displayDate['month']
            ) {
                dayContainer.classList.add('pg-date-picker__day');
                dayContainer.setAttribute('role', 'option');
                dayContainer.setAttribute('aria-label',
                    '' + dateDay + ' ' +
                    monthNames[dateMonth] + ' ' +
                    fullWeekDays[date.getDay()] + ' ' +
                    dateYear
                );
                dayContainer.id = 'pg_dropdown_' + datePickerId + '_'
                    + (dateMonth+1) + '/'
                    + dateDay + '/'
                    + dateYear;
            } else {
                dayContainer.classList.add('pg-date-picker__not-this-month');
            }

            dayContainer.innerText = date.getDate().toString();

            return dayContainer;
        }

        function setWatchers () {
            datePickerNextMonthButton.addEventListener('click', displayNextMonth);
            datePickerPrevMonthButton.addEventListener('click', displayPrevMonth);
            datePickerCalendarContainer.addEventListener('click', changeValue);
            datePickerCalendarContainer.addEventListener('mousedown', preventEvent);
            prevNode.addEventListener('focus', prevNodeFocused);
            postNode.addEventListener('focus', postNodeFocused);
            datePickerOverlay.addEventListener('click', closeDatePicker);
            datePickerCalendarContainer.addEventListener('keydown', datePickerContainerKeyPressed);
            datePickerInput.addEventListener('click', inputClicked);
            datePickerCalendarContainer.addEventListener('focus', datePickerCalendarContainerFocused);
        }

        function preventEvent (event) {
            event.preventDefault();
        }

        function focusDayElement (element) {
            removeFocusFromFocusedDayElement();

            element.classList.add('focused');
            datePickerCalendarContainer.setAttribute('aria-activedescendant', element.id)
        }

        function getFocusedDayElement () {
            return datePickerCalendarContainer.getElementsByClassName('focused')[0];
        }

        function removeFocusFromFocusedDayElement () {
            var focusedDayElement = getFocusedDayElement();

            if (focusedDayElement) {
                focusedDayElement.classList.remove('focused');
            }
        }

        function getDayToFocus () {
            var focusedElement = getFocusedDayElement();

            if (focusedElement) {
                return focusedElement;
            }

            var daysElements = Array.from(datePickerCalendarContainer.getElementsByClassName('pg-date-picker__day')),
                selectedDayElement = datePickerCalendarContainer.getElementsByClassName('selected')[0],
                todayDayElement = datePickerCalendarContainer.getElementsByClassName('pg-date-picker__today')[0];

            if (daysElements.indexOf(selectedDayElement) !== -1) {
                return selectedDayElement;
            }
            if (daysElements.indexOf(todayDayElement) !== -1) {
                return todayDayElement;
            }

            return daysElements[0];
        }

        function changeFocusedDay (changeIndex) {
            var daysElements = datePickerCalendarContainer.getElementsByClassName('pg-date-picker__day'),
                activeIndex = 0;

            for (; activeIndex < daysElements.length; activeIndex++) {
                if (daysElements[activeIndex].classList.contains('focused')) {
                    break;
                }
            }

            activeIndex += changeIndex;

            if (activeIndex >= daysElements.length) {
                focusNextMonth(activeIndex - daysElements.length);
            } else if (activeIndex < 0) {
                focusPreviousMonth(-activeIndex);
            } else {
                focusDayElement(daysElements[activeIndex]);
            }
        }

        function focusPreviousMonth (dayFocusIndex) {
            var focusedElementIndex = getFocusedDayElement().innerText - 1;
            displayPrevMonth();

            setTimeout(function () {
                var daysElements = datePickerCalendarContainer.getElementsByClassName('pg-date-picker__day');

                if (typeof dayFocusIndex === 'number') {
                    if (daysElements[daysElements.length - dayFocusIndex]) {
                        focusDayElement(daysElements[daysElements.length - dayFocusIndex]);
                        return;
                    }
                } else if (daysElements[focusedElementIndex]) {
                    focusDayElement(daysElements[focusedElementIndex]);
                    return;
                }

                focusLastDay();
            });
        }

        function changeYear (yearIndex) {
            var focusedElementIndex = getFocusedDayElement().innerText - 1;
            displayDate['year'] += yearIndex;
            createMonthView();

            setTimeout(function () {
                var daysElements = datePickerCalendarContainer.getElementsByClassName('pg-date-picker__day');

                if (daysElements[focusedElementIndex]) {
                    focusDayElement(daysElements[focusedElementIndex]);
                } else {
                    focusLastDay();
                }
            });
        }

        function focusNextMonth (dayFocusIndex) {
            var focusedElementIndex = getFocusedDayElement().innerText - 1;
            displayNextMonth();

            setTimeout(function () {
                var daysElements = datePickerCalendarContainer.getElementsByClassName('pg-date-picker__day');

                if (typeof dayFocusIndex === 'number') {
                    if (daysElements[dayFocusIndex]) {
                        focusDayElement(daysElements[dayFocusIndex]);
                    } else {
                        focusFirstDay();
                    }
                } else if (daysElements[focusedElementIndex]) {
                    focusDayElement(daysElements[focusedElementIndex]);
                } else {
                    focusLastDay();
                }
            });
        }

        function focusFirstDay () {
            var daysElements = datePickerCalendarContainer.getElementsByClassName('pg-date-picker__day');

            focusDayElement(daysElements[0]);
        }


        function focusLastDay () {
            var daysElements = datePickerCalendarContainer.getElementsByClassName('pg-date-picker__day');

            focusDayElement(daysElements[daysElements.length - 1]);
        }

        function datePickerCalendarContainerFocused (event) {
            if (!event.clientX && !event.clientY) {
                var dayToFocus = getDayToFocus();

                focusDayElement(dayToFocus);
            }
        }

        function datePickerContainerKeyPressed (event) {
            if (event.altKey) { // Alt key hold
                if (event.keyCode === 34) { // Page Down key pressed
                    changeYear(-1);
                    event.preventDefault();
                } else if (event.keyCode === 33) { // Page Up key pressed
                    changeYear(1);
                    event.preventDefault();
                }
            } else if (event.keyCode === 40) { // Down arrow key pressed
                changeFocusedDay(7);
                event.preventDefault();
            } else if (event.keyCode === 39) { // Right arrow key pressed
                changeFocusedDay(1);
                event.preventDefault();
            } else if (event.keyCode === 38) { // Up arrow key pressed
                changeFocusedDay(-7);
                event.preventDefault();
            } else if (event.keyCode === 37) { // Left arrow key pressed
                changeFocusedDay(-1);
                event.preventDefault();
            } else if (event.keyCode === 36) { // Home key pressed
                focusFirstDay();
                event.preventDefault();
            } else if (event.keyCode === 35) { // End key pressed
                focusLastDay();
                event.preventDefault();
            } else if (event.keyCode === 34) { // Page Down key pressed
                focusPreviousMonth();
                event.preventDefault();
            } else if (event.keyCode === 33) { // Page Up key pressed
                focusNextMonth();
                event.preventDefault();
            }  else if ([32, 13].indexOf(event.keyCode) !== -1) { // Spacebar or Enter key pressed
                selectDayElement(getFocusedDayElement());
                datePickerInput.focus();
                event.preventDefault();
            }
        }

        function windowKeyPressed (event) {
            if (event.keyCode === 27) { // Escape pressed
                closeDatePicker();
                datePickerInput.focus();
                event.preventDefault();
            }
        }

        function displayNextMonth () {
            displayDate['month']++;
            if (displayDate['month'] === monthNames.length) {
                displayDate['month'] = 0;
                displayDate['year']++;
            }
            createMonthView();
        }

        function displayPrevMonth () {
            displayDate['month']--;
            if (displayDate['month'] < 0) {
                displayDate['month'] = monthNames.length-1;
                displayDate['year']--;
            }
            createMonthView();
        }

        function changeValue (event) {
            var target = event.target;

            if (target && target.classList.contains('pg-date-picker__day')) {
                selectDayElement(target);
            }
        }

        function selectDayElement (element) {
            if (element) {
                valueDate['day'] = ~~element.innerText;
                valueDate['month'] = displayDate['month'];
                valueDate['year'] = displayDate['year'];
                closeDatePicker();
                setValue();
            }
        }

        function setValueParams () {
            if (value) {
                valueDate['day'] = ~~value.substr(dateFormat.indexOf('DD'), 2);
                valueDate['month'] = ~~value.substr(dateFormat.indexOf('MM'), 2)-1;
                valueDate['year'] = ~~value.substr(dateFormat.indexOf('YYYY'), 4);
            }
        }

        function setDisplayValueParams () {
            if (valueDate.hasOwnProperty('day')
                && valueDate.hasOwnProperty('month')
                && valueDate.hasOwnProperty('year')) {
                displayDate['month'] = valueDate['month'];
                displayDate['year'] = valueDate['year'];
            } else {
                displayDate['month'] = new Date() .getMonth();
                displayDate['year'] = new Date() .getFullYear();
            }
        }

        function setValue () {
            if (valueDate.hasOwnProperty('day')
                && valueDate.hasOwnProperty('month')
                && valueDate.hasOwnProperty('year')) {
                value = dateFormat
                    .replace('DD', ('0'+valueDate['day']).substr(-2))
                    .replace('MM', ('0'+(valueDate['month']+1)).substr(-2))
                    .replace('YYYY', valueDate['year']);
                input.value = value;
                datePickerInput.classList.remove('empty');
                datePickerInput.innerText = value;
            } else {
                datePickerInput.innerText = placeholder;
                datePickerInput.classList.add('empty');
            }
        }

        function inputClicked (event) {
            if (event.clientX && event.clientY) {
                toggleDatePicker();
            } else {
                openDatePicker();
                postNodeFocused();
            }
        }

        function toggleDatePicker () {
            if (datePicker.classList.contains('active')) {
                closeDatePicker();
            } else {
                openDatePicker();
            }
        }

        function closeDatePicker () {
            prevNode.tabIndex = -1;
            postNode.tabIndex = -1;
            datePickerContainer.removeAttribute('aria-hidden');
            datePickerInput.removeAttribute('aria-expanded');
            datePicker.classList.remove('active');
            window.removeEventListener('click', checkPickerOutClick);
            window.removeEventListener('keydown', windowKeyPressed);
        }

        function openDatePicker () {
            prevNode.tabIndex = 0;
            postNode.tabIndex = 0;
            datePickerInput.setAttribute('aria-expanded', 'true');
            datePickerContainer.setAttribute('aria-hidden', 'false');
            datePickerContainer.setAttribute('role', 'dialog');
            datePickerContainer.setAttribute('aria-modal', 'true');
            datePicker.classList.add('active');
            setDisplayValueParams();
            createMonthView();
            window.addEventListener('click', checkPickerOutClick);
            window.addEventListener('keydown', windowKeyPressed);
        }

        function checkPickerOutClick (event) {
            if (datePicker.classList.contains('active')) {
                var element = event.target;

                while (element && element !== datePicker) {
                    element = element.parentNode;
                }

                if (element !== datePicker) {
                    closeDatePicker();
                }
            }
        }

    }

}(document, window);