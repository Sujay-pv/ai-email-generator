console.log("The content script has loaded");

function findComposeToolbar() {
  const composeDialogs = document.querySelectorAll('[role="toolbar"]');
  console.log(`🧩 Found ${composeDialogs.length} compose dialogs`);

  composeDialogs.forEach((dialog, i) => {
    console.log(`📦 Dialog ${i} structure:`, dialog);
    console.log(
      `🧾 Inner HTML of dialog ${i}:`,
      dialog.innerHTML.slice(0, 1000)
    ); // trimmed for performance
  });

  for (const dialog of composeDialogs) {
    const toolbars = dialog.querySelectorAll('[role="toolbar"]');
    console.log(`🔍 Found ${toolbars.length} toolbars inside a dialog`);

    for (const toolbar of toolbars) {
      const buttons = toolbar.querySelectorAll("div[command]");
      console.log(`🔘 Toolbar has ${buttons.length} command buttons`);
      if (buttons.length > 0) {
        console.log("✅ Returning toolbar");
        return toolbar;
      }
    }
  }

  console.warn("❌ No valid toolbar found in any dialog");
  return null;
}

function getEmailContent() {
  const selectors = [
    ".h7",
    ".a3s.aiL",
    '[role="presentation"]',
    ".gmail_quote",
  ];
  for (const selector of selectors) {
    const content = document.querySelector(selector);
    if (content) {
      const text = content.innerText?.trim();
      if (text) return text;
    }
  }
  return "";
}

function createAIButton() {
  const wrapper = document.createElement("div");
  wrapper.className = "ai-reply-wrapper";
  wrapper.setAttribute("data-selected-tone", "professional");

  // Main button for generation
  const mainButton = document.createElement("div");
  mainButton.className = "ai-reply-button";
  mainButton.textContent = "AI Reply";
  mainButton.setAttribute("role", "button");
  mainButton.setAttribute("data-tooltip", "Generate AI Reply");

  // Small dropdown toggle
  const arrowButton = document.createElement("div");
  arrowButton.className = "ai-reply-dropdown-toggle";
  arrowButton.innerHTML = `
  <svg class="ai-dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 10l5 5 5-5H7z"/>
  </svg>
`; // dropdown icon svg
  arrowButton.setAttribute("title", "Select tone");

  // Dropdown menu
  const dropdown = document.createElement("div");
  dropdown.className = "ai-dropdown";

  const tones = ["Professional", "Casual", "Friendly", "Concise"];
  tones.forEach((tone) => {
    const option = document.createElement("div");
    option.className = "ai-dropdown-option";
    option.textContent = tone;
    option.addEventListener("click", () => {
      wrapper.setAttribute("data-selected-tone", tone.toLowerCase());
      dropdown.style.display = "none";
      mainButton.textContent = `AI Reply (${tone})`;
    });
    dropdown.appendChild(option);
  });

  // Toggle dropdown on arrow click
  arrowButton.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent closing from body listener
    dropdown.style.display =
      dropdown.style.display === "none" ? "block" : "none";
  });

  document.body.addEventListener(
    "click",
    (e) => {
      const isInsideDropdown = wrapper.contains(e.target);
      if (!isInsideDropdown) {
        dropdown.style.display = "none";
      }
    },
    true
  );

  // Group button + arrow together
  const buttonGroup = document.createElement("div");
  buttonGroup.className = "ai-button-group";
  buttonGroup.appendChild(mainButton);
  buttonGroup.appendChild(arrowButton);

  wrapper.appendChild(buttonGroup);
  wrapper.appendChild(dropdown);
  return wrapper;
}

function injectButton() {
  const existingButton = document.querySelector(".ai-reply-wrapper");
  if (existingButton) existingButton.remove();

  const toolbar = findComposeToolbar();
  if (!toolbar) {
    console.log("Toolbar not found, retrying...");
    setTimeout(injectButton, 300); // retry after 300ms
    return;
  }

  console.log("Creating AI Button");

  const wrapper = createAIButton(); // wrapper includes the button and dropdown
  const button = wrapper.querySelector(".ai-reply-button"); // actual button inside wrapper

  button.addEventListener("click", async () => {
    // Prevent dropdown toggle click from triggering generate logic
    if (button.getAttribute("data-skip-next-click") === "true") {
      button.removeAttribute("data-skip-next-click");
      return;
    }

    try {
      button.innerHTML = " Generating...";
      button.disabled = true;

      const emailContent = getEmailContent();
      const tone = wrapper.getAttribute("data-selected-tone") || "professional";

      const response = await fetch("http://localhost:8080/api/email/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailContent: emailContent,
          tone: tone,
        }),
      });

      if (!response.ok) {
        throw new Error("API Request failed");
      }

      const generatedReply = await response.text();
      const composeBox = document.querySelector(
        '[role = "textbox"][g_editable = "true"]'
      );
      if (composeBox) {
        composeBox.focus();
        document.execCommand("insertText", false, generatedReply);
      } else {
        console.error("Compose box was not found");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate the reply");
    } finally {
      button.innerHTML = "AI Reply ▼";
      button.disabled = false;
    }
  });

  toolbar.insertBefore(wrapper, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);
    const hasComposeElements = addedNodes.some(
      (node) =>
        node.nodeType === node.ELEMENT_NODE &&
        (node.matches('.aDh, .btC, [role ="dialog"]') ||
          node.querySelector('.aDh, .btC, [role ="dialog"]'))
    );
    if (hasComposeElements) {
      console.log("Compose window detected");
      setTimeout(injectButton, 500);
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
