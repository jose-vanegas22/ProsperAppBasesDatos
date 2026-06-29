import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, contrasena: string) {
    const usuario = await this.userService.findByEmail(email);

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: usuario.usuarioId, email: usuario.email };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        usuarioId: usuario.usuarioId,
        primerNombre: usuario.primerNombre,
        email: usuario.email,
      },
    };
  }
}
