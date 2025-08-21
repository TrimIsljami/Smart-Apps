import styles from "../css/PantryPage.module.css";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
   collection,
   query,
   onSnapshot,
   addDoc,
   updateDoc,
   deleteDoc,
   doc,
   serverTimestamp,
   orderBy,
} from "firebase/firestore";
import Modal from "../components/Modal";
import LoginButton from "../components/LoginButton";
import CameraCapture from "../components/CameraCapture";
import BarcodeScanner from "../components/BarcodeScanner";
import LoadSavedPhoto from "../components/LoadSavedPhoto";

export default function PantryPage() {
   const [user, setUser] = useState(null);
   const [items, setItems] = useState([]);
   const [stores, setStores] = useState([]);

   const [openAdd, setOpenAdd] = useState(false);
   const [openCamera, setOpenCamera] = useState(false);
   const [openScan, setOpenScan] = useState(false);
   const [editingId, setEditingId] = useState(null);

   const [form, setForm] = useState({
      name: "",
      qty: 1,
      minQty: 1,
      barcode: "",
      storeId: "",
      image_file: "",
   });

   const nameRef = useRef(null);

   useEffect(() => {
      return onAuthStateChanged(auth, (u) => setUser(u ?? null));
   }, []);

   useEffect(() => {
      if (!user) return setStores([]);
      const qRef = query(
         collection(db, "User", user.uid, "Stores"),
         orderBy("name", "asc")
      );
      return onSnapshot(qRef, (snap) =>
         setStores(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      );
   }, [user]);

   useEffect(() => {
      if (!user) return setItems([]);
      const qRef = query(
         collection(db, "User", user.uid, "Pantry"),
         orderBy("name", "asc")
      );
      return onSnapshot(qRef, (snap) =>
         setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      );
   }, [user]);

   const resetForm = () =>
      setForm({
         name: "",
         qty: 1,
         minQty: 1,
         barcode: "",
         storeId: "",
         image_file: "",
      });

   const addItem = async () => {
      if (!user) {
         alert("Please log in to add items.");
         return;
      }
      if (!form.name.trim()) {
         alert("Item name is required.");
         return;
      }
      try {
         await addDoc(collection(db, "User", user.uid, "Pantry"), {
            ...form,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
         });
         resetForm();
         setOpenAdd(false);
      } catch (err) {
         console.error("Error adding item:", err);
         alert("Could not save item: " + err.message);
      }
   };

   const saveChanges = async () => {
      if (!user || !editingId) return;
      try {
         await updateDoc(doc(db, "User", user.uid, "Pantry", editingId), {
            ...form,
            updatedAt: serverTimestamp(),
         });
         resetForm();
         setEditingId(null);
         setOpenAdd(false);
      } catch (err) {
         console.error("Error saving changes:", err);
         alert("Could not update item: " + err.message);
      }
   };

   const deleteItem = async (id, image_file) => {
      if (!user) return;
      try {
         await deleteDoc(doc(db, "User", user.uid, "Pantry", id));

         if (image_file) {
            localStorage.removeItem(`photo-${image_file}`);
         }
      } catch (err) {
         console.error("Error deleting item:", err);
         alert("Could not delete item: " + err.message);
      }
   };

   const handleCaptured = ({ id }) => {
      setForm((f) => ({ ...f, image_file: id }));
      setOpenCamera(false);
   };

   const onBarcodeDetected = (code) => {
      const existingItem = items.find((item) => item.barcode === code);

      if (existingItem) {
         setEditingId(existingItem.id);
         setForm(existingItem);
         setOpenScan(false);
         setOpenAdd(true);
      } else {
         setForm((f) => ({ ...f, barcode: code }));
         setEditingId(null);
         setOpenScan(false);
         setOpenAdd(true);
      }
   };

   const changeQty = async (item, delta) => {
      if (!user) return;
      const newQty = Math.max(0, (item.qty || 0) + delta);
      try {
         await updateDoc(doc(db, "User", user.uid, "Pantry", item.id), {
            qty: newQty,
            updatedAt: serverTimestamp(),
         });
      } catch (err) {
         console.error("Error updating quantity:", err);
      }
   };

   return (
      <div className={styles.container}>
         <div className={styles.topBar}>
            <div className={styles.titleRow}>
               <h1>Pantry</h1>
               <Link to="/settings" className={styles.settingsBtn}>⚙</Link>
               <LoginButton user={user} />
            </div>
            <div className={styles.actionBar}>
               <Link to="/stores" className={styles.buttonSecondary}>Go to Stores</Link>
               <button
                  onClick={() => {
                     resetForm();
                     setEditingId(null);
                     setOpenAdd(true);
                     setTimeout(() => nameRef.current?.focus(), 75);
                  }}
                  className={styles.buttonSecondary}
                  disabled={!user}
               >
                  + Add Item
               </button>
               <button
                  onClick={() => setOpenScan(true)}
                  className={styles.buttonPrimary}
                  disabled={!user}
               >
                  📷 Scan Barcode
               </button>
            </div>
         </div>
         <div className={styles.grid}>
            {!user ? (
               <p>Please log in to manage your pantry.</p>
            ) : (
               items.map((item) => (
                  <div key={item.id} className={styles.card}>
                     <div className={styles.cardImageWrap}>
                        {item.image_file ? (
                           <LoadSavedPhoto id={item.image_file} />
                        ) : (
                           <div className={styles.noImage}>No image</div>
                        )}
                     </div>

                     <div className={styles.cardInfo}>
                        <div className={styles.itemName}>{item.name}</div>
                        <div className={styles.itemQty}>
                           <button
                              onClick={() => changeQty(item, -1)}
                              className={styles.qtyBtn}
                           >
                              ➖
                           </button>
                           <span className={styles.qtyNumber}>{item.qty}</span>
                           <button
                              onClick={() => changeQty(item, +1)}
                              className={styles.qtyBtn}
                           >
                              ➕
                           </button>
                        </div>
                        <div className={styles.itemStore}>
                           {item.storeId
                              ? stores.find((s) => s.id === item.storeId)?.name || "Unknown"
                              : "No Store"}
                        </div>

                        {item.barcode && (
                           <div className={styles.itemBarcode}>
                              <span>Barcode:</span> {item.barcode}
                           </div>
                        )}

                        <div className={styles.cardActions}>
                           <button
                              onClick={() => {
                                 setEditingId(item.id);
                                 setForm(item);
                                 setOpenAdd(true);
                              }}
                           >
                              Modify
                           </button>
                           <button
                              onClick={() => deleteItem(item.id, item.image_file)}
                              className={styles.deleteBtn}
                           >
                              🗑
                           </button>
                        </div>
                     </div>
                  </div>
               ))
            )}
         </div>

         <Modal
            open={openAdd}
            onClose={() => setOpenAdd(false)}
            title={editingId ? "Edit Item" : "Add Item"}
         >
            <label className={styles.label}>Name</label>
            <input
               ref={nameRef}
               className={styles.input}
               value={form.name}
               onChange={(e) => setForm({ ...form, name: e.target.value })}
               placeholder="e.g. Pasta"
            />

            <label className={styles.label}>Quantity</label>
            <input
               className={styles.input}
               type="number"
               min="0"
               value={form.qty}
               onChange={(e) =>
                  setForm({ ...form, qty: Number(e.target.value) })
               }
            />

            <label className={styles.label}>Min quantity</label>
            <input
               className={styles.input}
               type="number"
               min="0"
               value={form.minQty}
               onChange={(e) =>
                  setForm({ ...form, minQty: Number(e.target.value) })
               }
            />

            <label className={styles.label}>Preferred Store</label>
            <select
               className={styles.input}
               value={form.storeId}
               onChange={(e) => setForm({ ...form, storeId: e.target.value })}
            >
               <option value="">No preferred store</option>
               {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                     {s.name}
                  </option>
               ))}
            </select>

            <label className={styles.label}>Item Photo</label>
            {form.image_file ? (
               <div className={styles.photoWrap}>
                  <LoadSavedPhoto id={form.image_file} />
                  <div className={styles.photoActions}>
                     <button
                        onClick={() => setOpenCamera(true)}
                        className={styles.buttonSecondary}
                     >
                        Retake
                     </button>
                     <button
                        onClick={() => setForm({ ...form, image_file: "" })}
                        className={styles.buttonSecondary}
                     >
                        Remove
                     </button>
                  </div>
               </div>
            ) : (
               <button
                  onClick={() => setOpenCamera(true)}
                  className={styles.buttonSecondary}
               >
                  Take Picture
               </button>
            )}

            <label className={styles.label}>Barcode (optional)</label>
            <div className={styles.barcodeRow}>
               <input
                  className={styles.input}
                  value={form.barcode}
                  onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                  placeholder="Scan or type"
               />
               <button
                  onClick={() => setOpenScan(true)}
                  className={styles.buttonSecondary}
               >
                  📷 Scan Barcode
               </button>
            </div>

            <div className={styles.modalActions}>
               {editingId ? (
                  <button onClick={saveChanges} className={styles.primaryAction}>
                     Save Changes
                  </button>
               ) : (
                  <button onClick={addItem} className={styles.primaryAction}>
                     Save
                  </button>
               )}
               <button
                  className={styles.buttonSecondary}
                  onClick={() => setOpenAdd(false)}
               >
                  Cancel
               </button>
            </div>
         </Modal>
         
         <Modal
            open={openCamera}
            onClose={() => setOpenCamera(false)}
            title="Take a Photo"
         >
            <CameraCapture onSave={handleCaptured} />
         </Modal>

         <Modal
            open={openScan}
            onClose={() => setOpenScan(false)}
            title="Scan Barcode"
         >
            <BarcodeScanner onScan={onBarcodeDetected} />
         </Modal>
      </div>
   );
}
