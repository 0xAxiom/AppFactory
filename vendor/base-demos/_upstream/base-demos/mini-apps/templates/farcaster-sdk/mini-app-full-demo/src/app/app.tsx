"use client";

import dynamic from "next/dynamic";

const Demo = dynamic(() => import("~/components/demo"), {
  ssr: false,
});

export default function App() {
  return <Demo />;
}
