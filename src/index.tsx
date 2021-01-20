import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { reportWebVitals } from './reportWebVitals';
import { GetBalance } from './routes/GetBalance';
import { NoConnex } from './routes/NoConnex';
import { NotFound } from './routes/NotFound';
import { RequestFunds } from './routes/RequestFunds';
import './scss/index.scss';

Sentry.init({
  autoSessionTracking: true,
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [ new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <BrowserRouter>
    <Route render={() => (
        <Switch>
          <Route exact path='/'><RequestFunds /></Route>
          <Route exact path='/sent/:address'><GetBalance /></Route>
          <Route exact path='/environment'><NoConnex /></Route>
          <Route exact path='*'><NotFound /></Route>
        </Switch>
    )}/>
</BrowserRouter>,
  document.getElementById('root')
);

reportWebVitals();
