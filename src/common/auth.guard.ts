import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from 'src/utils/jwt.service';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector, // Use Reflector to check metadata
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // For GraphQL, we extract the context in a different way
    const ctx = GqlExecutionContext.create(context);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (isPublic) {
      return true; // Allow public routes without authentication
    }

    const req = ctx.getContext().req; // Access the request object from GraphQL context
    const authHeader = req.headers['authorization']; // Extract `Authorization` header

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const decoded = this.jwtService.verifyToken(token); // Verify token
      req['user'] = decoded; // Attach decoded payload to request for further use
      return true; // Allow the request
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
