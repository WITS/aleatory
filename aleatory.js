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

function get_highest_hand(cards) {

}

test_hand = new Array();
for (var i = 0; i < 7; i ++) {
	test_hand.push(new Card({
		suit: irandom(4),
		rank: 1 + irandom(13)
	}));
}

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

var yo = new Deck();
full_deck = new Array();
while(yo.cards.length > 0) {
	full_deck.push(yo.draw());
}