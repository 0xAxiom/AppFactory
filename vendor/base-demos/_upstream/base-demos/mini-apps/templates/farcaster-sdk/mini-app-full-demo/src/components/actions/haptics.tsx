"use client";

import { useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { Button } from "~/components/ui/button";

export function HapticsAction() {
  const triggerImpactLight = useCallback(async (): Promise<void> => {
    await sdk.haptics.impactOccurred('light');
  }, []);

  const triggerImpactMedium = useCallback(async (): Promise<void> => {
    await sdk.haptics.impactOccurred('medium');
  }, []);

  const triggerImpactHeavy = useCallback(async (): Promise<void> => {
    await sdk.haptics.impactOccurred('heavy');
  }, []);

  const triggerImpactSoft = useCallback(async (): Promise<void> => {
    await sdk.haptics.impactOccurred('soft');
  }, []);

  const triggerImpactRigid = useCallback(async (): Promise<void> => {
    await sdk.haptics.impactOccurred('rigid');
  }, []);

  const triggerNotificationSuccess = useCallback(async (): Promise<void> => {
    await sdk.haptics.notificationOccurred('success');
  }, []);

  const triggerNotificationWarning = useCallback(async (): Promise<void> => {
    await sdk.haptics.notificationOccurred('warning');
  }, []);

  const triggerNotificationError = useCallback(async (): Promise<void> => {
    await sdk.haptics.notificationOccurred('error');
  }, []);

  const triggerSelectionChanged = useCallback(async (): Promise<void> => {
    await sdk.haptics.selectionChanged();
  }, []);

  return (
    <div className="space-y-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400">sdk.haptics</pre>
      </div>
      
      <div>
        <h3 className="font-semibold mb-3">Impact Feedback</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={triggerImpactLight}>Light</Button>
          <Button onClick={triggerImpactMedium}>Medium</Button>
          <Button onClick={triggerImpactHeavy}>Heavy</Button>
          <Button onClick={triggerImpactSoft}>Soft</Button>
          <Button onClick={triggerImpactRigid}>Rigid</Button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Notification Feedback</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={triggerNotificationSuccess}>Success</Button>
          <Button onClick={triggerNotificationWarning}>Warning</Button>
          <Button onClick={triggerNotificationError}>Error</Button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Selection Feedback</h3>
        <Button onClick={triggerSelectionChanged} className="w-full">Selection Changed</Button>
      </div>
    </div>
  );
}
