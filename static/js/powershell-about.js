document.addEventListener("DOMContentLoaded", () => {
  const blocks = document.querySelectorAll("[data-powershell-about]");

  blocks.forEach((block) => {
    const output = block.querySelector("[data-ps-output]");
    const content = block.querySelector("[data-about-content]");
    const terminal = block.querySelector("[data-terminal-wrapper]");
    const cursor = block.querySelector("[data-ps-cursor]");
    const source = block.querySelector("[data-ps-source]");

    if (!output || !content || !terminal || !source) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const text = source.value.replace(/\r\n/g, "\n").trim();

    if (!text) {
      content.classList.remove("about-hidden");
      terminal.classList.add("is-hidden");
      return;
    }

    if (reducedMotion) {
      output.textContent = text;
      content.classList.remove("about-hidden");
      terminal.classList.add("is-hidden");
      return;
    }

    let index = 0;
    const typingSpeed = 4;
    const finishDelay = 450;

    const typeNextCharacter = () => {
      if (index >= text.length) {
        window.setTimeout(() => {
          content.classList.remove("about-hidden");
          terminal.classList.add("is-hidden");

          window.setTimeout(() => {
            if (cursor) {
              cursor.style.display = "none";
            }
          }, 360);
        }, finishDelay);
        return;
      }

      output.textContent += text.charAt(index);
      index += 1;
      window.setTimeout(typeNextCharacter, typingSpeed);
    };

    typeNextCharacter();
  });
});
