import styles from "../css/PantryPage.module.css";

export default function Modal({ open, onClose, title, children }) {
   if (!open) return null;

   return (
      <div className={styles.modalBackdrop} onClick={onClose}>
         <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
               <h2>{title}</h2>
               <button onClick={onClose} className={styles.closeButton}>
                  ✖
               </button>
            </div>
            <div className={styles.modalBody}>
               {children}
            </div>
         </div>
      </div>
   );
}
