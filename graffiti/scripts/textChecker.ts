/// <reference types="jquery" />
/// <reference path="matchList.ts" />

declare var PARALLELDOTS_API_KEY;

module GraffitiExtension {

    export interface ITextChecker {
        isAbusivePassage(textPassage: string) : Promise<boolean>;
    }

    // export class ParallelDotsTextChecker implements ITextChecker {

    //     public async isAbusivePassage(textPassage: string) : Promise<boolean> {
    //         var response : ParallelDots.AbuseQueryResponse = await jQuery.post({
    //             url: "https://apis.paralleldots.com/v2/abuse",
    //             data: {
    //                 "api_key": PARALLELDOTS_API_KEY,
    //                 "text": textPassage
    //             }
    //         });

    //         return response.sentence_type == "Abusive";
    //     }
    // }

    export class MatchListTextChecker implements ITextChecker {
        public async isAbusivePassage(textPassage: string) : Promise<boolean> {
            await Promise.resolve;

            if(textPassage.split(" ").length < 5) {
                // Only attempt match when at leat 5 words
                return false;
            }
            
            // get all lower case words without symbols and remove empty items
            textPassage = textPassage.toLowerCase().replace(/[^\w\s]/g, " ");
            var words = textPassage.split(" ").filter(w => w);

            for(var i = 0; i < words.length; i++) {

                if(matchPhrases.some(phrase => {
                    var phraseWords = phrase.split(" ");
                    if(phraseWords.length + i > words.length) {
                        // phrase is longer than remaining words in original text
                        return false;
                    }

                    // do all phrase words match this text word (+ peek next words)
                    if(phraseWords.every((pWord, pidx) => words[i + pidx] == pWord)) {
                        console.log(`matched: ${phrase} ${textPassage} `)
                        return true;
                    }
                })) {
                    return true;
                }
            }

            return false;
        }
    }
}

module ParallelDots {

    export interface AbuseQueryResponse {
        usage: string;
        sentence_type: "Abusive" | "Non Abusive";
        confidence_score: number;
    }
}