class EventCard extends HTMLElement {
    constructor(event, onCardClick) {
        super(event);

        var left;
        var container = document.createElement('div');
        container.className = "pure-u-5-6";
        container.style.backgroundColor = event.color;
        container.style.height = "80vh";
        container.addEventListener('click', onCardClick);

        var title = document.createElement('h3');
        title.appendChild(document.createTextNode(event.title));

        var description = document.createElement('div');
        description.appendChild(document.createTextNode(event.description));

        container.appendChild(title);
        container.appendChild(description);

        this.appendChild(container);

        this.move = function (pixels) {
            var rect = container.getBoundingClientRect();
            if (left.startsWith('calc('))
                left = "" +  rect.left;
            container.style.left = left + pixels + "px";
        };

        this.setOrder = function (order) {
            var percent = 83.33333 * order;
            var padding = 10 * order;
            left = "calc(50vw + " + percent + "% + " + padding + "px)"

            var container = this.firstChild;

            container.style.position = "absolute";
            container.style.left = left;
            container.style.height = "90vh";
            container.style.transform = "translateX(-50%)";
        }.bind(this);
    }
}
customElements.define("event-card", EventCard, { extends: 'div' });