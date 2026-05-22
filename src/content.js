const TIMER_ID = "ynwac-timer-overlay";
const PLAY_HINT_SELECTOR = ".pte-rec-pill__hint";
const PLAY_HINT_TEXT = "\u505c\u6b62";
const TIMER_OFFSET_PX = 20;

let timerElement = null;
let timerValueElement = null;
let activeHintElement = null;
let timerIntervalId = null;
let startedAt = 0;
let isTimerRunning = false;
let isTimerVisible = false;
let isDismissedUntilHintChanges = false;
let lastHasPlayHint = false;
let pendingPositionUpdate = false;

function findPlayHint() {
  return Array.from(document.querySelectorAll(PLAY_HINT_SELECTOR)).find(
    (element) => element.textContent.trim() === PLAY_HINT_TEXT
  );
}

function createTimerElement() {
  const existingTimer = document.querySelector(`#${TIMER_ID}`);

  if (existingTimer) {
    timerValueElement = existingTimer.querySelector("[data-ynwac-timer-value]");
    return existingTimer;
  }

  const element = document.createElement("div");
  element.id = TIMER_ID;
  element.setAttribute("aria-live", "polite");

  const valueElement = document.createElement("span");
  valueElement.dataset.ynwacTimerValue = "true";
  valueElement.textContent = "00:00";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "x";
  closeButton.setAttribute("aria-label", "Close YNWAC timer");
  closeButton.addEventListener("click", closeTimer);

  Object.assign(element.style, {
    alignItems: "center",
    display: "inline-flex",
    gap: "10px",
    position: "fixed",
    top: "0",
    left: "0",
    transform: "translateX(-50%)",
    zIndex: "2147483647",
    minWidth: "86px",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(18, 24, 38, 0.92)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.22)",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
    fontWeight: "700",
    lineHeight: "1",
    letterSpacing: "0",
    textAlign: "center"
  });

  Object.assign(closeButton.style, {
    alignItems: "center",
    appearance: "none",
    background: "rgba(255, 255, 255, 0.18)",
    border: "0",
    borderRadius: "999px",
    color: "#ffffff",
    cursor: "pointer",
    display: "inline-flex",
    font: "inherit",
    fontSize: "14px",
    fontWeight: "700",
    height: "22px",
    justifyContent: "center",
    lineHeight: "1",
    padding: "0",
    width: "22px"
  });

  element.append(valueElement, closeButton);
  document.documentElement.append(element);
  timerValueElement = valueElement;

  return element;
}

function positionTimerUnderHint(hintElement) {
  if (!timerElement || !hintElement?.isConnected) {
    return;
  }

  const hintRect = hintElement.getBoundingClientRect();
  const left = hintRect.left + hintRect.width / 2;
  const top = hintRect.bottom + TIMER_OFFSET_PX;

  timerElement.style.left = `${left}px`;
  timerElement.style.top = `${top}px`;
}

function formatElapsedTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateTimer() {
  if (!timerValueElement) {
    return;
  }

  timerValueElement.textContent = formatElapsedTime(Date.now() - startedAt);
}

function startTimer(hintElement) {
  if (isTimerRunning && isTimerVisible) {
    positionTimerUnderHint(hintElement);
    return;
  }

  timerElement = createTimerElement();
  activeHintElement = hintElement;
  positionTimerUnderHint(hintElement);
  startedAt = Date.now();
  isTimerRunning = true;
  isTimerVisible = true;

  updateTimer();
  window.clearInterval(timerIntervalId);
  timerIntervalId = window.setInterval(updateTimer, 250);
}

function stopTimer() {
  if (!isTimerRunning) {
    return;
  }

  window.clearInterval(timerIntervalId);
  timerIntervalId = null;
  startedAt = 0;
  isTimerRunning = false;
}

function closeTimer() {
  stopTimer();
  isTimerVisible = false;
  isDismissedUntilHintChanges = lastHasPlayHint;

  timerElement?.remove();
  timerElement = null;
  timerValueElement = null;
  activeHintElement = null;
}

function syncTimerWithPage() {
  const playHint = findPlayHint();
  const hasPlayHint = Boolean(playHint);

  if (!hasPlayHint) {
    isDismissedUntilHintChanges = false;
  }

  if (hasPlayHint) {
    activeHintElement = playHint;

    if (!isDismissedUntilHintChanges) {
      startTimer(playHint);
    }
  } else {
    stopTimer();
    positionTimerUnderHint(activeHintElement);
  }

  lastHasPlayHint = hasPlayHint;
}

function scheduleTimerSync() {
  if (pendingPositionUpdate) {
    return;
  }

  pendingPositionUpdate = true;

  window.requestAnimationFrame(() => {
    pendingPositionUpdate = false;
    syncTimerWithPage();
  });
}

const observer = new MutationObserver(syncTimerWithPage);

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  characterData: true
});

syncTimerWithPage();

document.addEventListener("scroll", scheduleTimerSync, {
  capture: true,
  passive: true
});
window.addEventListener("resize", scheduleTimerSync);
