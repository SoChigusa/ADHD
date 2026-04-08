import { PublicShareView } from "@/components/public-share-view";

export const dynamic = "force-dynamic";

type SharePageProps = {
  params: Promise<{ shareId: string }>;
};

export default async function SharePage({ params }: SharePageProps) {
  const { shareId } = await params;

  return <PublicShareView shareId={shareId} />;
}
