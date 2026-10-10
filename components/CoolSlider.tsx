"use client"

import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { useRouter } from "next/navigation";

import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"
import {
  Autoplay,
  EffectCoverflow,
} from "swiper/modules"

interface CarouselProps {
  images: { src: string; alt: string; link?: string }[]
  autoplayDelay?: number
  showPagination?: boolean
  showNavigation?: boolean
}

export const CardCarousel: React.FC<CarouselProps> = ({
  images,
  autoplayDelay = 3000,
}) => {
	//HOOKS
	const router = useRouter();
  const css = `
  .swiper {
    width: 100%;
  }
  
  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 300px;
	height: 500px;
  }
  
  .swiper-slide img {
    display: block;
    width: 100%;
  }
  `
  return (
    <section>
      <style>{css}</style>
      <div className="mx-auto w-full rounded-[24px] p-2 md:rounded-t-[44px]">
        <div className="relative mx-auto flex w-full flex-col rounded-[24px] p-2 md:items-start md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px] md:p-2">
          <div className="flex w-full items-center justify-center gap-4">
            <div className="w-full">
              <Swiper
                spaceBetween={60}
                autoplay={{
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                }}
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={"auto"}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 2.5,
                }}
                modules={[EffectCoverflow, Autoplay]}
              >
                {images?.map((image, index) => (
                  <SwiperSlide key={index} onClick={() => {
					if (image.link) router.push(image.link);
				  }}>
                    <div
						//@ts-ignore
						style={{cornerShape: 'squircle', borderRadius: '1rem'}}
						className="size-full overflow-hidden">
                      <img
                        src={image.src}
                        className="size-full"
                        alt={image.alt}
                      />
                    </div>
                  </SwiperSlide>
                ))}
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="size-full rounded-3xl">
                      <img
                        src={image.src}
                        className="size-full rounded-xl"
                        alt={image.alt}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
