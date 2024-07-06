import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Navbar from "./components/Navbar";
import AdminPanel from "./pages/AdminPanel";
import Login from "./components/Login";
import Axios from "axios";


const App: React.FC = () => {
  const [data, setData] = useState("");
  const getData = async () => {
    const response = await Axios.get("http://localhost:5000/getData");
    setData(response.data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="App">
        <Navbar />
      </div>
      <div>
        <div>Backend Data -- {data}</div>
        <Login />
        <Router>
          <Switch>
            <Route path="/signup" component={Signup} />
            <Route path="/signin" component={Signin} />
            <Route path="/admin" component={AdminPanel} />
          </Switch>
        </Router>
      </div>
    </div>
  );
};

export default App;
