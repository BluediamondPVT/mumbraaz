import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import connectToDatabase from '@/lib/db'
import { User } from '@/lib/models/User'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Clerk Dashboard se jo Webhook Secret milega, wo yahan use hoga
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env.local')
  }

  // Incoming request ke headers get karo
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Agar headers nahi hain, toh error throw karo
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Request body ko padho
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Naya Svix instance banao secret ke sath
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Signature verify karo
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  const { id } = evt.data;
  const eventType = evt.type;

  // Database se connect karo
  await connectToDatabase();

  // Agar naya user create hua hai Clerk par
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data;

    const email = email_addresses[0]?.email_address;
    const name = `${first_name || ''} ${last_name || ''}`.trim();

    try {
      const newUser = await User.create({
        clerkId: id,
        email: email,
        name: name !== '' ? name : 'User',
        // Admin user banate waqt dashboard se jo metadata set kiya tha, wo check kar sakte hain, 
        // par default 'user' role jayega model ke hisaab se.
      });

      console.log('New user saved to database:', newUser._id);
      return NextResponse.json({ message: 'User created in database', user: newUser }, { status: 201 });
    } catch (error) {
      console.error('Error saving user to DB:', error);
      return NextResponse.json({ error: 'Error saving user' }, { status: 500 });
    }
  }

  // Agar user update hua hai (e.g., profile pic change ki ya naam change kiya)
  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    const name = `${first_name || ''} ${last_name || ''}`.trim();

    try {
      const updatedUser = await User.findOneAndUpdate(
        { clerkId: id },
        { email: email, name: name },
        { new: true }
      );
      return NextResponse.json({ message: 'User updated', user: updatedUser }, { status: 200 });
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
    }
  }

  // Agar user delete hua hai Clerk se
  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    try {
      await User.findOneAndDelete({ clerkId: id });
      return NextResponse.json({ message: 'User deleted' }, { status: 200 });
    } catch (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
    }
  }

  return new Response('Webhook received', { status: 200 })
}