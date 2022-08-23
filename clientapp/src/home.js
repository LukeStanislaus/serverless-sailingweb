import React, {useState} from 'react'
import Slider from "react-slick"
const iconPath = process.env.PUBLIC_URL + 'assets/images/';
// check_webp_feature:
//   'feature' can be one of 'lossy', 'lossless', 'alpha' or 'animation'.
//   'callback(feature, result)' will be passed back the detection result (in an asynchronous way!)

export default () => {
    let [webp, setWebp] = useState(true)
    var img = new Image();

    img.onerror = ()=> {
        setWebp(false);
    };
    img.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";

    var settings = {
        dots: true,
        infinite: true,
        speed: 300,
        centerMode: true,
        autoplay: true,
        variableWidth: true
      };

    return <>
    
        <h1 style={{paddingTop: "20px", paddingBottom: "30px"}} align={"center"}>Welcome to Whitefriars Sailing Club!</h1>
    <Slider {...settings}><div> 
        <img src={iconPath + "carousel-1."+( webp?"webp":"png")} alt={""}/>
    </div>
    <div>
    <img src={iconPath + "carousel-2."+( webp?"webp":"png")} alt={""}/>
    </div>
    <div>
    <img src={iconPath + "carousel-3."+( webp?"webp":"png")} alt={""}/>
    </div>

    </Slider>

    <Info/>

    </>
}

const Info = () => {
    return <div>This site allows you to join, and manage, a handicap sailing race. 
        You probably want to sign on, the link is at the top!</div>
}