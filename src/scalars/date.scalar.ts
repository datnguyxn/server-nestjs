import { CustomScalar, Scalar } from '@nestjs/graphql';
import {
  GraphQLScalarValueParser,
  GraphQLScalarSerializer,
  GraphQLScalarLiteralParser,
  ValueNode,
  Kind,
} from 'graphql';

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<string, Date | null> {
  public description = 'Date custom scalar type';

  public parseValue(value: unknown): Date {
    if (typeof value !== 'number') {
      throw new Error('DateScalar can only parse number values');
    }
    return new Date(value);
  }

  public serialize(value: unknown): string {
    if (!(value instanceof Date)) {
      throw new Error('DateScalar can only serialize Date values');
    }
    return value.toISOString();
  }

  public parseLiteral(ast: ValueNode): Date | null {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }

    return null;
  }
}
