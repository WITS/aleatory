Math.factorial = function(n) {
	if (n <= 0) return 1;
	for (var i = n; -- i; ) n *= i;
	return n;
}

Math.nCr = function(n, r) {
	return (Math.factorial(n)/Math.factorial(r)/Math.factorial(n - r));
}

TheoreticalHands = function() {

}

TheoreticalHands.prototype.pairs = 0;
TheoreticalHands.prototype.two_pairs = 0;
TheoreticalHands.prototype.threes = 0;
TheoreticalHands.prototype.flushes = 0;
TheoreticalHands.prototype.straights = 0;
TheoreticalHands.prototype.full_houses = 0;
TheoreticalHands.prototype.fours = 0;
TheoreticalHands.prototype.straight_flushes = 0;

TheoreticalHands.prototype.calculate = function(cards) {
	var remaining = 7 - cards.length;
	cards = cards.sort(function(a, b) {
		return b.rank - a.rank;
	});
	// Unique ranks
	var unique_ranks = 0;
	var ranks = new Array();
	for (var i = cards.length; i --; ) {
		if (ranks.indexOf(cards[i].rank) != -1) continue;
		ranks.push(cards[i].rank);
	}
	console.log(ranks);
	unique_ranks = ranks.length;
	// Like ranks (current)
	var like_ranks = get_like_ranks(cards);
	console.log(like_ranks);
	// Pairs
	if (like_ranks.pairs.length) {
		this.pairs = Infinity;
	} else if (remaining) {
		this.pairs = (unique_ranks) * 3;
		if (remaining == 2) this.pairs *= (13 - unique_ranks) * 4;
	}
	// Two Pairs
	if (like_ranks.pairs.length > 1) {
		this.two_pairs = Infinity;
	} else if (this.pairs == Infinity && remaining) {
		// 1 of the remaining ranks, 1 of the 3 remaining suits
		this.two_pairs = Math.nCr(unique_ranks - 1, 1) * 3;
		if (remaining == 2) this.two_pairs *= 44;
	} else if (remaining == 2) {
		// 2 of the current ranks, 1 of the 3 remaining suits of each [(3c1)^2 = 9]
		this.two_pairs = Math.nCr(unique_ranks, 2) * 9;
	}
	// Threes
	if (like_ranks.threes.length) {
		this.threes = Infinity;
	} else if (this.pairs == Infinity && remaining) {
		this.threes = Math.nCr(like_ranks.threes.length, 1) * 2;
		if (remaining == 2) this.threes *= 48;
	} else if (remaining == 2) {
		this.threes = Math.nCr(unique_ranks, 2) * 3;
	}
	// Straights
	var partial_straights = new Array();
	var ordered_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1];
	var straight_wo_one = false; // Is there a straight missing one card?
	for (var i = ordered_list.length - 1; i >= 4; i --) {
		var allowed_misses = remaining;
		for (var x = 0; x < 5; ++ x) {
			if (ranks.indexOf(ordered_list[i - x]) != -1) continue;
			if ((-- allowed_misses) < 0) break;
		}
		if (allowed_misses < 0) continue;
		// Add the number of cards needed to complete the straight to the array
		var misses = remaining - allowed_misses;
		partial_straights.push(misses);
		if (misses == 1) straight_wo_one = true;
		if (!misses) {
			this.straights = Infinity;
			break;
		}
	}
	if (this.straights != Infinity && partial_straights.length) {
		this.straights = 4 * partial_straights.length;
		if (remaining == 2 && straight_wo_one) this.straights *= 42;
	}
	// Flushes
	var partial_flush = 0;
	var suits = new Array();
	var suit_cards = new Array();
	for (var i = 4; i --; ) { // Initialize suits
		suits[i] = 0;
		suit_cards[i] = new Array();
	}
	for (var i = cards.length; i --; ) { // Populate suits
		++ suits[cards[i].suit];
		suit_cards[cards[i].suit].push(cards[i].rank);
	}
	for (var i = 4; i --; ) { // Initialize suits
		partial_flush = Math.max(partial_flush, suits[i]);
	}
	console.log("Partial flush: " + partial_flush);
	if (partial_flush >= 5) {
		this.flushes = Infinity;
	} else if (partial_flush >= 5 - remaining) {
		var misses = 5 - partial_flush;
		this.flushes = Math.nCr(13 - partial_flush, misses);
		if (misses == 1 && remaining == 2) this.flushes *= 42;
	}
	// Full houses
	if (this.threes == Infinity && (this.pairs == Infinity ||
		like_ranks.threes.length > 1 || like_ranks.quads.length)) {
		this.full_houses = Infinity;
	} else if (this.two_pairs == Infinity && remaining) {
		this.full_houses = like_ranks.pairs.length * 2;
		if (remaining == 2) this.full_houses *= 42;
	} else if (this.threes == Infinity && remaining) {
		this.full_houses = (unique_ranks - 1) * 3;
		if (remaining == 2) this.full_houses *= 42;
	} else if (this.pairs == Infinity && remaining == 2) {
		this.full_houses = (unique_ranks - 1) * 3;
		this.full_houses += 2 * (unique_ranks - 1) * 3;
	}
	// Four of a kind
	if (like_ranks.quads.length) {
		this.fours = Infinity;
	} else if (this.threes == Infinity && remaining) {
		this.fours = like_ranks.threes.length;
		if (remaining == 2) this.fours *= 42;
	} else if (this.pairs == Infinity && remaining == 2) {
		this.fours = like_ranks.pairs.length;
	}
	// Straight flushes
	var partial_straights = new Array();
	var ordered_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1];
	var straight_wo_one = false; // Is there a straight missing one card?
	for (var i = ordered_list.length - 1; i >= 4; i --) {
		for (var s = 4; s --; ) {
			if (suit_cards[s].length < 5 - remaining) continue;
			var allowed_misses = remaining;
			for (var x = 0; x < 5; ++ x) {
				if (suit_cards[s].indexOf(ordered_list[i - x]) != -1) continue;
				if ((-- allowed_misses) < 0) break;
			}
			if (allowed_misses < 0) continue;
			// Add the number of cards needed to complete the straight to the array
			var misses = remaining - allowed_misses;
			partial_straights.push(misses);
			if (misses == 1) straight_wo_one = true;
			if (!misses) {
				this.straight_flushes = Infinity;
				break;
			}
		}
	}
	if (this.straight_flushes != Infinity && partial_straights.length) {
		this.straight_flushes = partial_straights.length;
		if (remaining == 2 && straight_wo_one) this.straight_flushes *= 42;
	}
}