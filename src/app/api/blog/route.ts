import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        imageUrl: true,
        body: true,
        createdAt: true,
      },
    });
    return Response.json({ posts });
  } catch {
    return Response.json({ posts: [], error: "unavailable" }, { status: 200 });
  }
}
