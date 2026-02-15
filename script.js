let project = JSON.parse(localStorage.getItem("project") || '{"nodes":[],"files":{}}');
let undoStack = [];
let redoStack = [];

const iframe = document.getElementById("view");
const footer = document.getElementById("footer");

// ===== Nodes =====
function addNode(type) {
  const node = {
    id: Date.now(),
    type,
    name: type,
    text: type=="button"?"Button":"",
    x:50, y:50,
    sx:1, sy:1, r:0,
    color:"#ff5252",
    fontSize:16
  };
  project.nodes.push(node);
  undoStack.push(JSON.stringify(project));
  updateWorld();
  updatePreview();
  closeAddMenu();
}

function updateWorld() {
  const worldItems = document.getElementById("worldItems");
  worldItems.innerHTML = "";
  project.nodes.forEach(n=>{
    const el = document.createElement("div");
    el.innerText = n.name;
    el.onclick = ()=>selectNode(n.id);
    worldItems.appendChild(el);
  });
}

function selectNode(id) {
  const node = project.nodes.find(n=>n.id===id);
  if(!node) return;
  document.getElementById("name").value=node.name;
  document.getElementById("text").value=node.text;
  document.getElementById("tx").value=node.x;
  document.getElementById("ty").value=node.y;
  document.getElementById("sx").value=node.sx;
  document.getElementById("sy").value=node.sy;
  document.getElementById("r").value=node.r;
  document.getElementById("c").value=node.color;
  document.getElementById("fontSize").value=node.fontSize;
}

// ===== Inspector =====
["name","text","tx","ty","sx","sy","r","c","fontSize"].forEach(id=>{
  document.getElementById(id).addEventListener("input", e=>{
    const node = project.nodes.find(n=>n.id===project.nodes.find(n2=>n2.id===n.id)?.id);
    if(!node) return;
    if(["tx","ty","sx","sy","r","fontSize"].includes(id)) node[id]=Number(e.target.value);
    else node[id]=e.target.value;
    updatePreview();
  });
});

// ===== Preview =====
function updatePreview() {
  let html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Preview</title></head><body>`;
  project.nodes.forEach(n=>{
    if(n.type==="div")
      html+=`<div style="position:absolute;left:${n.x}px;top:${n.y}px;width:${n.sx*100}px;height:${n.sy*100}px;background:${n.color}"></div>`;
    if(n.type==="button")
      html+=`<button style="position:absolute;left:${n.x}px;top:${n.y}px;width:${n.sx*100}px;height:${n.sy*40}px;background:${n.color};color:white;font-size:${n.fontSize}px">${n.text}</button>`;
  });
  html+="</body></html>";
  iframe.srcdoc=html;
}

// ===== Save / Load =====
function saveProject() {
  localStorage.setItem("project", JSON.stringify(project));
  updateFooterTime(); // حفظ صامت فقط
}

function loadProject() {
  project = JSON.parse(localStorage.getItem("project") || '{"nodes":[],"files":{}}');
  updateWorld();
  updatePreview();
}

// ===== Undo / Redo =====
function undo(){
  if(!undoStack.length) return;
  redoStack.push(JSON.stringify(project));
  project = JSON.parse(undoStack.pop());
  updateWorld();
  updatePreview();
}
function redo(){
  if(!redoStack.length) return;
  undoStack.push(JSON.stringify(project));
  project = JSON.parse(redoStack.pop());
  updateWorld();
  updatePreview();
}

// ===== Add Modal =====
function showAddMenu(){ document.getElementById("addModal").style.display="block"; }
function closeAddMenu(){ document.getElementById("addModal").style.display="none"; }

// ===== Footer Time =====
function updateFooterTime(){
  const now = new Date();
  footer.innerText = `Saved Time: ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} @minabasem`;
}

// ===== Auto Save every 5s =====
setInterval(saveProject,5000);
updateFooterTime();

// ===== Initial =====
updateWorld();
updatePreview();