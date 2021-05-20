import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Team = () => {
  const teamSection = () => {
    return (
      <>
        <header className="bg-primary text-center py-4 mb-4">
          <div className="container">
            <h1 className="font-weight-light text-white">Meet the Team</h1>
          </div>
        </header>

        <div className="container mb-0">
          <div className="row">
            
            <div className="col-md-4">
              <div className="card border-0 shadow">
                <img src="https://miro.medium.com/max/3200/1*Iq_xUySrcOf8k4ZwSeMzDw.jpeg" className="card-img-top" alt="..." />
                <div className="card-body text-center">
                  <h5 className="card-title mb-0">Team Member</h5>
                  <div className="card-text text-black-50">Gepei Lu - Frontend</div>
                  <a href="mailto:gepeilu@usc.edu"><i className="far fa-envelope"></i> gepeilu@usc.edu</a>
                </div>

              </div>
            </div>

    
            <div className="col-md-4">
              <div className="card border-0 shadow">
                <img src="https://res.cloudinary.com/practicaldev/image/fetch/s--PPqbm-or--/c_imagga_scale,f_auto,fl_progressive,h_900,q_auto,w_1600/https://dev-to-uploads.s3.amazonaws.com/i/55cy3r93e1edalndqtli.jpeg" className="card-img-top" alt="..." />
                <div className="card-body text-center">
                  <h5 className="card-title mb-0">Team Member</h5>
                  <div className="card-text text-black-50">Shuhao Chang - Backend</div>
                  <a href="mailto:changchauncey@gmail.com"><i className="far fa-envelope"></i> changchauncey@gmail.com</a>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow">
                <img src="https://miro.medium.com/max/1400/0*tYXVdz_genOEhZCH" className="card-img-top" alt="..." />
                <div className="card-body text-center">
                  <h5 className="card-title mb-0">Team Member</h5>
                  <div className="card-text text-black-50">Zhongze Chen - Infra && AWS</div>
                  <a href="mailto:zhongzec@usc.edu"><i className="far fa-envelope"></i> zhongzec@usc.edu</a>
                </div>

              </div>
            </div>

          </div>
        </div>    
      </>
    )
  }

  return (
    <>
      <Header />
      {teamSection()}
      <Footer />
    </>
  
  )
}
export default Team;