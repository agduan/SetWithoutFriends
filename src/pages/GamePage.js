import { useContext, useEffect, useMemo, useRef, useState } from "react";
import useSound from "use-sound";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import SettingsIcon from "@material-ui/icons/Settings";
import RefreshIcon from "@material-ui/icons/Refresh";

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
import { formatANoun } from "../util";

const useStyles = makeStyles((theme) => ({
  mainColumn: {
    display: "flex",
    alignItems: "center",
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
  settingsButton: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: 10,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },
}));

// Generate a seed for the random number generator
function generateSeed() {
  const hex = () => Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, '0');
  return `v1:${hex()}${hex()}${hex()}${hex()}`;
}

function GamePage() {
  const { volume } = useContext(SettingsContext);
  const classes = useStyles();

  const [gameMode, setGameMode] = useState("normal");
  const [selected, setSelected] = useState([]);
  const clearSelected = useRef(false);
  const [snack, setSnack] = useState({ open: false });
  const [score, setScore] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  
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
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
  } = useMemo(() => {
    if (!gameData) return {};
    const state = computeState({ ...gameData, random, deck }, gameMode);
    const { current, boardSize, findState } = state;
    const board = current.slice(0, boardSize);
    const answer = findSet(board, gameMode, findState);
    return { ...state, board, answer, findState };
  }, [gameMode, gameData, random, deck]);

  const gameEnded = !answer;

  function handleSet(cards) {
    const event = {
      ...eventFromCards(cards),
      user: "player",
      time: Date.now(),
    };
    
    // Add event to game data
    setGameData((prevData) => ({
      ...prevData,
      events: {
        ...prevData.events,
        [Date.now()]: event,
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
  }

  const elapsedTime = Math.floor((currentTime - gameStartTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  return (
    <Container>
      {/* Settings Button */}
      <IconButton
        className={classes.settingsButton}
        onClick={() => setSettingsOpen(true)}
        color="primary"
        title="Settings"
      >
        <SettingsIcon />
      </IconButton>

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
      <Grid container spacing={2}>
        <Box clone order={{ xs: 1, sm: 1 }} position="relative">
          <Grid item xs={12} md={9} className={classes.mainColumn}>
            {/* Backdrop; active when the game ends */}
            <div
              className={classes.doneOverlay}
              style={{ display: gameEnded ? "flex" : "none" }}
            >
              <Paper elevation={3} className={classes.doneModal}>
                <Typography variant="h5" gutterBottom>
                  Game Complete!
                </Typography>
                <Typography variant="body1">
                  Score: {score} sets
                </Typography>
                <Typography variant="body2">
                  Time: {minutes}:{seconds.toString().padStart(2, '0')}
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
              lastSet={findState.lastSet}
              remaining={current.length - board.length}
              faceDown={gameMode === "memory" ? "deal" : ""}
            />
          </Grid>
        </Box>
        <Box clone order={{ xs: 2, sm: 2 }}>
          <Grid item xs={12} md={3}>
            <Paper className={classes.sidebar}>
              <div className={classes.header}>
                <Typography variant="h6">
                  {modes[gameMode].name}
                </Typography>
              </div>
              <Typography variant="body2" paragraph>
                {modes[gameMode].description}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Score:</strong> {score}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Time:</strong> {minutes}:{seconds.toString().padStart(2, '0')}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Remaining:</strong> {current.length - board.length} cards
              </Typography>
              
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
                  startIcon={<RefreshIcon />}
                  onClick={() => handleNewGame()}
                >
                  Restart Game
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Box>
      </Grid>
    </Container>
  );
}

export default GamePage;
