/// <reference types="jquery" />
/// <reference types="chrome" />
/// <reference path="matchList.ts" />
/// <reference path="imageRetreiver.ts" />
/// <reference path="overlayContent.ts" />

module GraffitiExtension {

    export class TextReplacer{
    
        public ReplaceInNode (node: Node) {
            const tagsToMatch = "p,h1,h2,h3,h4,h5,h6";

            jQuery(node)
                .find(`${tagsToMatch}:not(${tagsToMatch} ${tagsToMatch})`)
                .each((idx, child) => this.handleText(jQuery(child)));
        }
        
        private handleText ($node: JQuery) {
            if(this.isMatch($node.text())) {
                this.performReplace($node);
            }
        }
        
        private isMatch (text: string) {
            if(text.split(" ").length < 5) {
                // Only attempt match when at leat 5 words
                return false;
            }
            
            // get all lower case words without symbols and remove empty items
            text = text.toLowerCase().replace(/[^\w\s]/g, " ");
            var words = text.split(" ").filter(w => w);

            for(var i = 0; i < words.length; i++) {

                if(matchPhrases.some(phrase => {
                    var phraseWords = phrase.split(" ");
                    if(phraseWords.length + i > words.length) {
                        // phrase is longer than remaining words in original text
                        return false;
                    }

                    // do all phrase words match this text word (+ peek next words)
                    return phraseWords.every((pWord, pidx) => words[i + pidx] == pWord);
                })) {
                    return true;
                }
            }

            return false;
        }

        private async performReplace($node: JQuery) {
            var origHeight = $node.height();
            var origWidth = $node.width();

            var $newNode = jQuery("<div />")
                .css({
                    minHeight: origHeight,
                    width: origWidth,
                    backgroundColor: "transparent",
                    display: $node.css("display"),
                    borderRadius: "8px"
                });
            
            $node.replaceWith($newNode);

            var imageDetails = await new ImageRetreiver().getRandomImage();
            
            $newNode.css({
                background: `${imageDetails.primaryColor} url("${imageDetails.url}")`,
                backgroundSize: "cover",
                minHeight: origWidth / imageDetails.aspectRatio
            });

            $newNode.append(this.getOverlayContent);
        }

        private getOverlayContent() : JQuery {
            return jQuery(overlayContent);
        }
    }
}