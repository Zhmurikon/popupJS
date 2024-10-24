interface FormRawData {
    name: string;
    label?: string | null;
    type?: string | null;
    placeholder?: string | null;
    collapse?: string | null;
    class?: string | null;
    id?: string | null;
}

interface PopupSettings {
    id?: string;
    css?: string | null;
    formdata?: Array<FormRawData> | null;
}

const CloseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g><path d="M18.717 6.697l-1.414-1.414-5.303 5.303-5.303-5.303-1.414 1.414 5.303 5.303-5.303 5.303 1.414 1.414 5.303-5.303 5.303 5.303 1.414-1.414-5.303-5.303z" /></g></svg>`

function closeOpenedPopup(event: Event){
    let _target = event.target as HTMLElement
    let _popup = _target.closest(".pjs-popup_wrapper") as HTMLDivElement
    if(!_popup){
        console.log("closeOpenedPopup called outside popup")
        return
    }
    _popup.classList.remove("active")
}

function openPopupByID(event: Event){
    event.preventDefault()
    let _target = event.target as HTMLElement
    if(!_target){
        console.error("Event target is null")
        return
    }
    let _id = _target.getAttribute("href")
    if(!_id){
        console.error("Href attribute is null")
        return
    }
    _id = _id.replace("#","")
    let _popup = document.getElementById(_id)
    if(!_popup){
        console.error("Cant`t find popup with id", _id)
        return
    }
    _popup.classList.add("active")
}


class PopupBase{
    name: string;
    id: string;
    html: string | null;
    contentElement: HTMLDivElement;
    constructor(name: string, settings: PopupSettings = {}){
        this.name = name;
        this.id = settings.id || "pjs-popup_" + name;
        this.buildHtmlBase()
    }
    buildHtmlBase(){
        let _wrapper: HTMLDivElement = document.createElement("div")
        _wrapper.classList.add("pjs-popup_wrapper");
        _wrapper.id = this.id;
        let _container = document.createElement("div");
        let _close_zone = document.createElement("div");
        _close_zone.classList.add("pjs-popup_close_zone") ;
        _close_zone.addEventListener("click", closeOpenedPopup)
        _container.classList.add("pjs-popup_container") ;
        _wrapper.appendChild(_container);
        _wrapper.appendChild(_close_zone);
        let _content = document.createElement("div");
        let _header = document.createElement("div");
        _content.classList.add("pjs-popup_content");
        _header.classList.add("pjs-popup_header");
        _container.appendChild(_content);
        _container.appendChild(_header);
        _header.innerHTML = CloseIcon;
        let _close_icon = _header.firstChild as SVGElement;
        _close_icon.addEventListener("click", closeOpenedPopup);
        _close_icon.classList.add("pjs-popup_close_icon");

        document.body.appendChild(_wrapper);
        this.linkPopup();
        this.contentElement = _content;
    }
    linkPopup(){
        let _links = document.querySelectorAll('[href="#'+this.id+'"]')
        for (let i = 0; i < _links.length; i++) {
            const _link = _links[i];
            _link.addEventListener("click", openPopupByID)
        }
    }
}

class PopupSuccess extends PopupBase{
    constructor(name: string, settings: PopupSettings = {}){
        super(name, settings)
    }
}

class PopupForm extends PopupBase{
    formdata: Array<FormRawData>
    constructor(name: string, settings: PopupSettings = {}){
        super(name, settings);
        if(settings.formdata){
            this.formdata = settings.formdata
        }else{
            throw new Error('add form data');
        }
        this.buildForm()
    }
    buildForm(){
        console.log("buildForm")
        let _form = document.createElement("form")
        this.formdata.forEach(inputData => {
            let _input_placeholder = document.createElement("div")
            if(inputData.class) _input_placeholder.classList.add(inputData.class)
            if(inputData.id) _input_placeholder.id = inputData.id
            if(inputData.label){
                let _input_label = document.createElement("label")
                _input_label.setAttribute("for", inputData.name)
                _input_label.innerText = inputData.label
                _input_placeholder.appendChild(_input_label)
            }
            let _input = document.createElement("input")
            _input.name = inputData.name
            if(inputData.type) _input.type = inputData.type
            if(inputData.placeholder) _input.placeholder = inputData.placeholder

            _input_placeholder.appendChild(_input)

            _form.appendChild(_input_placeholder)
        });
        this.contentElement.appendChild(_form)
    }
}


window.addEventListener("load", (event) => {
    let _popup = new PopupBase("test0")
    let _popup2 = new PopupForm(
        "test",
        {
            formdata:[
                {
                    name: 'testinput',
                    label: "ararar"
                },
                {
                    name: 'Ororo',
                    label: "Ororo",
                    placeholder: "hehehe"
                }
            ]
        }
    )
    // _popup.buildHtml()
});