/*** 
	Code for task: https://gist.github.com/santhoshtr/546d143100376481de72 
	Galia Bahat <galia@galiaba.com>
	
	Note: Partially prepared for n!=4. The JS is, the CSS isn't. It's a small project after all :)
***/


(function($){

$.fn.dotsAndBoxes = function(user_options) { 
	var options = $.extend(true, {}, $.fn.dotsAndBoxes.defaults, user_options);
	var game = this;
	var currPlayerBox = options.currPlayerBox;
	
	var currPlayer = '1';
	function changePlayer(to) {
		if (to === undefined)
			currPlayer = (currPlayer==options.players[0]) ? options.players[1] : options.players[0]; // Could be smarter but this way we support possible future extensions
		else // Assumes input is always good. In actual project it wouldn't
			currPlayer = to;
		$(options.playerStatusBoxSelector).text(currPlayer);
	}
	
	function init() {
		drawBoard();
		attachEvents();
		makePromises();
		start();
	}
	
	function drawBoard() {
		var height = options.height;
		var width = options.width;
			
		game.empty();
		
		var board = $('<div>').addClass('board');
		
		var dot = $('<div>').addClass('gameElement').addClass('dot');
		var line = $('<div>').addClass('gameElement').addClass('line');
		var line_vertical = line.clone().addClass('vertical');
		var box = $('<div>').addClass('gameElement').addClass('box');
		
		for (var row=0; row<height-1; row++) {
			var col;
			
			// Row with horizontal dots and lines
			for (col=0; col<width-1; col++) {
				board.append(dot.clone());
				board.append(line.clone().data({'row' : row, 'col' : col}));
			}
			board.append(dot.clone());
			
			// Row with vertical lines and boxes
			for (col=0; col<width-1; col++) {
				board.append(line_vertical.clone().data({'row' : row, 'col' : col}));
				board.append(box.clone().data({'row' : row, 'col' : col}));
			}
			board.append(line_vertical.clone().data({'row' : row, 'col' : width}));
		}
		for (col=0; col<width-1; col++) { // TODO: avoid dups
			board.append(dot.clone());
			board.append(line.clone().data({'row' : height, 'col' : col}));
		}
		board.append(dot.clone());
		
		game.append(currPlayerBox.clone());
		game.append(board);
		game.append(currPlayerBox.clone());
	} // drawBoard()
	
	function attachEvents() {
		$('.line').click(function() {
			$(this)
				.data('checked', true)
				.addClass('checked')
		});
		
	} // attachEvents()
	
	function makePromises() {
	
	} // makePromises()
	
	function start() {
		changePlayer(options.players[0]);
	} // start()
	
	init();
} // fn.dotsAndBoxes

$.fn.dotsAndBoxes.defaults = { 
	// Assumes options are good because otherwise we'd have 1000 code validation lines and this isn't what this task is about.
	// Yes, normally I'd check that nothing is undefined or of the wrong type etc :)
	
	currPlayerBox: $('<div class="scores">Now Playing: <span class="player">None</span></div>'),
	playerStatusBoxSelector: '.scores .player',
	height: 4,
	players: ['Player 1', 'Player 2'], // Assuming array with 2 items.
	width: 4
}
} )(jQuery); // (function() {