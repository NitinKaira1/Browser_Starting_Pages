// =====================================================
// CUBE ROTATION
// =====================================================

const cube = document.getElementById("cube");

let isDragging = false;

let lastX = 0;
let lastY = 0;

let rotationX = -20;
let rotationY = 30;


// Disable right-click menu
document.addEventListener(
    "contextmenu",
    (event) => {

        event.preventDefault();

    }
);


// Start rotation
document.addEventListener(
    "mousedown",
    (event) => {

        // Right mouse button only
        if (event.button !== 2) {
            return;
        }


        // Don't rotate when using controls
        if (
            event.target.closest(
                "button, input, form, .shortcuts"
            )
        ) {
            return;
        }


        isDragging = true;

        lastX = event.clientX;

        lastY = event.clientY;

    }
);


// Rotate
document.addEventListener(
    "mousemove",
    (event) => {

        if (!isDragging) {
            return;
        }


        const deltaX =
            event.clientX - lastX;


        const deltaY =
            event.clientY - lastY;


        rotationY +=
            deltaX * 0.5;


        rotationX -=
            deltaY * 0.5;


        cube.style.transform =
            `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;


        lastX =
            event.clientX;


        lastY =
            event.clientY;

    }
);


// Stop rotation
document.addEventListener(
    "mouseup",
    (event) => {

        if (event.button === 2) {

            isDragging = false;

        }

    }
);


// Also stop if mouse leaves window
document.addEventListener(
    "mouseleave",
    () => {

        isDragging = false;

    }
);



// =====================================================
// CLOCK
// =====================================================

const clock =
    document.getElementById("clock");


const date =
    document.getElementById("date");


const bigDay =
    document.getElementById("bigDay");


const bigDate =
    document.getElementById("bigDate");


const bigMonth =
    document.getElementById("bigMonth");


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


function pad(number) {

    return number < 10
        ? `0${number}`
        : String(number);

}


let currentTimeFormat =
    localStorage.getItem(
        "timeFormat"
    ) || "24";


function updateClock() {

    const now =
        new Date();


    if (
        currentTimeFormat === "12"
    ) {

        let hours =
            now.getHours() % 12;


        if (hours === 0) {

            hours = 12;

        }


        const meridiem =
            now.getHours() < 12
                ? "AM"
                : "PM";


        clock.textContent =
            `${hours}:${pad(
                now.getMinutes()
            )} ${meridiem}`;

    }

    else {

        clock.textContent =
            `${pad(
                now.getHours()
            )}:${pad(
                now.getMinutes()
            )}`;

    }


    date.textContent =
        `${days[now.getDay()]}, ` +
        `${months[now.getMonth()]} ` +
        `${now.getDate()}`;


    bigDay.textContent =
        days[now.getDay()]
            .slice(0, 3)
            .toUpperCase();


    bigDate.textContent =
        pad(now.getDate());


    bigMonth.textContent =
        months[now.getMonth()]
            .toUpperCase();

}


updateClock();


setInterval(
    updateClock,
    1000
);



// =====================================================
// THEME
// =====================================================

const root =
    document.documentElement;


// Available themes
const AVAILABLE_THEMES = [

    "system",
    "light",
    "dark",

    "glass",
    "neo",
    "brutal",
    "clay",
    "material",

    "retro",
    "cyberpunk",
    "vaporwave",
    "aurora",

    "terminal",
    "y2k",
    "paper",
    "mono",
    "minimal",

    "transparent",
];


let currentTheme =
    localStorage.getItem(
        "theme"
    ) || "system";


// Protect against an invalid
// theme saved in localStorage
if (
    !AVAILABLE_THEMES.includes(
        currentTheme
    )
) {

    currentTheme =
        "system";

}


function applyTheme(theme) {

    // Safety check
    if (
        !AVAILABLE_THEMES.includes(
            theme
        )
    ) {

        theme =
            "system";

    }


    // System theme
    if (
        theme === "system"
    ) {

        root.removeAttribute(
            "data-theme"
        );

    }

    // Custom theme
    else {

        root.setAttribute(
            "data-theme",
            theme
        );

    }


    // Save theme
    localStorage.setItem(
        "theme",
        theme
    );


    // Update selected button
    document
        .querySelectorAll(
            "[data-theme-choice]"
        )
        .forEach(
            (button) => {

                const selected =
                    button.dataset
                        .themeChoice ===
                    theme;


                button.classList.toggle(
                    "selected",
                    selected
                );

            }
        );

}


// Apply saved theme
applyTheme(
    currentTheme
);


// Theme buttons
document
    .querySelectorAll(
        "[data-theme-choice]"
    )
    .forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const selectedTheme =
                        button.dataset
                            .themeChoice;


                    if (
                        !AVAILABLE_THEMES.includes(
                            selectedTheme
                        )
                    ) {

                        return;

                    }


                    currentTheme =
                        selectedTheme;


                    applyTheme(
                        currentTheme
                    );

                }
            );

        }
    );



// =====================================================
// TIME FORMAT
// =====================================================

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
            "[data-format-choice]"
        )
        .forEach(
            (button) => {

                const selected =
                    button.dataset
                        .formatChoice ===
                    format;


                button.classList.toggle(
                    "selected",
                    selected
                );

            }
        );

}


applyTimeFormat(
    currentTimeFormat
);


document
    .querySelectorAll(
        "[data-format-choice]"
    )
    .forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    applyTimeFormat(
                        button.dataset
                            .formatChoice
                    );

                }
            );

        }
    );



// =====================================================
// SETTINGS
// =====================================================

const settingsButton =
    document.getElementById(
        "settingsButton"
    );


const openSettingsText =
    document.getElementById(
        "openSettingsText"
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


function openSettings() {

    settingsBackdrop.hidden =
        false;


    settingsPanel.classList.add(
        "open"
    );


    settingsPanel.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeSettingsPanel() {

    settingsPanel.classList.remove(
        "open"
    );


    settingsPanel.setAttribute(
        "aria-hidden",
        "true"
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


settingsButton.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        openSettings();

    }
);


openSettingsText.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        openSettings();

    }
);


closeSettings.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        closeSettingsPanel();

    }
);


settingsBackdrop.addEventListener(
    "click",
    closeSettingsPanel
);



// =====================================================
// SETTINGS TABS
// =====================================================

const settingsNavButtons =
    document.querySelectorAll(
        ".settings-nav"
    );


settingsNavButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const target =
                    button.dataset.panel;


                settingsNavButtons.forEach(
                    (nav) => {

                        nav.classList.toggle(
                            "active",
                            nav === button
                        );

                    }
                );


                document
                    .querySelectorAll(
                        ".settings-pane"
                    )
                    .forEach(
                        (pane) => {

                            const active =
                                pane.id ===
                                `pane-${target}`;


                            pane.classList.toggle(
                                "active",
                                active
                            );


                            pane.hidden =
                                !active;

                        }
                    );

            }
        );

    }
);



// =====================================================
// WIKIPEDIA
// =====================================================

const luckyButton =
    document.getElementById(
        "luckyButton"
    );


luckyButton.addEventListener(
    "click",
    (event) => {

        event.preventDefault();

        event.stopPropagation();


        window.location.href =
            "https://en.wikipedia.org/wiki/Special:Random";

    }
);



// =====================================================
// SHORTCUTS
// =====================================================

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


const cancelShortcut =
    document.getElementById(
        "cancelShortcut"
    );


const saveShortcut =
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

catch {

    shortcuts = [];

}


function saveShortcuts() {

    localStorage.setItem(
        "shortcuts",
        JSON.stringify(
            shortcuts
        )
    );

}


function faviconUrl(url) {

    try {

        const hostname =
            new URL(url).hostname;


        return (
            "https://www.google.com/s2/favicons" +
            `?domain=${hostname}&sz=64`
        );

    }

    catch {

        return null;

    }

}


function initials(name) {

    return (
        name
            .trim()
            .charAt(0)
            .toUpperCase()
        || "?"
    );

}


function renderShortcuts() {

    shortcutsContainer.innerHTML =
        "";


    shortcuts.forEach(
        (shortcut, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "shortcut";


            const iconButton =
                document.createElement(
                    "button"
                );


            iconButton.type =
                "button";


            iconButton.className =
                "shortcut-icon";


            iconButton.textContent =
                initials(
                    shortcut.name
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


                img.src =
                    icon;


                img.alt =
                    "";


                img.onload =
                    () => {

                        iconButton.textContent =
                            "";

                        iconButton.appendChild(
                            img
                        );

                    };

            }


            iconButton.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    event.stopPropagation();


                    window.location.href =
                        shortcut.url;

                }
            );


            const removeButton =
                document.createElement(
                    "button"
                );


            removeButton.type =
                "button";


            removeButton.className =
                "shortcut-remove";


            removeButton.textContent =
                "×";


            removeButton.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    event.stopPropagation();


                    shortcuts.splice(
                        index,
                        1
                    );


                    saveShortcuts();

                    renderShortcuts();

                }
            );


            const label =
                document.createElement(
                    "span"
                );


            label.className =
                "shortcut-label";


            label.textContent =
                shortcut.name;


            item.append(
                iconButton,
                removeButton,
                label
            );


            shortcutsContainer.appendChild(
                item
            );

        }
    );


    // Add shortcut button

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


    addButton.textContent =
        "+";


    addButton.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            event.stopPropagation();

            openShortcutDialog();

        }
    );


    const addLabel =
        document.createElement(
            "span"
        );


    addLabel.className =
        "shortcut-label";


    addLabel.textContent =
        "Add";


    addItem.append(
        addButton,
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
        () => {

            shortcutNameInput.focus();

        },
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

        return (
            "https://" +
            trimmed
        );

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

        name: name,

        url: url

    });


    saveShortcuts();

    renderShortcuts();

    closeShortcutDialog();

}


saveShortcut.addEventListener(
    "click",
    addShortcut
);


cancelShortcut.addEventListener(
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

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            addShortcut();

        }

    }
);



// =====================================================
// ESCAPE
// =====================================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        if (
            shortcutDialog.classList.contains(
                "open"
            )
        ) {

            closeShortcutDialog();

        }

        else if (
            settingsPanel.classList.contains(
                "open"
            )
        ) {

            closeSettingsPanel();

        }

    }
);



// =====================================================
// INITIALIZE
// =====================================================

renderShortcuts();