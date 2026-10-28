import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { BlogForm } from "@/components/admin/BlogForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteBlogPost } from "@/app/admin/blog-actions";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await db.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <>
      <PageHeader
        title={post.titleFr}
        back={{ href: "/admin/articles", label: "Articles" }}
        description={post.published ? undefined : "Cet article est un brouillon : cochez « Publié sur le site » quand il est prêt."}
      />
      {/* Remounts after a save that changed the photo, so the field shows the new one. */}
      <BlogForm
        key={post.imageUrl ?? ""}
        post={{ ...post, publishedAt: post.publishedAt.toISOString().slice(0, 10) }}
      />
      <DeleteButton action={deleteBlogPost} id={post.id} what="cet article" />
    </>
  );
}
