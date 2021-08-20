import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { UpdateUsersProjectDto } from './dto/updateUsersProject.dto';
import { ProjectEntity } from './project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
  ) {}

  async findAll(): Promise<ProjectEntity[]> {
    return this.projectRepository.find();
  }

  async findOneById(id: string): Promise<ProjectEntity> {
    return this.projectRepository.findOne({ id });
  }

  async findOneBySlug(slug: string): Promise<ProjectEntity> {
    return this.projectRepository.findOne({ slug });
  }

  async create(data: CreateProjectDto): Promise<ProjectEntity> {
    const isProjectExist =
      (await this.findOneBySlug(data.slug)) ||
      (await this.projectRepository.findOne({ name: data.name }));

    if (isProjectExist)
      throw new BadRequestException('A project already exists using this slug');

    const newProject = new ProjectEntity();

    newProject.name = data.name;
    newProject.slug = data.slug;
    newProject.description = data.description;
    newProject.createdAt = new Date();
    newProject.users = [];

    return this.projectRepository.save(newProject);
  }

  async delete(id: string): Promise<ProjectEntity> {
    const deletedProject = await this.findOneById(id);

    if (!deletedProject)
      throw new NotFoundException('This project does not exists');

    await this.projectRepository.delete(deletedProject.id);

    return deletedProject;
  }

  async update(id: string, data: UpdateProjectDto): Promise<ProjectEntity> {
    const projectToEdit = await this.findOneById(id);

    if (!projectToEdit)
      throw new NotFoundException('This project does not exists');

    const isProjectAlreadyExist =
      (await this.findOneBySlug(data.slug)) ||
      (await this.projectRepository.findOne({ name: data.name }));

    if (isProjectAlreadyExist)
      throw new BadRequestException(
        'A project already exists using this name or this slug',
      );

    projectToEdit.name = data.name;
    projectToEdit.slug = data.slug;
    projectToEdit.description = data.description;

    return this.projectRepository.save(projectToEdit);
  }

  async updateUsers(
    id: string,
    data: UpdateUsersProjectDto,
  ): Promise<ProjectEntity> {
    const projectToEdit = await this.findOneById(id);

    if (!projectToEdit)
      throw new NotFoundException('This project does not exists');

    projectToEdit.users = data.users;

    return this.projectRepository.save(projectToEdit);
  }
}
