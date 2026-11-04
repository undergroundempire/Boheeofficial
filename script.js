const $ = id => document.getElementById(id);
const intro = $("intro"), site = $("site"), offline = $("offlineScreen");
function playSignatureSound(){
  // Original soft sparkle sound generated in the browser; no audio file needed.
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [880,1174,1568].forEach((freq,i)=>{
      const osc=ctx.createOscillator(), gain=ctx.createGain();
      osc.type="sine"; osc.frequency.value=freq;
      gain.gain.setValueAtTime(.0001,ctx.currentTime+i*.12);
      gain.gain.exponentialRampToValueAtTime(.055,ctx.currentTime+i*.12+.04);
      gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+i*.12+.38);
      osc.connect(gain);gain.connect(ctx.destination);
      osc.start(ctx.currentTime+i*.12);osc.stop(ctx.currentTime+i*.12+.4);
    });
    setTimeout(()=>ctx.close(),1200);
  }catch(e){/* Audio is optional if browser blocks it. */}
}
function openSite(){
  if(intro) intro.classList.add("hidden");
  site.classList.remove("hidden");
  const enabled=localStorage.getItem("bohee-site-enabled");
  if(enabled==="false"){site.classList.add("hidden");offline.classList.remove("hidden");}
}
$("enterBtn")?.addEventListener("click",()=>{playSignatureSound();openSite();});
$("skipIntro")?.addEventListener("click",openSite);
$("themeToggle")?.addEventListener("click",()=>{
  document.body.classList.toggle("day");
  const day=document.body.classList.contains("day");
  $("themeToggle").textContent=day?"☀":"☾";
  localStorage.setItem("bohee-theme",day?"day":"night");
});
if(localStorage.getItem("bohee-theme")==="day"){document.body.classList.add("day");$("themeToggle").textContent="☀";}
$("coinBtn")?.addEventListener("click",()=> $("qrModal").classList.remove("hidden"));
$("closeQr")?.addEventListener("click",()=> $("qrModal").classList.add("hidden"));
$("qrModal")?.addEventListener("click",e=>{if(e.target===$("qrModal"))$("qrModal").classList.add("hidden");});
$("searchForm")?.addEventListener("submit",e=>{
  e.preventDefault();const q=$("siteSearch").value.trim().toLowerCase();
  $("searchStatus").textContent=q?`Search ready for “${q}”. Add your music, video and gallery items to make them searchable.`:"Type something to search.";
});
$("voiceSearch")?.addEventListener("click",()=>{
  const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!Speech){$("searchStatus").textContent="Voice search is not supported in this browser. Please type your search.";return;}
  const rec=new Speech();rec.lang="hi-IN";rec.interimResults=false;
  $("searchStatus").textContent="Listening…";
  rec.onresult=e=>{$("siteSearch").value=e.results[0][0].transcript;$("searchForm").requestSubmit();};
  rec.onerror=()=>{$("searchStatus").textContent="Voice search could not start. Please type your search.";};
  rec.start();
});
