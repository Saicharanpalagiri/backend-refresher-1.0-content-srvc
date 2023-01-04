import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentDto } from 'src/submodules/backend-refresher-1.0-dtos/src/dtos/content.dto';
import { Content } from 'src/submodules/backend-refresher-entities-1.0/src/entities/content-entity';
import { User } from 'src/submodules/backend-refresher-entities-1.0/src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContentService {

  constructor(
    @InjectRepository(Content) 
    private contentRepository: Repository<Content>,

    @InjectRepository(User) 
    private userRepository: Repository<User>
  ){}
 
  async createContent(Content: ContentDto){
     
    try{
      let ContentEntity = this.contentRepository.create(Content)
      let user = this.userRepository.create(Content.users[0]);
      ContentEntity.user = user;
      let createdContent = await this.contentRepository.save(ContentEntity);
      return createdContent;
    } catch (err) {
      throw err
    }


  }

  async findAll(){
    try{
      console.log('find All')
      let retrievedContents = await this.contentRepository.find();
      return retrievedContents;
    } catch (err) {
      throw err
    }
  }

  async updateContent(Content: ContentDto){
    try{
      let updateResult = await this.contentRepository.update(
        Content.id,
        Content,
      );
      return updateResult;
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async deleteContent(ContentId: number){
    try{
      let deletedContent = await this.contentRepository.delete(ContentId);
      return deletedContent;
    } catch (err) {
      throw err
    }
  }
}