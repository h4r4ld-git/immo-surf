$(document).ready(() => {
  $("button[id^='del']").each((e, es) => {
    $(es).click(() => {
      const addr = $(es).attr("id").replace("del", "")
      if (confirm("Are you sure? / Vous étes sùr?")){
        $.post('/DeleteAff', {
            "address" : addr,
          }, (data) => {
            window.location.reload();
          }
        )
      }
    })
  })
  $("button[id^='edit']").each((e, es) => {
    $(es).click(() => {
      const addr = $(es).attr("id").replace("edit", "")
      if (confirm("Are you sure? / Vous étes sùr?")){
        $.post('/EditAff', {
            "address" : addr,
            "title" : $("[id='" + addr + "immob1']").val(),
            "description": $("[id='" + addr + "descr15']").val(),
            "prix" : $("[id='" + addr + "descr01']").val(),
          }, (data) => {
            window.location.reload();
          }
        )
      }
    })
  })
})
