import { Metadata } from "next";
import App from "./app";
import { METADATA } from "~/lib/utils";

const frame = {
  version: "next",
  imageUrl: METADATA.bannerImageUrl,
  button: {
    title: "Open",
    action: {
      type: "launch_frame",
      name: METADATA.name,
      url: METADATA.homeUrl,
      splashImageUrl: METADATA.iconImageUrl,
      splashBackgroundColor: METADATA.splashBackgroundColor
    }
  }
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: METADATA.name,
    openGraph: {
      title: METADATA.name,
      description: METADATA.description,
      images: [METADATA.bannerImageUrl],
      url: METADATA.homeUrl,
      siteName: METADATA.name
    },
    other: {
      "fc:frame": JSON.stringify(frame),
      "fc:miniapp": JSON.stringify(frame),
    }
  };
}

export default function Home() {
  
  return (<App />);
}
