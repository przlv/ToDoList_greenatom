document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.querySelector(".btn-control:nth-child(1)");
    const eventsList = document.querySelector(".events-list");
    const savedEvents = JSON.parse(localStorage.getItem("events")) || [];

    addButton.addEventListener("click", () => {
        const newEventBlock = createEventBlock();
        newEventBlock.classList.add("event-block");
        const firstFinishedEvent = eventsList.querySelector(".finished");
        if (firstFinishedEvent) {
            eventsList.insertBefore(newEventBlock, firstFinishedEvent);
        } else {
            eventsList.appendChild(newEventBlock);
        }
    });

    eventsList.addEventListener("click", (event) => {
        if (event.target.classList.contains("event-delete")) {
            const eventBlock = event.target.closest(".event-block");
            eventBlock.remove();
            saveEventsToLocalStorage();
        }
    });

    savedEvents.forEach((eventData) => {
        const newEventBlock = createEventBlockLoaded();
        const eventText = newEventBlock.querySelector(".event-text");
        const eventTime = newEventBlock.querySelector(".event-time");
        eventText.textContent = eventData.text;
        eventTime.textContent = eventData.time;
        if (eventData.completeEvent) {
            newEventBlock.classList.add("finished");
            const buttons = newEventBlock.getElementsByTagName("button");
            Array.from(buttons).forEach(function(button) {
                button.parentNode.removeChild(button);
            });
        }
        eventsList.appendChild(newEventBlock);
    });

    const deleteFirstButton = document.querySelector(".btn-control:nth-child(2)");
    const deleteLastButton = document.querySelector(".btn-control:nth-child(3)");
    const viewEvenButton = document.querySelector(".btn-control:nth-child(4)");
    const viewOddButton = document.querySelector(".btn-control:nth-child(5)");

    deleteFirstButton.addEventListener("click", () => {
        const firstEventBlock = eventsList.querySelector(".event-block:first-child");
        if (firstEventBlock) {
            firstEventBlock.classList.add("fade-out");
            setTimeout(() => {
                firstEventBlock.remove();
                saveEventsToLocalStorage();
            }, 500);
        }
    });


    deleteLastButton.addEventListener("click", () => {
        const lastEventBlock = eventsList.querySelector(".event-block:last-child");
        if (lastEventBlock) {
            lastEventBlock.classList.add("fade-out");
            setTimeout(() => {
                lastEventBlock.remove();
                saveEventsToLocalStorage();
            }, 500);
        }
    });


    const isEven = (number) => { return number % 2 === 0 };

    viewEvenButton.addEventListener("click", () => {
        const eventBlocks = eventsList.querySelectorAll(".event-block");

        Array.from(eventBlocks).forEach(function(currentEventBlock, index) {
            if (isEven(index+1)) {
                currentEventBlock.classList.add('even-event');
                setTimeout(() => {
                    currentEventBlock.classList.remove('even-event');
                }, 2500)
            }
        });
    });

    viewOddButton.addEventListener("click", () => {
        const eventBlocks = eventsList.querySelectorAll(".event-block");

        Array.from(eventBlocks).forEach(function(currentEventBlock, index) {
            if (!isEven(index+1)) {
                currentEventBlock.classList.add('even-event');
                setTimeout(() => {
                    currentEventBlock.classList.remove('even-event');
                }, 2500)
            }
        });
    });

    function createEventBlock() {
        const eventBlock = document.createElement("div");
        eventBlock.classList.add("event-block");

        const eventDetails = document.createElement("div");
        eventDetails.classList.add("event-details");

        const eventText = document.createElement("p");
        eventText.classList.add("event-text");

        const eventTime = document.createElement("p");
        eventTime.classList.add("event-time");

        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.placeholder = "Текст события";

        const dateInput = document.createElement("input");
        dateInput.type = "datetime-local";

        const addButton = document.createElement("button");
        addButton.classList.add("btn");
        addButton.classList.add("event-add");
        addButton.textContent = "Добавить";

        addButton.addEventListener("click", () => {
            const enteredText = textInput.value.trim();
            const enteredTime = dateInput.value.trim();
            if (enteredText !== "" && enteredTime !== "") {
                eventText.textContent = enteredText;
                eventTime.textContent = formatDate(new Date(dateInput.value));

                eventDetails.removeChild(textInput);
                eventDetails.removeChild(dateInput);
                eventDetails.removeChild(addButton);

                eventBlock.appendChild(createCompleteButton());
                eventBlock.appendChild(createDeleteButton());
                saveEventsToLocalStorage();
            }
        });

        eventDetails.appendChild(eventText);
        eventDetails.appendChild(eventTime);
        eventDetails.appendChild(textInput);
        eventDetails.appendChild(dateInput);
        eventDetails.appendChild(addButton);

        eventBlock.appendChild(eventDetails);


        return eventBlock;
    }

    function createEventBlockLoaded() {
        const eventBlock = document.createElement("div");
        eventBlock.classList.add("event-block");

        const eventDetails = document.createElement("div");
        eventDetails.classList.add("event-details");

        const eventText = document.createElement("p");
        eventText.classList.add("event-text");

        const eventTime = document.createElement("p");
        eventTime.classList.add("event-time");

        eventDetails.appendChild(eventText);
        eventDetails.appendChild(eventTime);

        eventBlock.appendChild(eventDetails);
        eventBlock.appendChild(createCompleteButton());
        eventBlock.appendChild(createDeleteButton());

        return eventBlock;
    }

    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function createDeleteButton() {
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("event-delete");
        deleteButton.textContent = "×";
        return deleteButton;
    }

    function createCompleteButton() {
        const completeButton = document.createElement("button");
        completeButton.classList.add("event-complete");
        completeButton.textContent = "✔";
        completeButton.addEventListener("click", () => {
            const eventBlock = completeButton.closest(".event-block");
            eventsList.appendChild(eventBlock);
            const buttons = eventBlock.getElementsByTagName("button");
            Array.from(buttons).forEach(function(button) {
                button.parentNode.removeChild(button);
            });
            eventBlock.style.textDecoration = "line-through";
            eventBlock.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            eventBlock.classList.add("finished");
            saveEventsToLocalStorage();
        });
        return completeButton;
    }

    function saveEventsToLocalStorage() {
        const eventBlocks = Array.from(document.querySelectorAll(".event-block"));
        const eventsData = eventBlocks.map((eventBlock) => {
            const text = eventBlock.querySelector(".event-text").textContent;
            const time = eventBlock.querySelector(".event-time").textContent;
            if (eventBlock.classList.contains('finished')) {
                const completeEvent = true;
                return { text, time, completeEvent };
            }
            return { text, time };
        });
        localStorage.setItem("events", JSON.stringify(eventsData));
    }
});