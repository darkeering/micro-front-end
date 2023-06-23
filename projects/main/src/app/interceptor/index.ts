import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ReqResInterceptor } from "./req-res.interceptor";

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ReqResInterceptor, multi: true },
]