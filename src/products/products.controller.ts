import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProductEntity } from './entities/product.entity';
import { ValidateCuidPipe } from './validation/cuid.validation';

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiCreatedResponse({ type: ProductEntity })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOkResponse({ type: ProductEntity, isArray: true })
  findAll() {
    return this.productsService.findAll();
  }

  @Get('unpublished')
  @ApiOkResponse({ type: ProductEntity, isArray: true })
  findAllUnpublished() {
    return this.productsService.findAllUnpublished();
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductEntity, isArray: true })
  async findOne(@Param('id', ValidateCuidPipe) id: string) {
    const article = await this.productsService.findOne(id);

    if (!article) {
      return new NotFoundException(`Article with id: ${id} not found`);
    }

    return article;
  }

  @Patch(':id')
  @ApiOkResponse({ type: ProductEntity })
  update(
    @Param('id', ValidateCuidPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ProductEntity })
  remove(@Param('id', ValidateCuidPipe) id: string) {
    return this.productsService.remove(id);
  }
}
