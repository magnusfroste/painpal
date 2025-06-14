
// Check React version and useEffect presence at app startup
import React from "react";
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("React version:", React?.version);
console.log("React useEffect exists?:", typeof React?.useEffect);

createRoot(document.getElementById("root")!).render(<App />);
