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
    $scope.computedSchedule = [];

    //Allows day toggle
    $scope.days = [];
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

/*
    $scope.checkPE = function(timeslot, teacher){
        return timeslot.peTeachers.includes(teacher);
    };
*/

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

/*
    $scope.togglePE = function(dayName, timeslotName, gradeName){
        if($scope.school.schedule[dayName][timeslotName].peGrades.includes(gradeName)){
                $scope.school.schedule[dayName][timeslotName].peGrades =
                    _.without($scope.school.schedule[dayName][timeslotName].peGrades, gradeName);
        } else {
            $scope.school.schedule[dayName][timeslotName].peGrades.push(gradeName);
        }
    };
*/

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

});

