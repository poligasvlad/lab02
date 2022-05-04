'use strict';

let program = require('commander');
let blessed = require('blessed');
let fs = require('fs');
let path = require('path');
let lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
let Ticker = require(lib + '/ticker.js');
let App = require(lib + '/app.js');

program._name = 'blessed-life';

if (program.args.length > 0) {
	let configPath = path.resolve(program.args[0]);
	let json = fs.readFileSync(configPath, { encoding: 'utf-8' });
	configFile = JSON.parse(json);
}
let config = {
	width: (!isNaN(program.width) ? program.width : configFile.width || 0),
	height: (!isNaN(program.height) ? program.height : configFile.height || 0),
	liveCell: program.livecell || configFile.livecell || '█',
	deadCell: program.deadcell || configFile.deadcell || ' ',
	speed: program.speed || configFile.speed || 250,
	fg: program.fg || configFile.fg || 'white',
	bg: program.bg || configFile.bg || 'black',
	liveCells: configFile.liveCells || []
};

let screen = blessed.screen();

config.width = config.width || screen.width;
config.height = config.height || screen.height;

let app = new App(config);

let box = blessed.box({
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  content: app.renderBoard(),
  tags: true,
  style: {
    fg: config.fg,
    bg: config.bg
  }
});
screen.append(box);

let spawnForm = blessed.form({
	left: 0,
	bottom: 0,
	width: '100%',
	height: 1,
	content: "Game Over",
	hidden: true
});
screen.append(spawnForm);

let spawnInput = blessed.textbox({
	left: spawnForm.content.length,
	bottom: 0,
	width: screen.width - spawnForm.content.length,
	height: 1,
	hidden: true
});
spawnForm.append(spawnInput);

function onTick() {
	app.tick();
	box.setContent(app.renderBoard());
	screen.render();
}

let ticker = new Ticker(config.speed, onTick);
if (program.autostart) {
	ticker.start();
}

screen.key(['space'], function(ch, key) {
	if (!ticker.running) {
		onTick();
	}
});

screen.key(['p'], function(ch, key) {
	ticker.toggle();
});

screen.key(['i'], function(ch, key) {
	if (ticker.running) {
		ticker.stop();
	}

	spawnForm.show();
	spawnInput.show();
	spawnInput.readInput(function onDone(err, value) {
		spawnForm.hide();
		spawnInput.hide();
		spawnInput.setValue('');

		if (value !== null) {
			value = value.split(/,|;/);
			for (let i = 0; i < value.length / 2; i++) {
				let x = parseInt(value[i * 2]);
				let y = parseInt(value[(i * 2) + 1]);

				if (app.game.board.isInBounds(x, y)) {
					app.game.board.toggleCell(x, y);

				}
			}
			box.setContent(app.renderBoard());
		}
		screen.render();
	});
	screen.render();
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render();