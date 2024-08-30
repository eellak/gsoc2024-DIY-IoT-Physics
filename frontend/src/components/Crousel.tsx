import React from "react";
import { Link } from "react-router-dom";
import Slider, { Settings } from "react-slick";
import "../App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface CarouselItem {
  id: string;
  name: string;
  detail: string;
}

const data: CarouselItem[] = [
  {
    id: "1",
    name: "Pendulum",
    detail: "This is pendulum",
  },
  {
    id: "2",
    name: "Light Refraction Reflection",
    detail: "This is light refraction reflection",
  },
  {
    id: "3",
    name: "Robotic Arm",
    detail: "This is robotic arm",
  },
  {
    id: "4",
    name: "Spring Oscillator",
    detail: "This is spring oscillator",
  },
  {
    id: "5",
    name: "Heat Energy Boxes",
    detail: "This is heat energy boxes",
  },
];

const Crousel: React.FC = () => {
  const settings: Settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 300,
    responsive: [
      {
        breakpoint: 768, // Mobile
        settings: {
          slidesToShow: 1,
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 1024, // Tablet
        settings: {
          slidesToShow: 2,
          centerPadding: "50px",
        },
      },
    ],
    beforeChange: (current: number, next: number) => handleBeforeChange(next),
    afterChange: (current: number) => handleAfterChange(current),
  };

  const handleBeforeChange = (next: number) => {
    const slides = document.querySelectorAll(".slick-slide");
    slides.forEach((slide, index) => {
      const slideElement = slide as HTMLElement;
      if (index === next + 1) {
        slideElement.classList.add("highlighted");
      } else {
        slideElement.classList.remove("highlighted");
      }
    });
  };

  const handleAfterChange = (current: number) => {
    const slides = document.querySelectorAll(".slick-slide");
    slides.forEach((slide, index) => {
      const slideElement = slide as HTMLElement;
      if (index === current + 1) {
        slideElement.classList.add("highlighted");
        slideElement.style.zIndex = "10";
      } else {
        slideElement.classList.remove("highlighted");
        slideElement.style.zIndex = "1";
      }
    });
  };

  return (
    <div className="w-11/12 m-auto mt-20 mb-20">
      <Slider {...settings}>
        {data.map((d) => (
          <div
            key={d.id}
            className="card carousel-card bg-white shadow-lg rounded-2xl"
          >
            <img
              src={"./images/sensor" + d.id + ".jpg"}
              alt={d.name}
              className="card-img-top h-[450px] w-full object-cover rounded-t-lg"
            />
            <div className="card-body p-4 flex flex-col items-center">
              <h5 className="card-title text-center text-uppercase text-xl font-bold">
                {d.name}
              </h5>
              <p className="card-text text-center">{d.detail}</p>
              <Link
                to={`/book_slot?device=${encodeURIComponent(d.name)}`}
                className="btn btn-primary mt-4 px-4 py-2 rounded bg-indigo-500 text-white"
              >
                Book a Slot
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Crousel;
