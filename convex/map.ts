import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

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
      sendInvite: {
        restricted: false,
        canEdit: [...map.sendInvite.canEdit, email],
      },
    });
  },
});

export const updateMapAccess = mutation({
  args: { mapId: v.string(), anyOneWithLInk: v.boolean() },
  handler: async (ctx, { mapId, anyOneWithLInk }) => {
    const map = await ctx.db
      .query("map")
      .withIndex("by_mapId", (q) => q.eq("mapId", mapId))
      .unique();
    if (!map) return;

    await ctx.db.patch(map._id, {
      anyOneWithLink: anyOneWithLInk,
    });
  },
});

export const insertMap = mutation({
  args: {
    name: v.optional(v.string()),
    des: v.optional(v.string()),
    mapId: v.string(),
    isPublic: v.boolean(),
    sendInvite: v.object({
      restricted: v.boolean(),
      canEdit: v.array(v.string()),
    }),
    userId: v.string(),
  },
  handler: async (ctx, { name, des, mapId, isPublic, sendInvite, userId }) => {
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
        creator: userId,
        sendInvite,
        anyOneWithLink: false,
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

export const createACopy = mutation({
  args: { mapId: v.string() },
  handler: async (ctx, { mapId }) => {
    const user = await ctx.auth.getUserIdentity();

    const existing = await ctx.db
      .query("map")
      .withIndex("by_mapId", (q) => q.eq("mapId", mapId))
      .unique();

    if (existing) {
      const newMapId = guid();
      await ctx.db.insert("map", {
        mapId: newMapId,
        creator: user?.tokenIdentifier.split("|").pop() as string,
        sendInvite: {
          restricted: true,
          canEdit: [],
        },
        anyOneWithLink: false,
        featIds: existing.featIds,
        name: existing.name,
        isPublic: false,
        des: existing.des,
      });
      return newMapId;
    } else {
      return null;
    }
  },
});

export const getAllUserMaps = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const existing = await ctx.db
      .query("map")
      .filter((q) => q.eq(q.field("creator"), userId))
      .order("desc")
      .collect();

    if (existing) {
      return existing;
    } else {
      return null;
    }
  },
});

export const getPublicMaps = query({
  args: {},
  handler: async (ctx, {}) => {
    const existing = await ctx.db
      .query("map")
      .filter((q) => q.eq(q.field("isPublic"), true))
      .collect();

    if (existing) {
      return existing;
    } else {
      return null;
    }
  },
});

export const changeIsPublic = mutation({
  args: { mapId: v.string(), isPublic: v.boolean() },
  handler: async (ctx, { mapId, isPublic }) => {
    const existing = await ctx.db
      .query("map")
      .withIndex("by_mapId", (q) => q.eq("mapId", mapId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { isPublic });
    }
  },
});

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// then to call it, plus stitch in '4' in the third group
var guid = () =>
  (
    S4() +
    S4() +
    "-" +
    S4() +
    "-4" +
    S4().substr(0, 3) +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  ).toLowerCase();
