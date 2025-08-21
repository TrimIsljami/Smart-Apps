const KEY = "pantryImages";

function loadAll() {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
  catch { return {}; }
}
function saveAll(obj) { localStorage.setItem(KEY, JSON.stringify(obj)); }

export function getImage(id) {
  const all = loadAll();
  return all[id] || null;
}

function makeId() {
  return `img_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
}
function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
}

export async function saveImage(input) {
  let dataUrl;
  if (typeof input === "string" && input.startsWith("data:")) dataUrl = input;
  else if (input instanceof Blob) dataUrl = await blobToDataURL(input);
  else throw new Error("saveImage expects Blob or data URL");

  const id = makeId();
  const all = loadAll();
  all[id] = dataUrl;
  saveAll(all);
  return id;
}

export function deleteImage(id) {
  const all = loadAll();
  if (id in all) { delete all[id]; saveAll(all); }
}
