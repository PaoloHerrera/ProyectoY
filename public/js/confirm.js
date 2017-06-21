$(function(){
  $('#con').submit(function(event){
    event.preventDefault();
    var data = {};
    data.prizeName = prizeName;
    data.prizeImage = prizeImage;
    data.localName = localName;
    data.branchName = branchName;

    $.ajax({
      type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
      url: 'http://localhost:3000/confirmPrize',
      success: function(data) {
        console.log('success');
        console.log(JSON.stringify(data));
      }
    });
  });
});
