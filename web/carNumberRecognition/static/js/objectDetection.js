function restart() {
    location.reload(true);
}

function getPlateImages(e){
    if(e.status === 200){
        const imgBtns = document.querySelector(".modal__content__result__img-btns");
        for(let result in e.responseText.resultOD){
            if(response.resultOD[result] === '실행 결과가 없습니다.'){
                break;
            }
            else{
                let img = document.createElement("img");
                img.setAttribute("class","modal__content__result__img-btn");
                img.setAttribute("id","img"+result);
                img.setAttribute("src",e.responseText.resultOD[result] + "?" + new Date().getTime());
                img.setAttribute("onclick",`selectLP(${this.id})`);
                img.style.maxWidth = "200px";
                img.style.flex = "1";
                divBtn.appendChild(img);
            }
        }
    }else if(e.status === 400){
        alert("실패했습니다ㅠㅠ");
    }
}

function objectDetection(){
    const file = document.querySelector( '.main-section__form__input' ).files;
    
    if(files.length === 0){
        alert("파일을 입력해 주세요.");
        return ; 
    }
    
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file',files[0]);
    formData.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());
    
    xhr.addEventListener("load", getPlateImages);
    xhr.open('POST', '/detection');
    xhr.send(formData);
}
