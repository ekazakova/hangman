export interface Word {
    id: number;
    word: string
    playedLetters: string;
    status: number;
    win: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface WordData {
    word: Word;
    markedWord: LetterMarked[];
    markedPlayedLetters: LetterMarked[];
    markedKeybaordLetters: LetterMarked[][];
}

export interface LetterMarked {
    letter: string;
    included: boolean;
}
