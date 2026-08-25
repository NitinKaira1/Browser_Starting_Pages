// =========================
// CLOCK
// =========================

const clock = document.getElementById("clock");
const date = document.getElementById("date");

function pad(number) {
  return number < 10 ? `0${number}` : number;
}


// Get saved time format
let currentTimeFormat =
  localStorage.getItem("timeFormat") || "24";


function updateClock() {

  const now = new Date();


  // 12-HOUR
  if (currentTimeFormat === "12") {

    let hours =
      now.getHours() % 12;

    if (hours === 0) {
      hours = 12;
    }


    const meridiem =
      now.getHours() < 12
        ? "AM"
        : "PM";


    clock.innerHTML =
      `${hours}<span class="colon">:</span>${pad(now.getMinutes())} ${meridiem}`;

  }


  // 24-HOUR
  else {

    clock.innerHTML =
      `${pad(now.getHours())}<span class="colon">:</span>${pad(now.getMinutes())}`;

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
    `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;

}


updateClock();


// Update every minute
setInterval(updateClock, 60000);



// =========================
// THEME
// =========================

const root =
  document.documentElement;


let currentTheme =
  localStorage.getItem("theme") || "system";


function applyTheme(theme) {

  if (theme === "system") {

    root.removeAttribute(
      "data-theme"
    );

  }

  else {

    root.setAttribute(
      "data-theme",
      theme
    );

  }


  localStorage.setItem(
    "theme",
    theme
  );


  document
    .querySelectorAll(".theme-option")
    .forEach((button) => {

      const isSelected =
        button.dataset.themeChoice === theme;


      button.classList.toggle(
        "selected",
        isSelected
      );


      button.setAttribute(
        "aria-checked",
        isSelected
      );

    });

}


applyTheme(currentTheme);


const themeButtons =
  document.querySelectorAll(
    ".theme-option[data-theme-choice]"
  );


themeButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      const selectedTheme =
        button.dataset.themeChoice;

      currentTheme =
        selectedTheme;

      applyTheme(
        selectedTheme
      );

    }
  );

});



// =========================
// TIME FORMAT
// =========================

function applyTimeFormat(format) {

  currentTimeFormat =
    format;


  localStorage.setItem(
    "timeFormat",
    format
  );


  updateClock();


  document
    .querySelectorAll(
      ".theme-option[data-format-choice]"
    )
    .forEach((button) => {

      const isSelected =
        button.dataset.formatChoice === format;


      button.classList.toggle(
        "selected",
        isSelected
      );


      button.setAttribute(
        "aria-checked",
        isSelected
      );

    });

}


applyTimeFormat(
  currentTimeFormat
);


const formatButtons =
  document.querySelectorAll(
    ".theme-option[data-format-choice]"
  );


formatButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      applyTimeFormat(
        button.dataset.formatChoice
      );

    }
  );

});



// =========================
// SETTINGS NAVIGATION
// =========================

const settingsNavButtons =
  document.querySelectorAll(
    ".settings-nav[data-panel]"
  );


settingsNavButtons.forEach(
  (navButton) => {

    navButton.addEventListener(
      "click",
      () => {

        const targetPanel =
          navButton.dataset.panel;


        // Update sidebar
        settingsNavButtons.forEach(
          (button) => {

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

            }

            else {

              button.removeAttribute(
                "aria-current"
              );

            }

          }
        );


        // Update panels
        document
          .querySelectorAll(
            ".settings-pane"
          )
          .forEach((pane) => {

            const isActive =
              pane.id ===
              `pane-${targetPanel}`;


            pane.classList.toggle(
              "active",
              isActive
            );


            pane.hidden =
              !isActive;

          });

      }
    );

  }
);



// =========================
// SHORTCUTS
// =========================

const shortcutsContainer =
  document.getElementById(
    "shortcuts"
  );


const shortcutBackdrop =
  document.getElementById(
    "shortcutBackdrop"
  );


const shortcutDialog =
  document.getElementById(
    "shortcutDialog"
  );


const shortcutNameInput =
  document.getElementById(
    "shortcutName"
  );


const shortcutUrlInput =
  document.getElementById(
    "shortcutUrl"
  );


const cancelShortcutButton =
  document.getElementById(
    "cancelShortcut"
  );


const saveShortcutButton =
  document.getElementById(
    "saveShortcut"
  );


let shortcuts = [];


try {

  shortcuts =
    JSON.parse(
      localStorage.getItem(
        "shortcuts"
      )
    ) || [];

}

catch (error) {

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

    const {
      hostname
    } = new URL(url);


    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

  }

  catch (error) {

    return null;

  }

}


function initials(name) {

  return (
    name
      .trim()
      .slice(0, 1)
      .toUpperCase() ||
    "?"
  );

}


function renderShortcuts() {

  shortcutsContainer.innerHTML =
    "";


  // Existing shortcuts
  shortcuts.forEach(
    (shortcut, index) => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "shortcut";


      // Icon
      const iconButton =
        document.createElement(
          "button"
        );


      iconButton.type =
        "button";


      iconButton.className =
        "shortcut-icon";


      iconButton.setAttribute(
        "aria-label",
        `Open ${shortcut.name}`
      );


      const icon =
        faviconUrl(
          shortcut.url
        );


      if (icon) {

        const img =
          document.createElement(
            "img"
          );


        img.src = icon;

        img.alt = "";


        img.onerror = () => {

          img.remove();

          iconButton.textContent =
            initials(
              shortcut.name
            );

        };


        iconButton.appendChild(
          img
        );

      }

      else {

        iconButton.textContent =
          initials(
            shortcut.name
          );

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


      // Remove
      const removeButton =
        document.createElement(
          "button"
        );


      removeButton.type =
        "button";


      removeButton.className =
        "shortcut-remove";


      removeButton.setAttribute(
        "aria-label",
        `Remove ${shortcut.name}`
      );


      removeButton.textContent =
        "\u00d7";


      removeButton.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();


          const confirmed =
            window.confirm(
              `Remove "${shortcut.name}"?`
            );


          if (!confirmed) {
            return;
          }


          shortcuts.splice(
            index,
            1
          );


          saveShortcutsToStorage();

          renderShortcuts();

        }
      );


      // Label
      const label =
        document.createElement(
          "span"
        );


      label.className =
        "shortcut-label";


      label.textContent =
        shortcut.name;


      item.appendChild(
        iconButton
      );


      item.appendChild(
        removeButton
      );


      item.appendChild(
        label
      );


      shortcutsContainer.appendChild(
        item
      );

    }
  );


  // Add button
  const addItem =
    document.createElement(
      "div"
    );


  addItem.className =
    "shortcut shortcut-add";


  const addButton =
    document.createElement(
      "button"
    );


  addButton.type =
    "button";


  addButton.className =
    "shortcut-icon";


  addButton.setAttribute(
    "aria-label",
    "Add shortcut"
  );


  addButton.textContent =
    "+";


  addButton.addEventListener(
    "click",
    openShortcutDialog
  );


  const addLabel =
    document.createElement(
      "span"
    );


  addLabel.className =
    "shortcut-label";


  addLabel.textContent =
    "Add";


  addItem.appendChild(
    addButton
  );


  addItem.appendChild(
    addLabel
  );


  shortcutsContainer.appendChild(
    addItem
  );

}


function openShortcutDialog() {

  shortcutNameInput.value =
    "";

  shortcutUrlInput.value =
    "";


  shortcutBackdrop.hidden =
    false;


  shortcutDialog.classList.add(
    "open"
  );


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

  shortcutDialog.classList.remove(
    "open"
  );


  shortcutDialog.setAttribute(
    "aria-hidden",
    "true"
  );


  setTimeout(
    () => {

      if (
        !shortcutDialog.classList.contains(
          "open"
        )
      ) {

        shortcutBackdrop.hidden =
          true;

      }

    },
    200
  );

}


function normalizeUrl(value) {

  const trimmed =
    value.trim();


  if (!trimmed) {
    return null;
  }


  if (
    !/^https?:\/\//i.test(
      trimmed
    )
  ) {

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


  if (!name || !url) {
    return;
  }


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
      shortcutDialog.classList.contains(
        "open"
      )
    ) {

      closeShortcutDialog();

    }

  }
);


renderShortcuts();



// =========================
// CUSTOM WALLPAPER
// =========================

const wallpaperInput =
  document.getElementById(
    "wallpaperInput"
  );


const resetWallpaper =
  document.getElementById(
    "resetWallpaper"
  );


const wallpaperInfo =
  document.getElementById(
    "wallpaperInfo"
  );


const backgroundVideo =
  document.querySelector(
    ".bg-video"
  );


const backgroundSource =
  backgroundVideo.querySelector(
    "source"
  );


const bgImage =
  document.getElementById(
    "bgImage"
  );


// Default wallpaper
const defaultWallpaper =
  backgroundSource.src;


// Current temporary object URL
let currentWallpaperUrl =
  null;



// Load saved wallpaper
function loadSavedWallpaper() {

  try {

    const savedWallpaper =
      localStorage.getItem(
        "wallpaperData"
      );


    if (!savedWallpaper) {
      return;
    }


    const wallpaper =
      JSON.parse(
        savedWallpaper
      );


    if (
      !wallpaper ||
      !wallpaper.data ||
      !wallpaper.type
    ) {

      return;

    }


    if (
      wallpaper.type.startsWith(
        "image/"
      )
    ) {

      bgImage.src =
        wallpaper.data;

      bgImage.style.display =
        "block";

      backgroundVideo.style.display =
        "none";


      wallpaperInfo.textContent =
        `Saved: ${wallpaper.name}`;

    }


    else if (
      wallpaper.type.startsWith(
        "video/"
      )
    ) {

      backgroundVideo.style.display =
        "block";

      bgImage.style.display =
        "none";


      backgroundSource.src =
        wallpaper.data;


      backgroundVideo.load();


      backgroundVideo.play()
        .catch(() => {});


      wallpaperInfo.textContent =
        `Saved: ${wallpaper.name}`;

    }

  }

  catch (error) {

    console.error(
      "Could not load saved wallpaper:",
      error
    );

  }

}



// Read selected file
wallpaperInput.addEventListener(
  "change",
  handleWallpaperUpload
);



function handleWallpaperUpload(event) {

  const file =
    event.target.files[0];


  if (!file) {
    return;
  }


  // Remove old temporary URL
  if (currentWallpaperUrl) {

    URL.revokeObjectURL(
      currentWallpaperUrl
    );

    currentWallpaperUrl =
      null;

  }


  currentWallpaperUrl =
    URL.createObjectURL(
      file
    );


  wallpaperInfo.textContent =
    `Loading: ${file.name}`;


  // =========================
  // IMAGE
  // =========================

  if (
    file.type.startsWith(
      "image/"
    )
  ) {

    bgImage.src =
      currentWallpaperUrl;


    bgImage.style.display =
      "block";


    backgroundVideo.style.display =
      "none";


    saveWallpaper(
      file
    );


    wallpaperInfo.textContent =
      `Active: ${file.name}`;


    return;

  }


  // =========================
  // VIDEO
  // =========================

  if (
    file.type.startsWith(
      "video/"
    )
  ) {

    bgImage.style.display =
      "none";


    backgroundVideo.style.display =
      "block";


    backgroundSource.src =
      currentWallpaperUrl;


    backgroundVideo.load();


    backgroundVideo.play()
      .catch(() => {});


    saveWallpaper(
      file
    );


    wallpaperInfo.textContent =
      `Active: ${file.name}`;


    return;

  }


  wallpaperInfo.textContent =
    "Unsupported file type.";

}



// =========================
// SAVE WALLPAPER
// =========================

function saveWallpaper(file) {

  const reader =
    new FileReader();


  reader.onload = () => {

    const wallpaperData = {

      name: file.name,

      type: file.type,

      data: reader.result

    };


    try {

      localStorage.setItem(
        "wallpaperData",
        JSON.stringify(
          wallpaperData
        )
      );

    }

    catch (error) {

      console.error(
        "Wallpaper is too large for localStorage:",
        error
      );


      wallpaperInfo.textContent =
        "Wallpaper too large to save. It will work until refresh.";

    }

  };


  reader.readAsDataURL(
    file
  );

}



// =========================
// RESET WALLPAPER
// =========================

resetWallpaper.addEventListener(
  "click",
  resetCustomWallpaper
);


function resetCustomWallpaper() {

  // Remove saved wallpaper
  localStorage.removeItem(
    "wallpaperData"
  );


  // Remove image
  bgImage.src =
    "";

  bgImage.style.display =
    "none";


  // Restore video
  backgroundVideo.style.display =
    "block";


  backgroundSource.src =
    defaultWallpaper;


  backgroundVideo.load();


  backgroundVideo.play()
    .catch(() => {});


  wallpaperInput.value =
    "";


  wallpaperInfo.textContent =
    "Default wallpaper restored.";


  // Cleanup temporary URL
  if (currentWallpaperUrl) {

    URL.revokeObjectURL(
      currentWallpaperUrl
    );

    currentWallpaperUrl =
      null;

  }

}


// Load saved wallpaper on startup
loadSavedWallpaper();



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

  document.body.classList.add(
    "settings-open"
  );


  settingsBackdrop.hidden =
    false;


  settingsPanel.classList.add(
    "open"
  );


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

  document.body.classList.remove(
    "settings-open"
  );


  settingsPanel.classList.remove(
    "open"
  );


  settingsPanel.setAttribute(
    "aria-hidden",
    "true"
  );


  settingsButton.setAttribute(
    "aria-expanded",
    "false"
  );


  setTimeout(
    () => {

      if (
        !settingsPanel.classList.contains(
          "open"
        )
      ) {

        settingsBackdrop.hidden =
          true;

      }

    },
    200
  );

}



// Settings button
settingsButton.addEventListener(
  "click",
  openSettings
);



// Close button
closeSettings.addEventListener(
  "click",
  closeSettingsPanel
);



// Click outside
settingsBackdrop.addEventListener(
  "click",
  closeSettingsPanel
);



// Escape
document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      settingsPanel.classList.contains(
        "open"
      )
    ) {

      closeSettingsPanel();

    }

  }
);