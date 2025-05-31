import { io } from "socket.io-client";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import Register from "./pages/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SocketContext from "./context/SocketContext";
const { VITE_API_ENDPOINT } = import.meta.env;
// socket
const socket = io(VITE_API_ENDPOINT.split("/api/v1")[0], {
  autoConnect: true,
  debug: true,
});

function App() {
  // const { user } = useSelector((store) => store.user);
  return (
    <div className="dark">
      <SocketContext.Provider value={socket}>
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<LoginPage />} />
            <Route exact path="/register" element={<Register />} />
          </Routes>
        </Router>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
