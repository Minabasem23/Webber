// استرجاع المشروع من localStorage
let project = JSON.parse(localStorage.getItem("project") || '{"nodes":[],"files":{}}');
let undoStack = [];
let redoStack = [];

// تحديث الـ Preview و الـ Text Area الخاص بالكود
function updatePreviewAndEditor() {
  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Preview</title></head><body>`;
  
  project.nodes.forEach(n => {
    if (n.type === "div") {
      html += `<div id="node_${n.id}" style="position:absolute;left:${n.x}px;top:${n.y}px;width:${n.sx * 100}px;height:${n.sy * 100}px;background:${n.color}"></div>`;
    }
    if (n.type === "button") {
      html += `<button id="node_${n.id}" style="position:absolute;left:${n.x}px;top:${n.y}px;width:${n.sx * 100}px;height:${n.sy * 40}px;background:${n.color};color:white;font-size:${n.fontSize}px">${n.text}</button>`;
    }
  });

  html += "</body></html>";

  // تحديث الـ Preview iframe
  const previewFrame = document.getElementById("previewFrame");
  previewFrame.srcdoc = html;

  // تحديث الـ Text Area (محرر الكود)
  const editor = document.getElementById("editor");
  editor.value = html;  // وضع الكود في المحرر
}

// عندما يكتب المستخدم في الـ TextArea، نحدث الـ Preview
document.getElementById("editor").addEventListener("input", function() {
  const code = this.value;
  const previewFrame = document.getElementById("previewFrame");
  previewFrame.srcdoc = code;
});

// وظيفة إضافة عقدة (Node)
function addNode(type) {
  const node = {
    id: Date.now(), // كل Node سيكون له id فريد
    type,
    name: type,
    text: type=="button"?"Button":"",
    x: 50, y: 50,
    sx: 1, sy: 1, r: 0,
    color: "#ff5252",
    fontSize: 16
  };
  
  project.nodes.push(node);  // إضافة العقدة الجديدة إلى المشروع
  undoStack.push(JSON.stringify(project));  // إضافة نسخة للمشروع للاحتفاظ به في حالة التراجع
  updateWorld();  // تحديث قائمة العناصر
  updatePreviewAndEditor();  // تحديث الـ Preview و الـ Text Area
  closeAddMenu();  // إغلاق نافذة إضافة العقدة
}

// تحديث الـ "worldItems" في sidebar لعرض العناصر
function updateWorld() {
  const worldItems = document.getElementById("worldItems");
  worldItems.innerHTML = ""; // مسح المحتوى السابق

  project.nodes.forEach(n => {
    const el = document.createElement("div");
    el.innerText = n.name;

    // إضافة زر الحذف
    const delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.onclick = () => deleteNode(n.id); // ربط زر الحذف بالعقدة
    el.appendChild(delBtn);

    // عند الضغط على العنصر، نختاره في الـ Inspector
    el.onclick = () => selectNode(n.id);
    worldItems.appendChild(el);
  });
}

// وظيفة اختيار العقدة وتحديث الـ Inspector
function selectNode(id) {
  const node = project.nodes.find(n => n.id === id);
  if (!node) return;
  document.getElementById("name").value = node.name;
  document.getElementById("text").value = node.text;
  document.getElementById("tx").value = node.x;
  document.getElementById("ty").value = node.y;
  document.getElementById("sx").value = node.sx;
  document.getElementById("sy").value = node.sy;
  document.getElementById("r").value = node.r;
  document.getElementById("c").value = node.color;
  document.getElementById("fontSize").value = node.fontSize;
}

// وظيفة حذف عقدة
function deleteNode(id) {
  project.nodes = project.nodes.filter(n => n.id !== id); // إزالة العقدة من المشروع
  updateWorld();  // تحديث قائمة العالم
  updatePreviewAndEditor();  // تحديث العرض و المحرر
  undoStack.push(JSON.stringify(project));  // إضافة نسخة للمشروع للاحتفاظ به في حالة التراجع
}

// تحديث الـ Preview والـ TextArea كلما حدثت تغييرات
updatePreviewAndEditor();

// Auto Save every 5s
setInterval(saveProject, 5000);

// وظيفة حفظ المشروع
function saveProject() {
  localStorage.setItem("project", JSON.stringify(project));
  updateFooterTime();  // تحديث الوقت في Footer
}

// تحديث الوقت في Footer
function updateFooterTime() {
  const now = new Date();
  const footer = document.getElementById("footer");
  footer.innerText = `Saved Time: ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} @minabasem`;
}