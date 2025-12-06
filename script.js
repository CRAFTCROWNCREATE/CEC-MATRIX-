document.addEventListener('DOMContentLoaded', () => {
  // simple canvas chart inside A1 panel
  const c = document.getElementById('chart1');
  if (c && c.getContext) {
    const ctx = c.getContext('2d');
    const w = c.width, h = c.height;

    // clear
    ctx.clearRect(0, 0, w, h);

    // grid
    ctx.strokeStyle = '#1ae7ff';
    for (let x = 0; x < w; x += 20) {
      ctx.globalAlpha = 0.15;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }

    // bars
    const data = Array.from({length: 16}, ()=> Math.random()*h);
    const barW = w / data.length;
    data.forEach((v,i)=> {
      const x = i * barW;
      const height = v;
      ctx.fillStyle = '#18e3ff';
      ctx.globalAlpha = 0.95;
      ctx.fillRect(x, h - height, barW - 2, height);
    });

    ctx.globalAlpha = 1;
  }

  // A2: random heights for bar panels
  const bars = document.getElementById('bars');
  if (bars) {
    // populate eight bars
    for (let i = 0; i < 8; i++) {
      const bar = document.createElement('div');
      bar.style.height = (40 + Math.random() * 80) + 'px';
      bars.appendChild(bar);
    }
  }
});
