const selectionView = document.getElementById("selection-view");
const overlay = document.getElementById("reveal-overlay");
const overlayPanel = document.getElementById("overlay-panel");
const revealButton = document.getElementById("reveal-button");
const helperText = document.querySelector(".helper-text");
const statusMessage = document.getElementById("selection-status");
const cards = Array.from(document.querySelectorAll(".choice-card"));
const checkboxes = Array.from(document.querySelectorAll(".choice-checkbox"));

const unlockThreshold = 3;

function setReadyState() {
  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });
}

function syncCardStates() {
  cards.forEach((card) => {
    const checkbox = card.querySelector(".choice-checkbox");
    card.classList.toggle("is-selected", checkbox.checked);
  });
}

function updateButtonState(shouldCelebrate) {
  const selectedCount = checkboxes.filter((checkbox) => checkbox.checked).length;
  const isUnlocked = selectedCount >= unlockThreshold;
  const wasUnlocked = !revealButton.disabled;
  const icon = revealButton.querySelector("i");

  syncCardStates();

  revealButton.disabled = !isUnlocked;
  revealButton.classList.toggle("is-unlocked", isUnlocked);
  revealButton.setAttribute("aria-disabled", String(!isUnlocked));
  helperText.style.opacity = isUnlocked ? "0" : "1";
  icon.className = isUnlocked ? "ph ph-sparkle" : "ph ph-lock-key";

  if (isUnlocked && shouldCelebrate && !wasUnlocked) {
    revealButton.classList.remove("just-unlocked");
    void revealButton.offsetWidth;
    revealButton.classList.add("just-unlocked");
  }

  if (!isUnlocked) {
    revealButton.classList.remove("just-unlocked");
  }

  statusMessage.textContent = isUnlocked
    ? "Three or more boxes selected. The Show my candidate button is now enabled."
    : `${selectedCount} box${selectedCount === 1 ? "" : "es"} selected. Select at least 3 to unlock the button.`;
}

function openOverlay() {
  if (revealButton.disabled) {
    return;
  }

  document.body.classList.add("overlay-open");
  overlay.setAttribute("aria-hidden", "false");
  selectionView.inert = true;
  overlayPanel.focus();
}

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    updateButtonState(true);
  });
});

revealButton.addEventListener("click", openOverlay);

setReadyState();
updateButtonState(false);
