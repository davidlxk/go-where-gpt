import { SuggestionItem } from "@/core/types/types";
import ListItem from "./ListItem";

export interface ListProps {

    listItems: SuggestionItem[];
}

export default function List(props: ListProps) {

    return (<div>
        {
            props.listItems.map((each: SuggestionItem, index:number) => {
                return <ListItem
                    id={index}
                    listTitle={each.placeName}
                    listDesc={each.description}
                    key={each.id}
                    listImageURL=""
                />
            })
        }
    </div>);
}