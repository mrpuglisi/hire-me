
(function(){
  var VIBES={
    beach:{name:'Beach day',emoji:'🌊',verb:'build',caption:'SPF 50 on. Sharks and gators probably nearby.'},
    dreamhouse:{name:"Barbie's dream house",emoji:'💖',verb:'dream up',caption:'Everything is pink. That was the requirement.'},
    crunchy:{name:'Crunchy vegan',emoji:'🥕',verb:'grow',caption:'100% plant-based product thinking. Oat milk on request.'},
    gray:{name:'Millennial gray',emoji:'🌫️',verb:'optimize',caption:'Tasteful, neutral, and approved by your landlord.'}
  };
  var root=document.documentElement, verb=document.getElementById('verb');
  function setVibe(key,animate){
    var v=VIBES[key]; if(!v) return;
    root.setAttribute('data-vibe',key);
    document.querySelectorAll('.vibe-btn').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.set===key?'true':'false')});
    document.getElementById('vibe-emoji').textContent=v.emoji;
    document.getElementById('vibe-name').textContent=v.name+'.';
    document.getElementById('vibe-caption').textContent=v.caption;
    document.getElementById('foot-note').textContent='Currently viewing: '+v.name+' '+v.emoji;
    document.getElementById('vt-emoji').textContent=v.emoji;
    document.getElementById('vt-name').textContent=v.name;
    verb.textContent=v.verb;
    if(animate){verb.classList.remove('flip');void verb.offsetWidth;verb.classList.add('flip')}
    try{localStorage.setItem('rp-vibe',key)}catch(e){}
  }
  var start='beach';
  try{var q=new URLSearchParams(location.search).get('vibe');if(q&&VIBES[q])start=q;else{var s=localStorage.getItem('rp-vibe');if(s&&VIBES[s])start=s}}catch(e){}
  setVibe(start,false);
  var tog=document.getElementById('vibe-toggle'), pop=document.getElementById('vibe-pop');
  function openPop(o){pop.hidden=!o;tog.setAttribute('aria-expanded',o?'true':'false');if(o){var c=pop.querySelector('[aria-pressed="true"]');c&&c.focus()}}
  tog.addEventListener('click',function(e){e.stopPropagation();openPop(pop.hidden)});
  document.addEventListener('click',function(e){if(!pop.hidden&&!pop.contains(e.target))openPop(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!pop.hidden){openPop(false);tog.focus()}});
  document.querySelectorAll('.vibe-btn').forEach(function(b){b.addEventListener('click',function(){setVibe(b.dataset.set,true);openPop(false);tog.focus()})});
  // Mobile menu
  var nt=document.querySelector('.nav-toggle'), nav=document.getElementById('site-nav');
  if(nt&&nav){
    nt.addEventListener('click',function(e){e.stopPropagation();var o=nav.classList.toggle('open');nt.setAttribute('aria-expanded',String(o))});
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');nt.setAttribute('aria-expanded','false')})});
    document.addEventListener('click',function(e){if(nav.classList.contains('open')&&!nav.contains(e.target)){nav.classList.remove('open');nt.setAttribute('aria-expanded','false')}});
  }

  // Highlight the section you're reading
  var links=[].slice.call(document.querySelectorAll('.nav a'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){if(en.isIntersecting){links.forEach(function(l){l.classList.toggle('active',l.getAttribute('href')==='#'+en.target.id)})}});
    },{rootMargin:'-45% 0px -50% 0px'});
    links.forEach(function(l){var s=document.querySelector(l.getAttribute('href'));if(s)io.observe(s)});
  }

  // Show the top 3 bullets per role; the rest are one click away
  document.querySelectorAll('.job:not(.current) ul').forEach(function(ul){
    var n=ul.children.length; if(n<=3) return;
    ul.classList.add('is-collapsed');
    var b=document.createElement('button'); b.type='button'; b.className='more-btn';
    b.setAttribute('aria-expanded','false'); b.textContent='Show '+(n-3)+' more';
    b.addEventListener('click',function(){var c=ul.classList.toggle('is-collapsed');b.setAttribute('aria-expanded',String(!c));b.textContent=c?'Show '+(n-3)+' more':'Show less'});
    ul.after(b);
  });

  // Copy email (for people whose mail links open the wrong app)
  var cb=document.querySelector('.copy-email'), cs=document.querySelector('.copy-status');
  if(cb){cb.addEventListener('click',function(){
    var em=cb.dataset.email;
    function done(ok){cs.textContent=ok?'Email copied: '+em:'Copy failed. The address is '+em}
    if(navigator.clipboard){navigator.clipboard.writeText(em).then(function(){done(true)},function(){done(false)})}else{done(false)}
  })}

  // Back to top + year
  var tt=document.querySelector('.to-top');
  if(tt){window.addEventListener('scroll',function(){tt.classList.toggle('show',window.scrollY>900)},{passive:true})}
  var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();

  // Print: open every case study so nothing is hidden on paper
  var opened=[];
  window.addEventListener('beforeprint',function(){document.querySelectorAll('details:not([open])').forEach(function(d){d.open=true;opened.push(d)})});
  window.addEventListener('afterprint',function(){opened.forEach(function(d){d.open=false});opened=[]});
})();
