import React, { useEffect, useRef } from 'react';
import './Banner.css'; // hoặc bạn có thể tách ra `Banner.css`

const Banner = () => {
  const Slider1 = useRef();
  const Slider2 = useRef();

  useEffect(() => {
    let idx = 1;
    const interval = setInterval(() => {
      idx = idx % 2 + 1;
      if (idx === 1 && Slider1.current) Slider1.current.checked = true;
      if (idx === 2 && Slider2.current) Slider2.current.checked = true;
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="slider-section">
      <div className="slider pastel-box">
        <input ref={Slider1} type="radio" name="slider" id="slide1" defaultChecked />
        <input ref={Slider2} type="radio" name="slider" id="slide2" />

        <div className="slides">
          <div className="slide s1">
            <img src="/images/Slider1.png" alt="slider1" />
          </div>
          <div className="slide s2">
            <img src="/images/Slider2.png" alt="slider2" />
          </div>
        </div>

        <div className="slider-nav">
          <label htmlFor="slide1" />
          <label htmlFor="slide2" />
        </div>
      </div>
    </section>
  );
};

export default Banner;
