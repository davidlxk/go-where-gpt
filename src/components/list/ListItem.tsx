import Routes from "@/core/routes/routes";
import { GetImage } from "@/core/services/ImageService";
import template from "just-template";
import { useEffect, useState } from "react";

export interface ListItemProps {

    id: number;
    listImageURL: string;
    listTitle: string;
    listDesc: string;
}

export default function ListItem(props: ListItemProps) {

    const [imageLink, setImageLink] = useState<string>("");

    useEffect(() => {
    
        retrieveImage();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function retrieveImage() {

        const url = template(Routes.GetImage, {
            GOOGLE_CUSTOM_SEARCH_KEY: process.env.GOOGLE_CUSTOM_SEARCH_KEY || "",
            GOOGLE_SEARCH_ENGINE_ID: process.env.GOOGLE_SEARCH_ENGINE_ID || "",
            SEARCH_TERM: props.listTitle
        })
        const linkToImage: string = await GetImage(url);
        setImageLink(linkToImage);
    }

    return (<div className="flex flex-col px-12 mb-12">
        <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageLink} alt={props.listTitle} />
        </div>
        <div>
            <div className="pt-4 font-bold">
                {(props.id + 1 + ")")}{props.listTitle}
            </div>
            <div>
                { props.listDesc }
            </div>
        </div>
    </div>);
}