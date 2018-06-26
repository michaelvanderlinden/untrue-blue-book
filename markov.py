# Markov text generator
# Michael Van der Linden 2018

import pickle
import re
import random
import json

class MarkovOneDegree:
	def __init__(self):
		self.tree = {}
		self.connectors = ['in', 'and', 'of', 'with', 'for']
		self.ending_punc = '.?!"'
		self.abbrs = ['vs.', 'U.S.', 'etc.', 'B.C.E.', 'A.D.', 'B.S.', 'B.A.', 'p.m.', 'a.m.', 'i.e.', 'e.g.', 'W.E.B.', 'M.W.', 'C.L.R.']

	# returns true if word is a red-herring sentence ender (ends in period but not actually end of sentence)
	def red_herring(self, word):
		return bool(word in self.abbrs or re.match(r'[A-Z]\.', word))

	def parse(self, text, cat):
		words = list(filter(lambda s: len(s) > 0, re.split(r'\s', text))) # split at spaces
		words.insert(0, '\n') # beginning and end are breaks that will use connector words
		for idx, word in enumerate(words):
			if (cat == 'name' and word[-1] == ':') or (cat == 'desc' and word[-1] in self.ending_punc and not self.red_herring(word)):
				words.insert(idx + 1, '\n') # breaks after colons in names and after periods, etc in descriptions
		if words[-1] is not '\n':
			words.append('\n')
		return words

	def train(self, text, dept, cat):
		if dept not in self.tree: # init tree entry for dept
			self.tree[dept] = {'name' : {}, 'desc' : {}}
		if len(text) == 0:
			print("Error: received empty text")
			exit()
		words = self.parse(text, cat)
		for a, b in [(words[i], words[i+1]) for i in range(len(words)-1)]:
			# keep a running count of occurences of b after a
			if a not in self.tree[dept][cat]:
				self.tree[dept][cat][a] = {} # dict to hold words that come after a
			if b in self.tree[dept][cat][a]:
				self.tree[dept][cat][a][b] += 1	# count another instance of the pair
			else:
				self.tree[dept][cat][a][b] = 1 	# start counting that pair

	def train_on_file(self, source_filename):
		with open(source_filename, 'r') as f:
			line = f.readline() # fetch first dept
			while line is not "": # readline() only returns "" on EOF
				if not re.match(r'^[A-Z&]{3,4}\n', line):
					print("Error: wrong line format (expecting dept number):\n" + line)
					exit()
				dept = line[:-1] # strip trailing newline
				line = f.readline() # fetch course name
				if not re.match(r'^.+\n', line):
					print("Error: wrong line format (expecting course name):\n" + line)
					exit()
				self.train(line[:-1], dept, 'name')
				line = f.readline() # fetch course description or empty line if no description
				if line is not '\n': # description exists
					if not re.match(r'.+\n', line):
						print("Error: wrong line format (expecting course description):\n" + line)
						exit()
					self.train(line[:-1], dept, 'desc')
					line = f.readline() # fetch empty line
					if line is not '\n':
						print("Error: wrong line format (expecting empty line):\n" + line)
						exit()
				line = f.readline() # fetch next dept or empty string if EOF
				# Note: training file ends with an empty line for uniformity

	def save_training(self, json_filename):
		with open(json_filename, 'w') as f:
			f.write("var tree = ")
			json.dump(self.tree, f)
		# with open(pickle_filename, 'wb') as f:
		# 	pickle.dump(self.tree, f)

	def load_training(self, pickle_filename):
		with open(pickle_filename, 'rb') as f:
			self.tree = pickle.load(f)

	def load_or_train_save(self, pickle_filename, source_filename):
		try:
			self.load_training(pickle_filename)
		except FileNotFoundError:
			self.train_on_file(source_filename)
			self.save_training(pickle_filename)

	def generate(self, dept, cat, start_with=None, target_len=1000):
		if len(self.tree) == 0:
			return
		word = start_with if start_with is not None and start_with in self.tree[dept]['name'] else '\n'
		if word is not '\n':
			yield word
		i = 1
		while target_len == 0 or i < target_len or word is not "\n": # 0 target len means unlimited length, only ends when we hit dead end (not guaranteed)
			i += 1
			if word not in self.tree[dept][cat]: # dead end
				return
			options = list(self.tree[dept][cat][word].keys())   # list of words that follow word
			weights = list(self.tree[dept][cat][word].values()) # list of counts of each of those following words (guaranteed in same order)
			# ! for speed, I could pre-generate these or store them in the tree somewhere
			nextword = random.choices(options, weights=weights, k=1)[0] # nextword lookbehind necessary for colon connector check
			if nextword is '\n':
				if cat == 'name' and word[-1] != ':' and i < target_len: # use connectors for non-colon connections
					yield random.choice(self.connectors)
			else:
				yield nextword
			word = nextword

	def printdepartments(self):
		with open("depts.txt", "w") as f:
			depts = list(self.tree.keys())
			depts.sort()
			print(depts)
			for dept in depts:
				f.write(dept + '\n')


def gen_name(m):
	print(' '.join([w for w in m.generate(dept='MATH', cat='name', target_len=random.randrange(6, 15))]))

def gen_desc(m):
	print(' '.join([w for w in m.generate(dept='MATH', cat='desc', target_len=100)]))


mkv = MarkovOneDegree()
mkv.train_on_file(source_filename='extracted-courses.txt')
mkv.save_training(json_filename='tree.js')
exit()


gen_name(mkv)
gen_desc(mkv)
exit()

