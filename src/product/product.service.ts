	import { Injectable } from '@nestjs/common';
	import { InjectModel } from '@nestjs/mongoose';
	import { Model } from 'mongoose';
	import { Product } from './product.schema';

	@Injectable()
	export class ProductService {
		constructor(
			@InjectModel(Product.name)
			private readonly productModel: Model<Product>,
		) {}

		create(product: Partial<Product>): Promise<Product> {
			const createdProduct = new this.productModel(product);
			return createdProduct.save();
		}

		findAll(): Promise<Product[]> {
			return this.productModel.find().exec();
		}

		findOne(id: string): Promise<Product | null> {
			return this.productModel.findById(id).exec();
		}

		async update(id: string, product: Partial<Product>): Promise<Product | null> {
			return this.productModel.findByIdAndUpdate(id, product, { new: true }).exec();
		}

		async remove(id: string): Promise<void> {
			await this.productModel.findByIdAndDelete(id).exec();
		}
	}
