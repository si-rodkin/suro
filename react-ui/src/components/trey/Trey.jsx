import React from 'react'

import { Badge } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';

import './Trey.css';

function Notifications() {

    return (
        <div className='TreyIcon' >
            <Badge>
                <NotificationsIcon />
            </Badge>
        </div>
    )
}

export default Notifications
