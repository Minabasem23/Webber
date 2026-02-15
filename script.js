// استرجاع المشروع من localStorage
let project = JSON.parse(localStorage.getItem("project") || '{"nodes":[],"files":{}}');

// تحديث الـ Preview و الـ Text Area الخاص بالكود
function updatePreviewAndEditor() {
  // إنشاء كود HTML مع nodes
  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Preview</title></head><body>`;
  
  project.nodes.forEach(n => {
    if (n.type === "div") {
      html += `<div style="position:absolute;left:${n.x}px;top:${n.y}px;width:${n.sx * 100}px;height:${n.sy * 100}px;background:${n.color}"></div>`;
    }
    if (n.type === "button") {
      html += `<button style="position:absolute;left:${n.x}px;top:${n.y}px;width:${n.sx * 100}px;height:${n.sy * 40}px;background:${n.color};color:white;font-size:${n.fontSize}px">${n.text}</button>`;
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

// وظيفة حفظ المشروع
function saveProject() {
  localStorage.setItem("project", JSON.stringify(project));
  updateFooterTime(); // فقط لتحديث الوقت في Footer
}

// وظيفة نسخ الكود
function copyCode() {
  const editor = document.getElementById("editor");
  editor.select();
  document.execCommand('copy');
  alert("Code copied!");
}

// تحديث الوقت في Footer
function updateFooterTime() {
  const now = new Date();
  const footer = document.getElementById("footer");
  footer.innerText = `Saved Time: ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} @minabasem`;
}

// تحديث العرض و المحرر
updatePreviewAndEditor();

// Auto Save every 5s
setInterval(saveProject, 5000);