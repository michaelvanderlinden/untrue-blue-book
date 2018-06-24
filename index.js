

var bush = { "AFAM": 
				{"name": 
					{"\n": 
						{"Significance": 3, "The": 3}
					}, 
				"desc" : 
					{"\n": 
						{"Dub": 1, "Race,": 1, "Caribbean": 2},
					"The": 
						{"Dub": 1, "Race,": 1, "Caribbean": 2}
					}
				}
			}

var connectors = ['in', 'and', 'of', 'with', 'for'];

// Returns a random integer between min (inclusive) and max (inclusive) 
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function weightedSelect(items, weights) {
	var total = 0;
	var ranges = weights.slice(0);
	for(var i = 0, len = weights.length; i < len; i++) {
		ranges[i] = [total, total += ranges[i]];
	}
	var randomNumber = parseInt(Math.random() * total);
	for(;randomNumber < ranges[--i][0];);
	return items[i];
}

function generate(dept, cat, target_len=1000) {
	console.log(target_len);
	var words = [], word = '\n', i = 0;
	while (i < target_len || word != '\n' || word.substr(-1) == ':') {
		if (!(tree[dept][cat].hasOwnProperty(word)))
			// console.log('test');
			break;
		var nextword = weightedSelect(
			Object.keys(tree[dept][cat][word]),
			Object.values(tree[dept][cat][word]));
		if (nextword == '\n') {
			console.log(word);
			console.log(i);
			if (cat == 'name' && word.substr(-1) != ':' && i < target_len) {
				console.log("Adding connector");
				words.push(connectors[randomInt(0, 4)]);
			}
		} else {
			words.push(nextword);
			i++;
		}
		word = nextword;
		// console.log(word);
	}
	// console.log("got here 2");
	// console.log(words.length);
	// for (var i = 0; i < words.length; i++)
	// 	console.log(words[i]);
	return words;
}

function generate_name() {
	var words = generate(dept='AFAM', cat='name', target_len=randomInt(3, 11));
	// for (var i = 0; i < words.length; i++)
	// 	console.log(words[i]);
	return words.join(' ');
}

function generate_desc() {
	var words = generate(dept='AFAM', cat='desc', target_len=randomInt(45, 100));
	return words.join(' ');
}

function update_all() {
	document.getElementById('name').innerHTML = generate_name();
	document.getElementById('desc').innerHTML = generate_desc();
}


document.getElementById('gen_name_desc').onclick = update_all();