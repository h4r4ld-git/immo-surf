function getAffs(affs){
  var ret = ``;
  affs.forEach(function(val, index){
    ret += `<input id='but${index}' class='profile-button' type='button' name='${val.address}' value='${val.address}' onclick='aff(event)'>`;
  })
  return ret;
}

function profile(user, affs){
  return `
  <div class="columns">
    <div class="column is-1">
      <div class="arrow">
        <div class="arrow-top"></div>
        <div class="arrow-bottom"></div>
      </div>
    </div>
    <div class="column">
      <div class="profiles-container" style="height: 350px;">
        <div class="page-content page-container" id="page-content">
          <div class="padding">
            <div class="row container d-flex justify-content-center">
              <div class="col-xl-6 col-md-12">
                <div class="card user-card-full">
                  <div class="row m-l-0 m-r-0">
                    <div class="col-sm-4 bg-c-lite-green user-profile" style="float:left;">
                      <div class="card-block text-center text-white">
                        <div class="m-b-25"> <img src="https://i0.wp.com/beagence.com/wp-content/uploads/2021/07/222223814_996278831130222_86742044337327412_n.png?ssl=1&resize=100%2C100" class="img-radius" alt="User-Profile-Image"> </div>
                        <h6 class="f-w-600" style="color: white;">Immo.Surf</h6>
                      </div>
                    </div>
                    <div class="col-sm-8" style="float:right; text-align:center;width:350px;">
                      <div class="card-block">
                        <h6 class="m-b-20 p-b-5 b-b-default f-w-600">Information</h6>
                        <div class="row" style="margin-top:50px;">
                          <div class="col-sm-6" style="float:left; width:40%">
                            <p class="m-b-10 f-w-600" style="float:left;">Email</p>
                            <h6 class="text-muted f-w-400" style="float:left;"><?php echo $pmail?></h6>
                          </div>
                          <div class="col-sm-6" style="float:right; width:40%">
                            <p class="m-b-10 f-w-600" style="float:left;">Phone</p>
                            <h6 class="text-muted f-w-400" style="float:left;"><?php echo $ptel?></h6>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-sm-6" style="float:left; width:40%">
                            <p class="m-b-10 f-w-600" style="float:left; margin-top:10px;">Nombre d'affiches</p>
                            <h6 class="text-muted f-w-600" style="float:left;"></h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="profiles-container">
        <div class="profiles-list scroll">
          ${getAffs(affs)}
        </div>
          <div class="glob" style="width:65%; float:right;">
              <div class="bclr">
                  <div class="center">
                       <div class="form">
                            <label id="lbl" style="color: white;">exp:</label><br>
                            <textarea name="immob" id="immob" class="input1" placeholder="WHAT?" required></textarea><br>
                            <textarea maxlength="847" name="descr" id="descr" class="input2" placeholder="Description | Beschrijving" required></textarea>
                            <input type="number" name="descr0" id="descr0" class="input2-0" placeholder="€" required>
                            <input type="tel" pattern="[+]{1}[0-9]{11,14}" name="descr2" id="descr2" class="input2-1" placeholder="Phone n°" required>
                            <input type="email" name="descr1" id="descr1" class="input2-2" placeholder="@Mail" required>
                            <input name="addr" id="addr" type="search" style="margin-top:10px;background-color:white;height:50px;width:85%;border-radius:5px;z-index: 289;" placeholder="Address" class="pac-target-input" autocomplete="off" required>
                            <br><br>
                            <label class="lab3" style="font-size:300%;">A VENDRE | TE KOOP</label>
                       </div>
                  </div>
              </div>
          </div>

          <button id="del" style="width:32.5%; float:right; background-color:red;" type="button" name="button" onclick="conf()">Delete</button>
          <button id="ed" style="width:32.5%; float:right;" type="button" name="button" onclick="edit_but()">Edit</button>
          <script>
            let autocomplete;
            let address1Field;
            let address2Field;
            let postalField;

            function initAutocomplete() {
              address1Field = document.querySelector("#addr");
              // Create the autocomplete object, restricting the search predictions to
              // addresses in the US and Canada.
              autocomplete = new google.maps.places.Autocomplete(address1Field);
              address1Field.focus();
              // When the user selects an address from the drop-down, populate the
              // address fields in the form.
              autocomplete.addListener("place_changed", fillInAddress);
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
                    address1 = address1 + " " + component.long_name;
                    break;
                  }

                  case "route": {
                    address1 =  address1 + " " + component.long_name;
                    break;
                  }

                  case "locality": {
                    address1 =  address1 + " " + component.long_name;
                    break;
                  }
                }
              }
              address1Field.value = address1;
              // After filling the form with address components from the Autocomplete
              // prediction, set cursor focus on the second address line to encourage
              // entry of subpremise information such as apartment, unit, or floor number.
            }

            function edt(){
              var coord = $.get('https://nominatim.openstreetmap.org/search?format=json&q='+document.getElementById("addr").value, function(data) {
                jQuery(document).ready(function($){
                  $.ajax({
                    url: "https://beagence.com/wp-admin/admin-ajax.php",
                    data: {
                      "action" : "igi",
                      "location" : data[0]["lat"] + "," + data[0]["lon"],
                      "address" : document.getElementById("addr").value,
                      "title" : document.getElementById("immob").value,
                      "description" : document.getElementById("descr").value,
                      "mail" : document.getElementById("descr1").value.toLowerCase(),
                      "tel" : document.getElementById("descr2").value,
                      "prix" : document.getElementById("descr0").value,
                      "pay" : true,
                    },
                    success: function(data){
                      console.log("hieaaa");
                      location.reload(true);
                    }
                  })
                });
              });
            };
            function rm_but(){
              for (var i = 1; i < <?php echo $i ?>; i++) {
                if (document.getElementById("but" + i.toString()).classList.contains("selected")){
                  var coord = $.get('https://nominatim.openstreetmap.org/search?format=json&q='+document.getElementById("but" + i.toString()).value, function(data) {
                    jQuery(document).ready(function($){
                      $.ajax({
                        url: "https://beagence.com/wp-admin/admin-ajax.php",
                        data: {
                          "action" : "rmv",
                          "location" : data[0]["lat"] + "," + data[0]["lon"],
                        },
                        success: function(data){
                          console.log("hieaaa");
                        }
                      })
                    });
                  });
                };
              };
              location.reload(true);
            };
            function edit_but(){
              //rm(document.getElementById("addr").value);
              var coord = $.get('https://nominatim.openstreetmap.org/search?format=json&q='+document.getElementById("addr").value, function(data) {
                jQuery(document).ready(function($){
                  $.ajax({
                    url: "https://beagence.com/wp-admin/admin-ajax.php",
                    data: {
                      "action" : "rmv",
                      "location" : data[0]["lat"] + "," + data[0]["lon"],
                    },
                    success: function(data){
                      console.log("hieaaa");
                      edt();
                    }
                  })
                });
              });
            }

          </script>
      </div>
      <script>
        document.getElementById("del").disabled = true;
        document.getElementById("ed").disabled = true;
        function aff(event){
          if (!document.getElementById(event.srcElement.id).classList.contains("selected")){
            document.getElementById(event.srcElement.id).classList.add("selected");
          };
          for (var i = 1; i < <?php echo $i ?>; i++) {
            if (i != event.srcElement.id.split("but")[1]){
              if (document.getElementById("but" + i.toString()).classList.contains("selected")){
                document.getElementById("but" + i.toString()).classList.remove("selected");
              };
            };
          }
          var source = event.target || event.srcElement;
          document.getElementById("immob").value = affs[source.name][0];
          document.getElementById("descr").value = affs[source.name][1];
          document.getElementById("descr1").value = affs[source.name][2];
          document.getElementById("descr2").value = affs[source.name][3];
          document.getElementById("descr0").value = affs[source.name][4];
          document.getElementById("addr").value = source.name;
          document.getElementById("del").disabled = false;
          document.getElementById("ed").disabled = false;
          document.getElementById("lbl").innerHTML = "exp: " + affs[source.name][5];

        }
      </script>
      <div id="conf" class="confirm">
        <h1>Are you sure?</h1>
        <input type="button" name="yes" value="YES">
        <input type="button" name="no" value="NO">
      </div>
      <script>
        function conf(){
          if (confirm("Are you sure? / Vous étes sùr?")){
            rm_but();
          }
        };
      </script>
    </div>
  </div>
  `
}
module.exports = {profile}
