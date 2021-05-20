import React from 'react'
import logo from './res/logo.png'
import {Link} from 'react-router-dom';

const Footer = () => {

    return (
        <>  
                <footer className="row m-auto pt-5 pb-3">

                <div className="col-1"></div>
{/* 1 */}
                    <div className="col-12 col-lg-2 pt-4">
                        <div className="footer-item">
                            <ul className="footer-items">
                                <li className="foot-item-head mb-2"><Link to="/"> Why Surl?</Link></li>
                            </ul>
                        </div>
                    </div>
{/* 2 */}
                    <div className="col-12 col-lg-2 pt-4">
                        <div className="footer-item">
                            <ul className="footer-items">
                                <li className="foot-item-head mb-2"><Link to="/features">Features</Link></li>
                            </ul>
                        </div>
                    </div>
{/* 3 */}
                    <div className="col-12 col-lg-2 pt-4">

                        <div className="footer-item">
                            <ul className="footer-items">
                            <li className="foot-item-head mb-2">Legal</li>
                                <li className="foot-items"><a href="https://www.privacypolicygenerator.info/live.php?token=DAZ1XRv80HPCYzA3oBcLgDLnQBQfiixt" target="_blank" rel="noopener noreferrer" >Privacy Policy</a></li>
                                <li className="foot-items"><a href="https://www.termsofservicegenerator.net/live.php?token=xPIyLtyHlafRN5M66wjVk9BUl9sR0fw3" target="_blank" rel="noopener noreferrer" >Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
{/* 4 */}
                    <div className="col-12 col-lg-2 pt-4">
                        <div className="footer-item">
                            <ul className="footer-items">
                            <li className="foot-item-head mb-2">Company</li>

                                <li className="foot-items"><Link to="/team">Our Team</Link></li>
                                <li className="foot-items"><a href="https://form.jotform.com/211227617679159" target="_blank" rel="noopener noreferrer" >Contact</a></li>
                            </ul>
                        </div>
                    </div>
{/* 5 */}
                    <div className="col-12 col-lg-2 pt-4 footer-end d-none d-lg-block">
                        <div className="footer-logo">
                            <img className="foot-logo" src={logo} alt="logo" width="30%"/>
                        </div>
                        <div className="row brand mt-3 mb-3">
                            © 2021 Surl Handmade in LA, US.
                        </div>
                    </div>

                </footer>

        </>
    )
}

export default Footer
