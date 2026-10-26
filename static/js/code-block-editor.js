/*
 * Inline editing for Hugo / Docsy code blocks.
 * Edits live only in the current page: refreshing restores the article's code.
 */
(function () {
  'use strict';

  const BLOCK_SELECTOR = '.td-content .highlight';
  const COPY_SELECTOR = 'button.td-click-to-copy';
  const states = new WeakMap();

  /** Copy text, including when the modern Clipboard API is unavailable. */
  async function copyText(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (_) {
        // Some browsers deny Clipboard API access; try the legacy fallback.
      }
    }

    const temporary = document.createElement('textarea');
    const previousFocus = document.activeElement;
    temporary.value = text;
    temporary.readOnly = true;
    temporary.setAttribute('aria-hidden', 'true');
    temporary.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
    document.body.appendChild(temporary);
    temporary.select();

    let copied = false;
    try {
      copied = document.execCommand('copy');
    } finally {
      temporary.remove();
      if (previousFocus && typeof previousFocus.focus === 'function') {
        previousFocus.focus({ preventScroll: true });
      }
    }
    if (!copied) {
      throw new Error('Copy command was rejected by the browser');
    }
  }

  /** Briefly show copy feedback, without changing Docsy's button markup. */
  function showCopyStatus(button, success) {
    button.classList.remove('jv-code-copy-success', 'jv-code-copy-error');
    // Force the button back to its normal state between consecutive clicks.
    void button.offsetWidth;
    button.classList.add(success ? 'jv-code-copy-success' : 'jv-code-copy-error');
    button.setAttribute('aria-label', success ? 'Copied code' : 'Could not copy code');

    window.clearTimeout(button._jvCopyTimeout);
    button._jvCopyTimeout = window.setTimeout(function () {
      button.classList.remove('jv-code-copy-success', 'jv-code-copy-error');
      button.setAttribute('aria-label', 'Copy code');
    }, 1800);
  }

  function findSource(highlight) {
    // With Hugo line numbers, use the code column rather than the numbers.
    const lineNumberCode = highlight.querySelector('.lntable .lntd:last-child pre code');
    if (lineNumberCode) return lineNumberCode;
    return highlight.querySelector('pre code');
  }

  function setupBlock(highlight) {
    if (states.has(highlight)) return;

    const code = findSource(highlight);
    const pre = code && code.closest('pre');
    if (!pre) return;

    const original = code.textContent;
    const originalMarkup = code.innerHTML;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'jv-code-edit-button';
    button.textContent = 'Edit';
    button.setAttribute('aria-label', 'Edit code');
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('title', 'Edit this code before copying');

    const state = { code, pre, button, original, originalMarkup, value: original, textarea: null };
    states.set(highlight, state);
    pre.appendChild(button);

    function closeEditor() {
      if (!state.textarea) return;
      state.value = state.textarea.value;
      state.textarea.remove();
      state.textarea = null;
      pre.classList.remove('jv-code-is-editing');

      // Restore the original highlighting if the user reverts their edits.
      if (state.value === state.original) {
        code.innerHTML = state.originalMarkup;
      } else {
        // textContent displays arbitrary commands safely (never parse as HTML).
        code.textContent = state.value;
      }

      button.textContent = 'Edit';
      button.setAttribute('aria-label', 'Edit code');
      button.setAttribute('aria-pressed', 'false');
    }

    function openEditor() {
      const originalHeight = pre.getBoundingClientRect().height;
      const textarea = document.createElement('textarea');
      textarea.className = 'jv-code-edit-textarea';
      textarea.value = state.value;
      textarea.spellcheck = false;
      textarea.wrap = 'off';
      textarea.setAttribute('aria-label', 'Editable code snippet');
      textarea.setAttribute('autocomplete', 'off');
      textarea.setAttribute('autocapitalize', 'off');
      textarea.setAttribute('autocorrect', 'off');
      // Keep short snippets compact and large scripts scrollable.
      textarea.style.height = Math.max(112, Math.min(Math.round(originalHeight), 560)) + 'px';
      pre.appendChild(textarea);
      state.textarea = textarea;
      pre.classList.add('jv-code-is-editing');

      button.textContent = 'Done';
      button.setAttribute('aria-label', 'Finish editing code');
      button.setAttribute('aria-pressed', 'true');
      textarea.focus({ preventScroll: true });
    }

    button.addEventListener('click', function () {
      if (state.textarea) {
        closeEditor();
      } else {
        openEditor();
      }
    });
  }

  function init() {
    document.querySelectorAll(BLOCK_SELECTOR).forEach(setupBlock);

    // Capture Copy before Docsy's handler so it always uses the current text,
    // including edits that haven't been closed with Done yet.
    document.addEventListener('click', function (event) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const copyButton = target.closest(COPY_SELECTOR);
      if (!copyButton) return;

      const highlight = copyButton.closest(BLOCK_SELECTOR);
      const state = highlight && states.get(highlight);
      if (!state) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const currentText = state.textarea ? state.textarea.value : state.value;
      copyText(currentText).then(
        function () { showCopyStatus(copyButton, true); },
        function (error) {
          console.warn('Could not copy code:', error);
          showCopyStatus(copyButton, false);
        }
      );
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
