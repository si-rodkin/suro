import React from 'react'
import { connect } from 'react-redux';

import { Switch, Route } from 'react-router-dom';

import { Devices, Objects, Markers, Statistics, Routes, Rounds, UserProfile, Employees } from './pages';

function RouteList({is_lead}) {
    return (
        <Switch>
            <Route exact path='/devices' component={Devices} />
            <Route exact path='/objects' component={Objects} />
            <Route exact path='/objects/:objectId/routes' component={Routes} />
            <Route exact path='/markers' component={Markers} />
            <Route exact path='/markers/:markerId/rounds' component={Rounds} />
            <Route exact path='/user/profile' component={UserProfile} />
            {is_lead && <Route exact path='/employees' component={Employees} />}
            {is_lead && <Route exact path='/employee/:uid/employees' component={Employees} />}
            <Route path='/' component={Statistics} />
            <Route exact path='/statistics' component={Statistics} />
        </Switch>
    )
}

const mapStateToProps = (state) => {
    return {
        is_lead: state.user?.is_leading
    }
}

export default connect(mapStateToProps, null)(RouteList)
