import { useContext, useEffect, useMemo, useRef, useState } from "react";
import useSound from "use-sound";

import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import Link from "@material-ui/core/Link";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import Hidden from "@material-ui/core/Hidden";
import SettingsIcon from "@material-ui/icons/Settings";
import RefreshIcon from "@material-ui/icons/Refresh";
import AlarmIcon from "@material-ui/icons/Alarm";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import failSfx1 from "../assets/failedSetSound1.mp3";
import failSfx2 from "../assets/failedSetSound2.mp3";
import failSfx3 from "../assets/failedSetSound3.mp3";
import foundSfx from "../assets/successfulSetSound.mp3";
import Game from "../components/Game";
import SettingsDialog from "../components/SettingsDialog";
import SnackContent from "../components/SnackContent";
import { SettingsContext } from "../context";
import {
  addCard,
  computeState,
  eventFromCards,
  findSet,
  generateDeck,
  makeRandom,
  modes,
  removeCard,
} from "../game";
import { formatANoun, formatTime } from "../util";
import Subheading from "../components/Subheading";
import User from "../components/User";
import GameRecord from "../components/GameRecord";

const useStyles = makeStyles((theme) => ({
  mainColumn: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  snackbar: {
    [theme.breakpoints.down("sm")]: {
      bottom: 4,
    },
  },
  doneOverlay: {
    position: "absolute",
    width: "calc(100% - 16px)",
    height: "calc(100% - 16px)",
    borderRadius: 4,
    background: "rgba(0, 0, 0, 0.5)",
    transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  doneModal: {
    padding: theme.spacing(3),
    textAlign: "center",
  },
  sidebar: {
    padding: theme.spacing(2),
    height: "100%",
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },
  timer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  alarm: {
    color: red[700],
    marginRight: 10,
    marginBottom: 3,
  },
  footer: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

// Generate a seed for the random number generator
function generateSeed() {
  const hex = () => Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, '0');
  return `v1:${hex()}${hex()}${hex()}${hex()}`;
}

function GamePage() {
  const { volume, setVolume, layoutOrientation, cardOrientation } = useContext(SettingsContext);
  const classes = useStyles();

  const [gameMode, setGameMode] = useState("normal");
  const [selected, setSelected] = useState([]);
  const clearSelected = useRef(false);
  const [snack, setSnack] = useState({ open: false });
  const [score, setScore] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [gameEndTime, setGameEndTime] = useState(null);
  
  // Initialize game data
  const [gameData, setGameData] = useState(() => {
    const seed = generateSeed();
    const random = makeRandom(seed);
    const deck = generateDeck(gameMode, random);
    return {
      seed,
      deck,
      events: {},
    };
  });

  const [playSuccess] = useSound(foundSfx);
  const [playFail1] = useSound(failSfx1);
  const [playFail2] = useSound(failSfx2);
  const [playFail3] = useSound(failSfx3);
  const playFail = () =>
    [playFail1, playFail2, playFail3][Math.floor(Math.random() * 3)]();

  // Update timer every second
  useEffect(() => {
    if (gameEndTime) return;
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [gameEndTime]);

  const { random, deck } = useMemo(() => {
    const random = makeRandom(gameData.seed);
    return {
      random,
      deck: gameData.deck,
    };
  }, [gameData.seed, gameData.deck]);

  const {
    current,
    scores,
    board,
    answer,
    findState,
    history,
  } = useMemo(() => {
    if (!gameData) return {};
    const state = computeState({ ...gameData, random, deck }, gameMode);
    const { current, boardSize, findState, history } = state;
    const board = current.slice(0, boardSize);
    const answer = findSet(board, gameMode, findState);
    return { ...state, board, answer, findState, history };
  }, [gameMode, gameData, random, deck]);

  const gameEnded = !answer;

  useEffect(() => {
    if (gameEnded && !gameEndTime) {
      setGameEndTime(Date.now());
    }
  }, [gameEnded, gameEndTime]);

  function handleSet(cards) {
    const timestamp = Date.now();
    const event = {
      ...eventFromCards(cards),
      user: "player",
      time: timestamp,
    };
    
    // Add event to game data
    setGameData((prevData) => ({
      ...prevData,
      events: {
        ...prevData.events,
        [timestamp]: event,
      },
    }));
    
    setScore((s) => s + 1);
  }

  function handleClick(card) {
    if (gameEnded) {
      return;
    }

    setSelected((selected) => {
      if (clearSelected.current) {
        selected = [];
        clearSelected.current = false;
      }
      if (selected.includes(card)) {
        return gameMode === "memory" ? selected : removeCard(selected, card);
      }
      const state = addCard(selected, card, gameMode, findState);
      switch (state.kind) {
        case "pending":
          return state.cards;
        case "set":
          handleSet(state.cards);
          if (volume === "on") playSuccess();
          setSnack({
            open: true,
            variant: "success",
            message: `Found ${formatANoun(state.setType)}`,
          });
          return [];
        case "error":
          if (volume === "on") playFail();
          setSnack({
            open: true,
            variant: "error",
            message: state.error,
          });
          if (gameMode === "memory") {
            clearSelected.current = true;
            return state.cards;
          }
          return [];
        default:
          return selected;
      }
    });
  }

  function handleClear() {
    setSelected([]);
  }

  function handleClose(event, reason) {
    if (reason === "clickaway") return;
    setSnack({ ...snack, open: false });
  }

  function handleNewGame(newMode) {
    const seed = generateSeed();
    const random = makeRandom(seed);
    const deck = generateDeck(newMode || gameMode, random);
    setGameData({
      seed,
      deck,
      events: {},
    });
    setScore(0);
    setGameStartTime(Date.now());
    setSelected([]);
    if (newMode) {
      setGameMode(newMode);
    }
    setGameEndTime(null);
  }

  const elapsedTime = (gameEndTime || currentTime) - gameStartTime;

  // Calculate chat height based on layout settings
  const isLandscape = layoutOrientation === "landscape";
  const isHorizontal = cardOrientation === "horizontal";
  
  // Estimate game board height based on layout
  // These values match the typical board dimensions for different configurations
  // The game board adds 19px when showing "remaining cards" text
  let chatHeight;
  if (isLandscape) {
    chatHeight = isHorizontal ? 400 : 294;
  } else {
    chatHeight = isHorizontal ? 600 : 475;
  }
  // Add extra height for the "remaining cards" text at bottom of game board
  if (current && board) {
    const hasRemainingText = current.length - board.length >= 0;
    if (hasRemainingText) {
      chatHeight += 19;
    }
  }

  return (
    <Container>
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        classes={{ root: classes.snackbar }}
        open={snack.open}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <SnackContent
          variant={snack.variant || "info"}
          message={snack.message || ""}
          onClose={handleClose}
        />
      </Snackbar>

      {/* Header */}
      <AppBar position="relative" color="transparent" elevation={0}>
        <Toolbar 
          variant="dense" 
          style={{ 
            minHeight: 48,
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
            paddingBottom: 0
          }}
        >
          <Typography variant="h6" style={{ flexGrow: 1, whiteSpace: "nowrap", margin: 0 }}>
            Set without Friends
          </Typography>
          <IconButton
            onClick={() => setVolume(volume === "on" ? "off" : "on")}
            color="inherit"
            title={volume === "on" ? "Mute sounds" : "Unmute sounds"}
            size="small"
            style={{ marginRight: 8 }}
          >
            {volume === "on" ? <VolumeUpIcon /> : <VolumeOffIcon />}
          </IconButton>
          <IconButton
            onClick={() => setSettingsOpen(true)}
            color="inherit"
            title="Settings"
            size="small"
            style={{ marginRight: 0 }}
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Grid container spacing={2}>
        <Box clone order={{ xs: 1, sm: 2 }} position="relative">
          <Grid item xs={12} sm={8} md={6} className={classes.mainColumn}>
            {/* Backdrop; active when the game ends */}
            <div
              className={classes.doneOverlay}
              style={{ display: gameEnded ? "flex" : "none" }}
            >
              <Paper elevation={3} className={classes.doneModal}>
                <Typography variant="h5" gutterBottom>
                  Game complete!
                </Typography>
                <Typography variant="body1">
                  {score} sets found
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleNewGame()}
                  style={{ marginTop: 12 }}
                >
                  New Game
                </Button>
              </Paper>
            </div>

            {/* Game area itself */}
            <Game
              board={board}
              selected={selected}
              onClick={handleClick}
              onClear={handleClear}
              lastSet={[]}
              remaining={current.length - board.length}
              faceDown={gameMode === "memory" ? "deal" : ""}
            />
          </Grid>
        </Box>
        <Box clone order={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} md={3}>
            <Paper className={classes.sidebar}>
              <div className={classes.timer} style={{ marginTop: 6 }}>
                <AlarmIcon className={classes.alarm} fontSize="large" />
                <Typography variant="h4" align="center">
                  {formatTime(elapsedTime, !gameEnded)}
                </Typography>
              </div>
              <Divider style={{ margin: "8px 0" }} />
              <Subheading>Scoreboard</Subheading>
              <List dense disablePadding>
                <ListItem>
                  <ListItemIcon>
                    <SportsEsportsIcon />
                  </ListItemIcon>
                  <ListItemText
                    disableTypography
                    primary={<User name="You" rating={1200} color="red" />}
                  />
                  <ListItemText
                    primary={<strong>{score}</strong>}
                    style={{
                      flex: "0 0 36px",
                      textAlign: "right",
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SportsEsportsIcon />
                  </ListItemIcon>
                  <ListItemText
                    disableTypography
                    primary={<User name="Alexandra" rating={2882} color="blue" />}
                  />
                  <ListItemText
                    primary={<strong>∞</strong>}
                    style={{
                      flex: "0 0 36px",
                      textAlign: "right",
                    }}
                  />
                </ListItem>
              </List>
              <Box mt={3}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="mode-select-label">Game Mode</InputLabel>
                  <Select
                    labelId="mode-select-label"
                    value={gameMode}
                    onChange={(e) => handleNewGame(e.target.value)}
                    label="Game Mode"
                  >
                    {Object.keys(modes).map((mode) => (
                      <MenuItem key={mode} value={mode}>
                        {modes[mode].name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleNewGame()}
                >
                  Restart
                </Button>
              </Box>

            </Paper>
          </Grid>
        </Box>
        {/* Mobile game record under timer/scoreboard */}
        <Hidden smUp>
          <Box clone order={{ xs: 3 }}>
            <Grid item xs={12}>
              <Paper style={{ display: "flex", height: chatHeight, padding: 8, overflow: "hidden" }}>
                <GameRecord
                  history={history}
                  gameMode={gameMode}
                  startedAt={gameStartTime}
                />
              </Paper>
            </Grid>
          </Box>
        </Hidden>
        <Hidden xsDown>
          <Grid
            item
            xs={12}
            sm={4}
            md={3}
            order={{ xs: 3, sm: 1 }}
          >
            <Paper style={{ display: "flex", height: chatHeight, padding: 8, overflow: "hidden" }}>
              <GameRecord
                history={history}
                gameMode={gameMode}
                startedAt={gameStartTime}
              />
            </Paper>
          </Grid>
        </Hidden>
      </Grid>

      {/* Footer */}
      <Box className={classes.footer}>
          <Typography variant="body2">
            Made by Alexandra, whose best time is 01:17 ·{" "}
            <Link 
              href="https://github.com/agduan/SetWithoutFriends" 
              color="primary"
              underline="none"
            >
              GitHub
            </Link>
          </Typography>
      </Box>
    </Container>
  );
}

export default GamePage;
