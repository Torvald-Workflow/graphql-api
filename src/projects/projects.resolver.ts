import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProjectDto } from './dto/createProject.dto';
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
  async fetchProjectById(id: string): Promise<Project> {
    return await this.projectsService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Project)
  async fetchProjectBySlug(slug: string): Promise<Project> {
    return await this.projectsService.findOneBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Project)
  async createProject(@Args('data') data: CreateProjectDto): Promise<Project> {
    return await this.projectsService.create(data);
  }
}
