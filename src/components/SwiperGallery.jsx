import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SwiperGallery = () => {
  return (
    <div className="w-full">
      <br />
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Navigation, Pagination, Autoplay]}
      >
        <SwiperSlide>
          <img src="/assets/img/0.png" alt="Imagen 1"
                className="w-full h-auto object-cover"
 />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/assets/img/1.png" alt="Imagen 2"
                className="w-full h-auto object-cover"
 />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/assets/img/2.png" alt="Imagen 3" 
                className="w-full h-auto object-cover"
/>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default SwiperGallery;
