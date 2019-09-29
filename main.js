WebFontConfig = { google: { families: ['Anonymous Pro:400,700', 'Oswald', 'Open Sans:400,700'] } };

window.dataLayer = (window.dataLayer || [])
  .concat([
    ['js', new Date()],
    ['config', 'UA-113123792-1']
  ]);

(() => {
  const NUM_GIMMICKS = 7;

  function loadScript(src) {
    let wf = document.createElement('script'),
        s = document.scripts[0];
        
    wf.src = src;
    wf.async = true;
    
    s.parentNode.insertBefore(wf, s);
  }

  function loadGimmick() {
    const alt = 'Randomised, hand-made low quality drawing.';

    const gimmickInner = document.querySelector('.gimmick-inner');

    if(gimmickInner === null) {
      return;
    }

    let query = window.location.search.match(/[?&]gimmick=(\d+)(?:&|$)/);
    query = query && parseInt(query[1]);
    
    const src = 'gimmicks/' + (
      query && query <= NUM_GIMMICKS
        ? query
        : (Math.floor(Math.random() * NUM_GIMMICKS) + 1)
      ).toString() + '.svg';

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;

    gimmickInner.appendChild(img);
  }

  document.addEventListener('readystatechange', () => {
    if(document.readyState !== 'complete') {
      return;
    }

    loadScript('https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    loadScript('https://www.googletagmanager.com/gtag/js?id=UA-113123792-1');

    loadGimmick();
  });
})();

