/* =========================
   1. BASIC ELEMENTS
========================= */
const $ = id => document.getElementById(id);

const intro = $("intro");
const site = $("site");
const offline = $("offlineScreen");

/* =========================
   2. INTRO SOUND
========================= */
function playSignatureSound(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    [880,1174,1568].forEach((freq,i)=>{
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(.0001,ctx.currentTime+i*.12);
      gain.gain.exponentialRampToValueAtTime(.05,ctx.currentTime+i*.12+.04);
      gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+i*.12+.38);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime+i*.12);
      osc.stop(ctx.currentTime+i*.12+.4);
    });

    setTimeout(()=>ctx.close(),1200);
  }catch(error){
    console.log("Intro sound unavailable");
  }
}

/* =========================
   3. OPEN WEBSITE
========================= */
function openSite(){
  intro?.classList.add("hidden");
  site?.classList.remove("hidden");

  if(localStorage.getItem("bohee-site-enabled")==="false"){
    site?.classList.add("hidden");
    offline?.classList.remove("hidden");
  }
}

$("enterBtn")?.addEventListener("click",()=>{
  playSignatureSound();
  openSite();
});

$("skipIntro")?.addEventListener("click",openSite);

/* =========================
   4. MOON / SUN MODE
========================= */
function setTheme(mode){
  const isDay = mode==="day";

  document.body.classList.toggle("day",isDay);

  const button = $("themeToggle");

  if(button){
    button.textContent = isDay ? "☀ Sun Mode" : "☾ Moon Mode";
  }

  localStorage.setItem("bohee-theme",mode);
}

$("themeToggle")?.addEventListener("click",()=>{
  const isDay = document.body.classList.contains("day");
  setTheme(isDay ? "night" : "day");
});

const savedTheme = localStorage.getItem("bohee-theme") || "night";
setTheme(savedTheme);

/* =========================
   5. PAYTM QR POPUP
========================= */
$("coinBtn")?.addEventListener("click",()=>{
  $("qrModal")?.classList.remove("hidden");
});

$("closeQr")?.addEventListener("click",()=>{
  $("qrModal")?.classList.add("hidden");
});

$("qrModal")?.addEventListener("click",event=>{
  if(event.target===$("qrModal")){
    $("qrModal").classList.add("hidden");
  }
});

/* =========================
   6. SEARCH
========================= */
$("searchForm")?.addEventListener("submit",event=>{
  event.preventDefault();

  const query = $("siteSearch").value.trim().toLowerCase();
  const status = $("searchStatus");

  if(!query){
    alert("Please type something to search.");
    return;
  }

  const searchable = document.querySelectorAll(
    ".section, .tile, .gallery-grid img"
  );

  let found = false;

  searchable.forEach(item=>{
    const content = item.textContent.toLowerCase();
    const alt = (item.getAttribute("alt") || "").toLowerCase();

    if(content.includes(query) || alt.includes(query)){
      item.scrollIntoView({behavior:"smooth",block:"center"});
      found = true;
    }
  });

  if(!found){
    alert("No matching content found.");
  }
});

/* =========================
   7. MUSIC PLAYER
========================= */
const audio = $("audioPlayer");
const playBtn = $("playBtn");
const seekBar = $("seekBar");

let playlist = [];
let currentTrack = 0;

function loadTrack(index){
  if(!playlist.length){
    $("playerMessage").textContent =
      "No MP3 uploaded yet. Add your songs to the playlist in script.js.";
    return;
  }

  currentTrack = (index + playlist.length) % playlist.length;

  audio.src = playlist[currentTrack].src;
  $("trackTitle").textContent = playlist[currentTrack].title;
  $("playerMessage").textContent = "Ready to play";
}

function playTrack(){
  if(!audio.src){
    $("playerMessage").textContent =
      "Upload an MP3 file and add it to the playlist first.";
    return;
  }

  audio.play().then(()=>{
    playBtn.textContent="Ⅱ";
  }).catch(()=>{
    $("playerMessage").textContent="Tap Play to start music.";
  });
}

playBtn?.addEventListener("click",()=>{
  if(audio.paused){
    playTrack();
  }else{
    audio.pause();
    playBtn.textContent="▶";
  }
});

$("nextBtn")?.addEventListener("click",()=>{
  if(playlist.length){
    loadTrack(currentTrack+1);
    playTrack();
  }
});

$("prevBtn")?.addEventListener("click",()=>{
  if(playlist.length){
    loadTrack(currentTrack-1);
    playTrack();
  }
});

audio?.addEventListener("timeupdate",()=>{
  if(!audio.duration)return;

  seekBar.value=(audio.currentTime/audio.duration)*100;

  $("timeLabel").textContent =
    formatTime(audio.currentTime)+" / "+formatTime(audio.duration);
});

seekBar?.addEventListener("input",()=>{
  if(audio.duration){
    audio.currentTime=(seekBar.value/100)*audio.duration;
  }
});

audio?.addEventListener("ended",()=>{
  if(playlist.length){
    loadTrack(currentTrack+1);
    playTrack();
  }else{
    playBtn.textContent="▶";
  }
});

function formatTime(seconds){
  if(!Number.isFinite(seconds))return "00:00";

  const min=Math.floor(seconds/60);
  const sec=Math.floor(seconds%60);

  return String(min).padStart(2,"0")+":"+
         String(sec).padStart(2,"0");
}

/*
MP3 ADD KARNE KA TARIKA:

playlist = [
  {title:"My First Song",src:"music/song1.mp3"},
  {title:"My Second Song",src:"music/song2.mp3"}
];

Phir loadTrack(0) call karein.
*/

/* =========================
   8. FAN MESSAGE
========================= */
$("sendFanMessage")?.addEventListener("click",()=>{
  const message=$("fanMessage").value.trim();

  if(!message){
    $("fanStatus").textContent="Please write a message first.";
    return;
  }

  $("fanStatus").textContent=
    "Thank you for your message! Message submission service is not connected yet.";

  $("fanMessage").value="";
});

/* =========================
   9. CLOSE QR WITH ESCAPE
========================= */
document.addEventListener("keydown",event=>{
  if(event.key==="Escape"){
    $("qrModal")?.classList.add("hidden");
  }
});
