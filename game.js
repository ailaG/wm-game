/*** 
	Code for task: https://gist.github.com/santhoshtr/546d143100376481de72 
	Galia Bahat <galia@galiaba.com>
	
	To execute on an element of your choice use CSS_SELECTOR.dotsAndBoxes({options}) or empty for defaults.
	See defaults (in this file) for parameters.
	
	Note: Partially prepared for n!=4. The JS is, the CSS isn't. It's a small project after all :)

	Note: Naming conventions: lowerCamelCase for normal functions, underscores_like_that for vars or questions that 
		return a boolean such as is_this_the_real_life() is_this_just_fantasy(). I can work with other conventions
		I just like this one.
***/


(function($){

$.fn.dotsAndBoxes = function(user_options) { 
	var options = $.extend(true, {}, $.fn.dotsAndBoxes.defaults, user_options);
	var game = this;
	var currPlayerBox = options.currPlayerBox;
	var currPlayer = options.players[0];
	
	function init() {
		drawBoard();
		attachEvents();
		startGame();
	} // init()
	
	function drawBoard() {
		var height = options.height;
		var width = options.width;
			
		game.empty();
		
		var board = $('<div>').addClass('board');
		
		var dot = $('<div>').addClass('gameElement').addClass('dot');
		var line = $('<div>').addClass('gameElement').addClass('line').data('checked', false);
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
		for (col=0; col<width-1; col++) {
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
			if ($(this).data('checked') === true)
				return;
			
			$(this)
				.data('checked', true)
				.addClass('checked');
			endTurn();
		});
		
	} // attachEvents()
	
	function startGame() {
		$.each(options.players, function(){this.score = 0});
		changePlayer(options.players[0]);
	} // start()
	
	function is_box_done(box) {
		// Expects jQuery element.
		// Returns boolean
		
		var col = box.data('col');
		var row = box.data('row');
		var width = options.width;
		
		
		// Top / bottom, there are 3 horizontals per row
		if (game.find('.line:not(".vertical")').eq(row * (width-1) + col).data('checked') !== true)
			return false;
		
		if (game.find('.line:not(".vertical")').eq((row+1) * (width-1) + col).data('checked') !== true)
			return false;
		
		// Left / right, there are 4 verticals per row
		if (game.find('.line.vertical').eq(row * width + col+1).data('checked') !== true)
			return false;
		
		if (game.find('.line.vertical').eq(row * width + col).data('checked') !== true)
			return false;
		
		return true;
	} // is_box_done()
	
	function changePlayer(to) {
		if (to === undefined)
			currPlayer = (currPlayer==options.players[0]) ? options.players[1] : options.players[0]; // Could be smarter but this way we support possible future extensions
		else // Assumes input is always good. In actual project it wouldn't
			currPlayer = to;
		$(options.playerStatusBoxSelector)
			.css('color', currPlayer.color) // TODO: change to general CSS, not just color
			.text(currPlayer.name);
	} // changePlayer()
	
	function is_game_done() {
		res = true;
		game.find('.box').each(function(){
			if ($(this).data('done') !== true)
				res = false;
		});
		return res;
	} // is_game_done()

	function endTurn() {
		var did_we_score = false;
		game.find('.box').each(function(){
			if ($(this).hasClass('done'))
				return;
			if (is_box_done($(this))) { // Player won
				$(this).addClass('done');
				$(this).data('done', true);
				$(this).css('background', currPlayer.color);
				currPlayer.score++;
				did_we_score = true;
			}
		});
		if (did_we_score === false)
			changePlayer();
		if (did_we_score === true)
			if (is_game_done() === true)
				announceWinner();
	} // endTurn()
	
	function announceWinner() {
		var winner;
		var score=0;
		$.each(options.players, function(){ // Support for >2 because it's easy
			if (this.score > score)
				winner = this;
		});
		game.find(options.playerStatusBoxSelector).text(options.winningText + winner.name);
	} // announceWinner()
	
	init();
} // fn.dotsAndBoxes



$.fn.dotsAndBoxes.defaults = { 
	// Assumes options are good because otherwise we'd have 1000 code validation lines and this isn't what this task is about.
	// Yes, normally I'd check that nothing is undefined or of the wrong type etc :)
	
	currPlayerBox: $('<div class="scores">Now Playing: <span class="player">None</span></div>'),
	playerStatusBoxSelector: '.scores .player',
	height: 4,
	players: [
				{name: 'Player 1', color: 'blue'},
				{name: 'Player 2', color: 'red'}
	], // Assuming array with 2 items.
	width: 4,
	winningText: 'The winner is: ' // If this were a real app I'd use templates instead. Grammar doesn't always work this way (e.g. Japanese)
}



} )(jQuery); // (function() {