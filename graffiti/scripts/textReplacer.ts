/// <reference types="jquery" />
/// <reference types="chrome" />
/// <reference path="imageRetreiver.ts" />
/// <reference path="textChecker.ts" />
/// <reference path="overlayContent.ts" />

module GraffitiExtension {

    export class TextReplacer {

        constructor(private rootNode: Node) { }

        private isActive = true;
        private nodeMap : Array<{old: JQuery, new: JQuery}>;

        // private textChecker: ITextChecker = new ParallelDotsTextChecker();
        private textChecker: ITextChecker = new MatchListTextChecker();

        // private imageRetreiver: IImageRetreiver = new UnsplashImageRetreiver();
        private imageRetreiver: IImageRetreiver = new FlickrImageRetreiver();
        
        public async startReplacement() {
            const tagsToMatch = "p,h1,h2,h3,h4,h5,h6";

            var promises : Array<Promise<{old: JQuery, new: JQuery}>> = [];

            jQuery(this.rootNode)
                .find(`${tagsToMatch}:not(${tagsToMatch} ${tagsToMatch})`)
                .each((idx, child) => {
                    var $child = jQuery(child);
                    promises.push(this.handleText($child).then($new => {
                        return {old: $child, new: $new}
                    }));
                });

            var nodeMap = await Promise.all(promises);

            // remove items that did not get replaced
            this.nodeMap = nodeMap.filter(pair => pair.new);
        }

        public toggleActiveStatus() : boolean {
            // only continue if nodes are loaded
            if(this.nodeMap) {
                this.isActive = !this.isActive;
                this.nodeMap.forEach(nodePair => {
                    if(this.isActive) {
                        nodePair.old.replaceWith(nodePair.new);
                    } else {
                        nodePair.new.replaceWith(nodePair.old);
                    }
                });
            }
            return this.isActive;
        }
        
        private async handleText ($node: JQuery) : Promise<JQuery> {
            if(await this.isMatch($node.text())) {
                return await this.performReplacement($node)
            }
            return null;
        }
        
        private async isMatch (text: string) : Promise<boolean> {
            if(text.split(" ").length < 5) {
                // Only attempt match when at leat 5 words
                return false;
            }

            return await this.textChecker.isAbusivePassage(text);
        }

        private async performReplacement($node: JQuery): Promise<JQuery> {
            var origHeight = $node.height();
            var origWidth = $node.width();

            var $newNode = jQuery("<div />")
                .css({
                    minHeight: origHeight,
                    width: origWidth,
                    padding: 0,
                    margin: 0,
                    border: 0,
                    backgroundColor: "transparent",
                    display: $node.css("display"),
                    borderRadius: "8px"
                });
            
            $node.replaceWith($newNode);

            var imageDetails = await this.imageRetreiver.getRandomImage();
            
            $newNode.css({
                background: `url("${imageDetails.url}")`,
                backgroundSize: "cover",
                minHeight: origWidth / imageDetails.aspectRatio
            });

            $newNode.append(this.getOverlayContent);

            return $newNode;
        }

        private getOverlayContent() : JQuery {
            return jQuery(overlayContent);
        }
    }
}