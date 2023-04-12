!function (document, window) {
    'use strict';

    window.pgTooltip = pgTooltip;

    var tooltips = document.getElementsByClassName('pg-tooltip');

    for (var i = 0; i < tooltips.length; i++) {
        pgTooltip(tooltips[i]);
    }

    function pgTooltip (element) {
        var tooltip = element,
            tooltipContainer = tooltip.parentElement,
            tooltipClasses = [];

        if (tooltip && tooltipContainer) {
            setElementsParameters();
            tooltipContainer.addEventListener('mouseover', openTooltipEvent);
            tooltipContainer.addEventListener('focus', openTooltipEvent);
            tooltipContainer.addEventListener('mouseout', closeTooltip);
            tooltipContainer.addEventListener('blur', closeTooltip);
        }

        function closeTooltip () {
            for(var i = 0; i < tooltipClasses.length; i++) {
                tooltip.classList.remove(tooltipClasses[i]);
            }

            tooltipClasses = [];
            window.removeEventListener('touchstart', tooltipOutTouchEvent);
        }
        function openTooltip () {
            tooltipClasses.push('open');

            for(var i = 0; i < tooltipClasses.length; i++) {
                tooltip.classList.add(tooltipClasses[i]);
            }
        }
        function tooltipOutTouchEvent (event) {
            if (tooltipClasses.indexOf('open') !== -1) {
                var element = event.target;

                while (element) {
                    if (element === tooltipContainer) {
                        break;
                    } else {
                        element = element.parentElement;
                    }
                }

                if (element === tooltipContainer) {
                    openTooltip();
                } else {
                    closeTooltip();
                }
            }
        }
        function openTooltipEvent () {
            var tooltipContainerPosition = tooltipContainer.getBoundingClientRect(),
                tooltipLeftSpace = tooltipContainerPosition.left + tooltipContainerPosition.width/2,
                tooltipRightSpace =  tooltipContainerPosition.width/2 + (window.innerWidth || window.screen.width) - tooltipContainerPosition.right,
                topScroll = document.body.scrollTop,
                tooltipTopSpace = tooltipContainerPosition.top - topScroll,
                tooltipBottomSpace = topScroll + (window.innerHeight || window.screen.height) - tooltipContainerPosition.bottom,
                centerCoefficient = tooltipLeftSpace/tooltipRightSpace
            ;

            if (centerCoefficient > 1.50 || centerCoefficient < 0.5) {
                if (tooltipLeftSpace < tooltipRightSpace) {
                    tooltipClasses.push('right');
                } else {
                    tooltipClasses.push('left');
                }

                tooltip.style.maxWidth = Math.max(tooltipLeftSpace, tooltipRightSpace) + 'px';
            } else {
                tooltip.style.maxWidth = Math.min(tooltipLeftSpace, tooltipRightSpace)*2 + 'px';
            }

            if (tooltipBottomSpace > tooltipTopSpace) {
                tooltipClasses.push('bottom');
            } else {
                tooltipClasses.push('top');
            }


            openTooltip();
            window.addEventListener('touchstart', tooltipOutTouchEvent);
        }
        function setElementsParameters () {
            if (!tooltipContainer.getAttribute('tabindex')) {
                tooltipContainer.tabIndex = 0;
            }
            tooltipContainer.classList.add('pg-tooltip__container');
        }
    }
}(document, window);
