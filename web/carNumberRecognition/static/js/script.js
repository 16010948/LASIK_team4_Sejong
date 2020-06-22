window.ondragover = function(e) { e.preventDefault(); return false };
window.ondrop = function(e) { e.preventDefault(); return false };

var fileName = document.getElementsByClassName('fileName');
var files = [];
var index = null;
var text = {'ga':'가','na':'나','da':'다','ra':'라','ma':'마','ha':'하',
            'gu':'거','nu':'너','du':'더','ru':'러','mu':'머','bu':'버','su':'서','u':'어','ju':'저','hu':'허',
            'go':'고','no':'노','do':'도','ro':'로','mo':'모','bo':'보','so':'소','o':'오','jo':'조','ho':'호',
            'goo':'구','noo':'누','doo':'두','roo':'루','moo':'무','boo':'부','soo':'수','woo':'우','joo':'주',}

function changeImage(e){
    files = e.target.files || e.dataTransfer.files;
    if (files.length > 1) {
        alert('하나의 이미지만 가능합니다.');
        return;
    }
    if (files[0].type.match(/image.*/)) {
        $('.drop_file_zone').css({
            "background-image": "url(" + window.URL.createObjectURL(files[0]) + ")",
            "outline": "none",
            "background-size": "100% 100%"
        });
        $('.guide').css({
            "visibility": "hidden"
        })
        $('.fileName').text(files[0].name);
    }else{
        alert('이미지가 아닙니다.');
        return;
    }
    
    index = null;
    $('.resultImg').css({
            "background-image": "none"
    });
    $('.alt').css({
             "display": "inline"
    });
    let plate = document.getElementById('plate');
    plate.innerText = "인식 결과";
    $('.save').attr('disabled', true);
}

document.addEventListener("DOMContentLoaded", function () {
    var input = document.querySelector( '.drop_file_zone' );
    input.addEventListener( 'change', changeImage);
    
});

function dragOver(e) {
    $(e.target).addClass('is-dragover');
}
function dragLeave(e) {
    $(e.target).removeClass('is-dragover');
}
function drop(e) {
    e.preventDefault();
    changeImage(e);

}

var modal = document.getElementsByClassName("modal");

var span = document.getElementsByClassName("close")[0];

function hiddenModal() {
    $(modal).css({
        "visibility": "hidden"
    })
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", (event)=> {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});


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

function super_resolution() {
    $('.save').attr('disabled', false);
    data = {
        'url' : 'media/OD/crop_img'+ ((index*1)+1) +'.jpg',
        'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
    }
    $.ajax({
        method: 'POST',
        url: '/resolution',
        data: data,
        dataType: 'json',
        success: function (response) {
            $('#SRimg').css({
                "background-image": "url(media/SR/SR.jpg?" + new Date().getTime()+")" ,
                "background-size": "100% 100%"
            });
            $('#SRalt').css({
                    "display": "none"
            });
            recognition();
            
        },
        error: function (response) {
             alert("it didnt work");
        }

    });
}

function restartClick() {
    location.reload(true);
}

function selectLP(id) {
    $('.imgSelect').css({
        'border': '0px'
    });
    $('#'+id).css({
        'border': '2px solid red'
    });
    index = id.slice(3)*1;
    $('.select').attr('disabled', false);
    
    
}

function run() {
    let modal = document.getElementById("resultModal");
    modal.remove();
    $('#ODimg').css({
        "background-image": "url(media/OD/crop_img"+ ((index*1)+1) +".jpg?"+ new Date().getTime()+")" ,
        "background-size": "100% 100%"
    });
    $('#ODalt').css({
        "display": "none"
    });
    super_resolution();
}

function object_detection(){
    if(files.length == 0){
        alert("파일을 입력해 주세요.");
        return ; 
    }
    let formData = new FormData();
    formData.append('file',files[0]);
    formData.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());

    $.ajax({
        method: 'POST',
        url: '/detection',
        data: formData,
        processData: false,
        contentType: false,

        success: function (response) {
            let container = document.getElementById("container");
            let modal = document.createElement("div");
            modal.setAttribute("class","modal");
            modal.setAttribute("id","resultModal");
            container.appendChild(modal);
            let modal_content = document.createElement("div");
            modal_content.setAttribute("class","modal-content");
            modal.appendChild(modal_content);
            var close_modal = document.createElement("div");
            close_modal.style.textAlign="right";
            modal_content.appendChild(close_modal);
            var close = document.createElement("span");
            close.setAttribute("class","close");
            close.setAttribute("onclick","hiddenModal()");
            close.innerHTML = "&times;";
            close_modal.appendChild(close);
            let divBtn = document.createElement("div");
            divBtn.setAttribute("class","divBtn");
            divBtn.style.display="flex";
            divBtn.style.justifyContent="center";
            for(let result in response.resultOD){
                if(response.resultOD[result] == '실행 결과가 없습니다.'){
                    let p = document.createElement("p");
                    p.innerHTML = response.resultOD[result];
                    p.style.fontSize="30px";
                    modal_content.appendChild(p);
                    let btnRestart = document.createElement("button");
                    btnRestart.setAttribute("class","btn");
                    btnRestart.innerHTML = "처음으로";
                    btnRestart.setAttribute("class","btn");
                    btnRestart.setAttribute("onclick","restartClick()");
                    divBtn.appendChild(btnRestart);
                    modal_content.appendChild(divBtn);
                    break;
                }
                else{
                    let imgSelect = document.createElement("img");
                    imgSelect.setAttribute("class","imgSelect");
                    imgSelect.setAttribute("id","img"+result);
                    imgSelect.setAttribute("src",response.resultOD[result] + "?" + new Date().getTime());
                    imgSelect.setAttribute("onclick","selectLP(this.id)");
                    imgSelect.style.maxWidth="200px";
                    imgSelect.style.flex="1";
                    divBtn.appendChild(imgSelect);
                }
            }
            if(response.resultOD[0] != '실행 결과가 없습니다.'){
                modal_content.appendChild(divBtn);
                let select = document.createElement("button");
                select.setAttribute("class","select");
                select.setAttribute("onclick","run()");
                select.setAttribute("disabled",true);
                select.innerHTML = "선택";
                modal_content.appendChild(select);
            }
        },
        error: function (response) {
             alert("it didnt work");
        },

    });
}

function imgDownload(){
    let plate = document.getElementById('plate');
    let fileName = plate.innerHTML+".jpg";
    var a = document.createElement("a");
    a.style.display = "none";
    a.href = "media/Rec/Rec.jpg";
    a.download = "logo";

    document.body.appendChild(a);
    a.click();

    setTimeout(function() {
      document.body.removeChild(a)
    }, 100)
    
}


