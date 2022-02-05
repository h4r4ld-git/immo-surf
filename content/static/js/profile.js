$(document).ready(async () => {
  await $('#tabs-paramC').toggle();
  await $('#tabs button').on('click', async function(){
    if ($('#' + $(this).attr('id') + 'C').is(':hidden')){
      var t = await $(this).attr('id');
      $('#tabs button').each(async function(e1, val1){
        if ($('#' + $(this).attr('id') + 'C').is(':visible')){
          await $('#' + $(this).attr('id') + 'C').toggle('drop', {direction: 'left'}, 500)
          await $('#'+ t + 'C').toggle('drop', {direction: 'right'}, 500)
          $('#'+ t + 'C').insertAfter('#' + $(this).attr('id') + 'C');
        }
      })
    }
  });
})

$(document).ready(async () => {
  $(".arrow").on("click", async () => {
    $('#profile').toggle('slide', {direction: 'right'}, 1000)
  })
})

var aff;
function profileInit(){
  aff = (event) => {
    $(document).ready(function() {
      if (!$("#" + event.srcElement.id).is(".selected")){
        $("div[id^=aff]").each(function(){
          if($(this).is(':visible'))
          {
            $(this).toggle()
          }
        })
        $("input[id^=but]").each(function(){
          if ($(this).is(".selected")){
            $(this).removeClass("selected");
          }
        })
        $("#" + event.srcElement.id).addClass("selected");
        var source = event.target || event.srcElement;
        $("[id='aff" + source.name + "']").toggle(100)
      }
    })

  }
}

$(document).ready(() => {
  if ($('#profile').is(':empty')){
    $("#prices").toggle()
  }
})

$(document).ready(() => {
  $('#profileButton').on("click", () => {
    if ($('#profile').is(':empty')){
      $("#glob").slideToggle(500);
      $('#connectionButton').click();
      $("#popup").slideToggle(500);
      $('#connectionButton').focus();
    } else {
      $('#profile').toggle('slide', {direction: 'right'}, 1000)
      profileInit()
      $('#tabs #tabs-affiches').focus();
    }
  })
})

$(document).ready(() => {
  $('#addAff').click(() => {
    $('#affChoice').slideToggle(100);
  })
  $('#affChoice .modal-close').click(() => {
    $('#affChoice').slideToggle(100);
  })
  $('.delete').click(() => {
    $("#newSubAff").slideToggle()
  })
})

$(document).ready(() => {
  $('button[id^="addUserAff"]').each(function(){
    $(this).on('click', function(){
      const sub = $(this).attr('id').split("addUserAff")[1]
      $("#newSubAffSubID").val(sub)
      $('#affChoice').slideToggle();
      $('#newSubAff').slideToggle();
    })
  })
})
