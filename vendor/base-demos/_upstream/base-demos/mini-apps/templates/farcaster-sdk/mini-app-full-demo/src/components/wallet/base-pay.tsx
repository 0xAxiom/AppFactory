"use client";

import { useState } from "react";
import { BasePayButton } from '@base-org/account-ui/react';
import { pay, getPaymentStatus } from '@base-org/account';
import { 
  Button, 
  Input
} from '@worldcoin/mini-apps-ui-kit-react';

interface PayResult {
  id?: string;
  transactionId?: string;
}

interface PaymentStatusResult {
  status?: string;
}

interface PaymentState {
  status: 'idle' | 'processing' | 'completed' | 'pending' | 'failed';
  message: string;
  transactionId?: string;
  timestamp?: Date;
}

function PaymentStatusCard({ 
  paymentState, 
  onReset 
}: { 
  paymentState: PaymentState;
  onReset: () => void;
}) {
  const getStatusVariant = (status: PaymentState['status']) => {
    switch (status) {
      case 'processing':
        return { variant: 'info' as const, icon: '⏳' };
      case 'pending':
        return { variant: 'warning' as const, icon: '🔄' };
      case 'completed':
        return { variant: 'success' as const, icon: '🎉' };
      case 'failed':
        return { variant: 'destructive' as const, icon: '❌' };
      default:
        return { variant: 'info' as const, icon: 'ℹ️' };
    }
  };

  const { variant, icon } = getStatusVariant(paymentState.status);
  const baseScanUrl = 'https://basescan.org/tx/';

  const getStatusTitle = () => {
    switch (paymentState.status) {
      case 'processing': return 'Processing Payment';
      case 'pending': return 'Payment Pending';
      case 'completed': return 'Payment Successful';
      case 'failed': return 'Payment Failed';
      default: return 'Payment Status';
    }
  };

  return (
    <div className={`p-4 rounded-lg border space-y-3 ${
      variant === 'success' ? 'bg-green-50 border-green-200' :
      variant === 'warning' ? 'bg-yellow-50 border-yellow-200' :
      variant === 'destructive' ? 'bg-red-50 border-red-200' :
      'bg-blue-50 border-blue-200'
    }`}>
      <div className="flex items-center gap-3">
        <div className="text-2xl">
          {icon}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-base mb-1">
            {getStatusTitle()}
          </div>
          <div className="text-sm leading-relaxed">
            {paymentState.message}
          </div>
        </div>
      </div>

      {paymentState.transactionId && paymentState.transactionId !== 'unknown' && (
        <>
          <div className="border-t border-current border-opacity-20 pt-2"></div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">Transaction ID:</span>
            <a 
              href={`${baseScanUrl}${paymentState.transactionId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono underline hover:no-underline truncate max-w-[200px]"
              title={paymentState.transactionId}
            >
              {`${paymentState.transactionId.slice(0, 6)}...${paymentState.transactionId.slice(-6)}`}
            </a>
          </div>
        </>
      )}

      {paymentState.timestamp && (
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="opacity-75">
            {paymentState.timestamp.toLocaleTimeString()}
          </span>
          {paymentState.status === 'pending' && (
            <span className="opacity-75 animate-pulse">
              Checking status...
            </span>
          )}
        </div>
      )}

      {paymentState.status === 'completed' && (
        <div className="text-xs bg-white/50 rounded px-2 py-1 mt-2">
          ✨ Payment confirmed on Base network. USDC transferred successfully!
        </div>
      )}

      {(paymentState.status === 'completed' || paymentState.status === 'failed') && (
        <Button
          onClick={onReset}
          variant="secondary"
          size="sm"
          className="w-full mt-3"
        >
          Make Another Payment
        </Button>
      )}
    </div>
  );
}

export function BasePay() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>({ status: 'idle', message: '' });
  const [amount, setAmount] = useState("5.00");
  
  const recipient = "0x8342A48694A74044116F330db5050a267b28dD85";

  const handlePay = async () => {
    try {
      setIsProcessing(true);
      setPaymentState({ 
        status: 'processing', 
        message: 'Initiating USDC payment on Base...',
        timestamp: new Date()
      });

      const result = await pay({
        amount: amount,
        to: recipient,
        testnet: false
      });

      const payResult = result as PayResult;
      console.log('pay result', payResult);
      const transactionId = payResult?.id || payResult?.transactionId || 'unknown';
      
      setPaymentState({
        status: 'pending',
        message: 'Payment submitted to Base network. Waiting for confirmation...',
        transactionId,
        timestamp: new Date()
      });

      const checkStatus = async () => {
        try {
          const statusResult = await getPaymentStatus({ 
            id: transactionId,
            testnet: false
          });
          
          const statusResponse = statusResult as PaymentStatusResult;
          const status = statusResponse?.status || 'unknown';
          
          if (status === 'completed') {
            setPaymentState({
              status: 'completed',
              message: 'Payment successful! USDC has been transferred on Base.',
              transactionId,
              timestamp: new Date()
            });
          } else if (status === 'pending') {
            setPaymentState({
              status: 'pending',
              message: 'Payment is being processed on the Base network...',
              transactionId,
              timestamp: new Date()
            });
            setTimeout(checkStatus, 2000);
          } else if (status === 'failed') {
            setPaymentState({
              status: 'failed',
              message: 'Payment failed. The transaction was not completed.',
              transactionId,
              timestamp: new Date()
            });
          }
        } catch (statusError) {
          console.error("Status check error:", statusError);
          setPaymentState({
            status: 'failed',
            message: 'Unable to verify payment status. Please check the transaction manually.',
            transactionId,
            timestamp: new Date()
          });
        }
      };

      setTimeout(checkStatus, 1000);

    } catch (error) {
      console.error("Payment error:", error);
      setPaymentState({
        status: 'failed',
        message: `Payment failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        timestamp: new Date()
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl">💳</div>
          <div className="flex-1">
            <div className="font-semibold text-lg">Base Pay</div>
            <div className="text-sm text-muted-foreground">One-tap USDC payments on Base</div>
          </div>
        </div>
        <div className="text-xs text-blue-600 bg-white/50 rounded px-2 py-1">
          Fast • Low fees • Fully-backed digital dollars
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-white border border-border rounded-lg">
          <div className="space-y-3">
            <label htmlFor="amount" className="block text-sm font-medium">
              Payment Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0.01"
                className="pl-8"
                disabled={isProcessing}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Payment will be made in USDC on Base network
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border border-border rounded-lg">
          <div className="space-y-2">
            <div className="text-sm font-medium">Payment Recipient</div>
            <div className="font-mono text-xs text-muted-foreground break-all">{recipient}</div>
            <div className="text-xs bg-gray-100 rounded px-2 py-1 w-fit">
              dylsteck.base.eth
            </div>
          </div>
        </div>

        <div className={isProcessing ? 'opacity-50 pointer-events-none' : ''}>
          <BasePayButton
            colorScheme="light"
            onClick={handlePay}
          />
          <div className="text-xs text-muted-foreground mt-2 text-center">
            {isProcessing ? 'Processing payment...' : 'Click to pay with Base Account'}
          </div>
        </div>

        {paymentState.status !== 'idle' && (
          <PaymentStatusCard 
            paymentState={paymentState} 
            onReset={() => setPaymentState({ status: 'idle', message: '' })}
          />
        )}
      </div>
    </div>
  );
}
