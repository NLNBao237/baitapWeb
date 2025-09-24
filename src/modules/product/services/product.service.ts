	import { Injectable } from '@nestjs/common';
	import { InjectModel } from '@nestjs/mongoose';
	import { Model } from 'mongoose';
	import { Product } from '../product.schema';

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

		async findAll(search?: string, page: number = 1, limit: number = 10): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
			const query: any = {};
			if (search) {
				query.name = { $regex: search, $options: 'i' };
			}
			const skip = (page - 1) * limit;
			const [data, total] = await Promise.all([
				this.productModel.find(query).skip(skip).limit(limit).exec(),
				this.productModel.countDocuments(query)
			]);
			return { data, total, page, limit };
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
