import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useHistory,
} from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Navbar from "./components/Navbar";
import Admin from "./components/Admin";
import Footer from "./components/Footer";
import Crousel from "./components/Crousel";
import Booking from "./components/Booking";
import { auth, db } from "./firebaseConfig"; 
import { collection, getDocs, query, where } from "firebase/firestore";
import "./App.css";

// Access Denied Popup Component
const AccessDeniedPopup = () => {
  useEffect(() => {
    alert('Access Denied: You do not have administrator permissions.');
  }, []);
  
  return null; 
};

const App = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);
  const history = useHistory(); 

  // Check if user is an admin
  const checkAdminStatus = async (userEmail) => {
    if (!userEmail) return false;
    
    try {
      const adminQuery = query(collection(db, 'admins'), where("email", "==", userEmail));
      const querySnapshot = await getDocs(adminQuery);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const adminStatus = await checkAdminStatus(currentUser.email);
        setIsAdmin(adminStatus);
      } else {
        setUser(null);
        setIsAdmin(false);
        history.push("/"); // Redirect to homepage incase
      }
    });
    return () => unsubscribe();
  }, [history]);


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
              <Route path="/admin">
                {user && isAdmin ? (
                  <Admin />
                ) : user ? (
                  <>
                    <AccessDeniedPopup />
                    <Redirect to="/" />
                  </>
                ) : (
                  <Redirect to="/signin" />
                )}
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
