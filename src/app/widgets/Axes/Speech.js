import log from 'app/lib/log';

export default class Speech {
    constructor() {
        this.phrases = new Map();
        this.isSpeaking = false;
        this.isEnabled = ('speechSynthesis' in window);

        if (!this.isEnabled) {
            log.warn('Speech not supported.');
        }
    }

    onUtteranceStart = (...args) => {
        this.isSpeaking = true;
    };

    onUtteranceEnd = (...args) => {
        this.isSpeaking = false;
    };

    addPhrase = (key, phrase = null) => {
        if (phrase === '') {
            return;
        }

        if (phrase === null) {
            phrase = key;
        }

        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.lang = 'en-US';
        utterance.volume = 1;
        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onstart = this.onUtteranceStart;
        utterance.onend = this.onUtteranceEnd;

        this.phrases.set(key, utterance);
    }

    say = (phraseKey) => {
        if (!this.phrases.has(phraseKey)) {
            log.warn(`No phrase with key '${phraseKey}' found. Creating new phrase entry.`);
            this.addPhrase(phraseKey);
        }

        if (this.isSpeaking) {
            window.speechSynthesis.cancel();
        }
        window.speechSynthesis.speak(this.phrases.get(phraseKey));
    };
}
