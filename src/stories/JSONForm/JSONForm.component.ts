import { DOCUMENT } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';
import { Component, ViewChild, ElementRef, AfterViewInit, Renderer2, Input, Inject, OnInit } from '@angular/core';
import { DocUtils } from '../docUtils';


declare global {
  interface Window {
    JSONEditor: any;
  }
}

@Component({
  selector: 'dm-json-form',
  templateUrl: 'JSONForm.component.html',
  styleUrls: ['JSONForm.component.css']
})

export class JSONForm implements AfterViewInit, OnInit {

  @ViewChild('jsonform') jsonform: ElementRef<HTMLInputElement>;
  @Output()
  change = new EventEmitter<Event>()
  jsonEditor: any = undefined;

  @Input()
  schema: any = {}

  @Input()
  data: any = {}


  @Input()
  enabled: boolean = true

  @Input()
  title: string = 'JSON Form Component From Darshan'

  private editorOptions = {
    iconlib: "fontawesome5",
    object_layout: "normal",
    schema: this.schema || {},
    show_errors: "interaction",
    theme: "bootstrap4",

    startval: this.data || {},
  };

  inter: NodeJS.Timer;


  constructor(private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document) {
    this.setUpEditor.bind(this);
    this.initJsoneditor.bind(this);
    this.validate.bind(this)
  }


  ngOnInit(): void {

  }


  setUpEditor() {
    if (this.jsonEditor) {
      this.jsonEditor.destroy();
    }

    this.editorOptions.schema = this.schema;

    this.editorOptions.startval = this.data;

    this.jsonEditor = new window.JSONEditor(
      this.jsonform.nativeElement,
      this.editorOptions
    );
    console.log("Inside SetupEditor", this.jsonEditor)
    this.jsonEditor.on("change", () => {
      if (this.validate()) {
        const value = this.jsonEditor.getValue();
        console.warn(value, "value")

        this.change.emit(value);
      }

    });
    this.jsonEditor.on("ready", () => {
      // Now the api methods will be available

      if (this.enabled !== true) {
        this.jsonEditor.disable();
      }
    });
    console.log(this.jsonEditor)
  }

  validate() {
    const errors = this.jsonEditor.validate();

    return errors.length === 0;
  }

  initJsoneditor() {
    // destroy old JSONEditor instance if exists


    if (window.JSONEditor) {
      this.setUpEditor();
    } else {

      this.inter = setInterval(() => {
        console.warn(window.JSONEditor)

        if (window.JSONEditor && typeof this.editorOptions !== 'string') {
          clearInterval(this.inter);
          this.setUpEditor();
        }
      }, 3000);
    }
    // new instance of JSONEditor

    // listen for changes
  };



  LoadExternerDeps() {
    const doc = new DocUtils(this.document);
    doc.loadJsScript(this.renderer, "https://cdn.jsdelivr.net/npm/@json-editor/json-editor@latest/dist/jsoneditor.min.js");
    doc.loadCss(this.renderer, "https://use.fontawesome.com/releases/v5.6.1/css/all.css");
    doc.loadCss(this.renderer, "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/4.6.2/css/bootstrap.min.css")
  }

  ngAfterViewInit() {



    if (this.jsonform !== undefined) {

      this.LoadExternerDeps()
      this.initJsoneditor();

    }
  }
}
