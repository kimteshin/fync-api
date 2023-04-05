import { Router } from "oak";
import { createUserParser, userParser, Users } from "../models/user.model.ts";
import { ObjectId } from "mongo";
import { z } from "zod";

export const usersRouter = new Router();

usersRouter
  .get("/", async (ctx) => {
    const users = await Users.find().toArray();
    ctx.response.body = users || [];
  })
  .get("/:id", async (ctx) => {
    const user = await Users.findOne({ _id: new ObjectId(ctx.params.id) });
    ctx.response.body = user;
  })
  .post("/", async (ctx) => {
    const body = await ctx.request.body({ type: "json" }).value;

    const result = createUserParser.safeParse(body);
    // console.log(body instanceof UserSchema);

    if (!result.success) {
      const error = result.error.format();
      ctx.response.body = error;
    } else {
      const user = await Users.insertOne({
        ...body,
        verified: false,
        createdAt: new Date(),
      });
      ctx.response.body = user;
    }
  })
  .put("/:id", async (ctx) => {
    const body = await ctx.request.body({ type: "json" }).value;
    const result = userParser.partial().safeParse(body);

    if (!result.success) {
      const error = result.error.format();

      ctx.response.body = error;
    } else {
      const user = await Users.updateOne(
        { _id: new ObjectId(ctx.params.id) },
        { $set: body }
      );
      ctx.response.body = user;
    }
  })
  .delete("/:id", async (ctx) => {
    const user = await Users.deleteOne({ _id: new ObjectId(ctx.params.id) });
    ctx.response.body = user;
  });

usersRouter
  .get("/friends/:id", async (ctx) => {
    try {
      const user = await Users.findOne({ _id: new ObjectId(ctx.params.id) });
      ctx.response.body = user?.friends || [];
    } catch (e) {
      console.log(e);
      ctx.response.body = { message: "invalid user id" };
    }
  })
  .post("/:id/add-friend", async (ctx) => {
    try {
      const body = await ctx.request.body({ type: "json" }).value;

      const user = await Users.findOne({ _id: new ObjectId(ctx.params.id) });

      if (user) {
        const friend = await Users.findOne({
          _id: new ObjectId(body.friendId),
        });
      }
    } catch (e) {}
  });
