!function (document, window) {
    'use strict';

    window.pgSlider = pgSlider;

    var sliders = document.getElementsByClassName('pg-slider'),
        Body = document.body;

    for (var i = 0; i < sliders.length; i++) {
        pgSlider(sliders[i]);
    }

    function pgSlider (element) {
        var pgSlider = element,
            indicatorsCount = ~~element.getAttribute('data-value-indicators-count'),
            sliderFrom = ~~element.getAttribute('data-slider-from') || 0,
            sliderTo = ~~element.getAttribute('data-slider-to') || 100,
            sliderStep = ~~element.getAttribute('data-slider-step') || 1,
            sliderStepAnimation = element.getAttribute('data-slider-step-animation') || 'smooth', // 'smooth' || 'step'
            pgSliderInput = pgSlider.getElementsByTagName('input')[0],
            value = ~~pgSliderInput.value,
            priceOfDivision = 100/(sliderTo-sliderFrom),
            pgSliderPath,
            pgSliderPuddle,
            pgSliderContainer
        ;

        createSliderComponents();
        setValue(value);
        setPuddlePosition();
        createValueIndicators();
        setAccessibilityAttributes();

        pgSlider.addEventListener('mousedown', puddleMouseDown);
        pgSlider.addEventListener('touchstart', puddleMouseDown);
        pgSliderPuddle.addEventListener('focus', puddleFocus);
        pgSliderPuddle.addEventListener('blur', puddleBlur);

        function puddleFocus () {
            pgSlider.classList.add('focused');
            pgSliderPuddle.addEventListener('keydown', paddleKeyPressed);
        }

        function puddleBlur () {
            pgSlider.classList.remove('focused');
            pgSliderPuddle.removeEventListener('keydown', paddleKeyPressed);
        }

        function paddleKeyPressed (event) {
            if ([37, 40].indexOf(event.keyCode) !== -1) { // Left or Down arrow key pressed
                event.preventDefault();
                value = Math.max(value - sliderStep, sliderFrom);
                setPuddlePosition();
            } else if ([39, 38].indexOf(event.keyCode) !== -1) { // Right or Up arrow key pressed
                event.preventDefault();
                value = Math.min(value + sliderStep, sliderTo);
                setPuddlePosition();
            } else if (event.keyCode === 35) { // End key pressed
                event.preventDefault();
                value = sliderTo;
                setPuddlePosition();
            } else if (event.keyCode === 36) { // Home key pressed
                event.preventDefault();
                value = sliderFrom;
                setPuddlePosition();
            }
        }

        function setPuddlePosition () {
            pgSliderPuddle.style.left = (value-sliderFrom)*priceOfDivision+'%';
            pgSliderPath.style.width = (value-sliderFrom)*priceOfDivision+'%';
            setInputValue();
            setAriaValue();
        }

        function createSliderComponents () {
            pgSliderPath = document.createElement('DIV');
            pgSliderPuddle = document.createElement('DIV');
            pgSliderContainer = document.createElement('DIV');

            pgSliderPath.classList.add('pg-slider__path');
            pgSliderPuddle.classList.add('pg-slider__puddle');
            pgSliderContainer.classList.add('pg-slider__container');

            pgSlider.appendChild(pgSliderPath);
            pgSlider.appendChild(pgSliderPuddle);

            pgSlider.parentElement.insertBefore(pgSliderContainer, pgSlider);
            pgSliderContainer.appendChild(pgSlider);
        }

        function setAccessibilityAttributes () {
            pgSliderPuddle.tabIndex = 0;
            pgSliderPuddle.setAttribute('role', 'slider');
            pgSliderPuddle.setAttribute('aria-valuemax', sliderTo);
            pgSliderPuddle.setAttribute('aria-valuemin', sliderFrom);
            setAriaValue();
        }

        function setAriaValue () {
            pgSliderPuddle.setAttribute('aria-valuenow', value);
        }

        function createValueIndicators () {
            while(indicatorsCount > 0 && (sliderTo-sliderFrom)%indicatorsCount !== 0) {
                indicatorsCount--;
            }

            if (indicatorsCount > 0) {
                pgSlider.classList.add('with-value-indicator');

                for (var indicatorCountStep = (sliderTo-sliderFrom)/indicatorsCount,
                         currentStep = 0, currentValue = sliderFrom;
                     currentValue <= sliderTo;
                     currentStep+=indicatorCountStep*priceOfDivision, currentValue+=indicatorCountStep){
                    createValueIndicator(currentValue, currentStep)
                }
            }
        }

        function createValueIndicator (value, position) {
            var valueIndicator = document.createElement('DIV');

            valueIndicator.innerText = value;
            valueIndicator.classList.add('pg-slider__value-indicator');
            valueIndicator.style.left = position + '%';

            pgSlider.appendChild(valueIndicator);
        }

        function setInputValue () {
            pgSliderInput.value = value;
        }

        function setValue (newValue) {
            value = Math.min(sliderTo, Math.max(newValue, sliderFrom));
        }

        function puddleMouseDown (event) {
            event.preventDefault();

            watchPuddleMouseMove(event);
            Body.addEventListener('mousemove', watchPuddleMouseMove);
            Body.addEventListener('touchmove', watchPuddleMouseMove);
            window.addEventListener('mouseup', puddleMouseUp);
            window.addEventListener('touchend', puddleMouseUp);
        }

        function puddleMouseUp () {
            setPuddlePosition();
            Body.removeEventListener('mousemove', watchPuddleMouseMove);
            Body.removeEventListener('touchmove', watchPuddleMouseMove);
        }

        function watchPuddleMouseMove (event) {
            var clientX = event.touches ? event.touches[0].clientX : event.clientX,
                clientRect = pgSlider.getBoundingClientRect(),
                newValue = Math.round((clientX - clientRect.left)*100/(clientRect.width*priceOfDivision)/sliderStep)*sliderStep;

            setValue(sliderFrom+newValue);
            if (sliderStepAnimation === 'smooth') {
                var newPaddlePosition = Math.max(0, Math.min((clientX - clientRect.left)/clientRect.width*100, 100))+'%';

                pgSliderPuddle.style.left = newPaddlePosition;
                pgSliderPath.style.width = newPaddlePosition;
            } else {
                setPuddlePosition();
            }
        }
    }

}(document, window);