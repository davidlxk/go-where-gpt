import Routes from "../routes/routes";
import { Message } from "../types/types";

export async function SendQuery(conversation: Message[]) {
    
    const result = await fetch(Routes.GetGPTResponse,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            conversation
        })
    });

    const response: string = await result.text();
    return response;
}