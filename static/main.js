// console.log('adfa');

// mapboxgl.accessToken = 'pk.eyJ1IjoiZmVlZGxpZ2h0NDIiLCJhIjoiY2xnY3d5eW92MTF3bzNjcWxvbm83enk4YyJ9.y2k3VZCUGo5cvYNEfDp7pA';
// var map = new mapboxgl.Map({
//           container: 'map',
//           style: 'mapbox://styles/feedlight42/clgqmxs0k00l501qxe6l42i05'
//         });





//  COLOR PALETTE


//  GREEN : #03C988
//  RED : #EB455F
//  ELLOW : #F9D949


//  TRIES for autocomplete
// 
// 

function makeNode(ch) {
  this.ch = ch;
  this.isTerminal = false;
  this.map = {};
  this.words = [];
}

function add(str, i, root) {

  if (i === str.length) {
      root.isTerminal = true;
      return;
  }

  if (!root.map[str[i]])
      root.map[str[i]] = new makeNode(str[i]);

  root.words.push(str);
  add(str, i + 1, root.map[str[i]]);
}

function search(str, i, root) {
  if (i === str.length)
      return root.words;

  if (!root.map[str[i]])
      return [];
  return search(str, i + 1, root.map[str[i]]);

}

const items = [
  "Marina Beach",
  "Kapaleeshwarar Temple",
  "Fort St. George",
  "Valluvar Kottam",
  "Santhome Basilica",
  "Guindy National Park",
  "Elliott's Beach",
  "Government Museum",
  "Theosophical Society",
  "Arignar Anna Zoological Park",
  "Vivekananda House",
  "Crocodile Bank",
  "Cholamandal Artists' Village",
  "DakshinaChitra",
  "Sri Parthasarathy Temple",
  "Kishkinta Theme Park",
  "MGR Film City",
  "Semmozhi Poonga",
  "Armenian Church",
  "VGP Universal Kingdom",
  "Kalakshetra Foundation",
  "Edward Elliot's Beach",
  "Pondy Bazaar",
  "Birla Planetarium",
  "Snake Park",
  "Ashtalakshmi Temple",
  "Valluvar Statue",
  "VGP Snow Kingdom",
  "Vandalur Zoo",
  "Ripon Building",
  "Sri Ramakrishna Math",
  "Anna Centenary Library",
  "Dheeran Chinnamalai Statue",
  "Connemara Public Library",
  "Chennai Rail Museum",
  "Government Estate",
  "Valluvar Kottam Monument"
];

const root = new makeNode('\0');
for (const item of items)
  add(item, 0, root);

const text_box = document.getElementById("get-source");
const list = document.getElementById("source-reco");

function handler(e) {
  const str = e.target.value;
  const predictions = search(str, 0, root);

  // console.log(predictions);

  list.innerHTML = "";
  const a = 0;
  for (const prediction of predictions)

      // if( a === 5) { continue; }
      // list.innerHTML += `<li class="list-group-item clickable" onclick="handleClick(this)"><b>${str}</b>${prediction.substring(str.length)}</li>`;
      list.innerHTML += `<option><b>${str}</b>${prediction.substring(str.length)}</option>`
      // console.log(list.innerHTML)



}

function handleClick(e) {
  text_box.value = e.innerText;
}

handler({ target: { value: "" } });


text_box.addEventListener("keyup", handler);

//  magnetic button

const butto = document.getElementById("get");

const btns = document.querySelectorAll(".btn");
    
        btns.forEach((btn) => {
          btn.addEventListener("mousemove", function(e){
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;
    
            btn.children[0].style.transform = "translate(" + x * 0.3 + "px, " + y * 0.5 + "px)";
          });
        });
    
        btns.forEach((btn) => {
          btn.addEventListener("mouseout", function(e){
            btn.children[0].style.transform = "translate(0px, 0px)";
          });
        });




// end of mag button



//    MAP APGE

mapboxgl.accessToken = 'pk.eyJ1IjoiZmVlZGxpZ2h0NDIiLCJhIjoiY2xnY3d5eW92MTF3bzNjcWxvbm83enk4YyJ9.y2k3VZCUGo5cvYNEfDp7pA';
var map = new mapboxgl.Map({
  container: 'map',
//   style: 'mapbox://styles/mapbox/dark-v11',   //this is for the default themes
  //  style: 'mapbox://styles/feedlight42/clhmon4kn01qn01pghfyo88db', 
  style: 'mapbox://styles/mapbox/streets-v11',
  // center: [80.237617, 13.067439], // starting position [lng, lat]
  center: [80.11542, 12.89458],
  zoom: 10   // starting zoom
});

const input = document.getElementById("toggle");
// console.log(input.checked);
// console.log('wasss');

function toggle_dark()
{
    var checkbox = document.getElementById('toggle');

    if (checkbox.checked == true)
        {
            map.setStyle('mapbox://styles/mapbox/dark-v11');
            document.getElementById("header").className = 'header dark-header'
            document.getElementById("header_words").style = 'color: white;'
            document.getElementById("content").className = 'main-util dark-util'
            console.log(document.getElementById("header").className)
            document.getElementById("get").className = 'get-route-dark'
        }
    else 
        {
            map.setStyle('mapbox://styles/feedlight42/clhmon4kn01qn01pghfyo88db');
            document.getElementById("header").className = 'header light-header'
            document.getElementById("header_words").style = 'color: black;'
            document.getElementById("content").className = 'main-util light-util'
            console.log(document.getElementById("header").className)
            document.getElementById("get").className = 'get-route'
        }


}




// FUNCTIONALITY FOR THE FORM 

var form = document.getElementById('myForm');
var inputs = Array.from(form.getElementsByTagName('input'));
var getRouteButton = document.getElementById('get-route');

// validate inputs -- check if they're not empty

inputs.forEach(function(input){
  input.addEventListener('input', validateForm)
});

function validateForm() {
  var isFormValid = inputs.every(function(input){
    // console.log(input.value);
    return input.value.trim() !== '';  
  });
  // console.log(isFormValid);
  getRouteButton.disabled = !isFormValid;
}

form.addEventListener('submit', function(event){
  event.preventDefault(); // to prevent page from refreshing 

  var inputValues = inputs.map(function(input){
    // console.log(input.value);
    return input.value;
  });

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/process_pathCoordinates', true);
  xhr.setRequestHeader('Content-Type', 'application/json');




  xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        // Call a function to map the route in mapbox
        hackerTextEffect('time_hack', response[4]);
        hackerTextEffect('distance_hack', response[5]);
        hackerTextEffect('speed_hack', response[6]);
        hackerAlphabetEffect('traffic_hack', 'MODERATE')
        mapRoute(response);
      } else {
        console.log('Error::', xhr.status);
      }
  };



  xhr.send(JSON.stringify(inputValues));
});


function mapRoute(response){
  console.log(response);
  const routeLayer = map.getLayer('lines');
  const existingSource = map.getSource('lines');
  console.log('the existing source is');
  console.log(existingSource);
  if (existingSource) {
    map.removeLayer('lines');
    map.removeSource('lines');
    console.log('removed source and layer lines');
  }

  map.flyTo({
    center: response[1],
    zoom: 12.5,
    essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });
  

  const featureList = response[0];

  // const featureList = [
  //   {
  //       'type': 'Feature',
  //       'properties': {
  //                       'color': '#EB455F' // red
  //       },
  //       'geometry': {
  //       'type': 'LineString',
  //       'coordinates': [
  //         [80.22057, 13.1335],
  //         [80.22052, 13.1331],
  //         [80.22052, 13.1331],
  //         [80.22012, 13.13312],
  //         [80.21971, 13.13287],
  //         [80.21953, 13.13287],
  //         [80.21931, 13.13283],
  //         [80.21891, 13.13281],
  //         [80.21878, 13.13281],
  //         [80.21838, 13.13281],
  //         [80.21797, 13.1328],
  //         [80.21797, 13.1328],
  //         [80.2175, 13.13281],
  //         [80.21683, 13.13282],
  //         [80.21638, 13.13282],
  //         [80.2162, 13.13282],
  //         [80.21587, 13.13282],
  //         [80.21587, 13.13282],
  //         [80.21539, 13.13278],
  //         [80.21495, 13.13177],
  //         [80.21457, 13.13101],
  //         [80.21448, 13.13083],
  //         [80.2144, 13.13065],
  //         [80.21429, 13.13047],
  //         [80.21421, 13.13038],
  //         [80.21409, 13.13017],
  //         [80.21409, 13.13017],
  //         [80.21382, 13.13019],
  //         [80.21366, 13.13003],
  //         [80.21341, 13.12981],
  //         [80.21288, 13.12941],
  //         [80.21241, 13.12917],
  //         [80.21209, 13.12901],
  //         [80.2113, 13.12858],
  //         [80.21077, 13.12827],
  //         [80.21059, 13.12817],
  //         [80.21037, 13.12804],
  //         [80.20913, 13.12732],
  //         [80.20867, 13.12706],
  //         [80.20844, 13.12692],
  //         [80.20796, 13.12666],
  //         [80.2077, 13.12651],
  //         [80.20734, 13.12631],
  //         [80.20674, 13.12596],
  //         [80.20651, 13.12584],
  //         [80.20634, 13.12574],
  //         [80.20607, 13.1256],
  //         [80.20588, 13.12547],
  //         [80.2054, 13.12519],
  //         [80.20524, 13.12512],
  //         [80.20502, 13.12501],
  //         [80.20475, 13.12486],
  //         [80.20464, 13.1248],
  //         [80.20451, 13.12473],
  //         [80.20421, 13.12457],
  //         [80.20397, 13.12445],
  //         [80.20374, 13.12432],
  //         [80.20326, 13.12404],
  //         [80.2031, 13.12395],
  //         [80.2029, 13.12385],
  //         [80.20252, 13.12363],
  //         [80.20239, 13.12354],
  //         [80.20188, 13.12322],
  //         [80.20159, 13.12306],
  //         [80.20131, 13.1229],
  //         [80.20078, 13.1225],
  //         [80.20064, 13.12235],
  //         [80.20043, 13.12211],
  //         [80.20023, 13.12184],
  //         [80.19978, 13.12108],
  //         [80.19954, 13.12053],
  //         [80.19946, 13.12034],
  //         [80.19939, 13.12018],
  //         [80.1993, 13.12001],
  //         [80.19925, 13.11991],
  //         [80.1992, 13.11982],
  //         [80.19913, 13.11969],
  //         [80.19895, 13.11939],
  //         [80.19852, 13.11861],
  //         [80.19814, 13.11787],
  //         [80.19806, 13.11766],
  //         [80.19798, 13.11739],
  //         [80.19794, 13.11723],
  //         [80.19791, 13.11707],
  //         [80.19789, 13.11696],
  //         [80.19782, 13.11653],
  //         [80.1978, 13.11641],
  //         [80.19772, 13.11589],
  //         [80.19764, 13.11533],
  //         [80.19755, 13.11462],
  //         [80.19748, 13.11403],
  //         [80.19742, 13.1135],
  //         [80.19729, 13.11226],
  //         [80.19725, 13.11183],
  //         [80.1972, 13.11146],
  //         [80.19695, 13.10994],
  //         [80.19629, 13.1086],
  //         [80.1957, 13.1076],
  //         [80.1955, 13.10725],
  //         [80.19541, 13.10711],
  //         [80.19522, 13.10678],
  //         [80.19513, 13.10661],
  //         [80.19507, 13.10648],
  //         [80.19498, 13.10625],
  //         [80.19476, 13.1056],
  //         [80.19469, 13.10513],
  //         [80.19468, 13.10409],
  //         [80.19463, 13.10336],
  //         [80.19459, 13.10282],
  //         [80.19457, 13.10249],
  //         [80.19456, 13.10229],
  //         [80.19452, 13.10205],
  //         [80.19454, 13.10202],
  //         [80.19455, 13.1018],
  //         [80.19453, 13.10174],
  //         [80.19459, 13.10146],
  //         [80.19461, 13.10128],
  //         [80.19463, 13.10106],
  //         [80.19479, 13.10045],
  //         [80.1953, 13.09964],
  //         [80.19591, 13.09916],
  //         [80.19636, 13.09895],
  //         [80.19681, 13.09868],
  //         [80.19739, 13.09852],
  //         [80.19756, 13.09847],
  //         [80.1978, 13.09838],
  //         [80.19856, 13.09757],
  //         [80.1987, 13.09699],
  //         [80.1987, 13.09493],
  //         [80.1987, 13.09483],
  //         [80.1987, 13.0942],
  //         [80.19871, 13.09401],
  //         [80.19871, 13.09383],
  //         [80.19871, 13.09345],
  //         [80.19871, 13.09317],
  //         [80.19871, 13.093],
  //         [80.1987, 13.09281],
  //         [80.19869, 13.09227],
  //         [80.19869, 13.09199],
  //         [80.19868, 13.09102],
  //         [80.19869, 13.09069],
  //         [80.19868, 13.09032],
  //         [80.19867, 13.09022],
  //         [80.19864, 13.0891]
  //               ]
  //       }
  //   },
  //   {
  //   'type': 'Feature',
  //   'properties': {
  //   'color': '#03C988' // blue
  //   },
  //   'geometry': {
  //   'type': 'LineString',
  //   'coordinates': [
  //     [80.19864, 13.0891],
  //     [80.19864, 13.08873],
  //     [80.19864, 13.08723],
  //     [80.19864, 13.0871],
  //     [80.19864, 13.08682],
  //     [80.19864, 13.08623],
  //     [80.19863, 13.08542],
  //     [80.19863, 13.08531],
  //     [80.19863, 13.08492],
  //     [80.19862, 13.08349],
  //     [80.19862, 13.08293],
  //     [80.19861, 13.08254],
  //     [80.19861, 13.08234],
  //     [80.19861, 13.08151],
  //     [80.19861, 13.08136],
  //     [80.19861, 13.08099],
  //     [80.19863, 13.08071],
  //     [80.19865, 13.08052],
  //     [80.19872, 13.08006],
  //     [80.19878, 13.07961],
  //     [80.19879, 13.0795],
  //     [80.1988, 13.0794],
  //     [80.19881, 13.07925],
  //     [80.19883, 13.07908],
  //     [80.19891, 13.07836],
  //     [80.19894, 13.07817],
  //     [80.19897, 13.07788],
  //     [80.19901, 13.07757],
  //     [80.19908, 13.07704],
  //     [80.20028, 13.07674],
  //     [80.20093, 13.07654],
  //     [80.20127, 13.07648],
  //     [80.20147, 13.07636],
  //     [80.20166, 13.07634],
  //     [80.20212, 13.07631],
  //     [80.20212, 13.07631],
  //     [80.20226, 13.07631],
  //     [80.20283, 13.07638],
  //     [80.2031, 13.07644],
  //     [80.20344, 13.07653],
  //     [80.21398, 13.07571],
  //     [80.21467, 13.07546],
  //     [80.21521, 13.07533],
  //     [80.21532, 13.07531],
  //     [80.21567, 13.07525],
  //     [80.21612, 13.07519],
  //     [80.21612, 13.07519],
  //     [80.21628, 13.07553]
  //             ]
  //       }
  //   },
  //   {

  //       'type': 'Feature',
  //       'properties': {
  //                       'color': '#03C988' // green
  //       },
  //       'geometry': {
  //       'type': 'LineString',
  //       'coordinates': [
  //         [80.22057, 13.1335],
  //         [80.22052, 13.1331],
  //         [80.22052, 13.1331],
  //         [80.22012, 13.13312],
  //         [80.21971, 13.13287],
  //         [80.21953, 13.13287],
  //         [80.21931, 13.13283],
  //         [80.21891, 13.13281],
  //         [80.21878, 13.13281],
  //         [80.21838, 13.13281],
  //         [80.21797, 13.1328],
  //         [80.21797, 13.1328],
  //         [80.2175, 13.13281],
  //         [80.21683, 13.13282],
  //         [80.21638, 13.13282],
  //         [80.2162, 13.13282],
  //         [80.21587, 13.13282],
  //         [80.21587, 13.13282],
  //         [80.21539, 13.13278],
  //         [80.21495, 13.13177],
  //         [80.21457, 13.13101],
  //         [80.21448, 13.13083],
  //         [80.2144, 13.13065],
  //         [80.21429, 13.13047],
  //         [80.21421, 13.13038],
  //         [80.21409, 13.13017],
  //         [80.21409, 13.13017],
  //         [80.21382, 13.13019],
  //         [80.21366, 13.13003],
  //         [80.21341, 13.12981],
  //         [80.21288, 13.12941],
  //         [80.21241, 13.12917],
  //         [80.21209, 13.12901],
  //         [80.2113, 13.12858],
  //         [80.21077, 13.12827],
  //         [80.21059, 13.12817],
  //         [80.21037, 13.12804],
  //         [80.20913, 13.12732],
  //         [80.20867, 13.12706],
  //         [80.20844, 13.12692],
  //         [80.20796, 13.12666],
  //         [80.2077, 13.12651],
  //         [80.20734, 13.12631],
  //         [80.20674, 13.12596],
  //         [80.20651, 13.12584],
  //         [80.20634, 13.12574],
  //         [80.20607, 13.1256],
  //         [80.20588, 13.12547],
  //         [80.2054, 13.12519],
  //         [80.20524, 13.12512],
  //         [80.20502, 13.12501],
  //         [80.20475, 13.12486],
  //         [80.20464, 13.1248],
  //         [80.20451, 13.12473],
  //         [80.20421, 13.12457],
  //         [80.20397, 13.12445],
  //         [80.20374, 13.12432],
  //         [80.20326, 13.12404],
  //         [80.2031, 13.12395],
  //         [80.2029, 13.12385],
  //         [80.20252, 13.12363],
  //         [80.20239, 13.12354],
  //         [80.20188, 13.12322],
  //         [80.20159, 13.12306],
  //         [80.20131, 13.1229],
  //         [80.20078, 13.1225],
  //         [80.20064, 13.12235],
  //         [80.20043, 13.12211],
  //         [80.20023, 13.12184],
  //         [80.19978, 13.12108],
  //         [80.19954, 13.12053],
  //         [80.19946, 13.12034],
  //         [80.19939, 13.12018],
  //         [80.1993, 13.12001],
  //         [80.19925, 13.11991],
  //         [80.1992, 13.11982],
  //         [80.19913, 13.11969],
  //         [80.19895, 13.11939],
  //         [80.19852, 13.11861],
  //         [80.19814, 13.11787],
  //         [80.19806, 13.11766],
  //         [80.19798, 13.11739],
  //         [80.19794, 13.11723],
  //         [80.19791, 13.11707],
  //         [80.19789, 13.11696],
  //         [80.19782, 13.11653],
  //         [80.1978, 13.11641],
  //         [80.19772, 13.11589],
  //         [80.19764, 13.11533],
  //         [80.19755, 13.11462],
  //         [80.19748, 13.11403],
  //         [80.19742, 13.1135],
  //         [80.19729, 13.11226],
  //         [80.19725, 13.11183],
  //         [80.1972, 13.11146],
  //         [80.19695, 13.10994],
  //         [80.19629, 13.1086],
  //         [80.1957, 13.1076],
  //         [80.1955, 13.10725],
  //         [80.19541, 13.10711],
  //         [80.19522, 13.10678],
  //         [80.19513, 13.10661],
  //         [80.19507, 13.10648],
  //         [80.19498, 13.10625],
  //         [80.19476, 13.1056],
  //         [80.19469, 13.10513],
  //         [80.19468, 13.10409],
  //         [80.19463, 13.10336],
  //         [80.19459, 13.10282],
  //         [80.19457, 13.10249],
  //         [80.19456, 13.10229],
  //         [80.19452, 13.10205],
  //         [80.19454, 13.10202],
  //         [80.19455, 13.1018],
  //         [80.19453, 13.10174],
  //         [80.19459, 13.10146],
  //         [80.19461, 13.10128],
  //         [80.19463, 13.10106],
  //         [80.19479, 13.10045],
  //         [80.1953, 13.09964],
  //         [80.19591, 13.09916],
  //         [80.19636, 13.09895],
  //         [80.19681, 13.09868],
  //         [80.19739, 13.09852],
  //         [80.19756, 13.09847],
  //         [80.1978, 13.09838],
  //         [80.19856, 13.09757],
  //         [80.1987, 13.09699],
  //         [80.1987, 13.09493],
  //         [80.1987, 13.09483],
  //         [80.1987, 13.0942],
  //         [80.19871, 13.09401],
  //         [80.19871, 13.09383],
  //         [80.19871, 13.09345],
  //         [80.19871, 13.09317],
  //         [80.19871, 13.093],
  //         [80.1987, 13.09281],
  //         [80.19869, 13.09227],
  //         [80.19869, 13.09199],
  //         [80.19868, 13.09102],
  //         [80.19869, 13.09069],
  //         [80.19868, 13.09032],
  //         [80.19867, 13.09022],
  //         [80.19864, 13.0891]
  //               ]
  //       }

  //   }
  // ];

  map.addSource('lines', {
    'type': 'geojson',
    'data': {

    'type': 'FeatureCollection',
    'features': featureList

    }

});




    map.addLayer({
      'id': 'lines',
      'type': 'line',
      'source': 'lines',
      'paint': {
      'line-width': 4,
      // Use a get expression (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-get)
      // to set the line-color to a feature property value.
      'line-color': ['get', 'color']
      }
      });
}


// const letters = '0123456789';
// let interval = null;

// document.querySelector('.title').onmouseover = (event) => {
//   let iteration = 0;

//   clearInterval(interval);

//   interval = setInterval(() => {
//     event.target.innerText = event.target.innerText
//       .split('')
//       .map((letter, index) => {
//         if (index < iteration) {
//           return event.target.dataset.value[index];
//         }
//         return letters[Math.floor(Math.random() * 9)];
//       })
//       .join('');
//     if (iteration >= event.target.dataset.value.length) {
//       clearInterval(interval);
//     }
//     iteration += 1 / 3;
//   }, 80);
// };





// text animation


function hackerTextEffect(targetElementId, newText) {
  const targetElement = document.getElementById(targetElementId);

  const letters = "0123456789";

  let interval = null;
    
  let iteration = 0;
    
  clearInterval(interval);
    
  interval = setInterval(() => {
      targetElement.innerText = targetElement.innerText
        .split("")
        .map((letter, index) => {
          if(index < iteration) {
            return newText[index];
          }
        
          return letters[Math.floor(Math.random() * 10)]
        })
        .join("");
      
      if(iteration >= newText.length){ 
        clearInterval(interval);
      }
      
      iteration += 1 / 10;
  }, 30);
}

function hackerAlphabetEffect(targetElementId, newText) {
  const targetElement = document.getElementById(targetElementId);

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWYZ";

  let interval = null;
    
  let iteration = 0;
    
  clearInterval(interval);
    
  interval = setInterval(() => {
      targetElement.innerText = targetElement.innerText
        .split("")
        .map((letter, index) => {
          if(index < iteration) {
            return newText[index];
          }
        
          return letters[Math.floor(Math.random() * 26)]
        })
        .join("");
      
      if(iteration > newText.length){ 
        clearInterval(interval);
      }
      
      iteration += 1 / 2;
  }, 100);
}


