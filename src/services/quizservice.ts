export class QuizService {

  readonly doiknowURL = "https://doiknow.app/api/";

  //readonly doiknowURL = "https://localhost:44430/api/";

  constructor() { 

        }


   public test():string
   {
        return "from service";
   }


   public testBackend():Promise<any>
   {
        return Promise.resolve();
        // let queryParams = new HttpParams();
        // queryParams = queryParams.append("topic","some value");
        //
        // return this.http.get<any>(this.baseUrl + 'api/test');
   }


   async startTopicBasedOnInput(input:string):Promise<startTopicResponse>
   {
        let response = await fetch(`${this.doiknowURL}startTopicBasedOnInput`,
                {
                   method: "POST",
                 headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(input)
                }

        );
        return response.json();
   }

   async startTopic(topic:string):Promise<startTopicResponse>
   {
        let response = await fetch(`${this.doiknowURL}startTopic?topic=${topic}`);
        return response.json();
   }

   public async getQuestion(questionId:string):Promise<getQuestionResponse>
   {
        let response = await fetch(`${this.doiknowURL}getQuestion?questionId=${questionId}`);

        return response.json();
   }

}


export interface getQuestionResponse
{
        id:string;
        promt:string;
        answer:string;
        choices:string[];
        nextQuestionId:string;
        noQuestions:boolean;
        error:string;
}


export interface startTopicResponse
{
        nextQuestionId:string;
        error:string;
}


