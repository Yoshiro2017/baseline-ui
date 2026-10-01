// Baseline UI — Variable Font Playground Parser
// ✅ /font [FONT NAME] → name hidden, rest visible
// ✅ Numeric axes: /cmd [NUMBER] → number hidden, rest visible
// ✅ /normal → fully hidden, no output
// ✅ MONO = 0 by default
// License: MIT License

(function () {
  'use strict';

  const inputEl  = document.getElementById('vfp-input');
  const outputEl = document.getElementById('vfp-output');
  const renderBtn = document.getElementById('vfp-render');
  const clearBtn  = document.getElementById('vfp-clear');
  const sampleBtn = document.getElementById('vfp-sample');

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

  function resetState() { return Object.assign({}, defaultState); }

  function buildVariationCSS(state) {
    const p = [];
    if (state.wght !== undefined) p.push(`"wght" ${state.wght}`);
    if (state.wdth !== undefined) p.push(`"wdth" ${state.wdth}`);
    if (state.opsz !== undefined) p.push(`"opsz" ${state.opsz}`);
    if (state.slnt !== undefined) p.push(`"slnt" ${state.slnt}`);
    if (state.ital !== undefined) p.push(`"ital" ${state.ital}`);
    if (state.GRAD !== undefined) p.push(`"GRAD" ${state.GRAD}`);
    if (state.ROND !== undefined) p.push(`"ROND" ${state.ROND}`);
    if (state.MONO !== undefined) p.push(`"MONO" ${state.MONO}`);
    if (state.HEXP !== undefined) p.push(`"HEXP" ${state.HEXP}`);
    return p.join(', ');
  }

  function escapeHTML(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function span(text, state) {
    if (!text.trim()) return '';
    return `<span style="font-family:'${state.font}';font-variation-settings:${buildVariationCSS(state)};">${escapeHTML(text)}</span>`;
  }

  // Known font names — these are the ONLY ones we recognise
  const knownFonts = [
    'Google Sans Flex',
    'Google Sans Code',
    'Google Sans',
    'Readex Pro',
    'Lexend',
    'Roboto'
  ];

  function parseAndRender(input) {
    let state = resetState();
    const out = [];

    // Split into: plain text blocks | /command blocks
    const blocks = input.split(/(\/\w+(?:\s+[^/]*)?)/g);

    for (const block of blocks) {
      if (!block) continue;

      // Not a command → plain text, render directly
      if (!block.startsWith('/')) {
        out.push(span(block, state));
        continue;
      }

      // Parse command
      const cmdMatch = block.match(/^\/(\w+)(?:\s+(.*))?$/s);
      if (!cmdMatch) continue;

      const cmd = cmdMatch[1].toLowerCase();
      const rest = cmdMatch[2] || '';

      // === /font — EXACT match against known names ===
      if (cmd === 'font') {
        if (!rest.trim()) continue;

        // Find which known font name matches the START of rest
        let matchedName = null;
        let remainingText = '';
        for (const name of knownFonts) {
          if (rest.startsWith(name)) {
            matchedName = name;
            remainingText = rest.slice(name.length);
            break;
          }
        }

        // If no known font matched → take first word as fallback
        if (!matchedName) {
          const firstSpace = rest.search(/\s/);
          if (firstSpace === -1) {
            matchedName = rest;
            remainingText = '';
          } else {
            matchedName = rest.slice(0, firstSpace);
            remainingText = rest.slice(firstSpace);
          }
        }

        state.font = matchedName.trim();
        out.push(span(remainingText, state));
        continue;
      }

      // === /normal — completely hidden ===
      if (cmd === 'normal') {
        state = resetState();
        continue;
      }

      // === Numeric axes — first token = value, rest = visible text ===
      const firstSpace = rest.search(/\s/);
      let valueStr = '';
      let visibleText = '';

      if (firstSpace === -1) {
        valueStr = rest;
        visibleText = '';
      } else {
        valueStr = rest.slice(0, firstSpace);
        visibleText = rest.slice(firstSpace + 1);
      }

      const num = parseFloat(valueStr);
      if (!isNaN(num)) {
        switch (cmd) {
          case 'wght': case 'weight': state.wght = num; break;
          case 'wdth': state.wdth = num; break;
          case 'opsz': state.opsz = num; break;
          case 'slnt': state.slnt = num; break;
          case 'ital': state.ital = num; break;
          case 'grad': state.GRAD = num; break;
          case 'rond': state.ROND = num; break;
          case 'mono': state.MONO = num; break;
          case 'hexp': state.HEXP = num; break;
        }
      }

      out.push(span(visibleText, state));
    }

    outputEl.innerHTML = out.join('').replace(/\n/g, '<br>');
  }

  function renderPreview() { parseAndRender(inputEl.value); }
  function clearAll() { inputEl.value = ''; outputEl.innerHTML = 'Type something and click Update Preview'; }
  function loadSample() { inputEl.value = sampleText; renderPreview(); }

  if (renderBtn && inputEl && outputEl) {
    renderBtn.addEventListener('click', renderPreview);
    clearBtn.addEventListener('click', clearAll);
    sampleBtn.addEventListener('click', loadSample);
    parseAndRender('Type text above or click Load Example to begin.');
  }
})();
