"use client";
import {
  Chip,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { formatDistanceToNow } from "date-fns";

import { useMarketBets } from "@/hooks/queries/use-bet";
import { formatNumber } from "@/lib/helper/number";

interface MarketActivityProps {
  marketId: number;
}

export default function MarketActivity({ marketId }: MarketActivityProps) {
  const { data: betsResponse, isLoading } = useMarketBets(marketId.toString(), {
    limit: 50,
    offset: 0,
  });

  const bets = betsResponse?.data || [];

  const formatAddress = (address: string) => {
    if (address.startsWith("0x")) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    return `@${address}`;
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Market Activity</h2>
      <Table
        aria-label="Market activity table"
        classNames={{
          base: "max-h-[400px]",
          wrapper: "bg-neutral-900/30 border border-neutral-800",
        }}
      >
        <TableHeader>
          <TableColumn>User</TableColumn>
          <TableColumn>Option</TableColumn>
          <TableColumn>Amount</TableColumn>
          <TableColumn>Time</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={"No activity yet"}
          isLoading={isLoading}
          items={bets}
          loadingContent={<Spinner color="white" />}
        >
          {(bet: any) => {
            const userId = bet.UserID || bet.userId;
            const position = bet.Position ?? bet.position;
            const selectedOption = bet.selectedOption;
            const amount = bet.Amount || bet.amount;
            const createdAt = bet.CreatedAt || bet.createdAt;

            return (
              <TableRow key={bet.ID || bet.id}>
                <TableCell>
                  <span className="font-mono text-sm">
                    {formatAddress(userId)}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip
                    className="capitalize"
                    color={
                      position === true || selectedOption === "YES"
                        ? "success"
                        : "danger"
                    }
                    size="sm"
                    variant="flat"
                  >
                    {position === true || selectedOption === "YES"
                      ? "YES"
                      : "NO"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span className="font-semibold">
                    {formatNumber(parseFloat(amount || "0"), {
                      decimals: 2,
                      thousandSeparator: ",",
                      suffix: " FLOW",
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-neutral-400">
                    {formatDistanceToNow(new Date(createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </div>
  );
}
