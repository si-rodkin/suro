import React from 'react';

import { connect } from 'react-redux';

import { Container } from '@material-ui/core';

import { withRouter, Switch, Route } from 'react-router-dom';

import { Header } from './components';
import { Devices, Objects, Markers, Statistics, Routes, Rounds } from './pages';
import * as actions from './store/actions/auth';

// TODO: создать список разделов, на бэке список разделов разрешенных для конкретного пользователя

function App({isAuthenticated, onAuth, tryAutoAuth}) {
  tryAutoAuth();
  return (
    <Container>
      <Header isAuthenticated={isAuthenticated} onAuth={onAuth} />
      { isAuthenticated && (
      <Switch>
        <Route exact path='/devices' component={Devices} />
        <Route exact path='/objects' component={Objects} />
        <Route exact path='/objects/:objectId/routes' component={Routes} />
        <Route exact path='/markers' component={Markers} />
        <Route exact path='/markers/:markerId/rounds' component={Rounds} />
        <Route path='/' component={Statistics} />
        <Route exact path='/statistics' component={Statistics} />
      </Switch>)
    }
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    tryAutoAuth: () => {
      dispatch(actions.authCheckState());
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
