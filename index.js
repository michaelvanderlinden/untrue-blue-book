

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
	var words = [], word = '\n', i = 1;
	while (i < target_len || word != '\n') {
		i += 1;
		if (!(tree.dept.cat.hasOwnProperty(word)))
			return;
		var nextword = weightedSelect(tree.dept.cat.word.keys(), tree.dept.cat.word.values());
		if (nextword == '\n') {
			if (cat == 'name' && word.substr(-1) != ':' && i < target_len)
				words.push(connectors[randomInt(0, 6)]);
		} else {
			words.push(nextword);
		}
		word = nextword;
	}
	return words;
}

function generate_name() {
	var words = generate(dept='AFAM', cat='name', target_len=randomInt(6, 14));
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