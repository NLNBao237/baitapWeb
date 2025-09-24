import { Product } from '../product.schema';
import { Controller, Get, Post, Body, Param, Put, Delete, Query, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { ProductService } from '../services/product.service';
import { CreateProductDto, UpdateProductDto } from '../product.dto';


@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post()
	@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
	create(@Body() product: CreateProductDto): Promise<Product> {
		return this.productService.create(product);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	findAll(
		@Query('search') search?: string,
		@Query('page') page: number = 1,
		@Query('limit') limit: number = 10,
	): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
		return this.productService.findAll(search, Number(page), Number(limit));
	}

		@Get(':id')
		findOne(@Param('id') id: string): Promise<Product | null> {
			return this.productService.findOne(id);
		}

		@Put(':id')
		@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
		update(@Param('id') id: string, @Body() product: UpdateProductDto): Promise<Product | null> {
			return this.productService.update(id, product);
		}

		@Delete(':id')
		remove(@Param('id') id: string): Promise<void> {
			return this.productService.remove(id);
		}
}
