let dataPoints = 20
let ymax = 100
let ymin = 30
let autoYControl = true

let yvalues = {"min": 30, "max": 100}

// Firebase Configuration Data
const firebaseConfig = {
  apiKey: "AIzaSyC6mn8ubXNzemgz5KcJTxNHj8HKiZoozUU",
  authDomain: "coolingdashboard.firebaseapp.com",
  databaseURL: "https://coolingdashboard-default-rtdb.firebaseio.com",
  projectId: "coolingdashboard",
  storageBucket: "coolingdashboard.appspot.com",
  messagingSenderId: "669074738369",
  appId: "1:669074738369:web:dd209a47a9932d8a8b5840"
};

// Initialize firebase 
var app = firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
let drowdown = document.getElementById("dropdown-div")
hideSections()

// Load up experiment selected from menu
function getExp(evt) {
  hideSections()
  document.getElementById("dashboard").style.display = "block"
  document.getElementById("expTitle").innerHTML = "Experiment started on: " + evt.currentTarget.myParam
  graphExperiment(evt.currentTarget.myParam, myChart)
}

let expDates = []
// Loads experiments into the experiment menu
async function loadExperiments(data) {
  firebase.database().ref().once('value', (snapshot) => {

  // add lasted experiment to start of list
  for(let v in snapshot.val()){
    expDates.unshift(v)
  }

  // add experiments to menu
  for (let exp in expDates){
    let experiment = document.createElement("a")
    experiment.innerHTML = expDates[exp]
    experiment.addEventListener('click', getExp, false)
    experiment.myParam = experiment.innerHTML
    drowdown.appendChild(experiment)
  }
})
}

// Hides experiments section if user is not logged in
function removeExperiments() {
  while (drowdown.firstChild){
    drowdown.removeChild(drowdown.firstChild)
  }
}

// Initializes graph
function newGraph() {
  ctx = document.getElementById('myChart').getContext('2d');
  if (autoYControl){
 myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Core body temperature',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1
        }, 
        {
            label: 'Cage temperature',
            data: [],
            backgroundColor: [
                'rgba(255, 159, 63, 0.2)'
            ],
            borderColor: [
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1
        },
        {
            label: 'Set temperature',
            data: [],
            backgroundColor: [
                'rgba(129, 236, 236, 0.2)',
      
            ],
            borderColor: [
                'rgba(129, 236, 236,1.0)',
            ],
            borderWidth: 1
        }]
    },
    options: {
      responsive: true,
      animation: false,
      spanGaps: true,
      scales: {
        y:{
            title:{
            display: true,
            text: "Temperature (??C)",
          }
        },
        x:{
          title:{
            display: true,
            text: "Time",
          },
          grid:{
            ticks:{
              sampleSize: 1
            }
          }
        }
      }
    }
});
  } else {
     myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Core body temperature',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1
        }, 
        {
            label: 'Cage temperature',
            data: [],
            backgroundColor: [
                'rgba(255, 159, 63, 0.2)'
            ],
            borderColor: [
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1
        },
        {
            label: 'Set temperature',
            data: [],
            backgroundColor: [
                'rgba(129, 236, 236, 0.2)',
      
            ],
            borderColor: [
                'rgba(129, 236, 236,1.0)',
            ],
            borderWidth: 1
        }]
    },
    options: {
      responsive: true,
      animation: false,
      spanGaps: true,
      scales: {
        y:{
          min: ymin,
          max: ymax,
            title:{
            display: true,
            text: "Temperature (??C)",
          }
        },
        x:{
          title:{
            display: true,
            text: "Time",
          },
          grid:{
            ticks:{
              sampleSize: 1
            }
          }
        }
      }
    }
});
  }
  return myChart
}

// Graphs experimental data
function graphExperiment(exp, chart) {
  const data =  firebase.database().ref(exp).limitToLast(dataPoints).on('value', (snaphot) => {
  chart.destroy()
  myChart.destroy()
  myChart = newGraph()
  myChart.options.animation = false
  let results = snaphot.val()

  let xAxis = []
  snaphot.forEach(function(childSnapshot) {
    var key = childSnapshot.key
    xAxis.push(key.substr(-8))
  })
  let index = 0

  for(var i in results){
    index++
    document.getElementById("Tb").innerHTML =  results[i]["Tb"].toFixed(1) + "??C"
    document.getElementById("Tc").innerHTML =  (results[i]["Error"]).toFixed(1) + "%"
    document.getElementById("Ts").innerHTML =  results[i]["Set Temperature"].toFixed(1) + "??C"
    document.getElementById("kp").innerHTML =  results[i]["Proportional"]
    document.getElementById("kd").innerHTML =  results[i]["Derivative"]
    document.getElementById("ki").innerHTML =  results[i]["Integral"]
    document.getElementById("targetTemp").innerHTML = results[i]["Target Temperature"] + "??C"

    addData(myChart, xAxis[index], ( [ results[i]["Tb"], results[i]["Cage Temperature"], results[i]["Set Temperature"] ]))
    }
  })
}

// Adds experimental data to chart
function addData(chart, x, y) {
  let i = 0
  chart.data.labels.push(x)
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(y[i]);
    i++
  });
  chart.update()
}


// Create blank empty chart
var ctx = document.getElementById('myChart').getContext('2d');

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Core body temperature',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1
        }, 
        {
            label: 'Cage temperature',
            data: [],
            backgroundColor: [
                'rgba(255, 159, 63, 0.2)'
            ],
            borderColor: [
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1
        },
        {
            label: 'Set temperature',
            data: [],
            backgroundColor: [
                'rgba(129, 236, 236, 0.2)'
            ],
            borderColor: [
                'rgba(129, 236, 236, 1.0)',
            ],
            borderWidth: 1
        }]
    },
    options: {
      responsive: true,
      animation: false,
      spanGaps: true
    }
});

// Hides all website sections 
function hideSections() {
  document.getElementById("dashboard").style.display = "none"
  document.getElementById("signup").style.display = "none"
  document.getElementById("info").style.display = "none"
  document.getElementById("login").style.display = "none"
  document.getElementById("main").style.display = "none"
  document.getElementById("config").style.display = "none"

}

// Display Configure Screen
document.getElementById("configBtn").addEventListener("click", () => {
  hideSections()
  document.getElementById("config").style.display = "block"
})

// Displays login screen
document.getElementById("logBtn").addEventListener("click", () => {
  hideSections()
  document.getElementById("login").style.display = "block"
} )

// Sign out user 
document.getElementById("logOutBtn").addEventListener("click", (e) => {
    e.preventDefault()
    auth.signOut()
})


// show y axis control
document.getElementById("custom").addEventListener("click", () => {
  autoYControl = false
  document.getElementById("y_axis_config").style.display = 'block'
})

// hide y axis control
document.getElementById("auto").addEventListener("click", () => {
  autoYControl = true
  document.getElementById("y_axis_config").style.display = 'none'
})

// change x axis 
document.getElementById("minutes").addEventListener("change", (e) => {
  // console.log(e.target.value)
  dataPoints = parseInt(e.target.value)
})

// update ymin
document.getElementById("ymin").addEventListener("change", (e) => {
  ymin = parseFloat(e.target.value)
})

// update ymax 
document.getElementById("ymax").addEventListener("change", (e) => {
  ymax = parseFloat(e.target.value)
})

// Dispays information screen
document.getElementById("infoBtn").addEventListener("click", () => {
  hideSections()
  document.getElementById("info").style.display = "block"
} )

// Handle login authentication 
const loginForm = document.querySelector("#login-form")
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const email = loginForm['login-email'].value
  const password = loginForm['login-password'].value
  
  auth.signInWithEmailAndPassword(email, password).then(cred => {
    hideSections()
    loginForm.reset();
  })
})

// Monitor for user logging in oe out
auth.onAuthStateChanged(user => {
  if (user) {
    setupUI(user)
  } else {
    setupUI()
  }
})

// Display experiments section if user is logged in
const setupUI = (user) => {
  if (user) {
    loadExperiments()
    document.getElementById("dashboard").style.display = "block"
    document.getElementById("main").style.display = "none";
    document.getElementById("logOutBtn").style.display = 'block'
    document.getElementById("logBtn").style.display = 'none'

  } else{
    removeExperiments()
    hideSections()
    document.getElementById("main").style.display = "block";
    document.getElementById("logOutBtn").style.display = 'none'
    document.getElementById("logBtn").style.display = 'block'

  }
}

