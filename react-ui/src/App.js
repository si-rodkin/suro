import React from 'react';

import { connect } from 'react-redux';

import { Container } from '@material-ui/core';

import { withRouter } from 'react-router-dom';

import { Header } from './components';
import * as actions from './store/actions/auth';
import { RouteList } from './RouteList';

// TODO: создать список разделов, на бэке список разделов разрешенных для конкретного пользователя

function App({ isAuthenticated, onAuth, tryAutoAuth }) {
  tryAutoAuth();
  return (
    <>
      <Header isAuthenticated={isAuthenticated} onAuth={onAuth} />
      <Container>
        {isAuthenticated && (<RouteList/>) }
      </Container>
    </>
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
