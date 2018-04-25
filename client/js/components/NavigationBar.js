class NavigationBar extends HTMLElement {
    static get observedAttributes() { return ['url']; }

    constructor() {
        super();
        this.selectedUrl = '';
        this.containers = {};
    }
    connectedCallback() {

        // this.style.position = 'fixed';
        // this.style.left = '0px';
        // this.style.bottom = '0px';
        this.style.width = '100%';
        this.style.height = '100%';
        this.style.backgroundColor = '#187CD8';
        this.style.display = 'table';
        this.style.zIndex = 25;

        var links = [
            {
                text: 'Upcoming',
                url: 'upcoming',
                icon: 'far fa-calendar-check'
            },
            {
                text: 'My Events',
                url: 'my-events',
                icon: 'far fa-calendar-alt'
            },
            {
                text: 'Contacts',
                url: 'contacts',
                icon: 'fas fa-users'
            }
        ]

        for (var pos = 0; pos < links.length; pos++) {
            var link = links[pos];

            var div = document.createElement('div');
            div.style.display = 'table-cell';
            div.style.verticalAlign = 'middle';
            div.style.textAlign = 'center';
            div.style.height = '100%';
            this.appendChild(div);
            if (pos !== 0)
                div.style.borderLeft = '1px #FFFFFF solid';

            this.containers[link.url] = div;

            var anchor = document.createElement('a');
            anchor.href = '/#/' + link.url;
            anchor.className = "sp";
            anchor.style.color = '#FFFFFF';
            anchor.style.textDecoration = 'none';
            div.appendChild(anchor);

            var icon = document.createElement('i');
            icon.className = link.icon
            icon.style.fontSize = '22px';
            anchor.appendChild(icon);
            anchor.appendChild(document.createElement('br'));
            anchor.appendChild(document.createTextNode(link.text));
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        var container = this.containers[newValue];

        if (container)
            container.style.backgroundColor = '#274B75';

        container = this.containers[this.selectedUrl];
        if (container)
            container.style.backgroundColor = '';
        this.selectedUrl = newValue;
    }
}
customElements.define('navigation-bar', NavigationBar, { extends: 'div' });