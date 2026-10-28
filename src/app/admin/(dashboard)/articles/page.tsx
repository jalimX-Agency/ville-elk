import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { db } from "@/lib/db/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { CreateBlogForm } from "@/components/admin/BlogForm";

export default async function ArticlesAdminPage() {
  const posts = await db.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
  const now = new Date();

  return (
    <>
      <PageHeader
        title="Articles"
        description="Le blog du site : chaque article est une page de plus sur Google, dans les quatre langues."
        action={
          <Link href="/fr/blog" target="_blank" className="admin-button-quiet">
            Voir le blog ↗
          </Link>
        }
      />

      <ul className="admin-card divide-y divide-border">
        {posts.length === 0 && <li className="p-5 text-sm text-muted-foreground">Aucun article pour le moment.</li>}
        {posts.map((post) => {
          const live = post.published && post.publishedAt <= now;
          const status = !post.published ? "Brouillon" : live ? "En ligne" : "Programmé";
          return (
            <li key={post.id}>
              <Link href={`/admin/articles/${post.id}`} className="flex items-center gap-4 p-4 hover:bg-muted sm:p-5">
                {post.imageUrl ? (
                  <Image src={post.imageUrl} alt="" width={96} height={64} className="h-16 w-24 shrink-0 rounded-md object-cover" />
                ) : (
                  <span className="h-16 w-24 shrink-0 rounded-md bg-muted" aria-hidden="true" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{post.titleFr}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {status} · {post.publishedAt.toLocaleDateString("fr-FR", { timeZone: "UTC" })}
                  </span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>

      <CreateBlogForm />
    </>
  );
}
