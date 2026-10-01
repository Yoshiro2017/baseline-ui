// Baseline UI — Variable Font Playground Parser
// ✅ Rules: /cmd FIRST-TOKEN = hidden setting; ALL REMAINDER = visible text
// ✅ /font = consumes ALL consecutive words as name; rest = visible
// ✅ /normal = hidden, no output
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
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(>/g,'&gt;');
  }

  function span(text, state) {
    if (!text.trim()) return '';
    return `<span style="font-family:'${state.font}';font-variation-settings:${buildVariationCSS(state)};">${escapeHTML(text)}</span>`;
  }

  function parseAndRender(input) {
    let state = resetState();
    const out = [];

    // Split into: plain text | /command blocks
    const parts = input.split(/(\/\w+(?:\s+[^/]*)?)/g);

    for (const part of parts) {
      if (!part) continue;

      // Is this a command block?
      const cmd = part.match(/^\/(\w+)(?:\s+(.*))?$/s);
      if (!cmd) {
        // Plain text → render directly
        out.push(span(part, state));
        continue;
      }

      const name = cmd[1].toLowerCase();
      const args = (cmd[2] || '').trim();

      // Special: /font → consume ALL consecutive words as font name
      if (name === 'font') {
        if (!args) continue;
        const words = args.split(/\s+/);
        let fontName = '';
        let visibleStart = 0;

        // Consume words until we hit something that looks like content
        for (let i = 0; i < words.length; i++) {
          const w = words[i];
          // Font name pattern: capitalized words or known fragments
          if (/^[A-Z][a-z]+$/.test(w) || /^(Sans|Code|Flex|Pro|Mono|Lexend|Roboto|Google)$/.test(w) || !visibleStart) {
            fontName += (fontName ? ' ' : '') + w;
            visibleStart = i + 1;
          } else {
            break;
          }
        }

        if (fontName) state.font = fontName;
        const rest = words.slice(visibleStart).join(' ');
        out.push(span(rest, state));
        continue;
      }

      // Special: /normal → hidden, no output
      if (name === 'normal') {
        state = resetState();
        continue;
      }

      // Numeric axes: FIRST token = value, REST = visible text
      const tokens = args.match(/^(\S+)(?:\s+(.*))?$/s);
      if (!tokens) continue;

      const valStr = tokens[1];
      const restText = tokens[2] || '';

      // Apply value if numeric
      const num = parseFloat(valStr);
      if (!isNaN(num)) {
        switch (name) {
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

      // Everything after first token = visible text
      out.push(span(restText, state));
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
