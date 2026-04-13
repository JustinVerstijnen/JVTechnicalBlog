document.addEventListener("DOMContentLoaded", () => {
  const blocks = document.querySelectorAll(".ps-about");

  blocks.forEach((block) => {
    const output = block.querySelector(".ps-output");
    const cursor = block.querySelector(".ps-cursor");
    const terminal = block.querySelector(".ps-terminal-wrapper");
    const content = block.querySelector(".ps-about-content");

    if (!output || !terminal || !content) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lines = parseLines(block.dataset.psLines);

    if (!lines.length) {
      revealContent(terminal, content, cursor, 0);
      return;
    }

    if (prefersReducedMotion) {
      renderAllAtOnce(output, lines);
      revealContent(terminal, content, cursor, 150);
      return;
    }

    typeLines(output, lines, () => revealContent(terminal, content, cursor, 1400));
  });
});

function parseLines(value) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Unable to parse PowerShell about lines", error);
    return [];
  }
}

function renderAllAtOnce(output, lines) {
  output.innerHTML = lines.map((line) => formatLine(line)).join("\n");
}

function typeLines(output, lines, onComplete) {
  let lineIndex = 0;
  let charIndex = 0;
  let currentLine = "";

  const step = () => {
    if (lineIndex >= lines.length) {
      onComplete();
      return;
    }

    const line = lines[lineIndex];

    if (charIndex < line.length) {
      currentLine += escapeHtml(line.charAt(charIndex));
      output.innerHTML = buildFrame(lines, lineIndex, currentLine);
      charIndex += 1;
      window.setTimeout(step, typingDelay(line.charAt(charIndex - 1)));
      return;
    }

    output.innerHTML = buildFrame(lines, lineIndex + 1, "");
    lineIndex += 1;
    charIndex = 0;
    currentLine = "";
    window.setTimeout(step, pauseDelay(line));
  };

  step();
}

function buildFrame(lines, completedCount, activeLine) {
  const completed = lines.slice(0, completedCount).map((line) => formatLine(line));

  if (activeLine) {
    completed.push(formatLine(activeLine, true));
  }

  return completed.join("\n");
}

function formatLine(line, partial = false) {
  if (!line) {
    return "";
  }

  const safeLine = partial ? line : escapeHtml(line);

  if (safeLine.startsWith("PS ")) {
    const firstSpaceAfterPrompt = safeLine.indexOf("> ");

    if (firstSpaceAfterPrompt !== -1) {
      const prompt = safeLine.slice(0, firstSpaceAfterPrompt + 1);
      const command = safeLine.slice(firstSpaceAfterPrompt + 2);
      return `<span class="ps-prompt">${prompt}&gt;</span> <span class="ps-command">${command}</span>`;
    }
  }

  if (/done\.?$/i.test(line)) {
    return `<span class="ps-success">${safeLine}</span>`;
  }

  if (/^copyright/i.test(line) || /^powershell/i.test(line)) {
    return `<span class="ps-muted">${safeLine}</span>`;
  }

  return `<span class="ps-info">${safeLine}</span>`;
}

function revealContent(terminal, content, cursor, delay) {
  window.setTimeout(() => {
    if (cursor) {
      cursor.style.display = "none";
    }

    terminal.classList.add("is-complete");
    content.classList.remove("about-hidden");
    content.classList.add("about-visible");
  }, delay);
}

function typingDelay(character) {
  if ([".", ",", ":"].includes(character)) {
    return 90;
  }

  if (character === " ") {
    return 18;
  }

  return 34;
}

function pauseDelay(line) {
  if (!line) {
    return 180;
  }

  if (/done\.?$/i.test(line)) {
    return 400;
  }

  if (line.startsWith("PS ")) {
    return 300;
  }

  return 170;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
