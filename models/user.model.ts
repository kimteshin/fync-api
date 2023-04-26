import { ObjectId } from "mongo";
import { db } from "../db.ts";
import { z } from "zod";
import { friendParser } from "./friend.model.ts";

// export interface UserSchema {
//   _id: ObjectId;
//   username: string;
//   name: string;
//   avatar: string;
//   profilePicture: string;
//   friends: ObjectId[];
//   email: string;
//   verified?: boolean;
//   createdAt: Date;
// }

export const userParser = z.object({
  _id: z.instanceof(ObjectId),
  provider: z.array(z.enum(["google", "facebook", "email"])).optional(),
  devId: z.instanceof(ObjectId).optional(),

  username: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  age: z.number().optional(),

  profilePicture: z.string().optional(),

  friends: z.array(friendParser),
  friendRequests: z.array(z.instanceof(ObjectId)),

  email: z.string(),
  password: z.string().optional(),
  verified: z.boolean(),
  createdAt: z.date(),

  phoneNumber: z.string().optional(),
  birthdate: z.string().optional(),

  apps: z.array(z.instanceof(ObjectId)),
  appUsers: z.instanceof(ObjectId).array(),

  location: z
    .object({
      country: z.string(),
      city: z.string(),
    })
    .optional(),

  interests: z.array(z.string()).optional(),
  hobbies: z.array(z.string()).optional(),
  bio: z.string().optional(),
});

export type UserSchema = z.infer<typeof userParser>;

// export const createUserParser = userParser.omit({
//   _id: true,
//   verified: true,
//   createdAt: true,
//   friends: true,
//   apps: true,
// });

export const createUserParser = userParser.pick({
  username: true,
  name: true,
  email: true,
  password: true,
  birthdate: true,
  phoneNumber: true,
  profilePicture: true,
});

export const createEmailUserParser = z.object({
  username: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  profilePicture: z.string().optional(),
  avatar: z.string().optional(),
  birthdate: z.string().optional(),
});

export const createGuestUserParser = userParser.pick({
  username: true,
  name: true,
  email: true,
  age: true,
  phoneNumber: true,

  profilePicture: true,
  avatar: true,
  birthdate: true,
});

// export const guestUserParser = userParser.omit({});

// export type GuestUserSchema = z.infer<typeof guestUserParser>;

export const Users = db.collection<UserSchema>("users");
