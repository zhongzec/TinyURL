import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { isAuth, getCookie } from '../helpers/auth'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { QRCode } from 'react-qrcode-logo';
import logo from './res/logo.png'

const ShortenUrl = () => {

    const userId = isAuth() ? isAuth()._id : "";
    const subscriptionExpired = isAuth() ? isAuth().subscriptionExpired : true;
    const [url, setUrl] = useState({
        originalUrl: '',
        longUrl: '',
        shortUrl: '',
        shortUrlToShow: '',
        Copy: "Copy",
        qr: false,
    })

    const { originalUrl, longUrl, shortUrl, shortUrlToShow, Copy, qr } = url

    const handleChange = name => event => {
        setUrl({...url, [name]:event.target.value})
    }

    const generateQRCode = () => {
        setUrl({...url, qr : true})
    }

    const handleSubmit = e => {
        e.preventDefault();

        if (originalUrl) {
            axios
                .post(`${process.env.REACT_APP_API_URL}/urls`, {
                    userId, 
                    longUrl: originalUrl,
                    subscriptionExpired,
                })
                .then(response => {
                    console.log(response.data)
                    setUrl({...url, 
                        originalUrl: '', 
                        longUrl: response.data.longUrl, 
                        shortUrl: response.data.shortUrl,
                        shortUrlToShow: `${process.env.REACT_APP_API_DOMAIN}/${response.data.shortUrl}`
                    })
               })
                .catch(err => {
                    toast.error(err.response.data.errors);
                    console.log(err)
                })
            
        } else {
            toast.error("Origin url cannot be empty!");
        }
    }

    const shortenUrlArea = () => (
        <div className="shorten-url text-white pt-4 pb-5">
            <ToastContainer />
            <form>
                <div className="form-group">
                    <div className="row container m-auto">

                        <div className="col-12 col-sm-9">
                            <input type="text" className="form-control url-field" placeholder="Shorten your link" 
                                onChange={handleChange("originalUrl")} autoComplete="new-name" value= { originalUrl } />
                            <div className="sub-shorten-text float-right mt-1 mr-3 d-none d-md-block">
                                By clicking SHORTEN, you are agreeing to <span>Privacy & Terms </span>
                            </div>
                        </div>

                        <div className="col-12 col-sm-3">
                            <button className="url-btn btn btn-lg text-white" onClick={handleSubmit}>
                                Shorten   
                            </button>
                        </div>

                    </div>
                </div>

                {shortUrl && (
                    <div className="short-links container card text-dark mt-5">
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item row d-flex p-1 mt-1">
                                    <span className="col-md-5 pt-1"><a href={longUrl} target="_blank" rel="noopener noreferrer">{longUrl}</a></span>

                                    <a className="col-md-4 list-group-links pt-1" href={`${shortUrlToShow}`} target="_blank" rel="noopener noreferrer">{shortUrlToShow}</a>

                                    <span className="col-md-1">
                                        <CopyToClipboard text={shortUrlToShow}
                                            onCopy={() => setUrl({...url, Copy: "Copied"})}  type="button" 
                                            className="copy btn btn-light text-primary">
                                            <span>{Copy}</span>
                                        </CopyToClipboard>
                                    </span>


                                    { isAuth() && !isAuth().subscriptionExpired &&
                                    <span className="col-md-1">
                                        <button type="button" className="copy btn btn-light text-primary" onClick={() => generateQRCode()}>QR</button>
                                    </span>
                                    }
                                    { isAuth() && !isAuth().subscriptionExpired &&
                                    <span className="col-md-1">
                                        <Link type="button" className="copy btn btn-light text-primary" to={`/urls/${shortUrl}`} >Details</Link>
                                    </span>
                                    }
                                </li>

                                {qr && 
                                    <QRCode value={longUrl} logoImage={logo}  fgColor="#ff5349"/>
                                }

                            </ul>
                        </div>
                    </div>
                )}

            </form>
        </div>     
    )

    return (
        <>
            {shortenUrlArea()}
        </>
    )
}

export default ShortenUrl;