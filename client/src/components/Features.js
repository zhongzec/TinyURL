import React from 'react';
import Header from './Header';
import Footer from './Footer';


const Features = () => {
  const featureSection = () => {
    return (
      <div className="container">
        <h1 className="text-center">Features</h1>
        <div className="row card-deck mt-5">
          <div className="card">
            <img className="card-img-top " src="https://i.morioh.com/139b757e13.png" alt="" />
            <div className="card-block">
              <h6 className="card-title mt-2">Url Shortener using MERN Stack </h6>
              <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            </div>
          </div>

          <div className="card">
            <img className="card-img-top" src="https://cdn.searchenginejournal.com/wp-content/uploads/2020/08/emoji-in-subject-lines-01-5f3fa1b665d64-1280x720.gif" alt=""  />
            <div className="card-block">
              <h6 className="card-title mt-2">Emoji Generator for Short Url</h6>
              <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            </div>
          </div>
          
          <div className="card">
            <img className="card-img-top" src="https://www.shoutmeloud.com/wp-content/uploads/2020/09/Manage-Broken-Affiliate-URLs.jpg" alt=""  />
            <div className="card-block">
              <h6 className="card-title mt-2">Url Automatic Expiration</h6>
              <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            </div>
          </div>

        </div>    

        <div className="row card-deck mt-5">
          <div className="card">
            <img className="card-img-top" src="https://i.ytimg.com/vi/Ps2oxw_bM3A/maxresdefault.jpg" alt=""  />
            <div className="card-block" >
              <h6 className="card-title mt-2">User Management System</h6>
              <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            </div>
          </div>

          <div className="card">
            <img className="card-img-top" src="https://www.freecodecamp.org/news/content/images/2021/04/image-46.png"  alt="" />
            <div className="card-block">
              <h6 className="card-title mt-2">Used Redis as Cache and Message Broker</h6>
              <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            </div>
          </div>

          <div className="card">
            <img className="card-img-top" src="https://i.postimg.cc/SRspLqFm/emitter.jpg" alt=""  />
            <div className="card-block">
              <h6 className="card-title mt-2">Real time Analysis using Socket.io</h6>
              <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            </div>
          </div>
        </div> 

        <div className="row card-deck mt-5">
          <div className="card">
            <img className="card-img-top" src="https://i.ytimg.com/vi/T3oBJyEDG3s/maxresdefault.jpg" alt=""  />
            <div className="card-block">
              <h6 className="card-title mt-2">Dockerized multiple instances using docker</h6>
              <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            </div>
          </div>

          <div className="card">
            <img className="card-img-top" src="https://raw.githubusercontent.com/sumitc91/sumitc91.github.io/master/Blogs/c9b9941f-ccf0-43b6-8c8d-af837fe0b02d.jpg" alt=""  />
            <div className="card-block">
              <h6 className="card-title mt-2">Used Nginx as Reverse Proxy/Load Balancer</h6>
              <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            </div>
          </div>

          <div className="card">
            <img className="card-img-top" src="https://i.ytimg.com/vi/GKIIL743Gjo/maxresdefault.jpg" alt=""  />
            <div className="card-block">
              <h6 className="card-title mt-2">Cloud Native app on AWS</h6>
              <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            </div>
          </div>
        </div>   
      </div>
    )
  }


  return (
    <>
      <Header />
      {featureSection()}
      
      <Footer />
    </>
  )
}

export default Features;