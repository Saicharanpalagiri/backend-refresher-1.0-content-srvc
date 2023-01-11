import { Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { RMQPayloadDto } from 'src/submodules/backend-refresher-1.0-rmq/src/dtos/rmqPayload.dto';
import { RmqTopics } from 'src/submodules/backend-refresher-1.0-rmq/src/enums/rmqTopics';
import { ContentService } from "./content.service";

@Controller('content')
export default class ContentController{
    /*
    - post creation (rmq) ---> done
    - fetch post (http)
    - delete post (http)
    - update post  (rmq)
    */
  constructor(private readonly contentService: ContentService) {}
  @EventPattern(RmqTopics.CONTENT_CREATION_TOPIC)
  async createContent(data: any) {
    try {
      console.log(data)
      let rmqPayload: RMQPayloadDto = data.payload;
      console.log('Received content dto : ', rmqPayload);
      await this.contentService.createContent(rmqPayload.payload);
    } catch (err) {
      console.log(err)
    }
  }

  @EventPattern(RmqTopics.CONTENT_UPDATION_TOPIC)
  async updateContent(data: any) {
    try {
      let rmqPayload: RMQPayloadDto = data.payload;
      console.log('Received content dto : ', rmqPayload);
      await this.contentService.updateContent(rmqPayload.payload);
    } catch (err) {
      console.log(err)
    }
  }

  @Get()
  async getContent(){
    try {
      let fetchedContent = await this.contentService.findAll();
      return fetchedContent;
    } catch (error) {
      console.log(error)
    }
  }

  @Delete(':id')
  async deleteContent(@Param('id') contentId: number){
    try {
      let deletedContent = await this.contentService.deleteContent(contentId);
      return deletedContent;
    } catch (error) {
      console.log(error)
    }
  }

  // localhost:5000/content/user-profile/5 --> url param localhost:5000/content/user-profile?userId=5&email="xyz" . ---> query param
  // fetch all posts of a particular user
  @Get('/user-profile')
  async fetchContentByUser(@Query() query: { userId: number }){
    try{
      let { userId } = query;
      let fetchedContent = await this.contentService.fetchContentByUser(userId);
      return fetchedContent;
    } catch (err) {
      console.log(err);
    }
  }
  
}