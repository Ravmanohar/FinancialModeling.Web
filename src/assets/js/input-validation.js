$("body").on("keypress", 'input[type="number"].percent', function (event) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
        return false;
    }
    return true;
});

$("body").on("input", 'input[type="number"].percent', function (event) {
    var value = Number(event.target.value);
    if (value > 100)
        event.target.value = 100;
});

$("body").on("keypress", 'input[type="number"].rate', function (event) {
    // const charCode = (event.which) ? event.which : event.keyCode;
    // if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    //     event.preventDefault();
    //     return false;
    // }
    // return true;

    const charCode = (event.which) ? event.which : event.keyCode;
    var allowPeriod = false;
    var value = event.target.value;
    if (charCode == 46 && value && value != "") {
        allowPeriod = value.indexOf('.') < 0;
    }
    if (allowPeriod != true && (charCode > 31 && (charCode < 48 || charCode > 57))) {
        event.preventDefault();
        return false;
    }
    return true;
});

$("body").on("input", 'input[type="number"].rate', function (event) {
    var value = Number(event.target.value);
    if (value > 20)
        event.target.value = 20;
});