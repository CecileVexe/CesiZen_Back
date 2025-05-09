import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, CreateUserwithClerkDTo } from './dto/create-user.dto';
import {
  UpdateUserCredentialsDto,
  UpdateUserDto,
  UpdateUserRoleDto,
} from './dto/update-user.dto';
import { ApiReturns } from 'src/utils/types/ApiReturns.type';
import { validatePagination } from 'src/utils/pageQueryhandeler';
import { UserType } from 'src/utils/types/PrismaApiModel.type';
import { Public } from 'src/decorators/public.decortator';

@Controller('user')
export class UserController {
  constructor(private UserService: UserService) {}

  @Public()
  @Post('clerk')
  createWithClerk(
    @Body() createUserDto: CreateUserwithClerkDTo,
  ): Promise<ApiReturns<UserType | null>> {
    return this.UserService.createWithClerk(createUserDto);
  }
  @Public()
  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiReturns<UserType | null>> {
    return this.UserService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '10',
    @Query('orderBy') orderBy: string,
    @Query('sortBy') sortBy: 'asc' | 'desc' = 'asc',
  ): Promise<ApiReturns<UserType[] | null>> {
    const { page: pageNumber, perPage: perPageNumber } = validatePagination(
      page,
      perPage,
    );

    return this.UserService.findAll(pageNumber, perPageNumber, orderBy, sortBy);
  }

  @Get('clerk/:id')
  findOneFromClerk(
    @Param('id') clerkId: string,
  ): Promise<ApiReturns<UserType | null>> {
    return this.UserService.findOneFromClerk(clerkId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ApiReturns<UserType | null>> {
    return this.UserService.findOne(id);
  }
  @Patch('/credentials')
  updateCredentials(
    @Body() updateUserDto: UpdateUserCredentialsDto,
  ): Promise<Record<'message', string>> {
    return this.UserService.updateCredentials(updateUserDto);
  }

  @Patch('/role/:id')
  updateRole(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserRoleDto,
  ): Promise<ApiReturns<UserType>> {
    return this.UserService.updateRole(id, updateUserDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiReturns<UserType>> {
    return this.UserService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<string | { message: string }> {
    return this.UserService.remove(id);
  }
}
