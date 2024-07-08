import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cards from "./components/Cards";
import Crousel from "./components/Crousel";
import AdminPanel from "./pages/AdminPanel";
import Login from "./components/Login";
import Axios from "axios";
import './App.css'

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
      <Crousel/>
      <Login />
      <h1 className="text-bold">Hello world!</h1>


      <div>
        <div>Backend Data -- {data}</div>
        {/* <Login />
        <Signup/> */}
        <Router>
          <Switch>
            <Route path="/signup" component={Signup} />
            <Route path="/signin" component={Login} />
            <Route path="/admin" component={AdminPanel} />
          </Switch>
        </Router>
      </div>
      <Footer />
    </div>
  );
};

export default App;
