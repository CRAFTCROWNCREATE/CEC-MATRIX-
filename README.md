<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="CEC-WAM">
    <meta name="theme-color" content="#000000">
    <title>CEC-WAM | SOVEREIGN</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <style>
        /* --- CORE PHYSICS --- */
        :root { --neon: #00FF41; --cyan: #00F3FF; --bg: #000; --panel: rgba(0, 10, 0, 0.95); }
        body { background: var(--bg); color: var(--neon); font-family: 'Courier New', monospace; margin: 0; height: 100vh; overflow: hidden; user-select: none; -webkit-touch-callout: none; display: flex; flex-direction: column; }
        
        /* LAYERS */
        #matrix-layer { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; opacity: 0.4; pointer-events: none; }
        
        /* LOCK SCREEN */
        #lock { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 5000; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .pin-box { font-size: 3rem; letter-spacing: 15px; margin-bottom: 20px; color: #fff; text-shadow: 0 0 10px var(--neon); }
        .numpad { display: grid; grid-template-columns: repeat(3, 80px); gap: 15px; }
        .key { width: 80px; height: 80px; border-radius: 50%; border: 2px solid var(--neon); font-size: 2rem; display: flex; justify-content: center; align-items: center; background: rgba(0,20,0,0.8); cursor: pointer; transition: 0.1s; }
        .key:active { background: var(--neon); color: #000; transform: scale(0.95); }

        /* UI LAYOUT */
        #ui { display: none; flex-direction: column; height: 100%; }
        header { height: 60px; display: flex; justify-content: space-between; align-items: center; padding: 0 15px; border-bottom: 2px solid var(--neon); background: rgba(0,0,0,0.9); padding-top: env(safe-area-inset-top); }
        
        /* VIEWPORT */
        .viewport { flex: 1; overflow-y: auto; padding: 15px; padding-bottom: 100px; }
        .tab { display: none; animation: fadeIn 0.3s; }
        .tab.active { display: block; }
        @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }

        /* CARDS */
        .card { background: var(--panel); border: 1px solid var(--neon); border-radius: 10px; padding: 15px; margin-bottom: 15px; box-shadow: 0 0 15px rgba(0, 255, 65, 0.1); position: relative; overflow: hidden; }
        .card h3 { color: var(--cyan); border-bottom: 1px solid #003300; margin-top: 0; padding-bottom: 5px; font-size: 1rem; display: flex; justify-content: space-between; }

        /* BUTTONS */
        .btn { width: 100%; padding: 15px; background: #002200; color: #fff; border: 1px solid var(--neon); font-size: 1.1rem; font-weight: bold; margin-top: 15px; border-radius: 5px; cursor: pointer; }
        .btn:active { background: var(--neon); color: #000; }

        /* STAR MAP */
        #map-container { height: 300px; background: #000; border: 1px solid #333; position: relative; }
        #star-canvas { width: 100%; height: 100%; }
        .hud-overlay { position: absolute; bottom: 10px; left: 10px; font-size: 0.7rem; color: var(--cyan); pointer-events: none; }

        /* AGENT CHAT */
        #chat-feed { height: 250px; overflow-y: auto; border: 1px solid #333; padding: 10px; margin-bottom: 10px; background: rgba(0,0,0,0.5); font-size: 0.9rem; }
        .msg { margin-bottom: 8px; padding: 8px; border-radius: 4px; }
        .msg.sys { text-align: left; color: #cfc; border-left: 2px solid var(--neon); background: rgba(0,50,0,0.3); }
        .msg.user { text-align: right; color: #ccf; border-right: 2px solid var(--cyan); background: rgba(0,50,50,0.3); }
        input[type="text"] { width: 70%; padding: 15px; background: #111; border: 1px solid var(--neon); color: #fff; box-sizing: border-box; }
        .send-btn { width: 28%; padding: 15px; background: var(--cyan); color: #000; border: none; font-weight: bold; cursor: pointer; }

        /* ACCOUNTS */
        .acct-row { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #333; align-items: center; }
        .status-dot { height: 8px; width: 8px; background: #00FF41; border-radius: 50%; box-shadow: 0 0 5px #00FF41; }

        /* NAV */
        nav { position: fixed; bottom: 0; width: 100%; height: 80px; background: #000; border-top: 2px solid var(--neon); display: flex; justify-content: space-around; align-items: center; z-index: 100; padding-bottom: env(safe-area-inset-bottom); }
        .nav-item { color: #555; display: flex; flex-direction: column; align-items: center; width: 60px; font-size: 0.7rem; }
        .nav-item i { font-size: 1.5rem; margin-bottom: 5px; }
        .nav-item.active { color: var(--neon); text-shadow: 0 0 10px var(--neon); }

        /* QR MODAL */
        #qr-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 6000; display: none; align-items: center; justify-content: center; flex-direction: column; }
        #qrcode { background: #fff; padding: 10px; border: 2px solid var(--neon); }

    </style>
</head>
<body>

    <canvas id="matrix-layer"></canvas>

    <!-- LOCK SCREEN -->
    <div id="lock">
        <h1>CEC-WAM</h1>
        <div id="pin" class="pin-box">____</div>
        <div class="numpad">
            <div class="key" onclick="tap(1)">1</div><div class="key" onclick="tap(2)">2</div><div class="key" onclick="tap(3)">3</div>
            <div class="key" onclick="tap(4)">4</div><div class="key" onclick="tap(5)">5</div><div class="key" onclick="tap(6)">6</div>
            <div class="key" onclick="tap(7)">7</div><div class="key" onclick="tap(8)">8</div><div class="key" onclick="tap(9)">9</div>
            <div class="key" style="border-color:red; color:red;" onclick="cls()">C</div>
            <div class="key" onclick="tap(0)">0</div>
            <div class="key" onclick="unlock()"><i class="fas fa-eye"></i></div>
        </div>
    </div>

    <!-- UI -->
    <div id="ui">
        <header>
            <div><i class="fas fa-shield-alt"></i> SERVER: <b>LIVE</b></div>
            <div id="clock">00:00</div>
        </header>

        <div class="viewport">
            
            <!-- HOME TAB -->
            <div id="view-home" class="tab active">
                <div class="card">
                    <h3>SYSTEM METRICS <i class="fas fa-server"></i></h3>
                    <div class="acct-row"><span>LIQUIDITY</span> <span style="color:#fff;">$1,250,039M</span></div>
                    <div class="acct-row"><span>EARTH SHIELD</span> <span style="color:var(--neon);">100% ACTIVE</span></div>
                    <div class="acct-row"><span>DATA STREAM</span> <span style="color:var(--cyan);">24.5 TB/s</span></div>
                </div>

                <div class="card">
                    <h3>LINKED ACCOUNTS <i class="fas fa-link"></i></h3>
                    <div class="acct-row"><span>GMAIL (SOVEREIGN)</span> <div class="status-dot"></div></div>
                    <div class="acct-row"><span>ICLOUD DRIVE</span> <div class="status-dot"></div></div>
                    <div class="acct-row"><span>GITHUB (REPO)</span> <div class="status-dot"></div></div>
                    <div class="acct-row"><span>NAVY FEDERAL</span> <div class="status-dot"></div></div>
                </div>

                <div class="card">
                    <h3>AGENT INTERFACE <i class="fas fa-robot"></i></h3>
                    <div id="chat-feed">
                        <div class="msg sys">SYSTEM ONLINE. WELCOME SOVEREIGN.</div>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <input type="text" id="agent-input" placeholder="Command...">
                        <button class="send-btn" onclick="sendAgent()">SEND</button>
                    </div>
                </div>
            </div>

            <!-- MAP TAB -->
            <div id="view-map" class="tab">
                <div class="card" style="padding:0; border:none;">
                    <div id="map-container">
                        <canvas id="star-canvas"></canvas>
                        <div class="hud-overlay">
                            SECTOR: SOLAR LOCAL<br>
                            TARGET: EARTH [HQ]<br>
                            SCANNING DEEP SPACE...
                        </div>
                    </div>
                </div>
                <button class="btn" style="border-color:var(--cyan); color:var(--cyan);" onclick="toggleMapMode()">TOGGLE GALAXY VIEW</button>
            </div>

            <!-- BANK TAB -->
            <div id="view-bank" class="tab">
                <div class="card">
                    <h3>SECURE LEDGER <i class="fas fa-university"></i></h3>
                    <div style="text-align:center; padding:20px;">
                        <div style="font-size:0.8rem; color:#aaa;">PSI-COIN ASSET</div>
                        <div style="font-size:2.5rem; color:#fff; text-shadow:0 0 10px var(--cyan);">$8,500.00</div>
                        <div style="font-size:0.7rem; color:var(--neon); margin-top:5px;">NAVY FEDERAL (...9008)</div>
                        <div style="font-size:0.6rem; color:#666;">ROUTING: *****4974</div>
                    </div>
                    <button class="btn" onclick="transfer()">INITIATE TRANSFER</button>
                </div>
            </div>

        </div>

        <nav>
            <div class="nav-item active" onclick="tab('view-home', this)"><i class="fas fa-home"></i><span>HOME</span></div>
            <div class="nav-item" onclick="tab('view-map', this)"><i class="fas fa-globe"></i><span>MAP</span></div>
            <div class="nav-item" onclick="tab('view-bank', this)"><i class="fas fa-wallet"></i><span>BANK</span></div>
        </nav>
    </div>

    <script>
        // --- 1. MATRIX ---
        const mc=document.getElementById('matrix-layer'), mctx=mc.getContext('2d');
        mc.width=window.innerWidth; mc.height=window.innerHeight;
        const mcols=Math.floor(mc.width/20), my=Array(mcols).fill(0);
        setInterval(()=>{
            mctx.fillStyle='#0001'; mctx.fillRect(0,0,mc.width,mc.height);
            mctx.fillStyle='#0F0'; mctx.font='15pt monospace';
            my.forEach((v,i)=>{
                mctx.fillText(String.fromCharCode(0x30A0+Math.random()*96), i*20, v);
                my[i]=v>100+Math.random()*10000?0:v+20;
            });
        }, 50);

        // --- 2. STAR MAP ---
        const sc=document.getElementById('star-canvas'), sctx=sc.getContext('2d');
        let stars=[], mapMode='SOLAR';
        function initStars(){ sc.width=document.getElementById('map-container').offsetWidth; sc.height=300; for(let i=0;i<100;i++)stars.push({x:Math.random()*sc.width,y:Math.random()*sc.height}); }
        function drawMap(){
            sctx.fillStyle='#000'; sctx.fillRect(0,0,sc.width,sc.height);
            sctx.fillStyle='#fff';
            stars.forEach(s=>{ sctx.fillRect(s.x,s.y,2,2); s.x-=0.2; if(s.x<0)s.x=sc.width; });
            const cx=sc.width/2, cy=sc.height/2;
            sctx.strokeStyle='#00F3FF'; sctx.beginPath(); sctx.arc(cx,cy,80,0,6.28); sctx.stroke();
            sctx.fillStyle=mapMode==='SOLAR'?'#00F3FF':'#9D00FF'; sctx.beginPath(); sctx.arc(cx,cy,5,0,6.28); sctx.fill();
            requestAnimationFrame(drawMap);
        }
        initStars(); drawMap();
        function toggleMapMode(){ mapMode=mapMode==='SOLAR'?'GALAXY':'SOLAR'; speak("Map switched to "+mapMode); }

        // --- 3. LOGIC ---
        let pin="";
        
        // AUTO LOGIN CHECK
        if(localStorage.getItem('cec_auto') === 'true') {
            document.getElementById('lock').style.display='none';
            document.getElementById('ui').style.display='flex';
        }

        function tap(n){ if(pin.length<4)pin+=n; document.getElementById('pin').innerText=pin.padEnd(4,'_'); }
        function cls(){ pin=""; document.getElementById('pin').innerText="____"; }
        function unlock(){
            if(pin==="1010" || pin==="") {
                document.getElementById('lock').style.display='none';
                document.getElementById('ui').style.display='flex';
                localStorage.setItem('cec_auto', 'true'); // SAVE LOGIN
                speak("Access Granted. Welcome Sovereign.");
            } else { alert("INVALID CODE"); cls(); }
        }
        function tab(id, el){
            document.querySelectorAll('.tab').forEach(c=>c.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
            el.classList.add('active');
        }

        // --- 4. BANKING ---
        function transfer(){
            if(confirm("Confirm Transfer: $8,500.00 to Navy Federal?")) {
                alert("TRANSFER INITIATED.\nStatus: Pending ACH Verification.");
                speak("Transfer authorized.");
            }
        }

        // --- 5. AGENT ---
        function sendAgent(){
            const t=document.getElementById('agent-input').value;
            if(!t)return;
            const d=document.createElement('div'); d.className='msg user'; d.innerText=t;
            document.getElementById('chat-feed').appendChild(d);
            document.getElementById('agent-input').value="";
            setTimeout(()=>{
                const r="COMMAND RECEIVED: "+t.toUpperCase();
                const sys=document.createElement('div'); sys.className='msg sys'; sys.innerText=r;
                document.getElementById('chat-feed').appendChild(sys);
                document.getElementById('chat-feed').scrollTop=document.getElementById('chat-feed').scrollHeight;
                speak(r);
            }, 800);
        }

        function speak(text){
            if('speechSynthesis' in window){
                const u=new SpeechSynthesisUtterance(text);
                const v=speechSynthesis.getVoices().find(voice=>voice.name.includes('Samantha')||voice.name.includes('Google US English'));
                if(v)u.voice=v;
                speechSynthesis.speak(u);
            }
        }

        setInterval(()=>document.getElementById('clock').innerText=new Date().toLocaleTimeString(), 1000);
    </script>
</body>
</html>


