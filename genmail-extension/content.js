console.log("The content script has loaded");

function findComposeToolbar() {
  const selectors = [".btC", ".aDh", '[role="toolbar"]', ".gU.Up"];
  for (const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) {
      return toolbar;
    }
  }
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
      return content.innerText.trim();
    }
    return "";
  }
}

function createAIButton() {
  const wrapper = document.createElement("div");
  wrapper.className = "ai-reply-wrapper";
  wrapper.setAttribute("data-selected-tone", "professional");

  const button = document.createElement("div");
  button.className = "ai-reply-button";
  button.innerHTML = "AI Reply ▼";
  button.setAttribute("role", "button");
  button.setAttribute("data-tooltip", "Generate AI Reply");

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
      button.innerHTML = `AI Reply ▼ (${tone})`;
    });
    dropdown.appendChild(option);
  });

  button.addEventListener("click", (e) => {
    dropdown.style.display =
      dropdown.style.display === "none" ? "block" : "none";
    e.stopPropagation();
  });

  document.body.addEventListener("click", () => {
    dropdown.style.display = "none";
  });

  wrapper.appendChild(button);
  wrapper.appendChild(dropdown);
  return wrapper;
}


function injectButton() {
  const existingButton = document.querySelector(".ai-reply-button");
  const tone =
    button.closest(".ai-reply-wrapper")?.getAttribute("data-selected-tone") ||
    "professional";

  if (existingButton) existingButton.remove();

  const toolbar = findComposeToolbar();
  if (!toolbar) {
    console.log("Toolbar not found");
    return;
  }
  console.log("Creating AI Button");
  const button = createAIButton();
  button.classList.add("ai-reply-button");

  button.addEventListener("click", async () => {
    try {
      button.innerHTML = " Generating...";
      button.disabled = true;

      const emailContent = getEmailContent();
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
      button.innerHTML = "AI Reply";
      button.disabled = false;
    }
  });
  toolbar.insertBefore(button, toolbar.firstChild);
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
