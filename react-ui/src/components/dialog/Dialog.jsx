import React from 'react'

import { Dialog as MuiDialog, DialogTitle, DialogActions, DialogContent, Button } from '@material-ui/core';

export default function Dialog({ title, children, open, ...props }) {
    return (
        <MuiDialog open={open}>
            <div style={{ maxWidth: props.maxWidth }}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
                <DialogActions>
                    {props.buttons.map(button => (
                        <Button onClick={button.action} disabled={button.disabled? button.disabled() : false} color={button.color}>{button.label}</Button>
                    ))}
                </DialogActions>
            </div>
        </MuiDialog>
    )
}

Dialog.defaultProps = {
    buttons: [
        {
            label: 'Закрыть',
            action: () => window.alert('Переопределите кнопку!')
        },
        {
            label: 'Сохранить',
            action: () => window.alert('Переопределите кнопку!'),
            color: 'primary'
        }
    ],
    maxWidth: '600px',
    disabled: () => false
}
