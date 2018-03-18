$(document).ready(function(){

console.log('schoolData:');
console.log(schoolData);

console.log('default schedule groups:');
//console.log(scheduleGroupData);
console.log(scheduleGroupData.length);






//Create all schedule permutations
var schedules = [];

//Remove empty schedule groups
var nonEmptyScheduleGroups = [];
_.each(copy(_.values(scheduleGroupData)), function(group){
    if(group.instrumentGroups.length){
        nonEmptyScheduleGroups.push(group);
    }
});

var schedules = permutations(_.values(timeslotData));
console.log('permutations: '+schedules.length);

//Score schedules
//console.log(schedules);
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

//Render to page
//TODO show error on no valid schedules
for(var i=0; i<5; i++){
    var schedule = schedules[i];
console.log(schedule);
    if(schedule){
        var id = '#schedule' + i.toString();
        $(id + ' .score').text(schedule.score);

        var currTimeslots = '';
        _.each(schedule.timeslots, function(timeslot){
//TODO highlight bad cells
            var currIGs = [];
            if(timeslot.scheduleGroups.length){
                _.each(timeslot.scheduleGroups[0].instrumentGroups, function(ig){
                    currIGs.push(ig.name);
                });
            }
            currTimeslots += '<tr><td>'+timeslot.startTime+'</td><td>'+currIGs.join(', ')+'</td></tr>';
        });
        $(id + ' tbody').append(currTimeslots);

        var err = '';
        if(schedule.errMsg){
            err += schedule.errMsg;
        }
        if(schedule.duringRecess){
            err += 'A group was scheduled during recess';
        }
        if(schedule.duringMath){
            err += 'A group was scheduled during math';
        }
        if(schedule.duringPE){
            err += 'A group was scheduled during PE';
        }
        $(id + ' ~ .err').text(err);
    }
}





/** Helper functions **/


//Scoring function
function score(schedule){
/*
    // 0: Missing or double-scheduled groups of students
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
*/

    /*
    // Points lost:
    // 0: During grade's lunch
    // -20: During grade's recess
    // -20: Will miss math
    */
    if(schedule.score > 0){
        _.each(schedule.timeslots, function(timeslot){
            if(schedule.score > 0){
                _.each(timeslot.scheduleGroups, function(sg){
                    if(schedule.score > 0){
                        _.each(sg.instrumentGroups, function(ig){
                            if(schedule.score > 0){
                                _.each(ig.grades, function(grade){
                                    if(schedule.score > 0){
                                        /*During lunch?*/
                                        //if(timeslot.lunchGrades.indexOf(grade) > -1){
                                        //    schedule.score = 0;
                                        //    schedule.errMsg = "The '"+ig.name+"' instrument group was scheduled during lunch";
                                        //}

                                        //During recess?
                                        if(timeslot.recessGrades.indexOf(grade) > -1){
                                            schedule.score -= 20;
                                            schedule.duringRecess = true;
                                        }

                                        //During math (TG only) (TODO missed math last week?)
                                        if(timeslot.mathGrades.indexOf(grade) > -1){
                                            schedule.score -= 20;
                                            schedule.duringMath = true;
                                        }

                                        //During PE (TODO after?)
                                        if(timeslot.peGrades.indexOf(grade) > -1){
                                            schedule.score -= 20;
                                            schedule.duringPE = true;
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
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

function isValidSchedule(schedule, first){

if(first){
console.log('first');
console.log(schedule);
first = false;
}

    var isValid = true;

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
            isValid = false;
        } else if(ig.present > 1){
            isValid = false;
        }
    });

    if(isValid){
        _.each(schedule.timeslots, function(timeslot){
            _.each(timeslot.scheduleGroups, function(sg){
                _.each(sg.instrumentGroups, function(ig){
                    _.each(ig.grades, function(grade){
                        /*During lunch?*/
                        if(timeslot.lunchGrades.indexOf(grade) > -1){
                            isValid = false;
                        }
                    });
                });
            });
        });
    }

    return isValid;
}

//Create permutations
function permutations(arr, notRoot){

var dropped = 0;
    var permArr = [],
        usedItems = [];

    var result = permute(arr);
console.log('dropped: '+dropped);
    return result;

    function permute(input) {
        var i, item;
        for (i = 0; i < input.length; i++) {
            item = input.splice(i, 1)[0];
            usedItems.push(item);

            if(input.length == 0){
                var currUsedItems = copy(usedItems);
                
                //Add schedule groups to this permutation
                _.each(nonEmptyScheduleGroups, function(group, i){
                    currUsedItems[i].scheduleGroups.push(group);
                });

                var isValid = isValidSchedule({'timeslots': currUsedItems});
                if (input.length == 0 && isValid) {
                    //Sort
                    currUsedItems.sort(function(a, b){
                        if(a.startTime < b.startTime){
                            return -1;
                        } else if(b.startTime < a.startTime){
                            return 1;
                        }
                        return 0;
                    });

                    permArr.push({'timeslots': currUsedItems});
                } else if(input.length == 0 && !isValid){
                    dropped++;
                }
            }

            permute(input, true);
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



console.log('generated nonzero schedules:');
//console.log(schedules);
console.log(schedules.length);


var first = schedules.slice(0,10);
//Print stuff to the page TODO make pretty
$('#js-pre-output').append(JSON.stringify(

first

, null, 2));

});
