import {
  Module,
  ValidationPipe,
  MiddlewareConsumer,
  NestModule,
} from '@nestjs/common';
import { APP_PIPE, APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './config/database.module';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path'; // Needed for schema file path
import { AppResolver } from './app.service';
import { UserModule } from './user/user.module';
import { Request, Response } from 'express'; // Import Express types
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { LoggingMiddleware } from './common/logging.middleware';
import { EmployeeModule } from './employee/employee.module';
import { AuthGuard } from './common/auth.guard';
import { RolesGuard } from './common/roles.guard';
import { JwtModule } from './utils/jwt.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // validation for config
    DatabaseModule, // Add DatabaseModule here
    AppResolver,
    UserModule,
    JwtModule,
    EmployeeModule,
    // Adding GraphQL Module
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      introspection: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Automatically generates schema.gql
      sortSchema: true, // Sorts the schema output
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }), // Explicitly type req and res
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Apply AuthGuard globally
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
