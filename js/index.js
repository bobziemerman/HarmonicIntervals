var app = angular.module('harmonicIntervals', []);
app.controller('main', function($scope) {
    console.log('sanity');
console.log(instrumentGroupData);
console.log(scheduleGroupData);
console.log(timeslotData);
console.log(gradeData);
console.log(teacherData);
console.log(schoolData);

    $scope.days = JSON.parse(JSON.stringify(timeslotData));
    $scope.scheduleGroups = JSON.parse(JSON.stringify(scheduleGroupData));
    $scope.grades = JSON.parse(JSON.stringify(gradeData));


    $scope.timeslotWarnings = function(timeslot, scheduleGroup){
        var warnings = [];
        var grades = [];
        _.each(scheduleGroup.instrumentGroups, function(ig){
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

        return warnings.join('; ');
    }

    $scope.timeslotLevel = function(timeslot, scheduleGroup){
        var level = 3;
        var grades = [];
        _.each(scheduleGroup.instrumentGroups, function(ig){
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
        if($scope.days[dayName][timeslotName].lunchGrades.includes(gradeName)){
		$scope.days[dayName][timeslotName].lunchGrades = 
                    _.without($scope.days[dayName][timeslotName].lunchGrades, gradeName);
        } else {
            $scope.days[dayName][timeslotName].lunchGrades.push(gradeName);
        }
    };

    $scope.toggleMath = function(dayName, timeslotName, gradeName){
        if($scope.days[dayName][timeslotName].mathGrades.includes(gradeName)){
                $scope.days[dayName][timeslotName].mathGrades =
                    _.without($scope.days[dayName][timeslotName].mathGrades, gradeName);
        } else {
            $scope.days[dayName][timeslotName].mathGrades.push(gradeName);
        }
    };

    $scope.togglePE = function(dayName, timeslotName, gradeName){
        if($scope.days[dayName][timeslotName].peGrades.includes(gradeName)){
                $scope.days[dayName][timeslotName].peGrades =
                    _.without($scope.days[dayName][timeslotName].peGrades, gradeName);
        } else {
            $scope.days[dayName][timeslotName].peGrades.push(gradeName);
        }
    };

    $scope.toggleRecess = function(dayName, timeslotName, gradeName){
        if($scope.days[dayName][timeslotName].recessGrades.includes(gradeName)){
                $scope.days[dayName][timeslotName].recessGrades =
                    _.without($scope.days[dayName][timeslotName].recessGrades, gradeName);
        } else {
            $scope.days[dayName][timeslotName].recessGrades.push(gradeName);
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


    //Initialize Bootstrap tooltips
    $scope.$watch('days', function(){
        $('body').tooltip({selector: '[data-toggle="tooltip"]'});
    }, true);


});
