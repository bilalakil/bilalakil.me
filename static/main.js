WebFontConfig = { google: { families: ['Anonymous Pro:400,700', 'Oswald', 'Open Sans:400,700'] } };

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'UA-113123792-1');

(() => {
  function loadScript(src) {
    let wf = document.createElement('script'),
        s = document.scripts[0];
        
    wf.src = src;
    wf.async = true;
    
    s.parentNode.insertBefore(wf, s);
  }

  function loadGimmick() {
    const numGimmicks = 1;
    const alt = 'Randomised, hand-made low quality drawing.';

    const gimmickInner = document.querySelector('.gimmick-inner');

    if(gimmickInner === null) {
      return;
    }

    const src = 'gimmicks/' + (Math.floor(Math.random() * numGimmicks) + 1).toString() + '.svg';

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

