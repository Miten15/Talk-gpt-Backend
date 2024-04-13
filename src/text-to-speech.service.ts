import { Controller, Post , Body, Res, ConsoleLogger } from "@nestjs/common";
import { TextToSpeechService } from "./text-to-speech.controller";
import { Response } from "express";
import { ChatService } from "./gpt.service";

@Controller('text-to-speech')
 export class TextToSpeechController {
    constructor(
        private readonly textToSpeechService: TextToSpeechService,
        private readonly chatService: ChatService,
    ){}

    @Post('synthesize')
    async synthesize(
        @Body('text') text: string,
        @Res() res: Response
    ) {
        try{
            const gptResponse = await this.chatService.chatWithGPT(text);
            const requset = {
                input: {text: gptResponse},
                voice: {
                    name: "en-US-Wavenet-D",
                    languageCode: "en-US",
                    ssmlGender: "FEMALE"

                },
                audioConfig: {
                    audioEncoding: "MP3",
                    
            }
        };
           const audioContent = await this.textToSpeechService.synthesizeSpeech(requset);

            res.setHeader('Content-Type', 'audio/mpeg');
            res.send(audioContent);

        } catch(error){
            console.error(error)
            res.status(500).send(error);

        }
    }
 }