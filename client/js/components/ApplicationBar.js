class ApplicationBar extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {

        // this.style.position = 'fixed';
        // this.style.left = '0px';
        // this.style.top = '0px';
        this.style.width = '100%';
        this.style.height = '100%';
        this.style.backgroundColor = '#187CD8';
        this.style.color = '#FFFFFF';
        this.style.display = 'table';
        // this.style.zIndex = 25;

        var header = document.createElement('div');
        header.style.display = 'table-cell';
        header.className = 'h2';
        header.style.height = '100%';
        header.style.verticalAlign = 'middle';
        header.style.paddingLeft = '10px';
        header.appendChild(document.createTextNode('Project Avocado'));
        this.appendChild(header);

        var menu = document.createElement('div');
        menu.style.display = 'table-cell';
        menu.style.width = '50px';
        menu.style.color = '#FFFFFF';
        menu.style.textDecoration = 'none';
        menu.style.height = '100%';
        menu.style.verticalAlign = 'middle';
        menu.style.textAlign = 'center';
        menu.style.paddingRight = '10px';
        var icon = document.createElement('i');
        icon.className = "fas fa-bars fa-2x";
        menu.appendChild(icon);
        this.appendChild(menu);
    }
}
customElements.define('application-bar', ApplicationBar, { extends: 'div' });