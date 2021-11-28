import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  chartData: [],
  status: ''
};

export const fetchChartData = createAsyncThunk('charts/fetchCharts', async () => {
  const response = fetch('https://s3-ap-southeast-1.amazonaws.com/he-public-data/chart2986176.json')
  .then(resp => resp.json())
  .then(json => {
    // console.log(json);
    return json;
  });
  return response;
});

const chartTransformed = (data) => {
  const chartTransformed = [];
    data.forEach(item => {
      let newObj = {};
      if(item.type === 'Bar') {
        newObj = {
          type: item.type.toLowerCase(),
          x: Array.from({length: item.elements.length}, (_, i) => i + 1),
          y: [...item.elements],
          values: []
        }
      } else {
        newObj = {
          type: item.type.toLowerCase(),
          values: [...item.elements],
          labels: [...item.elements],
          y:[]
        }
      }

      chartTransformed.push(newObj);
    });
    
    return chartTransformed;
}

export const chartsSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    updateData: (state, action) => {
      console.log('action', action, state);
      state.chartData = [...action.payload];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchChartData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        console.log('state', action.payload);
        state.status = 'done';
        state.chartData = chartTransformed([...action.payload]);
      });
  },
});

export const {  updateData } = chartsSlice.actions;

export const selectChartData = ({charts}) => charts.chartData;


export const updateChart = ({chartIndex, valueIndex, value}) => (dispatch, getState) => {
  let currentValue = [...selectChartData(getState())];
  let update = currentValue[chartIndex];

  if(update.type === 'bar') {
    
  let y = [...update.y];
  y[valueIndex] = parseInt(value);
  console.log('value Y',update, y );
  update = {...update, y};

  } else {
    let val = [...update.values];
    val[valueIndex] = parseInt(value);
    update = {...update, values: val};

  }
  currentValue[chartIndex] = update;
  console.log( 'current',currentValue);

    dispatch(updateData(currentValue));
  
};

export default chartsSlice.reducer;
