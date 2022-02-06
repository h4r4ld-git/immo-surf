$(document).ready(() => {
  $("button[id^='del']").each((e, es) => {
    $(es).click(() => {
      const id = $(es).attr("id").replace("del", "")
      if (confirm("Are you sure? / Vous étes sùr?")){
        $.post('/DeleteAff', {
            "id" : id,
          }, (data) => {
            window.location.reload();
          }
        )
      }
    })
  })
  $("button[id^='edit']").each((e, es) => {
    $(es).click(() => {
      const id = $(es).attr("id").replace("edit", "")
      if (confirm("Are you sure? / Vous étes sùr?")){
        $.post('/EditAff', {
            "id" : id,
            "title" : $("[id='" + id + "immob1']").val(),
            "description": $("[id='" + id + "descr15']").val(),
            "prix" : $("[id='" + id + "descr01']").val(),
            "addr" : $("[id='" + id + "addrChange']").val(),
            "tel" : $("[id='" + id + "tel05']").val(),
          }, (data) => {
            window.location.reload();
          }
        )
      }
    })
  })
})
