import { createMuiTheme } from '@material-ui/core';

const hccDefault = createMuiTheme({
    palette: {
        primary: {
            light: '#007ad9',
            main: '#1f3e65',
            dark: '#0d1d32',
            contrastText: '#fff'
        },
        secondary: {
            light: '#ffdf33',
            main: '#ffd700',
            dark: '#b29600'
        }
    },
    typography: {
        h2: {
            fontFamily: 'inherit',
            fontSize: '2rem',
            fontWeight: 500
        },
        body1: {
            fontFamily: 'inherit'
        }
    }
});

export default hccDefault;
