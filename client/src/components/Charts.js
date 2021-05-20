import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Redirect, useParams} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Header from './Header';
import Footer from './Footer';
import { getCookie, isAuth } from '../helpers/auth';
import { Bar, Pie, Doughnut, PolarArea } from 'react-chartjs-2';
import io from 'socket.io-client';

import { chartData } from "./chartData";
import TimeTable from './TimeTable';
import * as d3 from "d3-scale-chromatic";

const socket = io(`${process.env.REACT_APP_API_DOMAIN}`, {
  transports: ['websocket', 'polling']
});


const Charts = () => {  
  const [data, setData] = useState({
    longUrl: "",
    shortUrl: "",
    totalClicks: 0,

    doughnutData: {},
    pieData: {},
    baseData: {},
    barData: {},
  })

  const {longUrl, shortUrl, totalClicks, doughnutData, pieData, baseData, barData} = data;
  const { url } = useParams();
  const {token} = getCookie();

  const getUrls = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/urls/${url}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {

        const {shortUrl, longUrl} = res.data;
        setData(prev => ({...prev, shortUrl, longUrl}));
      })
      .catch(err => {
        console.log(err);
        toast.error('Load Info Error');
      })
  }
  const getTotalClicks = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/urls/${url}/totalClicks`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setData(prev => ({...prev, totalClicks: res.data}))
      })
      .catch(err => {
        console.log(err);
        toast.error('Load Info Error');
      })
  }

  const renderChart = (chart, infos) => {
    var data = [];
    var labels = []

    axios
      .get(`${process.env.REACT_APP_API_URL}/urls/${url}/${infos}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        res.data.forEach(function (info) {
          data.push(info.count)
          labels.push(info._id)
        })

        if (chart === 'doughnut') {
          const temp = chartData({
            labels: labels,
            data: data,
            colorRangeInfo: {
              colorStart: 0,
              colorEnd: 1,
              useEndAsStart: true,
            },
            scale: d3.interpolateRainbow,
            dataLabel: infos,
          });
          
          setData(prev => ({
            ...prev,
            doughnutData: temp
          }))
          console.log(doughnutData)
        } else if (chart === 'pie') {
          const temp = chartData({
            labels: labels,
            data: data,
            colorRangeInfo: {
              colorStart: 0,
              colorEnd: 1,
              useEndAsStart: true,
            },
            scale: d3.interpolateSinebow,
            dataLabel: infos,
          });
          setData(prev => ({
            ...prev,
            pieData: temp
          }))
        } else if (chart === 'base') {
          const temp = chartData({
            labels: labels,
            data: data,
            colorRangeInfo: {
              colorStart: 0,
              colorEnd: 1,
              useEndAsStart: true,
            },
            scale: d3.interpolateOranges,
            dataLabel: infos,
          });

          setData(prev => ({
            ...prev,
            baseData: temp
          }))
        } else if (chart === 'bar') {
          const temp = chartData({
            labels: labels,
            data: data,
            colorRangeInfo: {
              colorStart: 0,
              colorEnd: 1,
              useEndAsStart: true,
            },
            scale: d3.interpolateTurbo,
            dataLabel: infos,
          });

          setData(prev => ({
            ...prev,
            barData: temp
          }))
        }
      })
      .catch(err => {
        console.log(err);
        toast.error('Load Info Error');
      })

  }

  const loadInfo = () => {
    getTotalClicks();
    renderChart("doughnut", "referer");
    renderChart("pie", "country");
    renderChart("base", "platform");
    renderChart("bar", "browser");
  }
  // listen for register event to initialize state
  useEffect(() => {
    getUrls();
    loadInfo();
    socket.emit('registerShortUrl', url);  
  }, []);

  // listen for update event to update state
  socket.on('shortUrlUpdated', function () {
    loadInfo();
  });

  const chartForm = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-5 col-md-offset-2">
            <div className="row">
              <h6>Long URL: </h6>
              <a href={longUrl} target="_blank" rel="noopener noreferrer">{longUrl}</a>
            </div>

            <div className="row">
                <h6>TinyURL: </h6>
                <a href={`${process.env.REACT_APP_API_DOMAIN}/${shortUrl}`} target="_blank" rel="noopener noreferrer">{`${process.env.REACT_APP_API_DOMAIN}/${shortUrl}`}</a>
            </div>

          </div>

          <div className="col-md-3">
              <div className="card">
                  <div className="card-header">Total Clicks</div>
                  <h1 className="card-block">{ totalClicks }</h1>
              </div>
          </div>
        </div>


        <TimeTable socket={socket} url={url} />


        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                Referrers
              </div>

              <div className="card-block">
                  <Doughnut data={doughnutData} width={400} height={400} options={{ maintainAspectRatio: false }}/>
              </div>
            </div>
          </div>

          <div className="col-md-6">
              <div className="card">
                  <div className="card-header">
                      Countries
                  </div>

                  <div className="card-block">
                      <Pie data={pieData} width={400} height={400} options={{ maintainAspectRatio: false }}/>
                  </div>
              </div>
          </div>
        </div>


        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                Platforms
              </div>

              <div className="card-block">
                  <PolarArea data={baseData} width={400} height={400} options={{ maintainAspectRatio: false }}/>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                Browsers
              </div>

              <div className="card-block">
                  <Bar data={barData} width={400} height={400} options={{ maintainAspectRatio: false }}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      {!isAuth() ? <Redirect to='/login' /> : null}
      {isAuth().subscriptionExpired ? <Redirect to='/subscription' /> : null}
      <ToastContainer />
        {chartForm()}
      <Footer />

    </>
  )
}

export default Charts;