import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {fetchChartData, selectChartData, updateChart} from './chartsSlice';
import styles from './Chart.module.css';

import Plot from 'react-plotly.js';
import RenderTable from './RenderTable';

export default function Clootrack() {
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(fetchChartData())
  }, [dispatch])
  const chart = useSelector(selectChartData);
    console.log('chart',chart);

    function updateData(chartIndex, valueIndex, value){
      dispatch(updateChart({chartIndex, valueIndex, value}));
    }

    return (
      <div>
          <h1>Interactive Chart Dashboard</h1>
          {
            chart.map((chartItem, index) => (
              <div key ={chartItem+index} className={styles.chartrow} >
            <Plot 
              data = {[chartItem]}
              layout={{title: chartItem.type, height: '600px'}}
            />
            {chartItem && 
            <RenderTable 
            bar={chartItem.type === 'bar'}
            chartItem={chartItem}
            chartIndex={index}
            updateData={updateData}
            />}
          </div>
            ))
          }
          
          
      </div>
    );
  }