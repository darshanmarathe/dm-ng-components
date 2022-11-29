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
  selector: 'dm-autocomplete',
  templateUrl: 'Autocomplete.component.html',
  styleUrls: ['Autocomplete.component.css']
})

export class AutoComplete implements AfterViewInit, OnInit {

  @ViewChild('jsonform') jsonform: ElementRef<HTMLInputElement>;
  @Output()
  change = new EventEmitter<Event>()
  jsonEditor: any = undefined;


  constructor(private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document) { }


  ngOnInit(): void {

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
