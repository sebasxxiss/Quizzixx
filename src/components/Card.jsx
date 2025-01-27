import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"

async function fetchData(){
    const rawFetch = await fetch("https://quizapi.io/api/v1/questions?apiKey=")
    const data= await rawFetch.json()
    return data
}

export default function Card(){
    const [timer,setTimer]=useState(30)
    const [index,setIndex]=useState(0)
    const [isShowing,setIsShowing]=useState("dull")
    const [showNext,setShowNext]=useState(false)
    const [end,setEnd]=useState(false)
    const [score,setScore]=useState(0)
    const [isDisabled,setIsdisabled]=useState(false)
    const {data,isLoading,isSuccess}=useQuery({queryFn:fetchData,queryKey:["quizData"],refetchOnWindowFocus:false})

    useEffect(()=>{
        const interval = setInterval(()=>{
            if(timer==0 || isDisabled){
                    setShowNext(true)
                    setIsdisabled(true)
                    setIsShowing("")
                return
            }
            setTimer(prev=>prev-1)
        },1000)

        return ()=> clearInterval(interval)
    },[timer])
    let winnersArray=[]
    const handleClick=(e)=>{
        let answer =e.target.dataset.ans+"_correct"
        if(index+1!=20){
            if(!isDisabled){
                if(data[index].correct_answers[answer]==="true"){
                    setScore(prevScore=>prevScore+1)
                    setShowNext(true)
                    setIsShowing("")
                    setIsdisabled(true)
                }else{
                    setShowNext(true)
                    setIsdisabled(true)
                    setIsShowing("")
                }
            }   
        }
        else{
            setEnd(true)
        }
    }
    const handleNext=()=>{
        setTimer(30)
        setIsdisabled(false)
        setIndex(prev=>prev+1)
        setIsShowing("dull")
        setShowNext(false)
    }

    if(isLoading) return <div className="card"><h1>Loading...</h1></div>
    if(isSuccess) {
        winnersArray=data[index].correct_answers
        return(<>
        <div style={{display:"flex",justifyContent:"space-between",width:"80em",alignItems:"end"}}>
            <span style={{fontSize:"large"}}><h1>{index+1+("/20")}</h1></span>
            {showNext && <button className="option" style={{marginBottom:"10px"}} onClick={handleNext}><h1 style={{color:"white"}}>Next</h1></button>}
            <span style={{fontSize:"large"}}><h1>{timer}</h1></span>
        </div>    
        <div className="card">
            {!end && <h1>{data[index].question}</h1>}
            {end &&<h1>{score+"/20"}</h1>}
        </div>
        {!end && <div id="answers">
        {Object.entries(data[index].answers).map((item,i)=>{
            if(item[1]!=null){
                if(Object.entries(winnersArray)[i][1]=="true"){
                    return(<React.Fragment key={i+"q"+data[index].id}>
                        <button onClick={handleClick} className={"option correct "+isShowing} data-ans={item[0]}>{item[1]}</button>
                    </React.Fragment>)
                }else{
                    return(<React.Fragment key={i+"q"+data[index].id}>
                        <button onClick={handleClick} className={"option inCorrect "+isShowing}  data-ans={item[0]}>{item[1]}</button>
                    </React.Fragment>)
                }
            }
            })
        }
        </div>}
    </>)
    }
}
