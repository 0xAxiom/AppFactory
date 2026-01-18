'use client';

import { useState, useEffect } from 'react';
import { useMiniKit, useIsInMiniApp } from '@coinbase/onchainkit/minikit';
import { useAccount, useBalance, useSendTransaction } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { formatDistanceToNow, format, isPast } from 'date-fns';

// Types
interface Commitment {
  id: string;
  creatorFid: number;
  creatorUsername: string;
  partnerFid: number;
  partnerUsername: string;
  goal: string;
  stakeAmount: string;
  deadline: number;
  status: 'active' | 'pending_verification' | 'completed' | 'failed';
  createdAt: number;
}

// Stake presets in ETH
const STAKE_PRESETS = ['0.001', '0.005', '0.01', '0.05'];

// Demo data for illustration
const DEMO_COMMITMENTS: Commitment[] = [
  {
    id: '1',
    creatorFid: 1234,
    creatorUsername: 'you',
    partnerFid: 5678,
    partnerUsername: 'alice',
    goal: 'Ship the landing page redesign',
    stakeAmount: '0.01',
    deadline: Date.now() + 3 * 24 * 60 * 60 * 1000,
    status: 'active',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: '2',
    creatorFid: 5678,
    creatorUsername: 'bob',
    partnerFid: 1234,
    partnerUsername: 'you',
    goal: 'Go to the gym 3 times this week',
    stakeAmount: '0.005',
    deadline: Date.now() - 1 * 24 * 60 * 60 * 1000,
    status: 'pending_verification',
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
];

export default function Home() {
  const { context } = useMiniKit();
  const { isInMiniApp } = useIsInMiniApp();
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  const [activeTab, setActiveTab] = useState<'my' | 'verify'>('my');
  const [showCreate, setShowCreate] = useState(false);
  const [commitments, setCommitments] = useState<Commitment[]>(DEMO_COMMITMENTS);

  // Create form state
  const [goal, setGoal] = useState('');
  const [stakeAmount, setStakeAmount] = useState('0.01');
  const [partnerUsername, setPartnerUsername] = useState('');
  const [deadlineDays, setDeadlineDays] = useState(7);

  const userFid = (context as any)?.user?.fid || 1234;
  const username = (context as any)?.user?.username || 'you';

  const myCommitments = commitments.filter(c => c.creatorFid === userFid);
  const verifyRequests = commitments.filter(
    c => c.partnerFid === userFid && c.status === 'pending_verification'
  );

  const handleCreateCommitment = () => {
    if (!goal || !partnerUsername) return;

    const newCommitment: Commitment = {
      id: Date.now().toString(),
      creatorFid: userFid,
      creatorUsername: username,
      partnerFid: 9999, // Would be looked up from username
      partnerUsername: partnerUsername,
      goal,
      stakeAmount,
      deadline: Date.now() + deadlineDays * 24 * 60 * 60 * 1000,
      status: 'active',
      createdAt: Date.now(),
    };

    setCommitments([newCommitment, ...commitments]);
    setShowCreate(false);
    setGoal('');
    setPartnerUsername('');
  };

  const handleVerify = (id: string, success: boolean) => {
    setCommitments(commitments.map(c =>
      c.id === id
        ? { ...c, status: success ? 'completed' : 'failed' }
        : c
    ));
  };

  // Check for deadlines and update status
  useEffect(() => {
    setCommitments(current =>
      current.map(c => {
        if (c.status === 'active' && isPast(c.deadline)) {
          return { ...c, status: 'pending_verification' };
        }
        return c;
      })
    );
  }, []);

  return (
    <main className="min-h-screen p-4 pb-24">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#10B981]">Commit</h1>
          <p className="text-sm text-[#A3A3A3]">Stake your goals</p>
        </div>
        {isConnected && balance && (
          <div className="text-right">
            <p className="text-sm text-[#A3A3A3]">Balance</p>
            <p className="font-mono font-medium">
              {parseFloat(formatEther(balance.value)).toFixed(4)} ETH
            </p>
          </div>
        )}
      </header>

      {/* Tab Navigation */}
      <div className="flex border-b border-[#262626] mb-6">
        <button
          className={`tab ${activeTab === 'my' ? 'active' : ''}`}
          onClick={() => setActiveTab('my')}
        >
          My Commitments ({myCommitments.length})
        </button>
        <button
          className={`tab ${activeTab === 'verify' ? 'active' : ''}`}
          onClick={() => setActiveTab('verify')}
        >
          Verify ({verifyRequests.length})
          {verifyRequests.length > 0 && (
            <span className="ml-2 w-2 h-2 bg-[#F59E0B] rounded-full inline-block" />
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'my' ? (
        <div className="space-y-4">
          {/* Create Button */}
          {!showCreate && (
            <button
              className="w-full btn-primary flex items-center justify-center gap-2"
              onClick={() => setShowCreate(true)}
            >
              <span className="text-xl">+</span>
              New Commitment
            </button>
          )}

          {/* Create Form */}
          {showCreate && (
            <div className="commitment-card space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">New Commitment</h3>
                <button
                  className="text-[#A3A3A3]"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
              </div>

              {/* Goal Input */}
              <div>
                <label className="text-sm text-[#A3A3A3] mb-1 block">
                  What are you committing to?
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Ship my side project by Friday"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </div>

              {/* Stake Amount */}
              <div>
                <label className="text-sm text-[#A3A3A3] mb-2 block">
                  Stake amount (ETH)
                </label>
                <div className="flex gap-2">
                  {STAKE_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      className={`stake-preset flex-1 ${stakeAmount === preset ? 'selected' : ''}`}
                      onClick={() => setStakeAmount(preset)}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Partner */}
              <div>
                <label className="text-sm text-[#A3A3A3] mb-1 block">
                  Accountability partner (username)
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="@username"
                  value={partnerUsername}
                  onChange={(e) => setPartnerUsername(e.target.value.replace('@', ''))}
                />
              </div>

              {/* Deadline */}
              <div>
                <label className="text-sm text-[#A3A3A3] mb-2 block">
                  Deadline
                </label>
                <div className="flex gap-2">
                  {[1, 3, 7, 30].map((days) => (
                    <button
                      key={days}
                      className={`stake-preset flex-1 ${deadlineDays === days ? 'selected' : ''}`}
                      onClick={() => setDeadlineDays(days)}
                    >
                      {days === 1 ? '1 day' : days === 30 ? '1 month' : `${days} days`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="p-3 rounded-lg bg-[#0A0A0A] border border-[#262626]">
                <p className="text-sm text-[#A3A3A3]">
                  You're staking <span className="text-[#10B981] font-mono">{stakeAmount} ETH</span> that
                  you'll complete this by {format(Date.now() + deadlineDays * 24 * 60 * 60 * 1000, 'MMM d, yyyy')}.
                </p>
                <p className="text-sm text-[#A3A3A3] mt-1">
                  If you fail, @{partnerUsername || 'partner'} gets 95% of your stake.
                </p>
              </div>

              {/* Submit */}
              <button
                className="w-full btn-primary"
                onClick={handleCreateCommitment}
                disabled={!goal || !partnerUsername}
              >
                Stake {stakeAmount} ETH & Commit
              </button>
            </div>
          )}

          {/* Commitments List */}
          {myCommitments.map((commitment) => (
            <CommitmentCard key={commitment.id} commitment={commitment} isOwner />
          ))}

          {myCommitments.length === 0 && !showCreate && (
            <div className="text-center py-12 text-[#A3A3A3]">
              <p className="text-4xl mb-4">🎯</p>
              <p>No active commitments</p>
              <p className="text-sm mt-1">Create one to get started!</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {verifyRequests.map((commitment) => (
            <div key={commitment.id} className="commitment-card">
              <div className="flex justify-between items-start mb-3">
                <span className="badge badge-pending">Needs Verification</span>
                <span className="font-mono text-[#F59E0B]">{commitment.stakeAmount} ETH</span>
              </div>

              <p className="font-medium mb-2">{commitment.goal}</p>
              <p className="text-sm text-[#A3A3A3] mb-4">
                @{commitment.creatorUsername} committed on {format(commitment.createdAt, 'MMM d')}
              </p>

              <div className="flex gap-2">
                <button
                  className="flex-1 btn-primary"
                  onClick={() => handleVerify(commitment.id, true)}
                >
                  ✓ They did it!
                </button>
                <button
                  className="flex-1 btn-secondary text-[#EF4444]"
                  onClick={() => handleVerify(commitment.id, false)}
                >
                  ✗ They failed
                </button>
              </div>

              <p className="text-xs text-[#A3A3A3] mt-3 text-center">
                If they failed, you receive {(parseFloat(commitment.stakeAmount) * 0.95).toFixed(4)} ETH
              </p>
            </div>
          ))}

          {verifyRequests.length === 0 && (
            <div className="text-center py-12 text-[#A3A3A3]">
              <p className="text-4xl mb-4">✅</p>
              <p>No pending verifications</p>
              <p className="text-sm mt-1">Check back when your friends' deadlines pass</p>
            </div>
          )}
        </div>
      )}

      {/* Browser Fallback */}
      {!isInMiniApp && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#171717] border-t border-[#262626]">
          <p className="text-sm text-center text-[#A3A3A3]">
            Open in Base app for full functionality
          </p>
        </div>
      )}
    </main>
  );
}

// Commitment Card Component
function CommitmentCard({
  commitment,
  isOwner = false
}: {
  commitment: Commitment;
  isOwner?: boolean;
}) {
  const isExpired = isPast(commitment.deadline);
  const statusConfig = {
    active: { badge: 'badge-active', text: 'Active' },
    pending_verification: { badge: 'badge-pending', text: 'Awaiting Verification' },
    completed: { badge: 'badge-completed', text: 'Completed' },
    failed: { badge: 'badge-failed', text: 'Failed' },
  };

  const { badge, text } = statusConfig[commitment.status];

  return (
    <div className={`commitment-card ${commitment.status}`}>
      <div className="flex justify-between items-start mb-3">
        <span className={`badge ${badge}`}>{text}</span>
        <span className="font-mono text-[#10B981]">{commitment.stakeAmount} ETH</span>
      </div>

      <p className="font-medium mb-2">{commitment.goal}</p>

      <div className="flex justify-between text-sm text-[#A3A3A3]">
        <span>Partner: @{commitment.partnerUsername}</span>
        <span>
          {commitment.status === 'active'
            ? `${formatDistanceToNow(commitment.deadline)} left`
            : `Due ${format(commitment.deadline, 'MMM d')}`
          }
        </span>
      </div>

      {commitment.status === 'completed' && (
        <div className="mt-3 p-2 rounded-lg bg-[#10B981]/10 text-center">
          <p className="text-sm text-[#10B981]">🎉 Goal achieved! Stake returned.</p>
        </div>
      )}

      {commitment.status === 'failed' && (
        <div className="mt-3 p-2 rounded-lg bg-[#EF4444]/10 text-center">
          <p className="text-sm text-[#EF4444]">Stake forfeited to @{commitment.partnerUsername}</p>
        </div>
      )}
    </div>
  );
}
