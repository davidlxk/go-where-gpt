import { Message } from "@/core/types/types";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {

    //  first we get the details from the front end
    const body = await request.text();
    const bodyJSON = JSON.parse(body);

    //  we create an array of Messages
    const messages: Message[] = [];

    //  first we pre-set the GPT model as an excellent event planner who can help suggest places to explore
    const newMessage: Message = {
        role: "system",
        content: "You are an excellent event planner who can help suggest places for people to visit or check out. Ask people for 3 pieces of information: 1) The name of the place 2) If they like quiet or lively places 3) The date period when they will be going."
    };
    messages.push(newMessage);

    //  then we get the rest of the conversation from the front end
    const conversation: Message[] = bodyJSON.conversation;
    conversation.forEach((converse: Message) => {
        messages.push(converse);
    });

    //  creating the body to send to chatGPT's API
    const bodyToSend = {
        "model": "gpt-3.5-turbo-0301",
        "temperature": 0.7,
        "messages": messages
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions",{
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "Authorization":"Bearer " + process.env.OPENAI_API_KEY
        },
        body: JSON.stringify(bodyToSend)
    });

    //  getting the json after the promise is fulfilled
    const json = await response.json();
    let returnMsg: string = "";

    if (json.choices != null) {
        
        const responseMessage = json.choices[0].message.content;
        returnMsg = responseMessage;
    }

    return new Response(returnMsg);
}