import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { getCookie } from '../helpers/auth';
import axios from 'axios';


const TimeTable = ({socket, url}) => {
  const [data, setData] = useState({
    lineData: {
      labels: [],
      datasets: [{
        fill: 'origin',   
        label: "hour",
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: "rgb(255, 99, 132)",
        tension: 0.1
      }]
    }
  })
  const {token} = getCookie();
  const {lineData} = data;
  const getTime = (time) => {
    var tmpData = {
      labels: [],
      datasets: [{
        fill: 'origin',   
        label: "hour",
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: "rgb(255, 99, 132)",
        tension: 0.1
      }]
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/urls/${url}/${time}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        res.data.forEach(function (item) {
          var legend = "";
          if (time === "hour") {
              if (item._id.minutes < 10) {
                  item._id.minutes = "0" + item._id.minutes;
              }
              legend = item._id.hour + ":" + item._id.minutes;
          }
          if (time === "day") {
              legend = item._id.hour + ":00";
          }
          if (time === "month") {
              legend = item._id.month + "/" + item._id.day;
          }
          tmpData.labels.push(legend);
          tmpData.datasets[0].data.push(item.count);
        });

        setData(prev => ({...prev, lineData: tmpData}))
      })
  }

  // listen for register event to initialize state
  useEffect(() => {
    getTime(lineData.datasets[0].label)
  }, []);

  // listen for update event to update state
  socket.on('shortUrlUpdated', function () {
    getTime(lineData.datasets[0].label)
  });

  return (
    <div className="row">
      <div className="col-md-2"></div>
      <div className="col-md-8 col-md-offset-2">
        <div className="card">
          <div className="card-header">
            Clicks for the past: 
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        getTime('hour')
                      }} className={ lineData.datasets[0].label === 'hour' ? null: 'text-muted' }> Hour </a>
                    <a href="#" onClick={(e) => {
                      e.preventDefault();
                      getTime('day')
                    }} className={ lineData.datasets[0].label === 'day' ? null: 'text-muted' }> Day </a>
                    <a href="#" onClick={(e) => {
                      e.preventDefault();
                      getTime('month')
                    }} className={ lineData.datasets[0].label === 'month' ? null: 'text-muted' }> Month </a>
          </div>

          <div className="card-block">
              <Line data={lineData} />
          </div>

        </div>
      </div>
    </div>
  )
}

export default TimeTable;