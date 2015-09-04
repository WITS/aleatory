Math.factorial = function(n) {
	if (n <= 0) return 1;
	for (var i = n; -- i; ) n *= i;
	return n;
}

Math.nCr = function(n, r) {
	if (n <= 0 || r <= 0) return 1;
	return Math.floor(Math.factorial(n)/Math.factorial(r)/Math.factorial(n - r));
}

TheoreticalHands = function() {

}

TheoreticalHands.prototype.any = 0;
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
	// Basic info
	var deck_size = 52 - cards.length - 2 * (hands.length - 1);
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
	// console.log(like_ranks);
	// Any
	this.any = Math.nCr(deck_size, remaining);
	// Pairs
	if (like_ranks.pairs.length) {
		this.pairs = Infinity;
	} else if (remaining) {
		this.pairs = (unique_ranks) * 3;
		if (remaining > 1) this.pairs *= Math.nCr(13 - unique_ranks, remaining - 1) *
			Math.pow(4, remaining - 1);
	}
	// Two Pairs
	if (like_ranks.pairs.length > 1) {
		this.two_pairs = Infinity;
	} else if (this.pairs == Infinity && remaining) {
		this.two_pairs = 0;
		// 1 of the remaining ranks, 1 of the 3 remaining suits, 0-3 extras
		var p = Math.nCr(unique_ranks - 1, 1) * 3;
		p *= Math.nCr(13 - unique_ranks, remaining - 1) * Math.pow(4, remaining - 1);
		this.two_pairs += p;
		// 2 of the remaining ranks, 1 of the 3 remaining suits for each, 0-2 extras
		if (remaining > 1) {
			var p = Math.nCr(unique_ranks - 1, 2) * 9;
			p *= Math.nCr(13 - unique_ranks, remaining - 2) * Math.pow(4, remaining - 2);
			this.two_pairs += p;
		}
		// 1 new rank, 2 of the 4 suits, 0-2 extras
		if (remaining > 1) {
			var p = (13 - unique_ranks) * 6;
			p *= Math.nCr(12 - unique_ranks, remaining - 2) * Math.pow(4, remaining - 2);
			this.two_pairs += p;
		}
		// 1 old rank, 1 of the 3 suits, 1 new rank, 2 of the 4 suits, 0-1 extra
		if (remaining > 2) {
			var p = Math.nCr(unique_ranks - 1, 1) * 3;
			p *= Math.nCr(13 - unique_ranks, 1) * 6;
			if (remaining == 4) p *= (12 - unique_ranks) * 4;
			this.two_pairs += p;
		}
		// 2 new ranks, 2 of the 4 suits for each
		if (remaining == 4) {
			var p = Math.nCr(13 - unique_ranks, 2) * 36;
			this.two_pairs += p;
		}
	} else if (remaining > 1) {
		// Possiblities:
		this.two_pairs = 0;
		// 2 of the current ranks, 1 of the 3 remaining suits of each [(3c1)^2=9], 0-2 extra cards
		var p = Math.nCr(unique_ranks, 2) * 9;
		if (remaining > 2) {
			// 1-2 new ranks, or 1 new rank + 1 more old
			var mult = Math.nCr(13 - unique_ranks, remaining - 2) * Math.pow(4, remaining - 2);
			if (remaining == 4) mult += (13 - unique_ranks) * 4 * unique_ranks * 3;
			p *= mult;
		}
		this.two_pairs += p;
		// 1 of the current ranks, 1 of the 3 remaining suits, 2 of 1 new rank 2 suits [(4c2)=6)], 0-1 extra
		if (remaining > 2) {
			var p = unique_ranks * 3 * (13 - unique_ranks) * 6;
			if (remaining == 4) p *= (12 - unique_ranks) * 4;
			this.two_pairs += p;
		}
		// 0 of the current ranks, 2 of 2 new ranks, 2 suits for each, 0 extra
		if (remaining == 4) {
			var p = Math.nCr(13 - unique_ranks, 2) * 6;
			this.two_pairs += p;
		}
	}
	// Threes
	if (like_ranks.threes.length) {
		this.threes = Infinity;
	} else if (this.pairs == Infinity && remaining) {
		this.threes = 0;
		// Three from a pair, 0-3 extra
		var p = Math.nCr(like_ranks.pairs.length, 1) * 2;
		if (remaining > 1) p *= Math.nCr(13 - unique_ranks, remaining - 1) * Math.pow(4, remaining - 1);
		this.threes += p;
		// Three from a single, 0-2 extra [3c2=3]
		if (remaining > 1) {
			var p = Math.nCr(unique_ranks - like_ranks.pairs.length, 1) * 3;
			p *= Math.nCr(12 - like_ranks.pairs.length, remaining - 2) * Math.pow(4, remaining - 2);
			this.threes += p;
		}
		// Three from scratch, 0-1 extra [4c3=4]
		if (remaining > 2) {
			var p = Math.nCr(13 - unique_ranks, 1) * 4;
			if (remaining == 4) p *= (12 - unique_ranks) * 4;
			this.threes += p;
		}
	} else if (remaining > 1) {
		this.threes = 0;
		// Two of old rank, 0-2 extra
		var p = Math.nCr(unique_ranks, 2) * 6;
		if (remaining > 2) p *= Math.nCr(13 - unique_ranks, remaining - 2) * Math.pow(4, remaining - 2);
		this.threes += p;
		// Three of new rank, 0-1 extra [4c3=4]
		if (remaining > 2) {
			var p = (13 - unique_ranks) * 4;
			if (remaining == 4) p *= (12 - unique_ranks) * 4;
			this.threes += p;
		}
	}
	// Straights
	var partial_straights = new Array();
	var ordered_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1];
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
		if (!misses) {
			this.straights = Infinity;
			break;
		}
	}
	if (this.straights != Infinity && partial_straights.length) {
		this.straights = 0;
		for (var i = partial_straights.length; i --; ) {
			var misses = partial_straights[i];
			var p = 4 * misses;
			if (remaining > misses) p *= Math.nCr(deck_size - misses, remaining - misses);
			this.straights += p;
		}
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
	// console.log("Partial flush: " + partial_flush);
	if (partial_flush >= 5) {
		this.flushes = Infinity;
	} else if (partial_flush >= 5 - remaining) {
		var misses = 5 - partial_flush;
		this.flushes = Math.nCr(13 - partial_flush, misses);
		if (remaining > misses) this.flushes *= Math.nCr(deck_size - misses, remaining - misses);
	}
	// Full houses
	if (this.threes == Infinity && (this.pairs == Infinity ||
		like_ranks.threes.length > 1 || like_ranks.quads.length)) {
		this.full_houses = Infinity;
	} else if (this.two_pairs == Infinity && remaining) {
		// From old pair, 0-3 extras
		this.full_houses = like_ranks.pairs.length * 2;
		if (remaining > 1) {
			var mult = 0;
			// Different ranks
			mult += Math.nCr(13 - unique_ranks, remaining - 1) * Math.pow(4, remaining - 1);
			// 1 pair, different ranks
			mult += (unique_ranks - like_ranks.pairs.length) * 3 *
				Math.nCr(13 - unique_ranks, remaining - 2) * Math.pow(4, remaining - 2);
			// 1 new pair, different rank(?) [4c2=6]
			if (remaining > 2) mult += (13 - unique_ranks) * 6 *
				Math.nCr(12 - unique_ranks, remaining - 3) * 4;
			this.full_houses *= mult;
		}
		// New three, 0-1 extra [4c3=4]
		if (remaining > 2) {
			var p = (13 - unique_ranks) * 4;
			if (remaining == 4) p *= (deck_size - 3);
			this.full_houses += p;
		}
	} else if (this.threes == Infinity && remaining) {
		this.full_houses = 0;
		// Pair from old, 0-3 extras
		var p = (unique_ranks - 1) * 3;
		p *= Math.nCr(deck_size - 1, remaining - 1);
		this.full_houses += p;
		// New pair, 0-2 extras [4c2=6]
		if (remaining > 1) {
			var p = (13 - unique_ranks) * 6;
			p *= Math.nCr(deck_size - 2, remaining - 2);
			this.full_houses += p;
		}
	} else if (this.pairs == Infinity && remaining > 1) {
		this.full_houses = 0;
		// Three from old, 0-2 extras [3c2=3]
		var p = unique_ranks * 3 * Math.nCr(deck_size - 2, remaining - 2);
		this.full_houses += p;
		// Three from new, 0-1 extras [4c3=4]
		var p = (13 - unique_ranks) * 4 * Math.nCr(deck_size - 3, remaining - 3);
		this.full_houses += p;
	} else if (remaining > 2) {
		// Three from old, pair from old, 0-1 extras [3c2=3] [3c1=3]
		this.full_houses = Math.nCr(unique_ranks, 2) * 3 * 3;
		if (remaining == 4) {
			this.full_houses *= (deck_size - 3);
			// Three from new, pair from old [4c3=4] [3c1=3]
			var p = (13 - unique_ranks) * 4 * (unique_ranks) * 3;
			this.full_houses += p;
			// Three from old, pair from new [3c2=3] [4c2=6]
			var p = (unique_ranks) * 3 * (13 - unique_ranks) * 6;
			this.full_houses += p;
		}
	}
	// Four of a kind
	if (like_ranks.quads.length) {
		this.fours = Infinity;
	} else if (this.threes == Infinity && remaining) {
		this.fours = like_ranks.threes.length;
		if (remaining > 1) this.fours *= Math.nCr(deck_size - 1, remaining - 1);
	} else if (this.pairs == Infinity && remaining > 1) {
		this.fours = like_ranks.pairs.length;
		if (remaining > 2) this.fours *= Math.nCr(deck_size - 2, remaining - 2);
	} else if (remaining > 2) {
		this.fours = 0;
		// Four from old, 0-1 extras
		var p = unique_ranks;
		if (remaining == 4) p *= Math.nCr(deck_size - 3, remaining - 3);
		this.fours += p;
		// Four from new
		if (remaining == 4) this.fours += (13 - unique_ranks);
	}
	// Straight flushes
	var partial_straights = new Array();
	var ordered_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1];
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
			if (!misses) {
				this.straight_flushes = Infinity;
				break;
			}
		}
	}
	if (this.straight_flushes != Infinity && partial_straights.length) {
		this.straight_flushes = 0;
		for (var i = partial_straights.length; i --; ) {
			var misses = partial_straights[i];
			var p = misses;
			if (remaining > misses) p *= Math.nCr(deck_size - misses, remaining - misses);
			this.straight_flushes += p;
		}
	}
}