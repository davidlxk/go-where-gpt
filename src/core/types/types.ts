export interface Message {

    role: string;
    content: string;
}

export interface SuggestionItem {

    id: string;
    placeName: string;
    description: string;
    searchResultItem?: SearchResultItem;
}

export interface GoogleSearchResult {

    kind: string;
    items: SearchResultItem[];
}

export interface SearchResultItem {

    kind: string;
    title: string;
    htmlTitle: string;
    link: string;
    displayLink: string;
    snippet: string;
    htmlSnippet: string;
    mime: string;
    fileFormat: string;
    image: SearchResultItemImage;
}

export interface SearchResultItemImage {
    contextLink: string;
    height: number;
    width: number;
    byteSize: number;
    thumbnailLink: string;
    thumbnailHeight: number;
    thumbnailWidth: number;
}