import { Controller, Post, Body } from '@nestjs/common';

import AuthService from './auth.service';
import RegistrationDto from './dto/registration.dto';
import LoginDto from './dto/login.dto';

@Controller()
export default class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/registration')
  signUp(@Body() dto: RegistrationDto): Promise<{ token: string }> {
    return this.authService.registration(dto);
  }

  @Post('/login')
  signIn(@Body() dto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(dto);
  }
}
