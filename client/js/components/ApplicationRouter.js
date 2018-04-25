class ApplicationRouter extends HTMLElement {
    constructor() {
        super();
        this.onRouteChange = null;
    }
    connectedCallback() {
        var changeRoute = function (route) {
            // remove existing child(ren)
            while (this.firstChild) {
                this.removeChild(this.firstChild);
            }

            var element = document.createElement(route.component);

            if (route.attributes) {
                for (var key in route.attributes) {
                    element.setAttribute(key, route.attributes[key]);
                }
            }

            this.appendChild(element);
            if (this.onRouteChange)
                this.onRouteChange(route);
        }.bind(this);
        
        var goToRoute = function (url) {
            window.location = '#/' + url;
        }

        var routes = [
            {
                url: 'my-events',
                component: 'events-list',
                attributes: {
                    'filter': 'mine'
                }
            },
            {
                url: 'upcoming',
                component: 'events-list',
                attributes: {
                    'filter': 'upcoming'
                }
            },
            {
                url: 'contacts',
                component: 'contact-list'
            }
        ];

        var handleChange = function (url) {
            var filteredUrl = url.replace(window.location.origin + '/#/', '');

            var route = routes.find(function (route) {
                return route.url === filteredUrl;
            });

            changeRoute(route);
        }

        window.onhashchange = function (event) {
            return handleChange(event.newURL);
        };

        // initialize
        window.addEventListener('load', function () {
            handleChange(window.location.href);
        });        
    }
}
customElements.define('application-router', ApplicationRouter, { extends: 'div' });