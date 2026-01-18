"use client";

import { useState } from "react";
import { Typography } from "@worldcoin/mini-apps-ui-kit-react";
import { useFrameContext } from "~/components/providers/frame-provider";

export function ContextView() {
  const frameContext = useFrameContext();
  const [isFullObjectOpen, setIsFullObjectOpen] = useState<boolean>(false);

  const toggleFullObject = (): void => {
    setIsFullObjectOpen(prev => !prev);
  };

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={toggleFullObject}
          className="flex items-center gap-2 transition-colors"
        >
          <span
            className={`transform transition-transform ${
              isFullObjectOpen ? "rotate-90" : ""
            }`}
          >
            ➤
          </span>
          Tap to see full context object
        </button>

        {isFullObjectOpen && (
          <div className="p-4 mt-2 bg-white border border-border rounded-lg">
            <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[310px] overflow-x-auto text-primary">
              {frameContext?.context ? JSON.stringify(frameContext.context, null, 2) : 'null'}
            </pre>
          </div>
        )}
      </div>
      <div className="mb-6">
        <Typography variant="heading" className="font-semibold text-foreground mb-3">isInMiniApp</Typography>
        <div className="p-4 bg-white border border-border rounded-lg">
          <span className="font-mono text-sm text-primary font-medium">
            {frameContext ? (frameContext.isInMiniApp ?? false).toString() : 'false'}
          </span>
        </div>
      </div>

      {frameContext?.context && (
        <div className="space-y-3">
          {Object.entries(frameContext.context as Record<string, unknown>).map(([key, value]) => (
            <div key={key}>
              <Typography variant="subtitle" className="font-semibold text-sm mb-2 text-foreground">{key}</Typography>
              <div className="p-3 bg-white border border-border rounded-lg">
                <pre className="font-mono text-xs text-primary whitespace-pre-wrap break-words">
                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
