import React from 'react'

function Login() {
    return (
        <div>
            <Dialog open={authDialogOpen}>
                    <DialogTitle>Авторизация</DialogTitle>
                    <DialogContent>
                        <TextField label='Логин' margin='dense' autoFocus fullWidth onInput={(e) => updateCredentials({...credentials, username: e.target.value})}/>
                        <TextField label='Пароль' margin='dense' type='password' fullWidth onInput={(e) => updateCredentials({...credentials, password: e.target.value})}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setAuthDialogOpen(false)}>Закрыть</Button>
                        <Button onClick={authHandle} color='primary'>Войти</Button>
                    </DialogActions>
                </Dialog>
        </div>
    )
}

export default Login
