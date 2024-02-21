import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, makeStateKey } from '@angular/core';
import { TransferState } from '@angular/core';
import { Subject } from 'rxjs';

export interface Environment {
  api: string;
  env: string;
  isProduction: boolean;
}

export const APP_ENVIRONMENT_KEY  = makeStateKey<Environment>('app-initialization');

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly transfer = inject(TransferState);
  private readonly loaded = new Subject<true>();
  private _environment: Environment | undefined;

  loaded$ = this.loaded.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this._environment = this.transfer.get<Environment>(APP_ENVIRONMENT_KEY, {
        api: '',
        env: 'unknown',
        isProduction: false,
      });
      this.loaded.next(true);
    } else {
      import('process').then((process) => {
        this._environment = {
          api: `api.${process.env['SOME_API'] ?? 'example.com'}`,
          env: `${process.env['SOME_ENV_NAME'] ?? 'dev'}`,
          isProduction: process.env['IS_PRODUCTION'] === 'true',
        };
        this.transfer.set<Environment>(APP_ENVIRONMENT_KEY, this._environment);
        this.loaded.next(true);
      });
    }
  }

  get api(): string {
    return this._environment?.api || '';
  }

  get env(): string {
    return this._environment?.env || 'unknown';
  }

  get isProduction(): boolean {
    return this._environment?.isProduction || false;
  }
}
