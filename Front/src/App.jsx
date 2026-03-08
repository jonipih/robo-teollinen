import { useState,useEffect } from 'react'
import {
  Chart as ChartJS,  CategoryScale,  LinearScale,  PointElement,  LineElement,  Title,  Tooltip,  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(  CategoryScale,  LinearScale,  PointElement,  LineElement,  Title,  Tooltip,  Legend
);






function LineChart({ mittaus_data }) {
  return (
    <div  style={{  width:"600px", height:"400px"}}>
      
      <Line
        data={{
            labels: mittaus_data.map((value, index, array)=>index),
              // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
            datasets: [
              {
                pointRadius: 0.1, // disable for a single dataset
              showLine: true, // disable for a single dataset
              borderColor:'blue',
              borderWidth:1,
              label: 'teho',
              data: mittaus_data.map((value, index, array)=>value.power)              
            }
              ]
                }}
        options={{
            animation: false,
            scales: {
          x: {
               type: 'linear',
               position: 'bottom',
               min:0, max:700
             },
          y: {
               type: 'linear',min:0,max:1000
             }
                  },
            plugins: {
              title: {
                  display: true,
                  text: "Tehonkulutus (W)"
              },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  );
}
//-----------------------------------------
function LineChartAkseli({ mittaus_data,akseli }) {
  return (
    <div  style={{  width:"600px", height:"400px"}}>
      
      <Line
        data={{
            labels: mittaus_data.map((value, index, array)=>index),
              // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
            datasets: [
              {
                pointRadius: 0.1, // disable for a single dataset
              showLine: true, // disable for a single dataset
              borderColor:'blue',
              borderWidth:1,
              label: 'kulma',
              data: mittaus_data.map((value, index, array)=>value)              
            }
              ]
                }}
        options={{
            animation: false,
            scales: {
          x: {
               type: 'linear',
               position: 'bottom',
               min:0, max:700
             },
          y: {
               type: 'linear',min:-180,max:180
             }
                  },
            plugins: {
              title: {
                  display: true,
                  text: akseli
              },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  );
}
//-------------------------------------------------------------









function App() {
  const [count, setCount] = useState(0);
  //power [{12w,1,2,3,4,5,6,7},{12w,1,2,3,4,5,6,7},{12w,1,2,3,4,5,6,7}...]
   const [mittaukset, setMittaukset] = useState([]);
   
//console.log(mittaukset.map((value, index, array)=>value.axl1));

  useEffect(() => {
    console.log("useeffect alku");
    const ws = new WebSocket('ws://localhost:3000');

    // Connection opened
    ws.onopen = () => {
      console.log("WebSocket Yhteys");
    };

    // Listen for messages
    ws.onmessage = (event) => {
      console.log("WebSocket Viesti");
      console.log(event.data);
       let data=JSON.parse(event.data); 
       console.log(typeof(event.data));
       console.log(typeof(data));
       
       setMittaukset((prev)=>prev.concat(data));
       setMittaukset((prev)=>{
        console.log(prev.length);
        if (prev.length > 700) {
          return prev.filter((value, index, array)=>index > 0);
        } else {          
          return prev;
        }
        });

    };

    return ()=>{
      console.log("effect cleanup");
    }
  },[])

  return (
    <>
      <div>
      <h2>ABB robotin teho ja akselit</h2>
         <div style={{borderStyle:"solid",display:"flex",flexWrap: "wrap"}}>
        
            <div>
          <LineChart mittaus_data={mittaukset}/>
          </div>
          
           <div>
          <LineChartAkseli mittaus_data={mittaukset.map((value, index, array)=>value.axl1)} akseli="akseli 1"/>
          </div>

           <div>
          <LineChartAkseli mittaus_data={mittaukset.map((value, index, array)=>value.axl2)} akseli="akseli 2"/>
          </div>

           <div>
          <LineChartAkseli mittaus_data={mittaukset.map((value, index, array)=>value.axl3)} akseli="akseli 3"/>
          </div>

           <div>
          <LineChartAkseli mittaus_data={mittaukset.map((value, index, array)=>value.axl4)} akseli="akseli 4"/>
          </div>

           <div>
          <LineChartAkseli mittaus_data={mittaukset.map((value, index, array)=>value.axl5)} akseli="akseli 5"/>
          </div>


      
      </div>

      
      
      </div>
     
    </>
  )
}

export default App
