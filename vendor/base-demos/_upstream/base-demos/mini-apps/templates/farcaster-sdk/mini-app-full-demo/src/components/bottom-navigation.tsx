"use client";

import { Tabs, TabItem } from "@worldcoin/mini-apps-ui-kit-react";
import { Settings, User, Wallet } from "iconoir-react";
import { TabType } from "~/types";
import { HapticWrapper } from "~/components/haptic-wrapper";

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border py-3">
      <div className="max-w-lg mx-auto">
        <Tabs value={activeTab}>
          <HapticWrapper onClick={() => onTabChange("actions")} hapticType="selection">
            <TabItem 
              value="actions"
              icon={<Settings width={20} height={20} />}
              label="Actions"
            />
          </HapticWrapper>
          <HapticWrapper onClick={() => onTabChange("context")} hapticType="selection">
            <TabItem 
              value="context"
              icon={<User width={20} height={20} />}
              label="Context"
            />
          </HapticWrapper>
          <HapticWrapper onClick={() => onTabChange("wallet")} hapticType="selection">
            <TabItem 
              value="wallet"
              icon={<Wallet width={20} height={20} />}
              label="Wallet"
            />
          </HapticWrapper>
        </Tabs>
      </div>
    </div>
  );
}
