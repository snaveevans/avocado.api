class EventsList extends HTMLElement {
    constructor() {
        super();

        this.selectedEventId = "04b67765-f552-4da3-bb2e-5e843701601f";
        this.events = [];
        this.cards = {};

        var container = document.createElement('div');
        container.style.position = "fixed";
        container.style.left = "0px";
        container.style.right = "0px";
        container.style.top = "50vh";
        container.style.height = "90vh";
        container.style.transform = "translate(0, -50%)";
        this.appendChild(container);

        var indexById = function (id) {
            return function (event) {
                return event.id === id;
            }
        }

        var onMouseMoveHandler = null;
        var getOnMouseMoveHandler = function (x) {
            return function (event) {
                var endX = event.clientX;
                var xDist = endX - x;

                for (var i = 0; i < this.events.length; i++) {
                    var event = this.events[i];
                    var card = this.cards[event.id];
                    card.move(xDist);
                }
            }.bind(this);
        }.bind(this);

        var disableMouseMove = function () {
            if (onMouseMoveHandler) {
                container.removeEventListener("mousemove", onMouseMoveHandler);
                onMouseMoveHandler = null;
            }
        }

        var x = 0, start;

        var onMouseDownHandler = function (event) {
            start = moment();
            x = event.clientX;

            onMouseMoveHandler = getOnMouseMoveHandler(x);
            container.addEventListener('mousemove', onMouseMoveHandler);
            container.addEventListener('mouseleave', disableMouseMove);
        }

        var onMouseUpHandler = function (event) {
            disableMouseMove();

            var endX = event.clientX;

            var end = moment();
            var duration = moment.duration(end.diff(start));

            var xDist = endX - x;

            var isLeftMovement = false;
            if (xDist < 0) {
                isLeftMovement = true;
                xDist *= -1;
            }

            if (xDist <= 15) {
                // allow click
                return;
            }

            var captureClick = function (e) {
                e.stopPropagation();
                // renable click
                this.removeEventListener('click', captureClick, true);
            }

            // disable click
            this.parentElement.addEventListener('click', captureClick, true);

            var movement = isLeftMovement ?
                "left" :
                "right";

            var speed = xDist / duration;
            console.log("Moving: " + movement + " at " + speed + "px/m");

            event.preventDefault();
            x = 0;
        }.bind(this);

        container.addEventListener('mousedown', onMouseDownHandler);
        container.addEventListener('mouseup', onMouseUpHandler);

        var onCardClick = function (eventId) {
            disableMouseMove();
            if (this.selectedEventId === eventId)
                return console.log("Open card " + eventId);

            this.selectedEventId = eventId;
            var selectedIndex = this.events.findIndex(indexById(this.selectedEventId));

            for (var i = 0; i < this.events.length; i++) {
                var event = this.events[i];
                var card = this.cards[event.id];
                var eventIndex = this.events.findIndex(indexById(event.id));

                var index = eventIndex - selectedIndex;
                card.setOrder(index);
            }
        }.bind(this);

        setTimeout(function () {
            // get events
            this.events = [
                {
                    id: "b37250a2-f3ca-42c9-9adb-cee833a9c84e",
                    title: "LAN Party",
                    description: "Let's all play some PUBG and some Siege!",
                    color: "greenyellow"
                },
                {
                    id: "04b67765-f552-4da3-bb2e-5e843701601f",
                    title: "Star Wars Marathon",
                    description: "Self-expanatory",
                    color: "teal"
                },
                {
                    id: "b956e7cb-a5ce-4574-9672-3a2941cdce49",
                    title: "Hacknight SLC",
                    description: "hack away at some code",
                    color: "orange"
                }
            ];

            var selectedIndex = this.events.findIndex(indexById(this.selectedEventId))

            for (var i = 0; i < this.events.length; i++) {
                var event = this.events[i];

                var card = new EventCard(event, function () {
                    onCardClick(this.id);
                }.bind(event));

                var eventIndex = this.events.findIndex(indexById(event.id));

                var index = eventIndex - selectedIndex;

                card.setOrder(index);
                container.appendChild(card);
                this.cards[event.id] = card;
            }
        }.bind(this), 500);
    }
}
customElements.define("events-list", EventsList, { extends: 'div' });