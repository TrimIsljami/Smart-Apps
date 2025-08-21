import { openDB } from "idb";

export async function getDB() {
  return openDB("smart-pantry", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("pending")) {
        db.createObjectStore("pending", { keyPath: "id", autoIncrement: true });
      }
    },
  });
}

export async function savePendingItem(item) {
  const db = await getDB();
  await db.add("pending", item);
}

export async function getAllPendingItems() {
  const db = await getDB();
  return db.getAll("pending");
}

export async function clearPendingItem(id) {
  const db = await getDB();
  await db.delete("pending", id);
}
