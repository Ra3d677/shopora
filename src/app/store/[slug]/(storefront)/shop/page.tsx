import { redirect } from "next/navigation";

export default async function ShopRedirect({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  redirect(`/store/${slug}/products`);
}
