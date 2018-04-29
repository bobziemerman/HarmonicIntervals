
//TODO missing PE and teacher data for (W?)

var app = angular.module('harmonicIntervals', ['isteven-multi-select']);
app.controller('main', function($scope) {
    console.log('sanity');
console.log(gradeData);
console.log('woodmore teachers:');
console.log(teacherData__W);
console.log(schoolData);

    $scope.schools = JSON.parse(JSON.stringify(schoolData));
    $scope.school = $scope.schools['tulipGroveA']; //Default to TG
console.log($scope.school);
    $scope.teachers = JSON.parse(JSON.stringify(teacherData__TG)); //Default to TG
    $scope.grades = JSON.parse(JSON.stringify(gradeData));
    $scope.missedMath = _.values(JSON.parse(JSON.stringify($scope.school.instrumentGroups)));
console.log($scope.missedMath);
    $scope.computedSchedule = [];
    new ClipboardJS('#js-copy-to-clipboard'); //Set up 'copy to clipboard' element

    $scope.days = []; //Allows day toggle
    _.each(_.keys($scope.school.schedule), function(day){
        $scope.days[day] = true;
    });

    $scope.timeslotWarnings = function(timeslot, ig){
        var warnings = [];
        var grades = ig.grades;

        _.each(timeslot.inactiveGrades, function(grade){
            if(grades.includes(grade)){
                warnings.push(grade + ' grade not allowed now');
            }
        });
        _.each(timeslot.lunchGrades, function(grade){
            if(grades.includes(grade)){
                warnings.push(grade + ' grade has lunch');
            }
        });
        _.each(timeslot.mathGrades, function(grade){
            if(grades.includes(grade)){
                var missed = false;
                _.each($scope.missedMathState, function(miss){
                    if(miss.name === ig.name){
                        missed = true;
                    }
                });

                if(missed){
                    warnings.push(ig.name+" cannot miss math two weeks in a row");
                } else {
                    warnings.push(grade + ' grade has math');
                }
                
            }
        });
        _.each(timeslot.peTeachers, function(teacher){
            if(ig.teacher === teacher){
                warnings.push($scope.teachers[teacher].name + "'s class has PE");
            }
        });
        _.each(timeslot.recessGrades, function(grade){
            if(grades.includes(grade)){
                warnings.push(grade + ' grade has recess');
            }
        });

        return warnings.join('; ');
    }

    $scope.timeslotLevel = function(timeslot, instrumentGroup){
        var level = 3;
        var grades = instrumentGroup.grades;

        _.each(timeslot.inactiveGrades, function(grade){
            if(grades.includes(grade)){
                level = 0;
            }
        });
        _.each(timeslot.lunchGrades, function(grade){
            if(grades.includes(grade)){
                level = 0;
            }
        });
        _.each(timeslot.mathGrades, function(grade){
            if(grades.includes(grade)){
                var missed = false;
                _.each($scope.missedMathState, function(miss){
                    if(miss.name === instrumentGroup.name){
                        missed = true;
                    }
                });

                if(missed){
                    level = 0;
                } else{
                    level--;
                }
            }
        });
        _.each(timeslot.peTeachers, function(teacher){
            if(instrumentGroup.teacher === teacher){
                level--;
            }
        });
        _.each(timeslot.recessGrades, function(grade){
            if(grades.includes(grade)){
                level--;
            }
        });

        return level;
    }

    //Checkbox state evalutation functions
    $scope.checkGrade = function(timeslot, grade){
        return timeslot.inactiveGrades.includes(grade);
    };
    $scope.checkAllGrade = function(dayName, grade){
        var allChecked = true;
        _.each($scope.school.schedule[dayName], function(timeslot){
            if(!$scope.checkGrade(timeslot, grade)){
                allChecked = false;
            }
        });

        return allChecked;
    };

    $scope.checkLunch = function(timeslot, grade){
        return timeslot.lunchGrades.includes(grade);
    };

    $scope.checkMath = function(timeslot, grade){
        return timeslot.mathGrades.includes(grade);
    };

    $scope.checkPE = function(timeslot, teacher){
        return timeslot.peTeachers.includes(teacher);
    };

    $scope.checkRecess = function(timeslot, grade){
        return timeslot.recessGrades.includes(grade);
    };

    //Checkbox toggle functions
    $scope.toggleGrade = function(dayName, timeslotName, gradeName){
        if($scope.school.schedule[dayName][timeslotName].inactiveGrades.includes(gradeName)){
                $scope.school.schedule[dayName][timeslotName].inactiveGrades =
                    _.without($scope.school.schedule[dayName][timeslotName].inactiveGrades, gradeName);
        } else {
            $scope.school.schedule[dayName][timeslotName].inactiveGrades.push(gradeName);
        }
    };
    $scope.toggleAllGrade = function(dayName, gradeName){
        var allChecked = $scope.checkAllGrade(dayName, gradeName);
        _.each($scope.school.schedule[dayName], function(timeslot){
            if(allChecked){
                timeslot.inactiveGrades = _.without(timeslot.inactiveGrades, gradeName);
            } else {
                timeslot.inactiveGrades.push(gradeName);
            }
        });
    };

    $scope.toggleLunch = function(dayName, timeslotName, gradeName){
        if($scope.school.schedule[dayName][timeslotName].lunchGrades.includes(gradeName)){
		$scope.school.schedule[dayName][timeslotName].lunchGrades = 
                    _.without($scope.school.schedule[dayName][timeslotName].lunchGrades, gradeName);
        } else {
            $scope.school.schedule[dayName][timeslotName].lunchGrades.push(gradeName);
        }
    };

    $scope.toggleMath = function(dayName, timeslotName, gradeName){
        if($scope.school.schedule[dayName][timeslotName].mathGrades.includes(gradeName)){
                $scope.school.schedule[dayName][timeslotName].mathGrades =
                    _.without($scope.school.schedule[dayName][timeslotName].mathGrades, gradeName);
        } else {
            $scope.school.schedule[dayName][timeslotName].mathGrades.push(gradeName);
        }
    };

    $scope.togglePE = function(dayName, timeslotName, teacher){
        if($scope.school.schedule[dayName][timeslotName].peTeachers.includes(teacher)){
                $scope.school.schedule[dayName][timeslotName].peTeachers =
                    _.without($scope.school.schedule[dayName][timeslotName].peTeachers, teacher);
        } else {
            $scope.school.schedule[dayName][timeslotName].peTeachers.push(teacher);
        }
    };

    $scope.toggleRecess = function(dayName, timeslotName, gradeName){
        if($scope.school.schedule[dayName][timeslotName].recessGrades.includes(gradeName)){
                $scope.school.schedule[dayName][timeslotName].recessGrades =
                    _.without($scope.school.schedule[dayName][timeslotName].recessGrades, gradeName);
        } else {
            $scope.school.schedule[dayName][timeslotName].recessGrades.push(gradeName);
        }
    };


    $scope.gradeEvents = function(timeslot){
        var events = [];
        
        _.each(timeslot.lunchGrades, function(grade){
            events.push(grade.substr(0,1)+'L');
        });
        _.each(timeslot.mathGrades, function(grade){
            events.push(grade.substr(0,1)+'M');
        });
        _.each(timeslot.peTeachers, function(teacher){
            _.each(teacher.grades, function(grade){
                events.push(grade.number+'PE');
            });
        });
        _.each(timeslot.recessGrades, function(grade){
            events.push(grade.substr(0,1)+'R');
        });

        events = events.sort(function(a,b){
            if(a<b) return -1;
            if(b<a) return 1;
            return 0;
        });

        return events.length ? '('+events.join(' ')+')' : '';
    }

    $scope.lessonCount = function(igName){
        var lessonCount = 0;

        _.each(_.values($scope.computedSchedule), function(checkedTimeslot){
            _.each(_.keys(checkedTimeslot), function(tsIgName){
                if(checkedTimeslot[igName] && tsIgName === igName){
                    lessonCount++;
                }
            });
        });

        return lessonCount;
    }

    $scope.missingMath = function(){
        var arr = [];
        _.each(_.keys($scope.school.schedule), function(day){
            _.each(_.keys($scope.school.schedule[day]), function(timeslot){
                _.each($scope.school.instrumentGroups, function(ig){
                    var startTime = $scope.school.schedule[day][timeslot].startTime;

                    //If box is checked
                    if($scope.computedSchedule[day+startTime] && 
                       $scope.computedSchedule[day+startTime][ig.name]){

                        //If math at this time TODO
                        arr.push(ig.name);
                    }
                });
            });
        });
        return JSON.stringify(arr);
    };

    $scope.notTwice = {};
    $scope.checkNotTwice = function(){
        var arr = {};
        _.each($scope.school.instrumentGroups, function(ig){
            var count = $scope.lessonCount(ig.name);
            if(!arr[count]){
                arr[count] = [];
            }
            arr[count].push(ig.name);
        });
        $scope.notTwice = arr;
    }

    function isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    //Create clipboard button listener
    new ClipboardJS('.btn');


    //Initialize Bootstrap tooltips
    $scope.$watch('school.schedule', function(){
        $('body').tooltip({selector: '[data-toggle="tooltip"]'});
    }, true);


    //Watch for school change
    $scope.$watch('school', function(){
        //Change teachers
        teacherData = $scope.school.name.includes('Woodmore') ? 
            JSON.parse(JSON.stringify(teacherData__W)) : 
            JSON.parse(JSON.stringify(teacherData__TG)); 

        $scope.missedMath = _.values(JSON.parse(JSON.stringify($scope.school.instrumentGroups)));
    }, true);

    //Watch for boxes being checked in color schedule
    $scope.$watch('computedSchedule', function(){
        console.log('fired');
    }, true);

    //Watch for code input
    $scope.$watch('mathGroups', function(){
        if($scope.mathGroups && isJsonString($scope.mathGroups)){
            _.each(JSON.parse($scope.mathGroups), function(mGroup){
                _.each($scope.school.instrumentGroups, function(ig){
                    if(ig.name === mGroup){
                        _.each($scope.missedMath, function(mIg){
                            if(mIg.name === mGroup){
                                mIg.checked = true;
                            }
                        });
                    }
                });
            });
        } else {
            _.each($scope.missedMath, function(mIg){
                mIg.checked = false;
            });
        }
    });

});

