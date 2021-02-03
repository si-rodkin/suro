import React from 'react'

import { Dialog as MuiDialog, DialogTitle, DialogActions, DialogContent, Button } from '@material-ui/core';

export default function Dialog({ title, children, open, close, accept, ...props }) {
    return (
        <MuiDialog open={open}>
            <div style={{ maxWidth: props.maxWidth }}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
                <DialogActions>
                    <Button onClick={close}>{props.closeLabel}</Button>
                    <Button onClick={accept} color='primary'>{props.acceptLabel}</Button>
                </DialogActions>
            </div>
        </MuiDialog>
    )
}

Dialog.defaultProps = {
    closeLabel: 'Закрыть',
    acceptLabel: 'Сохранить',
    maxWidth: '600px'
}
