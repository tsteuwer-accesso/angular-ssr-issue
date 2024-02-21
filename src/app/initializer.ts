import { APP_INITIALIZER, StaticProvider, makeStateKey } from "@angular/core";
import { EnvironmentService } from "./service/environment.service";
import { HttpClient } from "@angular/common/http";
import { switchMap, take } from "rxjs";
import { PlatformLocation } from "@angular/common";

export const provideAppEnvironment = (): StaticProvider => {
  return {
    provide: APP_INITIALIZER,
    multi: true,
    useFactory: appEnvironmentFactory,
    deps: [HttpClient, EnvironmentService, PlatformLocation],
  };
}

export function appEnvironmentFactory(
  http: HttpClient,
  environment: EnvironmentService,
  location: PlatformLocation,
): () => Promise<void> {
  return () => new Promise((resolve) => {
    environment.loaded$.pipe(
      switchMap(() => {
        return http.get<any>(`https://jsonplaceholder.typicode.com/todos/1`);
      }),
      take(1),
    ).subscribe((resp: any) => {
      console.warn('response', resp);
      resolve();
    });
  })
}
