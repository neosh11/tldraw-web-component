import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TldrawWCUserProps } from 'tldraw-web-component';
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
  /** This function name is attached to the global scope, required due to the cooked nature of webcomponents */
  globalMultiplayerAssetsFuncName = `__SECRET_DOM_DO_NOT_USE_MULTIPLAYER_ASSETS_FUNC_${this.generateRandomString()}`;
  globalUserFuncName = `__SECRET_DOM_DO_NOT_USE_USER_FUNC_${this.generateRandomString()}`;

  async ngOnInit(): Promise<void> {
    await import('tldraw-web-component');    
    const container = document.querySelector('#tldraw');
    if (!container) {
      console.log('No container found');
      return;
    }

    const tldrawElement = document.createElement('tldraw-sync-web-component');
    // tldrawElement.setAttribute('debug', '1');
    tldrawElement.setAttribute('room-id', '10');
    tldrawElement.setAttribute('server-uri', 'http://localhost:5858');

    (window as any)[this.globalMultiplayerAssetsFuncName] = this.multiplayerAssets.bind(this);
    tldrawElement.setAttribute('multiplayer-assets-func', this.globalMultiplayerAssetsFuncName);

    (window as any)[this.globalUserFuncName] = this.getUserFunc.bind(this);
    tldrawElement.setAttribute('get-user-func', this.globalUserFuncName);
    container.appendChild(tldrawElement);
  }

  ngOnDestroy(): void {
    // Clean up the global functions
    delete (window as any)[this.globalMultiplayerAssetsFuncName];
  }

  public multiplayerAssets(): any {
    return {
      async upload(_asset: any, file: any) {
        const id = Math.random().toString(36).substr(2, 9); // Generate a unique ID
        const objectName = `${id}-${file.name}`;
        const url = `${'http://localhost:5858/uploads'}/${encodeURIComponent(objectName)}`;
        const response = await fetch(url, {
          method: 'PUT',
          body: file,
        });
        if (!response.ok) {
          throw new Error(`Failed to upload asset: ${response.statusText}`);
        }
        return url;
      },
      resolve(asset: any) {
        return asset.props.src;
      },
    }
  }

  public getUserFunc(): TldrawWCUserProps {
    console.log('getUserFunc called');
    return {
      id: '123',
      name: 'John Doe',
    }
  }

  private generateRandomString(): string {
    return Math.random().toString(36).replace(/[^a-z]+/g, '') + Date.now().toString();
  }

}
