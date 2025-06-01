import { io } from "socket.io-client";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import Register from "./pages/Register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SocketContext from "./context/SocketContext";
import { useSelector } from "react-redux";
const { VITE_API_ENDPOINT } = import.meta.env;
// socket
const socket = io(VITE_API_ENDPOINT.split("/api/v1")[0], {
  autoConnect: true,
  debug: true,
});

function App() {
  const { user } = useSelector((store) => store.user);
  const { access_token: token } = user;
  return (
    <div className="dark">
      <SocketContext.Provider value={socket}>
        <Router>
          <Routes>
            <Route
              exact
              path="/"
              element={
                token ? <Home socket={socket} /> : <Navigate to="/login" />
              }
            />
            <Route
              exact
              path="/login"
              element={!token ? <Login /> : <Navigate to="/" />}
            />
            <Route
              exact
              path="/register"
              element={!token ? <Register /> : <Navigate to="/" />}
            />
          </Routes>
        </Router>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
