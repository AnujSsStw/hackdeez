import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";

export const insertFeat = mutation({
  args: { type: v.string(), geometry: v.any(), properties: v.any() },
  handler: async (ctx, { geometry, type, properties }) => {
    const feat = await ctx.db.insert("feat", { geometry, type, properties });
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

export const insertMap = mutation({
  args: {
    name: v.optional(v.string()),
    des: v.optional(v.string()),
    mapId: v.string(),
  },
  handler: async (ctx, { name, des, mapId }) => {
    const existing = await ctx.db
      .query("map")
      .withIndex("by_mapId", (q) => q.eq("mapId", mapId))
      .unique();
    if (existing) {
    } else {
      await ctx.db.insert("map", { mapId, name, des, featIds: [] });
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
