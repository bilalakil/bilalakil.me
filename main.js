WebFontConfig = { google: { families: ['Anonymous Pro:400,700', 'Oswald', 'Open Sans:400,700'] } };

window.dataLayer = (window.dataLayer || []);
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'UA-113123792-1');

(() => {
  const NUM_GIMMICKS = 17;
  const NUM_PIXEL_ARTS_TOTAL = 13;
  const NUM_PIXEL_ART_COLS = 4;

  const NUM_PIXEL_ARTS_TO_DISPLAY = 3;
  const PIXEL_ART_SIZE = 16;

  // https://stackoverflow.com/questions/6274339#comment97831379_6274339
  const shuffle = (arr) => arr.reduceRight(
    (p,v,i,a) => (v=i?~~(Math.random()*(i+1)):i, v-i?[a[v],a[i]]=[a[i],a[v]]:0, a),
    [...arr]
  );

  const loadScript = (src) => {
    const wf = document.createElement('script'),
          s = document.scripts[0];
        
    wf.src = src;
    wf.async = true;
    
    s.parentNode.insertBefore(wf, s);
  }

  const loadGimmick = () => {
    const gimmickContainer = document.querySelector('.gimmick-inner');
    if (gimmickContainer === null) return;

    // Use the query string if present
    let query = window.location.search.match(/[?&]gimmick=(\d+)(?:&|$)/);
    query = query && parseInt(query[1]);
    
    const chosenOne = query && query <= NUM_GIMMICKS
      ? query
      : (Math.floor(Math.random() * NUM_GIMMICKS) + 1);

    const img = document.createElement('img');
    img.src = `imgs/gimmicks/${chosenOne}.svg`;
    img.alt = 'Randomised, hand-made bad drawing.';

    gimmickContainer.appendChild(img);
  }

  const loadPixelArt = () => {
    const svgContainer = document.querySelector('.svgs');
    if (svgContainer === null) return;

    const options = [...Array(NUM_PIXEL_ARTS_TOTAL).keys()];
    const shuffled = shuffle(options);
    const chosen = shuffled.slice(0, NUM_PIXEL_ARTS_TO_DISPLAY);

    chosen.forEach((i) => {
      console.log(i);
      const xPos = (i % NUM_PIXEL_ART_COLS) * PIXEL_ART_SIZE;
      const yPos = Math.floor(i / NUM_PIXEL_ART_COLS) * PIXEL_ART_SIZE;
      const svgFrag = `#svgView(viewBox(${xPos},${yPos},${PIXEL_ART_SIZE},${PIXEL_ART_SIZE}))`;

      const img = document.createElement('img');
      img.src = `imgs/16-arq16.svg${svgFrag}`;
      img.alt = 'Randomised, hand-made bad pixel art image.';

      svgContainer.appendChild(img);
    });
  }

  document.addEventListener('readystatechange', () => {
    if (document.readyState !== 'complete') return;

    loadScript('https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    loadScript('https://www.googletagmanager.com/gtag/js?id=UA-113123792-1');

    loadGimmick();
    loadPixelArt();
  });
})();

