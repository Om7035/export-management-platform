import "@/styles/globals.css";
// pages/_app.js or a global CSS file
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS globally
import "../styles/globals.css"; // Your custom global styles


export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
