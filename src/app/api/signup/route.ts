// import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
// import bcrypt from 'bcryptjs';
// import { NextResponse } from 'next/server';
// import { v4 as uuidv4 } from 'uuid';
// import { ddbClient } from '../../utils/dynamodb'; // import the raw client

// export async function POST(req: Request) {
//   try {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
//     }

//     // Check if user exists
//     const getRes = await ddbClient.send(
//       new GetCommand({
//         TableName: 'Users',
//         Key: { email },
//       })
//     );

//     if (getRes.Item) {
//       return NextResponse.json({ error: 'User already exists' }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = {
//       userId: uuidv4(),
//       email,
//       password: hashedPassword,
//       createdAt: new Date().toISOString(),
//     };

//     await ddbClient.send(
//       new PutCommand({
//         TableName: 'Users',
//         Item: newUser,
//       })
//     );

//     return NextResponse.json({ message: 'User created', userId: newUser.userId }, { status: 201 });
//   } catch (error: any) {
//     console.error('Signup Error:', error);
//     return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
//   }
// }

import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { ddbClient } from '../../utils/dynamodb';


export const dynamic = 'force-dynamic';

interface SignupRequestBody {
  email: string;
  password: string;
}

interface UserItem {
  userId: string;
  email: string;
  password: string;
  createdAt: string;
}

export async function POST(req: Request) {
  try {
    const { email, password }: SignupRequestBody = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Check if user already exists
    const getRes = await ddbClient.send(
      new GetCommand({
        TableName: 'Users',
        Key: { email },
      })
    );

    const existingUser = getRes.Item as UserItem | undefined;

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: UserItem = {
      userId: uuidv4(),
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    await ddbClient.send(
      new PutCommand({
        TableName: 'Users',
        Item: newUser,
      })
    );

    return NextResponse.json({ message: 'User created', userId: newUser.userId }, { status: 201 });
  }  catch (error) {
  console.error('Signup Error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
  return NextResponse.json(
    {
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error',
    },
    { status: 500 }
  );
}

}
