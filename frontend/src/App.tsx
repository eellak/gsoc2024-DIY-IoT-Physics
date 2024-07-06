import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import AdminPanel from "./pages/AdminPanel";
import Login from "./components/Login";

const App: React.FC = () => {
  return (
    <div>
      <Login/>
      <Router>
        <Switch>
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Signin} />
          <Route path="/admin" component={AdminPanel} />
        </Switch>
      </Router>
      
    </div>
  );
};

export default App;
