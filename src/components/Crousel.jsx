import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "../App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion, AnimatePresence } from "framer-motion";

const data = [
  {
    id: "1",
    name: "Light Refraction Reflection",
    detail: "This is light refraction reflection",
    color: "#10B981", // Green
  },
  {
    id: "2",
    name: "Robotic Arm",
    detail: "This is robotic arm",
    color: "#F59E0B", // Orange
  },
  {
    id: "3",
    name: "Spring Oscillator",
    detail: "This is spring oscillator",
    color: "#8B5CF6", // Purple
  },
  {
    id: "4",
    name: "Pendulum",
    detail: "This is pendulum",
    color: "#3B82F6", // Blue
  },
  {
    id: "5",
    name: "Heat Energy Boxes",
    detail: "This is heat energy boxes",
    color: "#EF4444", // Red
  },
];

const Carousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding:
      windowWidth > 1280 ? "100px" : windowWidth > 768 ? "60px" : "20px",
    slidesToShow: windowWidth > 1280 ? 3 : windowWidth > 768 ? 2 : 1,
    slidesToScroll: 1,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    swipeToSlide: true,
    focusOnSelect: true,
    cssEase: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerPadding: "15px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerPadding: "50px",
        },
      },
    ],
    beforeChange: (current, next) => setActiveSlide(next),
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-2 mb-0">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
        <span className="inline-block relative">
          <span className="relative z-10">
            Explore Our IoT Physics Equipment
          </span>
          <span className="absolute bottom-1 left-0 w-full h-3 bg-yellow-300 opacity-40 z-0"></span>
        </span>
      </h2>

      <div className="carousel-container relative">
        <Slider {...settings}>
          {data.map((d, index) => (
            <div key={d.id} className="px-3 py-4 transition-all duration-300">
              <motion.div
                initial={{ opacity: 0.5, y: 10 }}
                animate={{
                  opacity: activeSlide === index ? 1 : 0.7,
                  y: activeSlide === index ? 0 : 10,
                  scale: activeSlide === index ? 1.05 : 0.95,
                }}
                transition={{ duration: 0.4 }}
                className={`carousel-card bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 h-full`}
                style={{
                  boxShadow:
                    activeSlide === index
                      ? `0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 3px ${d.color}30`
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
              >
                <div className="relative overflow-hidden group">
                  <img
                    src={`./images/sensor${d.id}.jpg`}
                    alt={d.name}
                    className="h-64 w-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-6 flex flex-col items-center">
                  <h3 className="text-xl font-bold mb-2 text-center text-gray-800">
                    {d.name}
                  </h3>
                  <div
                    className="w-16 h-1 bg-gray-200 rounded mb-4"
                    style={{ backgroundColor: d.color }}
                  ></div>
                  <p className="text-gray-600 text-center mb-6">{d.detail}</p>

                  <Link
                    to={`/book_slot?device=${encodeURIComponent(d.name)}`}
                    className="mt-auto w-full py-3 px-6 rounded-lg text-white font-medium text-center transform transition-all duration-300 hover:scale-105 hover:shadow-md"
                    style={{
                      backgroundColor: d.color,
                      backgroundImage: `linear-gradient(to right, ${d.color}, ${d.color}DD)`,
                    }}
                  >
                    Book a Slot
                  </Link>
                </div>
              </motion.div>
            </div>
          ))}
        </Slider>

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-6">
          <div className="flex space-x-2">
            {data.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeSlide === index ? "w-6 bg-indigo-600" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
