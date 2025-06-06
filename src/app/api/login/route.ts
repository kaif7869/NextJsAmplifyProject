// import { GetCommand } from '@aws-sdk/lib-dynamodb';
// import bcrypt from 'bcryptjs';
// import { NextResponse } from 'next/server';
// import { ddbClient } from '../../utils/dynamodb';

// export async function POST(req: Request) {
//   try {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
//     }

//     const getRes = await ddbClient.send(
//       new GetCommand({
//         TableName: 'Users',
//         Key: { email },
//       })
//     );

//     if (!getRes.Item) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     const valid = await bcrypt.compare(password, getRes.Item.password);
//     if (!valid) {
//       return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
//     }

//     return NextResponse.json({
//       message: 'Login successful',
//       userId: getRes.Item.userId,
//     });
//   } catch (error: any) {
//     console.error('Login Error:', error);
//     return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
//   }
// }

import { GetCommand } from '@aws-sdk/lib-dynamodb';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { ddbClient } from '../../utils/dynamodb';


export const dynamic = 'force-dynamic';

interface LoginRequestBody {
  email: string;
  password: string;
}

interface UserItem {
  email: string;
  password: string;
  userId: string;
}

export async function POST(req: Request) {
  try {
    const { email, password }: LoginRequestBody = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const getRes = await ddbClient.send(
      new GetCommand({
        TableName: 'Users',
        Key: { email },
      })
    );

    const user = getRes.Item as UserItem | undefined;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    return NextResponse.json({
      message: 'Login successful',
      userId: user.userId,
    });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
