/// <reference types="jquery" />

declare var GRAFFITI_EXT_UNSPLASH_CLIENT_ID: string;
declare var FLICKR_API_KEY: string;

module GraffitiExtension {

    export interface ImageDetails {
        url: string;
        aspectRatio: number;
        description?: string;
        primaryColor?: string;
    }

    export interface IImageRetreiver {
        getRandomImage(containerHeight?, containerWidth?) : Promise<ImageDetails>;
    }

    export class UnsplashImageRetreiver implements IImageRetreiver {

        private unsplashSearchQuery = "lgbt";

        public async getRandomImage(containerHeight = 100, containerWidth = 300) : Promise<ImageDetails> {
            var orientation = containerHeight > containerWidth ? "landscape" : "portrait";
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

    export class FlickrImageRetreiver {

        private flickrSearchQuery = "lgbt";
        private searchSetSize = 2000; // TODO: This is brittle

        public async getRandomImage(containerHeight = 100, containerWidth = 300) : Promise<ImageDetails> {
            var page = Math.ceil(Math.random() * this.searchSetSize);
            var response : Flickr.PhotoSearchResponse = await
                jQuery.get({
                    url: `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_API_KEY}&license=7%2C8%2C9%2C10&privacy_filter=1&safe_search=1&per_page=1&page=${page}&format=json&nojsoncallback=1&text=${this.flickrSearchQuery}`,
                });
            var photo = response.photos.photo[0];
            var sizeResponse : Flickr.PhotoSizeResponse = await
                jQuery.get({
                    url: `https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=${FLICKR_API_KEY}&photo_id=${photo.id}&format=json&nojsoncallback=1`
                })
            var sizeIdx = sizeResponse.sizes.size.findIndex(s => s.width > containerWidth && s.height > containerHeight);
            var size = sizeResponse.sizes.size[sizeIdx];
            return {
                url: size.source,
                aspectRatio: size.width / size.height
            };
        }
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

module Flickr {

    export interface PhotoSearchResponse {
        photos: PhotoList;
    }

    export interface PhotoList {
        page: number;
        pages: number;
        total: string;
        photo: Array<Photo>;
    }

    export interface Photo {
        id: string;
        owner: string;
        secret: string;
    }

    export interface PhotoSizeResponse {
        sizes: PhotoSizeList;
    }

    export interface PhotoSizeList {
        size: Array<PhotoSize>;
    }

    export interface PhotoSize {
        label: string;
        width: number;
        height: number;
        source: string;
    }
}