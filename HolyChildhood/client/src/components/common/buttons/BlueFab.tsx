import withStyles from "@material-ui/core/styles/withStyles";
import Fab from "@material-ui/core/Fab";
import blue from "@material-ui/core/colors/blue";


const BlueFab = withStyles({
    root: {
        color: '#fff',
        backgroundColor: blue[600],
        '&:hover': {
            backgroundColor: blue[700],
        },
        height: 28
    }
})(Fab);

export default BlueFab;
