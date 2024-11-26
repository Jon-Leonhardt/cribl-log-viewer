// ConvertToIso: takes a timestamp as input, converts it to a date object and returns it as an iso value 
function ConvertToIso(timestamp){
    const dt = new Date(timestamp); 
    return dt.toISOString(); 
  }

// aggDatesbyHour: takes a simple array of dates (rounded to the day and hour) and returns an an array of objects of each hour with its corresponding count
  function aggDatesbyHour(arr){
    const aggDates = [];
    arr.forEach((date)=>{
        if(aggDates.length === 0) aggDates.push({val:date, count:1});
        else{
            let existingDate = false;
            aggDates.forEach(d=>{
                if(d.val === date){ 
                    d.count+=1;
                    existingDate = true;
                }
            });
            if(existingDate===false) aggDates.push({val:date, count:1});  
        }
    });
    return aggDates;

  }

  // filterByDay: takes a single date and the array of all counts by hour as input and returns a slice of input array for the given filter date.
  function filterByDay(filter,arr){
    const filterDates =[];
    arr.forEach((d)=>{
        if(d.val.split(" ")[0]===filter) filterDates.push({val:d.val.split(" ")[1],count: d.count}); //

    });
    return filterDates.reverse(); // logs are already sorted in descending order, so the quick solution is to reverse the array, but for production would implement a compare function to properly sort them.
}

// getDays: takes a array of objects of hourly counts and returns a simple array of all dates represented in the original array.
function getDays(arr){
    const days =[];
    arr.forEach(d=>{
        const day = d.val.split(" ")[0];
        if(days.includes(day) === false) days.push(day)
    });
    return days.sort((a,b)=>{
      const dateA =new Date(a);
      const dateB =new Date(b);
      return dateB - dateA;
    });
  }

  // convertToHourlyDate: takes a single iso value as input and returns that value as the local date and hour represented
  function convertToHourlyDate(timestamp){
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate();
    const hour = date.getHours();
    
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:00`;
        
  }

  export{ConvertToIso,convertToHourlyDate,aggDatesbyHour,filterByDay,getDays}