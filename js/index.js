$(document).ready(function(){

console.log('schoolData:');
console.log(schoolData);

console.log('default schedule groups:');
console.log(scheduleGroupData);







//Create all schedule permutations
var schedules = [];
var timeslotPerms = permutations(_.values(timeslotData));

_.each(timeslotPerms, function(perm){
    var groupsCopy = copy(_.values(scheduleGroupData));

    //Remove empty schedule groups
    var groups = [];
    _.each(groupsCopy, function(group){
        if(group.instrumentGroups.length){
            groups.push(group);
        }
    });

    _.each(groups, function(group, i){
        perm[i].scheduleGroups.push(group);
    });

    perm.sort(function(a, b){
        if(a.startTime < b.startTime){
            return -1;
        } else if(b.startTime < a.startTime){
            return 1;
        }
        return 0;
    });
    
    schedules.push({"timeslots": perm});
});

//Score schedules
console.log(schedules);
_.each(schedules, function(schedule){ 
    schedule.score = 100;
    schedule.errMsg = "";
    schedule = score(schedule);
});

//Remove IGs with 0 scores
var validSchedules = [];
_.each(schedules, function(schedule){
    if(schedule.score){
        validSchedules.push(schedule);
    }
});
schedules = validSchedules;

//Sort scored schedules
schedules.sort(function(a,b){
    if(a.score > b.score){
        return -1;
    } else if(a.score < b.score){
        return 1;
    }
    return 0;
});



/** Helper functions **/


//Scoring function
function score(schedule){
    // ----- Missing or double-scheduled groups of students
    var allIGCopy = copy(instrumentGroupData);
    var allIG = {};
    _.each(allIGCopy, function(value, key){
        allIG[value.name] = value;
        allIG[value.name].present = 0;
    });
    
    _.each(schedule.timeslots, function(timeslot){
        _.each(timeslot.scheduleGroups, function(sg){
            _.each(sg.instrumentGroups, function(ig){
                allIG[ig.name].present++;
            });
        });
    });

    _.each(allIG, function(ig){
        if(ig.present === 0){
            schedule.score = 0;
            schedule.errMsg = "The '"+ig.name+"' instrument group was not scheduled";
        } else if(ig.present > 1){
            schedule.score = 0;
            schedule.errMsg = "The '"+ig.name+"' instrument group was scheduled more than once";
        }
    });

    // ----- During grade's lunch
    if(schedule.score > 0){
        _.each(schedule.timeslots, function(timeslot){
            _.each(timeslot.scheduleGroups, function(sg){
                _.each(sg.instrumentGroups, function(ig){
                    _.each(ig.grades, function(grade){
                        if(timeslot.lunchGrades.indexOf(grade) > -1){
                            schedule.score = 0;
                            schedule.errMsg = "The '"+ig.name+"' instrument group was scheduled during lunch";
                        }
                    });
                });
            });
        });
    }

    // --- During Grade's recess
    if(schedule.score > 0){
        _.each(schedule.timeslots, function(timeslot){
            _.each(timeslot.scheduleGroups, function(sg){
                _.each(sg.instrumentGroups, function(ig){
                    _.each(ig.grades, function(grade){
                        if(timeslot.recessGrades.indexOf(grade) > -1){
                            schedule.score -= 20;
                            schedule.duringRecess = true;
                        }
                    });
                });
            });
        });
    }

    // --- Missed math last week (TG only)
    if(schedule.score > 0){
        _.each(schedule.timeslots, function(timeslot){
            _.each(timeslot.scheduleGroups, function(sg){
                _.each(sg.instrumentGroups, function(ig){
                    _.each(ig.grades, function(grade){
                        if(timeslot.mathGrades.indexOf(grade) > -1){
                            schedule.score -= 20;
                            schedule.alreadyMissedMath = true;
                        }
                    });
                });
            });
        });
    }
    
    // - After/during PE (same per teacher)
    if(schedule.score > 0){
//TODO
    }
    
    // - Prefer empty timeslots together, and at the beginning or end of the day
    if(schedule.score > 0){
        var firstGroup = false;
        var lastGroup = false;
        var gap = false;
        var beforeGroups = false;
        var afterGroups = false;
        
        _.each(schedule.timeslots, function(timeslot){
            if(timeslot.scheduleGroups.length){
                if(!firstGroup){
                    firstGroup = true;
                } else {
                    if(lastGroup){
                        afterGroups = false;
                        gap = true;
                    }
                }
            } else {
                if(!firstGroup){
                    beforeGroups = true;
                } else {
                    lastGroup = true;
                    afterGroups = true;
                }
            }
        });

        if(gap){
            schedule.score -= 10;
            schedule.gap = true;
        }

        if(beforeGroups && afterGroups){
            schedule.score += 5;
            schedule.beforeAndAfter = true;
        } else if(beforeGroups || afterGroups){
            schedule.score += 10;
            schedule.beforeOrAfter = true;
        }
    }

    return schedule;
}

//Create permutations
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

//Compare schedules
function scheduleEquals(a, b){
  return (JSON.stringify(a.timeslots) === JSON.stringify(b.timeslots));
}

//Deep copy
function copy(obj){
  return JSON.parse(JSON.stringify(obj));
}



console.log('generated schedules:');
console.log(schedules);


var first = schedules.slice(0,10);
//Print stuff to the page TODO make pretty
$('#js-pre-output').append(JSON.stringify(

first

, null, 2));

});
