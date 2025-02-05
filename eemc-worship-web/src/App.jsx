import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChantList from "./components/ChantList";
import AddChant from "./components/AddChant";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChantList />} />
        <Route path="/add-chant" element={<AddChant />} />
      </Routes>
    </Router>
  );
}

export default App;

