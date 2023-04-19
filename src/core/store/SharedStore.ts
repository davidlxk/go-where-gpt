import { create } from 'Zustand';
import { Message, SuggestionItem } from '../types/types';

interface SharedState {

    suggestions: SuggestionItem[],
    response: string,
    conversation: Message[]
}

const useSharedStore = create<SharedState>((set)=>({

    suggestions: [],
    response: "",
    conversation: []
}));

export default useSharedStore;