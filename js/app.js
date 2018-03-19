// variables for timer
let time = document.getElementById("time-watch");
let sec = 0;
let min = 0;
let hour = 0;

// this flag is needed for the timer (to stop it when game is finished)
let winFlag = false;

// variables and eventlisteners for restart
let restarter = document.getElementById("do-restart");
restarter.addEventListener("click", restart);
let modalRestart = document.getElementById("modal-restart");
modalRestart.addEventListener("click", restart);

// variables for the 3 stars in the header
let star3 = document.getElementById("star3");
let star2 = document.getElementById("star2");

let star33 = document.getElementById("star33");
let star22 = document.getElementById("star22");

// variables for shuffling
let openCards = [];
let moveCounter = 0;
let deck = document.querySelector(".deck");
let imageArray = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt",
	"fa-cube", "fa-anchor", "fa-leaf", "fa-bicycle", "fa-diamond", "fa-bomb",
	"fa-leaf", "fa-bomb", "fa-bolt", "fa-bicycle", "fa-paper-plane-o", "fa-cube"
];

// variables eventlisteners for modal
const modal = document.getElementById("myModal");
let modalText = document.getElementById("modal-text");
let modalFooterText = document.getElementById("modal-footer-text");
const span = document.getElementsByClassName("close")[0];
span.addEventListener("click", function () {
	modal.style.display = "none";
});

document.addEventListener("DOMContentLoaded", giveNewImages);
deck.addEventListener('click', lookAtCard);

// this function assigns the shuffled image-names to the cards
function giveNewImages() {
	let shuffledImageArray = shuffle(imageArray);
	let i = 0;
	for (let elem of document.getElementsByClassName("card")) {
		elem.childNodes[1].className = "fa " + shuffledImageArray[i];
		i++;
	}
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue, randomIndex;
	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

function lookAtCard(event) {
	// start timer when player clicks the first card (only once)
	if (sec===0 && min===0 && hour ===0) {
		startTime();
	}
	// to enable only clicks on the single "li´s", not the whole "ul"
	if (event.target.nodeName === 'LI') {
		if (!openCards.includes(event.target)) {
			// add "open" and "show" to class of target
			event.target.classList.add("open", "show");
			// add target to list of open cards
			openCards.push(event.target);
			// if even number of cards are open
			if ((openCards.length % 2 === 0) && (openCards.length > 0)) {
				// and last 2 cards match: set them to "match"
				if (openCards[openCards.length - 1].childNodes[1].classList.value == openCards[openCards.length - 2].childNodes[1].classList.value) {
					setLastCardsToMatch();
				}
				// if last 2 cards don't match, face them down after 1sec:
				else {
					// remove and add (in Line 106) EventListener to disable clicks while waiting
					deck.removeEventListener('click', lookAtCard);
					setTimeout(setLastCardFaceDown, 1000);
					setTimeout(setLastCardFaceDown, 1000);
				}
				incrementMoves();
				// if FINISHED the game
				if (openCards.length == 16) {
					win();
				};
			};
		};
	};
};

function setLastCardsToMatch() {
	openCards[openCards.length - 1].classList.add("match");
	openCards[openCards.length - 2].classList.add("match");
}

function setLastCardFaceDown() {
	openCards[openCards.length - 1].classList.remove("open", "show");
	openCards.pop();
	// remove(in Line 83) and add EventListener to disable clicks while waiting
	deck.addEventListener('click', lookAtCard);
}

function incrementMoves() {
	moveCounter++;
	document.querySelector(".moves").textContent = moveCounter;
	if (moveCounter > 15) {
		star3.className = "fa fa-star-o";
		star33.className = "fa fa-star-o";
	};
	if (moveCounter > 20) {
		star2.className = "fa fa-star-o";
		star22.className = "fa fa-star-o";
	};
}

function win() {
	winFlag = true;
	modalText.textContent = `It took you ${moveCounter} moves in ${min} Min and ${sec} Secs to finish the game!`;
	modalFooterText.textContent = `Want to play again?`;
	modal.style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

// time
function startTime() {
	sec++;
	if (sec >= 60) {
		sec = 0;
		min++;
		if (min >= 60) {
			min = 0;
			hour++;
		};
	};
	// to get the Time look like 03:12:07
	if (sec < 10 && min < 10 && hour < 10) {
		time.innerHTML = "0" + hour + ":0" + min + ":0" + sec;
	} else if (min < 10 && hour < 10) {
		time.innerHTML = "0" + hour + ":0" + min + ":" + sec;
	} else if (sec < 10 && hour < 10) {
		time.innerHTML = "0" + hour + ":" + min + ":0" + sec;
	} else {
		time.innerHTML = "0" + hour + ":" + min + ":" + sec;
	}
	// timer should stop after the game has finished
	if (!winFlag) {
		let t = setTimeout(startTime, 1000);
	};
}

// restart the game -> from Modal-Button or from the Header Restart-Button
function restart() {
	location.reload();
}