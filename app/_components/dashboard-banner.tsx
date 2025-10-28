import { Button, Card, CardFooter, CardHeader, Image } from "@heroui/react";

export default function DashboardBanner() {
  return (
    <div className="grid grid-cols-12 gap-5">
      <Card
        isFooterBlurred
        className="w-full h-[300px] col-span-12 sm:col-span-5"
      >
        <CardHeader className="absolute z-10 top-1 flex-col items-start">
          <p className="text-tiny text-white/60 uppercase font-bold">Soon</p>
          <h4 className="text-white font-medium text-2xl">Testnet</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Spade suit background"
          className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
          src="/images/suit/spade.png"
        />
        <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
          <div className="flex grow gap-2 items-center">
            <Image
              alt="Breathing app icon"
              className="rounded-full w-10 h-11 bg-black"
              src="https://heroui.com/images/breathing-app-icon.jpeg"
            />
            <div className="flex flex-col">
              <p className="text-tiny text-white/60">Join Testnet</p>
              <p className="text-tiny text-white/60">
                Be the first to try new features.
              </p>
            </div>
          </div>
          <Button radius="full" size="sm">
            Soon
          </Button>
        </CardFooter>
      </Card>
      <Card
        isFooterBlurred
        className="w-full h-[300px] col-span-12 sm:col-span-7"
      >
        <CardHeader className="absolute z-10 top-1 flex-col items-start">
          <p className="text-tiny text-white/60 uppercase font-bold">
            community
          </p>
          <h4 className="text-white/90 font-medium text-xl">
            Join our Community
          </h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Clover suit background"
          className="z-0 w-full h-full object-cover"
          src="/images/suit/clover.png"
        />
        <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
          <div className="flex grow gap-2 items-center">
            <Image
              alt="Breathing app icon"
              className="rounded-full w-10 h-11 bg-black"
              src="https://heroui.com/images/breathing-app-icon.jpeg"
            />
            <div className="flex flex-col">
              <p className="text-tiny text-white/60">Stay tuned</p>
              <p className="text-tiny text-white/60">
                Check out our X to get the latest updates.
              </p>
            </div>
          </div>
          <Button radius="full" size="sm">
            Follow
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
