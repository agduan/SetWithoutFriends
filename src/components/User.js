import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import { colors } from "../util";

const useStyles = makeStyles(() => ({
  rating: {
    display: "inline-block",
    width: "3em",
    marginRight: "0.5em",
    borderRadius: "5px",
    color: "white",
    backgroundColor: "dodgerblue",
    fontSize: "1em",
    textAlign: "center",
  },
}));

function User({ name, rating, color }) {
  const classes = useStyles();
  const theme = useTheme();
  const isDark = theme.palette.type === "dark";

  const textColor = color && Object.hasOwn(colors, color)
    ? colors[color][isDark ? 100 : 900]
    : "inherit";

  return (
    <span style={{ fontWeight: 500, color: textColor }}>
      <span className={classes.rating}>{rating}</span>
      <span>{name}</span>
    </span>
  );
}

export default User;
