import React, {useContext} from 'react';
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core';
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import AppState from "../stores/AppState";
import {observer} from "mobx-react";
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(2)
    },
    paper: {
        padding: theme.spacing(3),
        backgroundColor: '#f7f7f7',
    },
    insidePaper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.dark,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


const Login: React.FC = observer(() => {
    const classes = useStyles();
    const store = useContext(AppState);

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [remember, setRemember] = React.useState(false);

    const { login, auth } = store.domainStore.authStore;

    const handleLogin = async () => {
        await login(username, password);
    };

    if (auth.token) {
        return <Redirect push to="/" />
    }

    return (
         <Container component="main" maxWidth="xs" className={classes.root}>
             <Paper elevation={2} className={classes.paper}>
             <div className={classes.insidePaper}>
                 <Avatar className={classes.avatar}>
                     <LockOutlinedIcon />
                 </Avatar>
                 <Typography component="h1" variant="h5">
                     User Login
                 </Typography>
                 <form className={classes.form} noValidate>
                     <TextField
                         variant="outlined"
                         margin="normal"
                         required
                         fullWidth
                         id="email"
                         label="Email Address"
                         name="email"
                         autoComplete="email"
                         autoFocus
                         value={username}
                         onChange={(event) => setUsername(event.target.value)}
                     />
                     <TextField
                         variant="outlined"
                         margin="normal"
                         required
                         fullWidth
                         name="password"
                         label="Password"
                         type="password"
                         id="password"
                         autoComplete="current-password"
                         value={password}
                         onChange={(event) => setPassword(event.target.value)}
                     />
                     <FormControlLabel
                         control={<Checkbox value="remember" color="primary" checked={remember} onClick={() => setRemember(!remember)} />}
                         label="Remember me"
                     />
                     <Button
                         fullWidth
                         variant="contained"
                         color="primary"
                         className={classes.submit}
                         onClick={handleLogin}
                     >
                         Sign In
                     </Button>
                 </form>
             </div>
             </Paper>
         </Container>
    )
});

export default Login;
