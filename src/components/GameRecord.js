import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import { useMemo } from "react";
import moment from "moment";

import { cardTraits } from "../game";
import SetCard from "./SetCard";
import Subheading from "./Subheading";

function formatTime(t, hideSubsecond) {
  t = Math.max(t, 0);
  const hours = Math.floor(t / (3600 * 1000));
  const rest = t % (3600 * 1000);
  const format = hideSubsecond ? "mm:ss" : "mm:ss.SS";
  return (hours ? `${hours}:` : "") + moment.utc(rest).format(format);
}

const useStyles = makeStyles((theme) => ({
  recordPanel: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    minWidth: 0,
  },
  record: {
    overflowY: "auto",
    flexGrow: 1,
    overflowWrap: "anywhere",
    padding: "0 4px",
    minWidth: 0,
  },
  logEntry: {
    marginBottom: "0.35em",
    padding: "0 12px",
    textAlign: "center",
    background: theme.setFoundEntry || "rgba(130, 170, 100, 0.15)",
  },
  logEntryText: {
    display: "flex",
    justifyContent: "center",
    whiteSpace: "nowrap",
  },
  analysis: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
  },
  analysisItem: {
    marginBottom: theme.spacing(0.5),
  },
}));

function analyzeSetCharacteristics(cards) {
  const traits = cards.map(cardTraits);
  const [t1, t2, t3] = traits;
  
  // Check each attribute
  const colorShared = t1.color === t2.color && t2.color === t3.color;
  const numberShared = t1.number === t2.number && t2.number === t3.number;
  const shapeShared = t1.shape === t2.shape && t2.shape === t3.shape;
  const shadingShared = t1.shade === t2.shade && t2.shade === t3.shade;
  
  const sharedCount = [colorShared, numberShared, shapeShared, shadingShared].filter(Boolean).length;
  
  let sharedType = null;
  if (sharedCount === 1) {
    if (colorShared) sharedType = "Color";
    else if (numberShared) sharedType = "Number";
    else if (shapeShared) sharedType = "Shape";
    else if (shadingShared) sharedType = "Shading";
  }
  
  return {
    sharedCount,
    sharedType,
    colorShared,
    numberShared,
    shapeShared,
    shadingShared,
  };
}

function GameRecord({ history, gameMode, startedAt }) {
  const classes = useStyles();
  
  const analysis = useMemo(() => {
    if (!history || history.length === 0) {
      return {
        noneShared: 0,
        color: 0,
        shape: 0,
        shading: 0,
        number: 0,
      };
    }
    
    const stats = {
      noneShared: 0,
      color: 0,
      shape: 0,
      shading: 0,
      number: 0,
    };
    
    history.forEach((event) => {
      if (event.c1 && event.c2 && event.c3) {
        const analysis = analyzeSetCharacteristics([event.c1, event.c2, event.c3]);
        
        if (analysis.sharedCount === 0) {
          stats.noneShared++;
        } else {
          // Count each shared characteristic separately (can have multiple)
          if (analysis.colorShared) stats.color++;
          if (analysis.numberShared) stats.number++;
          if (analysis.shapeShared) stats.shape++;
          if (analysis.shadingShared) stats.shading++;
        }
      }
    });
    
    return stats;
  }, [history]);
  
  const sortedItems = useMemo(() => {
    if (!history || !Array.isArray(history)) return [];
    return [...history].sort((a, b) => a.time - b.time);
  }, [history]);

  return (
    <section className={classes.recordPanel}>
      <Subheading>Game Record</Subheading>
      <Divider style={{ marginBottom: 8 }} />
      <div className={classes.analysis}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <Typography variant="body2">None shared</Typography>
            <Typography variant="body2"><strong>{analysis.noneShared}</strong></Typography>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <Typography variant="body2">Color</Typography>
            <Typography variant="body2"><strong>{analysis.color}</strong></Typography>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <Typography variant="body2">Shape</Typography>
            <Typography variant="body2"><strong>{analysis.shape}</strong></Typography>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <Typography variant="body2">Shading</Typography>
            <Typography variant="body2"><strong>{analysis.shading}</strong></Typography>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <Typography variant="body2">Number</Typography>
            <Typography variant="body2"><strong>{analysis.number}</strong></Typography>
          </div>
        </div>
      </div>
      <div className={classes.record} style={{ overflowY: "auto" }}>
        {sortedItems.length === 0 ? (
          <div className={classes.logEntry}>
            <div className={classes.logEntryText}>
              <Typography variant="subtitle2">
                Find a set, you doofus!
              </Typography>
            </div>
          </div>
        ) : (
          sortedItems.map((item, index) => (
            <div key={index} className={classes.logEntry}>
              <div className={classes.logEntryText}>
                <Typography variant="subtitle2">
                  {formatTime(item.time - startedAt, true)} - Set found
                </Typography>
              </div>
              {item.c1 && item.c2 && item.c3 && (
                <div>
                  <SetCard size="sm" value={item.c1} />
                  <SetCard size="sm" value={item.c2} />
                  <SetCard size="sm" value={item.c3} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default GameRecord;

