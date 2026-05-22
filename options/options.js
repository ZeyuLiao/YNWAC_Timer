const timerName = document.querySelector("#timerName");
const saveButton = document.querySelector("#saveButton");
const status = document.querySelector("#status");

saveButton.addEventListener("click", () => {
  status.textContent = timerName.value.trim()
    ? "Saved for this page."
    : "No timer name set.";
});
