import moment from "moment";
import {
  amber,
  blue,
  cyan,
  deepOrange,
  deepPurple,
  green,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
} from "@material-ui/core/colors";

export const colors = {
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  amber,
  orange,
  deepOrange,
};

export const standardLayouts = {
  QWERTY: {
    verticalLayout: "123qweasdzxcrtyfghvbnuiojklm,.",
    horizontalLayout: "qazwsxedcrfvtgbyhnujmik,ol.p;/",
  },
  AZERTY: {
    verticalLayout: '&é"azeqsdwxcrtyfghvbnuiojkl,;:',
    horizontalLayout: "aqwzsxedcrfvtgbyhnuj,ik;ol:pm!",
  },
  QWERTZ: {
    verticalLayout: "123qweasdyxcrtzfghvbnuiojklm,.",
    // ö is from the German layout; other languages have different letters
    horizontalLayout: "qaywsxedcrfvtgbzhnujmik,ol.pö-",
  },
  Dvorak: {
    verticalLayout: "123',.aoe;qjpyfuidkxbgcrhtnmwv",
    horizontalLayout: "'a;,oq.ejpukyixfdbghmctwrnvlsz",
  },
  Colemak: {
    verticalLayout: "123qwfarszxcpgjtdhvbkluyneim,.",
    horizontalLayout: "qazwrxfscptvgdbjhklnmue,yi.;o/",
  },
  Workman: {
    verticalLayout: "123qdrashzxmwbjtgycvkfupneol,.",
    horizontalLayout: "qazdsxrhmwtcbgvjykfnlue,po.;i/",
  },
  Neo: {
    verticalLayout: "123xvluiaüöäcwkeospzbhgfnrtm,.",
    horizontalLayout: "xuüviölaäcepwozksbhnmgr,ft.qdj",
  },
};

export function formatCount(count, singular, plural = null) {
  const noun = count === 1 ? singular : (plural ?? singular + "s");
  return `${count} ${noun}`;
}

export function formatANoun(word) {
  const a = /^[aeiou]/i.test(word) ? "an" : "a"; // crud heuristic
  return `${a} ${word}`;
}

export function formatTime(t, hideSubsecond) {
  t = Math.max(t, 0);
  const hours = Math.floor(t / (3600 * 1000));
  const rest = t % (3600 * 1000);
  const format = hideSubsecond ? "mm:ss" : "mm:ss.SS";
  return (hours ? `${hours}:` : "") + moment.utc(rest).format(format);
}
