import React from 'react'

import { Switch, Route } from 'react-router-dom';

import { Devices, Objects, Markers, Statistics, Routes, Rounds, UserProfile } from './pages';

export function RouteList() {
    return (
        <Switch>
            <Route exact path='/devices' component={Devices} />
            <Route exact path='/objects' component={Objects} />
            <Route exact path='/objects/:objectId/routes' component={Routes} />
            <Route exact path='/markers' component={Markers} />
            <Route exact path='/markers/:markerId/rounds' component={Rounds} />
            <Route exact path='/user/profile' component={UserProfile} />
            <Route path='/' component={Statistics} />
            <Route exact path='/statistics' component={Statistics} />
        </Switch>
    )
}
