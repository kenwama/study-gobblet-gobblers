init();

let mainPlayerColor;
let cpuPlayerColor;
let mainPlayerOrder;

let currentPlayer;

function init() {
  const selectOrangeButton = document.querySelector(".select-orange");
  const selectBlueButton = document.querySelector(".select-blue");
  selectOrangeButton.addEventListener("click", () => setPlayersColor("orange"));
  selectBlueButton.addEventListener("click", () => setPlayersColor("blue"));

  const selectFisrtPlayButton = document.querySelector(".select-first");
  const selectSecondPlayButton = document.querySelector(".select-second");
  selectFisrtPlayButton.addEventListener("click", () =>
    setMainPlayerOrder("first")
  );
  selectSecondPlayButton.addEventListener("click", () =>
    setMainPlayerOrder("second")
  );

  const gameStartButton = document.querySelector(".game-button");
  gameStartButton.addEventListener("click", gameStart);
}

function setPlayersColor(color) {
  if (color === "orange") {
    mainPlayerColor = "orange";
    cpuPlayerColor = "blue";
  } else {
    mainPlayerColor = "blue";
    cpuPlayerColor = "orange";
  }

  styleSelectColorButton(color);
}

function setMainPlayerOrder(order) {
  if (order === "first") mainPlayerOrder = "first";
  if (order === "second") mainPlayerOrder = "second";

  styleSelectOrderButton(order);
}

function styleSelectColorButton(color) {
  const orangeButton = document.querySelector(".select-orange");
  const blueButton = document.querySelector(".select-blue");

  if (color === "orange") {
    orangeButton.classList.add("selecting");
    blueButton.classList.remove("selecting");
  } else {
    blueButton.classList.add("selecting");
    orangeButton.classList.remove("selecting");
  }
}

function styleSelectOrderButton(order) {
  const selectFisrtPlayButton = document.querySelector(".select-first");
  const selectSecondPlayButton = document.querySelector(".select-second");

  if (order === "first") {
    selectFisrtPlayButton.classList.add("selecting");
    selectSecondPlayButton.classList.remove("selecting");
  } else {
    selectSecondPlayButton.classList.add("selecting");
    selectFisrtPlayButton.classList.remove("selecting");
  }
}

function styleGobbltesArea() {
  const getSecondColor = (() => {
    if (currentPlayer === "orange") return "blue";
    if (currentPlayer === "blue") return "orange";
  })();

  const firstPlayerArea = document.querySelector(
    `.gobblets-area.${currentPlayer}`
  );
  firstPlayerArea.classList.add("first");

  const secondPlayerArea = document.querySelector(
    `.gobblets-area.${getSecondColor}`
  );
  secondPlayerArea.classList.add("second");
}

function gameStart() {
  if (!mainPlayerColor || !mainPlayerOrder) {
    alert("それぞれの選択肢をどちらか選んでください");
    return;
  }

  const modal = document.querySelector(".modal");
  modal.remove();

  const panels = document.querySelectorAll(".panel");
  panels.forEach((panel) => panel.addEventListener("click", handlePanel));
  panels.forEach((panel, index) => setDomPropPanelNumber(panel, index));

  renderGobbletsArea("orange");
  renderGobbletsArea("blue");
  appendEventGobblets();

  if (mainPlayerOrder === "first") {
    currentPlayer = mainPlayerColor;
  } else {
    currentPlayer = cpuPlayerColor;
    playByCpu();
  }

  styleGobbltesArea();
  indicateCurrentPlayer();
}

function setDomPropPanelNumber(panel, index) {
  panel.number = index;
}

function appendEventGobblets() {
  const gobblets = document.querySelectorAll(".gobblet");
  gobblets.forEach((gobblet) =>
    gobblet.addEventListener("click", selectGobbletByClick)
  );

  gobblets.forEach((gobblet) =>
    gobblet.addEventListener("mouseover", indicateSelectGobbletByHover)
  );
}

function renderGobblet(color, size, element) {
  const gobblet = document.createElement("div");
  gobblet.classList.add("gobblet");
  gobblet.classList.add(color);

  if (size === 1) gobblet.classList.add("small");
  if (size === 2) gobblet.classList.add("medium");
  if (size === 3) gobblet.classList.add("large");

  const parentElemnt = element;
  parentElemnt.append(gobblet);
}

function renderGobbletsArea(color) {
  const gobbletSizes = [1, 1, 2, 2, 3, 3];
  const orangeGobbletsArea = document.querySelector(".orange");
  const blueGobbletsArea = document.querySelector(".blue");

  gobbletSizes.map((size) => {
    if (color === "orange") renderGobblet("orange", size, orangeGobbletsArea);
    if (color === "blue") renderGobblet("blue", size, blueGobbletsArea);
  });
}

// game

const panelStates = [[], [], [], [], [], [], [], [], []];

let currentSize;
let currentGobbletElement;
let selectingGobbletOfPanel = false;
let panelNumberWhenGobbletOfPanel;

function playByCpu() {
  const cpuGobblets = document.querySelectorAll(`.gobblet.${currentPlayer}`);
  const gobblet = getRandom(cpuGobblets);
  gobblet.click();

  const panelsCanHandle = panelStates
    .map((_, index) => checkCanHandlePanel(index) && index)
    .filter((value) => typeof value === "number");
  const getPanelNumber = getRandom(panelsCanHandle);
  const panel = document.querySelectorAll(".panel")[getPanelNumber];

  const cpuDelay = 1200;
  setTimeout(() => {
    panel.click();
  }, cpuDelay);
}

function getRandom(array) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
}

function removeGobbletElement() {
  currentGobbletElement.remove();
}

function renderBoard() {
  panelStates.map((panel, index) => {
    const topStackedGobblet = panel[panel.length - 1];
    if (!topStackedGobblet) return;

    const color = topStackedGobblet.color;
    const size = topStackedGobblet.size;
    const targetPanel = document.querySelectorAll(".panel")[index];

    Array.from(targetPanel.children).forEach((child) => child.remove());
    renderGobblet(color, size, targetPanel);
  });
}

function displayReslutModal(winner) {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const text = document.createElement("p");
  const winnerText = (() => {
    if (winner === "orange") {
      text.textContent = "オレンジの勝利";
      return;
    }

    text.textContent = "ブルーの勝利";
  })();

  text.style.color = winner;
  text.style.fontSize = "40px";
  text.style.marginBottom = "10px";

  const playButton = document.createElement("button");
  playButton.textContent = "もう一度遊ぶ";
  playButton.style.border = "none";
  playButton.style.padding = "10px 20px";
  playButton.addEventListener("click", () => window.location.reload());

  modal.append(text);
  modal.append(playButton);
  document.body.append(modal);
}

function getMostStackedPiece(number) {
  const panelState = panelStates[number];
  if (panelState.length === 0) return;

  const mostStacked = panelState[panelState.length - 1];

  return mostStacked.color;
}

function checkWinPlayer(line) {
  const winOrange = line.every((panel) => panel === "orange");
  const winBlue = line.every((panel) => panel === "blue");

  const winner = (() => {
    if (winOrange) return "orange";
    if (winBlue) return "blue";
  })();

  if (winner) {
    displayReslutModal(winner);
    return true;
  }
}

function calcResult() {
  const panel0 = getMostStackedPiece(0);
  const panel1 = getMostStackedPiece(1);
  const panel2 = getMostStackedPiece(2);
  const panel3 = getMostStackedPiece(3);
  const panel4 = getMostStackedPiece(4);
  const panel5 = getMostStackedPiece(5);
  const panel6 = getMostStackedPiece(6);
  const panel7 = getMostStackedPiece(7);
  const panel8 = getMostStackedPiece(8);

  const topRow = [panel0, panel1, panel2];
  const middleRow = [panel3, panel4, panel5];
  const bottomRow = [panel6, panel7, panel8];
  const leftColumu = [panel0, panel3, panel6];
  const centerColumu = [panel1, panel4, panel7];
  const rightColumu = [panel2, panel5, panel8];
  const fromTopLeftDaigonal = [panel0, panel4, panel8];
  const fromTopRightDaigonal = [panel2, panel4, panel6];

  if (checkWinPlayer(topRow)) return true;
  if (checkWinPlayer(middleRow)) return true;
  if (checkWinPlayer(bottomRow)) return true;
  if (checkWinPlayer(leftColumu)) return true;
  if (checkWinPlayer(centerColumu)) return true;
  if (checkWinPlayer(rightColumu)) return true;
  if (checkWinPlayer(fromTopLeftDaigonal)) return true;
  if (checkWinPlayer(fromTopRightDaigonal)) return true;
}

// evnet functions
function handlePanel(event) {
  if (!currentSize) {
    alert("コマを選んでください");
    return;
  }

  const getPanelNumber = event.target.number;

  if (checkCanHandlePanel(getPanelNumber)) {
    setGobbletOfPanel(getPanelNumber);
    renderBoard();
    removeGobbletElement();
    appendEventGobblets();

    if (calcResult()) return;

    currentSize = null;
    currentGobbletElement = null;
    selectingGobbletOfPanel = false;
    panelNumberWhenGobbletOfPanel = null;

    if (currentPlayer === mainPlayerColor) {
      currentPlayer = cpuPlayerColor;
      playByCpu();
    } else {
      currentPlayer = mainPlayerColor;
    }

    indicateCurrentPlayer();
  } else {
    alert("このマスには置けません");
  }
}

function setGobbletOfPanel(panelNumber) {
  const gobbletState = {};

  gobbletState.color = currentPlayer;
  gobbletState.size = currentSize;

  const selectingPanel = panelStates[panelNumber];
  selectingPanel.push(gobbletState);
}

function checkCanHandlePanel(panelNumber) {
  const selectingPanel = panelStates[panelNumber];

  if (panelNumberWhenGobbletOfPanel === panelNumber) return false;
  if (selectingPanel.length === 0) return true;

  const topStackedSize = selectingPanel[selectingPanel.length - 1];
  if (currentSize > topStackedSize.size) {
    return true;
  }

  return false;
}

function indicateSelectGobbletByHover(event) {
  const getGobblet = event.target;
  if (!checkCanSelectGobblet(getGobblet)) return;

  getGobblet.style.border = "3px solid red";
  getGobblet.addEventListener(
    "mouseleave",
    (event) => (event.target.style.border = "")
  );
}

function selectGobbletByClick(event) {
  event.stopPropagation();

  const getGobblet = event.target;
  if (!checkCanSelectGobblet(getGobblet)) return;

  if (typeof checkGobbletOfPanel(getGobblet) === "number") {
    getGobblet.isOfPanel = true;
    const getPanelNumber = checkGobbletOfPanel(getGobblet);
    selectingGobbletOfPanel = true;
    panelNumberWhenGobbletOfPanel = getPanelNumber;
    panelStates[getPanelNumber].pop();
  }

  currentSize = checkGobbletSize(getGobblet);
  currentGobbletElement = getGobblet;

  styleSelectingGobblet(getGobblet);
}

function checkCanSelectGobblet(gobblet) {
  if (selectingGobbletOfPanel) return false;
  if (gobblet.isOfPanel) return false;

  const checkColor = gobblet.classList.contains(currentPlayer);
  if (checkColor) return true;
}

function checkGobbletOfPanel(gobblet) {
  const isOfPanel = gobblet.parentElement.classList.contains("panel");
  if (!isOfPanel) return;

  const getParentPanelNumber = gobblet.parentElement.number;
  return getParentPanelNumber;
}
function checkGobbletSize(gobblet) {
  const small = 1;
  const medium = 2;
  const large = 3;

  if (gobblet.classList.contains("small")) return small;
  if (gobblet.classList.contains("medium")) return medium;
  if (gobblet.classList.contains("large")) return large;
}

function styleSelectingGobblet(gobblet) {
  const gobblets = document.querySelectorAll(".gobblet");
  gobblets.forEach((gobblet) => gobblet.classList.remove("selecting"));

  gobblet.classList.add("selecting");
}

function indicateCurrentPlayer() {
  const areas = document.querySelectorAll(".gobblets-area");
  areas.forEach((area) => (area.style.background = ""));

  const currentPlayerArea = document.querySelector(
    `.gobblets-area.${currentPlayer}`
  );

  currentPlayerArea.style.background = "yellow";
}
