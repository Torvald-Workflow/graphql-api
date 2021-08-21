import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CurrentUser,
  CurrentUserDecoratorInterface,
} from 'src/auth/decorator/currentUser';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { UpdateUsersProjectDto } from './dto/updateUsersProject.dto';
import { Project } from './project.model';
import { ProjectsService } from './projects.service';

@Resolver()
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Project])
  async fetchAllProjects(): Promise<Project[]> {
    return await this.projectsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Project)
  async fetchProjectById(@Args('id') id: string): Promise<Project> {
    return await this.projectsService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Project)
  async fetchProjectBySlug(@Args('slug') slug: string): Promise<Project> {
    return await this.projectsService.findOneBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Project)
  async createProject(
    @CurrentUser() user: CurrentUserDecoratorInterface,
    @Args('data') data: CreateProjectDto,
  ): Promise<Project> {
    return await this.projectsService.create(user, data);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Project)
  async updateProject(
    @Args('id') id: string,
    @Args('data') data: UpdateProjectDto,
  ): Promise<Project> {
    return await this.projectsService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Project)
  async updateUsersProject(
    @Args('id') id: string,
    @Args('data') data: UpdateUsersProjectDto,
  ): Promise<Project> {
    return await this.projectsService.updateUsers(id, data);
  }
}
