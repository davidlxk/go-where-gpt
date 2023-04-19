import { SearchResultItem } from "../types/types";
import { GoogleSearchResult } from "../types/types";

export async function GetImage(url: string) {

    const result = await fetch(url, {
        method: "GET"
    });

    const resultString: string = await result.text();

    const googleSearchResult: GoogleSearchResult = JSON.parse(resultString);
    const resultItem: SearchResultItem = googleSearchResult.items[0];

    return resultItem.link;
}