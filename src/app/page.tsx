'use client';
import Button from "@/components/buttons/Button";
import { SendQuery } from "@/core/services/GPTService";
import useSharedStore from "@/core/store/SharedStore";
import { Message, SuggestionItem } from "@/core/types/types";
import { useCallback, useEffect, useState } from "react";
import "regenerator-runtime/runtime";
import { MdSettingsVoice,MdOutlineSettingsVoice } from "react-icons/md";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Lottie from "lottie-react";
import loadingAnimation from "../animations/loading.json";
import List from "@/components/list/List";
import { useSpeechSynthesis } from 'react-speech-kit';

function isNumber(numStr: string) {

 return !isNaN(Number(numStr));
}

export default function Home() {

  const [ifStarted, setIfStarted] = useState<boolean>(false);
  const [ifThinking, setIfThinking] = useState<boolean>(false);

  const { speak, voices } = useSpeechSynthesis();

  const {
    transcript,
    listening,
    resetTranscript
  } = useSpeechRecognition();

  const conversation: Message[] = useSharedStore((state) => state.conversation);
  const response: string = useSharedStore((state) => state.response);
  const suggestions: SuggestionItem[] = useSharedStore((state) => state.suggestions);

  async function startConversation () {
  
    if (!ifStarted) {
      sendConversationToGPT(conversation,true);
      setIfStarted(true);
    }
  }

  function formatPassage(passage: string) {

    const processed = passage.replaceAll("\n","\n<br/>");
    return processed;
  }

  function processResponse(gptResponse: string): SuggestionItem[] {
  
    // to get the list of suggestions returned (they are all separated by an \n)
    const suggestions: string[] = gptResponse.split("\n");
    const processed: SuggestionItem[] = [];

    suggestions.forEach((eachSuggestion: string, index: number) => {

      //  we do not want the 1st index
      //  because it is not a suggestion
      if (index !== 0) {

        //  here we are getting the 1st character of this string
        const firstChar: string = eachSuggestion[0];
        
        //  we then check if the first character is a number
        if (isNumber(firstChar)) {

          //  if it is a suggestion, we get the place's name with the number in front of it
          let splitToken: string = " - ";
          if (eachSuggestion.indexOf(":") !== -1) { splitToken = ":"; }
          const splitSuggestion: string[] = eachSuggestion.split(splitToken);
          const placeNameWithNumber: string = splitSuggestion[0];
          
          // we can get the place name from above.
          // but it could be followed by a . or a )
          let token: string = ".";
          if (placeNameWithNumber.indexOf(")") !== -1) { token = ")"; }

          const splitPlaceName: string[] = placeNameWithNumber.split(token);
          const placeName: string = splitPlaceName[1];

          const placeDesc: string = splitSuggestion[1];

          const newSuggestion: SuggestionItem = {
            id: crypto.randomUUID(),
            placeName: placeName,
            description: placeDesc
          };

          processed.push(newSuggestion);
        }
      }
    });

    return processed;
  }

  const sendConversationToGPT = useCallback(async (updatedConversations: Message[], ifStart: boolean) => {
  
    const gptResponse: string = await SendQuery(updatedConversations);
    let displayText: string = gptResponse;

    displayText = formatPassage(gptResponse);

    useSharedStore.setState({ response: displayText });
    
    // using text-to-speech to have the app speak out the response from GPT
    speak({ text: gptResponse, voice: voices[0] });

    setIfThinking(false);

    if (!ifStart) {

      const suggestions = processResponse(gptResponse);
      useSharedStore.setState({ suggestions: suggestions });
    }

  },[speak, voices]);

  function startListening() {
  
    SpeechRecognition.startListening({ continuous: false });
  }

  function stopListening() {
  
   SpeechRecognition.stopListening();
  }

  const continueConversation = useCallback((text: string) => {
  
    setIfThinking(true);

    useSharedStore.setState({ response: ""});

    //  create new GPT message based on the current transcript
    const newMessage: Message = {
      role: "user",
      content: text
    };

    resetTranscript();

    //  updating the conversation in the store
    const messages = conversation;
    messages.push(newMessage);
    useSharedStore.setState({ conversation: messages});

    //  and send the updated conversation to the GPT API service
    sendConversationToGPT(messages, false);
  },[conversation, resetTranscript, sendConversationToGPT]);

  useEffect(() => {
    
    const timeOut = setTimeout(() => {
      if (transcript.length > 0) {
        continueConversation(transcript);
      }
    }, 2500);

    return (()=>{
      clearTimeout(timeOut);
    })
  
  }, [continueConversation, transcript]);

  return (
    <div className={"w-full"}>
      <div className={"w-3/4 max-w-screen-md pt-4 m-auto"}>
        {
          !ifThinking && 
          <div className={"pt-12 font-extrabold text-8xl pb-8"}>
            <h2>WHERE TO EXPLORE</h2>
          </div>
        }
        
      </div>
      
      {
        !ifStarted ? <>
          <div className={"text-lg px-10"}>
            <div>
              Use your voice to converse in this GPT-powered app to get suggestions on places to go in the country you wish to visit.
              Simply tap on the button below to start the conversation.
            </div>
          </div>
            <div className="px-10 pt-12">
            <Button title="Let's go!" callback={startConversation} />
          </div>
        </>
      :
        <>
          {
            ifThinking &&
            <div className="w-full pt-20">
              <Lottie animationData={loadingAnimation} loop={true}/>
            </div>
          }
          {
            (!ifThinking && suggestions.length > 0) ?
            <>
              <List listItems={suggestions} />
            </> 
            :
            <div className="px-14" dangerouslySetInnerHTML={{ __html: response}} />
          }
          {
            (!ifThinking && suggestions.length == 0) &&
            <button 
              onMouseDown={startListening}
              onMouseUp={stopListening}
              className="absolute flex flex-row w-full pt-12 m-auto cursor-pointer px-14 bottom-30"
            >
                <div className="border border-white rounded-full w-28 h-28"
                >
                {
                  listening
                  ? <MdSettingsVoice className="w-16 h-16 pl-1 mt-5 ml-5 text-orange-600" />
                  : <MdOutlineSettingsVoice className="w-16 h-16 pl-1 mt-5 ml-5"/>
                }
              </div>
              <div className={"px-5 pt-8 text-md max-w-24"}>
                { transcript }
              </div>
            </button>
          }
        </>
      }
    </div>
  )
}