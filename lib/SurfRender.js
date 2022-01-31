function getAffsContainer(affs){
  ret = ``
  affs.forEach(function(val, index){
    ret += `
    <div id="aff${val.address}" style="width:65%; float:right; display:none;">
      <label id="${val.address}lbl" style="color: white;">exp:</label>
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">WHAT?</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input name="immob" id="${val.address}immob1" class="input" placeholder="WHAT?" value="${val.title}" required>
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
              <textarea maxlength="847" name="descr" id="${val.address}descr15" class="textarea" placeholder="Description | Beschrijving" required>${val.description}</textarea>
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
              <input type="text" name="descr0" id="${val.address}descr01" class="input" placeholder="€" value="${val.prix}" required>
            </p>
          </div>
        </div>
      </div>
      <button id="del${val.address}" style="width:32.5%; float:right; background-color:red;" type="button" name="button">Delete</button>
      <button id="edit${val.address}" style="width:32.5%; float:right;" type="button" name="button">Edit</button>
    </div>
    `
  })
  return ret;
}

function getAffs(affs){
  var ret = ``;
  affs.forEach(function(val, index){
    ret += `<input id='but${index}' class='profile-button' type='button' name='${val.address}' value='${val.address}' onclick='aff(event)'>`;
  })
  return ret;
}

function getAbonnementList(abonnement){
  var ret = `
  <div class="select">
    <select name="newSub">
  `;
  if (!abonnement || !abonnement.name){
    ret += `
      <option value="OnePlus">One+</option>
      <option value="Limitless">Limitless</option>`
  } else if (abonnement.name === "OnePlus"){
    ret += `
      <option value="None">Aucun</option>
      <option value="Limitless">Limitless</option>`
  } else if (abonnement.name === "Limitless"){
    ret += `
      <option value="None">Aucun</option>
      <option value="OnePlus">One+</option>`
  }
  ret += `
    </select>
  </div>
  `
  return ret;
}

function getAbonnementName(abonnement){
  if (!abonnement || !abonnement.name){
    return "<input class=\"input\" value=\"Pas d'abonnement\" readonly>";
  } else {
    return `<input class="input" value="${abonnement.name}" readonly>`;
  }
}

function profile(user, affs, abonnement){
  return `
  <div class="columns full-height">
    <div class="column is-1">
      <div class="arrow">
        <div class="arrow-top"></div>
        <div class="arrow-bottom"></div>
      </div>
    </div>
    <div class="column">
      <div id="tabs">
        <button id="tabs-affiches">Affiches</button>
        <button id="tabs-param">Paramètres</button>
      </div>
      <div class="container" id="tabs-paramC">
        <div class="profiles-container-head">
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
          <br><br>
          <div class="column container is-6">
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">Nom</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <p class="control">
                    <input name="newName" id="NewName" class="input is-5" placeholder="Nom de l'utilisateur" value="${user.name}" required>
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
                    <input name="newMail" id="NewMail" class="input is-5" placeholder="Nom de l'utilisateur" value="${user.email}" required>
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
            <input name="newTel" id="NewTel" class="input is-5" placeholder="Nom de l'utilisateur" value="${user.tel}" required>
            </p>
            </div>
            </div>
            </div>
            <button id="editUser" type="button" name="button">Modifier</button>
            <br><br>
            <div class="field is-horizontal">
            <div class="field-label is-normal">
            <label class="label">Abonnement</label>
            </div>
            <div class="field-body">
            <div class="field">
            <p class="control">
            ${getAbonnementName(abonnement)}
            </p>
            </div>
            </div>
            </div>
          </div>
          <div class="column container is-3">
            <form action="/checkout-subscription" method="post">
              <div class="field is-horizontal">
              <div class="field-label is-normal">
              <p class="control">
                ${getAbonnementList(abonnement)}
              </p>
              </div>
              <div class="field-body">
              <div class="field">
              <button id="changeSub" type="submit">Changer</button>
              </div>
              </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="container" id="tabs-affichesC">
        <div class="profiles-container">
          <div class="profiles-list scroll">
            ${getAffs(affs)}
          </div>
          ${getAffsContainer(affs)}
        </div>
      </div>
      <div id="conf" class="confirm">
        <h1>Are you sure?</h1>
        <input type="button" name="yes" value="YES">
        <input type="button" name="no" value="NO">
      </div>
    </div>
  </div>
  `
}
module.exports = {profile}
