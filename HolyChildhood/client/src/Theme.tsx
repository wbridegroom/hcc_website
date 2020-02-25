import { createMuiTheme } from '@material-ui/core';

const hccDefault = createMuiTheme({
    palette: {
        primary: {
            light: '#007ad9',
            main: '#1f3e65',
            dark: '#0d1d32',
            contrastText: '#fff'
        }
    },
    typography: {
        h2: {
            fontFamily: 'inherit',
            fontSize: '2rem',
            fontWeight: 500
        },
        h6: {
            fontFamily: 'inherit',
            fontSize: '1rem',
            fontWeight: 500
        },
        body1: {
            fontFamily: 'inherit'
        }
    }
});

export default hccDefault;
