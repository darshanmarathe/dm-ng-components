import { Renderer2 } from "@angular/core";


export class DocUtils  {

  constructor(private document:any){}
    /**
* Append the JS tag to the Document Body.
* @param renderer The Angular Renderer
* @param src The path to the script
* @returns the script element
*/
public loadJsScript(renderer: Renderer2, src: string): HTMLScriptElement {
  const script = renderer.createElement('script');
  script.type = 'text/javascript';
  script.src = src;
  renderer.appendChild(this.document.body, script);
  return script;
}

/**
* Append the JS tag to the Document Body.
* @param renderer The Angular Renderer
* @param src The path to the script
* @returns the script element
*/
 public loadCss(renderer: Renderer2, href: string): HTMLLinkElement {
  const link = renderer.createElement('link');
  link.rel = 'stylesheet';
  link.src = href;
  renderer.appendChild(this.document.body, link);
  return link;
}

}
