import React from 'react';
import { Button, Link } from 'carbon-components-react';
import { default as Api124 } from '@carbon/icons-react/lib/API--1/24';
import Document24 from '@carbon/icons-react/lib/document/24';
import IbmCloud24 from '@carbon/icons-react/lib/ibm-cloud/24';
import Launch16 from '@carbon/icons-react/lib/launch/16';
import LogoGithub24 from '@carbon/icons-react/lib/logo--github/24';
import Header from './components/Header';
import ServiceContainer from './components/ServiceContainer';
import useScript from './hooks/useScript';
import { BrowserRouter as Router, Switch, Route,Redirect } from 'react-router-dom';
import History from './components/History/History';
import HomePage from './components/HomePage/home-page';

export const App = () => {
  useScript(
    'https://cdn.jsdelivr.net/gh/watson-developer-cloud/watson-developer-cloud.github.io@master/analytics.js',
  );

  return (
    <Router>
      <div className="app-container">
        <Switch>
          <Route exact path="/" component={History}></Route>
          <Route exact path="/history" component={History} />
          <Route exact path="/servicecontainer" component={HomePage} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
