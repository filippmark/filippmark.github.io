const mobileMax = 767;
let windowSize = window.innerWidth;
let dotsCreated = false;
let cardsAmount;
let currentIndex = 0;
let leftChevron;
let rightChevron;
let slider;

const timeForSwipe = 300;
const swipeSensitivity = 50;
let touchStats = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    touched: false,
    moved: false,
    dateStart: null,
    dateFinish: null
}


const handleDotClick = (event) => {
    changeCurrentIndex(parseInt(event.srcElement.id.slice(4)));
}

const decrementIndex = (event) => {
    changeCurrentIndex(currentIndex - 1);
}

const incrementIndex = (event) => {
    changeCurrentIndex(currentIndex + 1);
}

const changeCurrentIndex = (index) => {
    const previousIndex = currentIndex;
    currentIndex = index;

    let previousDot = document.getElementById(`dot-${previousIndex}`);
    previousDot.classList.remove('fas');
    previousDot.classList.add('far');

    let nextDot = document.getElementById(`dot-${index}`);
    nextDot.classList.remove('far');
    nextDot.classList.add('fas');


    slider.style.transform = `translateX(-${currentIndex}00%)`;

    if (index === cardsAmount - 1) {
        rightChevron.style.visibility = "hidden";
        if (leftChevron.style.visibility === "hidden")
            leftChevron.style.visibility = "visible";
    } else if (index > 0) {
        if (rightChevron.style.visibility === "hidden")
            rightChevron.style.visibility = "visible";
        leftChevron.style.visibility = "visible";
    } else if (index === 0) {
        if (rightChevron.style.visibility === "hidden")
            rightChevron.style.visibility = "visible";
        leftChevron.style.visibility = "hidden";
    }
}

const handleStart = (startX, startY) => {
    touchStats = {
        startX,
        startY,
        touched: true,
        dateStart: Date.now()
    }
}

const handleMove = (endX, endY) => {
    if (touchStats.touched) {
        const distX = endX - touchStats.startX;

        let transformShift = Math.floor((Math.abs(distX) / slider.clientWidth) * 100);

        transformShift = distX > 0 ? -transformShift : transformShift;

        touchStats = {
            ...touchStats,
            moved: true,
            endX,
            endY,
            dateFinish: Date.now(),
        };

        slider.style.transform = `translateX(-${currentIndex * 100 + transformShift}%)`;
    }
};

const handleEnd = () => {
    if (touchStats.touched && touchStats.moved) {
        let newIndex = currentIndex;

        const distX = touchStats.endX - touchStats.startX;

        if (
            Math.abs(distX) >= swipeSensitivity &&
            touchStats.dateFinish - touchStats.dateStart <= timeForSwipe
        ) {
            if (touchStats.startX > touchStats.endX && currentIndex < cardsAmount - 1) {
                newIndex = currentIndex + 1;
            } else if (touchStats.startX < touchStats.endX) {
                if (currentIndex > 0) newIndex = currentIndex - 1;
            }
        }

        changeCurrentIndex(newIndex);

        touchStats = {
            startX: 0,
            startY: 0,
            endY: 0,
            endX: 0,
            touched: false,
            moved: false,
            dateStart: null,
            dateFinish: null
        };

    }
};

const handleTouchStart = touchStartEvent => {
    handleStart(touchStartEvent.targetTouches[0].clientX, touchStartEvent.targetTouches[0].clientY);
};

const handleTouchMove = touchMoveEvent => {
    handleMove(touchMoveEvent.targetTouches[0].clientX, touchMoveEvent.targetTouches[0].clientY);
};

const handleTouchEnd = () => {
    handleEnd();
}


const createDots = () => {

    document.getElementById('chevron-left').style.visibility = "hidden";

    let dotsWrapper = document.getElementById('dots');

    cardsAmount = document.getElementsByClassName('cardcontainer').length;

    for (let i = 0; i < cardsAmount; i++) {

        let dotWrapper = document.createElement('li');
        dotWrapper.classList.add('slidecontrols__dot');

        let btnIcon = document.createElement('button');
        btnIcon.classList.add('btn', 'btn__icon');
        dotWrapper.appendChild(btnIcon);

        let icon = document.createElement('i');
        icon.classList.add(i === 0 ? 'fas' : 'far', 'fa-circle');
        icon.id = `dot-${i}`;
        btnIcon.appendChild(icon);

        dotsWrapper.appendChild(dotWrapper);

    }
}

const tryToCreateDots = () => {
    if (windowSize <= mobileMax && !dotsCreated) {
        createDots()
        dotsCreated = true;
    } else if (windowSize <= mobileMax) {
        currentIndex = 0;
    }
}

window.onload = () => {
    tryToCreateDots();
    leftChevron = document.getElementById('chevron-left');
    rightChevron = document.getElementById('chevron-right');
    slider = document.getElementById('slider');
};

window.addEventListener('resize', (event) => {
    windowSize = window.innerWidth;
    tryToCreateDots();
    if (windowSize > 767)
        slider.style.transform = `translateX(0%)`;
});
