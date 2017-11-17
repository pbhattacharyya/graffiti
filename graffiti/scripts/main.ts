/// <reference types="jquery" />
/// <reference types="chrome" />
/// <reference path="textReplacer.ts" />

module GraffitiExtension {

    class Bootstrapper {
        private readyDeferred: JQueryDeferred<any>;

        public async start() {
            await this.waitForDocumentReady();

            var replacer = new TextReplacer(document.body);
            replacer.startReplacement();

            chrome.runtime.onMessage.addListener((msg, sender, respond) => {
                switch (msg.type) {
                    case "BROWSER_ACTION_ONCLICKED":
                        var active = replacer.toggleActiveStatus();
                        respond({"isActive": active});
                }
            })
        }

        private async waitForDocumentReady() : Promise<any> {
            var deferred = jQuery.Deferred();
            var loadingInterval = setInterval(() => {
                if (/loaded|complete/.test(document.readyState)) {
                    clearInterval(loadingInterval);
                    deferred.resolve();
                }
                }, 10);
            return deferred.promise;
        }
    }

    new Bootstrapper().start();

}
