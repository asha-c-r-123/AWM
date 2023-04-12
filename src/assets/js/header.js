!function (document, window) {
    'use strict';

    window.pgHeader = pgHeader;

    var Body = document.body,
        Html = document.documentElement,
        headers = document.getElementsByClassName('pg-top-bar');

    for (var i = 0; i < headers.length; i++) {
        pgHeader(headers[i]);
    }

    function pgHeader(element) {
        var Header = element,
            navbarMenu = document.getElementsByClassName('pg-top-bar__navbar__menu')[0],
            navbarOptions = getNavbarOptions(),
            navbarContainer = document.getElementsByClassName('pg-top-bar__navbar__container')[0],
            menuFooter = document.getElementsByClassName('pg-mobile-menu-footer')[0],
            floatingHeader = Header.getAttribute('data-pg-header-floating') === 'true',
            floatingHeaderClass = 'floating',
            OpenMenuButton = document.getElementsByClassName('open-menu')[0],
            CloseMenuButton = document.getElementsByClassName('pg-top-bar__close-mobile')[0],
            CloseMenuButtonContainer = document.getElementsByClassName('pg-top-bar__close-mobile__container')[0],
            Menu = document.getElementsByClassName('pg-top-bar__navbar')[0],
            menuOpenClass = 'open',
            OpenSearchButton = document.getElementsByClassName('open-search')[0],
            CloseSearchButton = document.getElementsByClassName('pg-top-bar__search__mobile-close')[0],
            Search = document.getElementsByClassName('pg-top-bar__search')[0],
            searchOpenClass = 'open',
            headerHeight,
            prevScrollTop,
            headerTopPadding = 4,
            headerTopPosition = 0,
            menuOpen = false,
            mobileBreakPoint = 1024,
            MobileMenuFooter = document.getElementsByClassName('pg-mobile-menu-footer sticky')[0],
            MobileMenuLastElement = document.getElementsByClassName('pg-mobile-menu-footer basic')[0]
                || document.getElementsByClassName('pg-top-bar__navbar__menu')[0],
            iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform),
            accordionParent = document.getElementsByClassName('accordion');

        setHeaderVariables();
        toggleAccordion();
        setNavbarOptionsWatchers();

        if (floatingHeader) {
            window.addEventListener('scroll', onScroll);
        }
        window.addEventListener('resize', setHeaderVariables);
        if (OpenMenuButton) {
            OpenMenuButton.addEventListener('click', openMenu);
        }
        if (CloseMenuButton) {
            CloseMenuButton.addEventListener('click', closeMenu);
        }
        if (OpenSearchButton) {
            OpenSearchButton.addEventListener('click', openSearch);
        }
        if (CloseSearchButton) {
            CloseSearchButton.addEventListener('click', closeSearch);
        }

        function getNavbarOptions () {
            if (!navbarMenu) {
                return;
            }
            var options = Array.from(navbarMenu.getElementsByTagName('LI'));

            for (var i=0; i<options.length; i++) {
                if (options[i].parentElement !== navbarMenu) {
                    options.splice(i, 1);
                    i--;
                }
            }

            return options;
        }

        function setNavbarOptionsWatchers () {
            if (!navbarOptions || navbarMenu.classList.contains('pg-top-bar__tabs')) {
                return;
            }
            for (var i=0; i<navbarOptions.length; i++) {
                for (var j=0; j<navbarOptions[i].childNodes.length; j++) {
                    var nodeElement = navbarOptions[i].childNodes[j];
                    if (nodeElement.tagName === 'BUTTON') {
                        nodeElement.addEventListener('click', openNavbarOptionsMenu);
                        nodeElement.addEventListener('focus', closeAllNavbarOptionsMenu);
                        nodeElement.addEventListener('mouseenter', closeAllNavbarOptionsMenu);
                        window.addEventListener('scroll', closeAllNavbarOptionsMenu);
                    }
                }
            }
        }

        function closeAllNavbarOptionsMenu (event) {
            for (var i=0; i<navbarOptions.length; i++) {
                navbarOptions[i].classList.remove('active');
            }
        }

        function openNavbarOptionsMenu (event) {
            var parentElement = event.target.parentElement;

            if (parentElement.classList.contains('active')) {
                parentElement.classList.remove('active');
            } else {
                closeAllNavbarOptionsMenu();
                parentElement.classList.add('active');
            }
        }

        function setHeaderVariables() {
            if (floatingHeader) {
                headerHeight = Header.offsetHeight;
                prevScrollTop = document.body.scrollTop;
                onScroll();
            }
            setDropdownMinWidth();
            setMobileMenuBodyPadding();
            setBodyOverflow();
        }

        function setDropdownMinWidth() {
            var dropdown = Header.getElementsByClassName('pg-top-bar__navbar__menu__sub-menu dropdown');

            for (var i = 0; i < dropdown.length; i++) {
                dropdown[i].style.minWidth = dropdown[i].parentElement.clientWidth + 'px';
            }
        }

        function onScroll() {
            var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

            if (iOS || scrollTop > 0) {
                Header.classList.add(floatingHeaderClass);
                Body.style.paddingTop = headerHeight + 'px';
            } else {
                Header.classList.remove(floatingHeaderClass);
                Body.style.paddingTop = 0;
            }

            if (!iOS) {
                headerTopPosition = Math.min(0, Math.max(headerTopPosition - scrollTop + prevScrollTop, -headerHeight - headerTopPadding));
                prevScrollTop = scrollTop;
                Header.style.top = headerTopPosition + 'px';
            }
        }

        function toggleAccordion() {
            for (var i = 0; i < accordionParent.length; i                   ++) {
                accordionParent[i].onclick = function () {
                    var accordionMenu = this.getElementsByClassName('accordion-menu')[0];
                    var currentAccordion = this.getElementsByTagName('A')[0];
                    if (currentAccordion && accordionMenu) {
                        if (accordionMenu.style.display === "block") {
                            currentAccordion.classList.remove('close');
                            accordionMenu.classList.remove('show-menu');
                        } else {
                            currentAccordion.classList.add('close');
                            accordionMenu.classList.add('show-menu');
                            for (var j = 0; j < accordionParent.length; j++) {
                                if (
                                    accordionParent[j] !== this &&
                                    accordionParent[j].parentElement === this.parentElement
                                ) {
                                    accordionParent[j].getElementsByClassName('accordion-menu')[0]
                                        .classList.remove('show-menu');
                                    accordionParent[j].getElementsByTagName('A')[0].classList.remove('close')
                                }
                            }
                        }
                    }
                }
            }
        }

        function openMenu() {
            menuFooter.style.display = '';
            Menu.classList.add(menuOpenClass);
            menuOpen = true;
            setMobileMenuBodyPadding();
            setMobileMenuElementsSize();
            setBodyOverflow();
        }

        function closeMenu() {
            menuFooter.style.display = 'none';
            Menu.classList.remove(menuOpenClass);
            menuOpen = false;
            setBodyOverflow();
        }

        function openSearch() {
            Search.classList.add(searchOpenClass);
            menuOpen = true;
            OpenSearchButton.style.opacity = 0;
            setBodyOverflow();
            //disable scroll for ios
            Body.addEventListener('touchmove', freezeVp, false);
        }

        function freezeVp(e) {
            e.preventDefault();
        }

        function closeSearch() {
            Search.classList.remove(searchOpenClass);
            menuOpen = false;
            OpenSearchButton.style.opacity = 1;
            setBodyOverflow();
            //enable scroll
            Body.removeEventListener('touchmove', freezeVp, false);
        }

        function setMobileMenuBodyPadding() {
            if (MobileMenuLastElement) {
                if (menuOpen && window.innerWidth < mobileBreakPoint && MobileMenuFooter) {
                    MobileMenuLastElement.style.paddingBottom = MobileMenuFooter.offsetHeight + 'px';
                } else {
                    MobileMenuLastElement.style.paddingBottom = '';
                }
            }
        }

        function setMobileMenuElementsSize () {
            if (menuOpen && window.innerWidth < mobileBreakPoint && navbarContainer) {
                var elementsWidth = 'calc(100% - '+ (navbarContainer.offsetWidth - navbarContainer.clientWidth) +'px)';
                if (CloseMenuButtonContainer) {
                    CloseMenuButtonContainer.style.width = elementsWidth;
                }
                if (MobileMenuFooter) {
                    MobileMenuFooter.style.width = elementsWidth;
                }
            }
        }

        function setBodyOverflow() {
            if (menuOpen && window.innerWidth < mobileBreakPoint) {
                if (iOS) {
                    Html.style.overflow = 'hidden';
                    Html.style.height = '100%';
                    Html.style.position = 'relative';
                    Body.style.position = 'relative';
                }
                Body.style.overflow = 'hidden';
                Body.style.height = '100%';
            } else {
                if (iOS) {
                    Html.style.overflow = '';
                    Html.style.height = '';
                    Html.style.position = '';
                    Body.style.position = '';
                }
                Body.style.overflow = '';
                Body.style.height = '';
            }
        }
    }

}(document, window);
