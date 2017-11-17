/// <reference types="jquery" />
/// <reference path="textReplacer.ts" />

module GraffitiExtension {

  class Loader {
    private readyDeferred: JQueryDeferred<any>;

    public async start() {
      await this.waitForDocumentReady();
      new TextReplacer().ReplaceInNode(document.body);
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

  new Loader().start();

}
