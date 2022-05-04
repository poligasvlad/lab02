'use strict';

let Board = require('./board');

function Game(board) {
	this.board = board;
	this.newBoard = null;
};

Game.prototype.tick = function() {
	this.newBoard = new Board(this.board.width, this.board.height);

	for (let y = 0; y < this.board.height; y++) {
		for (let x = 0; x < this.board.width; x++) {
			let liveNeighbors = this.board.getLiveNeighbors(x, y);
			if (this.board.isAlive(x, y)) {
				if (liveNeighbors === 2 || liveNeighbors === 3) {
					this.newBoard.setCell(x, y, true);
				}
			} else if (liveNeighbors === 3) {
				this.newBoard.setCell(x, y, true);
			}
		}
	}

	this.board = this.newBoard;
};

module.exports = Game;