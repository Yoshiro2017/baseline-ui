// Baseline UI — Variable Font Playground Parser & Renderer
// Default MONO set to 0; /normal fully hidden; text visibility fixed
// License: MIT License

(function () {
  'use strict';

  const inputEl  = document.getElementById('vfp-input');
  const outputEl = document.getElementById('vfp-output');
  const renderBtn = document.getElementById('vfp-render');
  const clearBtn  = document.getElementById('vfp-clear');
  const sampleBtn = document.getElementById('vfp-sample');

  // Default state — MONO = 0 (proportional by default)
  const defaultState = {
    font: 'Google Sans Flex',
    wght: 400,
    wdth: 100,
    opsz:  16,
    slnt:   0,
    ital:   0,
    GRAD:   0,
    ROND:   0,
    MONO:   0,
    HEXP:   0
  };

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

  function resetState() {
    return Object.assign({}, defaultState);
  }

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

  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function parseAndRender(input) {
    let state = resetState();
    const output = [];

    const tokens = input.split(/(\/\w+(?:\s+[^/]*)?)/g);

    for (const token of tokens) {
      if (!token) continue;

      const cmdMatch = token.match(/^\/(\w+)(?:\s+(.*))?$/s);
      if (cmdMatch) {
        const cmd = cmdMatch[1].toLowerCase();
        const arg = cmdMatch[2] || '';

        switch (cmd) {
          case 'font':
            if (arg.trim()) state.font = arg.trim();
            break;
          case 'normal':
            state = resetState();
            // Hidden — no output
            continue;
          case 'wght': case 'weight':
            if (arg) state.wght = parseFloat(arg);
            break;
          case 'wdth':
            if (arg) state.wdth = parseFloat(arg);
            break;
          case 'opsz':
            if (arg) state.opsz = parseFloat(arg);
            break;
          case 'slnt':
            if (arg) state.slnt = parseFloat(arg);
            break;
          case 'ital':
            if (arg) state.ital = parseFloat(arg);
            break;
          case 'grad':
            if (arg) state.GRAD = parseFloat(arg);
            break;
          case 'rond':
            if (arg) state.ROND = parseFloat(arg);
            break;
          case 'mono':
            if (arg) state.MONO = parseFloat(arg);
            break;
          case 'hexp':
            if (arg) state.HEXP = parseFloat(arg);
            break;
        }
        if (arg.trim()) {
          const css = buildVariationCSS(state);
          output.push(`<span style="font-family:'${state.font}';font-variation-settings:${css};">${escapeHTML(arg)}</span>`);
        }
        continue;
      }

      const css = buildVariationCSS(state);
      output.push(`<span style="font-family:'${state.font}';font-variation-settings:${css};">${escapeHTML(token)}</span>`);
    }

    outputEl.innerHTML = output.join('').replace(/\n/g, '<br>');
  }

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

  if (renderBtn && inputEl && outputEl) {
    renderBtn.addEventListener('click', renderPreview);
    clearBtn.addEventListener('click', clearAll);
    sampleBtn.addEventListener('click', loadSample);
    parseAndRender('Type text above or click Load Example to begin.');
  }
})();
