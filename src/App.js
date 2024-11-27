import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import ndjsonStream from 'can-ndjson-stream';
import LogList from './components/LogList';
import Loader from './components/Loader';
import SimpleBarChart from './components/SimpleBarChart';
import Alert from './components/Alert'
import {ConvertToIso,convertToHourlyDate,aggDatesbyHour,filterByDay,getDays} from './utils.js'

const Wrapper = Styled.div`
  margin:0px;
`;

const PageTitle = Styled.h3`
  margin-top:0px;
`;
const PageHeader = Styled.header`
  padding:20px;
  background-color:rgb(32, 168, 241);
  height: 50px;
  margin-top:0px;
  vertical-align: middle;
  background-image: url('https://static.vecteezy.com/system/resources/previews/006/998/394/non_2x/blue-abstract-background-blue-background-design-abstract-futuristic-background-free-vector.jpg');
`;

const ChartSection = Styled.div`
margin-top:10px;
`;

const RowCount = Styled.h5`
margin:5px;

`;

function App() {
  const [logs,setLogs] = useState([]);
  const [logsByHour,setHourlyLogs] = useState([]);
  const [avialabeDates,setDates] = useState([]);
  const [selectedDate,setSelectedDate] = useState();
  const [loadstatus,setLoadStatus] = useState(true);
  const [loadError,setLoadError] = useState(false);
  const [width,setWidth] = useState(0);

  /* streamData: async function that fetches, parses and writes to state the NDJSON formatted log file one JSON element at a time */
  async function streamData(){
    const url = 'https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log';
    try {
    const response = await fetch(url, { responseType: 'stream' });
    if (response.ok) {
    const ndjson = ndjsonStream(response.body);
    const reader = ndjson.getReader();
    let logsTemp = []; // will store all parsed logs temporarily until after data parsing is complete and values are then stored in state.
    let timeStamps = []; // with store each individual timestamp
    let i = 0
    while(true) {
        const { done, value } = await reader.read();
        if(done) {
            break;
        }
      value.time = ConvertToIso(value._time);
      /* Note: 

        I am using a third party package here to parse the NDJSON and then serializing the log before storing it in state for
        the sake of performance even if it is negligable.  I could just parse it as text without the package, but I am reading and then adding one value
        before I serialize, so parsing as JSON first is still better in the long run

      */

      logsTemp.push({timeStamp: value.time, msg: JSON.stringify(value)}); // Storing log data as an object with two properties, timestamp and msg for the sake of efficiency.  msg is the entire log entry serialized as it is mostly used for display only, and only ever requires its structure when expanded
      timeStamps.push(convertToHourlyDate(value._time)); //saving only timestamps to later aggregate by hour and two extrapolate available days of data
      setLogs(logsTemp); // setting state, given how many times this will be called and how React naturally batches setState calls, it is better to overwrite the entire array as appending the data with previous data yields inconsistent results
      i++;
   
    }
    reader.releaseLock();
    setLoadStatus(false); //signals the end of the stream and set loading indicator to false in state.
    let totalhours = aggDatesbyHour(timeStamps); //aggregates all logs by hour and returns an array of objects of hour and count
    let listOfDays = getDays(totalhours) // gets a single array of all days represented in the logs
    setDates(listOfDays); //save the list of all days represented in the logs to state
    setSelectedDate(listOfDays[0]); // sets the currently selected day in state to the first day in the list
    setHourlyLogs(totalhours); //saves to state an array of objects of each hour of logs and their count 
  }
  else {
    setLoadError(true);
    setLoadStatus(false);
  }

}

  catch (error){
    setLoadError(true);
    setLoadStatus(false);
  }
  }

  useEffect(() => {       
    streamData();
    /* 
      Adds a listner for when the window changes sizes and sets that width in state, which is used to determine 
      the width fo the barchart and log list
    */
    window.addEventListener('resize', () =>{ 
      setWidth(window.innerWidth)
    });
    setWidth(window.innerWidth); //sets the intial width in state;
  }, []); 

  return (
    <Wrapper>
      <PageHeader><PageTitle>Cribl Log Viewer</PageTitle></PageHeader>
      {loadError&&<Alert msg='failed to fetch data' type='error' ></Alert>}
      {loadstatus&&logsByHour.length === 0?<Loader />:(
        <ChartSection>
           <label htmlFor="DaySelect">Select a Day to Display in Chart:</label>
          <select id="DaySelect" value={selectedDate} onChange={(event)=>{setSelectedDate(event.target.value)}}>
            {avialabeDates.map(d=>{
              return <option key={`day-set-${d}`} value={d}>{d}</option>
            })}
          </select> 
          <SimpleBarChart data={filterByDay(selectedDate,logsByHour)} width={width} height={200} yAxisTitle='Months' />
          </ChartSection>
      )}
      
      <RowCount>{logs.length} Records Loaded</RowCount>
      {logs.length > 0?<LogList items={logs} width={width}/>:<Loader /> }
    </Wrapper>
  );
 }

export default App;
