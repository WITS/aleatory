window.addEventListener("load", function() {
	bg_color_hue = irandom(360);
	update_bg_color();
	// Set up placeholders
	var co_elem = document.getElementById("community");
	for (var i = 0, left = -288; i < 5; i ++, left += 120) {
		// Community
		var elem = new Placeholder().element();
		elem.style.left = (left) + "px";
		co_elem.appendChild(elem);
	}
	var pl_elem = document.getElementById("player");
	for (var i = 0, left = -228; i < 4; i ++, left += 120) {
		// Player
		var elem = new Placeholder().element();
		elem.style.left = (left) + "px";
		pl_elem.appendChild(elem);
	}
	current_round = new Round();
	setTimeout(function() {
		current_round.start();
	}, 500);
}, false);

function choose() {
	return arguments[irandom(arguments.length)];
}
function irandom(x) {
	return Math.floor(Math.random() * x);
}

function update_bg_color() {
	bg_color_hue += choose(-1, 1) * (24 + irandom(24));
	bg_color_hue = bg_color_hue % 360;
	document.body.style.backgroundColor = "hsl(" + bg_color_hue + ", 80%, 30%)";
}

function Placeholder() {
	this.elementObj = null;
	this.element = function() {
		if (this.elementObj == null) {
			var elem = document.createElement("div");
			elem.className = "placeholder";
			elem.style.left = "-48px";
			elem.style.top = "-48px";
			this.elementObj = elem;
		}
		return this.elementObj;
	}
}

function Card(c) {
	if (c == null) {
		var c = new Object();
	}
	this.suit = c.suit || null;
	this.rank = c.rank || null;
	this.suitStr = c.suitStr || null;
	this.rankStr = c.rankStr || null;
	this.flip = function() {
		if (this.elementObj == null) {
			console.warn("Cannot flip a non-visible card");
			return;
		}
		if (!/\sflipped(\s|$)/.test(this.elementObj.className)) {
			this.elementObj.className += " flipped";
		}
	}
	this.elementObj = null;
	this.element = function() {
		if (this.elementObj == null) {
			// generate that shit
			var elem = document.createElement("div");
			elem.className = "card";
			elem.style.left = "-48px";
			elem.style.top = "-48px";
			var front = document.createElement("div");
			front.className = "front";
			var rank = document.createElement("div");
			rank.className = "rank";
			rank.innerHTML = this.rankStr.toUpperCase()[0];
			front.appendChild(rank);
			var suit = document.createElement("div");
			suit.className = "suit";
			if (/AppleWebKit/.test(navigator.userAgent) && !/Mobile/.test(navigator.userAgent)) {
				if (this.suit % 3 != 0) {
					suit.className += " red";
				}
				suit.innerHTML = "<font face=\"SYMBOL\">&#" + (167 + this.suit) + ";</font>";
			} else {
				front.className += " suit-words";
				suit.innerHTML = this.suitStr.toUpperCase();
			}
			front.appendChild(suit);
			elem.appendChild(front);
			var back = document.createElement("div");
			back.className = "back";
			elem.appendChild(back);
			this.elementObj = elem;
		}
		return this.elementObj;
	}
	// Correct null values
	if (this.suit == null && this.suitStr == null) {
		this.suit = 0;
	}
	if (this.suit != null && this.suitStr == null) {
		switch (this.suit) {
			case 0: this.suitStr = "clubs"; break;
			case 1: this.suitStr = "diamonds"; break;
			case 2: this.suitStr = "hearts"; break;
			case 3: this.suitStr = "spades"; break;
		}
	}
	if (this.suit == null && this.suitStr != null) {
		switch (this.suitStr) {
			case "clubs": this.suit = 0; break;
			case "diamonds": this.suit = 1; break;
			case "hearts": this.suit = 2; break;
			case "spades": this.suit = 3; break;
		}
	}
	if (this.rank == null && this.rankStr == null) {
		this.rank = 1;
	}
	if (this.rank != null && this.rankStr == null) {
		switch (this.rank) {
			case 1: this.rankStr = "ace"; break;
			case 11: this.rankStr = "jack"; break;
			case 12: this.rankStr = "queen"; break;
			case 13: this.rankStr = "king"; break;
			default: this.rankStr = this.rank.toString(10);
		}
	}
	if (this.rank == null && this.rankStr != null) {
		switch (this.rankStr.toLowerCase()) {
			case "ace": this.rank = 1; break;
			case "jack": this.rank = 11; break;
			case "queen": this.rank = 12; break;
			case "king": this.rank = 13; break;
			default: this.rank = +this.rankStr;
		}
	}
}

function Deck() {
	this.cards = new Array();
	for (var suit = 0; suit < 4; suit ++) {
		for (var value = 1; value <= 13; value ++) {
			this.cards.push([suit, value]);
		}
	}
	this.shuffle = function(x) {
		var x = x || 1;
		for (var i = 0; i < x; i ++) {
			this.cards = this.cards.sort(function(a, b) {
				return choose(-1, 0, 1);
			});
		}
	}
	this.draw = function() {
		var drawn = this.cards.pop();
		return new Card({
			suit: drawn[0],
			rank: drawn[1]
		});
	}
}

function Round() {
	this.deck = new Deck();
	this.community = new Array();
	this.deal = function() {
		var c_id = this.community.length;
		var card = this.deck.draw();
		this.community.push(card);
		var co_elem = document.getElementById("community");
		var cd_elem = card.element();
		co_elem.appendChild(cd_elem);
		if (c_id > 0) {
			if (c_id % 2 == 1) {
				cd_elem.style.left = (-168 - (c_id == 3 ? 120 : 0)) + "px";
			} else {
				cd_elem.style.left = (72 + (c_id == 4 ? 120 : 0)) + "px";
			}
		}
		cd_elem.style.top = (-188 - 48 * c_id) + "px";
		setTimeout(function() {
			cd_elem.style.top = "-48px";
		}, 1);
		setTimeout(function() {
			card.flip();
			update_bg_color();
		}, 1000);
	}
	
	this.start = function() {
		this.deck.shuffle(10);
		for (var i = 0; i < 3; i ++) {
			this.deal();
		}
		player = new Hand({
			elementId: "player",
			position: "bottom"
		});
		setTimeout(function() {
			player.draw();
			player.draw();
			setTimeout(function() {
				player.showHand();
				update_bg_color();
			}, 1000);
			// update_bg_color();
		}, 500);
		// update_bg_color();
	}
	this.clear = function() {

	}
	this.pot = 0;
	this.highestBid = 0;
}

function Hand(h) {
	this.cards = new Array();
	this.folded = false;
	this.money = 50;
	this.bid = 0;
	this.elementId = h.elementId || null;
	if (this.elementId != null) {
		this.element = document.getElementById(this.elementId);
	} else {
		this.element = null;
	}
	this.element = h.element || this.element;
	this.position = h.position || "";
	this.reset = function() {
		this.cards = new Array();
		this.folded = false;
	}
	this.draw = function() {
		var card = current_round.deck.draw();
		var c_id = this.cards.length;
		this.cards.push(card);
		var cd_elem = card.element();
		if (this.element != null) {
			this.element.appendChild(cd_elem);
		}
		if (this.position == "bottom") {
			cd_elem.style.top = "";
			if (c_id) {
				cd_elem.style.left = "12px";
			} else {
				cd_elem.style.left = "-108px";
			}
			cd_elem.style.bottom = (-188 - 48 * c_id) + "px";
			setTimeout(function() {
				cd_elem.style.bottom = "-48px";
			}, 1);
		}
		
	}
	this.showHand = function() {
		for (var c = 0; c < this.cards.length; c ++) {
			this.cards[c].flip();
		}
	}
	this.matchBid = function() {
		var raise = this.current_round.highestBid - this.bid;
		this.raiseBid(raise);
	}
	this.raiseBid = function(x) {
		var x = x || 1;
		x = Math.min(x, this.money);
		this.money -= x;
		this.bid += x;
		if (this.money == 0) {
			// ALL IN!
			// Uh... Do something...
		}
	}
	this.fold = function() {
		this.folded = true;
	}
}

function hand_query(q) {
	var cards = q.cards || [];
	cards = cards.concat([]);
	var rankQuery = q.rank;
	if (typeof rankQuery === 'string') {
		rankQuery = new RegExp("^(?:" + rankQuery.replace(/\s+/g, "|") + ")$", "i");
	} else if (rankQuery == null) {
		rankQuery = /^.*$/i;
	}
	// console.log(rankQuery);
	var suitQuery = q.suit;
	if (typeof suitQuery === 'string') {
		suitQuery = new RegExp("^(?:" + suitQuery.replace(/\s+/g, "|") + ")$", "i");
	} else if (suitQuery == null) {
		suitQuery = /^.*$/i;
	}
	// console.log(suitQuery);
	var matches = new Array();
	for (var c = 0; c < cards.length; c ++) {
		var card = cards[c];
		if (rankQuery.test(card.rankStr) && suitQuery.test(card.suitStr)) {
			matches.push(card);
			cards.splice(c, 1);
			c --;
		}
	}
	var result = {
		matches: matches,
		others: cards
	};
	// console.log(result);
	return result;
}

function get_straight_flushes(cards) {
	var royal_matches = new Array();
	var matches = new Array();
	var ordered_list = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];
	var suit_list = ["spades", "hearts", "diamonds", "clubs"];
	for (var s = 0; s < 4; s ++) {
		for (var i = ordered_list.length - 1; i >= 4; i --) {
			var cs_cards = new Array();
			for (var x = 0; x < 5; x ++) {
				var q_result = hand_query({
					suit: suit_list[s],
					cards: cards,
					rank: ordered_list[i - x]
				});
				if (q_result.matches.length) {
					cs_cards.push(q_result.matches[0]);
				} else {
					continue;
				}
			}
			if (cs_cards.length == 5) {
				matches.push(cs_cards);
				if (i == 13) {
					royal_matches.push(cs_cards);
				}
			}
		}
	}
	var result = {
		royal_matches: royal_matches,
		matches: matches
	}
	// console.log(result);
	return result;
}

function get_straights(cards) {
	var matches = new Array();
	var ordered_list = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];
	for (var i = ordered_list.length - 1; i >= 4; i --) {
		var cs_cards = new Array();
		for (var x = 0; x < 5; x ++) {
			var q_result = hand_query({
				cards: cards,
				rank: ordered_list[i - x]
			});
			if (q_result.matches.length) {
				cs_cards.push(q_result.matches[0]);
			} else {
				continue;
			}
		}
		if (cs_cards.length == 5) {
			matches.push(cs_cards);
		}
	}
	var result = {
		matches: matches
	}
	// console.log(result);
	return result;
}

function get_like_ranks(cards) {
	var ca_copy = cards.concat([]);
	var pairs = new Array();
	var threes = new Array();
	var quads = new Array();
	while (ca_copy.length) {
		var card = ca_copy[0];
		var q_result = hand_query({
			cards: ca_copy,
			rank: card.rankStr
		});
		switch(q_result.matches.length) {
			case 4: quads.push(q_result.matches); break;
			case 3: threes.push(q_result.matches); break;
			case 2: pairs.push(q_result.matches); break;
			default: break;
		}
		ca_copy = q_result.others;
	}
	var result = {
		pairs: pairs,
		threes: threes,
		quads: quads
	};
	return result;
}

function get_flushes(cards) {
	var ca_copy = cards.concat([]);
	var matches = new Array();
	while (ca_copy.length) {
		var card = ca_copy[0];
		var q_result = hand_query({
			cards: ca_copy,
			suit: card.suitStr
		});
		if (q_result.matches.length >= 5) {
			matches.push(q_result.matches);
		}
		ca_copy = q_result.others;
	}
	var result = {
		matches: matches
	};
	return result;
}

function sort_groups(groups) {
	return groups.sort(function(a, b) {
		var b_rank = b[0].rank;
		if (b_rank == 1) {
			b_rank = 14;
		}
		var a_rank = a[0].rank;
		if (a_rank == 1) {
			a_rank = 14;
		}
		return (b_rank - a_rank);
	});
}
function sort_cards(cards) {
	return cards.sort(function(a, b) {
		var b_rank = b.rank;
		if (b_rank == 1) {
			b_rank = 14;
		}
		var a_rank = a.rank;
		if (a_rank == 1) {
			a_rank = 14;
		}
		return (b_rank - a_rank);
	});
}

function get_highest_hand(cards) {
	var rank = 0;
	var title = "";
	var kickers = new Array();
	var hand;
	var rank_list = ["ace", "king", "queen", "jack", "10", "9", "8", "7", "6", "5", "4", "3", "2", "ace"];

	var c_result = get_straight_flushes(cards);
	// Straight flushes (1 - 10)
	if (c_result.royal_matches.length) {
		hand = c_result.royal_matches[0];
		rank = 1;
		title = "Royal Flush";
		return {
			rank: rank,
			title: title,
			hand: hand,
			kickers: kickers
		}
	} else if (c_result.matches.length) {
		hand = c_result.matches[0];
		var high_card = hand[0];
		for (var x = 1; x < 10; x ++) {
			if (rank_list[x] == high_card.rankStr) {
				rank = 1 + x;
				title = (rank_list[x][0].toUpperCase() + rank_list[x].substr(1)) + "-High Straight Flush";
				break;
			}
		}
		return {
			rank: rank,
			title: title,
			hand: hand,
			kickers: kickers
		}
	}
	rank = 10;
	var like_ranks = get_like_ranks(cards);
	// Four of a kind (11 - 166)
	if (like_ranks.quads.length) {
		hand = like_ranks.quads[0];
		var rank_x = 0;
		for (var x = 0; x < 13; x ++) {
			if (rank_list[x] == hand[0].rankStr) {
				rank_x = x;
				rank += x * 12;
				title = "Four " + (rank_list[x][0].toUpperCase() + rank_list[x].substr(1)) + "s";
				break;
			}
		}
		kickers = sort_cards(hand_query({
			cards: cards,
			rank: hand[0].rankStr
		}).others);
		kickers.splice(1);
		for (var x = 0; x < 13; x ++) {
			if (rank_list[x] == kickers[0].rankStr) {
				if (x < rank_x) {
					rank += 1;
				}
				title += " (" + (rank_list[x][0].toUpperCase() + rank_list[x].substr(1)) + " Kick)";
				rank += x;
				break;
			}
		}
		hand.push(kickers[0]);
		return {
			rank: rank,
			title: title,
			hand: hand,
			kickers: kickers
		}
	}
	rank = 166;
	// Full house (167 - 322)
	if (like_ranks.threes.length && like_ranks.pairs.length) {
		hand = like_ranks.threes[0];
		var rank_x = 0;
		for (var x = 0; x < 13; x ++) {
			if (rank_list[x] == hand[0].rankStr) {
				rank_x = x;
				rank += x * 12;
				title = (rank_list[x][0].toUpperCase() + rank_list[x].substr(1)) + "s Full";
				break;
			}
		}
		var high_pair = sort_groups(like_ranks.pairs)[0];
		for (var x = 0; x < 13; x ++) {
			if (rank_list[x] == high_pair[0].rankStr) {
				if (x < rank_x) {
					rank += 1;
				}
				title += " over " + (rank_list[x][0].toUpperCase() + rank_list[x].substr(1)) + "s";
				rank += x;
				break;
			}
		}
		hand = hand.concat(high_pair);
		return {
			rank: rank,
			title: title,
			hand: hand,
			kickers: kickers
		}
	}
	rank = 322;
	var c_result = get_flushes(cards);
	// Flush (323 - 1599)
	if (c_result.matches.length) {
		hand = sort_cards(c_result.matches[0]).splice(0, 5);
		// var offsets = new Array();
		// offsets[0] = [0, 164, ];
		// offsets[1] = [493, 329, 209, 125, 69, 34, 14, 4];
		// offsets[2] = [329];
		// offsets[3] = [209];
		// offsets[4] = [125];
		// offsets[5] = [69];
		// offsets[6] = [34];
		// offsets[7] = [14];
		// offsets[8] = [4];
		// var rank_x1 = 0;
		for (var x = 0; x < 8; x ++) {
			if (rank_list[x] == hand[0].rankStr) {
				// rank_x1 = x;
				// rank += offsets[0][x];
				title = (rank_list[x][0].toUpperCase() + rank_list[x].substr(1)) + "-High Flush";
				break;
			}
		}
		for (var x = 0, y = flush_ranks.length; x < y; x ++) {
			var f_rank = flush_ranks[x];
			var rank_str = "";
			for (var z = 0; z < 5; z ++) {
				rank_str += " ";
				switch (f_rank[z]) {
					case "A": rank_str += "ace"; break;
					case "K": rank_str += "king"; break;
					case "Q": rank_str += "queen"; break;
					case "J": rank_str += "jack"; break;
					case "T": rank_str += "10"; break;
					default: rank_str += f_rank[z]; break;
				}
			}
			rank_str = rank_str.trim();
			if (hand_query({
				cards: hand,
				rank: rank_str
			}).matches.length == 5) {
				rank += 1 + x;
				break;
			}
		}
		// var rank_x2 = 0;
		// for (var x = 0; x < 13; x ++) {
		// 	if (rank_list[x] == hand[0].rankStr) {
		// 		rank_x2 = x;
		// 		if (x < rank_x1) {
		// 			rank += 1;
		// 		}
		// 		rank += x * 493;
		// 		break;
		// 	}
		// }
		return {
			rank: rank,
			title: title,
			hand: hand,
			kickers: kickers
		}
	}
	rank = 1599;
	var c_result = get_straights(cards);
	// Straights (1600 - 1609)
	if (c_result.matches.length > 0) {
		hand = c_result.matches[0];
		var high_card = hand[0];
		for (var x = 0; x < 10; x ++) {
			if (rank_list[x] == high_card.rankStr) {
				rank += 1 + x;
				title = (rank_list[x][0].toUpperCase() + rank_list[x].substr(1)) + "-High Straight";
				break;
			}
		}
		return {
			rank: rank,
			title: title,
			hand: hand,
			kickers: kickers
		}
	}
	rank = 1609;
	// Three of a kind (1610 - 2467)
	if (like_ranks.threes.length) {
		hand = sort_groups(like_ranks.threes)[0];
		var rank_x = 0;
		for (var x = 0; x < 13; x ++) {
			if (rank_list[x] == hand[0].rankStr) {
				rank_x = x;
				rank += x * 66;
				title = "Three " + (rank_list[x][0].toUpperCase() + rank_list[x].substr(1)) + "s";
				break;
			}
		}
		kickers = sort_cards(hand_query({
			cards: cards,
			rank: hand[0].rankStr
		}).others);
		kickers.splice(2);
		var offset_list = [0, 11, 21, 30, 38, 45, 51, 56, 60, 63, 65];
		var rank_x2 = 0;
		for (var x = 0; x < 13; x ++) {
			if (rank_list[x] == kickers[0].rankStr) {
				rank_x2 = x;
				rank += offset_list[(x > rank_x ? x - 1 : x)];
				break;
			}
		}
		hand.push(kickers[0]);
		for (var x = 0; x < 13; x ++) {
			if (rank_list[x] == kickers[1].rankStr) {
				rank -= rank_x2;
				rank += x;
				break;
			}
		}
		hand.push(kickers[1]);
		return {
			rank: rank,
			title: title,
			hand: hand,
			kickers: kickers
		}
	}
	rank = 2467;
	// Two pair (2468 - 3325)
	if (like_ranks.pairs.length >= 2) {
		var c_groups = sort_groups(like_ranks.pairs).splice(0, 2);
		hand = c_groups[0].concat(c_groups[1]);
		// var offset_list = [0, 132, 121, 111, 102, 94, 87, 81, 76, 72, 69, 67, 66];
		var offset_list = [0, 132, 253, 364, 466, 560, 647, 728, 804, 876, 945, 1012, 1078];
		var rank_x = 0;
		for (var x = 0; x < 13; x ++) {
			if (rank_list[x] == hand[0].rankStr) {
				rank_x = x;
				rank += offset_list[x];
				title = (rank_list[x][0].toUpperCase() + rank_list[x].substr(1)) + "s";
				break;
			}
		}
		// var offset_list2 = [0, 11, 21, 30, 38, 45, 51, 56, 60, 63, 65];
		var rank_x2 = 0;
		for (var x = 0; x < 13; x ++) {
			if (rank_list[x] == hand[2].rankStr) {
				rank_x2 = x;
				rank += (x - rank_x - 1) * 11;
				title += " and " + (rank_list[x][0].toUpperCase() + rank_list[x].substr(1)) + "s";
				break;
			}
		}
		kickers = sort_cards(hand_query({
			cards: cards,
			rank: hand[0].rankStr + " " + hand[2].rankStr
		}).others);
		kickers.splice(1);
		for (var x = 0; x < 13; x ++) {
			if (rank_list[x] == kickers[0].rankStr) {
				if (x > rank_x) {
					rank --;
				}
				if (x > rank_x2) {
					rank --;
				}
				rank += x + 1;
				break;
			}
		}
		hand.push(kickers[0]);
		return {
			rank: rank,
			title: title,
			hand: hand,
			kickers: kickers
		}
	}
	rank = 3325;
	// One pair (3326 - 6185)
	if (like_ranks.pairs.length) {
		hand = like_ranks.pairs[0];
		var rank_x = 0;
		for (var x = 0; x < 13; x ++) {
			if (rank_list[x] == hand[0].rankStr) {
				rank_x = x;
				rank += x * 220;
				title = "Pair of " + (rank_list[x][0].toUpperCase() + rank_list[x].substr(1)) + "s";
				break;
			}
		}
		kickers = sort_cards(hand_query({
			cards: cards,
			rank: hand[0].rankStr
		}).others);
		kickers.splice(3);
		// var offset_list = [0, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1, 0];
		var offset_list = [0, 55, 100, 136, 164, 185, 200, 210, 216, 219, 220];
		var rank_x2 = 0;
		for (var x = 0; x < 13; x ++) {
			if (rank_list[x] == kickers[0].rankStr) {
				rank_x2 = x;
				rank += offset_list[(x > rank_x ? x - 1 : x)];
				break;
			}
		}
		hand.push(kickers[0]);
		// var offset_list2 = [0, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
		var offset_list2 = [0, 10, 19, 27, 34, 40, 45, 49, 52, 54, 55];
		var rank_x3 = 0;
		for (var x = 0; x < 13; x ++) {
			if (rank_list[x] == kickers[1].rankStr) {
				rank_x3 = x;
				var z = x;
				if (x > rank_x) {
					z --;
				}
				if (x > rank_x2) {
					z --;
				}
				rank += offset_list2[z];
				break;
			}
		}
		hand.push(kickers[1]);
		for (var x = 0; x < 13; x ++) {
			if (rank_list[x] == kickers[2].rankStr) {
				rank -= rank_x3;
				rank += x;
				break;
			}
		}
		hand.push(kickers[2]);
		return {
			rank: rank,
			title: title,
			hand: hand,
			kickers: kickers
		}
	}
	rank = 6185;
	// Highest card
	hand = sort_cards(cards).splice(0, 5);
	var rank_x = 0;
	for (var x = 0; x < 13; x ++) {
		if (rank_list[x] == hand[0].rankStr) {
			rank_x = x;
			rank += x;
			title = (rank_list[x][0].toUpperCase() + rank_list[x].substr(1)) + "-High";
			break;
		}
	}
	for (var z = 1; z < 5; z ++) {
		for (var x = 0; x < 13; x ++) {
			if (rank_list[x] == hand[z].rankStr) {
				rank += x;
				break;
			}
		}
	}
	return {
		rank: rank,
		title: title,
		hand: hand,
		kickers: kickers
	}
}

// Flush ranks
var flush_ranks = ["AKQJ9", "AKQJ8", "AKQJ7", "AKQJ6", "AKQJ5", "AKQJ4", "AKQJ3", "AKQJ2", "AKQT9", "AKQT8", "AKQT7", "AKQT6", "AKQT5", "AKQT4", "AKQT3", "AKQT2", "AKQ98", "AKQ97", "AKQ96", "AKQ95", "AKQ94", "AKQ93", "AKQ92", "AKQ87", "AKQ86", "AKQ85", "AKQ84", "AKQ83", "AKQ82", "AKQ76", "AKQ75", "AKQ74", "AKQ73", "AKQ72", "AKQ65", "AKQ64", "AKQ63", "AKQ62", "AKQ54", "AKQ53", "AKQ52", "AKQ43", "AKQ42", "AKQ32", "AKJT9", "AKJT8", "AKJT7", "AKJT6", "AKJT5", "AKJT4", "AKJT3", "AKJT2", "AKJ98", "AKJ97", "AKJ96", "AKJ95", "AKJ94", "AKJ93", "AKJ92", "AKJ87", "AKJ86", "AKJ85", "AKJ84", "AKJ83", "AKJ82", "AKJ76", "AKJ75", "AKJ74", "AKJ73", "AKJ72", "AKJ65", "AKJ64", "AKJ63", "AKJ62", "AKJ54", "AKJ53", "AKJ52", "AKJ43", "AKJ42", "AKJ32", "AKT98", "AKT97", "AKT96", "AKT95", "AKT94", "AKT93", "AKT92", "AKT87", "AKT86", "AKT85", "AKT84", "AKT83", "AKT82", "AKT76", "AKT75", "AKT74", "AKT73", "AKT72", "AKT65", "AKT64", "AKT63", "AKT62", "AKT54", "AKT53", "AKT52", "AKT43", "AKT42", "AKT32", "AK987", "AK986", "AK985", "AK984", "AK983", "AK982", "AK976", "AK975", "AK974", "AK973", "AK972", "AK965", "AK964", "AK963", "AK962", "AK954", "AK953", "AK952", "AK943", "AK942", "AK932", "AK876", "AK875", "AK874", "AK873", "AK872", "AK865", "AK864", "AK863", "AK862", "AK854", "AK853", "AK852", "AK843", "AK842", "AK832", "AK765", "AK764", "AK763", "AK762", "AK754", "AK753", "AK752", "AK743", "AK742", "AK732", "AK654", "AK653", "AK652", "AK643", "AK642", "AK632", "AK543", "AK542", "AK532", "AK432", "AQJT9", "AQJT8", "AQJT7", "AQJT6", "AQJT5", "AQJT4", "AQJT3", "AQJT2", "AQJ98", "AQJ97", "AQJ96", "AQJ95", "AQJ94", "AQJ93", "AQJ92", "AQJ87", "AQJ86", "AQJ85", "AQJ84", "AQJ83", "AQJ82", "AQJ76", "AQJ75", "AQJ74", "AQJ73", "AQJ72", "AQJ65", "AQJ64", "AQJ63", "AQJ62", "AQJ54", "AQJ53", "AQJ52", "AQJ43", "AQJ42", "AQJ32", "AQT98", "AQT97", "AQT96", "AQT95", "AQT94", "AQT93", "AQT92", "AQT87", "AQT86", "AQT85", "AQT84", "AQT83", "AQT82", "AQT76", "AQT75", "AQT74", "AQT73", "AQT72", "AQT65", "AQT64", "AQT63", "AQT62", "AQT54", "AQT53", "AQT52", "AQT43", "AQT42", "AQT32", "AQ987", "AQ986", "AQ985", "AQ984", "AQ983", "AQ982", "AQ976", "AQ975", "AQ974", "AQ973", "AQ972", "AQ965", "AQ964", "AQ963", "AQ962", "AQ954", "AQ953", "AQ952", "AQ943", "AQ942", "AQ932", "AQ876", "AQ875", "AQ874", "AQ873", "AQ872", "AQ865", "AQ864", "AQ863", "AQ862", "AQ854", "AQ853", "AQ852", "AQ843", "AQ842", "AQ832", "AQ765", "AQ764", "AQ763", "AQ762", "AQ754", "AQ753", "AQ752", "AQ743", "AQ742", "AQ732", "AQ654", "AQ653", "AQ652", "AQ643", "AQ642", "AQ632", "AQ543", "AQ542", "AQ532", "AQ432", "AJT98", "AJT97", "AJT96", "AJT95", "AJT94", "AJT93", "AJT92", "AJT87", "AJT86", "AJT85", "AJT84", "AJT83", "AJT82", "AJT76", "AJT75", "AJT74", "AJT73", "AJT72", "AJT65", "AJT64", "AJT63", "AJT62", "AJT54", "AJT53", "AJT52", "AJT43", "AJT42", "AJT32", "AJ987", "AJ986", "AJ985", "AJ984", "AJ983", "AJ982", "AJ976", "AJ975", "AJ974", "AJ973", "AJ972", "AJ965", "AJ964", "AJ963", "AJ962", "AJ954", "AJ953", "AJ952", "AJ943", "AJ942", "AJ932", "AJ876", "AJ875", "AJ874", "AJ873", "AJ872", "AJ865", "AJ864", "AJ863", "AJ862", "AJ854", "AJ853", "AJ852", "AJ843", "AJ842", "AJ832", "AJ765", "AJ764", "AJ763", "AJ762", "AJ754", "AJ753", "AJ752", "AJ743", "AJ742", "AJ732", "AJ654", "AJ653", "AJ652", "AJ643", "AJ642", "AJ632", "AJ543", "AJ542", "AJ532", "AJ432", "AT987", "AT986", "AT985", "AT984", "AT983", "AT982", "AT976", "AT975", "AT974", "AT973", "AT972", "AT965", "AT964", "AT963", "AT962", "AT954", "AT953", "AT952", "AT943", "AT942", "AT932", "AT876", "AT875", "AT874", "AT873", "AT872", "AT865", "AT864", "AT863", "AT862", "AT854", "AT853", "AT852", "AT843", "AT842", "AT832", "AT765", "AT764", "AT763", "AT762", "AT754", "AT753", "AT752", "AT743", "AT742", "AT732", "AT654", "AT653", "AT652", "AT643", "AT642", "AT632", "AT543", "AT542", "AT532", "AT432", "A9876", "A9875", "A9874", "A9873", "A9872", "A9865", "A9864", "A9863", "A9862", "A9854", "A9853", "A9852", "A9843", "A9842", "A9832", "A9765", "A9764", "A9763", "A9762", "A9754", "A9753", "A9752", "A9743", "A9742", "A9732", "A9654", "A9653", "A9652", "A9643", "A9642", "A9632", "A9543", "A9542", "A9532", "A9432", "A8765", "A8764", "A8763", "A8762", "A8754", "A8753", "A8752", "A8743", "A8742", "A8732", "A8654", "A8653", "A8652", "A8643", "A8642", "A8632", "A8543", "A8542", "A8532", "A8432", "A7654", "A7653", "A7652", "A7643", "A7642", "A7632", "A7543", "A7542", "A7532", "A7432", "A6543", "A6542", "A6532", "A6432", "KQJT8", "KQJT7", "KQJT6", "KQJT5", "KQJT4", "KQJT3", "KQJT2", "KQJ98", "KQJ97", "KQJ96", "KQJ95", "KQJ94", "KQJ93", "KQJ92", "KQJ87", "KQJ86", "KQJ85", "KQJ84", "KQJ83", "KQJ82", "KQJ76", "KQJ75", "KQJ74", "KQJ73", "KQJ72", "KQJ65", "KQJ64", "KQJ63", "KQJ62", "KQJ54", "KQJ53", "KQJ52", "KQJ43", "KQJ42", "KQJ32", "KQT98", "KQT97", "KQT96", "KQT95", "KQT94", "KQT93", "KQT92", "KQT87", "KQT86", "KQT85", "KQT84", "KQT83", "KQT82", "KQT76", "KQT75", "KQT74", "KQT73", "KQT72", "KQT65", "KQT64", "KQT63", "KQT62", "KQT54", "KQT53", "KQT52", "KQT43", "KQT42", "KQT32", "KQ987", "KQ986", "KQ985", "KQ984", "KQ983", "KQ982", "KQ976", "KQ975", "KQ974", "KQ973", "KQ972", "KQ965", "KQ964", "KQ963", "KQ962", "KQ954", "KQ953", "KQ952", "KQ943", "KQ942", "KQ932", "KQ876", "KQ875", "KQ874", "KQ873", "KQ872", "KQ865", "KQ864", "KQ863", "KQ862", "KQ854", "KQ853", "KQ852", "KQ843", "KQ842", "KQ832", "KQ765", "KQ764", "KQ763", "KQ762", "KQ754", "KQ753", "KQ752", "KQ743", "KQ742", "KQ732", "KQ654", "KQ653", "KQ652", "KQ643", "KQ642", "KQ632", "KQ543", "KQ542", "KQ532", "KQ432", "KJT98", "KJT97", "KJT96", "KJT95", "KJT94", "KJT93", "KJT92", "KJT87", "KJT86", "KJT85", "KJT84", "KJT83", "KJT82", "KJT76", "KJT75", "KJT74", "KJT73", "KJT72", "KJT65", "KJT64", "KJT63", "KJT62", "KJT54", "KJT53", "KJT52", "KJT43", "KJT42", "KJT32", "KJ987", "KJ986", "KJ985", "KJ984", "KJ983", "KJ982", "KJ976", "KJ975", "KJ974", "KJ973", "KJ972", "KJ965", "KJ964", "KJ963", "KJ962", "KJ954", "KJ953", "KJ952", "KJ943", "KJ942", "KJ932", "KJ876", "KJ875", "KJ874", "KJ873", "KJ872", "KJ865", "KJ864", "KJ863", "KJ862", "KJ854", "KJ853", "KJ852", "KJ843", "KJ842", "KJ832", "KJ765", "KJ764", "KJ763", "KJ762", "KJ754", "KJ753", "KJ752", "KJ743", "KJ742", "KJ732", "KJ654", "KJ653", "KJ652", "KJ643", "KJ642", "KJ632", "KJ543", "KJ542", "KJ532", "KJ432", "KT987", "KT986", "KT985", "KT984", "KT983", "KT982", "KT976", "KT975", "KT974", "KT973", "KT972", "KT965", "KT964", "KT963", "KT962", "KT954", "KT953", "KT952", "KT943", "KT942", "KT932", "KT876", "KT875", "KT874", "KT873", "KT872", "KT865", "KT864", "KT863", "KT862", "KT854", "KT853", "KT852", "KT843", "KT842", "KT832", "KT765", "KT764", "KT763", "KT762", "KT754", "KT753", "KT752", "KT743", "KT742", "KT732", "KT654", "KT653", "KT652", "KT643", "KT642", "KT632", "KT543", "KT542", "KT532", "KT432", "K9876", "K9875", "K9874", "K9873", "K9872", "K9865", "K9864", "K9863", "K9862", "K9854", "K9853", "K9852", "K9843", "K9842", "K9832", "K9765", "K9764", "K9763", "K9762", "K9754", "K9753", "K9752", "K9743", "K9742", "K9732", "K9654", "K9653", "K9652", "K9643", "K9642", "K9632", "K9543", "K9542", "K9532", "K9432", "K8765", "K8764", "K8763", "K8762", "K8754", "K8753", "K8752", "K8743", "K8742", "K8732", "K8654", "K8653", "K8652", "K8643", "K8642", "K8632", "K8543", "K8542", "K8532", "K8432", "K7654", "K7653", "K7652", "K7643", "K7642", "K7632", "K7543", "K7542", "K7532", "K7432", "K6543", "K6542", "K6532", "K6432", "K5432", "QJT97", "QJT96", "QJT95", "QJT94", "QJT93", "QJT92", "QJT87", "QJT86", "QJT85", "QJT84", "QJT83", "QJT82", "QJT76", "QJT75", "QJT74", "QJT73", "QJT72", "QJT65", "QJT64", "QJT63", "QJT62", "QJT54", "QJT53", "QJT52", "QJT43", "QJT42", "QJT32", "QJ987", "QJ986", "QJ985", "QJ984", "QJ983", "QJ982", "QJ976", "QJ975", "QJ974", "QJ973", "QJ972", "QJ965", "QJ964", "QJ963", "QJ962", "QJ954", "QJ953", "QJ952", "QJ943", "QJ942", "QJ932", "QJ876", "QJ875", "QJ874", "QJ873", "QJ872", "QJ865", "QJ864", "QJ863", "QJ862", "QJ854", "QJ853", "QJ852", "QJ843", "QJ842", "QJ832", "QJ765", "QJ764", "QJ763", "QJ762", "QJ754", "QJ753", "QJ752", "QJ743", "QJ742", "QJ732", "QJ654", "QJ653", "QJ652", "QJ643", "QJ642", "QJ632", "QJ543", "QJ542", "QJ532", "QJ432", "QT987", "QT986", "QT985", "QT984", "QT983", "QT982", "QT976", "QT975", "QT974", "QT973", "QT972", "QT965", "QT964", "QT963", "QT962", "QT954", "QT953", "QT952", "QT943", "QT942", "QT932", "QT876", "QT875", "QT874", "QT873", "QT872", "QT865", "QT864", "QT863", "QT862", "QT854", "QT853", "QT852", "QT843", "QT842", "QT832", "QT765", "QT764", "QT763", "QT762", "QT754", "QT753", "QT752", "QT743", "QT742", "QT732", "QT654", "QT653", "QT652", "QT643", "QT642", "QT632", "QT543", "QT542", "QT532", "QT432", "Q9876", "Q9875", "Q9874", "Q9873", "Q9872", "Q9865", "Q9864", "Q9863", "Q9862", "Q9854", "Q9853", "Q9852", "Q9843", "Q9842", "Q9832", "Q9765", "Q9764", "Q9763", "Q9762", "Q9754", "Q9753", "Q9752", "Q9743", "Q9742", "Q9732", "Q9654", "Q9653", "Q9652", "Q9643", "Q9642", "Q9632", "Q9543", "Q9542", "Q9532", "Q9432", "Q8765", "Q8764", "Q8763", "Q8762", "Q8754", "Q8753", "Q8752", "Q8743", "Q8742", "Q8732", "Q8654", "Q8653", "Q8652", "Q8643", "Q8642", "Q8632", "Q8543", "Q8542", "Q8532", "Q8432", "Q7654", "Q7653", "Q7652", "Q7643", "Q7642", "Q7632", "Q7543", "Q7542", "Q7532", "Q7432", "Q6543", "Q6542", "Q6532", "Q6432", "Q5432", "JT986", "JT985", "JT984", "JT983", "JT982", "JT976", "JT975", "JT974", "JT973", "JT972", "JT965", "JT964", "JT963", "JT962", "JT954", "JT953", "JT952", "JT943", "JT942", "JT932", "JT876", "JT875", "JT874", "JT873", "JT872", "JT865", "JT864", "JT863", "JT862", "JT854", "JT853", "JT852", "JT843", "JT842", "JT832", "JT765", "JT764", "JT763", "JT762", "JT754", "JT753", "JT752", "JT743", "JT742", "JT732", "JT654", "JT653", "JT652", "JT643", "JT642", "JT632", "JT543", "JT542", "JT532", "JT432", "J9876", "J9875", "J9874", "J9873", "J9872", "J9865", "J9864", "J9863", "J9862", "J9854", "J9853", "J9852", "J9843", "J9842", "J9832", "J9765", "J9764", "J9763", "J9762", "J9754", "J9753", "J9752", "J9743", "J9742", "J9732", "J9654", "J9653", "J9652", "J9643", "J9642", "J9632", "J9543", "J9542", "J9532", "J9432", "J8765", "J8764", "J8763", "J8762", "J8754", "J8753", "J8752", "J8743", "J8742", "J8732", "J8654", "J8653", "J8652", "J8643", "J8642", "J8632", "J8543", "J8542", "J8532", "J8432", "J7654", "J7653", "J7652", "J7643", "J7642", "J7632", "J7543", "J7542", "J7532", "J7432", "J6543", "J6542", "J6532", "J6432", "J5432", "T9875", "T9874", "T9873", "T9872", "T9865", "T9864", "T9863", "T9862", "T9854", "T9853", "T9852", "T9843", "T9842", "T9832", "T9765", "T9764", "T9763", "T9762", "T9754", "T9753", "T9752", "T9743", "T9742", "T9732", "T9654", "T9653", "T9652", "T9643", "T9642", "T9632", "T9543", "T9542", "T9532", "T9432", "T8765", "T8764", "T8763", "T8762", "T8754", "T8753", "T8752", "T8743", "T8742", "T8732", "T8654", "T8653", "T8652", "T8643", "T8642", "T8632", "T8543", "T8542", "T8532", "T8432", "T7654", "T7653", "T7652", "T7643", "T7642", "T7632", "T7543", "T7542", "T7532", "T7432", "T6543", "T6542", "T6532", "T6432", "T5432", "98764", "98763", "98762", "98754", "98753", "98752", "98743", "98742", "98732", "98654", "98653", "98652", "98643", "98642", "98632", "98543", "98542", "98532", "98432", "97654", "97653", "97652", "97643", "97642", "97632", "97543", "97542", "97532", "97432", "96543", "96542", "96532", "96432", "95432", "87653", "87652", "87643", "87642", "87632", "87543", "87542", "87532", "87432", "86543", "86542", "86532", "86432", "85432", "76542", "76532", "76432", "75432"];

// test_hand = new Array();
// for (var i = 0; i < 7; i ++) {
// 	test_hand.push(new Card({
// 		suit: irandom(4),
// 		rank: 1 + irandom(13)
// 	}));
// }

// test_hand = new Array();
// for (var i = 0; i < 6; i ++) {
// 	test_hand.push(new Card({
// 		suit: 1,
// 		rank: 8 + i
// 	}));
// }
// test_hand.push(new Card({
// 	suit: 1,
// 	rank: 1
// }));

// test_hand = new Array();
// for (var i = 0; i < 3; i ++) {
// 	test_hand.push(new Card({
// 		suit: i,
// 		rank: 7
// 	}));
// }
// for (var i = 0; i < 2; i ++) {
// 	test_hand.push(new Card({
// 		suit: i,
// 		rank: 5
// 	}));
// }
// for (var i = 0; i < 2; i ++) {
// 	test_hand.push(new Card({
// 		suit: irandom(4),
// 		rank: irandom(6) + 8
// 	}));
// }
test_hand = new Array();
var yo = new Deck();
yo.shuffle();
while(test_hand.length < 7) {
	var _card = yo.draw();
	test_hand.push(_card);
	console.log(_card.rankStr + " of " + _card.suitStr);
}
console.log(get_highest_hand(test_hand));

var yo = new Deck();
full_deck = new Array();
while(yo.cards.length > 0) {
	full_deck.push(yo.draw());
}