// Project Data
let project = JSON.parse(localStorage.getItem("project") || '{"nodes":[],"files":{}}');
let undoStack = [];
let redoStack = [];

// Direct Links for Support
const DIRECT_LINKS = [
  "https://omg10.com/4/10591369",
  "https://omg10.com/4/10591326"
];

// ------------------ Node Editor Functions ------------------

// Update preview iframe and editor
function updatePreviewAndEditor() {
  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Preview</title></head><body>`;
  project.nodes.forEach(n => {
    if(n.type==="div") html += `<div id="node_${n.id}" style="position:absolute;left:${n.x}px;top:${n.y}px;width:${n.sx*100}px;height:${n.sy*100}px;background:${n.color}"></div>`;
    if(n.type==="button") html += `<button id="node_${n.id}" style="position:absolute;left:${n.x}px;top:${n.y}px;width:${n.sx*100}px;height:${n.sy*40}px;background:${n.color};color:white;font-size:${n.fontSize}px">${n.text}</button>`;
  });
  html += "</body></html>";
  document.getElementById("view").srcdoc = html;
}

// Add Node Modal
function showAddMenu(){ document.getElementById("addModal").style.display="block"; }
function closeAddMenu(){ document.getElementById("addModal").style.display="none"; }

// Add Node
function addNode(type){
  const node = {id:Date.now(), type, name:type, text:type==="button"?"Button":"", x:50, y:50, sx:1, sy:1, r:0, color:"#ff5252", fontSize:16};
  project.nodes.push(node);
  undoStack.push(JSON.stringify(project));
  updateWorld();
  updatePreviewAndEditor();
  closeAddMenu();
}

// Update World Sidebar
function updateWorld(){
  const worldItems=document.getElementById("worldItems");
  worldItems.innerHTML="";
  project.nodes.forEach(n=>{
    const el=document.createElement("div");
    el.innerText=n.name;
    const delBtn=document.createElement("button");
    delBtn.innerText="Delete";
    delBtn.onclick=()=>deleteNode(n.id);
    el.appendChild(delBtn);
    el.onclick=()=>selectNode(n.id);
    worldItems.appendChild(el);
  });
}

// Select Node
function selectNode(id){
  const n=project.nodes.find(n=>n.id===id);
  if(!n) return;
  document.getElementById("name").value=n.name;
  document.getElementById("text").value=n.text;
  document.getElementById("tx").value=n.x;
  document.getElementById("ty").value=n.y;
  document.getElementById("sx").value=n.sx;
  document.getElementById("sy").value=n.sy;
  document.getElementById("r").value=n.r;
  document.getElementById("c").value=n.color;
  document.getElementById("fontSize").value=n.fontSize;
}

// Delete Node
function deleteNode(id){
  project.nodes=project.nodes.filter(n=>n.id!==id);
  updateWorld();
  updatePreviewAndEditor();
  undoStack.push(JSON.stringify(project));
}

// Auto Save every 5s
setInterval(saveProject,5000);

// Save Project
function saveProject(){
  localStorage.setItem("project", JSON.stringify(project));
  updateFooterTime();
}

// Update Footer Time
function updateFooterTime(){
  const now=new Date();
  document.getElementById("footer").innerText=`Saved Time: ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} @minabasem`;
}

// Load Project
function loadProject(){
  project = JSON.parse(localStorage.getItem("project") || '{"nodes":[],"files":{}}');
  updateWorld();
  updatePreviewAndEditor();
}

// Undo / Redo
function undo(){
  if(undoStack.length>0){
    redoStack.push(JSON.stringify(project));
    project=JSON.parse(undoStack.pop());
    updateWorld();
    updatePreviewAndEditor();
  }
}
function redo(){
  if(redoStack.length>0){
    undoStack.push(JSON.stringify(project));
    project=JSON.parse(redoStack.pop());
    updateWorld();
    updatePreviewAndEditor();
  }
}

// ------------------ Support Functions ------------------

// Show Support Modal + open Direct Link for 30s
function showSupportModal(){
  const modal=document.getElementById("supportModal");
  modal.style.display="block";

  // Pick a random Direct Link
  const link = DIRECT_LINKS[Math.floor(Math.random()*DIRECT_LINKS.length)];
  const win = window.open(link,"_blank");

  // Close after 30s
  setTimeout(()=>{
    closeSupportModal();
    if(win && !win.closed) win.close();
    window.focus();
  }, 30000);
}

function closeSupportModal(){
  document.getElementById("supportModal").style.display="none";
}

// ------------------ Initial Render ------------------
updatePreviewAndEditor();
updateWorld();