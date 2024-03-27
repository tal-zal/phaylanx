import { useEffect } from 'react';
import { RoomPage, LandingPage, LoginPage } from "./components";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

const clearCacheData = () => {
  caches.keys().then((names) => {
      names.forEach((name) => {
          caches.delete(name);
      });
  });
  console.log("Cleared cache.");
};


function App() {
  useEffect(() => {
    // Call clearCacheData once when the component is mounted
    clearCacheData();
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<LandingPage/>} />
        <Route path="/room/:id" element={<RoomPage />} />
      </Routes>
    </Router>
  );
}

export default App;
