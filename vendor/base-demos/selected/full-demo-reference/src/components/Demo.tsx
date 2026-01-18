/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useFrameContext } from "~/components/providers/FrameProvider";
import { sdk } from "@farcaster/miniapp-sdk";
import { useAccount } from "wagmi";
import { SignInAction } from "~/components/actions/signin";
import { QuickAuthAction } from "~/components/actions/quick-auth";
import { OpenMiniAppAction } from "~/components/actions/open-miniapp";
import { OpenUrlAction } from "~/components/actions/openurl";
import { ViewProfileAction } from "~/components/actions/view-profile";
import { ViewTokenAction } from "~/components/actions/view-token";
import { SwapTokenAction } from "~/components/actions/swap-token";
import { SendTokenAction } from "~/components/actions/send-token";
import { ViewCastAction } from "~/components/actions/view-cast";
import { ComposeCastAction } from "~/components/actions/compose-cast";
import { SetPrimaryButtonAction } from "~/components/actions/set-primary-button";
import { AddMiniAppAction } from "~/components/actions/add-miniapp";
import { CloseMiniAppAction } from "~/components/actions/close-miniapp";
import { WalletConnect, SignMessage, SignSiweMessage, SendEth, SignTypedData, SwitchChain, SendTransaction } from "~/components/wallet/WalletActions";
import { BasePay } from "~/components/wallet/BasePay";
import { GetChainsAction } from "~/components/actions/get-chains";
import { GetCapabilitiesAction } from "~/components/actions/get-capabilities";
import { RequestCameraMicrophoneAction } from "~/components/actions/request-camera-microphone";
import { HapticsAction } from "~/components/actions/haptics";
import { useMiniKit } from "@coinbase/onchainkit/minikit";


type TabType = "actions" | "context" | "wallet";
type ActionPageType = "list" | "signin" | "quickauth" | "openurl" | "openminiapp" | "farcaster" | "viewprofile" | "viewtoken" | "swaptoken" | "sendtoken" | "viewcast" | "composecast" | "setprimarybutton" | "addminiapp" | "closeminiapp" | "runtime" | "requestcameramicrophone" | "haptics";
type WalletPageType = "list" | "basepay" | "wallet";

interface ActionDefinition {
  id: ActionPageType;
  name: string;
  description: string;
  component: React.ComponentType;
}

interface WalletActionDefinition {
  id: WalletPageType;
  name: string;
  description: string;
  component: React.ComponentType;
}

export default function Demo() {
  const frameContext = useFrameContext();
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<TabType>("actions");
  const [currentActionPage, setCurrentActionPage] = useState<ActionPageType>("list");
  const [currentWalletPage, setCurrentWalletPage] = useState<WalletPageType>("list");
  const [isFullObjectOpen, setIsFullObjectOpen] = useState<boolean>(false);
  const [capabilities, setCapabilities] = useState<any>(null);

  const toggleFullObject = (): void => {
    setIsFullObjectOpen(prev => !prev);
  };


  // Check capabilities on mount
  useEffect(() => {
    const getCapabilities = async () => {
      try {
        const caps = await sdk.getCapabilities();
        setCapabilities(caps);
      } catch (error) {
        console.error('Failed to get capabilities:', error);
      }
    };
    getCapabilities();
  }, []);

  // Camera/microphone feature is available if the action is supported in capabilities
  const hasCamMicFeature = Boolean(
    capabilities?.includes('actions.requestCameraAndMicrophoneAccess')
  );

  const actionDefinitions: ActionDefinition[] = [
    { id: "signin", name: "Sign In", description: "Authenticate with Farcaster", component: SignInAction },
    { id: "quickauth", name: "Quick Auth", description: "Quick authentication flow", component: QuickAuthAction },
    { id: "openminiapp", name: "Open Mini App", description: "Launch another mini app", component: OpenMiniAppAction },
    { id: "openurl", name: "Open URL", description: "Open external URLs", component: OpenUrlAction },
    { id: "viewprofile", name: "View Profile", description: "View user profiles", component: ViewProfileAction },
    { id: "viewtoken", name: "View Token", description: "Display token information", component: ViewTokenAction },
    { id: "swaptoken", name: "Swap Token", description: "Token swapping functionality", component: SwapTokenAction },
    { id: "sendtoken", name: "Send Token", description: "Send tokens to users", component: SendTokenAction },
    { id: "viewcast", name: "View Cast", description: "Display Farcaster casts", component: ViewCastAction },
    { id: "composecast", name: "Compose Cast", description: "Create new casts", component: ComposeCastAction },
    { id: "setprimarybutton", name: "Set Primary Button", description: "Configure primary button", component: SetPrimaryButtonAction },
    { id: "haptics", name: "Haptics", description: "Trigger haptic feedback", component: HapticsAction },
    ...(hasCamMicFeature
      ? [{ id: "requestcameramicrophone", name: "Camera & Microphone", description: "Request access and demo camera/mic", component: RequestCameraMicrophoneAction } satisfies ActionDefinition]
      : []),
    { id: "addminiapp", name: "Add Mini App", description: "Add this Mini App to your Farcaster client", component: AddMiniAppAction },
    { id: "closeminiapp", name: "Close Mini App", description: "Close the current Mini App", component: CloseMiniAppAction },
    { id: "runtime", name: "Runtime Detection", description: "Get chains and capabilities", component: () => null },
  ];

  const WalletActionsComponent = () => (
    <div className="space-y-4">
      <SignMessage />
      <SignSiweMessage />
      <SendEth />
      <SendTransaction />
      <SignTypedData />
      <SwitchChain />
    </div>
  );

  const walletActionDefinitions: WalletActionDefinition[] = [
    { id: "basepay", name: "Base Pay", description: "Debug Base Pay", component: BasePay },
    { id: "wallet", name: "Wallet", description: "Debug wallet interactions", component: WalletActionsComponent },
  ];

  const handleTabChange = async (tab: TabType) => {
    if (capabilities?.includes('haptics.selectionChanged')) {
      await sdk.haptics.selectionChanged();
    }

    setActiveTab(tab);
    if (tab === "actions") {
      setCurrentActionPage("list");
    } else if (tab === "wallet") {
      setCurrentWalletPage("list");
    }
  };

  const handleActionSelect = async (actionId: ActionPageType) => {
    // Add haptic feedback for action selection
    try {
      await sdk.haptics.selectionChanged();
    } catch (error) {
      console.log('Haptics not supported:', error);
    }

    setCurrentActionPage(actionId);
  };

  const handleBackToActionList = async () => {
    // Add haptic feedback for back navigation
    try {
      await sdk.haptics.impactOccurred('light');
    } catch (error) {
      console.log('Haptics not supported:', error);
    }

    setCurrentActionPage("list");
  };

  const handleWalletActionSelect = async (walletActionId: WalletPageType) => {
    // Add haptic feedback for wallet action selection
    try {
      await sdk.haptics.selectionChanged();
    } catch (error) {
      console.log('Haptics not supported:', error);
    }

    setCurrentWalletPage(walletActionId);
  };

  const handleBackToWalletList = async () => {
    // Add haptic feedback for back navigation
    try {
      await sdk.haptics.impactOccurred('light');
    } catch (error) {
      console.log('Haptics not supported:', error);
    }

    setCurrentWalletPage("list");
  };

  return (
    <div style={{ 
      marginTop: (frameContext?.context as any)?.client?.safeAreaInsets?.top ?? 0,
      marginBottom: (frameContext?.context as any)?.client?.safeAreaInsets?.bottom ?? 0,
      marginLeft: (frameContext?.context as any)?.client?.safeAreaInsets?.left ?? 0,
      marginRight: (frameContext?.context as any)?.client?.safeAreaInsets?.right ?? 0,
    }}>
      <div className="w-[95%] max-w-lg mx-auto py-4 px-4">
        <div className="mb-6 mt-3 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/base-logo.png" 
            alt="Base" 
            className="h-8 object-contain"
          />
          
          {/* Profile picture - only show if context data is available */}
          {frameContext?.context && (frameContext.context as any)?.user?.pfpUrl && (
            <button
              onClick={() => sdk.actions.viewProfile({ fid: (frameContext.context as any).user.fid })}
              className="flex-shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={(frameContext.context as any).user.pfpUrl}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
            </button>
          )}
        </div>

        <div className="mb-6 mt-4">
          <div className="flex gap-2 p-1 bg-white border border-border rounded-lg">
              <button
                onClick={() => handleTabChange("actions")}
                className={`flex-1 py-2 text-sm font-medium transition-all duration-200 rounded-md whitespace-nowrap ${
                  activeTab === "actions"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background"
                }`}
              >
                Actions
              </button>
              <button
                onClick={() => handleTabChange("context")}
                className={`flex-1 py-2 text-sm font-medium transition-all duration-200 rounded-md whitespace-nowrap ${
                  activeTab === "context"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background"
                }`}
              >
                Context
              </button>
              <button
                onClick={() => handleTabChange("wallet")}
                className={`flex-1 py-2 text-sm font-medium transition-all duration-200 rounded-md whitespace-nowrap ${
                  activeTab === "wallet"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background"
                }`}
              >
                Wallet
              </button>

          </div>
        </div>

        {activeTab === "actions" && (
          <div>
            {currentActionPage === "list" ? (
              <div className="space-y-2">
                {actionDefinitions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleActionSelect(action.id)}
                    className="w-full px-4 py-3 text-left bg-white border border-border rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                  >
                    <div>
                      <h3 className="font-normal text-foreground">{action.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={handleBackToActionList}
                    className="p-2 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <span className="text-muted-foreground">←</span>
                  </button>
                  <h2 className="font-semibold text-foreground">
                    {actionDefinitions.find(a => a.id === currentActionPage)?.name}
                  </h2>
                </div>
                <div className="border border-border rounded-lg p-4 bg-white">
                  {currentActionPage === "runtime" ? (
                    <div className="space-y-4">
                      <GetChainsAction />
                      <GetCapabilitiesAction />
                    </div>
                  ) : (
                    (() => {
                      const ActionComponent = actionDefinitions.find(a => a.id === currentActionPage)?.component;
                      return ActionComponent ? <ActionComponent /> : null;
                    })()
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "context" && (
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
              <h3 className="font-semibold text-foreground mb-3">isInMiniApp</h3>
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
                    <h4 className="font-semibold text-sm mb-2 text-foreground">{key}</h4>
                    <div className="p-3 bg-white border border-border rounded-lg">
                      <pre className="font-mono text-xs text-primary whitespace-pre-wrap break-words">
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!frameContext?.context && (
              <div className="p-4 bg-white border border-border rounded-lg">
                <span className="font-mono text-xs text-muted-foreground">
                  ⚠️ No context data available
                </span>
              </div>
            )}
          </div>
        )}

        {activeTab === "wallet" && (
          <div className="space-y-4">
            {!isConnected ? (
              <div className="text-center py-8">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Connect Your Wallet</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Connect your wallet to access all features
                  </p>
                </div>
                <WalletConnect />
              </div>
            ) : (
              <div>
                {currentWalletPage === "list" ? (
                  <div className="space-y-4">
                    {/* Connection Status */}
                    <WalletConnect />
                    
                    {/* Wallet Action Cells */}
                    <div className="space-y-2">
                      {walletActionDefinitions.map((walletAction) => (
                        <button
                          key={walletAction.id}
                          onClick={() => handleWalletActionSelect(walletAction.id)}
                          className="w-full px-4 py-3 text-left bg-white border border-border rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                        >
                          <div>
                            <h3 className="font-normal text-foreground">{walletAction.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{walletAction.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <button
                        onClick={handleBackToWalletList}
                        className="p-2 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <span className="text-muted-foreground">←</span>
                      </button>
                      <h2 className="font-semibold text-foreground">
                        {walletActionDefinitions.find(a => a.id === currentWalletPage)?.name}
                      </h2>
                    </div>
                    <div className="border border-border rounded-lg p-4 bg-white">
                      {(() => {
                        const walletAction = walletActionDefinitions.find(a => a.id === currentWalletPage);
                        if (walletAction) {
                          const Component = walletAction.component;
                          return <Component />;
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}


      </div>
    </div>
  );
}
