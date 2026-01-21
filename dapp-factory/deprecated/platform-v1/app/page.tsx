import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">
          Build Web3 Apps.
          <br />
          Launch Tokens.
          <br />
          <span className="text-blue-500">In Minutes.</span>
        </h1>
        <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
          Generate build instructions, build locally with your own AI, upload,
          and launch. No AI costs on our side. You&apos;re in control.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/upload"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium transition"
          >
            Upload Your Build
          </Link>
          <Link
            href="/showcase"
            className="border border-zinc-700 hover:border-zinc-500 px-8 py-3 rounded-lg font-medium transition"
          >
            View Showcase
          </Link>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Step
            number={1}
            title="Generate Prompts"
            description="Run npm run generate with your app idea. Get build instructions."
          />
          <Step
            number={2}
            title="Build Locally"
            description="Use Claude or Cursor with your own API key. Build your Next.js app."
          />
          <Step
            number={3}
            title="Upload & Launch"
            description="Zip your build, upload here, fill out the form, sign, and launch!"
          />
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <Feature
          title="Zero AI Cost to Platform"
          description="You use your own Claude/Cursor/ChatGPT. We just provide the prompts."
        />
        <Feature
          title="Token Launch Included"
          description="Create your Solana token with 75/25 fee split. You keep the majority."
        />
        <Feature
          title="Instant Deployment"
          description="Your app deploys to Vercel automatically. Get a live URL in seconds."
        />
        <Feature
          title="Showcase Listing"
          description="Your app appears in our showcase. Add a custom domain anytime."
        />
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <h3 className="text-xl font-bold mb-4">Ready to build?</h3>
        <p className="text-zinc-400 mb-6">
          Start with{' '}
          <code className="bg-zinc-800 px-2 py-1 rounded">
            npm run generate &quot;your idea&quot;
          </code>
        </p>
        <Link
          href="https://github.com/your-repo/web3-factory"
          className="text-blue-500 hover:text-blue-400 underline"
        >
          View Documentation →
        </Link>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  );
}
