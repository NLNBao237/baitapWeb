import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.schema';
import { RegisterDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<User>,
		private readonly jwtService: JwtService,
	) {}

	async register(dto: RegisterDto): Promise<User> {
		const exist = await this.userModel.findOne({ email: dto.email });
		if (exist) throw new BadRequestException('Email đã tồn tại');
		const hash = await bcrypt.hash(dto.password, 10);
		const user = new this.userModel({ ...dto, password: hash });
		return user.save();
	}

	async login(dto: LoginDto): Promise<{ access_token: string }> {
		const user = await this.userModel.findOne({ email: dto.email });
		if (!user) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
		const isMatch = await bcrypt.compare(dto.password, user.password);
		if (!isMatch) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
		const payload = { sub: user._id, email: user.email };
		const access_token = this.jwtService.sign(payload);
		return { access_token };
	}
}
