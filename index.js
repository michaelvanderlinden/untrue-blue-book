// Join title phrases together
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
	var words = [], word = '\n', i = 0;
	while (i == 0 || i < target_len || word != '\n' || words.slice(-1)[0].substr(-1) == ':') {
		if (!(tree[dept][cat].hasOwnProperty(word)))
			break;
		var nextword = weightedSelect(
			Object.keys(tree[dept][cat][word]),
			Object.values(tree[dept][cat][word]));
		if (nextword == '\n') {
			if (cat == 'name' && word.substr(-1) != ':' && i < target_len)
				words.push(connectors[randomInt(0, 4)]);
				// only increment counter after "real" word to prevent dangling connectors
		} else {
			words.push(nextword);
			i++;
		}
		word = nextword;
	}
	return words;
}

function generate_number() {
	var a = randomInt(1, 4).toString();
	var b = randomInt(0, 9).toString();
	var c = randomInt(0, 9).toString();
	return a + b + c;
}

function generate_name(dep) {
	var words = generate(dept=dep, cat='name', target_len=randomInt(3, 9));
	return dep + ' ' + generate_number() + ', ' + words.join(' ');
}

function generate_desc(dep) {
	var words = generate(dept=dep, cat='desc', target_len=randomInt(45, 80));
	return words.join(' ');
}

function update_all() {
	var e = document.getElementById('depts');
	var dept = e.options[e.selectedIndex].value;
	if (dept == 'RANDOM')
		dept = e.options[randomInt(1, 102)].value;
	document.getElementById('name').innerHTML = generate_name(dept);
	document.getElementById('desc').innerHTML = generate_desc(dept);
}

update_all();
document.getElementById('gen_name_desc').onclick = update_all;