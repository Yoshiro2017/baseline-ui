// Baseline UI — Variable Font Playground Parser & Renderer
// Applies only to vfp.html
// License: MIT License

(function () {
  'use strict';

  // DOM element references
  const inputEl  = document.getElementById('vfp-input');
  const outputEl = document.getElementById('vfp-output');
  const renderBtn = document.getElementById('vfp-render');
  const clearBtn  = document.getElementById('vfp-clear');
  const sampleBtn = document.getElementById('vfp-sample');

  // Default style state — resets on /normal
  const defaultState = {
    font: 'Google Sans Flex',
    wght: 400,
    wdth: 100,
    opsz:  16,
    slnt:   0,
    ital:   0,
    GRAD:   0,
    ROND:   0,
    MONO:   1
  };

  // Example text loaded when "Load Example" is clicked
  const sampleText = `/font Google Sans Flex
/wght 700 Welcome to the /wght 500 Variable Font Playground /normal

Here you can experiment with variable axes.

/font Google Sans Code
/MONO 1 This is fixed-width code style. /MONO 0 This is proportional. /normal

/font Readex Pro
/HEXP 0 Compact · /HEXP 60 Expanded · /HEXP 100 Widest /normal

/font Lexend
/wght 200 Light weight text
/wght 900 Extra bold text
/normal

/font Google Sans
/slnt -10 Slanted text returns upright /slnt 0
/normal

/font Roboto
/ital 1 Italic style · /ital 0 Roman style
/normal`;

  // Clone default state so we can reset it cleanly
  function resetState() {
    return Object.assign({}, defaultState);
  }

  // Build CSS font-variation-settings string
  function buildVariationCSS(state) {
    const parts = [];
    if (state.wght !== undefined) parts.push(`"wght" ${state.wght}`);
    if (state.wdth !== undefined) parts.push(`"wdth" ${state.wdth}`);
    if (state.opsz !== undefined) parts.push(`"opsz" ${state.opsz}`);
    if (state.slnt !== undefined) parts.push(`"slnt" ${state.slnt}`);
    if (state.ital !== undefined) parts.push(`"ital" ${state.ital}`);
    if (state.GRAD !== undefined) parts.push(`"GRAD" ${state.GRAD}`);
    if (state.ROND !== undefined) parts.push(`"ROND" ${state.ROND}`);
    if (state.MONO !== undefined) parts.push(`"MONO" ${state.MONO}`);
    if (state.HEXP !== undefined) parts.push(`"HEXP" ${state.HEXP}`);
    return parts.join(', ');
  }

  // Parse input text → HTML with styled spans
  function parseAndRender(input) {
    let state = resetState();
    // Split on newlines while preserving line structure
    const lines = input.split('\n');
    const outputFragments = [];

    for (const line of lines) {
      // Split line into tokens: commands and plain text
      const tokens = line.split(/(\/[a-z]+\s+[^\/]*)/g);

      for (const token of tokens) {
        if (!token.trim()) continue;

        // Command pattern: /name value
        const cmdMatch = token.match(/^\/([a-zA-Z]+)\s+(.*)$/);
        if (cmdMatch) {
          const cmd  = cmdMatch[1].toLowerCase();
          const arg  = cmdMatch[2].trim();

          switch (cmd) {
            case 'font':
              state.font = arg;
              break;
            case 'normal':
              state = resetState();
              break;
            case 'wght':
            case 'weight':
              state.wght = parseFloat(arg);
              break;
            case 'wdth':
              state.wdth = parseFloat(arg);
              break;
            case 'opsz':
              state.opsz = parseFloat(arg);
              break;
            case 'slnt':
              state.slnt = parseFloat(arg);
              break;
            case 'ital':
              state.ital = parseFloat(arg);
              break;
            case 'grad':
              state.GRAD = parseFloat(arg);
              break;
            case 'rond':
              state.ROND = parseFloat(arg);
              break;
            case 'mono':
              state.MONO = parseFloat(arg);
              break;
            case 'hexp':
              state.HEXP = parseFloat(arg);
              break;
          }
        } else {
          // Plain text — wrap in styled span
          const css = buildVariationCSS(state);
          const span = `<span style="font-family: '${state.font}', var(--font-sans); font-variation-settings: ${css};">${escapeHTML(token)}</span>`;
          outputFragments.push(span);
        }
      }
      // Preserve line breaks
      outputFragments.push('<br>');
    }

    outputEl.innerHTML = outputFragments.join('');
  }

  // Escape HTML special characters to prevent injection
  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Event handlers
  function renderPreview() {
    parseAndRender(inputEl.value);
  }

  function clearAll() {
    inputEl.value = '';
    outputEl.innerHTML = 'Type something and click Update Preview';
  }

  function loadSample() {
    inputEl.value = sampleText;
    renderPreview();
  }

  // Attach listeners only if elements exist (vfp.html only)
  if (renderBtn && inputEl && outputEl) {
    renderBtn.addEventListener('click', renderPreview);
    clearBtn.addEventListener('click', clearAll);
    sampleBtn.addEventListener('click', loadSample);

    // Auto-render on initial load
    parseAndRender('Type text above or click Load Example to begin.');
  }
})();
