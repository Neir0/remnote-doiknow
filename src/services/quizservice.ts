class QuizService {

  readonly doiknowURL = "https://doiknow.app/api/";

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

            // let queryParams = new HttpParams();
            // queryParams = queryParams.append("topic",topic);
        
            return ({
                             nextQuestionId: '123'
                        } as startTopicResponse);



            // return this.http.get<getQuestionResponse>(this.baseUrl + 'api/startTopic', { params:queryParams });

   }

   public async getQuestion(questionId:string):Promise<getQuestionResponse>
   {
            // let queryParams = new HttpParams();
            // //queryParams = queryParams.append("topic",topic);
            // queryParams = queryParams.append("questionId",questionId);

        let response = await fetch(`${this.doiknowURL}getQuestion?questionId=${questionId}`);

        return response.json();

        
            if(questionId == '123')
            {
                    return {
                                id:'123',
                                promt:"What is the capital of Russia",
                                answer:'3',
                                choices:['Omsk', 'Tomsk', 'Leningrad', 'Moscow'],
                                nextQuestionId:'321'
                        } as getQuestionResponse;
            }

            // if(questionId == '321')
            {
                    return {
                                id:'321',
                                promt:"What is the capital of Cuba",
                                answer:'2',
                                choices:['Camavey', 'Pinar del rio', 'Havana', 'Santiago'],
                                nextQuestionId:'123'
                        } as getQuestionResponse;

            }


            // return this.http.get<getQuestionResponse>(this.baseUrl + 'api/getQuestion', { params:queryParams });
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


