import { useState } from "react";
import Card from "./Card.jsx";
import Tittle from "./Tittle.jsx";
import '../index.css'
import { QueryClient,QueryClientProvider} from "@tanstack/react-query";
import sound from '../kahoot.mp3'

export default function App(){
    const queryClient=new QueryClient();
    const [ready,setReady]=useState(false)
    const handleClick=()=>{
        let audio=new Audio(sound)
        audio.volume=0.5
        audio.loop=true
        audio.play()
        setReady(true)
    }
    return(<>
    <QueryClientProvider client={queryClient}>
            <Tittle/>
            {ready&&<Card/>}
            {!ready && 
            <div className="card">
                <div>
                    <h1>Welcome to Quizzixx, an app that gives you a bunch of question about programming. You'll be able to hit a perfect score?</h1>
                    <button style={{color:"white",width:"800px"}}onClick={handleClick}>Start</button>
                </div>
            </div>}   
    </QueryClientProvider>
    </>)
}