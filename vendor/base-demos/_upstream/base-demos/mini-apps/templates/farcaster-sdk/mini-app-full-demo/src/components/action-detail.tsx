"use client";

import { Button, Typography } from "@worldcoin/mini-apps-ui-kit-react";
import { ActionDefinition, ActionPageType } from "~/types";
import { GetChainsAction } from "~/components/actions/get-chains";
import { GetCapabilitiesAction } from "~/components/actions/get-capabilities";

interface ActionDetailProps {
  currentActionPage: ActionPageType;
  actionDefinitions: ActionDefinition[];
  onBack: () => void;
}

export function ActionDetail({ currentActionPage, actionDefinitions, onBack }: ActionDetailProps) {
  const currentAction = actionDefinitions.find(a => a.id === currentActionPage);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Button
          onClick={onBack}
          variant="secondary"
          size="sm"
          className="p-2"
        >
          <span className="text-muted-foreground">←</span>
        </Button>
        <Typography variant="heading" className="font-semibold text-foreground">
          {currentAction?.name}
        </Typography>
      </div>
      <div className="border border-border rounded-lg p-4 bg-white">
        {currentActionPage === "runtime" ? (
          <div className="space-y-4">
            <GetChainsAction />
            <GetCapabilitiesAction />
          </div>
        ) : (
          (() => {
            const ActionComponent = currentAction?.component;
            return ActionComponent ? <ActionComponent /> : null;
          })()
        )}
      </div>
    </div>
  );
}
