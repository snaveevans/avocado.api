class EventCard extends HTMLElement {
    constructor() {
        super();

        var marginSize = 10, x = window.matchMedia('(max-width: 768px)');
        if (!x.matches) {
            marginSize = 15;
            x = window.matchMedia('(max-width: 1024px)');
        }
        if (!x.matches)
            marginSize = 20;

        this.event = null;
        this.onCardClick = null;
        var left;

        this.move = function (pixels) {
            var rect = this.getBoundingClientRect();
            if (left.startsWith('calc('))
                left = '' + rect.left;
            this.style.left = left + pixels + 'px';
        }.bind(this);

        // this.setOrder = function (order) {
        //     var percent = 83.33333 * order;
        //     var padding = marginSize * order;
        //     left = 'calc(50vw + ' + percent + '% + ' + padding + 'px)';

        //     this.style.display = 'table-cell';
        //     this.style.width = '100%';
        //     container.style.position = 'absolute';
        //     this.style.height = '100%';
        //     this.style.display = 'inline-block';
        //     container.style.left = left;
        //     container.style.transform = 'translateX(-50%)';
        // }.bind(this);
    }
    connectedCallback() {
        var event = this.event;
        var onCardClick = this.onCardClick;

        if (!event)
            throw new Error('event card must have a "event" property set');
        if (!onCardClick)
            throw new Error('event card must have a "onCardClick" property set');

        this.className = 'pure-u-5-6';
        this.style.height = '100%';
        this.style.cssFloat = 'left';
        this.style.backgroundColor = event.color;
        this.style.marginBottom = '10px';
        this.style.textAlign = 'left';
        this.addEventListener('click', onCardClick);

        var title = document.createElement('h3');
        title.appendChild(document.createTextNode(event.title));

        var description = document.createElement('div');
        description.appendChild(document.createTextNode(event.description));

        this.appendChild(title);
        this.appendChild(description);
    }
}
customElements.define('event-card', EventCard, { extends: 'div' });