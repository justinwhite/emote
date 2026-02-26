export const FEELINGS_WHEEL: Record<string, Record<string, string[]>> = {
    fear: {
        scared: ["frightened", "helpless"],
        terror: ["panic", "hysterical"],
        insecure: ["inferior", "inadequate"],
        nervous: ["worried", "anxious"],
        horror: ["mortified", "dread"]
    },
    anger: {
        rage: ["hate", "hostile"],
        exasperated: ["agitated", "frustrated"],
        irritable: ["annoyed", "aggravated"],
        envy: ["resentful", "jealous"],
        disgust: ["contempt", "revolted"],
        suffering: ["agony", "hurt"]
    },
    sadness: {
        depressed: ["sorrow", "dismayed"],
        disappointed: ["displeased", "regretful"],
        shameful: ["guilty", "isolated"],
        neglected: ["lonely", "grief"],
        despair: ["powerless", "vulnerable"]
    },
    surprise: {
        stunned: ["shocked", "dismayed"],
        confused: ["disillusioned", "perplexed"],
        amazed: ["astonished", "awe-struck"],
        overcome: ["speechless", "astounded"],
        moved: ["stimulated", "touched"]
    },
    joy: {
        content: ["pleased", "satisfied"],
        happy: ["amused", "delighted"],
        cheerful: ["jovial", "blissful"],
        proud: ["triumphant", "illustrious"],
        optimistic: ["eager", "hopeful"],
        enthusiastic: ["excited", "zeal"],
        elation: ["euphoric", "jubilation"]
    },
    love: {
        enthralled: ["enchanted", "rapture"],
        affectionate: ["romantic", "fondness"],
        longing: ["sentimental", "attracted"],
        desire: ["passion", "infatuation"],
        tenderness: ["caring", "compassionate"],
        peaceful: ["relieved", "satisfied"]
    }
};

export const getEmotionList = (): string[] => {
    const emotions = new Set<string>();
    for (const [top, midObj] of Object.entries(FEELINGS_WHEEL)) {
        emotions.add(top);
        for (const [mid, leaves] of Object.entries(midObj)) {
            emotions.add(mid);
            leaves.forEach(leaf => emotions.add(leaf));
        }
    }
    return Array.from(emotions).sort();
};

type TopLevelCategory = 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'love' | 'neutral';

export const getTopLevelCategory = (emotionName: string): TopLevelCategory => {
    for (const [top, midObj] of Object.entries(FEELINGS_WHEEL)) {
        if (top === emotionName) return top as TopLevelCategory;
        for (const [mid, leaves] of Object.entries(midObj)) {
            if (mid === emotionName || leaves.includes(emotionName)) return top as TopLevelCategory;
        }
    }
    return 'neutral';
};
