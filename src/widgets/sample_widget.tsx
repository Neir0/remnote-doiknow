import { usePlugin, renderWidget, useTracker, Rem } from '@remnote/plugin-sdk';
import {setegid} from 'process';
import { useState } from "react";
import { QuizService, getQuestionResponse, startTopicResponse } from './../services/quizservice';
import '../App.css'


export const SampleWidget = () => {
  const plugin = usePlugin();

  const doiknowURL = "https://doiknow.app/";
  //const doiknowURL = "https://localhost:44430/";

  let quizService = new QuizService();

  const [error, setError ] = useState('');

  // https://stackoverflow.com/questions/26253351/correct-modification-of-state-arrays-in-react-js
  const [answers, setAnswers ] = useState({});

  const [score, setScore ] = useState({correct:0, incorrect:0});


  let currentRem: Rem | undefined;
  const [currentFocusedRemContent, setCurrentFocusedRemContent] = useState("");

  const [currentQuestion, setCurrentQuestion ] = useState(undefined);
  const [isLoading, setIsLoading ] = useState(false);


  let updateRemNameFunc = async () =>
                {
                  let rem =  await plugin.focus.getFocusedRem() as any;

                  if(rem?._id!=currentRem?._id )
                  {
                          currentRem = rem;


                          if(currentRem)
                          {
                                  setCurrentFocusedRemContent((await getRemContent(currentRem)) as any);
                          }
                          else
                          {
                                  setCurrentFocusedRemContent("");
                          }
                  }

                  setTimeout(updateRemNameFunc, 100);
          };


          updateRemNameFunc();




  let startOver = async () => { 
        setCurrentQuestion(undefined);
        setScore({correct:0, incorrect:0});
        
  }

  let clickMeFunc = async () => { 
          let rem = currentRem;  
          let content = await getRemContentRec(rem, 0);

          await plugin.app.toast(`focused rem content: ${content}`); 
  }

  let genQA = async () => { 
          let rem = currentRem;
          let response = await fetch("http://localhost:5069");

          await quizService.startTopic("Chess");

          await plugin.app.toast(`${response.body}`); 

  }

  let nextQuestion = async (questId:string) => { 
        setIsLoading(true);

        let question = ( await quizService.getQuestion(questId) ) as any;

        if(question.error)
        {
               setError(question.error); 
               setTimeout(()=>{
                       setError(""); 
               }, 5000);
        }
        else
        {
                if(question.choices)
                {
                        setCurrentQuestion(question);
                        setAnswers({});
                }
                else
                {
                        setCurrentQuestion(undefined);
                        setAnswers({});
                }
        }

        setIsLoading(false);
  }



  let startTopicDoIKnow = async () => { 
        let rem = currentRem;  

        let remContent = await getRemContentRec(rem, 0);

        //ToDo fix it 
        if(remContent == " undefined")
        {
                await plugin.app.toast("Please select the rem again"); 
                return;
        }

        if(!rem || (remContent.match(/^\s*$/) !== null) ) 
        {
                await plugin.app.toast("You have to select a non empty rem firstly. (click on the rem you want to use for generaing quiz)"); 
                return;
        }

        setIsLoading(true);
        // let topic = await quizService.startTopic(remContent as string);
        let topic = await quizService.startTopicBasedOnInput(remContent as string);

        if(topic.error)
        {
               setError(topic.error); 
               setTimeout(()=>{
                       setError(""); 
               }, 5000);
        }
        else
        {

                await nextQuestion(topic.nextQuestionId);
                // window.open(doiknowURL+topic.nextQuestionId, '_blank');
        }

        setIsLoading(false);
  }


  let startTopic = async () => { 
        let rem = currentRem;  // await plugin.focus.getFocusedRem();

        // let remContent = await getRemContent(rem);
        let remContent = await getRemContent(rem);

        //ToDo fix it 
        if(remContent == " undefined")
        {
                await plugin.app.toast("Please select the rem again"); 
                return;
        }

        if(!rem || ((remContent as any).match(/^\s*$/) !== null) ) 
        {
                await plugin.app.toast("You have to select a non empty rem firstly. (click on the rem you want to use for generaing quiz)"); 
                return;
        }

        setIsLoading(true);
        // let topic = await quizService.startTopic(remContent as string);

        let topic = await quizService.startTopic(remContent as string);

        if(topic.error)
        {
               setError(topic.error); 
               setTimeout(()=>{
                       setError(""); 
               }, 5000);
        }
        else
        {
                await nextQuestion(topic.nextQuestionId);
        }

        setIsLoading(false);
  }


  let goToDoIKnow = async () => {
        window.open(doiknowURL+'quiz/'+(currentQuestion as any).id, '_blank');
  }

  let test = async () => {
        let rem =await plugin.focus.getFocusedRem();
        let remContent = await getRemContentRec(rem, 0);
        alert(remContent);
  }


  let choiceSelected = async (selectedChoice:any, index:number) => { 

          if(( currentQuestion as any).answer!=index)
          {
                  setScore({...score, incorrect:(score.incorrect+1)}); 

                  let newAnswersState = {...answers };

                  (newAnswersState as any)[index] = "incorrect";

                  setAnswers(newAnswersState);

                  // await plugin.app.toast(`${selectedChoice} is incorrect! Try again.`); 
          }
          else
          {
                  setScore({...score, correct:(score.correct+1)}); 

                  let newAnswersState = {...answers };

                  (newAnswersState as any)[index] = "correct";

                  setAnswers(newAnswersState);

                  await nextQuestion(( currentQuestion as any as getQuestionResponse)?.nextQuestionId);
          }
  }
  

  let qa = (quest:any) =>
  {
                return (
                        <div>
                                <h2>{quest.promt}</h2>

                                {quest.choices.map( (choice:any, index:number) =>
                                                {
                                                        return (
                                                        <label>

                                                                <button className={`btn btn-primary ${(answers as any)[index]}`} key={choice} onClick={() => {choiceSelected(choice, index)}}>
                                                                        {choice}
                                                                </button>

                                                        </label>);
                                                })
                                }
                        </div>
                );
  }

  let topBlock = (
                        <div className="top-block">

                                <div>
                                        <button onClick={goToDoIKnow}>Go to doiknow.app</button>&nbsp;|&nbsp;
                                        <button onClick={()=>{startOver()}}>Start over</button>

                                </div>

                                <div className="score">
                                        <span className="correct">{score.correct}</span>/<span className="incorrect">{score.incorrect}</span>
                                </div>
                        </div>
                )

  let startScreen = (
       <div>
               { 

               (currentFocusedRemContent=="")?(
                               <div>
                                       <label>
                                               Please select a rem you want to be tested by clicking(focusing) on it
                                       </label>
                               </div>

                               ):


                                (<div>
                                        <button onClick={startTopicDoIKnow}>Test me on  "{ currentFocusedRemContent }" and all sub rems </button>

                                        <button onClick={startTopic}>Test me on "{ currentFocusedRemContent }" only</button>

                                </div>)

                }

                <hr />

                <a href="https://doiknow.app/contact" target="_blank">Leave a feedback</a>

       </div>
  );




  return (
        <div className="quiz-container">

          {(  (error)?( <span>error</span> ):"" ) }

          {(  (isLoading)?( <span>Loading...please wait</span> ):"" ) }

          { (!currentQuestion)?(startScreen):(topBlock) }

          {currentQuestion?qa(currentQuestion):""} 
        </div>
  );

};

renderWidget(SampleWidget);


// Helpers 

async function getRemContent(rem:Rem | undefined)
{
        return getRemText(rem);
}

async function getRemContentRec(rem:Rem | undefined, depth:number | undefined)
{
        console.time(`getRemContentRec ${rem.text}`);
        depth = depth || 0;
        let combinedText = (new Array(depth + 1).join(' ')) + ' ' + await getRemText(rem);

        let childRems = await rem?.getChildrenRem();

        if(childRems && childRems.length)
        {
                combinedText+='\r\n';
                for(let child of childRems)
                {
                        combinedText+=(await getRemContentRec(child, depth+3) ?? '')+'\r\n';
                }
        }

        console.timeEnd(`getRemContentRec ${rem.text}`);

        return combinedText;
}

async function getRemText(rem:Rem)
{
      if(!rem || !rem?.text) return '';
      if(typeof rem.text[0] == 'string')
      {
              return rem?.text.toString()+((rem?.backText)?(`: ${rem.backText.toString()}`) : '');
      }
      else
      {
              if(rem.text.length) return rem.text[0].text;
              return '';
      }
}





