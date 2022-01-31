import { ServiceManager } from '@foal/core';
import { Prisma } from '@prisma/client';
import { JTDDataType } from './jtd';
import { Prisma as PrismaService } from './services/prisma.service';

export async function fetchUser(id: number|string, services: ServiceManager) {
    if (typeof id === 'string') {
        throw new Error('The user ID must be a number.');
    }
    
    const user = await services.get(PrismaService).client.user.findFirst({where: { id }});
    if (user === null) return undefined;
    return user;
}

export const attributeSchema = {
    type: 'object',
    properties: {
        path: {
            type: 'string',
            description: `Path to the value you want to test. If you have an object like:

{
    "name": "my name",
    "features": {
        "color": "blue"
    },
    "tags": ["winter", "summer"],
    "houses": [{"color": "red"}, {"color": "blue"}]
}

You can filter on a root property like "name", a nested property like "features.color", a specific array value like "tags[1]", or an object nested in an array like "houses[*].color"`
        },
        equals: {
            description: 'Value exactly matches the passed value'
        },
        stringContains: {
            type: 'string',
            description: 'Value is a string and contains the passed value'
        },
        stringStartsWith: {
            type: 'string',
            description: 'Value is a string and starts with the passed value'
        },
        stringEndsWith: {
            type: 'string',
            description: 'Value is a string and ends with the passed value'
        },
        arrayContains: {
            description: 'Value is an array and includes the passed value, or if the passed value is an array, contains all of the provided values'
        }
    }
} as const;

// Don't return the hashed password
export const userSelectFields: Prisma.UserSelect = {
    id: true,
    email: true,
    attributes: true
} as const;

export function apiAttributesToPrisma(fromApi?: JTDDataType<typeof attributeSchema>[]): {attributes: Prisma.JsonNullableFilter}[] {
    return (fromApi ?? []).map(filter => ({
        // Due to limitations with our frankensteined AJV JSD/JTD types, we don't type equals or
        // arrayContains properly 
        attributes: {
          path: `$.${filter.path}`,
          equals: filter.equals as Prisma.JsonNullValueFilter | Prisma.InputJsonValue,
          array_contains: filter.arrayContains as Prisma.InputJsonValue | null,
          string_contains: filter.stringContains,
          string_starts_with: filter.stringStartsWith,
          string_ends_with: filter.stringEndsWith
        }
    }));
}
