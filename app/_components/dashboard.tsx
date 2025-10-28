"use client";
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
} from "@heroui/react";
import {
  ChevronDown,
  ChevronsDownUp,
  ChevronUp,
  GalleryHorizontal,
  LoaderPinwheel,
} from "lucide-react";

import DashboardBanner from "./dashboard-banner";

import ChartChance from "@/components/chart/chart-chance";
import { formatNumber } from "@/lib/helper/number";

export default function Dashboard() {
  return (
    <section className="flex flex-col gap-5">
      <DashboardBanner />
      <div className="">
        <Tabs aria-label="Options" color="primary" variant="underlined">
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
      <Card className="max-w-[400px] p-3">
        <CardHeader className="flex gap-3 items-center justify-between">
          <div className="flex items-center gap-1">
            <Image
              alt="heroui logo"
              height={40}
              radius="sm"
              src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
              width={40}
            />
            <span className="text-sm">Fed emergency rate cut in 2025?</span>
          </div>
          <ChartChance />
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex gap-2 items-center w-full">
            <Button
              className="text-sm flex-1"
              color="success"
              startContent={<ChevronUp size={18} />}
              variant="flat"
            >
              Yes
            </Button>
            <Button
              className="text-sm flex-1"
              color="warning"
              startContent={<ChevronsDownUp size={18} />}
              variant="flat"
            >
              Hedge
            </Button>
            <Button
              className="text-sm flex-1"
              color="danger"
              startContent={<ChevronDown size={18} />}
              variant="flat"
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
                  src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
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
                TVL: {formatNumber(1234567, { compact: true })}
              </span>
            </div>
            <span>End: 22/11/2025</span>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}
