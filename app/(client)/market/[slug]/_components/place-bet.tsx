"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Info, CheckCircle2 } from "lucide-react";
import { useFlowCurrentUser, useFlowConfig, Connect } from "@onflow/react-sdk";

import { formatNumber } from "@/lib/helper/number";
import { Market } from "@/types/market.types";
import { usePlaceBet } from "@/hooks/mutations/use-place-bet";
import { useFlowBalance } from "@/hooks/queries/use-flow-balance";
import { useLatestPrice } from "@/hooks/queries/use-price";
import { flowToUsd, flowToUsdFormatted } from "@/lib/helper/price";
import { TRIXY_CONTRACT_ADDRESS } from "@/lib/contracts";

interface PlaceBetProps {
  market?: Market;
}

export function PlaceBet({ market }: PlaceBetProps) {
  const { user } = useFlowCurrentUser();
  const { flowNetwork } = useFlowConfig();
  const { placeBet, isPending, isSuccess, error, transactionId } =
    usePlaceBet();
  const {
    balance,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useFlowBalance();
  const { data: priceData } = useLatestPrice({ symbol: "FLOW" });

  const [betAmount, setBetAmount] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<boolean | null>(
    null,
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successBetDetails, setSuccessBetDetails] = useState<{
    amount: string;
    position: boolean;
    potentialProfit: number;
  } | null>(null);

  const network = flowNetwork || "testnet";

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

    const yesProbability = market.Probability / 100;
    const noProbability = 1 - yesProbability;

    const probability = selectedPosition ? yesProbability : noProbability;

    const minProbability = 0.01;
    const safeProbability = Math.max(probability, minProbability);
    const odds = 1 / safeProbability;

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
      odds: odds,
      estimatedPayout: estimatedPayout,
      potentialProfit: potentialProfit,
      estimatedYield: estimatedYield,
    };
  };

  const calculations = calculateMetrics();

  useEffect(() => {
    if (isSuccess && selectedPosition !== null && betAmount) {
      const t = setTimeout(() => {
        setSuccessBetDetails({
          amount: betAmount,
          position: selectedPosition,
          potentialProfit: calculations.potentialProfit,
        });
        setShowSuccessModal(true);
        setBetAmount("");
        setSelectedPosition(null);

        refetchBalance();
      }, 0);

      return () => clearTimeout(t);
    }
  }, [
    isSuccess,
    refetchBalance,
    betAmount,
    selectedPosition,
    calculations.potentialProfit,
  ]);

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
    if (!user) {
      alert("Please connect your wallet first");

      return;
    }

    if (!betAmount || parseFloat(betAmount) <= 0) {
      alert("Please enter a valid bet amount");

      return;
    }

    if (selectedPosition === null) {
      alert("Please select YES or NO");

      return;
    }

    if (!market) {
      alert("Market data not available");

      return;
    }

    const betAmountNum = parseFloat(betAmount);

    if (balance < betAmountNum) {
      alert(
        `Insufficient balance. You have ${balance.toFixed(2)} FLOW but need ${betAmountNum.toFixed(2)} FLOW`,
      );

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
    <div className="flex flex-col gap-4">
      <Card className="border border-neutral-800 bg-neutral-900/50">
        <CardBody className="p-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-400">Place Bet</span>
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
                inputWrapper: "bg-transparent border-0 shadow-none px-0",
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
                {betAmount && priceData?.priceUsd
                  ? `≈ ${flowToUsdFormatted(
                      parseFloat(betAmount),
                      priceData.priceUsd,
                    )}`
                  : "≈ $0.00"}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  className={`h-7 px-3 min-w-0 font-semibold text-xs ${
                    selectedPosition === true
                      ? "bg-blue-600 text-white"
                      : "bg-blue-600/10 text-blue-500 border border-blue-600/30"
                  }`}
                  size="sm"
                  onPress={() => setSelectedPosition(true)}
                >
                  YES
                </Button>
                <Button
                  className={`h-7 px-3 min-w-0 font-semibold text-xs ${
                    selectedPosition === false
                      ? "bg-red-600 text-white"
                      : "bg-red-600/10 text-red-500 border border-red-600/30"
                  }`}
                  size="sm"
                  onPress={() => setSelectedPosition(false)}
                >
                  NO
                </Button>
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
          </div>
        </CardBody>
      </Card>

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
                <span className="text-neutral-400">Yield Protocol</span>
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

            {selectedPosition !== null && market && market.Probability >= 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">Current Probability</span>
                <span className="font-semibold">
                  {selectedPosition
                    ? market.Probability.toFixed(1)
                    : (100 - market.Probability).toFixed(1)}
                  %
                </span>
              </div>
            )}

            {selectedPosition !== null && calculations.estimatedPayout > 0 && (
              <>
                <div className="h-px bg-neutral-800 my-2" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">Estimated Payout</span>
                  <span className="font-semibold">
                    {priceData?.priceUsd
                      ? formatNumber(
                          flowToUsd(
                            calculations.estimatedPayout,
                            priceData.priceUsd,
                          ),
                          {
                            decimals: 2,
                            thousandSeparator: ",",
                            prefix: "$",
                          },
                        )
                      : `${formatNumber(calculations.estimatedPayout, {
                          decimals: 0,
                          thousandSeparator: ",",
                        })} FLOW`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">Protocol Yield</span>
                  <span className="font-semibold">
                    {priceData?.priceUsd
                      ? formatNumber(
                          flowToUsd(
                            calculations.estimatedYield,
                            priceData.priceUsd,
                          ),
                          {
                            decimals: 2,
                            thousandSeparator: ",",
                            prefix: "$",
                          },
                        )
                      : `${formatNumber(calculations.estimatedYield, {
                          decimals: 0,
                          thousandSeparator: ",",
                        })} FLOW`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">Potential Profit</span>
                  <span
                    className={
                      calculations.potentialProfit > 0
                        ? "font-semibold text-green-500"
                        : "font-semibold text-neutral-500"
                    }
                  >
                    {calculations.potentialProfit > 0
                      ? priceData?.priceUsd
                        ? `+${formatNumber(
                            flowToUsd(
                              calculations.potentialProfit,
                              priceData.priceUsd,
                            ),
                            {
                              decimals: 2,
                              thousandSeparator: ",",
                              prefix: "$",
                            },
                          )}`
                        : `+${formatNumber(calculations.potentialProfit, {
                            decimals: 0,
                            thousandSeparator: ",",
                          })} FLOW`
                      : "$0.00"}
                  </span>
                </div>
              </>
            )}

            {(selectedPosition === null ||
              !betAmount ||
              parseFloat(betAmount) <= 0) && (
              <div className="text-sm text-center text-neutral-500 py-4">
                Enter an amount and select YES or NO to see payout details
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {!user ? (
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
              disabled={!betAmount || parseFloat(betAmount) <= 0 || isPending}
              size="lg"
              onClick={handlePlaceBet}
            >
              {isPending
                ? "Placing Bet..."
                : `Place ${selectedPosition ? "YES" : "NO"} Bet`}
            </Button>

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

      <Modal
        isOpen={showSuccessModal}
        placement="center"
        size="md"
        onOpenChange={setShowSuccessModal}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <span>Bet Placed Successfully!</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Amount</span>
                    <span className="font-semibold">
                      {formatNumber(
                        parseFloat(successBetDetails?.amount || "0"),
                        {
                          decimals: 2,
                          thousandSeparator: ",",
                        },
                      )}{" "}
                      FLOW
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Position</span>
                    <span
                      className={`font-semibold ${
                        successBetDetails?.position
                          ? "text-blue-500"
                          : "text-red-500"
                      }`}
                    >
                      {successBetDetails?.position ? "YES" : "NO"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Potential Profit</span>
                    <span className="font-semibold text-green-500">
                      {priceData?.priceUsd
                        ? formatNumber(
                            flowToUsd(
                              successBetDetails?.potentialProfit || 0,
                              priceData.priceUsd,
                            ),
                            {
                              decimals: 2,
                              thousandSeparator: ",",
                              prefix: "+$",
                            },
                          )
                        : `+${formatNumber(
                            successBetDetails?.potentialProfit || 0,
                            {
                              decimals: 2,
                              thousandSeparator: ",",
                            },
                          )} FLOW`}
                    </span>
                  </div>
                  {network !== "emulator" && transactionId && (
                    <a
                      className="text-sm text-blue-500 hover:text-blue-400 underline hover:no-underline text-center"
                      href={`https://${network === "mainnet" ? "" : "testnet."}flowscan.io/transaction/${transactionId}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      View on FlowScan
                    </a>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button className="w-full" color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
