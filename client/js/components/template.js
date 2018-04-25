class template extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        // put code here
    }
}
customElements.define('template-test', ApplicationBar, { extends: 'div' });