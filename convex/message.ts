import { v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

export const sendMessage = mutation({
  args: { room: v.string(), message: v.string(), userId: v.string() },
  handler: async (ctx, { room, message, userId }) => {
    const user = await ctx.auth.getUserIdentity();

    await ctx.db.insert("messages", {
      room,
      message,
      user: userId === "ChatGPT" ? "ChatGPT" : (user?.name as string),
    });

    if (message.startsWith("/gpt") && userId !== "ChatGPT") {
      // Schedule the chat action to run immediately
      await ctx.scheduler.runAfter(0, api.openAi.chat, {
        messageBody: message,
        roodId: room,
      });
    }
  },
});

export const getMessages = query({
  args: { room: v.string() },
  handler: async (ctx, { room }) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_room", (q) => q.eq("room", room))
      .order("desc")
      .take(100);
    const messagesWithLikes = await Promise.all(
      messages.map(async (message) => {
        // Find the likes for each message
        const likes = await ctx.db
          .query("likes")
          .withIndex("by_messageId", (q) => q.eq("messageId", message._id))
          .collect();
        // Join the count of likes with the message data
        return {
          ...message,
          likes: likes.length,
        };
      })
    );
    return messagesWithLikes.reverse();
  },
});

export const likeMessage = mutation({
  args: { messageId: v.id("messages"), userId: v.string() },
  handler: async (ctx, { messageId, userId }) => {
    const user = await ctx.auth.getUserIdentity();

    const existing = await ctx.db
      .query("likes")
      .withIndex("by_messageId", (q) => q.eq("messageId", messageId))
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
    } else {
      await ctx.db.insert("likes", { messageId, liker: user?.name as string });
    }
  },
});

export const context = internalQuery({
  args: { roomId: v.string() },
  handler: async (ctx, { roomId }) => {
    const prevChat = await ctx.db
      .query("messages")
      .withIndex("by_room", (q) => q.eq("room", roomId))
      .order("asc")
      .take(100);

    const map = await ctx.db
      .query("map")
      .withIndex("by_mapId", (q) => q.eq("mapId", roomId))
      .unique();

    if (!map) return;

    const mapFeats = await Promise.all(
      map.featIds.map(async (featId) => {
        const feat = await ctx.db.get(featId);
        return {
          ...feat,
          geometry: feat!.geometry,
          properties: feat!.properties,
        };
      })
    );

    const msg = prevChat.map((chat) => {
      return {
        text: chat.message,
        user: chat.user,
        createdAt: chat._creationTime,
      };
    });

    const geo = mapFeats.map((feat) => {
      return {
        geometry: feat.geometry,
        properties: feat.properties,
      };
    });

    const context = {
      chat: msg,
      geoJson: geo,
    };

    return context;
  },
});
