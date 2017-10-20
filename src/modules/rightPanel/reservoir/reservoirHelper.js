var ifExist = function (obj, value) {
    return obj.indexOf(value) !== -1;
}
define(function () {
    return {
        getGrade: function (type, value) {
            value = parseFloat(value);
            if (ifExist(type, '_ph')) {
                return 1;
            }
            else if (ifExist(type, '_waterTemperature')) {
                return 1;
            }
            else if (ifExist(type, '_dissolvedOxygen')) {
                value = value.toFixed(1);
                if (value > 7.4) {
                    return 1;
                } else if (value > 5.9) {
                    return 2;
                } else if (value > 4.9) {
                    return 3;
                } else if (value > 2.9) {
                    return 4
                } else if (value > 1.9) {
                    return 5;
                }
                else if (value < 2) {
                    return 6;
                }
            }
            else if (ifExist(type, '_permanganateIndex')) {
                value = value.toFixed(1);
                if (value < 2.1) {
                    return 1;
                } else if (value < 4.1) {
                    return 2;
                } else if (value < 6.1) {
                    return 3;
                } else if (value < 10.1) {
                    return 4
                } else if (value < 15.1) {
                    return 5;
                }
                else if (value > 15) {
                    return 6;
                }
            }
            else if (ifExist(type, '_chemicalOxygenDemand')) {
                value = value.toFixed(1);
                if (value < 15.1) {
                    return 1;
                } else if (value < 15.1) {
                    return 2;
                } else if (value < 20.1) {
                    return 3;
                } else if (value < 30.1) {
                    return 4
                } else if (value < 40.1) {
                    return 5;
                }
                else if (value > 40) {
                    return 6;
                }
            }
            else if (ifExist(type, '_fiveDayOxygenDemand')) {
                value = value.toFixed(1);
                if (value < 3.1) {
                    return 1;
                } else if (value < 3.1) {
                    return 2;
                } else if (value < 4.1) {
                    return 3;
                } else if (value < 6.1) {
                    return 4
                } else if (value < 10.1) {
                    return 5;
                }
                else if (value > 10) {
                    return 6;
                }
            }
            else if (ifExist(type, '_ammoniaNitrogen')) {
                value = value.toFixed(2);
                if (value < 0.151) {
                    return 1;
                } else if (value < 0.51) {
                    return 2;
                } else if (value < 1.01) {
                    return 3;
                } else if (value < 1.51) {
                    return 4
                } else if (value < 2.01) {
                    return 5;
                }
                else if (value > 2.01) {
                    return 6;
                }
            }
            else if (ifExist(type, '_totalPhosphorus')) {
                value = value.toFixed(2);
                if (value < 0.151) {
                    return 1;
                } else if (value < 0.51) {
                    return 2;
                } else if (value < 1.01) {
                    return 3;
                } else if (value < 1.51) {
                    return 4
                } else if (value < 2.01) {
                    return 5;
                }
                else if (value > 2.01) {
                    return 6;
                }
            } else {
                return value;
            }
        },
        transferGradeTitle: function (grade) {
            //  8,25,41,60,76,93
            switch (grade) {
                case 1:
                    return 'Ⅰ';
                case 2:
                    return 'Ⅱ';
                case 3:
                    return 'Ⅲ';
                case 4:
                    return 'Ⅳ';
                case 5:
                    return 'Ⅴ';
                case 6:
                    return '劣Ⅴ';
            }
        }

    }
})