import withStyles from "@material-ui/core/styles/withStyles";
import green from "@material-ui/core/colors/green";
import Fab from "@material-ui/core/Fab";

const GreenFab = withStyles({
    root: {
        color: '#fff',
        backgroundColor: green[600],
        '&:hover': {
            backgroundColor: green[700],
        },
        height: 28
    }
})(Fab);

export default GreenFab;
