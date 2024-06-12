// Define constants
const main_display = document.querySelector("main");
const color_circles = document.querySelectorAll(".color-circle");
const submit_button = document.getElementById("submit-btn");
const codeLength = 4;
const totalRows = 8;
const crack_code = ["orange", "blue", "yellow", "green"];

init();

function init() {
  for (let row = 0; row < totalRows; row++) {
    createRow();
  }
  highlightCurrentRow();
}

function createRow() {
  const div_try = document.createElement("div");
  div_try.setAttribute("class", "try");

  const div_left = document.createElement("div");
  div_left.setAttribute("class", "left");

  const div_right = document.createElement("div");
  div_right.setAttribute("class", "right");

  for (let j = 0; j < codeLength; j++) {
    const div_l = document.createElement("div");
    div_l.setAttribute("class", "color-drop-target");
    div_l.addEventListener("click", fillColor);
    div_left.append(div_l);
  }

  for (let j = 0; j < codeLength; j++) {
    const div_r = document.createElement("div");
    div_r.setAttribute("class", "feedback-circle");
    div_right.append(div_r);
  }

  div_try.append(div_left);
  div_try.append(div_right);
  main_display.append(div_try);
}

color_circles.forEach((circle) => {
  circle.addEventListener("click", selectColor);
});

let selectedColor = null;

function selectColor(e) {
  selectedColor = this.getAttribute("data-color");
}

function fillColor(e) {
  if (selectedColor !== null) {
    if (this.style.backgroundColor === selectedColor) {
      this.style.backgroundColor = ""; // Deselect color if the same color clicked again
    } else {
      this.style.backgroundColor = selectedColor;
    }
  }
}

submit_button.addEventListener("click", checkGuess);

function checkGuess() {
  const currentRow = main_display.children[currentRowIndex];
  const leftDivs = currentRow.querySelector(".left").children;
  const rightDivs = currentRow.querySelector(".right").children;

  const guess = Array.from(leftDivs).map(
    (div) => div.style.backgroundColor || ""
  );

  const isRowFilled = guess.every((color) => color !== "");

  if (isRowFilled) {
    const feedback = calculateFeedback(guess, crack_code);

    displayFeedback(feedback, rightDivs);

    if (feedback.every((color) => color === "red")) {
      setTimeout(() => {
        alert("You cracked the code!");
      }, 100);
    } else {
      currentRowIndex++;
      if (currentRowIndex < totalRows) {
        highlightCurrentRow();
      } else {
        setTimeout(() => {
          alert("No more rows available!");
        }, 100);
      }
    }
  } else {
    alert("Please fill all circles before checking!");
  }
}

function calculateFeedback(guess, crackCode) {
  const feedback = [];
  const crackCodeCopy = [...crackCode];

  for (let i = 0; i < codeLength; i++) {
    if (guess[i] === crackCode[i]) {
      feedback.push("red");
      crackCodeCopy[i] = null;
    }
  }

  for (let i = 0; i < codeLength; i++) {
    if (feedback[i] !== "red" && crackCodeCopy.includes(guess[i])) {
      feedback.push("white");
      crackCodeCopy[crackCodeCopy.indexOf(guess[i])] = null;
    } else if (feedback[i] !== "red") {
      feedback.push("");
    }
  }

  return feedback;
}

function displayFeedback(feedback, rightDivs) {
  feedback.forEach((color, index) => {
    rightDivs[index].style.backgroundColor = color;
  });
}

function highlightCurrentRow() {
  const rows = main_display.children;
  for (let i = 0; i < rows.length; i++) {
    rows[i].classList.remove("current");
  }
  rows[currentRowIndex].classList.add("current");
}
