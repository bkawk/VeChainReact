import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import './scss/index.scss';

ReactDOM.render(
  <BrowserRouter>
    <Route render={() => (
        <Switch>
          <Route exact path='/'><App /></Route>
          <Route exact path='*'><App /></Route>
        </Switch>
    )}/>
</BrowserRouter>,
  document.getElementById('root')
);

reportWebVitals();
