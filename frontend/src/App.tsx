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
      {/* <Crousel img="./images/pendulum.jpg" name="Pendulam" text="This is pendulum"/> */}
      <Cards img="./images/pendulum.jpg" name="Pendulam" text="This is pendulum"/>
      <Cards img="./images/robotic arm.jpg" name="robotic arm" text="This is robotic arm"/>
      <Cards img="./images/light refraction reflection.jpg" name="light refraction reflection" text="This is light refraction reflection"/>
      <Cards img="./images/spring oscillator1.jpg" name="spring oscillator1" text="This is spring oscillator1"/>
      <Cards img="./images/heat energy boxes.jpg" name="heat energy boxes" text="This is heat energy boxes"/>

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
      <Footer/>
    </div>
  );
};

export default App;
