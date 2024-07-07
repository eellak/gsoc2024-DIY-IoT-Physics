import React from "react";

interface Props {
  img: string;
  name: string;
  text: string;
}
function Cards ({img, name, text}: Props){
  return (
    
    <div className="card" style={{ width: "18rem" }}>
      <img src={img} className="card-img-top" alt={name} />
      <div className="card-body">
        <h5 className="card-title text-center text-uppercase">{name}</h5>
        <p className="card-text text-center">{text}</p>
        <a href="#" className="btn btn-primary">
          Book a Slot
        </a>
      </div>
    </div>
  );
};

export default Cards;
