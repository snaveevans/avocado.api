class ContactList extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        var container = document.createElement('div');
        container.appendChild(document.createTextNode('Contacts Page'));
        this.appendChild(container);
    }
}
customElements.define('contact-list', ContactList, { extends: 'div' });