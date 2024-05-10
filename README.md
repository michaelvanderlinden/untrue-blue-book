## Untrue Blue Book

Live site here: https://michaelvanderlinden.github.io/untrue-blue-book/

This app generates original Yale course names and descriptions using Markov Chains.

To build a Markov model, the system first has to be trained on a large data set. This app uses the 2017-18 Yale College Programs of Study ("Yale Blue Book") as training data. It reads through the book, and for every word 'A', it keeps a running tally of all the words 'B' that come immediately after 'A', with the corresponding frequency of occurence of each A-B combination. When the app finishes reading the training data, it completes a big table of probabilities for word combinations that it can use to write original phrases. The probability table is further organized by academic department and course names vs. course descriptions, which allows us to specify exactly what type of phrase we want to generate.

Starting with a random "starting word" (a word that appeared in the Blue Book at the beginning of a sentence or phrase), the app chooses each subsequent word with a weighted random selection from that word's probability table entry. The phrases have a target length, but the app uses it only as a guideline, continuing the phrase until it reaches a "stopping word" (one that appeared in the Blue Book at the end of a sentence or phrase).

There's a bit of polishing at the end (for example, the app tries to avoid getting tricked by colons, initials, and abbreviations), but for the most part the sentences are simple stochastic word chains. The result is nonsense that still captures the impression of the source material.

Message me if you're interested in the formatted training data (Yale course names and descriptions)
