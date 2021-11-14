function recognition() {
    let formData = new FormData();
    let file = new File([new Blob()],"media/crop_img"+ (index+1) +".jpg" , { type: "image/jpeg",});
    formData.append('file',file);
    formData.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());
    $.ajax({
        method: 'POST',
        url: '/recognition',
        data: formData,
        processData: false,
        contentType: false,

        success: function (response) {
            let str = "";
            let plate = document.getElementById('plate');
            for(let x in response.resultText){
                if(response.resultText[x] in text){
                    str += text[response.resultText[x]]+" ";
                }
                else str += response.resultText[x];
            }
            plate.innerText = str;
            $('#RNimg').css({
                "background-image": "url("+ response.resultRN+ "?" + new Date().getTime() +")" ,
                "background-size": "100% 100%"
            });
            $('#RNalt').css({
                    "display": "none"
            });
        },
        error: function (response) {
             alert("it didnt work");
        },

    });
}