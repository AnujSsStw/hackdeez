"use node";

import { v } from "convex/values";
import nodemailer from "nodemailer";
import { action } from "./_generated/server";
import { api, internal } from "./_generated/api";

export const sendMail = action({
  args: { email: v.string(), link: v.string() },
  handler: async (ctx, { email, link }) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const by = await ctx.auth.getUserIdentity();

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Invitation to plan a trip",
      html: `
        <p>You have been invited to plan a trip with ${by?.name}.</p>
        <p>Click <a href="${link}">here</a> to join the trip.</p>
        <p>Happy planning!</p>
        `,
    };

    // ensure name and email are included
    if (!email) {
      return {
        message: "Please submit your name and email",
      };
    }
    // send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return { message: "Error: Could not send email" };
      }

      return { message: "Email sent successfully" };
    });

    //   link is from the url
    const l = link.split("/").pop() as string;

    await ctx.runMutation(internal.map.updateMapI, {
      mapId: l,
      email: email,
    });
  },
});
