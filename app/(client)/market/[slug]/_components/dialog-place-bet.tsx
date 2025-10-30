"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Card,
  CardBody,
  Input,
  Image,
  addToast,
} from "@heroui/react";
import { Info } from "lucide-react";
import { useFlowCurrentUser, useFlowConfig, Connect } from "@onflow/react-sdk";

import { formatNumber } from "@/lib/helper/number";
import { Market } from "@/types/market.types";
import { usePlaceBet } from "@/hooks/mutations/use-place-bet";
import { useFlowBalance } from "@/hooks/queries/use-flow-balance";
import { TRIXY_CONTRACT_ADDRESS } from "@/lib/contracts";

interface DialogPlaceBetProps {
  market?: Market;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const DialogPlaceBet = ({
  market,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
}: DialogPlaceBetProps) => {
  const disclosure = useDisclosure();
  const isOpen =
    externalIsOpen !== undefined ? externalIsOpen : disclosure.isOpen;
  const onOpenChange = externalOnOpenChange || disclosure.onOpenChange;
  const { user } = useFlowCurrentUser();
  const userAddress = user?.addr;
  const { flowNetwork } = useFlowConfig();
  const { placeBet, isPending, isSuccess, error, transactionId } =
    usePlaceBet();
  const {
    balance,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useFlowBalance();

  const [betAmount, setBetAmount] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<boolean | null>(
    null,
  );

  const network = flowNetwork || "testnet";

  useEffect(() => {
    if (isSuccess) {
      const timeoutId = setTimeout(() => {
        setBetAmount("");
        setSelectedPosition(null);
        refetchBalance();
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [isSuccess, refetchBalance]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setBetAmount("");
      setSelectedPosition(null);
    }

    onOpenChange(open);
  };

  const calculateMetrics = () => {
    const amount = parseFloat(betAmount) || 0;

    if (amount <= 0 || selectedPosition === null || !market) {
      return {
        odds: 1,
        estimatedPayout: 0,
        potentialProfit: 0,
        estimatedYield: 0,
      };
    }

    const marketProbability = market.Probability / 100;
    const probability = selectedPosition
      ? marketProbability
      : 1 - marketProbability;
    const odds = probability > 0 ? 1 / probability : 1;
    const estimatedPayout = amount * odds;
    const baseApy = parseFloat(market.yieldProtocol?.baseApy || "0") / 100;
    const now = new Date();
    const endDate = new Date(market.EndDate);
    const daysUntilEnd = Math.max(
      0,
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    const estimatedYield = amount * baseApy * (daysUntilEnd / 365);
    const potentialProfit = estimatedPayout - amount + estimatedYield;

    return {
      odds,
      estimatedPayout,
      potentialProfit,
      estimatedYield,
    };
  };

  const calculations = calculateMetrics();

  const handleAmountChange = (value: string) => {
    const cleaned = value.replace(/,/g, "").replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");

    if (parts.length > 2) return;

    setBetAmount(cleaned);
  };

  const formatDisplayValue = (value: string) => {
    if (!value) return "";

    const parts = value.split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const decimalPart = parts[1] !== undefined ? `.${parts[1]}` : "";

    return integerPart + decimalPart;
  };

  const handlePlaceBet = () => {
    if (!userAddress) {
      addToast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        color: "danger",
      });

      return;
    }

    if (!betAmount || parseFloat(betAmount) <= 0) {
      addToast({
        title: "Invalid Bet Amount",
        description: "Please enter a valid bet amount",
        color: "danger",
      });

      return;
    }

    if (selectedPosition === null) {
      addToast({
        title: "Invalid Bet Position",
        description: "Please select YES or NO",
        color: "danger",
      });

      return;
    }

    if (!market) {
      addToast({
        title: "Market Data Not Available",
        description: "Market data is not available",
        color: "danger",
      });

      return;
    }

    const betAmountNum = parseFloat(betAmount);

    if (balance < betAmountNum) {
      addToast({
        title: "Insufficient Balance",
        description: `You have ${balance.toFixed(
          2,
        )} FLOW but need ${betAmountNum.toFixed(2)} FLOW`,
        color: "danger",
      });

      return;
    }

    placeBet({
      marketCreator: TRIXY_CONTRACT_ADDRESS,
      marketId: market.ID || 0,
      option: selectedPosition ? "YES" : "NO",
      amount: betAmount,
    });
  };

  return (
    <>
      <Modal
        backdrop="opaque"
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
        isOpen={isOpen}
        size="2xl"
        onOpenChange={handleOpenChange}
      >
        <ModalContent className="bg-neutral-900">
          {(_onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white">
                Place Bet
                {market && (
                  <span className="text-sm font-normal text-neutral-400">
                    {market.Question}
                  </span>
                )}
              </ModalHeader>
              <ModalBody className="pb-6">
                <div className="flex flex-col gap-4">
                  <Card className="border border-neutral-800 bg-neutral-900/50">
                    <CardBody className="p-6">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-400">
                            Amount
                          </span>
                          <span className="text-xs text-neutral-500">
                            Balance:{" "}
                            {balanceLoading
                              ? "..."
                              : `${formatNumber(balance, {
                                  decimals: 0,
                                  thousandSeparator: ",",
                                })} FLOW`}
                          </span>
                        </div>
                        <Input
                          classNames={{
                            input: "text-3xl font-semibold",
                            inputWrapper:
                              "bg-transparent border-0 shadow-none px-0",
                          }}
                          placeholder="0.00"
                          size="lg"
                          type="text"
                          value={formatDisplayValue(betAmount)}
                          variant="faded"
                          onChange={(e) => handleAmountChange(e.target.value)}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-500">
                            ≈ $0.00
                          </span>
                          <Button
                            className="h-7 px-3 min-w-0"
                            color="default"
                            size="sm"
                            variant="flat"
                            onPress={() => {
                              if (balance > 0) {
                                const maxAmount = Math.max(0, balance - 0.01);

                                setBetAmount(maxAmount.toFixed(8));
                              }
                            }}
                          >
                            Max
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      className={`h-14 text-lg font-semibold ${
                        selectedPosition === true
                          ? "bg-blue-600 text-white"
                          : "bg-blue-600/10 text-blue-500 border border-blue-600/30"
                      }`}
                      size="lg"
                      onPress={() => setSelectedPosition(true)}
                    >
                      YES
                    </Button>
                    <Button
                      className={`h-14 text-lg font-semibold ${
                        selectedPosition === false
                          ? "bg-red-600 text-white"
                          : "bg-red-600/10 text-red-500 border border-red-600/30"
                      }`}
                      size="lg"
                      onPress={() => setSelectedPosition(false)}
                    >
                      NO
                    </Button>
                  </div>

                  <Card className="border border-neutral-800 bg-neutral-900/50">
                    <CardBody className="p-6">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-400 flex items-center gap-1">
                            Odds
                            <Info className="w-3 h-3" />
                          </span>
                          <span className="font-semibold">
                            {calculations.odds.toFixed(2)}x
                          </span>
                        </div>

                        {market && market.yieldProtocol && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-400">
                              Yield Protocol
                            </span>
                            <div className="flex items-center gap-1">
                              <Image
                                alt={market.yieldProtocol.name}
                                height={25}
                                src={market.yieldProtocol.iconUrl}
                                width={25}
                              />
                              <span className="capitalize font-medium whitespace-nowrap">
                                {market.yieldProtocol.name}
                              </span>
                            </div>
                          </div>
                        )}

                        {selectedPosition !== null &&
                          market &&
                          market.Probability > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-neutral-400">
                                Current Probability
                              </span>
                              <span className="font-semibold">
                                {market.Probability.toFixed(1)}%
                              </span>
                            </div>
                          )}

                        {selectedPosition !== null &&
                          calculations.estimatedPayout > 0 && (
                            <>
                              <div className="h-px bg-neutral-800 my-2" />

                              <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-400">
                                  Estimated Payout
                                </span>
                                <span className="font-semibold">
                                  {formatNumber(calculations.estimatedPayout, {
                                    decimals: 0,
                                    thousandSeparator: ",",
                                  })}{" "}
                                  FLOW
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-400">
                                  Protocol Yield
                                </span>
                                <span className="font-semibold">
                                  {formatNumber(calculations.estimatedYield, {
                                    decimals: 0,
                                    thousandSeparator: ",",
                                  })}{" "}
                                  FLOW
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-400">
                                  Potential Profit
                                </span>
                                <span
                                  className={
                                    calculations.potentialProfit > 0
                                      ? "font-semibold text-green-500"
                                      : "font-semibold text-neutral-500"
                                  }
                                >
                                  {calculations.potentialProfit > 0
                                    ? `+${formatNumber(
                                        calculations.potentialProfit,
                                        {
                                          decimals: 0,
                                          thousandSeparator: ",",
                                        },
                                      )} FLOW`
                                    : "0 FLOW"}
                                </span>
                              </div>
                            </>
                          )}

                        {(selectedPosition === null ||
                          !betAmount ||
                          parseFloat(betAmount) <= 0) && (
                          <div className="text-sm text-center text-neutral-500 py-4">
                            Enter an amount and select YES or NO to see payout
                            details
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>

                  {!userAddress ? (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <Connect />
                      </div>
                      <p className="text-xs text-center text-neutral-500">
                        Connect your wallet to place a bet
                      </p>
                    </div>
                  ) : (
                    selectedPosition !== null && (
                      <>
                        <Button
                          className={`h-14 text-lg font-semibold ${
                            selectedPosition === true
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-red-600 hover:bg-red-700 text-white"
                          }`}
                          disabled={
                            !betAmount ||
                            parseFloat(betAmount) <= 0 ||
                            isPending
                          }
                          size="lg"
                          onClick={handlePlaceBet}
                        >
                          {isPending
                            ? "Placing Bet..."
                            : `Place ${selectedPosition ? "YES" : "NO"} Bet`}
                        </Button>

                        {isSuccess && (
                          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium text-center">
                              Bet placed successfully!
                            </p>
                            {network !== "emulator" && transactionId && (
                              <a
                                className="text-xs text-green-600 dark:text-green-400 underline hover:no-underline block text-center mt-2"
                                href={`https://${network === "mainnet" ? "" : "testnet."}flowscan.io/transaction/${transactionId}`}
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                View on FlowScan
                              </a>
                            )}
                          </div>
                        )}

                        {error && (
                          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                            <p className="text-sm text-red-600 dark:text-red-400 text-center">
                              Transaction failed. Please try again.
                            </p>
                          </div>
                        )}
                      </>
                    )
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
