import { HttpContextToken } from "@angular/common/http";

export const NO_LOADING = new HttpContextToken<boolean>(() => false);
export const NO_401_REFRESH = new HttpContextToken<boolean>(() => false);

