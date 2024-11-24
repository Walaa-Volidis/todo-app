import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const ZSessionClaims = z.object({
  email: z.string().email(),
  name: z.string(),
});

//const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

const isProtectedRoute = createRouteMatcher(["/", "/api(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  console.log("Middleware start ...?");
  if (isProtectedRoute(request)) {
    await auth.protect();
    //return;
  }

  const { sessionClaims } = await auth();
  const { email, name } = ZSessionClaims.parse(sessionClaims);

  console.log("email", email);
  console.log("Middleware is being called!!!");

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      email,
    },
    create: {
      name,
      email,
    },
  });
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
