import { BrowserRouter as Router, Route, Switch, Redirect, useRouteMatch, useHistory, withRouter } from "react-router-dom"; 
import { useEffect, useState } from 'react';

import { config } from './config';
import WelcomingPage from "./pages/WelcomPage";

import './App.scss';

function App(_props) {
  const [ rendered, setRendered ] = useState(false);

  useEffect(() => {
    if (!rendered) {
      setTimeout(() => {
        setRendered(true);
        localStorage.setItem('s-login', '1');
      }, 250);
    }
  });

  return (
    <Router basename={config.baseHref}>
      <Switch>
        <Route exact path="/" render={ () => (<Redirect to="/welcome" />) } />
        <Route path="/welcome" component={ WelcomingPage } />
        <Route render={() => (<Redirect to="/" />)}/>
      </Switch>
    </Router>
  );
}

export default App;
