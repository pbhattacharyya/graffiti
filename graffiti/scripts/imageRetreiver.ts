/// <reference path="typings/jquery/jquery.d.ts" />

declare var GRAFFITI_EXT_UNSPLASH_CLIENT_ID: string;

module GraffitiExtension {

    export class ImageRetreiver {

        private unsplashSearchQuery = "queer+or+lgbt";

        public getRandomImage(containerHeight = 100, containerWidth = 300) : Promise<ImageDetails> {
            return this.getUnsplashHotlinkDetails(containerHeight, containerWidth);
        }

        private async getUnsplashHotlinkDetails(height: number, width: number) : Promise<ImageDetails> {
            var orientation = width > height ? "landscape" : "portrait";
            var response : Unsplash.RandomPhotoResponse = await
                jQuery.get({
                    url: `https://api.unsplash.com/photos/random?query=${this.unsplashSearchQuery}&orientation=${orientation}`,
                    headers: {
                        "Authorization": `Client-ID ${GRAFFITI_EXT_UNSPLASH_CLIENT_ID}`
                    }
                });
            return {
                url: response.urls.custom || response.urls.regular,
                aspectRatio: response.width / response.height,
                description: response.description,
                primaryColor: response.color
            };
        }
    }

    export interface ImageDetails {
        url: string;
        aspectRatio: number;
        description?: string;
        primaryColor?: string;
    }
}

module Unsplash {

    export interface RandomPhotoResponse {
        width: number;
        height: number;
        description: string;
        color: string;
        urls: {
            raw: string,
            full: string,
            regular: string,
            small: string,
            thumb: string
            custom?: string;
        }
    }
}