import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { Button, Card, CardFooter, CardHeader, Image } from "@heroui/react";

import { DotButton, useDotButton } from "./carousel-dot";
import { PrevButton, NextButton, usePrevNextButtons } from "./carousel-arrow";

type BannerCardProps = {
  tag: string;
  title: string;
  bgImage: string;
  avatar?: string;
  footerTitle: string;
  footerSubtitle: string;
  buttonText: string;
};

type PropType = {
  slides: BannerCardProps[];
  options?: EmblaOptionsType;
};

function BannerCard({
  tag,
  title,
  bgImage,
  avatar = "https://heroui.com/images/breathing-app-icon.jpeg",
  footerTitle,
  footerSubtitle,
  buttonText,
}: BannerCardProps) {
  return (
    <Card
      isFooterBlurred
      className="w-full h-[280px] sm:h-[300px] lg:h-80 col-span-12 sm:col-span-6 lg:col-span-4 relative"
    >
      <CardHeader className="absolute z-10 top-1 flex-col items-start px-3 sm:px-4">
        <p className="text-[10px] sm:text-tiny text-white/60 uppercase font-bold">
          {tag}
        </p>
        <h4 className="text-white/90 font-medium text-base sm:text-xl">
          {title}
        </h4>
      </CardHeader>
      <Image
        removeWrapper
        alt={`${tag} background`}
        className="z-0 w-full h-full object-cover sm:object-contain sm:scale-90"
        src={bgImage}
      />
      <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100 px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex grow gap-2 items-center min-w-0">
          <Image
            alt="footer avatar"
            className="rounded-full w-8 h-8 sm:w-10 sm:h-10 bg-black shrink-0"
            src={avatar}
          />
          <div className="flex flex-col min-w-0 flex-1">
            <p className="text-[10px] sm:text-tiny text-white/60 truncate">
              {footerTitle}
            </p>
            <p className="text-[10px] sm:text-tiny text-white/60 truncate">
              {footerSubtitle}
            </p>
          </div>
        </div>
        <Button className="shrink-0 text-xs sm:text-sm" radius="full" size="sm">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}

const CarouselBanner: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="embla">
      <div ref={emblaRef} className="embla__viewport">
        <div className="embla__container">
          {slides.map((card, index) => (
            <div key={index} className="embla__slide">
              <BannerCard {...card} />
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton disabled={prevBtnDisabled} onClick={onPrevButtonClick} />
          <NextButton disabled={nextBtnDisabled} onClick={onNextButtonClick} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              className={"embla__dot".concat(
                index === selectedIndex ? " embla__dot--selected" : "",
              )}
              onClick={() => onDotButtonClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarouselBanner;
