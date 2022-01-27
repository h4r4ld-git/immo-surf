function getAffs(affs){
  var ret = ``;
  affs.forEach(function(val, index){
    ret += `<input id='but${index}' class='profile-button' type='button' name='${val.address}' value='${val.address}' onclick='aff(event)'>`;
  })
  return ret;
}

function profile(user, affs){
  return `
  <script>

    function aff(event){
      if (!document.getElementById(event.srcElement.id).classList.contains("selected")){
        document.getElementById(event.srcElement.id).classList.add("selected");
      };
      for (var i = 0; i < ${affs.length}; i++) {
        if (i != event.srcElement.id.split("but")[1]){
          if (document.getElementById("but" + i.toString()).classList.contains("selected")){
            document.getElementById("but" + i.toString()).classList.remove("selected");
          };
        };
      }
      var source = event.target || event.srcElement;
      const affs = ${JSON.stringify(affs)}.filter(obj => obj.address === source.name)[0];
      document.getElementById("immob1").value = affs.title;
      $("#descr15").val(affs.description);
      document.getElementById("descr11").value = affs.mail;
      document.getElementById("descr21").value = affs.tel;
      document.getElementById("descr01").value = affs.prix;
      $("#addr15").val(affs.address);
      document.getElementById("del1").disabled = false;
      document.getElementById("ed1").disabled = false;
      document.getElementById("lbl").innerHTML = "exp: " + affs.exp;

    }
    $(document).ready(function(){
      document.getElementById("del1").disabled = true;
      document.getElementById("ed1").disabled = true;
    })
  </script>
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
                        <div class="columns">
                          <div class="column">
                            <div class="field is-horizontal">
                              <div class="field-label is-normal">
                                <label class="label">Email</label>
                              </div>
                              <div class="field-body">
                                <div class="field">
                                  <p class="control">
                                    ${user.email}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="columns">
                          <div class="column">
                            <div class="field is-horizontal">
                              <div class="field-label is-normal">
                                <label class="label">Tel</label>
                              </div>
                              <div class="field-body">
                                <div class="field">
                                  <p class="control">
                                    ${user.tel}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="columns">
                          <div class="column">
                            <div class="field is-horizontal">
                              <div class="field-label is-normal">
                                <label class="label">Nombre d'affiches</label>
                              </div>
                              <div class="field-body">
                                <div class="field">
                                  <p class="control">
                                    ${affs.length}
                                  </p>
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
          </div>
        </div>
      </div>
      <div class="profiles-container">
        <div class="profiles-list scroll">
          ${getAffs(affs)}
        </div>
        <div style="width:65%; float:right;">
          <label id="lbl" style="color: white;">exp:</label>
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">WHAT?</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <textarea name="immob" id="immob1" class="input" placeholder="WHAT?" required></textarea>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Description | Beschrijving</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <textarea maxlength="847" name="descr" id="descr15" class="input" placeholder="Description | Beschrijving" required></textarea>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Prix</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <input type="text" name="descr0" id="descr01" class="input" placeholder="€" required>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Tel</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <input type="text" pattern="[+]{1}[0-9]{11,14}" name="descr2" id="descr21" class="input" placeholder="Phone n°" required>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Email</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <input type="text" name="descr1" id="descr11" class="input" placeholder="@Mail" required>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Adresse</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <input name="addr" id="addr15" type="search" placeholder="Address" class="input" autocomplete="off" required>
                </p>
              </div>
            </div>
          </div>
        </div>

        <button id="del1" style="width:32.5%; float:right; background-color:red;" type="button" name="button" onclick="conf()">Delete</button>
        <button id="ed1" style="width:32.5%; float:right;" type="button" name="button" onclick="edit_but()">Edit</button>
      </div>
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
