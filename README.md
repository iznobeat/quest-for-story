# Quest for Story: The Secret of the Bøttekott

A complete short browser adventure starring fictional castle versions of Joachim Froholt, Kiiim, Izno, Zendar, Haj and mgjesdal.

## Play

Run `npm start`, then open http://localhost:4173. No dependency installation or build step is needed. Any static host can serve the HTML, CSS, JavaScript and selected assets. The game does not contact external services.

Click a doorway to travel or a person to talk. Choose a verb and target. Click an inventory item and then its target to use it. Use the notebook to record witnesses. J opens the journal, H opens progressive hints, and Escape cancels an action. All interactive objects have focusable buttons; the sparkle button reveals them.

Dialogue advances one speech turn at a time beside the speaker’s animated portrait, with a distinct colour for each character. Joachim appears on the right; remote interruptions show the actual speaker, including Haj. Click the play area to end a conversation.

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

Live at https://quest-for-story.jonh.no. Repository: https://github.com/jhgundersen/quest-for-story.

Every push to `main` (or manual workflow dispatch) runs tests, builds an explicit public-file allowlist into `dist/`, uploads it by restricted rsync, and verifies the live HTTPS index and release manifest. No development server runs in production. Static files are revalidated to avoid stale scripts or sprite assets.

The existing `/root/website` Docker Compose nginx mounts `/srv/quest-for-story` read-only at `/www/quest-for-story`. The vhost source is `deploy/quest-for-story-https.conf`; the HTTP variant bootstraps the dedicated Let's Encrypt certificate. Existing Certbot renewal and nginx reload loops maintain HTTPS.

GitHub configuration uses secrets `DEPLOY_KEY`, `DEPLOY_KNOWN_HOSTS`, and variable `DEPLOY_HOST`. The dedicated `quest-for-story-deploy` account is limited to write-only rsync in its own upload directory. Root-owned authorized keys are outside that directory. No keys or credentials belong in the repository. Revert a commit on `main` to deploy a previous version.
