const codeArea = document.getElementById("codeArea");
const savedStatus = document.getElementById("savedStatus");

function goHome(){ location.href="index.html"; }

function copyCode(){
  codeArea.select();
  document.execCommand("copy");
  alert("Code copied!");
}

function loadCode(){
  const project = JSON.parse(localStorage.getItem("project")||'{"nodes":[],"files":{}}');
  let html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>My Project</title></head><body>`;
  project.nodes.forEach(n=>{
    if(n.type==="div")
      html+=`<div style="position:absolute;left:${n.x}px;top:${n.y}px;width:${n.sx*100}px;height:${n.sy*100}px;background:${n.color}"></div>`;
    if(n.type==="button")
      html+=`<button style="position:absolute;left:${n.x}px;top:${n.y}px;width:${n.sx*100}px;height:${n.sy*40}px;background:${n.color};color:white;font-size:${n.fontSize}px">${n.text}</button>`;
  });
  html+="</body></html>";
  codeArea.value=html;
  updateSavedTime();
}

function updateSavedTime(){
  const now = new Date();
  savedStatus.innerText=`Saved Time: ${now.getHours()}:${now.getMinutes()} @minabasem`;
}

// Auto update every 5s
setInterval(()=>{ loadCode(); updateSavedTime(); },5000);

// Initial load
loadCode();