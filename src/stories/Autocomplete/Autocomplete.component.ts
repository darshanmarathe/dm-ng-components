import { DOCUMENT } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';
import { Component, ViewChild, ElementRef, AfterViewInit, Renderer2, Input, Inject, OnInit } from '@angular/core';
import { DocUtils } from '../docUtils';
import { ViewEncapsulation } from '@angular/core';



@Component({
  selector: 'dm-autocomplete',
  templateUrl: 'Autocomplete.component.html',
  styleUrls: ['Autocomplete.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AutoComplete implements AfterViewInit, OnInit {

  @ViewChild('myInput') inp: ElementRef<HTMLInputElement>;

  @Output()
  change = new EventEmitter<any>()
  @Output()
  input = new EventEmitter<string>()

  //#region Input Props

  @Input()
  public records: any[] = []
  @Input()
  public placeholder: string = ''
  @Input()
  public keyprop: string = 'key'
  @Input()
  public textprop: string = 'name'
  @Input()
  public keepopen: boolean = false
  @Input()
  public texttemplate: string = null
  @Input()
  public template: string = null
  @Input()
  public mincharAjax: number = 3
  @Input()
  public url: string = null
  @Input()
  public inputClass: string = 'dm-textbox'

  @Input()
  public id: string = 'dm-autocomplete'

  //#endregion


  //#region Properties

  private _isLoading: boolean;
  public get isLoading(): boolean {
    return this._isLoading;
  }
  public set isLoading(v: boolean) {
    this._isLoading = v;
  }


  //#endregion



  constructor(private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document) { }


  ngOnInit(): void {
    setTimeout(() => {
      this.setAutoComplete()
    }, 200);
  }

  setAutoComplete(records: any[] = undefined) {

    if (records) {
      this.autocomplete(this.inp.nativeElement, records)

    } else {
      this.autocomplete(this.inp.nativeElement, this.records)

    }
  }

  autocomplete(inp: HTMLInputElement, rec: any[]) {

    let arr = rec != null ? rec : this.records;
    const that = this;
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    let currentFocus: number;
    const Tmpl = (rec: any, _tempStr: string) => {


      let _template = _tempStr;

      //Get Child
      const gc = (key: string, item: any) => {

        let retItem = item;
        const keys = key.split('.');
        for (const _key of keys) {
          const split = _key.split('.');
          const newKey = split.length > 1 ? split[1] : split[0];
          retItem = retItem[newKey]
        }


        return retItem;
      }
      const re = /{(.*?)}/g;

      const tkeys = _template.match(re)

      tkeys.forEach((k) => {
        k = k.replace('{', '').replace('}', '')
        if (k.indexOf('.') === -1)
          _template = _template.replace(`{${k}}`, rec[k]);
        else
          _template = _template.replace(`{${k}}`, gc(k, rec))

      })

      return _template;

    }

    function addActive(x: any) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x: any[]) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }

    function closeAllLists(elmnt: HTMLElement | EventTarget = undefined) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.querySelectorAll(".autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }

    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", async function (e) {
      e.preventDefault();
      var a, b, i, val: any = this.value;

      if (val !== 0)
        //that.fireEvent('input', 'value', val)
that.input.emit(val)
        /*close any already open lists of autocompleted values*/
        if (that.url != null && that.mincharAjax <= val.length) {
          if (that.isLoading === true) return;
          const res = await fetch(that.url.replace('=q', `=${val}`))
          const records = await res.json();
          that.isLoading = false;
          arr = records;
        }
      closeAllLists();
      if (!val) { return false; }
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      if (arr.length === 0) arr = that.records;
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i][that.textprop].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = that.template != null ? Tmpl(arr[i], that.template) : "<strong>" + arr[i][that.textprop].substr(0, val.length) + "</strong>";
          if (that.template == null) {

            b.innerHTML += arr[i][that.textprop].substr(val.length);
          }
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i][that.keyprop] + "'>";
          b.innerHTML += "<input type='hidden' value='" + ((that.texttemplate != null) ? Tmpl(arr[i], that.texttemplate) : arr[i][that.textprop]) + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function (e) {
            /*insert the value for the autocomplete text field:*/
            inp.value = this.getElementsByTagName("input")[1].value;
            inp.dataset['key'] = this.getElementsByTagName("input")[0].value;
            //that.fireEvent('change', 'value', { key: inp.dataset.key, value: inp.value })
            that.change.emit({ key: inp.dataset['key'], value: inp.value })
            /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/
            closeAllLists();
          });
          a.appendChild(b);
        }
      }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
      var x: any = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
    });


    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
      if (that.keepopen === false)
        closeAllLists(e.target);
    });
  }

  LoadExternerDeps() {
    const doc = new DocUtils(this.document);
    doc.loadJsScript(this.renderer, "https://cdn.jsdelivr.net/npm/@json-editor/json-editor@latest/dist/jsoneditor.min.js");
    doc.loadCss(this.renderer, "https://use.fontawesome.com/releases/v5.6.1/css/all.css");
    doc.loadCss(this.renderer, "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/4.6.2/css/bootstrap.min.css")
  }

  ngAfterViewInit() {


  }
}
