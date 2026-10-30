import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.goto('http://127.0.0.1:4333/', { waitUntil: 'networkidle2' });
await p.evaluate(() => document.fonts.ready);
await new Promise(r => setTimeout(r, 800));
console.log(await p.evaluate(() => ({
  imgs: [...document.images].filter(i => i.complete && i.naturalWidth > 0).length + '/' + document.images.length,
  brandText: /SiteFast|Макет/i.test(document.body.innerText),
  fixedOverlays: [...document.querySelectorAll('body *')].filter(e => { const s = getComputedStyle(e); return s.position === 'fixed' && +s.zIndex > 9000 && parseFloat(s.width) > 200; }).length,
  sections: document.querySelectorAll('section').length,
})));
await p.screenshot({ path: 'screenshots/seveleva-clean-1440.png' });
await b.close();
