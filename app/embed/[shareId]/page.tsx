import { PublicEmbedView } from "@/components/public-embed-view";

type EmbedPageProps = {
  params: Promise<{ shareId: string }>;
};

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { shareId } = await params;

  return <PublicEmbedView shareId={shareId} />;
}
