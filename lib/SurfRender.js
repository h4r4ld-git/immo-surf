function getAffsContainer(affs){
  ret = ``
  affs.forEach(function(val, index){
    var expDate;
    if (val.ThreeMonth){
      expDate = new Date(val.ThreeMonth.setMonth(val.ThreeMonth.getMonth()+3))
    } else if (val.FourMonth) {
      expDate = new Date(val.FourMonth.setMonth(val.FourMonth.getMonth()+4))
    } else if (val.FiveMonth) {
      expDate = new Date(val.FiveMonth.setMonth(val.FiveMonth.getMonth()+5))
    }
    ret += `
    <div id="aff${val._id}" style="width:65%; float:right; display:none;">
      <span id="${val._id}lbl" class="tag">
        exp: ${expDate.toLocaleDateString()}
      </span>
      <br><br>
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">WHAT?</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input id="${val._id}immob1" class="input" placeholder="WHAT?" value="${val.title}" required>
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
              <textarea maxlength="847" id="${val._id}descr15" class="textarea" placeholder="Description | Beschrijving" required>${val.description}</textarea>
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
              <input type="text" id="${val._id}descr01" class="input" placeholder="€" value="${val.prix}" required>
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
              <input type="text" id="${val._id}tel05" class="input" placeholder="€" value="${val.tel}" required>
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
              <input type="text" id="${val._id}addrChange" class="input" type="search" placeholder="Adresse de l'affiche" class="pac-target-input input" value="${val.address}" autocomplete="off" required>
            </p>
          </div>
        </div>
      </div>
      <button id="del${val._id}" style="width:32.5%; float:right; background-color:red;" type="button" name="button">Delete</button>
      <button id="edit${val._id}" style="width:32.5%; float:right;" type="button" name="button">Edit</button>
    </div>
    `
  })
  return ret;
}

function getAffs(affs){
  var ret = ``;
  affs.forEach(function(val, index){
    ret += `<input id='but${val._id}' class='profile-button' type='button' name='${val.address}' value='${val.address}' onclick='aff(event)'>`;
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

function getAbonnementsAffs(abonnements){
  var ret = ``
  abonnements.forEach(function(val, index){
    if (val.affs > 0){
      ret += `
      <div class="column">
        <button class="button is-success is-fullwidth" id="addUserAff${val.subID}">
          <div style="height: 100%">Validité d'affiche: ${val.affExpire} mois<br>Quantité: ${val.affs} affiches</div>
        </button>
      </div>
      `
    }
  })
  return ret;
}

function profile(user, affs, abonnement, abonnements){
  return `
  <div id="newSubAff" class="modal">
    <div class="modal-background"></div>
    <form action="/newAffSub" method="post">
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Affiche</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <input type="hidden" id="newSubAffSubID" name="subID">
          <input type="hidden" id="affLoc" name="affLoc">
          <div class="field">
            <label class="label">Titre</label>
            <div class="control">
              <div class="select">
                <select name="titre">
                  <option value="Appartement">Appartement</option>
                  <option value="Maison">Maison | Villa</option>
                  <option id="vImmob" value="Immeuble">Immeuble</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Autres Biens">Autres Biens | Andere</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">Type vente</label>
            <div class="control">
              <div class="select">
                <select name="locvent">
                  <option value="Vendre">Vente</option>
                  <option value="Louer">Location</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">Description</label>
            <div class="control">
              <textarea name="description" class="textarea" type="textarea" placeholder="Description de l'affiche"></textarea>
            </div>
          </div>
          <div class="field">
            <label class="label">Prix</label>
            <div class="control">
              <input name="prix" class="input" type="input" placeholder="Prix de l'affiche">
            </div>
          </div>
          <div class="field">
            <label class="label">Tel</label>
            <div class="control">
              <input name="tel" class="input" type="input" placeholder="Tel de l'affiche">
            </div>
          </div>
          <div class="field">
            <label class="label">Mail</label>
            <div class="control">
              <input name="mail" class="input" type="input" placeholder="Mail de l'affiche">
            </div>
          </div>
          <div class="field">
            <label class="label">Adresse</label>
            <div class="control">
              <input name="addr" id="addrSub" type="search" placeholder="Adresse de l'affiche" class="pac-target-input input" autocomplete="off">
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button type="submit" class="button is-success">Publier</button>
        </footer>
      </div>
    </form>
  </div>
  <div id="affChoice" class="modal">
    <div class="modal-background"></div>

    <div class="modal-content">
      <div class="container">
        <div class="columns is-multiline has-text-centered">
          ${getAbonnementsAffs(abonnements)}
        </div>
      </div>
    </div>

    <button class="modal-close is-large" aria-label="close"></button>
  </div>
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
                          <h6 class="f-w-600" style="color: white;">${user.name}</h6>
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
                    <input name="newMail" id="NewMail" class="input is-5" placeholder="Adresse email" value="${user.email}" required>
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
            <input name="newTel" id="NewTel" class="input is-5" placeholder="Numéro de téléphone" value="${user.tel}" required>
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
        <div class="columns">
          <div class="column">
            <input id="addAff" class="button is-success" type="button" value="+">
          </div>
        </div>
        <div class="columns has-text-centered">
          <div class="column">
            <input id="newUserMail" class="input" placeholder="Mail de l'utilisateur">
          </div>
          <div class="column">
            <input id="newUserTel" class="input" placeholder="Tel de l'utilisateur">
          </div>
          <div class="column">
            <input id="newUserAdd" class="button is-success" type="button" value="Ajouter">
          </div>
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
