const TEXT = {'ga':'가','na':'나','da':'다','ra':'라','ma':'마','ha':'하',
            'gu':'거','nu':'너','du':'더','ru':'러','mu':'머','bu':'버','su':'서','u':'어','ju':'저','hu':'허',
            'go':'고','no':'노','do':'도','ro':'로','mo':'모','bo':'보','so':'소','o':'오','jo':'조','ho':'호',
            'goo':'구','noo':'누','doo':'두','roo':'루','moo':'무','boo':'부','soo':'수','woo':'우','joo':'주',};

let index;

function changeImage(e) {
    const files = e.target.files || e.dataTransfer.files;
    
    if (files.length > 1) {
        alert("하나의 이미지만 가능합니다.");
        return;
    }
    
    if (files[0].type.match(/image.*/)) {
        const dropZone = document.querySelector(".main-section__form__drop-zone");
        dropZone.style.backgroundImage = `url(${window.URL.createObjectURL(files[0])})`;
        dropZone.style.outline = "none";
        dropZone.style.backgroundSize = "100% 100%";
        
        const guide = document.querySelector("main-section__form__drop-zone__guide");
        guide.style.display = "none";
        
        const fileName = document.querySelector("main-section__info__file-name");
        fileName.innerText = files[0].name;
        
    }else{
        alert("이미지 파일만 가능합니다.");
        return;
    }
}

const hiddenModal = () => {
    const modal = document.querySelector(".modal");
    modal.style.display = "none";
}

function imgDownload() {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = "media/Rec/Rec.jpg";
    a.download = "logo";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function run() {
    const modal = document.querySelector(".modal");
    modal.style.display = "none";
    
    const ODImg = document.querySelector("#ODImg");
    ODImg.style.backgroundImage = `url(media/OD/crop_img${parseInt(index) + 1 + new Date().getTime()}.jpg)`;
    ODImg.style.backgroundSize = "100% 100%";
    
    const ODAlt = document.querySelector("#ODAlt");
    ODAlt.style.display = "none";
    
    super_resolution();
}

document.addEventListener("DOMContentLoaded", () =>  {
    this.addEventListener("dragover",(e) => e.preventDefault());
    this.addEventListener("drop",(e) => e.preventDefault());
    
    const input = document.querySelector( '.main-section__form__input' );
    input.addEventListener( 'change', changeImage);
    
    const dropZone = document.querySelector(".main-section__form__drop-zone");
    dropZone.addEventListener("dragover", (e) => e.target.classList.add('is-dragover'));
    dropZone.addEventListener("dragleave", (e) => e.target.classList.roveem('is-dragover'));
    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        changeImage(e);
    });
    
    const modal = document.querySelector(".modal");
    modal.addEventListener("click", (e) => hiddenModal());
});


