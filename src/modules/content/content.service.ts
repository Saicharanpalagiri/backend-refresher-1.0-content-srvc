import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentDto } from 'src/submodules/backend-refresher-1.0-dtos/src/dtos/content.dto';
import { ReactionDto } from 'src/submodules/backend-refresher-1.0-dtos/src/dtos/reaction.dto';
import { Content } from 'src/submodules/backend-refresher-entities-1.0/src/entities/content-entity';
import { Group } from 'src/submodules/backend-refresher-entities-1.0/src/entities/group.entity';
import { Option } from 'src/submodules/backend-refresher-entities-1.0/src/entities/option.entity';
import { Reaction } from 'src/submodules/backend-refresher-entities-1.0/src/entities/reaction.entity';
import { User } from 'src/submodules/backend-refresher-entities-1.0/src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContentService {

  constructor(
    @InjectRepository(Content) 
    private contentRepository: Repository<Content>,

    @InjectRepository(User) 
    private userRepository: Repository<User>,

    @InjectRepository(Option) 
    private optionRepository: Repository<Option>,

    @InjectRepository(Group) 
    private groupRepository: Repository<Group>,

    @InjectRepository(Reaction)
    private reactionRepository: Repository<Reaction>,
  ){}
 
  async createContent(Content: ContentDto){
    try{
      let ContentEntity = this.contentRepository.create(Content)
      let user = this.userRepository.create(Content.users[0]);
      ContentEntity.user = user;

      if (Content.hasOwnProperty('groups')) {
        let group = this.groupRepository.create(Content.groups[0]) 
        ContentEntity.group = group;
      }

      if (Content.options) {
        let createdOptions = await this.optionRepository.save(Content.options);
        ContentEntity.options = createdOptions;
      }

      let createdContent = await this.contentRepository.save(ContentEntity);
      console.log(createdContent)
      return createdContent;
    } catch (err) {
      throw err
    }


  }

  async fetchContentByUser(userId: number){
    try{
      let fetchedContent = await this.contentRepository.find({ where: {
          user: { id: userId },
        },
        relations: ['options'],
      });

      /// validation of userId

      // let fetchedContent = await this.contentRepository
      //   .createQueryBuilder('content')
      //   .select('*')
      //   .where('content.user = :userId', { userId: userId })
      //   .andWhere('content.type = :type', { type: 'POST' })
      //   .execute();

      return fetchedContent;
    } catch (err) {
      throw err;
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


  async addingReaction(
    contentId: number,
    userId: number,
    reaction: ReactionDto,
  ) {
    try {
      //let reaction = await
      let content = await this.contentRepository.find({
        where: { id: contentId },
        relations: ['options', 'group', 'user']
      })

      let reactionEntity = await this.reactionRepository.create(reaction);
      reactionEntity.contents = await this.contentRepository.findOne({
        where: { id: contentId },
      })
      reactionEntity.users = await this.userRepository.findOne({
        where: { id: userId}
      })
      let createdReaction = await this.reactionRepository.save(reactionEntity)
      return createdReaction
      return content
    } catch (error) {
      throw error;
    }
  }

  async removeReaction(id: number) {
    try {

      let reactionEntity = await this.reactionRepository.delete(id);
      return reactionEntity
      //return content
    } catch (error) {
      throw error;
    }
  }



}