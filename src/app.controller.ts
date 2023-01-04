import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { ContentDto } from './submodules/backend-refresher-1.0-dtos/src/dtos/content.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('Step 1');
    return this.appService.getHello();
  }

  @Post()
  async createContent(@Body() content: ContentDto) {
    // dtos -> data transfer object
    try {
      console.log('step1');
      console.log(content)
       let createdContent = await this.appService.createContent(content);
       return createdContent;
    } catch (err) {
       console.log(err);
       return err;
    }
  }

  @Put()
  async updateContent(@Body() content: ContentDto) {
    try {
      let updatedContent= await this.appService.updateContent(content);
      return updatedContent;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
 
}