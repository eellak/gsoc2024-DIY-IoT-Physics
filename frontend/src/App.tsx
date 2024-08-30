import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Crousel from "./components/Crousel";
import Booking from "./components/Booking";
import { auth } from "./firebaseConfig"; // Import Firebase auth
import { useHistory } from "react-router-dom";
import "./App.css";

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setUser(null);
        // Redirect to homepage
        const history = useHistory();
        history.push("/some-path"); // Updated
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar user={user} />
          <div className="flex-grow">
            <Switch>
              <Route path="/signin">
                <Signin />
              </Route>
              <Route path="/signup">
                <Signup />
              </Route>
              <Route path="/book_slot">
                {user ? <Booking /> : <Redirect to="/signin" />}
              </Route>
              <Route path="/" component={Crousel} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </div>
  );
};

export default App;
