// Maps the string keys used in src/content/ back to real webpack assets.
//
// The content modules cannot import these directly: they are also read by the
// build-time persona generator running in plain Node, which has no loader for
// .png or .mp4. Keeping the mapping here means the data stays portable and the
// components stay responsible for resolving it.

import bemvindos from "./images/bem-vindos.png";
import buildurpc from "./images/BuildUrPC.png";
import byulogo from "./images/Byulogo.png";
import cardgame from "./images/CardGame.png";
import diffofgaussian from "./images/diffofgaussian.png";
import docscanner from "./images/docscanner.png";
import dreamscapelogo from "./images/Dreamscapelogo.png";
import edgedetection from "./images/edgedetection.png";
import focussync from "./images/FocusSync.png";
import fourpointtransformdewarp from "./images/fourpointtransformdewarp.png";
import qrover from "./images/QRover.png";
import redououhackathon from "./images/RedoUoUHackathon.jpeg";
import tanukihunt from "./images/TanukiHunt.png";
import ulogored from "./images/Ulogored.png";
import waystaraward from "./images/WaystarAward.jpeg";
import waystarpresentation from "./images/WaystarPresentation.jpeg";
import pcbuildervideo from "./videos/FinalProjectVideoDemo.mp4";

const ASSETS = {
  "bem-vindos": bemvindos,
  BuildUrPC: buildurpc,
  Byulogo: byulogo,
  CardGame: cardgame,
  diffofgaussian,
  docscanner,
  Dreamscapelogo: dreamscapelogo,
  edgedetection,
  FocusSync: focussync,
  fourpointtransformdewarp,
  QRover: qrover,
  RedoUoUHackathon: redououhackathon,
  TanukiHunt: tanukihunt,
  Ulogored: ulogored,
  WaystarAward: waystaraward,
  WaystarPresentation: waystarpresentation,
  FinalProjectVideoDemo: pcbuildervideo,
};

/** One key to one asset. Unknown or null keys resolve to null. */
export const asset = (key) => (key ? ASSETS[key] ?? null : null);

/** A list of keys to a list of assets, dropping any that do not resolve. */
export const assets = (keys = []) => keys.map(asset).filter(Boolean);
