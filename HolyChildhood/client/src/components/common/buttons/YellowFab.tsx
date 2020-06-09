import withStyles from "@material-ui/core/styles/withStyles";
import Fab from "@material-ui/core/Fab";
import amber from "@material-ui/core/colors/amber";

const YellowFab = withStyles({
    root: {
        color: '#000',
        backgroundColor: amber[600],
        '&:hover': {
            backgroundColor: amber[700],
        },
        height: 26,
        textTransform: "none"
    }
})(Fab);

export default YellowFab;
