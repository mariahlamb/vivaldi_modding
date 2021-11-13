// Theme Interface plus
// version 2021.11.0
// https://forum.vivaldi.net/topic/68564/theme-interface-plus
// Adds functionality to toggle system themes and sort and move user themes to
// Vivaldi’s settings page.

(function () {
  let toggle = (action) => {
    const check = document.querySelector(".ThemePreview:first-of-type");
    if (action === "off" || check.style.display === "inline-flex") {
      disp = "none";
    } else {
      disp = "inline-flex";
    }
    const themes = document.querySelectorAll(".ThemePreview");
    for (let i = 0; i < systemNumber; i++) {
      themes[i].style.display = disp;
    }
  };

  let sort = () => {
    vivaldi.prefs.get("vivaldi.themes.user", (collection) => {
      collection.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
      vivaldi.prefs.set({ path: "vivaldi.themes.user", value: collection });
    });
  };

  let moveL = (dir) => {
    vivaldi.prefs.get("vivaldi.themes.current", (current) => {
      vivaldi.prefs.get("vivaldi.themes.user", (collection) => {
        let index = collection.findIndex((x) => x.id === current);
        if (index !== -1 && dir === "right" && index < collection.length - 1) {
          let fromI = collection[index];
          let toI = collection[index + 1];
          collection[index + 1] = fromI;
          collection[index] = toI;
        } else if (index !== -1 && dir !== "right" && index > 0) {
          let fromI = collection[index];
          let toI = collection[index - 1];
          collection[index - 1] = fromI;
          collection[index] = toI;
        } else return;
        vivaldi.prefs.set({ path: "vivaldi.themes.user", value: collection });
      });
    });
  };

  let moveR = () => moveL("right");

  let goUI = {
    buttons: [
      // text, title, function (translate strings)
      ["Toggle", "Toggle System Themes", toggle],
      ["Sort", "Sort Themes Alphabetically", sort],
      ["◂", "Move Theme Left", moveL],
      ["▸", "Move Theme Right", moveR],
    ],
    init: () => {
      if (systemDefault === 0) toggle("off");
      const footer = document.querySelector(".TabbedView-Footer");
      const link = document.querySelector(".TabbedView-Footer a");
      const check = document.querySelector(".ThemePreviews");
      if (!check.classList.contains("tipbtn")) {
        check.classList.add("tipbtn");
        goUI.buttons.forEach((button) => {
          let b = document.createElement("div");
          b.classList.add("button-toolbar");
          b.innerHTML = `<button title="${button[1]}" type="button" class="ToolbarButton-Button button-textonly"><span class="button-title">${button[0]}</span></button>`;
          footer.insertBefore(b, link);
          b.addEventListener("click", button[2]);
        });
        document
          .querySelector(".TabbedView-List button:first-of-type")
          .addEventListener("click", function () {
            setTimeout(goUI.init, 100);
          });
      }
    },
  };

  const systemDefault = 0; // set to »1« to display system themes by default
  const systemNumber = 10; // toggle all system themes (adjust amount should Vivaldi make changes)
  const settingsUrl =
    "chrome-extension://mpognobbkildjkofajifpdfhcoklimli/components/settings/settings.html?path=";
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.url === `${settingsUrl}themes`) {
      setTimeout(goUI.init, 100);
    }
  });
})();
