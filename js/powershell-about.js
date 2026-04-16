document.addEventListener("DOMContentLoaded", () => {
  const updateNavbarOffset = () => {
    const navbar = document.querySelector(".td-navbar");

    if (!navbar) {
      return;
    }

    const navbarHeight = Math.ceil(navbar.getBoundingClientRect().height || navbar.offsetHeight || 64);
    document.documentElement.style.setProperty("--site-navbar-offset", `${navbarHeight}px`);
  };

  updateNavbarOffset();
  window.addEventListener("resize", updateNavbarOffset, { passive: true });
  window.addEventListener("orientationchange", updateNavbarOffset, { passive: true });

  const blocks = document.querySelectorAll(".ps-about");

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

    content.classList.add("about-hidden");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const outputLines = [
      "Loading Justin's information...",
      "12,7% completed...",
      "Formatting table...",
      "42% completed...",
      "$certifications | Format-Table",
      "67% completed...Done",
      "Rendering webpage..."
    ];

    const showContent = () => {
      content.classList.remove("about-hidden");
    };

    if (prefersReducedMotion) {
      command.textContent = scriptName;
      output.textContent = `\n${outputLines.join("\n")}`;
      cursor.style.display = "none";
      terminal.classList.add("is-hidden");
      showContent();
      return;
    }

    let commandIndex = 0;
    let lineIndex = 0;
    let charIndex = 0;

    function finishSequence() {
      cursor.style.display = "none";

      setTimeout(() => {
        terminal.classList.add("is-hidden");
      }, 220);

      setTimeout(() => {
        showContent();
      }, 620);
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
