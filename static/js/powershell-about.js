document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".td-navbar");

  function syncAboutNavbarOffset() {
    if (!navbar) {
      return;
    }

    const navbarHeight = Math.ceil(navbar.getBoundingClientRect().height || navbar.offsetHeight || 0);
    document.body.classList.add("has-ps-about-page");
    document.body.style.setProperty("--ps-about-navbar-offset", `${navbarHeight}px`);
  }

  function measureHiddenContentHeight(block, content) {
    const previous = {
      hidden: content.hidden,
      display: content.style.display,
      position: content.style.position,
      visibility: content.style.visibility,
      pointerEvents: content.style.pointerEvents,
      left: content.style.left,
      top: content.style.top,
      width: content.style.width,
    };

    content.hidden = false;
    content.setAttribute("aria-hidden", "true");
    content.style.display = "block";
    content.style.position = "absolute";
    content.style.visibility = "hidden";
    content.style.pointerEvents = "none";
    content.style.left = "0";
    content.style.top = "0";
    content.style.width = `${block.clientWidth || block.offsetWidth || 0}px`;

    const measuredHeight = Math.ceil(content.offsetHeight || content.scrollHeight || 0);

    content.hidden = previous.hidden;
    content.style.display = previous.display;
    content.style.position = previous.position;
    content.style.visibility = previous.visibility;
    content.style.pointerEvents = previous.pointerEvents;
    content.style.left = previous.left;
    content.style.top = previous.top;
    content.style.width = previous.width;

    return measuredHeight;
  }

  syncAboutNavbarOffset();
  window.addEventListener("resize", syncAboutNavbarOffset, { passive: true });
  window.addEventListener("load", syncAboutNavbarOffset, { passive: true });

  const blocks = document.querySelectorAll(".ps-about");

  if (blocks.length > 0) {
    document.body.classList.add("ps-about-intro-active");
  }

  let pendingBlocks = blocks.length;

  const releaseIntroState = () => {
    pendingBlocks = Math.max(0, pendingBlocks - 1);

    if (pendingBlocks === 0) {
      document.body.classList.remove("ps-about-intro-active");
    }
  };

  blocks.forEach((block) => {
    const terminal = block.querySelector(".ps-terminal-wrapper");
    const command = block.querySelector(".ps-command");
    const output = block.querySelector(".ps-output");
    const cursor = block.querySelector(".ps-cursor");
    const content = block.querySelector(".ps-markdown");
    const scriptName = block.dataset.command || ".\\about-justin-verstijnen.ps1";

    if (!terminal || !command || !output || !cursor || !content) {
      return;
    }

    content.hidden = true;
    content.setAttribute("aria-hidden", "true");
    content.classList.add("about-hidden");

    const measuredContentHeight = measureHiddenContentHeight(block, content);
    const terminalHeight = Math.ceil(terminal.offsetHeight || terminal.scrollHeight || 0);
    const reservedHeight = Math.max(terminalHeight, measuredContentHeight);

    if (reservedHeight > 0) {
      block.style.minHeight = `${reservedHeight}px`;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const outputLines = [
      "$hobbies | Format-List",
      "12,7% completed...",
      "$profiles | Format-List",
      "42% completed...",
      "$certifications | Format-Table",
      "67% completed...",
      "Script executed succesfully!"
    ];

    const releaseReservedHeight = () => {
      window.requestAnimationFrame(() => {
        block.style.minHeight = "";
      });
    };

    const showContent = () => {
      content.hidden = false;
      content.removeAttribute("aria-hidden");
      content.classList.remove("about-hidden");
    };

    if (prefersReducedMotion) {
      command.textContent = scriptName;
      output.textContent = `\n${outputLines.join("\n")}`;
      cursor.style.display = "none";
      showContent();
      terminal.classList.add("is-hidden");
      setTimeout(() => {
        releaseReservedHeight();
        releaseIntroState();
      }, 50);
      return;
    }

    let commandIndex = 0;
    let lineIndex = 0;
    let charIndex = 0;

    function finishSequence() {
      cursor.style.display = "none";
      showContent();

      window.requestAnimationFrame(() => {
        terminal.classList.add("is-hidden");
      });

      setTimeout(() => {
        releaseReservedHeight();
        releaseIntroState();
      }, 450);
    }

    function typeOutput() {
      if (lineIndex >= outputLines.length) {
        finishSequence();
        return;
      }

      const currentLine = outputLines[lineIndex];

      if (charIndex === 0) {
        output.appendChild(document.createTextNode("\n"));
      }

      if (charIndex < currentLine.length) {
        output.appendChild(document.createTextNode(currentLine.charAt(charIndex)));
        charIndex += 1;
        setTimeout(typeOutput, 9);
        return;
      }

      lineIndex += 1;
      charIndex = 0;
      setTimeout(typeOutput, lineIndex === outputLines.length ? 150 : 70);
    }

    function typeCommand() {
      if (commandIndex < scriptName.length) {
        command.textContent += scriptName.charAt(commandIndex);
        commandIndex += 1;
        setTimeout(typeCommand, 16);
        return;
      }

      setTimeout(typeOutput, 110);
    }

    typeCommand();
  });
});
