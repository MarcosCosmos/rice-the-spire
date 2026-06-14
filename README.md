# Rice The Spire

## About

A [Zebar](https://github.com/glzr-io/zebar) bar themed based on [Slay the Spire 2](https://store.steampowered.com/app/2868840/Slay_the_Spire_2/) and using assets sourced via [Spire Codex](https://spire-codex.com/).

It is both a toy project for personal use and a portfolio piece/excuse to explore technologies and, in particular, web accessibilty.

It's also still a work in progress with bugs/issues I want to address and several features that I still want to add. Currently I only have support for [GlazeWM](https://github.com/glzr-io/glazewm) but support for [Komorebi](https://github.com/LGUG2Z/komorebi) or other window managers may be considered on request (or PR).

Please note that I am the only (officially) intended consumer at this time. Similarly, I would not recommend it as an accessible application as such. I have deliberately made design decisions that create challenges in order to explore them from a programmatic and UX perspective. As such, while related feedback would be appreciated, some accessibility considerations may be out of scope. I believe it would be better achieved from the ground up in a distinct project, which I'm open to being involved in.

## How to use it

Generally you should follow [Zebar's instructions](https://github.com/glzr-io/zebar#creating-your-own-widgets).

I do intend to publish it to the Zebar martketplace, but in the meantime you should be able to download the latest release as a zip or tarball and unpack it into your `~/.gzlr/zebar` folder (as a subfolder, so that e.g. the `zpack.json` ends up at `~/.glzr/zebar/zpack.json`).

If you're unfamiliar with zebar, I recommend starting with the `default` widget. The `modebound` widget provides a strong visual que when a non-default binding mode is active. I find that helpful but it's not very common.

## Customisation

Unfortunately Zebar doesn't currently support serving typescript or JSX files itself, so for the most part you'll need to customise the widgets in inline `type="text/babel"` scripts.

### Developer environment setup

If you're a developer and you want to make changes to the actual source code, I have setup a special `dev` widget that opens the `vite dev` server.

To do that you'll first need to symlink the repository's `./dist` directory into your local zebar (e.g. `.glzr/zebar/rice-the-spire`). After that running `npm run dev` will generate the dev widget before launching vite.

_Note:_ you may need to run "Empty cache & reload configs" from the zebar system tray before the dev widget appears in the list.
