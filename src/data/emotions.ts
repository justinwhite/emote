export const NVC_EMOTIONS = {
    // NEEDS MET (Positive)
    joy: [
        "absorbed", "adventurous", "affectionate", "alive", "amazed", "amused", "animated", "appreciative", "ardent", "aroused", "astonished",
        "blissful", "buoyant", "calm", "carefree", "cheerful", "comfortable", "complacent", "composed", "concerned", "confident", "content", "cool",
        "curious", "dazzled", "delighted", "eager", "ebullient", "ecstatic", "effervescent", "elated", "enchanted", "encouraged", "energetic",
        "engrossed", "enliven", "enthusiastic", "excited", "exhilarated", "expansive", "expectant", "exultant", "fascinated", "free", "friendly",
        "fulfilled", "glad", "gleeful", "glorious", "glowing", "good-humored", "grateful", "gratified", "happy", "hopeful", "inquisitive", "inspired",
        "intense", "interested", "intrigued", "invigorated", "involved", "joyous", "jubilant", "keyed-up", "lively", "loving", "mellow", "merry",
        "mirthful", "moved", "optimistic", "overjoyed", "overwhelmed", "peaceful", "perky", "pleasant", "pleased", "proud", "quiet", "radiant",
        "rapturous", "refreshed", "elated", "relaxed", "relieved", "satisfied", "secure", "sensitive", "serene", "spellbound", "splendid",
        "stimulated", "surprised", "tender", "thankful", "thrilled", "touched", "tranquil", "trusting", "upbeat", "warm", "wide-awake", "wonderful", "zestful"
    ],

    // NEEDS NOT MET (Negative/Difficult)
    sadness: [
        "bereaved", "bitter", "bored", "brokenhearted", "chagrined", "cold", "concerned", "confused", "cranky", "crestfallen", "dejected",
        "depressed", "despairing", "despondent", "detached", "disappointed", "discouraged", "disenchanted", "disgruntled", "disheartened",
        "dismal", "displeased", "disquieted", "distressed", "downcast", "downhearted", "dull", "embarrassed", "embittered", "flat", "frowning",
        "gloom", "gloomy", "grief", "grieved", "heavy", "heavyhearted", "hopeless", "hurt", "impatient", "indifferent", "inert", "joyless",
        "lethargic", "listless", "lonely", "melancholy", "miserable", "moping", "mournful", "numb", "overwhelmed", "pathetic", "pessimistic",
        "poignant", "regretful", "remorseful", "resentful", "restless", "sad", "sorrowful", "sorry", "spiritless", "sullen", "tearful",
        "tired", "troubled", "unhappy", "weary", "wistful", "withdrawn", "woeful", "worried", "wretched"
    ],

    anger: [
        "aggravated", "agitated", "angry", "annoyed", "appalled", "cranky", "cross", "disgruntled", "disgusted", "displeased", "enraged",
        "exasperated", "furious", "frustrated", "hostile", "hot", "huffy", "incensed", "indignant", "irate", "irked", "irritated", "livid",
        "mad", "miffed", "nettled", "outraged", "peeved", "provoked", "resentful", "riled", "sullen", "uptight", "vexed", "vindictive", "worked-up"
    ],

    fear: [
        "afraid", "alarmed", "anxious", "apprehensive", "ashamed", "cautious", "concerned", "confused", "cowardly", "diffident", "disconcerted",
        "disturbed", "dread", "edgy", "embarrassed", "fearful", "frightened", "guilty", "hesitant", "horrified", "insecure", "jittery",
        "nervous", "panic", "panicky", "paralyzed", "petrified", "reluctant", "scared", "shaken", "shy", "skeptical", "startled", "suspicious",
        "tension", "terrified", "threatened", "timid", "uncomfortable", "uneasy", "unnerved", "unsettled", "unsure", "uptight", "wary", "worried"
    ],

    surprise: [
        "amazed", "astonished", "awestruck", "bewildered", "confused", "dazzled", "disconcerted", "dumbfounded", "flabbergasted", "jolted",
        "mystified", "perplexed", "puzzled", "shocked", "startled", "stunned", "surprised", "taken-aback"
    ],

    disgust: [
        "abhorrence", "appalled", "aversion", "detestation", "dislike", "distaste", "hateful", "horrified", "loathing", "nauseated",
        "repulsed", "revolted", "sickened", "vile"
    ]
};

export const getEmotionList = () => {
    return Object.values(NVC_EMOTIONS).flat().sort();
};
