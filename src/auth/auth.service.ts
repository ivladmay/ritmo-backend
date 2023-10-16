import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from './schemas/user.schema';
import RegistrationDto from './dto/registration.dto';
import LoginDto from './dto/login.dto';

@Injectable()
export default class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async registration(dto: RegistrationDto): Promise<{ token: string }> {
    const { name, email, password } = dto;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async login(dto: LoginDto): Promise<{ token: string }> {
    const { email, password } = dto;

    const user = await this.userModel.findOne({ email });
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }
}
