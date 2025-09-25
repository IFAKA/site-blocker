# Simple Site Blocker (Chrome MV3)

Blocks distracting/harmful sites using Declarative Net Request rules. Allows opening direct content links on specific platforms. Edit the lists in this repo to add/remove sites.

## Install (Load Unpacked)
1. Open Chrome → `chrome://extensions`.
2. Turn on Developer Mode.
3. Click "Load unpacked" and select this folder.

## Behavior
- YouTube: blocked except direct videos/shorts/embeds (`/watch`, `youtu.be`, `/shorts`, `/embed`).
- Reddit: blocked except direct posts (`/comments/...`, `redd.it/...`).
- 4chan: blocks NSFW (`boards.4chan.org`) entirely; on worksafe `boards.4channel.org` only allows selected boards (`/sci/`, `/g/`, `/his/`, `/lit/`, `/diy/`, `/ck/`, `/fit/`).
- Porn sites: blocked fully (no exceptions).

## Editing the lists
- Open `ruleset.json`.
- To block a site entirely, add a rule like:
```json
{ "id": 200, "priority": 1, "action": { "type": "block" }, "condition": { "urlFilter": "||example.com^", "resourceTypes": ["main_frame", "sub_frame"] } }
```
- To allow a specific path (exception), add a higher-priority rule (priority 2+):
```json
{ "id": 201, "priority": 2, "action": { "type": "allow" }, "condition": { "urlFilter": "||example.com/allowed-path", "resourceTypes": ["main_frame", "sub_frame"] } }
```
- Rule IDs must be unique integers. Higher `priority` wins when both match.
- After editing, go to `chrome://extensions`, click "Reload" on the extension.

## Files
- `manifest.json`: MV3 config and ruleset reference.
- `ruleset.json`: All block/allow rules.
