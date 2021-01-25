var today = new Date().toISOString().split('T')[0];
document.getElementById("date_input").setAttribute('min', today);