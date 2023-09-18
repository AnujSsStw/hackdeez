import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { log } from "console";

export const insertFeat = mutation({
  args: {
    type: v.string(),
    geometry: v.any(),
    properties: v.any(),
    style: v.optional(v.any()),
  },
  handler: async (ctx, { geometry, type, properties, style }) => {
    const feat = await ctx.db.insert("feat", {
      geometry,
      type,
      properties,
      style,
    });
    return feat;
  },
});

export const insertFeatToMap = mutation({
  args: { mapId: v.string(), featId: v.id("feat") },
  handler: async (ctx, { mapId, featId }) => {
    // const map = await ctx.db.get(mapId);
    const map = await ctx.db
      .query("map")
      .withIndex("by_mapId", (q) => q.eq("mapId", mapId))
      .unique();
    if (!map) return;
    await ctx.db.patch(map._id, { featIds: [...map.featIds, featId] });
  },
});

export const updateMapI = internalMutation({
  args: { mapId: v.string(), email: v.string() },
  handler: async (ctx, { email, mapId }) => {
    console.log("updateMapI", email, mapId);

    const map = await ctx.db
      .query("map")
      .withIndex("by_mapId", (q) => q.eq("mapId", mapId))
      .unique();
    if (!map) return;

    await ctx.db.patch(map._id, {
      anyOneWithLink: {
        restricted: false,
        canEdit: [...map.anyOneWithLink.canEdit, email],
      },
    });
  },
});

export const insertMap = mutation({
  args: {
    name: v.optional(v.string()),
    des: v.optional(v.string()),
    mapId: v.string(),
    isPublic: v.boolean(),
    anyOneWithLink: v.object({
      restricted: v.boolean(),
      canEdit: v.array(v.string()),
    }),
    userId: v.string(),
  },
  handler: async (
    ctx,
    { name, des, mapId, isPublic, anyOneWithLink, userId }
  ) => {
    const existing = await ctx.db
      .query("map")
      .withIndex("by_mapId", (q) => q.eq("mapId", mapId))
      .unique();
    if (existing) {
    } else {
      await ctx.db.insert("map", {
        mapId,
        name,
        des,
        featIds: [],
        isPublic,
        anyOneWithLink,
        creator: userId,
      });
    }
  },
});

export const mapfeat = query({
  args: { mapId: v.string(), userId: v.string() },
  handler: async (ctx, { mapId, userId }) => {
    const existing = await ctx.db
      .query("map")
      .withIndex("by_mapId", (q) => q.eq("mapId", mapId))
      .unique();
    if (existing) {
      const p = [];
      for (const featId of existing.featIds) {
        p.push(
          ctx.db
            .query("feat")
            .filter((q) => q.eq(q.field("_id"), featId))
            .unique()
        );
      }
      const feats = await Promise.all(p);
      return feats;
    } else {
      return [];
    }
  },
});

export const removeFeatFromMap = mutation({
  args: { mapId: v.string(), featId: v.id("feat") },
  handler: async (ctx, { mapId, featId }) => {
    const feat = await ctx.db.get(featId);
    if (!feat) return;
    const map = await ctx.db
      .query("map")
      .withIndex("by_mapId", (q) => q.eq("mapId", mapId))
      .unique();
    if (!map) return;
    await ctx.db.delete(feat._id);
    await ctx.db.patch(map._id, {
      featIds: map.featIds.filter((id) => id !== featId),
    });
  },
});

export const getMap = query({
  args: { mapId: v.string() },
  handler: async (ctx, { mapId }) => {
    const existing = await ctx.db
      .query("map")
      .withIndex("by_mapId", (q) => q.eq("mapId", mapId))
      .unique();
    if (existing) {
      return existing;
    } else {
      return null;
    }
  },
});
