function Schedule(){
    
    //Initialize state
    var timeArray = [];
    _.each(timeslotData, function(value){
        timeArray.push(JSON.parse(JSON.stringify(value)));
    });
    this.timeslots = timeArray;

}
