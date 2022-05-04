function StringRenderer() {
	this.emptySymbol = ' ';
	this.lifeSymbol = '0';
}

StringRenderer.prototype.render = function(board) {
	let str = '';

	for (let y = 0; y < board.height; y++) {
		for (let x = 0; x < board.width; x++) {
			str += (board.isAlive(x, y) ? this.lifeSymbol : this.emptySymbol);
		}
		str += '\n';
	}

	return str;
};

module.exports = StringRenderer;