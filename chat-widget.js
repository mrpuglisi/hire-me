/* "Ask about my work" assistant.
   Starter questions use Rose's approved answers (no AI call).
   Anything typed goes to /api/chat, which answers only from her knowledge file. */
(function () {
  var EMAIL = 'maryrose.puglisi@gmail.com';
  var STARTERS = [
    { q: 'What AI has Rose shipped?',
      a: "At Zartico, Rose shipped AI into the customer product. The analytics dashboard used layered help: curated explanations of each metric first, then AI-written answers to follow-up questions. Every campaign's wrap report, about 100 a year, combines AI-written analysis with tested, rule-based wording where consistency matters. She also prototyped a Claude-powered upgrade to a paid knowledge-base assistant. Day to day, she runs Claude connected to Jira, Slack, Drive, and the codebase for specs, code audits, and leadership briefs." },
    { q: 'What kind of role is she looking for?',
      a: "A senior or director-level product role, in any industry doing ethical work. She loves platform product work, especially digging into usage data to find the trends that shape a roadmap. She's strongest in data and analytics products, B2B SaaS, and taking new products from zero to market. She's based in St. Petersburg, Florida, has worked remotely for years, and is open to hybrid for the right role." },
    { q: 'How does she lead teams?',
      a: "Rose has set the roadmap and strategy for every product she's owned. At Granicus she directed an offshore engineering team's day-to-day work, interviewed candidates, and onboarded new hires, some of whom went on to promotions. She leads product education across the company so sales, support, and engineering can speak about the product with confidence, and she builds the kind of trust where people raise problems early." },
    { q: 'Has she worked in regulated industries?',
      a: "Yes. At Granicus she was the compliance owner for GovDelivery, a government messaging platform used by 1,000+ government clients, covering FedRAMP, GDPR, and WCAG. When its FedRAMP authorization was at risk, she cut open security vulnerabilities from about 1,800 to about 200 and was asked to mentor other teams on the approach. At Zartico she launched an international attribution pipeline built for U.K. privacy requirements and scoped a model for states with geo-privacy laws." },
    { q: 'How was this site and assistant built?',
      a: "Rose designed and built this site herself with Claude, without a professional coding background. It's plain HTML, CSS, and JavaScript, deployed on Vercel from GitHub. This assistant uses the same layered design she shipped at Zartico: these starter answers are hers, word for word, and anything else goes to Claude, which can only answer from a curated file of facts about her work." }
  ];
  var HOW = "This assistant uses the same layered design Rose shipped at Zartico. The common questions have answers she wrote and approved, so they're accurate every time. Anything else goes to Claude, which can only answer from a curated file of facts about her work. It declines what it can't answer and points you to her email. Your conversation isn't stored.";

  var css = [
    '.aw-launch{position:fixed;right:20px;bottom:20px;z-index:60;display:inline-flex;align-items:center;gap:8px;padding:12px 18px;border-radius:999px;border:0;cursor:pointer;background:var(--accent);color:var(--on-accent,#fff);font:inherit;font-weight:700;font-size:.95rem;box-shadow:0 10px 28px rgba(0,0,0,.18)}',
    '.aw-launch:hover{filter:brightness(1.06)}',
    '.aw-panel{position:fixed;right:20px;bottom:84px;z-index:61;width:min(400px,calc(100vw - 32px));max-height:min(620px,calc(100vh - 110px));display:none;flex-direction:column;background:var(--surface,#fff);color:var(--ink,#111);border:1px solid var(--line,#ddd);border-radius:20px;box-shadow:0 18px 48px rgba(0,0,0,.22);overflow:hidden}',
    '.aw-panel.open{display:flex}',
    '.aw-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding:16px 18px 12px;border-bottom:1px solid var(--line,#ddd)}',
    '.aw-head h2{margin:0;font-size:1.05rem;font-family:inherit;font-style:normal}',
    '.aw-head p{margin:2px 0 0;font-size:.82rem;color:var(--muted,#555)}',
    '.aw-x{border:0;background:transparent;color:var(--muted,#555);font-size:1.4rem;line-height:1;cursor:pointer;padding:2px 6px;border-radius:8px}',
    '.aw-log{flex:1;overflow-y:auto;padding:14px 18px;display:flex;flex-direction:column;gap:10px}',
    '.aw-msg{max-width:88%;padding:10px 13px;border-radius:14px;font-size:.93rem;line-height:1.45;white-space:pre-wrap}',
    '.aw-msg.bot{align-self:flex-start;background:var(--soft,#eee);color:var(--ink,#111)}',
    '.aw-msg.me{align-self:flex-end;background:var(--accent);color:var(--on-accent,#fff)}',
    '.aw-tag{display:block;margin-top:6px;font-size:.72rem;font-weight:700;opacity:.7}',
    '.aw-chips{display:flex;flex-wrap:wrap;gap:6px}',
    '.aw-chip{border:1px solid var(--accent);background:transparent;color:var(--ink,#111);border-radius:999px;padding:6px 11px;font:inherit;font-size:.82rem;cursor:pointer;text-align:left}',
    '.aw-chip:hover{background:var(--soft,#eee)}',
    '.aw-form{display:flex;gap:8px;padding:12px 14px;border-top:1px solid var(--line,#ddd)}',
    '.aw-form input{flex:1;min-width:0;padding:10px 12px;border:1px solid var(--line,#ccc);border-radius:12px;font:inherit;font-size:.93rem;background:var(--surface,#fff);color:var(--ink,#111)}',
    '.aw-form button{border:0;border-radius:12px;padding:0 14px;background:var(--accent);color:var(--on-accent,#fff);font:inherit;font-weight:700;cursor:pointer}',
    '.aw-form button:disabled{opacity:.5;cursor:default}',
    '.aw-foot{display:flex;justify-content:space-between;gap:8px;padding:0 18px 12px;font-size:.78rem;color:var(--muted,#555)}',
    '.aw-foot button{border:0;background:transparent;color:var(--accent);font:inherit;font-weight:700;cursor:pointer;padding:0;text-decoration:underline}',
    '.aw-how{margin:0;padding:10px 12px;border-radius:12px;background:var(--soft,#eee);font-size:.82rem;line-height:1.45}',
    '.aw-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
    '.to-top{bottom:calc(78px + env(safe-area-inset-bottom,0px))!important}',
    '@media (max-width:640px){.aw-launch{right:14px;bottom:14px}.aw-panel{right:8px;left:8px;width:auto;bottom:72px;max-height:calc(100vh - 90px)}}',
    '@media print{.aw-launch,.aw-panel{display:none!important}}'
  ].join('\n');
  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  var launch = document.createElement('button');
  launch.className = 'aw-launch'; launch.type = 'button';
  launch.setAttribute('aria-expanded', 'false'); launch.setAttribute('aria-controls', 'aw-panel');
  launch.innerHTML = '<span aria-hidden="true">💬</span><span>Ask about my work</span>';

  var panel = document.createElement('section');
  panel.className = 'aw-panel'; panel.id = 'aw-panel';
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'false'); panel.setAttribute('aria-labelledby', 'aw-title');
  panel.innerHTML =
    '<div class="aw-head"><div><h2 id="aw-title">Ask about my work</h2><p>Approved answers first, AI for follow-ups.</p></div>' +
    '<button class="aw-x" type="button" aria-label="Close">×</button></div>' +
    '<div class="aw-log" aria-live="polite"><div class="aw-chips" role="group" aria-label="Suggested questions"></div></div>' +
    '<form class="aw-form"><label class="aw-sr" for="aw-input">Ask a question about Rose\'s work</label>' +
    '<input id="aw-input" type="text" maxlength="600" autocomplete="off" placeholder="Ask anything about my work">' +
    '<button type="submit">Send</button></form>' +
    '<div class="aw-foot"><span>Not stored. Answers about Rose only.</span><button type="button" class="aw-how-btn" aria-expanded="false">How this works</button></div>';

  document.body.appendChild(launch); document.body.appendChild(panel);

  var log = panel.querySelector('.aw-log'), chips = panel.querySelector('.aw-chips');
  var form = panel.querySelector('.aw-form'), input = panel.querySelector('#aw-input'), send = form.querySelector('button');
  var howBtn = panel.querySelector('.aw-how-btn'), howBox = null;
  var history = [], busy = false;

  function add(role, text, tag) {
    var d = document.createElement('div'); d.className = 'aw-msg ' + role; d.textContent = text;
    if (tag) { var t = document.createElement('span'); t.className = 'aw-tag'; t.textContent = tag; d.appendChild(t); }
    log.insertBefore(d, chips); log.scrollTop = log.scrollHeight; return d;
  }
  function renderChips() {
    chips.innerHTML = '';
    STARTERS.forEach(function (s) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'aw-chip'; b.textContent = s.q;
      b.addEventListener('click', function () {
        add('me', s.q); add('bot', s.a, "Rose's approved answer");
        history.push({ role: 'user', content: s.q }, { role: 'assistant', content: s.a });
        b.remove(); if (!chips.children.length) chips.style.display = 'none';
      });
      chips.appendChild(b);
    });
  }
  function open() {
    panel.classList.add('open'); launch.setAttribute('aria-expanded', 'true');
    if (log.children.length === 1) add('bot', "Hi! I can answer questions about Rose's product work. Pick a question below or type your own.");
    setTimeout(function () { input.focus(); }, 30);
  }
  function close() { panel.classList.remove('open'); launch.setAttribute('aria-expanded', 'false'); launch.focus(); }

  launch.addEventListener('click', function () { panel.classList.contains('open') ? close() : open(); });
  panel.querySelector('.aw-x').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) close(); });
  howBtn.addEventListener('click', function () {
    if (howBox) { howBox.remove(); howBox = null; howBtn.setAttribute('aria-expanded', 'false'); return; }
    howBox = document.createElement('p'); howBox.className = 'aw-how'; howBox.textContent = HOW;
    log.insertBefore(howBox, chips); log.scrollTop = log.scrollHeight; howBtn.setAttribute('aria-expanded', 'true');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value.trim(); if (!q || busy) return;
    busy = true; send.disabled = true; input.value = '';
    add('me', q); history.push({ role: 'user', content: q });
    var wait = add('bot', 'Thinking…');
    fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-8) }) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (x) {
        var text = x.ok ? x.j.reply : (x.j.error || 'Something went wrong. Email Rose at ' + EMAIL + '.');
        wait.textContent = text;
        if (x.ok) { var t = document.createElement('span'); t.className = 'aw-tag'; t.textContent = 'AI answer'; wait.appendChild(t); history.push({ role: 'assistant', content: text }); }
      })
      .catch(function () { wait.textContent = 'Something went wrong. Email Rose at ' + EMAIL + '.'; })
      .then(function () { busy = false; send.disabled = false; input.focus(); log.scrollTop = log.scrollHeight; });
  });

  renderChips();
})();
