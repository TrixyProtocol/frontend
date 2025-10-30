"use client";
import Image from "next/image";
import { ChevronLeft, TimerIcon } from "lucide-react";
import { Card, CardBody, Tooltip, Button, Skeleton } from "@heroui/react";
import { useEffect, useState, useMemo } from "react";
import { marked } from "marked";
import { useRouter } from "next/navigation";

import MarketChart from "./market-chart";
import { PlaceBet } from "./place-bet";
import MarketActivity from "./market-activity";
import { DialogPlaceBet } from "./dialog-place-bet";

import { useMarket } from "@/hooks/queries/use-market";
import { formatNumber } from "@/lib/helper/number";
import { formatDate } from "@/lib/helper/date";
import { useLatestPrice } from "@/hooks/queries/use-price";
import { flowToUsd } from "@/lib/helper/price";

export default function MarketId({ id }: { id: string }) {
  const router = useRouter();

  const { data, isLoading } = useMarket(id);
  const market = data?.data;
  const { data: priceData } = useLatestPrice({ symbol: "FLOW" });

  const [expanded, setExpanded] = useState(false);
  const [html, setHtml] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const tvlDisplay = useMemo(() => {
    const totalPool = parseFloat(market?.TotalPoolSize || "0");

    if (priceData?.priceUsd) {
      return formatNumber(flowToUsd(totalPool, priceData.priceUsd), {
        decimals: 0,
        thousandSeparator: ",",
        compact: true,
        prefix: "$",
      });
    }

    return formatNumber(totalPool, {
      decimals: 0,
      thousandSeparator: ",",
      compact: true,
      suffix: " FLOW",
    });
  }, [market?.TotalPoolSize, priceData && priceData.priceUsd]);

  const yieldDisplay = useMemo(() => {
    const totalYield = parseFloat(market?.TotalYieldUntilEnd || "0");

    if (priceData?.priceUsd) {
      return formatNumber(flowToUsd(totalYield, priceData.priceUsd), {
        decimals: 0,
        thousandSeparator: ",",
        compact: true,
        prefix: "$",
      });
    }

    return formatNumber(totalYield, {
      decimals: 0,
      thousandSeparator: ",",
      compact: true,
      suffix: " FLOW",
    });
  }, [market?.TotalYieldUntilEnd, priceData && priceData.priceUsd]);

  useEffect(() => {
    const processMarkdown = async () => {
      if (market?.Description) {
        const renderer = new marked.Renderer();

        renderer.link = ({ href, title, tokens }) => {
          const text = tokens
            ? tokens.map((token: any) => token.raw || "").join("")
            : "";
          const titleAttr = title ? ` title="${title}"` : "";

          return `<a class="marked-links" href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
        };

        const processedHtml = await marked(market.Description || "", {
          renderer,
        });

        setHtml(processedHtml);
      }
    };

    processMarkdown();
  }, [market?.Description]);

  if (isLoading) {
    return (
      <section className="pb-24 xl:pb-10">
        <Skeleton className="w-20 h-6 rounded-lg mb-5" />

        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3 md:gap-5">
              <Skeleton className="w-[60px] h-[60px] rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-3/4 rounded-lg" />
                <Skeleton className="h-8 w-1/2 rounded-lg" />
              </div>
            </div>

            <div className="flex flex-col xl:grid xl:grid-cols-[1fr_384px] xl:space-x-10 gap-6 xl:gap-0">
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-6">
                  <Skeleton className="w-32 h-10 rounded-lg" />
                  <Skeleton className="w-48 h-10 rounded-lg" />
                  <Skeleton className="w-40 h-10 rounded-lg" />
                </div>

                <Card className="mb-6">
                  <CardBody className="p-6">
                    <Skeleton className="h-64 w-full rounded-lg" />
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="p-6">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full rounded-lg" />
                      <Skeleton className="h-4 w-full rounded-lg" />
                      <Skeleton className="h-4 w-3/4 rounded-lg" />
                    </div>
                  </CardBody>
                </Card>
              </div>

              <div className="hidden xl:block xl:w-96">
                <Card className="border border-neutral-800 bg-neutral-900/50">
                  <CardBody className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-32 rounded-lg" />
                      <Skeleton className="h-12 w-full rounded-lg" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 flex-1 rounded-lg" />
                        <Skeleton className="h-8 flex-1 rounded-lg" />
                        <Skeleton className="h-8 w-16 rounded-lg" />
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <Card className="border border-neutral-800 bg-neutral-900/50 mt-4">
                  <CardBody className="p-6">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full rounded-lg" />
                      <Skeleton className="h-4 w-full rounded-lg" />
                      <Skeleton className="h-4 w-full rounded-lg" />
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!market) {
    return (
      <section className="pb-10">
        <div className="flex items-center justify-center h-96">
          <div className="text-neutral-400">Market not found</div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-24 xl:pb-10">
      <button
        className="px-0 w-fit mb-5 text-default-500 text-sm flex items-center gap-1 hover:text-default-600 transition-colors cursor-pointer"
        onClick={() => router.back()}
      >
        <ChevronLeft /> Back
      </button>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div>
            <div className="flex items-center gap-3 md:gap-5">
              <Image
                alt="Market Image"
                className="rounded-xl shrink-0"
                height={60}
                src={market.ImageURL || "/placeholder-market.png"}
                width={60}
              />
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold wrap-break-words">
                  {market.Question}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex flex-col xl:grid xl:grid-cols-[1fr_384px] xl:space-x-10 gap-6 xl:gap-0">
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <Card className="w-fit border border-neutral-800 bg-neutral-900/30 h-10">
                  <CardBody className="flex flex-row items-center gap-2 text-xs md:text-sm px-3 overflow-hidden">
                    <span className="text-neutral-400">TVL</span>
                    <span className="font-medium">{tvlDisplay}</span>
                  </CardBody>
                </Card>
                <Card className="w-fit border border-neutral-800 bg-neutral-900/30 h-10">
                  <CardBody className="flex flex-row items-center gap-2 px-3 overflow-hidden">
                    <TimerIcon className="w-4 h-4 md:w-[18px] md:h-[18px] shrink-0" />
                    <span className="text-xs md:text-sm whitespace-nowrap">
                      {formatDate(market.MarketCreatedAt)} -{" "}
                      {formatDate(market.EndDate)}
                    </span>
                  </CardBody>
                </Card>
                <Tooltip
                  content={
                    <div className="px-1 py-2">
                      <span className="text-small font-bold">Total Yield</span>
                      <p className="text-tiny">
                        This is the total yield generated until the end of the
                        market.
                      </p>
                    </div>
                  }
                >
                  <Card className="w-fit border border-green-600/30 bg-green-900/20 h-10">
                    <CardBody className="flex flex-row items-center gap-2 text-green-500 text-xs md:text-sm px-3 overflow-hidden">
                      <div className="relative w-6 h-4 md:w-8 md:h-5 shrink-0">
                        <Image
                          alt="avatar-1"
                          className="rounded-full absolute top-0 left-0 z-0"
                          height={16}
                          src={
                            market.yieldProtocol?.iconUrl ||
                            "/images/token/flow.png"
                          }
                          width={16}
                        />
                        <Image
                          alt="avatar-2"
                          className="rounded-full absolute top-0 left-2 md:left-3 z-10"
                          height={16}
                          src="/images/token/flow.png"
                          width={16}
                        />
                      </div>
                      <span className="font-medium">{yieldDisplay}</span>
                    </CardBody>
                  </Card>
                </Tooltip>
              </div>

              <MarketChart marketId={id} />

              {html && (
                <div className="mt-4 md:mt-5">
                  <div
                    dangerouslySetInnerHTML={{ __html: html }}
                    className={`prose prose-blue max-w-none text-xs md:text-sm transition-all text-justify ${
                      expanded ? "" : "line-clamp-3"
                    }`}
                    style={{
                      // @ts-ignore
                      "--tw-prose-links": "#3b82f6",
                    }}
                  />
                  <button
                    className="underline text-xs md:text-sm font-medium mt-2 cursor-pointer hover:text-blue-500 transition-colors"
                    onClick={() => setExpanded(!expanded)}
                  >
                    {expanded ? "Read less" : "Read more"}
                  </button>
                </div>
              )}

              {market.BlockchainMarketID && (
                <MarketActivity marketId={market.BlockchainMarketID} />
              )}
            </div>
            <div className="hidden xl:block xl:w-96 xl:sticky xl:top-20 xl:self-start place-items-end">
              <PlaceBet isLoading={isLoading} market={market} />
            </div>
          </div>
        </div>
      </div>

      <div className="xl:hidden fixed bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black via-black/95 to-transparent z-50">
        <Button
          className="w-full h-14 text-lg font-semibold cursor-pointer"
          color="primary"
          size="lg"
          onPress={() => setIsDialogOpen(true)}
        >
          Place Bet
        </Button>
      </div>

      <DialogPlaceBet
        isOpen={isDialogOpen}
        market={market}
        onOpenChange={setIsDialogOpen}
      />
    </section>
  );
}
