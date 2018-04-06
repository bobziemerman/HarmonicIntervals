var app = angular.module('harmonicIntervals', []);
app.controller('main', function($scope) {
    console.log('sanity');
console.log(instrumentGroupData);
console.log(scheduleGroupData);
console.log(timeslotData__W__A);
console.log(timeslotData__W__B);
console.log(timeslotData__TG__A);
console.log(timeslotData__TG__B);
console.log(gradeData);
console.log(teacherData);
console.log(schoolData);

    $scope.schools = JSON.parse(JSON.stringify(schoolData));
    $scope.school = $scope.schools['tulipGroveA']; //Default school
    $scope.scheduleGroups = JSON.parse(JSON.stringify(scheduleGroupData));
    $scope.instrumentGroups = JSON.parse(JSON.stringify(instrumentGroupData));
    $scope.grades = JSON.parse(JSON.stringify(gradeData));
    $scope.missedMath = [];
    $scope.computedSchedule = [];
    $scope.days = [];
    _.each(_.keys($scope.school.schedule), function(day){
        $scope.days[day] = true;
    });


    $scope.sgContainsIg = function(sg, ig){
        var contains = false;
        _.each(sg.instrumentGroups, function(currIg){
            if(currIg.name === ig.name){
                contains = true;
            }
        });
        return contains;
    }

    $scope.toggleSgIg = function(sg, ig){
        if($scope.sgContainsIg(sg, ig)){
            sg.instrumentGroups = sg.instrumentGroups.filter(function(obj){
                return obj.name === ig.name;
            });
        } else {
            sg.instrumentGroups.push(JSON.parse(JSON.stringify(ig)));
        }
    }

    $scope.timeslotWarnings = function(timeslot, scheduleGroup){
        var warnings = [];
        var grades = [];
        _.each(scheduleGroup.instrumentGroups, function(ig){
            _.each(ig.grades, function(igGrade){
                _.each(timeslot.mathGrades, function(mathGrade){
                    if(igGrade === mathGrade && $scope.missedMath[ig.name]){
                        warnings.push(ig.name+" cannot miss math two weeks in a row");
                    }
                });
            });

            grades = grades.concat(ig.grades);
        });

        _.each(timeslot.lunchGrades, function(grade){
            if(grades.includes(grade)){
                warnings.push(grade + ' grade has lunch');
            }
        });
        _.each(timeslot.mathGrades, function(grade){
            if(grades.includes(grade)){
                warnings.push(grade + ' grade has math');
            }
        });
        _.each(timeslot.peGrades, function(grade){
            if(grades.includes(grade)){
                warnings.push(grade + ' grade has PE');
            }
        });
        _.each(timeslot.recessGrades, function(grade){
            if(grades.includes(grade)){
                warnings.push(grade + ' grade has recess');
            }
        });
        _.each(timeslot.mathGrades, function(grade){
            if(grades.includes(grade)){
                warnings.push(grade + ' grade has math');
            }
        });

        return warnings.join('; ');
    }

    $scope.timeslotLevel = function(timeslot, scheduleGroup){
        var level = 3;
        var grades = [];
        _.each(scheduleGroup.instrumentGroups, function(ig){
            _.each(ig.grades, function(igGrade){
                _.each(timeslot.mathGrades, function(mathGrade){
                    if(igGrade === mathGrade && $scope.missedMath[ig.name]){
                        level = 0;
                    }
                });
            });

            grades = grades.concat(ig.grades);
        });

        _.each(timeslot.mathGrades, function(grade){
            if(grades.includes(grade)){
                level--;
            }
        });

        _.each(timeslot.peGrades, function(grade){
            if(grades.includes(grade)){
                level--;
            }
        });
        _.each(timeslot.recessGrades, function(grade){
            if(grades.includes(grade)){
                level--;
            }
        });
        _.each(timeslot.lunchGrades, function(grade){
            if(grades.includes(grade)){
                level = 0;
            }
        });

        return level;
    }

    //Checkbox state evalutation functions
    $scope.checkLunch = function(timeslot, grade){
        return timeslot.lunchGrades.includes(grade);
    };

    $scope.checkMath = function(timeslot, grade){
        return timeslot.mathGrades.includes(grade);
    };

    $scope.checkPE = function(timeslot, grade){
        return timeslot.peGrades.includes(grade);
    };

    $scope.checkRecess = function(timeslot, grade){
        return timeslot.recessGrades.includes(grade);
    };

    //Checkbox toggle functions
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

    $scope.togglePE = function(dayName, timeslotName, gradeName){
        if($scope.school.schedule[dayName][timeslotName].peGrades.includes(gradeName)){
                $scope.school.schedule[dayName][timeslotName].peGrades =
                    _.without($scope.school.schedule[dayName][timeslotName].peGrades, gradeName);
        } else {
            $scope.school.schedule[dayName][timeslotName].peGrades.push(gradeName);
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
        _.each(timeslot.peGrades, function(grade){
            events.push(grade.substr(0,1)+'PE');
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

    $scope.instrumentGroupNames = function(scheduleGroup){
        var names = [];
        _.each(scheduleGroup.instrumentGroups, function(ig){ names.push(ig.name) });
        return names.join(', ');
    }

    $scope.lessonCount = function(igName){
        var lessonCount = 0;

        _.each(_.values($scope.computedSchedule), function(checkedTimeslot){
            _.each(_.keys(checkedTimeslot), function(sgName){
                if(checkedTimeslot[sgName]){
                    _.each($scope.scheduleGroups, function(sg){
                        if(sg.name === sgName){
                            _.each(sg.instrumentGroups, function(ig){
                                if(ig.name === igName){
                                    lessonCount++;
                                }
                            });
                        }
                    });
                }
            });
        });

        return lessonCount;
    }

    $scope.sgIgs = function(sgName){
        var igs = [];
        _.each($scope.scheduleGroups, function(sg){
            if(sg.name === sgName){
                _.each(sg.instrumentGroups, function(ig){
                    igs.push(ig.name);
                });
            }
        });
        return igs.join(', ');
    }

$scope.do = function(){console.log($scope.computedSchedule);}



    //Initialize Bootstrap tooltips
    $scope.$watch('school.schedule', function(){
        $('body').tooltip({selector: '[data-toggle="tooltip"]'});
    }, true);


});
