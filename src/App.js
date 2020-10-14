import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Repos from './components/Repos.js';
import Commits from './components/Commits.js';          


function App() {
  return (
    <Router>
      
      <Switch>
        <Route exact path="/">
          <Repos />
        </Route>
        <Route path="/commits">
          <Commits />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;