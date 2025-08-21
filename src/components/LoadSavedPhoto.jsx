export default function LoadSavedPhoto({ id }) {
   const saved = localStorage.getItem(`photo-${id}`);
   if (!saved) return <p>No image found</p>;
   return <img src={saved} alt="saved" width="300" />;
}