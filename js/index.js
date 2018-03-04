$(document).ready(function(){

console.log('schoolData:');
console.log(schoolData);

console.log('default schedule:');
console.log(new Schedule());

console.log('default schedule groups:');
console.log(scheduleGroupData);








var schedules = [];

//Algorithm
_.each(timeslotData, function(timeslot, key){
  
});






//Print stuff to the page TODO make pretty
$('#js-pre-output').append(JSON.stringify(


schedules


, null, 2));

});
