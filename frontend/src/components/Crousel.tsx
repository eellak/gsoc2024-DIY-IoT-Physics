import Slider from "react-slick";
import "../App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
interface Props {
  img: string;
  name: string;
  text: string;
}

const data = [
  {
    id: "1",
    name: "Pendulum",
    detail: "This is pendulum",
  },
  {
    id: "2",
    name: "light refraction reflection",
    detail: "This is light refraction reflection",
  },
  {
    id: "3",
    name: "robotic arm",
    detail: "This is robotic arm",
  },
  {
    id: "4",
    name: "spring oscillator",
    detail: "This is spring oscillator",
  },
  {
    id: "5",
    name: "heat energy boxes",
    detail: " his is heat energy boxes",
  },
];
// {img, name, text}: Props
function Crousel() {
  const settings = {
    className: "center",
    // dots: true,
    // fade: true,
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 300,
  };

  return (
    <div className="w-11/12 m-auto ">
      <div className="mt-20">
      <Slider {...settings}>
        {data.map((d) => (
          <div className="bg-blue w-1 text-black rounded-xl">
            <div className="h-56 rounded-t-xl flex justify-center items-center bg-red-500">
              <img
                src={"./images/sensor" + d.id + ".jpg"}
                alt={d.name}
                className="object-scale-down h-[200px] w-80 rounded-xl"
              />
            </div>
            <div className="flex flex-col justify-center items-center gap-1 p-2 bg-zinc-600">
              <p className="text-sm font-semibold uppercase">{d.name}</p>
              <p className="capitalize">{d.detail}</p>
              <button className="bg-indigo-500 text-white text-lg px-6">
                Book a Slot
              </button>
            </div>
          </div>
        ))}
      </Slider>
      </div>
    </div>
  );
}

export default Crousel;
