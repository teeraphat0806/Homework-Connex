import { computed, Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LoadingService {
    readonly _count = signal(0);
    readonly isLoading = computed(() => this._count() > 0);

    show() {
        this._count.set(this._count() + 1);

    }

    hide() {
        this._count.set(Math.max(0, this._count() - 1));
    }
}
