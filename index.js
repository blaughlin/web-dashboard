
// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6mn8ubXNzemgz5KcJTxNHj8HKiZoozUU",
  authDomain: "coolingdashboard.firebaseapp.com",
  databaseURL: "https://coolingdashboard-default-rtdb.firebaseio.com",
  projectId: "coolingdashboard",
  storageBucket: "coolingdashboard.appspot.com",
  messagingSenderId: "669074738369",
  appId: "1:669074738369:web:dd209a47a9932d8a8b5840"
};

var app = firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
let drowdown = document.getElementById("dropdown-div")


function getExp(evt) {
  hideSections()
  document.getElementById("dashboard").style.display = "block"
  document.getElementById("expTitle").innerHTML = "Experiment started on: " + evt.currentTarget.myParam
  graphExperiment(evt.currentTarget.myParam, myChart)
}


// Loads experiments into the experiment menu
async function loadExperiments(data) {
  firebase.database().ref().once('value', (snapshot) => {
  for(let v in snapshot.val()){
    let experiment = document.createElement("a")
    experiment.innerHTML = v
    experiment.addEventListener('click', getExp, false)
    experiment.myParam = experiment.innerHTML
    drowdown.appendChild(experiment)
  }
})
}

function removeExperiments() {
  while (drowdown.firstChild){
    drowdown.removeChild(drowdown.firstChild)
  }
}

// document.addEventListener('click', function(e) {
//   if(e.target && e.class == 'exp'){
//     console.log('i was clicked')
//   }
// })

// Redraw graph with new data
function newGraph() {
  ctx = document.getElementById('myChart').getContext('2d');

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
            text: "Temperature (°C)"
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
  return myChart
}

function graphExperiment(exp, chart) {
  const data =  firebase.database().ref(exp).limitToLast(20).on('value', (snaphot) => {
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
    document.getElementById("Tb").innerHTML =  results[i]["Tb"]
    document.getElementById("Tc").innerHTML =  results[i]["Cage Temperature"]
    document.getElementById("Ts").innerHTML =  results[i]["Set Temperature"]
    addData(myChart, xAxis[index], ( [ results[i]["Tb"], results[i]["Cage Temperature"], results[i]["Set Temperature"] ]))

    }
  })
}


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

}

hideSections()

document.getElementById("logBtn").addEventListener("click", () => {
  hideSections()
  console.log("login clicked")
  document.getElementById("login").style.display = "block"
} )

document.getElementById("logOutBtn").addEventListener("click", (e) => {
    e.preventDefault()
    auth.signOut()
})

document.getElementById("infoBtn").addEventListener("click", () => {
  hideSections()
  document.getElementById("info").style.display = "block"
} )



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

auth.onAuthStateChanged(user => {
  if (user) {
    console.log('user loggedin: ', user)
    setupUI(user)
  } else {
    console.log("user logged out")
    setupUI()
  }
})

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