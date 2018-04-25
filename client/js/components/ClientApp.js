class ClientApp extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        var table = document.createElement('table');
        table.style.height = '100vh';
        table.style.width = '100vw';
        this.appendChild(table);

        console.log('tag: ' + this.tagName);

        var appBar = document.createElement('application-bar');
        var navBar = document.createElement('navigation-bar');
        var router = document.createElement('application-router');
        router.onRouteChange = function (route) {
            navBar.setAttribute('url', route.url);
        }

        var addElement = function (element, height) {
            var row = document.createElement('tr');
            table.appendChild(row);
            var cell = document.createElement('td');
            if (height)
                cell.style.height = height;
            row.appendChild(cell);
            cell.appendChild(element);
        }

        addElement(appBar, '50px');
        addElement(router);
        addElement(navBar, '45px');
    }
}
customElements.define('client-app', ClientApp, { extends: 'table' });