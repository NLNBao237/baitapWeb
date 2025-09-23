import { Product } from './product.schema';
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProductService } from './product.service';


@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post()
	create(@Body() product: Partial<Product>): Promise<Product> {
		return this.productService.create(product);
	}

	@Get()
	findAll(): Promise<Product[]> {
		return this.productService.findAll();
	}

		@Get(':id')
		findOne(@Param('id') id: string): Promise<Product | null> {
			return this.productService.findOne(id);
		}

		@Put(':id')
		update(@Param('id') id: string, @Body() product: Partial<Product>): Promise<Product | null> {
			return this.productService.update(id, product);
		}

		@Delete(':id')
		remove(@Param('id') id: string): Promise<void> {
			return this.productService.remove(id);
		}
}
