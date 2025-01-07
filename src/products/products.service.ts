import { PrismaService } from './../prisma/prisma.service';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      return await this.prismaService.product.create({
        data: createProductDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Product with name ${createProductDto.name} alredy exist`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return this.prismaService.product.findMany();
  }

  async findOne(id: number) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id: id,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const updateProduct = await this.prismaService.product.update({
        where: {
          id,
        },
        data: updateProductDto,
      });
      return updateProduct;
    } catch (error) {
      console.log(error.messaje);
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.product.delete({
        where: { id },
      });
    } catch (error) {
      console.log(error.messaje);
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }
}
