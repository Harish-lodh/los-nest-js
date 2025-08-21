import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    console.log("users",user)
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isMatch = user.password === password;
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');
    console.log(isMatch)//this not consling and not returning users?
    return user;
  }

  async login(user: any) {
    const payload = { username: user.full_name,email:user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  
}
