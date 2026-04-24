import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Player from "./Player";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Player />} />
        {/* <Route path="/hotspot" element={<Player />} /> */}
      </Routes>
    </Router>
  );
}

export default App;