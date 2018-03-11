$(document).ready(function(){

console.log('schoolData:');
console.log(schoolData);

console.log('default schedule:');
console.log(new Schedule());

console.log('default schedule groups:');
console.log(scheduleGroupData);







//Recursive schedule-filling algorithm
var schedules = [];

var timeslotPerms = permutations(_.values(timeslotData));
console.log('permuted:');
console.log(timeslotPerms);

_.each(timeslotPerms, function(perm){
    var groups = copy(_.values(scheduleGroupData));

    _.each(groups, function(group, i){
        perm[i].scheduleGroups = group;
    });

    perm.sort(function(a, b){
        if(a.startTime < b.startTime){
            return -1;
        } else if(b.startTime < a.startTime){
            return 1;
        }
        return 0;
    });
    
    schedules.push(perm);
});


console.log('generated schedules:');
console.log(schedules);









function permutations(arr){

    var permArr = [],
        usedItems = [];

    return permute(arr);

    function permute(input) {
        var i, item;
        for (i = 0; i < input.length; i++) {
            item = input.splice(i, 1)[0];
            usedItems.push(item);
            if (input.length == 0) {
                permArr.push(copy(usedItems));
            }
            permute(input);
            input.splice(i, 0, item);
            usedItems.pop();
        }

        return permArr;
    };
};

function scheduleEquals(a, b){
  return (JSON.stringify(a.timeslots) === JSON.stringify(b.timeslots));
}

function copy(obj){
  return JSON.parse(JSON.stringify(obj));
}



//Print stuff to the page TODO make pretty
$('#js-pre-output').append(JSON.stringify(


schedules


, null, 2));

});
