import React from 'react'
import Slider from "react-slick"

const iconPath = process.env.PUBLIC_URL + 'assets/images/';

export default () => {

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
         adaptiveHeight: true,
         centerMode: true,
         variableWidth: true,
         autoplay: true
      };

    return <><Slider {...settings}><div> 
        <img src={iconPath + "carousel-1.png"} alt={""}/>
    </div>
    <div>
    <img src={iconPath + "carousel-2.png"} alt={""}/>
    </div>
    <div>
    <img src={iconPath + "carousel-3.png"} alt={""}/>
    </div>

    </Slider>
    <h1 style={{paddingTop: "20px", paddingBottom: "30px"}} align={"center"}>Welcome to Whitefriars Sailing Club!</h1>
    <Info/>
    </>
}

const Info = () => {
    return <div align={"center"} style={{paddingLeft:"30px"}} className={"row"}>
    <div className={"col-md-3"}>
        <h2>The Club</h2>
        <ul>

            <li><a href="http://www.whitefriarssc.org/content/about.php">About Us</a></li>
            <li><a href="http://www.whitefriarssc.org/content/news.php">News</a></li>
            <li><a href="http://www.whitefriarssc.org/content/calendar.php">Calendar</a></li>
            <li><a href="http://www.whitefriarssc.org/content/join_us.php">Join Us</a></li>
            <li><a href="http://www.whitefriarssc.org/content/contacts.php">Contacts</a></li>
            <li><a href="http://www.whitefriarssc.org/content/committee.php">Committee</a></li>
            <li><a href="https://www.whitefriarssc.org/gallery/index.php">Gallery</a></li>
            <li><a href="http://www.whitefriarssc.org/content/webcam.php">Webcam</a></li>

        </ul>
    </div>
    <div className={"col-md-3"}>
        <h2>Groups</h2>
        <ul>
            <li><a href="http://www.whitefriarssc.org/content/juniors.php">Juniors</a></li>
            <li><a href="http://www.whitefriarssc.org/content/ladies.php">Ladies</a></li>
            <li><a href="http://www.whitefriarssc.org/content/sailability.php">Sailability</a></li>

        </ul>
    </div>
    <div className={"col-md-3"}>
        <h2>Training</h2>
        <ul>
            <li><a href="http://www.whitefriarssc.org/content/training.php">Courses in 2018</a></li>
            <li><a href="http://www.whitefriarssc.org/content/training_L1_L2.php">Learn To Sail</a></li>
            <li><a href="http://www.whitefriarssc.org/content/costs.php">How Much?</a></li>
        </ul>
    </div>
    <div className={"col-md-3"}>
        <h2>Sailing</h2>
        <ul>
            <li><a href="http://www.whitefriarssc.org/content/programme.php">Programme</a></li>
            <li><a href="http://www.whitefriarssc.org/content/results.php">Results</a></li>
            <li><a href="http://www.whitefriarssc.org/content/race_day_info.php">Race Info</a></li>
            <li><a href="http://www.whitefriarssc.org/content/day_visitors.php">Day Sailing</a></li>
        </ul>
    </div>
    <div className={"col-md-3"}>
        <h2>Resources</h2>
        <ul>
            <li><a href="http://www.whitefriarssc.org/content/for_sale.php">For Sale</a></li>
            <li><a href="http://www.whitefriarssc.org/content/catering.php">Catering</a></li>
            <li><a href="http://www.whitefriarssc.org/content/hireboats.php">Hire Boats</a></li>
            <li><a href="http://www.whitefriarssc.org/content/weather.php">Weather</a></li>
            <li><a href="http://www.whitefriarssc.org/content/development.php">Development Plan</a></li>
            <li><a href="http://www.whitefriarssc.org/content/newsletters.php">Newsletters</a></li>
            <li><a href="http://www.whitefriarssc.org/content/documents.php">Club Documents</a></li>
            <li><a href="http://www.whitefriarssc.org/content/links.php">Links</a></li>
        </ul>
    </div>
    <div className={"col-md-3"}>
        <h2>Members</h2>
        <ul>
            <li><a href="http://www.whitefriarssc.org/content/duty_info.php">Dutyman Intro</a></li>
            <li><a href="http://www.whitefriarssc.org/content/duty_rota.php">Dutyman</a></li>
            <li><a href="http://www.whitefriarssc.org/content/WebCol-intro.php">Update Membership</a></li>
            <li><a href="http://www.whitefriarssc.org/content/WebCol1stapplic.php">New Members</a></li>
            <li><a href="https://www.whitefriarssc.org/content/constitution.php">Constitution</a></li>
            <li><a href="http://www.whitefriarssc.org/content/rules.php">Rules</a></li>
        </ul>
    </div>
</div>
}