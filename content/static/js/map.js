var bc;
try {
  bc = new BroadcastChannel('fm86.7');
}
catch(err) {
  bc = "error";
}
var params = [
  {
    name: "payment",
    value: "true"
  },
];

function submit_pay(){
  var form = document.getElementById('PayForm');
  for(var i=0; i < form.elements.length; i++){
    if(form.elements[i].value == '' && form.elements[i].hasAttribute('required')){
      alert('L\'affiche est incomplete! | Incomplete affiche/flyer');
      return false;
    }
  }
  $.each(params, function(i,param){
      $('<input />').attr('type', 'hidden')
          .attr('name', param.name)
          .attr('value', param.value)
          .appendTo('#PayForm');
  });
  window.open("","newWindow","location=yes,width=800,height=800");
  var coord = $.get('https://nominatim.openstreetmap.org/search?format=json&q='+document.getElementById("addr").value, function(data) {
    if (bc != "error"){
      bc.onmessage = function (ev) {
        if (ev.data == "pay"){
          Madder(data[0]["lat"] + "," + data[0]["lon"],document.getElementById("immob").value,document.getElementById("descr").value,document.getElementById("descr1").value,document.getElementById("descr2").value,document.getElementById("descr0").value, document.getElementById("addr").value);
          activate();
        }
      }
    } else {
      location.href = "https://beagence.com/surf"
    }
    document.getElementById("coord").value = data[0]["lat"] + "," + data[0]["lon"];
    document.getElementById("PayForm").submit();
  });
}

function openCode(evt, codeName) {
  // All variables must be declared
  var i, tabcontent, tablinks;

  // Hide all elements with class="tabcontent"
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Select all elements with class="tablinks" and remove the "active" class
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Display the current tab, and add an "active" class to that displayed button that opened the tab
  document.getElementById(codeName).style.display = "block";
  evt.className += " active";
}

function openCode1(evt, codeName) {
  // All variables must be declared
  var i, tabcontent, tablinks;

  // Hide all elements with class="tabcontent"
  tabcontent = document.getElementsByClassName("tabcontent1");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Select all elements with class="tablinks" and remove the "active" class
  tablinks = document.getElementsByClassName("tablinks1");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Display the current tab, and add an "active" class to that displayed button that opened the tab
  document.getElementById(codeName).style.display = "block";
  evt.className += " active";

  // Add to form
  document.getElementById("lorv").value = codeName;

  if (codeName == "Louer"){
    if (!document.getElementById("vImmob").hasAttribute("hidden")){
      document.getElementById("vImmob").setAttribute("hidden", "");
    }
  } else {
    if (document.getElementById("vImmob").hasAttribute("hidden")){
      document.getElementById("vImmob").removeAttribute("hidden");
    }
  }
}

// Map

var mymap;
var markers;
function loadMap(){
  mymap = L.map('mapid').setView([50.503887, 4.469936], 9);
  markers = L.markerClusterGroup();
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mymap);
}
function refreshMap(){
  mymap.off();
  mymap.remove();
  loadMap();
}
$(document).ready(() => {
  loadMap();
})

function Madder(address, immob, descr, descr1, descr2, descr0, adStr){

  if (address != undefined){
    var streetviewurl = "https://maps.googleapis.com/maps/api/streetview?size=300x200&location=" + address.split(",")[0] + "," + address.split(",")[1] + "&fov=80&pitch=0&key=AIzaSyAjnjte7sQ7iJC9uZK9IyR2QkOj7VH48h4";
    var greenIcon = L.icon({
      iconUrl: "https://i1.wp.com/beagence.com/wp-content/uploads/2021/07/winterlogo-e1608520348804-2.png",

      iconSize:     [50, 64], // size of the icon
      iconAnchor:   [4, 62], // point of the icon which will correspond to marker's location
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    var img = $('<img />', {src : streetviewurl});
    var marker = L.marker([address.split(",")[0], address.split(",")[1]], {icon: greenIcon});
    markers.addLayer(marker);
    var pp = ('<a target="_blank" href="https://www.google.com/maps/place/' + address.split(",")[0] + "," + address.split(",")[1] + '">' + img[0]['outerHTML'] + '</a>' + '<div class="leaflet-popup-hcontent"><p style=\'text-align:center;color:#000033;font-size:30px ;background-color:#ff4f00;border-radius:2px;border:2px\'>' +  immob + '</p><p style=\'background-color:white;border-radius:2px\'>' + descr +'</p>' + "<a href='mailto:" + descr1.toLowerCase() + "'>Mail: " + descr1.toLowerCase() + "</a>" + '<p style=\'background-color:white;border-radius:2px\'>Tel: ' + descr2 +'</p>' + '<p style=\'background-color:white;border-radius:2px\'>Prix: ' + descr0 +'</p></div><button type="button" name="affSave" id="affSave" onclick="affSave();">Save</button><input id="affLoc" type="hidden" value="' + adStr + '">')
    marker.bindPopup(pp);
    mymap.addLayer(markers);
  };
}

function activate(){
    $("#popup").slideToggle(500);
}

let autocomplete;
let autocomplete1;
let autocomplete2;
let addressField;
let address1Field;
let address2Field;
let postalField;

function initAutocomplete() {
  $(document).ready(function() {
    address1Field = document.querySelector("#addr");
    address2Field = document.querySelector("#addr1");
    addressField = document.querySelector("#addrSub");
    // Create the autocomplete object, restricting the search predictions to
    // addresses in the US and Canada.
    autocomplete = new google.maps.places.Autocomplete(address1Field);
    autocomplete1 = new google.maps.places.Autocomplete(address2Field);
    autocomplete2 = new google.maps.places.Autocomplete(addressField);
    address1Field.focus();
    address2Field.focus();
    addressField.focus();
    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete.addListener("place_changed", fillInAddress);
    autocomplete1.addListener("place_changed", fillInAddress1);
    autocomplete2.addListener("place_changed", fillInAddress2);
  })
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  const place = autocomplete.getPlace();
  let address1 = "";

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  // place.address_components are google.maps.GeocoderAddressComponent objects
  // which are documented at http://goo.gle/3l5i5Mr
  for (const component of place.address_components) {
    const componentType = component.types[0];
    switch (componentType) {
      case "street_number": {
        address1 = `${address1} ${component.long_name}`;
        break;
      }

      case "route": {
        address1 = `${component.long_name} ${address1}`;
        break;
      }

      case "locality": {
        address1 = `${address1}, ${component.long_name}`;
        break;
      }
    }
  }
  address1Field.value = address1;
  // After filling the form with address components from the Autocomplete
  // prediction, set cursor focus on the second address line to encourage
  // entry of subpremise information such as apartment, unit, or floor number.
}

function fillInAddress1() {
  // Get the place details from the autocomplete object.
  const place = autocomplete1.getPlace();
  let address1 = "";

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  // place.address_components are google.maps.GeocoderAddressComponent objects
  // which are documented at http://goo.gle/3l5i5Mr
  for (const component of place.address_components) {
    const componentType = component.types[0];
    switch (componentType) {
      case "locality": {
        address1 = `${address1} ${component.long_name}`;
        break;
      }
      case "administrative_area_level_1": {
        address1 = `${address1} ${component.long_name}`;
      }
      case "country": {
        address1 = `${address1} ${component.long_name}`;
      }
    }
  }
  address2Field.value = address1;
  // After filling the form with address components from the Autocomplete
  // prediction, set cursor focus on the second address line to encourage
  // entry of subpremise information such as apartment, unit, or floor number.
}

function fillInAddress2() {
  // Get the place details from the autocomplete object.
  const place = autocomplete2.getPlace();
  let address1 = "";

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  // place.address_components are google.maps.GeocoderAddressComponent objects
  // which are documented at http://goo.gle/3l5i5Mr
  for (const component of place.address_components) {
    const componentType = component.types[0];
    switch (componentType) {
      case "street_number": {
        address1 = `${address1} ${component.long_name}`;
        break;
      }

      case "route": {
        address1 = `${component.long_name} ${address1}`;
        break;
      }

      case "locality": {
        address1 = `${address1}, ${component.long_name}`;
        break;
      }
    }
  }
  console.log("hi")
  addressField.value = address1;
  var coord = $.get('https://nominatim.openstreetmap.org/search?format=json&q='+address1, function(data) {
    $('#affLoc').val(data[0]["lat"] + "," + data[0]["lon"])
  })

  // After filling the form with address components from the Autocomplete
  // prediction, set cursor focus on the second address line to encourage
  // entry of subpremise information such as apartment, unit, or floor number.
}

$(function() {
  var loc = document.getElementById("loc");
  var vente = document.getElementById("vente");
  loc.addEventListener("click", function() {
    if (loc.hasAttribute("selected")){
      loc.style = "width:10%; height: 50px;";
      loc.removeAttribute("selected");
    }
    else {
      loc.style = "width:10%; height: 50px; border: 0; border-radius: 5px; background-color: #000033; color: #FF4F00;";
      loc.setAttribute("selected", "");
    }
  })
  vente.addEventListener("click", function() {
    if (vente.hasAttribute("selected")){
      vente.style = "width:10%; height: 50px;";
      vente.removeAttribute("selected");
    }
    else {
      vente.style = "width:10%; height: 50px; border: 0; border-radius: 5px; background-color: #000033; color: #FF4F00;";
      vente.setAttribute("selected", "");
    }
  })
});

$(function() {
  // on page load, set the text of the label based the value of the range
    $('#distancelabel').text($('#distance').val() + " KM");

    // setup an event handler to set the text when the range value is dragged (see event for input) or changed (see event for change)
    $('#distance').on('input change', function () {
        $('#distancelabel').text($(this).val() + " KM");
    });
})

$(document).ready(() => {
  $.post("/getAffs",function(data){
    Object.keys(data).forEach(function(key) {
      Madder(data[key].location, data[key].title, data[key].description, data[key].mail, data[key].tel, data[key].prix, data[key].address);
    })
  })
});

$(function() {
  $('#filtre').on('click', function() {
    var initAddr = document.getElementById("addr1").value;

    refreshMap();
    $(document).ready(function(){
      $.post("/getAffs", function(data){
        const affs = data;
        var coord = $.get('https://nominatim.openstreetmap.org/search?format=json&q='+initAddr, function(data) {
          Object.keys(affs).forEach(function(key) {
              var accepted = true;
              const locvent = affs[key].locvent;
              if (!document.getElementById("loc").hasAttribute("selected")){
                if (affs[key].locvent == "Louer"){
                  accepted = false;
                }
              }
              if (!document.getElementById("vente").hasAttribute("selected")){
                if (affs[key].locvent == "Vendre"){
                  accepted = false;
                }
              }
              if (document.getElementById("Biens").value != ""){
                if (document.getElementById("Biens").value != affs[key].title){
                  accepted = false;
                }
              }
              if (document.getElementById("Prix-min").value != ""){
                if ((document.getElementById("Prix-min").value - affs[key].prix) > 0){
                  accepted = false;
                }
              }
              if (document.getElementById("Prix-max").value != ""){
                if ((document.getElementById("Prix-max").value - affs[key].prix) < 0){
                  accepted = false;
                }
              }
              if (document.getElementById("addr1").value != ""){
                var marker = L.marker([data["0"].lat, data["0"].lon]);
                var marker1 = L.marker([affs[key].location.split(",")[0], affs[key].location.split(",")[1]])
                if ((marker.getLatLng().distanceTo(marker1.getLatLng()).toFixed(0)/1000) > document.getElementById("distance").value){
                  accepted = false;
                }
                if (accepted){
                  Madder(affs[key].location, affs[key].title, affs[key].description, affs[key].mail, affs[key].tel, affs[key].prix, affs[key].address);
                }
              } else if (accepted) {
                Madder(affs[key].location, affs[key].title, affs[key].description, affs[key].mail, affs[key].tel, affs[key].prix, affs[key].address);
              }
            })
          });
        }
      )
    });
  })
})

function remRLI(event){
  document.getElementById(event['srcElement']['title']).remove();
}

function affSave(){
  var urlrock;
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
    urlrock = "https://i0.wp.com/beagence.com/wp-content/uploads/2021/09/rocket.png?ssl=1&resize=219%2C219";
  } else {
    urlrock = "images/rocket.png";
  }
  $.when($('#trainD').append('<img id="train" class="train" src="' + urlrock + '" style="width: 200px; height:200px;">')).done(function() {
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function Tutor() {
      await sleep(700);
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
          || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
          document.getElementById("train").style.top = "100%";
      } else {
        document.getElementById("train").style.left = "80%";
      }
      await sleep(5000);
      document.getElementById("train").remove();
      $('#rooting-list').append('<div id="' + document.getElementById("affLoc").value + '" class="routing-list-items"><p style="width: 70%; float: left;">' + document.getElementById("affLoc").value + '</p><div class="imgcontainer1"><span onclick="remRLI(event);" class="close1" title="' + document.getElementById("affLoc").value + '">×</span></div></div>');
    }
    Tutor();
  })
}
$(document).ready(() => {
  $('#rbut').on("click", function() {
    var hrf = "https://www.google.com/maps/dir/";
    $.when(
      $('#rooting-list').children('div').each(function () {
        hrf += this.id + "/"; // "this" is the current element in the loop
      })
    ).done(function() {
      window.open(hrf,"","location=yes,width=800,height=800");
    })
  })

  $('#rbut1').on("click", function() {
    document.getElementById("outR").style.display = "block";
    document.getElementById("surf-container").style.display = "none";
    document.getElementById("rooting-container").style.display = "block";
    document.getElementById("rooting-container").style.width = "100%";
    document.getElementById("rooting-button").style.width = "100%";
    document.getElementById("float-rooting-container").style.width = "100%";
  })
})

function outR(){
  document.getElementById("surf-container").style.display = "block";
  document.getElementById("rooting-container").style.display = "none";
}



$(document).ready(() => {
  $('#prices').on('click', (e) => {

      var container = $(".services");

      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0)
      {
          $("#prices").toggle()
      }

  })
})

$(document).ready(() => {
  $('#afficheBut').on("click", () => {
    $(document).ready(() => {
      $('#btaffiche').click();
      $('#btaffiche1').click();
      activate();
      $('#btaffiche').focus();
      $('#btaffiche1').focus();
    })
  })
})

$(document).ready(() => {
  $('#packOneBut').on("click", function() {
    $('#prices').slideToggle();
    $('#btaffiche').click();
    $('#btaffiche1').click();
    activate();
    $('#btaffiche').focus();
    $('#btaffiche1').focus();
  })
  $('#packOnePlusBut').on("click", function() {
    $('#prices').slideToggle();
    $('#connectionButton').click();
    activate();
    $('#connectionButton').focus();
  })
  $('#packUnlimitedBut').on("click", function() {
    $('#prices').slideToggle();
    $('#connectionButton').click();
    activate();
    $('#connectionButton').focus();
  })
})

function success(msg) {
  return `
  <article class="message is-primary">
  <div class="message-body">
  ${msg}
  </div>
  </article>`;
}

function error(msg) {
  return `
  <article class="message is-danger">
  <div class="message-body">
  ${msg}
  </div>
  </article>`;
}

$(document).ready(() => {
  $('#registerBut').click(() => {
    $.post('/register', {
        "mail" : $('#umail').val(),
        "tel" : $('#utel').val(),
      }, (data) => {
        var regMessage;
        if (data === "Empty") {
          regMessage = error("Veuillez remplire chaque champs pour vous inscrire");
        } else if (data === "Mail"){
          regMessage = error("Votre adresse email n'est pas valide")
        } else if (data === "Phone"){
          regMessage = error("Votre numéro de GSM n'est pas valide")
        } else if (data === "Found"){
          regMessage = error(`
            L'adresse email et le numéro de GSM se trouve déja dans la base.
            Connectez vous ou indiquez d'autres coordonnées.
          `);
        } else if (data === "Valid") {
          $('#umail').val("")
          $('#utel').val("")
          regMessage = success("Votre profil à été crée avec succés. Veuillez consulter votre boite email pour récupérer le PIN");
        }
        $('#register-response').html(regMessage)
      }
    )
  })
})

$(document).ready(() => {
  $('#connectBut').click(() => {
    $.post('/login', {
        "mail" : $('#umail1').val(),
        "tel" : $('#utel1').val(),
        "pin" : $('#mpin').val()
      }, (data) => {
        var logMessage;
        if (data === "Empty") {
          logMessage = error("Veuillez remplire chaque champs pour vous connecter")
        } else if (data === "Mail"){
          logMessage = error("Votre adresse email n'est pas valide")
        } else if (data === "Phone"){
          logMessage = error("Votre numéro de GSM n'est pas valide")
        } else if (data === "NotFound"){
          logMessage = error("L'adresse email n'est pas enregistré dans la base")
        } else if (data === "BadPass"){
          logMessage = error("Mot de passe incorrect")
        } else if (data === "Valid"){
          logMessage = success("Vous étes connecté")
          window.location.reload();
        }
        $('#login-response').html(logMessage)
      }
    )
  })
})

$(document).ready(() => {
  $('#genPin').click(() =>{
    document.getElementById("genLabel").innerHTML = "Envoye en cours...";
    $.post('/validPin', {
        "mail" : $('#umail1').val()
      }, (data) => {
        if (data === "sent"){
          document.getElementById("genLabel").innerHTML = "Le mail a été envoyé";
        } else if (data === "Mail"){
          document.getElementById("genLabel").innerHTML = "Données incorrect";
        } else if (data === "Empty"){
          document.getElementById("genLabel").innerHTML = "Le champ de l'email est vide";
        } else if (data === "NotFound"){
          document.getElementById("genLabel").innerHTML = "Aucun utilisateur est associé à cet email";
        }
      }
    )
  })
})

$(document).ready(() => {
  $('.box').toggle();
  $('#loop').click(() => {
    $('.box').slideToggle(500);
  })
})

$(document).ready(() => {
  $("#closeCookieConsent").on('click', () => {
    $("#cookieConsent").toggle();
  })
  $("#closeCookieConsentBut").click(() => {
    $("#cookieConsent").toggle();
  })
})

$(document).ready(() => {
  $("#tarifsBut").click(() => {
    $("#prices").toggle(100)
  })
})
