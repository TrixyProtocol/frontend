"use client";
import { useState, useMemo } from "react";
import {
  Tab,
  Tabs,
  Card,
  CardFooter,
  CardHeader,
  Image,
  Divider,
  CardBody,
  Button,
  Chip,
  Spinner,
  Pagination,
} from "@heroui/react";
import {
  ChevronDown,
  ChevronUp,
  GalleryHorizontal,
  LoaderPinwheel,
  Award,
} from "lucide-react";
import Link from "next/link";
import { useFlowCurrentUser } from "@onflow/react-sdk";

import { DialogPlaceBet } from "./dialog-place-bet";

import CarouselBanner from "@/components/carousel/carousel-banner";
import ChartChance from "@/components/chart/chart-chance";
import { formatNumber } from "@/lib/helper/number";
import { useMarkets } from "@/hooks/queries/use-market";
import { formatDate } from "@/lib/helper/date";
import { Market } from "@/types/market.types";
import { useLatestPrice } from "@/hooks/queries/use-price";
import { flowToUsd } from "@/lib/helper/price";
import { useFlowBets } from "@/hooks/queries/use-bet";
import { useClaimWinnings } from "@/hooks/mutations/use-claim-winnings";
import { TRIXY_CONTRACT_ADDRESS } from "@/lib/contracts";

export default function Dashboard() {
  const { user } = useFlowCurrentUser();
  const { data: priceData } = useLatestPrice({ symbol: "FLOW" });
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<boolean | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("trending");
  const [trendingPage, setTrendingPage] = useState(1);
  const [positionsPage, setPositionsPage] = useState(1);
  const { claimWinnings, isPending: isClaimPending } = useClaimWinnings();

  const ITEMS_PER_PAGE = 9;

  const { data: trendingMarketsData, isLoading: marketsLoading } = useMarkets({
    limit: ITEMS_PER_PAGE,
    offset: (trendingPage - 1) * ITEMS_PER_PAGE,
    status: "active",
  });

  const shouldFetchBets = selectedTab === "Your Positions" && !!user;
  const { data: userBetsData, isLoading: betsLoading } = useFlowBets(
    {
      limit: ITEMS_PER_PAGE,
      offset: (positionsPage - 1) * ITEMS_PER_PAGE,
      user: user?.addr,
    },
    shouldFetchBets,
  );
  const handleOpenDialog = (market: Market, position: boolean) => {
    setSelectedMarket(market);
    setSelectedPosition(position);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMarket(null);
    setSelectedPosition(null);
  };

  const bannerCards = [
    {
      tag: "soon",
      title: "Testnet",
      bgImage: "/images/suit/clover.png",
      footerTitle: "Join Waitlist",
      footerSubtitle: "Be the first to try new features.",
      buttonText: "Soon",
    },
    {
      tag: "community",
      title: "Join our Community",
      bgImage: "/images/suit/spade.png",
      footerTitle: "Stay tuned",
      footerSubtitle: "Check out our X to get the latest updates.",
      buttonText: "Follow",
    },
    {
      tag: "feedback",
      title: "Give us your Feedback",
      bgImage: "/images/suit/heart.png",
      footerTitle: "Any Suggestions?",
      footerSubtitle: "Let us know what you think.",
      buttonText: "Submit",
    },
    {
      tag: "bug",
      title: "Any Bugs?",
      bgImage: "/images/suit/diamond.png",
      footerTitle: "Report",
      footerSubtitle: "Help us improve by reporting bugs.",
      buttonText: "Report",
    },
  ];

  const userBets = useMemo(() => {
    return userBetsData || [];
  }, [userBetsData]);

  const { data: allMarketsData } = useMarkets({ limit: 1000 });

  const userMarkets = useMemo(() => {
    if (!allMarketsData?.data || !userBets.length) return [];
    const userMarketIds = new Set(userBets.map((bet) => bet.marketId));

    return allMarketsData.data.filter((market) =>
      market.BlockchainMarketID
        ? userMarketIds.has(market.BlockchainMarketID)
        : false,
    );
  }, [allMarketsData, userBets]);

  const trendingTotalPages = trendingMarketsData?.meta?.total
    ? Math.ceil(trendingMarketsData.meta.total / ITEMS_PER_PAGE)
    : 1;
  const positionsTotalPages = userMarkets.length
    ? Math.ceil(userMarkets.length / ITEMS_PER_PAGE)
    : 1;

  const handleClaimWinnings = (market: Market) => {
    if (!market.BlockchainMarketID) return;
    claimWinnings({
      marketCreator: TRIXY_CONTRACT_ADDRESS,
      marketId: market.BlockchainMarketID,
    });
  };

  return (
    <section className="flex flex-col gap-5 pb-10">
      <CarouselBanner options={{ loop: true }} slides={bannerCards} />
      <div className="">
        <Tabs
          aria-label="Options"
          color="primary"
          selectedKey={selectedTab}
          variant="underlined"
          onSelectionChange={(key) => setSelectedTab(key as string)}
        >
          <Tab
            key="trending"
            title={
              <div className="flex items-center space-x-2">
                <GalleryHorizontal size={20} />
                <span>Trending</span>
              </div>
            }
          />
          <Tab
            key="Your Positions"
            title={
              <div className="flex items-center space-x-2">
                <LoaderPinwheel size={20} />
                <span>Your Positions</span>
              </div>
            }
          />
        </Tabs>
      </div>

      {selectedTab === "trending" && (
        <>
          {marketsLoading ? (
            <div className="flex justify-center py-10">
              <Spinner color="white" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {trendingMarketsData?.data &&
              trendingMarketsData.data.length > 0 ? (
                trendingMarketsData.data.map((market) => {
                  return (
                    <Link key={market.MarketID} href={`/market/${market.ID}`}>
                      <Card className="w-full p-3 transition-transform duration-200 hover:-translate-y-0.5">
                        <CardHeader className="grid grid-cols-[80%_auto] items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Image
                              alt="heroui logo"
                              className="w-10 h-10 min-w-10 min-h-10"
                              height={40}
                              radius="sm"
                              src={
                                market.ImageURL ||
                                "/images/market/default-market.png"
                              }
                              width={40}
                            />
                            <span className="text-sm line-clamp-2">
                              {market.Question}
                            </span>
                          </div>
                          <div className="min-w-15">
                            <ChartChance
                              probabilityValue={market.Probability}
                            />
                          </div>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                          <div className="flex gap-2 items-center w-full z-10">
                            <Button
                              className="text-sm flex-1"
                              color="primary"
                              startContent={<ChevronUp size={18} />}
                              variant="flat"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleOpenDialog(market, true);
                              }}
                            >
                              Yes
                            </Button>
                            <Button
                              className="text-sm flex-1"
                              color="danger"
                              startContent={<ChevronDown size={18} />}
                              variant="flat"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleOpenDialog(market, false);
                              }}
                            >
                              No
                            </Button>
                          </div>
                        </CardBody>
                        <CardFooter>
                          <div className="flex gap-2 items-center w-full justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="relative w-8 h-5">
                                <Image
                                  alt="avatar-1"
                                  className="rounded-full absolute top-0 left-0 z-0"
                                  height={20}
                                  src={market.yieldProtocol?.iconUrl}
                                  width={20}
                                />
                                <Image
                                  alt="avatar-2"
                                  className="rounded-full absolute top-0 left-3 z-10"
                                  height={20}
                                  src="/images/token/flow.png"
                                  width={20}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground">
                                TVL:{" "}
                                {priceData?.priceUsd
                                  ? formatNumber(
                                      flowToUsd(
                                        parseFloat(market.TotalPoolSize),
                                        priceData.priceUsd,
                                      ),
                                      {
                                        compact: true,
                                        thousandSeparator: ",",
                                        decimals: 0,
                                        prefix: "$",
                                      },
                                    )
                                  : formatNumber(market.TotalPoolSize, {
                                      compact: true,
                                      thousandSeparator: ",",
                                      decimals: 0,
                                      suffix: " FLOW",
                                    })}
                              </span>
                            </div>
                            <span>End: {formatDate(market.EndDate)}</span>
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  );
                })
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10">
                  <p className="text-neutral-400">No markets available</p>
                </div>
              )}
            </div>
          )}
          {trendingTotalPages > 1 && !marketsLoading && (
            <div className="flex justify-center mt-4">
              <Pagination
                showControls
                color="primary"
                page={trendingPage}
                total={trendingTotalPages}
                onChange={setTrendingPage}
              />
            </div>
          )}
        </>
      )}

      {selectedTab === "Your Positions" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {!user ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10">
                <p className="text-neutral-400">
                  Connect your wallet to view your positions
                </p>
              </div>
            ) : betsLoading ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center py-10">
                <Spinner color="white" />
              </div>
            ) : userMarkets.length > 0 ? (
              userMarkets
                .slice(
                  (positionsPage - 1) * ITEMS_PER_PAGE,
                  positionsPage * ITEMS_PER_PAGE,
                )
                .map((market) => {
                  const userMarketBets = userBets.filter(
                    (bet) => bet.marketId === market.BlockchainMarketID,
                  );
                  const totalStaked = userMarketBets.reduce(
                    (sum, bet) => sum + parseFloat(bet.amount),
                    0,
                  );
                  const isResolved = market.Status === "resolved";
                  const userWon =
                    isResolved &&
                    userMarketBets.some(
                      (bet) => bet.selectedOption === market.WinningOption,
                    );

                  return (
                    <Link key={market.MarketID} href={`/market/${market.ID}`}>
                      <Card className="w-full p-3 transition-transform duration-200 hover:-translate-y-0.5">
                        <CardHeader className="grid grid-cols-[80%_auto] items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Image
                              alt="market image"
                              className="w-10 h-10 min-w-10 min-h-10"
                              height={40}
                              radius="sm"
                              src={
                                market.ImageURL ||
                                "/images/market/default-market.png"
                              }
                              width={40}
                            />
                            <span className="text-sm line-clamp-2">
                              {market.Question}
                            </span>
                          </div>
                          <div className="min-w-15">
                            {isResolved ? (
                              <Chip
                                color={userWon ? "success" : "danger"}
                                size="sm"
                                variant="flat"
                              >
                                {userWon ? "Won" : "Lost"}
                              </Chip>
                            ) : (
                              <ChartChance
                                probabilityValue={market.Probability}
                              />
                            )}
                          </div>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-neutral-400">
                                Your Bet:
                              </span>
                              <span className="font-semibold">
                                {formatNumber(totalStaked, {
                                  decimals: 2,
                                  suffix: " FLOW",
                                })}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-neutral-400">
                                Position:
                              </span>
                              <div className="flex gap-1">
                                {[
                                  ...new Set(
                                    userMarketBets.map((b) => b.selectedOption),
                                  ),
                                ].map((option) => (
                                  <Chip
                                    key={option}
                                    color={
                                      option === "YES" ? "success" : "danger"
                                    }
                                    size="sm"
                                    variant="flat"
                                  >
                                    {option}
                                  </Chip>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardBody>
                        <CardFooter>
                          {isResolved && userWon ? (
                            <Button
                              className="w-full"
                              color="success"
                              isLoading={isClaimPending}
                              startContent={<Award size={18} />}
                              variant="flat"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleClaimWinnings(market);
                              }}
                            >
                              Claim Winnings
                            </Button>
                          ) : (
                            <div className="flex gap-2 items-center w-full justify-between text-sm">
                              <span className="text-neutral-400">
                                End: {formatDate(market.EndDate)}
                              </span>
                              <Chip size="sm" variant="flat">
                                {isResolved ? "Resolved" : "Active"}
                              </Chip>
                            </div>
                          )}
                        </CardFooter>
                      </Card>
                    </Link>
                  );
                })
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10">
                <p className="text-neutral-400">
                  You haven&apos;t placed any bets yet
                </p>
              </div>
            )}
          </div>
          {positionsTotalPages > 1 && user && !betsLoading && (
            <div className="flex justify-center mt-4">
              <Pagination
                showControls
                color="primary"
                page={positionsPage}
                total={positionsTotalPages}
                onChange={setPositionsPage}
              />
            </div>
          )}
        </>
      )}

      <DialogPlaceBet
        defaultPosition={selectedPosition}
        isOpen={isDialogOpen}
        market={selectedMarket || undefined}
        onOpenChange={handleCloseDialog}
      />
    </section>
  );
}
