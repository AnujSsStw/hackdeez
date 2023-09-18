import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  presence: defineTable({
    user: v.string(),
    room: v.string(),
    updated: v.number(),
    data: v.any(),
  })
    // Index for fetching presence data
    .index("by_room_updated", ["room", "updated"])
    // Index for updating presence data
    .index("by_user_room", ["user", "room"]),
  map: defineTable({
    name: v.optional(v.string()),
    des: v.optional(v.string()),
    featIds: v.array(v.id("feat")),
    mapId: v.string(),
    isPublic: v.boolean(),
    anyOneWithLink: v.object({
      restricted: v.boolean(),
      // canView: v.array(v.string()),
      canEdit: v.array(v.string()),
    }),
    creator: v.string(),
  }).index("by_mapId", ["mapId"]),
  feat: defineTable({
    type: v.string(),
    geometry: v.any(),
    properties: v.any(),
    style: v.optional(v.any()),
  }),
  messages: defineTable({
    user: v.string(),
    room: v.string(),
    message: v.string(),
  }).index("by_room", ["room"]),
  likes: defineTable({
    liker: v.string(),
    messageId: v.id("messages"),
  }).index("by_messageId", ["messageId"]),
});
