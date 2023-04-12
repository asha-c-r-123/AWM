!function (document, window) {
    'use strict';

    window.pgTabsAnimate = pgTabsAnimate;

    var pgTabs = document.getElementsByClassName('pg-tabs'),
        activeTabClass = 'pg-tabs__tab--active';

    for (var i = 0; i < pgTabs.length; i++) {
        pgTabsAnimate(pgTabs[i]);
    }

    function pgTabsAnimate (element) {
        var tabsContainer = element;

        if (tabsContainer) {
            tabsContainer.addEventListener('click', tabsContainerWasClicked);
        }

        function tabsContainerWasClicked (event) {
            var element = event.target;

            if (element !== tabsContainer) {
                while (element && element.parentElement) {
                    if (element.parentElement === tabsContainer) {
                        selectTab(element);
                        break;
                    } else {
                        element = element.parentElement;
                    }
                }
            }
        }

        function selectTab (tabElement) {
            if (!tabElement.classList.contains(activeTabClass)) {
                var activeTab = tabsContainer.getElementsByClassName(activeTabClass)[0];

                if (activeTab) {
                    activeTab.classList.remove(activeTabClass);
                    tabElement.classList.add(activeTabClass);
                }
            }
        }
    }
}(document, window);
