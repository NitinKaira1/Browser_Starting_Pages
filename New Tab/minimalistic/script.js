// =========================
// CLOCK
// =========================

const clock = document.getElementById("clock");
const date = document.getElementById("date");

function pad(number) {
  return number < 10 ? `0${number}` : number;
}

// Get saved time format.
// If nothing is saved, use 24-hour.
let currentTimeFormat = localStorage.getItem("timeFormat") || "24";

function updateClock() {
  const now = new Date();

  if (currentTimeFormat === "12") {
    let hours = now.getHours() % 12;
    if (hours === 0) hours = 12;

    const meridiem = now.getHours() < 12 ? "AM" : "PM";

    clock.textContent =
      `${hours}:${pad(now.getMinutes())} ${meridiem}`;
  } else {
    clock.textContent =
      `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  date.textContent =
    `${days[now.getDay()]}, ` +
    `${months[now.getMonth()]} ` +
    `${now.getDate()}`;
}

updateClock();

// Update clock every minute
setInterval(updateClock, 60000);


// =========================
// THEME
// =========================

const root = document.documentElement;

// Get saved theme.
// If nothing is saved, use "system".
let currentTheme = localStorage.getItem("theme") || "system";

// Apply the selected theme
function applyTheme(theme) {

  if (theme === "system") {
    // Remove the data-theme attribute.
    // CSS will then use the user's system preference.
    root.removeAttribute("data-theme");

  } else {
    // Set either:
    // data-theme="light"
    // or
    // data-theme="dark"
    root.setAttribute("data-theme", theme);
  }

  // Remember the user's choice
  localStorage.setItem("theme", theme);

  // Update selected button
  document.querySelectorAll(".theme-option").forEach((button) => {

    const isSelected =
      button.dataset.themeChoice === theme;

    button.classList.toggle("selected", isSelected);

    button.setAttribute(
      "aria-checked",
      isSelected
    );
  });
}


// Apply saved theme when page loads
applyTheme(currentTheme);


// Theme buttons
const themeButtons =
  document.querySelectorAll(".theme-option");

themeButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const selectedTheme =
      button.dataset.themeChoice;

    currentTheme = selectedTheme;

    applyTheme(selectedTheme);
  });

});


// =========================
// TIME FORMAT
// =========================

// Apply the selected time format
function applyTimeFormat(format) {

  currentTimeFormat = format;

  // Remember the user's choice
  localStorage.setItem("timeFormat", format);

  // Re-render the clock immediately
  updateClock();

  // Update selected button
  document
    .querySelectorAll(".theme-option[data-format-choice]")
    .forEach((button) => {

      const isSelected =
        button.dataset.formatChoice === format;

      button.classList.toggle("selected", isSelected);

      button.setAttribute(
        "aria-checked",
        isSelected
      );
    });
}


// Apply saved format when page loads
applyTimeFormat(currentTimeFormat);


// Format buttons
const formatButtons =
  document.querySelectorAll(
    ".theme-option[data-format-choice]"
  );

formatButtons.forEach((button) => {

  button.addEventListener("click", () => {
    applyTimeFormat(button.dataset.formatChoice);
  });

});


// =========================
// SETTINGS NAV
// =========================

const settingsNavButtons =
  document.querySelectorAll(
    ".settings-nav[data-panel]"
  );

settingsNavButtons.forEach((navButton) => {

  navButton.addEventListener("click", () => {

    const targetPanel =
      navButton.dataset.panel;

    // Update nav buttons
    settingsNavButtons.forEach((button) => {

      const isActive =
        button === navButton;

      button.classList.toggle(
        "active",
        isActive
      );

      if (isActive) {
        button.setAttribute(
          "aria-current",
          "page"
        );
      } else {
        button.removeAttribute(
          "aria-current"
        );
      }
    });

    // Update panes
    document
      .querySelectorAll(".settings-pane")
      .forEach((pane) => {

        const isActive =
          pane.id === `pane-${targetPanel}`;

        pane.classList.toggle(
          "active",
          isActive
        );

        pane.hidden = !isActive;
      });
  });

});


// =========================
// SHORTCUTS
// =========================

const shortcutsContainer =
  document.getElementById("shortcuts");

const shortcutBackdrop =
  document.getElementById("shortcutBackdrop");

const shortcutDialog =
  document.getElementById("shortcutDialog");

const shortcutNameInput =
  document.getElementById("shortcutName");

const shortcutUrlInput =
  document.getElementById("shortcutUrl");

const cancelShortcutButton =
  document.getElementById("cancelShortcut");

const saveShortcutButton =
  document.getElementById("saveShortcut");

let shortcuts = [];

try {
  shortcuts =
    JSON.parse(
      localStorage.getItem("shortcuts")
    ) || [];
} catch (error) {
  shortcuts = [];
}


function saveShortcutsToStorage() {
  localStorage.setItem(
    "shortcuts",
    JSON.stringify(shortcuts)
  );
}


function faviconUrl(url) {

  try {

    const { hostname } =
      new URL(url);

    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

  } catch (error) {

    return null;

  }
}


function initials(name) {
  return (
    name
      .trim()
      .slice(0, 1)
      .toUpperCase() || "?"
  );
}


function renderShortcuts() {

  shortcutsContainer.innerHTML = "";

  // Existing shortcuts
  shortcuts.forEach((shortcut, index) => {

    const item =
      document.createElement("div");

    item.className = "shortcut";


    const iconButton =
      document.createElement("button");

    iconButton.type = "button";

    iconButton.className =
      "shortcut-icon";

    iconButton.setAttribute(
      "aria-label",
      `Open ${shortcut.name}`
    );


    const icon =
      faviconUrl(shortcut.url);


    if (icon) {

      const img =
        document.createElement("img");

      img.src = icon;
      img.alt = "";

      img.onerror = () => {

        img.remove();

        iconButton.textContent =
          initials(shortcut.name);

      };

      iconButton.appendChild(img);

    } else {

      iconButton.textContent =
        initials(shortcut.name);

    }


    iconButton.addEventListener(
      "click",
      () => {

        window.open(
          shortcut.url,
          "_blank",
          "noopener"
        );

      }
    );


    const removeButton =
      document.createElement("button");

    removeButton.type = "button";

    removeButton.className =
      "shortcut-remove";

    removeButton.setAttribute(
      "aria-label",
      `Remove ${shortcut.name}`
    );

    removeButton.textContent = "\u00d7";


    removeButton.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

        const confirmed =
          window.confirm(
            `Remove "${shortcut.name}"?`
          );

        if (!confirmed) return;

        shortcuts.splice(index, 1);

        saveShortcutsToStorage();

        renderShortcuts();

      }
    );


    const label =
      document.createElement("span");

    label.className =
      "shortcut-label";

    label.textContent =
      shortcut.name;


    item.appendChild(iconButton);
    item.appendChild(removeButton);
    item.appendChild(label);

    shortcutsContainer.appendChild(item);

  });


  // "Add" tile
  const addItem =
    document.createElement("div");

  addItem.className =
    "shortcut shortcut-add";


  const addButton =
    document.createElement("button");

  addButton.type = "button";

  addButton.className =
    "shortcut-icon";

  addButton.setAttribute(
    "aria-label",
    "Add shortcut"
  );

  addButton.textContent = "+";

  addButton.addEventListener(
    "click",
    openShortcutDialog
  );


  const addLabel =
    document.createElement("span");

  addLabel.className =
    "shortcut-label";

  addLabel.textContent = "Add";


  addItem.appendChild(addButton);
  addItem.appendChild(addLabel);

  shortcutsContainer.appendChild(addItem);
}


function openShortcutDialog() {

  shortcutNameInput.value = "";
  shortcutUrlInput.value = "";

  shortcutBackdrop.hidden = false;

  shortcutDialog.classList.add("open");

  shortcutDialog.setAttribute(
    "aria-hidden",
    "false"
  );

  setTimeout(
    () => shortcutNameInput.focus(),
    50
  );
}


function closeShortcutDialog() {

  shortcutDialog.classList.remove("open");

  shortcutDialog.setAttribute(
    "aria-hidden",
    "true"
  );

  setTimeout(() => {

    if (
      !shortcutDialog.classList.contains("open")
    ) {

      shortcutBackdrop.hidden = true;

    }

  }, 200);
}


function normalizeUrl(value) {

  const trimmed =
    value.trim();

  if (!trimmed) return null;

  if (!/^https?:\/\//i.test(trimmed)) {

    return `https://${trimmed}`;

  }

  return trimmed;
}


function addShortcut() {

  const name =
    shortcutNameInput.value.trim();

  const url =
    normalizeUrl(
      shortcutUrlInput.value
    );

  if (!name || !url) return;

  shortcuts.push({
    name,
    url
  });

  saveShortcutsToStorage();

  renderShortcuts();

  closeShortcutDialog();
}


saveShortcutButton.addEventListener(
  "click",
  addShortcut
);

cancelShortcutButton.addEventListener(
  "click",
  closeShortcutDialog
);

shortcutBackdrop.addEventListener(
  "click",
  closeShortcutDialog
);


shortcutUrlInput.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Enter") {

      event.preventDefault();

      addShortcut();

    }

  }
);


document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      shortcutDialog.classList.contains("open")
    ) {

      closeShortcutDialog();

    }

  }
);


renderShortcuts();


// =========================
// SETTINGS BUTTON
// =========================

const settingsButton =
  document.getElementById(
    "settingsButton"
  );

const settingsPanel =
  document.getElementById(
    "settingsPanel"
  );

const settingsBackdrop =
  document.getElementById(
    "settingsBackdrop"
  );

const closeSettings =
  document.getElementById(
    "closeSettings"
  );


// Open settings
function openSettings() {

  settingsBackdrop.hidden = false;

  settingsPanel.classList.add("open");

  settingsPanel.setAttribute(
    "aria-hidden",
    "false"
  );

  settingsButton.setAttribute(
    "aria-expanded",
    "true"
  );
}


// Close settings
function closeSettingsPanel() {

  settingsPanel.classList.remove("open");

  settingsPanel.setAttribute(
    "aria-hidden",
    "true"
  );

  settingsButton.setAttribute(
    "aria-expanded",
    "false"
  );

  // Wait for the closing animation
  setTimeout(() => {

    if (
      !settingsPanel.classList.contains("open")
    ) {

      settingsBackdrop.hidden = true;

    }

  }, 200);
}


// Click settings button
settingsButton.addEventListener(
  "click",
  openSettings
);


// Click X
closeSettings.addEventListener(
  "click",
  closeSettingsPanel
);


// Click outside settings panel
settingsBackdrop.addEventListener(
  "click",
  closeSettingsPanel
);


// Press Escape to close
document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      settingsPanel.classList.contains("open")
    ) {

      closeSettingsPanel();

    }

  }
);