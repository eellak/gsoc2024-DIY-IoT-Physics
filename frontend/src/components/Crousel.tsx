import React from "react";

interface Props {
    img: string;
    name: string;
    text: string;
}

function Crousel({img, name, text}: Props) {
  return (
    <div>
      <div id="carouselExampleIndicators" className="carousel slide">
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="card" style={{ width: "18rem" }}>
              <img src={img} className="card-img-top" alt={name} />
              <div className="card-body">
                <h5 className="card-title text-center text-uppercase">
                  {name}
                </h5>
                <p className="card-text text-center">{text}</p>
                <a href="#" className="btn btn-primary">
                  Book a Slot
                </a>
              </div>
            </div>
          </div>
          <div className="carousel-item">
          <div className="card" style={{ width: "18rem" }}>
              <img src={img} className="card-img-top" alt={name} />
              <div className="card-body">
                <h5 className="card-title text-center text-uppercase">
                  {name}
                </h5>
                <p className="card-text text-center">{text}</p>
                <a href="#" className="btn btn-primary">
                  Book a Slot2
                </a>
              </div>
            </div>
          </div>
          <div className="carousel-item">
          <div className="card" style={{ width: "18rem" }}>
              <img src={img} className="card-img-top" alt={name} />
              <div className="card-body">
                <h5 className="card-title text-center text-uppercase">
                  {name}
                </h5>
                <p className="card-text text-center">{text}</p>
                <a href="#" className="btn btn-primary">
                  Book a Slot3
                </a>
              </div>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

export default Crousel;
