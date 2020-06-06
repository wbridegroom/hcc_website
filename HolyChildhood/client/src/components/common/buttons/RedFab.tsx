import withStyles from "@material-ui/core/styles/withStyles";
import Fab from "@material-ui/core/Fab";
import red from "@material-ui/core/colors/red";

const RedFab = withStyles({
    root: {
        color: '#fff',
        backgroundColor: red[600],
        '&:hover': {
            backgroundColor: red[700],
        },
        height: 28
    }
})(Fab);

export default RedFab;
