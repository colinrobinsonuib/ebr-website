export const threads = [
	'machine-writing',
	'fictions-present',
	'first-person',
	'technocapitalism',
	'writing-postfeminism',
	'electropoetics',
	'internet-nation',
	'critical-ecologies',
	'webarts',
	'end-construction',
	'image-narrative',
	'music-sound-noise',
	'writing-under-constraint',
	'enfolded',
] as const;

export type Thread = (typeof threads)[number];

export const threadTitles: Record<Thread, string> = {
	'machine-writing': 'machine-writing',
	'fictions-present': 'fictions present',
	'first-person': 'first person',
	technocapitalism: 'technocapitalism',
	'writing-postfeminism': 'writing (post)feminism',
	electropoetics: 'electropoetics',
	'internet-nation': 'internet nation',
	'critical-ecologies': 'critical ecologies',
	webarts: 'web arts',
	'end-construction': 'end construction',
	'image-narrative': 'image + narrative',
	'music-sound-noise': 'music/sound/noise',
	'writing-under-constraint': 'writing under constraint',
	enfolded: 'enfolded',
} as const;

export const threadColors: Record<Thread, string> = {
	'machine-writing': '#94b85c',
	'fictions-present': '#dd7788',
	'first-person': '#729FFF',
	technocapitalism: '#52bf77',
	'writing-postfeminism': '#ff3300',
	electropoetics: '#54deff',
	'internet-nation': '#CC9966',
	'critical-ecologies': '#669933',
	webarts: '#FF6633',
	'end-construction': '#cc9933',
	'image-narrative': '#999900',
	'music-sound-noise': '#CCCC33',
	'writing-under-constraint': '#9999cc',
	enfolded: '#94b85c',
} as const;

export const threadDescriptions: Record<Thread, { text: string; date: string }> = {
	'machine-writing': {
		text: 'AI creativity, in almost all domains of digital communication, continues to be awe-inspiring, weird, silly, and deeply disturbing in the many implications of a machine that easily mimics human expression. And yet, it is human language (not computer code) that is the primary method by which these tools take instruction and learn.',
		date: 'April 2, 2023',
	},
	'fictions-present': {
		text: 'Everything that happens, happens now. The essays, narratives, and essay-narratives gathered under the thread title, Fictions Present, reaffirm the ‘presentist’ bias in electronic publishing.',
		date: 'October 24, 2006',
	},
	'first-person': {
		text: 'emerging forms of fictional and playable experiences, along with new protocols, new interfaces, and possibly even new ways of drawing the boundaries between text and code, digital gaming and textual narrative.',
		date: 'May 3, 2004',
	},
	technocapitalism: {
		text: 'As everyday life becomes further defined by communications, automations, and informatics, technology shapes our languages, animates our environments, and fosters our relationships.',
		date: 'August 17, 2003',
	},
	'writing-postfeminism': {
		text: 'Postfeminism remains an awkward yet laudable movement among younger women, and women no longer young – one which embraces pluralism and homosexuality, one which expects that women are just as involved in the electronic frontier of the Web as men are.',
		date: 'September 15, 1996',
	},
	electropoetics: {
		text: 'For many who are committed to working in electronic environments, an electronic “review” might better be named a “retrospective,” a mere scholarly commemoration of a phenomenon that is passing. There’s a technological subtext to the declining prestige of authors and literary canons. To bring that subtext to the surface will be part of ebr’s agenda.',
		date: 'March 15, 1997',
	},
	'internet-nation': {
		text: 'Postmodern politics (against the capitalist culture of postmodernity) after bosnia, kosovo, the 2001 U.S. election, 9/11, the 2004 expansion of the EU….',
		date: 'December 30, 1998',
	},
	'critical-ecologies': {
		text: 'Critical Ecologies continues to explore convergences among natural and constructed ecosystems, green politics and grey matter, silicon chips and sand.',
		date: 'December 15, 1996',
	},
	webarts: {
		text: 'Like the webarts here under discussion, ebr approaches the Internet, in the first instance, as a unique art medium.',
		date: 'December 23, 2000',
	},
	'end-construction': {
		text: 'After a full generation of constructivist thought, after close to a decade of Internet construction and nearly as long a period of activity at ebr/altx, we’re ready to put an end to the construction of periodical issues. Instead of working within an unconsidered paradigm inherited from print media, the ebr editors intend to construct our own ends, over time and on terms that we set for ourselves.',
		date: 'February 2, 2002',
	},
	'image-narrative': {
		text: 'Installed as a double issue starting in the winter of 96/97, contributors sought to explore through literature a transition already evident in the culture at large, where technology had enabled narratives of all types to undergo transformation by the image.',
		date: 'July 15, 1997',
	},
	'music-sound-noise': {
		text: 'As “sound” approaches ever more closely the condition of music it too approaches a kind of writing, which is then retroactively revealed to have been “noisy” all along.',
		date: 'October 30, 2001',
	},
	'writing-under-constraint': {
		text: 'The count-down is complete; the line has served its time. In this spirit of millennial closure, the Winter 1999/2000 issue of ebr will be the last written under the constraint of periodical publication.',
		date: 'December 31, 1999',
	},
	enfolded: {
		text: 'Unique among ebr ‘threads,’ this one is composed of essays that reside apart from ebr. The ‘enfolded’ essays retain their origin and identity, but they become available through the ebr interface. The resulting network of affiliated essays brings ebr a step closer to a literary semantic web, whose content can be collected, tagged, and interlinked among a consortium of federated sites.',
		date: 'March 23, 2007',
	},
} as const;
