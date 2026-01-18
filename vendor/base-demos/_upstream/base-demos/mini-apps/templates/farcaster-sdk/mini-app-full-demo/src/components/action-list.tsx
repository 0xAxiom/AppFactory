"use client";

import { ListItem } from "@worldcoin/mini-apps-ui-kit-react";
import { ActionDefinition, ActionPageType } from "~/types";

interface ActionListProps {
  actions: ActionDefinition[];
  onActionSelect: (actionId: ActionPageType) => void;
}

export function ActionList({ actions, onActionSelect }: ActionListProps) {
  return (
    <div className="space-y-2">
      {actions.map((action) => {
        const IconComponent = action.icon;
        return (
          <ListItem
            key={action.id}
            onClick={() => onActionSelect(action.id)}
            label={action.name}
            description={action.description}
            startAdornment={<IconComponent width={20} height={20} />}
          />
        );
      })}
    </div>
  );
}
