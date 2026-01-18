import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { displayname: string } }): Promise<Metadata> {
  const displayName = params.displayname;
  const cleanDisplayName = displayName.replace(/\s+/g, '');
  const encodedDisplayName = encodeURIComponent(cleanDisplayName);
  const blobUrl = `https://${process.env.BLOB_ACCOUNT}.public.blob.vercel-storage.com/images/${encodedDisplayName}.png`;

  const frame = {
    version: "next",
    imageUrl: blobUrl,
    button: {
      title: "Generate Zora Collage",
      action: {
        type: "launch_frame",
        name: "Launch App",
        url: process.env.NEXT_PUBLIC_URL,
        splashImageUrl: `${process.env.NEXT_PUBLIC_URL}/images/splash.png`,
        splashBackgroundColor: "#000000",
      },
    },
  };

  return {
    title: "Zora Collage",
    description: `${displayName}'s NFT Collage by Zora Mini`,
    openGraph: {
      title: "Zora Collage",
      description: `${displayName}'s NFT Collage by Zora Mini`,
      images: [{ url: blobUrl }],
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function FramePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Zora Collage Frame</h1>
       
      <p className="mt-4 text-gray-400">To see this frame, share it on Farcaster.</p>
    </main>
  );
}
