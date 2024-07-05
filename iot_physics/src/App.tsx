import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import AdminPanel from './pages/AdminPanel';

const App: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route path="/signup" component={Signup} />
                <Route path="/signin" component={Signin} />
                <Route path="/admin" component={AdminPanel} />
            </Switch>
        </Router>
    );
};

export default App;
