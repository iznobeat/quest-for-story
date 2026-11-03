# Quest for Story: The Secret of the Bøttekott

A complete short browser adventure starring fictional castle versions of Joachim Froholt, Kiiim, Izno, Zendar, Haj and mgjesdal.

## Play

Run `npm start`, then open http://localhost:4173. No dependency installation or build step is needed. Any static host can serve the HTML, CSS, JavaScript and selected assets. The game does not contact external services.

Click a doorway to travel or a person to talk. Choose a verb and target. Click an inventory item and then its target to use it. Use the notebook to record witnesses. J opens the journal, H opens progressive hints, and Escape cancels an action. All interactive objects have focusable buttons; the sparkle button reveals them.

Dialogue advances one speech turn at a time beside the speaker’s animated portrait, with a distinct colour for each character. Joachim appears on the right; remote interruptions show the actual speaker, including Haj. Reply choices appear immediately when available. Previously selected topics are greyed out but remain clickable; this history is saved with the adventure. Click anywhere else to advance the next speech turn, or end the conversation after its final turn.

Sound is **enabled by default**. Browser autoplay rules require an initial click or key press before playback; the sound button can mute it. Every room has a distinct original 32-bar arrangement, with lead, arpeggios, bass, pads and percussion. Tracks crossfade on room changes and pause when the page is hidden.

| Scene | Theme | Loop |
| --- | --- | --- |
| Courtyard | Moon over the Deadline | 83 seconds |
| Amiga wing | Forty-two Rooms of RAM | 69 seconds |
| DOS cupboard | The Bøttekott Waltz | 74 seconds |
| Newsroom | The People Behind the Pixels | 89 seconds |

## The revised adventure

Recover the vanished Last Byte credits before Kiiim’s DOS-only exhibition replaces everyone else’s history. Restore the disk, investigate a research clipping, win Izno’s trust, outwit Kiiim, record Haj’s account and obtain Kiiim’s response before publishing. The midnight deadline is narrative, not a real timer. Haj emphatically denies being Retrogamingpappa throughout.

The original four backgrounds are unchanged. Detailed transparent character artwork replaces the block figures, with directional walking, complete-frame walk cycles, breathing, speech poses, gestures and dialogue portraits. The motion-reduction preference disables walking transitions and decorative movement.

Existing saves are preserved and validated on load. Earlier unfinished investigations gain the new reporting steps; earlier completed saves remain complete. Start a new story from the menu to replay. `?preview=1` uses a separate QA save without modifying the main adventure.

## Engine scope

This is a browser-native JavaScript/Canvas game using the SCUMM interaction model. It does not embed ScummVM or produce a ScummVM-compatible game package.

## Verification

`npm test` runs thirteen tests covering the investigation chain, evidence gates, out-of-order reporting, repeated rewards, hints, save migration, soundtrack lengths, arrangements and default/mute state. Browser QA checks the actual animated interactions, default audio activation, scene music changes, new conversations, and the complete ending.

## Files

- `story.js`: puzzle state, research clues, dialogue and hints.
- `dialogue.js`: individual speech turns and character colours.
- `game.js`: interface, transitions, walking and save management.
- `characters.js`: transparent sprite registration, animation and portraits.
- `music.js`: four original scores and the Web Audio scheduler.
- `assets/castle-atlas.png`: original unchanged backgrounds.
- `assets/characters.png`: selected detailed transparent character master.
- `assets/CHARACTER-PROMPT.md`: built-in image generation prompt and integration notes.
- `SOURCES.md`: researched details and distinction between fact and fiction.

Joachim’s glasses, beard and green jacket and mgjesdal’s moustache follow the supplied photo reference. The photograph itself is not shipped with the game.


## Production deployment

Live at https://quest-for-story.jonh.no. Repository: https://github.com/iznobeat/quest-for-story.

Every push to `main` (or manual workflow dispatch) runs tests, builds an explicit public-file allowlist into `dist/`, uploads it by restricted rsync, and verifies the live HTTPS index and release manifest. No development server runs in production. Static files are revalidated to avoid stale scripts or sprite assets.

The existing `/root/website` Docker Compose nginx mounts `/srv/quest-for-story` read-only at `/www/quest-for-story`. The vhost source is `deploy/quest-for-story-https.conf`; the HTTP variant bootstraps the dedicated Let's Encrypt certificate. Existing Certbot renewal and nginx reload loops maintain HTTPS.

GitHub configuration uses secrets `DEPLOY_KEY`, `DEPLOY_KNOWN_HOSTS`, and variable `DEPLOY_HOST`. The dedicated `quest-for-story-deploy` account is limited to write-only rsync in its own upload directory. Root-owned authorized keys are outside that directory. No keys or credentials belong in the repository. Revert a commit on `main` to deploy a previous version.

## Episode 02: Test Mic III — The Last Resort

Open http://localhost:4173/?episode=studio or choose Episode 02 above the game or in its menu. Joachim visits fictional versions of Mr. Mamen and Sigve in the cd SPILL recording studio and control room. The new adventure is inspired by the supplied Test Drive III podcast transcript: off-road exploration, F6 recovery, a disastrous jetty respawn, and the hosts’ mixed verdict become a recording rescue with three original dad-joke puzzles.

Pick up the patch cable and driving notes in the control room. Use the cable on the mixer. Select **Use**, then the **Rescue console** to operate its controls. Talk to Mamen for the joke challenge, use the notebook on both hosts to check their verdicts, then mix the recovered take and play the resulting master. The journal and progressive hints track all seven objectives. Wrong answers are retryable; there are no timers or lost lives.

The studio has its own save key (and separate `&preview=1` QA save). Episode 01 remains available with its existing progress. Two new original 32-bar tracks accompany the rooms; photo-inspired host sprites have breathing/speech motion and dialogue portraits. Backgrounds depict an imagined studio. All dialogue and mishaps are fictional; no podcast recording is included or published.

`studio-story.js` contains the new story and room configuration. `assets/STUDIO-PROMPTS.md` records the built-in image generation prompts. `npm test` now runs 17 tests, including completion gates, incorrect-answer recovery, resumed puzzles, and both episodes’ saves. `npm run build` includes all 12 public files. A visual Chromium playthrough still needs to be performed.

### Studio scene revision

The control room now uses `assets/studio-control-v2.png`: normal-height furniture, a complete wheeled chair, and a clear foreground floor. Studio characters are approximately 31% taller. The original recording-room background and retro references are retained. All five mugs have distinct Look at exchanges, and the hosts have six additional transcript-inspired conversation topics.

`studio-art.js` draws the cable and driving notes from `assets/studio-props.png` over the clean control-room background. Picking them up removes both their artwork and hotspot; saved collection state (including earlier inventories) keeps them hidden on return. The bound Monkey Island book remains a decorative prop. The build now contains 15 public files and the suite has 18 tests.

Studio dialogue portraits use `assets/studio-portraits.png`, a registered three-column, two-row atlas with closed, open, and rounded mouth poses. Only the active speaker cycles mouth frames; listening and reduced-motion portraits remain closed. This replaces the previous static portrait bob. The build contains 16 public files and the suite has 19 tests, including portrait frame selection and reduced-motion behavior.

## Episode 03: Leisure Suit Joachim — Love in the Time of One More Turn

Choose Episode 03 or open `?episode=civ`. Joachim visits the neon One More Turn Inn for a deliberately corny Civilization speed-date. The game boxes are the eligible dates; their advocates are the wingmen. Talk to the boxes themselves for personal ads and failed pickup lines. Terje prefers the original Civilization, Kiiim V, Izno VI, and Nikolai VII. Haj insists on Sid Meier’s Pirates! and denies being Retrogamingpappa. These preferences and all dialogue are fictional character roles for this episode.

Explore four rooms, groom Joachim for check-in, survive a three-line flirting challenge, arrange a campus date, wrap a diplomatic bouquet, and record all five opinions. The final favourite is the player’s choice: all four editions have a complete ending. Collectible comb, napkin, rose, and ribbon disappear from the scene and stay gone after reloading, including after being consumed in the bouquet recipe. Four mugs have original jokes. Nikolai and Terje have photo-inspired sprites and animated three-mouth portraits; the returning cast keeps its existing artwork. Four original chiptune arrangements accompany the rooms. No deaths, time limit, or real purchases.

`civ-story.js` defines the story and `civ-art.js` handles removable props. The episode has separate normal and `&preview=1` saves. The full suite has 24 tests and the public build contains 22 files. Artwork prompts are in `assets/CIV-PROMPTS.md`.

### Private Tailscale preview

The preview runs at **http://100.110.22.8:4174/?episode=civ** while this desktop is running and the viewing device is connected to the same tailnet with access to that port. It is bound exclusively to the desktop’s Tailscale address. No Funnel or public deployment is configured. `scripts/preview-server.mjs` serves only the allowlisted `dist/` build with caching disabled; repository-only files are not served.

The transient user service is `quest-for-story-preview.service`. Check it with `systemctl --user status quest-for-story-preview.service`; stop it with `systemctl --user stop quest-for-story-preview.service`. It survives the terminal session, but not a machine reboot. After edits, run `npm test` and `npm run build`, then restart the service if the public-file list changed. Node is currently installed at `/home/jonh/.local/share/mise/installs/node/26.2.0/bin/node`.

To run the built preview manually, set `QFS_PREVIEW_HOST` to the desktop’s current Tailscale IPv4 and optionally `QFS_PREVIEW_PORT` (default 4174), then run `node scripts/preview-server.mjs`. Without those settings it binds to loopback. No commit or push is needed to preview changes.
