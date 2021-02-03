import React from 'react'

// TODO
export default function ItemList({ label, key, value, onChange, isItemChecked, options }) {
    return (
        <div>
            <Typography style={{ marginTop: '25px' }} component='h6'>
                {label}
            </Typography>
            <List>
                {options.map(option => {
                    return (
                        <ListItem dense button onClick={() => onChange(option)}>
                            <ListItemIcon>
                                <Checkbox
                                    edge='start'
                                    checked={isItemChecked}
                                    tabIndex={-1}
                                    disableRipple
                                />
                            </ListItemIcon>
                            <ListItemText primary={`${option.name}`} />
                        </ListItem>
                    )
                })}
            </List>
        </div>
    )
}
