// Baseline UI — Variable Font Playground Parser
// Rules: /cmd FIRST-TOKEN = hidden setting; REST = visible text
// License: MIT License

(function () {
  'use strict';

  const inputEl  = document.getElementById('vfp-input');
  const outputEl = document.getElementById('vfp-output');
  const renderBtn = document.getElementById('vfp-render');
  const clearBtn  = document.getElementById('vfp-clear');
  const sampleBtn = document.getElementById('vfp-sample');

  // Default state — MONO = 0 (proportional)
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

  // Apply current style to text and append to output
  function renderSpan(text, state, output) {
    if (!text) return;
    const css = buildVariationCSS(state);
    output.push(`<span style="font-family:'${state.font}';font-variation-settings:${css};">${escapeHTML(text)}</span>`);
  }

  // Parse: /cmd → take FIRST token as value (hidden), rest = visible
  function parseAndRender(input) {
    let state = resetState();
    const output = [];

    // Split by commands: capture each /cmd block separately
    const segments = input.split(/(\/\w+(?:\s+[^\s/]+(?:\s+[^\s/]+)*)?)/g);

    for (const seg of segments) {
      if (!seg) continue;

      // Command block found
      const cmdMatch = seg.match(/^\/(\w+)(?:\s+([^\s/]+)(?:\s+(.*))?)?$/s);
      if (cmdMatch) {
        const cmd  = cmdMatch[1].toLowerCase();
        const arg1 = cmdMatch[2] || '';  // FIRST token = value (hidden)
        const rest = cmdMatch[3] || '';  // Everything else = visible text

        switch (cmd) {
          case 'font':
            if (arg1) state.font = arg1 + (rest ? '' : '');
            // For font: multiple words = full font name
            const fontMatch = seg.match(/^\/font\s+(.+?)(?:\s*\n|\s*$)/);
            if (fontMatch) {
              const nameParts = fontMatch[1].split(/\s+/);
              // Font name = ALL consecutive words before newline or next /cmd
              const fullName = nameParts[0];
              // Actually capture multi-word font name properly
              const fullMatch = seg.match(/^\/font\s+([^/]+?)(?:\s*\n|\s+(?=.)|$)/);
              if (fullMatch) {
                const nameAndText = fullMatch[1].trim().split(/\s+(?=[^\s/]+$)/);
                // Re-split: consume until we hit text that doesn't look like font name
                const parts = seg.replace(/^\/font\s+/, '').split(/\s+/);
                let nameEnd = 0;
                const candidateFont = [];
                for (const word of parts) {
                  if (/^[A-Z]/.test(word) || candidateFont.length > 0 && /^(Sans|Code|Pro|Flex|Mono)$/.test(word)) {
                    candidateFont.push(word);
                    nameEnd++;
                  } else break;
                }
                if (candidateFont.length > 0) {
                  state.font = candidateFont.join(' ');
                  const visibleText = parts.slice(nameEnd).join(' ');
                  renderSpan(visibleText, state, output);
                }
              }
            }
            // Font commands handled above — skip default
            continue;

          case 'normal':
            state = resetState();
            // COMPLETELY HIDDEN — no output
            continue;

          // Numeric axes — arg1 = number, rest = visible text
          case 'wght': case 'weight':
            if (arg1) state.wght = parseFloat(arg1);
            renderSpan(rest, state, output);
            continue;
          case 'wdth':
            if (arg1) state.wdth = parseFloat(arg1);
            renderSpan(rest, state, output);
            continue;
          case 'opsz':
            if (arg1) state.opsz = parseFloat(arg1);
            renderSpan(rest, state, output);
            continue;
          case 'slnt':
            if (arg1) state.slnt = parseFloat(arg1);
            renderSpan(rest, state, output);
            continue;
          case 'ital':
            if (arg1) state.ital = parseFloat(arg1);
            renderSpan(rest, state, output);
            continue;
          case 'grad':
            if (arg1) state.GRAD = parseFloat(arg1);
            renderSpan(rest, state, output);
            continue;
          case 'rond':
            if (arg1) state.ROND = parseFloat(arg1);
            renderSpan(rest, state, output);
            continue;
          case 'mono':
            if (arg1) state.MONO = parseFloat(arg1);
            renderSpan(rest, state, output);
            continue;
          case 'hexp':
            if (arg1) state.HEXP = parseFloat(arg1);
            renderSpan(rest, state, output);
            continue;
        }
      }

      // Plain text — render as-is
      renderSpan(seg, state, output);
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
