/* "Ask about my work" assistant.
   Tapped questions show Rose's own approved answers (no AI call).
   Typed questions and follow-ups go to /api/chat, which answers only from her knowledge file. */
(function () {
  var EMAIL = 'maryrose.puglisi@gmail.com';
  var AVATAR = 'work/rose-avatar.jpg';
  var LINKEDIN = 'https://www.linkedin.com/in/maryrose-puglisi/';
  var BOOKING = ''; // add a scheduling link (Calendly, Cal.com) to show a "Book a call" button
  var STARTERS = [
    { q: 'What AI has she shipped?',
      a: "Quite a bit. At Zartico, Rose shipped AI right into the product: dashboard help that starts with curated explanations and lets AI handle the follow-up questions, plus campaign wrap reports that mix AI-written analysis with tested wording where consistency matters. Day to day, she works with Claude plugged into Jira, Slack, Drive, and the codebase.",
      next: 'Why not let AI write everything?' },
    { q: "What's she looking for?",
      a: "A senior or director-level product role, in any industry doing ethical work. Her favorite kind of work is platform product, especially digging into usage data to find the trends that should shape the roadmap. She's in St. Petersburg, has been remote for years, and is open to hybrid for the right role.",
      next: "What's her strongest product area?" },
    { q: 'How does she lead?',
      a: "By setting a clear direction and making it safe to raise problems early. She's set the roadmap for every product she's owned, directed an offshore engineering team's day-to-day work at Granicus, and interviewed and onboarded new hires, some of whom went on to promotions.",
      next: 'How does she bring people through big changes?' },
    { q: 'Regulated industries?',
      a: "Yes. At Granicus she owned compliance for GovDelivery, a government messaging platform used by 1,000+ government clients, covering FedRAMP, GDPR, and WCAG. When its FedRAMP authorization was at risk, she took open security vulnerabilities from about 1,800 to about 200, then mentored other teams on how she did it.",
      next: 'How did she get from 1,800 to 200?' },
    { q: "How'd she build this?",
      a: "Rose designed and built this site herself with Claude, drawing on a self-taught coding background. I'm part of it too: the questions you can tap have answers she wrote, and anything you type goes to Claude, which only knows what she's approved. It's the same layered design she shipped at Zartico.",
      next: 'What else has she built with AI?' }
  ];
  var HOW = "The questions you can tap show answers Rose wrote herself, so they're accurate every time. Anything you type goes to Claude, which can only answer from a file of facts Rose reviewed line by line. If it doesn't know, it says so and points you to her email. It's the same layered design she shipped at Zartico. Typed questions are saved anonymously, with no information about you, so Rose can see what people ask and improve the answers.";

  var css = [
    '.aw-launch{position:fixed;right:20px;bottom:20px;z-index:60;display:inline-flex;align-items:center;gap:10px;padding:6px 18px 6px 6px;border-radius:999px;border:0;cursor:pointer;background:var(--accent);color:var(--on-accent,#fff);font:inherit;font-weight:700;font-size:.95rem;box-shadow:0 10px 28px rgba(0,0,0,.18);transition:transform .15s}',
    '.aw-launch:hover{transform:translateY(-2px)}',
    '.aw-launch img,.aw-av{width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.85);flex:none}',
    '.aw-dot{position:absolute;left:34px;bottom:8px;width:10px;height:10px;border-radius:50%;background:#2BB673;border:2px solid var(--accent)}',
    '.aw-panel{position:fixed;right:20px;bottom:84px;z-index:61;width:min(390px,calc(100vw - 32px));max-height:min(600px,calc(100vh - 110px));display:none;flex-direction:column;background:var(--surface,#fff);color:var(--ink,#111);border:1px solid var(--line,#ddd);border-radius:22px;box-shadow:0 18px 48px rgba(0,0,0,.22);overflow:hidden}',
    '.aw-panel.open{display:flex;animation:aw-in .18s ease-out}',
    '@keyframes aw-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',
    '.aw-head{display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--soft,#eee);border-bottom:1px solid var(--line,#ddd)}',
    '.aw-head .aw-av{width:42px;height:42px;border-color:var(--surface,#fff)}',
    '.aw-head h2{margin:0;font-family:var(--display,inherit);font-weight:var(--dweight,700);font-style:var(--dstyle,normal);font-size:1.12rem;line-height:1.15}',
    '.aw-head p{margin:2px 0 0;font-size:.8rem;color:var(--muted,#555)}',
    '.aw-x{margin-left:auto;border:0;background:transparent;color:var(--muted,#555);font-size:1.4rem;line-height:1;cursor:pointer;padding:2px 6px;border-radius:8px}',
    '.aw-log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px}',
    '.aw-msg{max-width:86%;padding:10px 13px;border-radius:16px;font-size:.93rem;line-height:1.5;white-space:pre-wrap}',
    '.aw-msg.bot{align-self:flex-start;background:var(--soft,#eee);border-bottom-left-radius:5px}',
    '.aw-msg.me{align-self:flex-end;background:var(--accent);color:var(--on-accent,#fff);border-bottom-right-radius:5px}',
    '.aw-tag{display:block;margin-top:6px;font-size:.74rem;font-style:italic;color:var(--muted,#555)}',
    '.aw-typing{display:inline-flex;gap:4px;padding:4px 2px}',
    '.aw-typing i{width:7px;height:7px;border-radius:50%;background:var(--muted,#777);opacity:.4;animation:aw-b 1s infinite}',
    '.aw-typing i:nth-child(2){animation-delay:.15s}.aw-typing i:nth-child(3){animation-delay:.3s}',
    '@keyframes aw-b{0%,60%,100%{opacity:.35;transform:none}30%{opacity:1;transform:translateY(-3px)}}',
    '.aw-chips{display:flex;flex-wrap:wrap;gap:6px}',
    '.aw-chip{border:1px solid var(--accent);background:var(--surface,#fff);color:var(--ink,#111);border-radius:999px;padding:6px 12px;font:inherit;font-size:.84rem;cursor:pointer;text-align:left}',
    '.aw-chip:hover{background:var(--soft,#eee)}',
    '.aw-chip.next{border-style:dashed}',
    '.aw-form{display:flex;gap:8px;padding:12px 14px 8px;border-top:1px solid var(--line,#ddd)}',
    '.aw-form input{flex:1;min-width:0;padding:10px 14px;border:1px solid var(--line,#ccc);border-radius:999px;font:inherit;font-size:.93rem;background:var(--surface,#fff);color:var(--ink,#111)}',
    '.aw-form button{border:0;border-radius:999px;width:42px;background:var(--accent);color:var(--on-accent,#fff);font:inherit;font-size:1.1rem;font-weight:700;cursor:pointer}',
    '.aw-form button:disabled{opacity:.5;cursor:default}',
    '.aw-foot{display:flex;justify-content:flex-end;padding:0 18px 10px}',
    '.aw-foot button{border:0;background:transparent;color:var(--muted,#555);font:inherit;font-size:.78rem;cursor:pointer;padding:0;text-decoration:underline}',
    '.aw-how{align-self:stretch;margin:0;padding:10px 12px;border-radius:12px;border:1px dashed var(--line,#ccc);font-size:.82rem;line-height:1.45;color:var(--muted,#555)}',
    '.aw-cta{align-self:stretch;padding:12px 14px;border-radius:16px;border:1px solid var(--accent);background:var(--surface,#fff)}',
    '.aw-cta p{margin:0 0 10px;font-size:.9rem;font-weight:600}',
    '.aw-cta div{display:flex;flex-wrap:wrap;gap:8px}',
    '.aw-cta a{display:inline-block;padding:7px 14px;border-radius:999px;font-size:.85rem;font-weight:700;text-decoration:none;border:1px solid var(--accent);color:var(--ink,#111)}',
    '.aw-cta a.primary{background:var(--accent);color:var(--on-accent,#fff)}',
    '.aw-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
    '.to-top{bottom:calc(84px + env(safe-area-inset-bottom,0px))!important}',
    '@media (max-width:640px){.aw-launch{right:14px;bottom:14px}.aw-panel{right:8px;left:8px;width:auto;bottom:74px;max-height:calc(100vh - 92px)}}',
    '@media (prefers-reduced-motion:reduce){.aw-panel.open,.aw-typing i{animation:none}.aw-launch{transition:none}}',
    '@media print{.aw-launch,.aw-panel{display:none!important}}'
  ].join('\n');
  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  var launch = document.createElement('button');
  launch.className = 'aw-launch'; launch.type = 'button'; launch.style.position = 'fixed';
  launch.setAttribute('aria-expanded', 'false'); launch.setAttribute('aria-controls', 'aw-panel');
  launch.innerHTML = '<img src="' + AVATAR + '" alt=""><span class="aw-dot" aria-hidden="true"></span><span>Ask about my work</span>';

  var panel = document.createElement('section');
  panel.className = 'aw-panel'; panel.id = 'aw-panel';
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-labelledby', 'aw-title');
  panel.innerHTML =
    '<div class="aw-head"><img class="aw-av" src="' + AVATAR + '" alt="">' +
    '<div><h2 id="aw-title">Ask about my work</h2><p>Rose\'s portfolio assistant</p></div>' +
    '<button class="aw-x" type="button" aria-label="Close">×</button></div>' +
    '<div class="aw-log" aria-live="polite"><div class="aw-chips" role="group" aria-label="Suggested questions"></div></div>' +
    '<form class="aw-form"><label class="aw-sr" for="aw-input">Ask a question about Rose\'s work</label>' +
    '<input id="aw-input" type="text" maxlength="600" autocomplete="off" placeholder="Type a question…">' +
    '<button type="submit" aria-label="Send">↑</button></form>' +
    '<div class="aw-foot"><button type="button" class="aw-how-btn" aria-expanded="false">How this works</button></div>';

  document.body.appendChild(launch); document.body.appendChild(panel);

  var log = panel.querySelector('.aw-log'), chips = panel.querySelector('.aw-chips');
  var form = panel.querySelector('.aw-form'), input = panel.querySelector('#aw-input'), send = form.querySelector('button');
  var howBtn = panel.querySelector('.aw-how-btn'), howBox = null;
  var history = [], busy = false, used = {}, answered = 0, ctaShown = false;
  function cta(askRose, q) {
    if (ctaShown) return; ctaShown = true;
    var c = document.createElement('div'); c.className = 'aw-cta';
    var subject = encodeURIComponent(askRose ? 'A question from your portfolio' : 'Saw your portfolio, would love to talk');
    var body = askRose && q ? '&body=' + encodeURIComponent('Hi Rose,\n\nI asked your portfolio assistant: "' + q + '"\n\n') : '';
    var links = (BOOKING ? '<a class="primary" href="' + BOOKING + '" target="_blank" rel="noopener">Book a call</a>' : '') +
      '<a class="' + (BOOKING ? '' : 'primary') + '" href="mailto:' + EMAIL + '?subject=' + subject + body + '">Email Rose</a>' +
      '<a href="' + LINKEDIN + '" target="_blank" rel="noopener">LinkedIn</a>';
    c.innerHTML = '<p>' + (askRose ? "That's a great one to ask Rose directly." : "Like what you're hearing? Rose would love to talk.") + '</p><div>' + links + '</div>';
    log.insertBefore(c, chips); scroll();
  }
  function afterAnswer() { answered++; if (answered === 2) cta(); }

  function scroll() { log.scrollTop = log.scrollHeight; }
  function add(role, text, tag) {
    var d = document.createElement('div'); d.className = 'aw-msg ' + role; d.textContent = text;
    if (tag) { var t = document.createElement('span'); t.className = 'aw-tag'; t.textContent = tag; d.appendChild(t); }
    log.insertBefore(d, chips); scroll(); return d;
  }
  function typing() {
    var d = add('bot', ''); d.innerHTML = '<span class="aw-typing" aria-label="Typing"><i></i><i></i><i></i></span>'; return d;
  }
  function renderChips(nextQ) {
    chips.innerHTML = '';
    if (nextQ) {
      var n = document.createElement('button'); n.type = 'button'; n.className = 'aw-chip next'; n.textContent = nextQ;
      n.addEventListener('click', function () { ask(nextQ); }); chips.appendChild(n);
    }
    STARTERS.forEach(function (s, i) {
      if (used[i]) return;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'aw-chip'; b.textContent = s.q;
      b.addEventListener('click', function () { starter(i); }); chips.appendChild(b);
    });
    chips.style.display = chips.children.length ? '' : 'none';
  }
  function starter(i) {
    if (busy) return; busy = true; used[i] = true;
    var s = STARTERS[i]; chips.innerHTML = '';
    add('me', s.q); var t = typing();
    setTimeout(function () {
      t.textContent = s.a; var tag = document.createElement('span'); tag.className = 'aw-tag'; tag.textContent = "In Rose's own words"; t.appendChild(tag);
      history.push({ role: 'user', content: s.q }, { role: 'assistant', content: s.a });
      busy = false; afterAnswer(); renderChips(s.next); scroll();
    }, 650);
  }
  function ask(q) {
    if (busy) return; busy = true; send.disabled = true; chips.innerHTML = '';
    add('me', q); history.push({ role: 'user', content: q });
    var t = typing();
    fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-8) }) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (x) {
        var text = x.ok ? x.j.reply : (x.j.error || "Hmm, something went sideways on my end. Rose is at " + EMAIL + '.');
        t.textContent = text;
        if (x.ok) {
          if (!x.j.askRose) { var n = document.createElement('span'); n.className = 'aw-tag'; n.textContent = "AI answer from Rose's approved facts. Worth confirming details with her."; t.appendChild(n); }
          history.push({ role: 'assistant', content: text }); if (x.j.askRose) cta(true, q); else afterAnswer();
        }
      })
      .catch(function () { t.textContent = "Hmm, I couldn't connect just now. Rose is at " + EMAIL + '.'; })
      .then(function () { busy = false; send.disabled = false; renderChips(); input.focus(); scroll(); });
  }
  function open() {
    panel.classList.add('open'); launch.setAttribute('aria-expanded', 'true');
    if (log.children.length === 1) { add('bot', "Hi, I'm Rose's portfolio assistant. Ask me anything about her work, or tap a question to start."); renderChips(); }
    setTimeout(function () { input.focus(); }, 30);
  }
  function close() { panel.classList.remove('open'); launch.setAttribute('aria-expanded', 'false'); launch.focus(); }

  launch.addEventListener('click', function () { panel.classList.contains('open') ? close() : open(); });
  panel.querySelector('.aw-x').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) close(); });
  howBtn.addEventListener('click', function () {
    if (howBox) { howBox.remove(); howBox = null; howBtn.setAttribute('aria-expanded', 'false'); return; }
    howBox = document.createElement('p'); howBox.className = 'aw-how'; howBox.textContent = HOW;
    log.insertBefore(howBox, chips); scroll(); howBtn.setAttribute('aria-expanded', 'true');
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault(); var q = input.value.trim(); if (!q || busy) return; input.value = ''; ask(q);
  });
})();
