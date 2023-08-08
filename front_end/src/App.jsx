import { useEffect, useState } from "react";
import "./App.css";
import { Link, Outlet } from "react-router-dom";
import { createContext } from "react";
import { api } from "./utilities";
import { useNavigate } from "react-router-dom";

export const userContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
  }, [user]);

  const whoAmI = async () => {
    let token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Token ${token}`;
      let response = await api.get("users/");
      setUser(response.data);
      navigate("home");
    } else {
      setUser(null);
      navigate("login");
    }
  };

  const logOut = async() => {
    let response = await api.post("users/logout/")
    if (response.status === 204) {
      localStorage.removeItem("token")
      setUser(null)
      delete api.defaults.headers.common["Authorization"];
      navigate("/login")
    }
  }

  useEffect(() => {
    whoAmI();
  }, []);

  return (
    <div id="app">
      <header>
        <nav>
          <Link to="/home">Home</Link>
          <Link to="/lists">Lists</Link>
          <button onClick={logOut}>Log out</button>
          <Link to="/">Register</Link>
          <Link to="/login">Log In</Link>
        </nav>
      </header>
      <userContext.Provider value={{ user, setUser }}>
        <Outlet />
      </userContext.Provider>
    </div>
  );
}

export default App;
