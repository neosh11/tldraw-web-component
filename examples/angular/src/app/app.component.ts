import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TldrawWebcomponentGetPropsFunc } from 'tldraw-web-component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: [
    './app.component.css',
  ],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('tldraw') tldraw!: ElementRef;
  /**
   * This function name is attached to the global scope,
   * required due to the nature of web-components.
   */
  globalGetPropsFuncName = `__SECRET_DOM_DO_NOT_USE_GET_PROPS_FUNC_${this.generateRandomString()}`;

  async ngOnInit(): Promise<void> {
    await import('tldraw-web-component');
    const container = document.querySelector('#tldraw');
    if (!container) {
      console.log('No container found');
      return;
    }

    const tldrawElement = document.createElement('tldraw-sync-web-component');
    (window as any)[this.globalGetPropsFuncName] = this.getPropsFunc.bind(this);
    tldrawElement.setAttribute('get-props-func', this.globalGetPropsFuncName);
    container.appendChild(tldrawElement);
  }

  ngOnDestroy(): void {
    delete (window as any)[this.globalGetPropsFuncName];
  }

  public getPropsFunc: TldrawWebcomponentGetPropsFunc = () => {
    return {
      serverUri: 'http://localhost:5172/connect/hello',
      tldrawUserPreferences: {
        id: "Math.random()",
        name: "John Doe",
      },
      assets: {
        upload: async () => ({
          src: "url",
        }),
        resolve: async () => "url",
      },
      tldrawProps: {}
    }
  }

  private generateRandomString(): string {
    return Math.random().toString(36).replace(/[^a-z]+/g, '') + Date.now().toString();
  }
}
