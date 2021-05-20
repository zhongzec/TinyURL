import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import {getCookie, isAuth} from '../helpers/auth';
import Moment from 'react-moment';

const Dashboard = () => {
  const [data, setData] = useState({
    urls: []
  });

  const {urls} = data;
  const {token} = getCookie()

  const getUrls = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/myUrls`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        let temp = []
        res.data.forEach(function (url) {
          let tmpUrl = {}
          tmpUrl["longUrl"] = url.longUrl;
          tmpUrl["shortUrl"] = url.shortUrl;
          tmpUrl["creationTime"] = url.creationTime;
          temp.push(tmpUrl);
        })
        setData({...data, urls: temp})
      })
      .catch(err => {
        console.log(err)
      })
  }
  useEffect(() => {
    getUrls();
  }, [])

  const handleDelete = (shortUrl) => {
    axios.
      delete(`${process.env.REACT_APP_API_URL}/deleteUrl/${shortUrl}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })

    const newUrls = urls.filter((url) => url.shortUrl !== shortUrl);
    setData({...data, urls: newUrls });
  }

  const dashboardSection = () => {
    return (
      <>
      <div className="shorten-url text-white pt-4 pb-5">
        <div className="short-links container card text-dark mt-5">
          <div className="card-body">
            <ul className="list-group list-group-flush">
              {urls.map(url => (
                <li className="list-group-item row d-flex p-1 mt-2" key={url.shortUrl}>
                  <span className="col-md-3 text-truncate">
                    <a href={url.longUrl} target="_blank" rel="noopener noreferrer">{url.longUrl}</a>
                  </span>

                  <span className="col-md-4">
                    <a href={`${process.env.REACT_APP_API_DOMAIN}/${url.shortUrl}`} target="_blank" rel="noopener noreferrer">
                      {`${process.env.REACT_APP_API_DOMAIN}/${url.shortUrl}`}
                    </a>
                  </span>

                  <span className="col-md-2">
                    <Link type="button" className="copy btn btn-light text-primary" to={`/urls/${url.shortUrl}`} >Details</Link>
                  </span>

                  <span className="col-md-2">
                    {<Moment format="MM-DD-YYYY">{url.creationTime}</Moment>}
                  </span>
                  
                  <span className="col-md-1"><button type="button" className="copy btn btn-light text-primary" onClick={() => handleDelete(url.shortUrl)}>Delete</button>
                  </span>
                </li>  
              ))
              }
                          
            </ul>
          </div>
        </div>
      </div>
    </>
    )
  }

  return (
    <>
      <Header />
      {!isAuth() ? <Redirect to='/login' /> : null}
      {isAuth().subscriptionExpired ? <Redirect to='/subscription' /> : null}
      {dashboardSection()}
      <Footer />
    </>
  )
}

export default Dashboard;