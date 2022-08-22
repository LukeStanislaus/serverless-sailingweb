

export default (str) => {
    let negative = false
    var sec_num = parseInt(str, 10); // don't forget the second param :/
    if(sec_num <0) {sec_num = sec_num*-1
    
    negative = true}
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
  
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    let timestring  =hours+':'+minutes+':'+seconds 
    return negative? "-" +timestring: timestring;
  }