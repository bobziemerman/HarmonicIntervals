$(document).ready(function(){

console.log('schoolData:');
console.log(schoolData);

console.log('default schedule:');
console.log(new Schedule());

console.log('default schedule groups:');
console.log(scheduleGroupData);








//Initialize base data sets
var initialTimeslots = _.values(timeslotData);
var initialSGroups = _.values(scheduleGroupData);

//Recursive schedule-filling algorithm
var schedules = [];
fillSchedule(new Schedule(), initialTimeslots, initialSGroups);
function fillSchedule(currentSchedule, timeslotsRemaining, sGroupsRemaining){
console.log('fillSchedule');
    //Deep copy data at every loop to avoid overwrite errors
    var schedule = JSON.parse(JSON.stringify(currentSchedule));
console.log('schedule');
console.log(schedule);
    var ts = JSON.parse(JSON.stringify(timeslotsRemaining));
    var sg = JSON.parse(JSON.stringify(sGroupsRemaining));
    
    _.each(ts, function(timeslot){
        _.each(sg, function(group){
            ts.pop(timeslot);
            sg.pop(group);
            
            schedule.timeslots[timeslot.startTime].scheduleGroups.push(group);

            if(sg.length && ts.length){
                fillSchedule(schedule, ts, sg);
            } else {
                var duplicate = false;
                _.each(schedules, function(curr){
                    if(scheduleEquals(schedule, curr)){
                        duplicate = true;
                    }
                });
                if(!duplicate){
                    schedules.push(schedule);
                }
            }
            
            ts.push(timeslot);
            sg.push(group);
        });
    });
}
console.log('finished');
console.log(schedules);



function scheduleEquals(a, b){
  return (JSON.stringify(a.timeslots) === JSON.stringify(b.timeslots));
}



//Print stuff to the page TODO make pretty
$('#js-pre-output').append(JSON.stringify(


schedules


, null, 2));

});
