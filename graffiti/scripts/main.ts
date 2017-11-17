/// <reference path="textReplacer.ts" />

module GraffitiExtension {

  class Loader {
    private loadingInterval: number;

    public start() {
      this.loadingInterval = setInterval(() => this.checkIfLoaded(), 10);
    }

    private checkIfLoaded() {
      if (/loaded|complete/.test(document.readyState)) {
        clearInterval(this.loadingInterval);
        new TextReplacer().ReplaceInNode(document.body);
      }
    }
  }

  new Loader().start();

}
