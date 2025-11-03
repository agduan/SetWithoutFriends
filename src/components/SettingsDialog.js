import { useContext } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { makeStyles } from "@material-ui/core/styles";

import { SettingsContext } from "../context";

const useStyles = makeStyles((theme) => ({
  section: {
    marginBottom: theme.spacing(3),
  },
  formControl: {
    width: "100%",
  },
}));

function SettingsDialog({ open, onClose }) {
  const classes = useStyles();
  const {
    layoutOrientation,
    setLayoutOrientation,
    cardOrientation,
    setCardOrientation,
    keyboardLayoutName,
    setKeyboardLayoutName,
  } = useContext(SettingsContext);

  const keyboardLayouts = [
    "QWERTY",
    "AZERTY",
    "QWERTZ",
    "Dvorak",
    "Colemak",
    "Workman",
    "Neo",
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        {/* Board Layout */}
        <div className={classes.section}>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Board Layout</FormLabel>
            <RadioGroup
              value={layoutOrientation}
              onChange={(e) => setLayoutOrientation(e.target.value)}
            >
              <FormControlLabel
                value="portrait"
                control={<Radio color="primary" />}
                label="Portrait (3 columns)"
              />
              <FormControlLabel
                value="landscape"
                control={<Radio color="primary" />}
                label="Landscape (3 rows)"
              />
            </RadioGroup>
          </FormControl>
        </div>

        {/* Card Orientation */}
        <div className={classes.section}>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Card Orientation</FormLabel>
            <RadioGroup
              value={cardOrientation}
              onChange={(e) => setCardOrientation(e.target.value)}
            >
              <FormControlLabel
                value="vertical"
                control={<Radio color="primary" />}
                label="Vertical"
              />
              <FormControlLabel
                value="horizontal"
                control={<Radio color="primary" />}
                label="Horizontal (rotated 90°)"
              />
            </RadioGroup>
          </FormControl>
        </div>

        {/* Keyboard Layout */}
        <div className={classes.section}>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Keyboard Layout</FormLabel>
            <RadioGroup
              value={keyboardLayoutName}
              onChange={(e) => setKeyboardLayoutName(e.target.value)}
            >
              {keyboardLayouts.map((layout) => (
                <FormControlLabel
                  key={layout}
                  value={layout}
                  control={<Radio color="primary" />}
                  label={layout}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SettingsDialog;

