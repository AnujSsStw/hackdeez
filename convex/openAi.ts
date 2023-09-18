"use node";

import { v } from "convex/values";
import OpenAI from "openai";
import { api } from "./_generated/api";
import { action } from "./_generated/server";

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

export const chat = action({
  args: {
    messageBody: v.string(),
    roodId: v.string(),
  },
  handler: async (ctx, { messageBody, roodId }) => {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // "gpt-4" also works, but is so slow!
      messages: [
        {
          role: "system",
          content: `You are a tour guide bot in a group chat responding to questions with 1-sentence answers. you will be given the context of the conversation like this: 
                {
                    chat: msg, 
                    geoJson: geo,
                }
                if the chat and geoJson are not helpful as context, you can ignore them.
                And if you recommend a place, you can respond with the following format:
                {
                    placeName: name,
                    placeDes: des,
                }
          `,
        },
        {
          // Pass on the chat user's message to GPT
          role: "user",
          content: messageBody,
        },
      ],
    });

    // Pull the message content out of the response
    const messageContent = response.choices[0].message?.content;

    console.log("GPT response:", messageContent);

    // Send GPT's response as a new message
    await ctx.runMutation(api.message.sendMessage, {
      userId: "ChatGPT",
      room: roodId,
      message: messageContent || "Sorry, I don't have an answer for that.",
    });
  },
});
