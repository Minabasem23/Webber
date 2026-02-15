// استرجاع المشروع من localStorage
let project = JSON.parse(localStorage.getItem("project") || '{"nodes":[],"files":{}}');

// تحديث الـ Preview والـ TextArea
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
  const previewFrame = document.getElementById("view");
  previewFrame.srcdoc = html;
}

// فتح نافذة الـ Support
function showSupportModal() {
  const modal = document.getElementById("supportModal");
  modal.style.display = "block";

  // بعد 30 ثانية نغلق الـ Modal و نرجع للصفحة الرئيسية
  setTimeout(() => {
    closeSupportModal();
  }, 30000); // بعد 30 ثانية
}

// إغلاق نافذة الـ Support
function closeSupportModal() {
  const modal = document.getElementById("supportModal");
  modal.style.display = "none";
}

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

// تحديث الـ Preview و الـ Text Area
updatePreviewAndEditor();