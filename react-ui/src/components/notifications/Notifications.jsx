import React from 'react'

import { Avatar, Badge } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';

function Notifications() {
    return (
        <div style={{marginRight: '15px'}} >
            <Badge>
                <NotificationsIcon />
            </Badge>
        </div>
    )
}

export default Notifications
