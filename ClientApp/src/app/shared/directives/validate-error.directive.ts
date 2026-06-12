import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[fieldName][errors]'
})
export class ValidateErrorDirective implements OnChanges, OnInit {

    @Input() fieldName: string = '';
    @Input() errors: string[] = [];

    private errorElement: HTMLElement | null = null;
    private errorContainer: HTMLElement | null = null;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) { }
    ngOnInit(): void {
        this.computeError()
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['errors']) {
            this.computeError()
        }
    }

    public computeError(): void {
        if (this.errorElement) {
            this.renderer.removeChild(this.errorContainer, this.errorElement);
            this.errorElement = null;
        }

        // if (this.errors && this.errors.length > 0) {
        //     const message = this.errors.join(', ');

        //     this.errorElement = this.renderer.createElement('div');
        //     const text = this.renderer.createText(message);

        //     const svg = this.renderer.createElement('span');
        //     svg.innerHTML =
        //         `
        //     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512">
        //       <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
        //             fill="currentColor"/>
        //     </svg>
        //     `;
        //     this.renderer.setStyle(svg, 'color', 'red');


        //     this.renderer.appendChild(this.errorElement, svg);
        //     this.renderer.appendChild(this.errorElement, text);
        //     this.renderer.setStyle(this.errorElement, 'display', 'flex');
        //     this.renderer.setStyle(this.errorElement, 'color', 'red');
        //     this.renderer.setStyle(this.errorElement, 'font-size', '0.75em');
        //     this.renderer.setStyle(this.errorElement, 'margin-top', '4px');

        //     const parent = this.el.nativeElement.parentElement;
        //     const container = parent?.querySelector(`[errFieldContainer="${this.fieldName}"]`);

        //     if (container) {
        //         this.renderer.appendChild(container, this.errorElement);
        //         this.errorContainer = container;
        //     } else {
        //         this.renderer.appendChild(parent, this.errorElement);
        //         this.errorContainer = parent;
        //     }


        // }

        if (this.errors && this.errors.length > 0) {

            this.errorElement = this.renderer.createElement('div');

            // container style (vertical stack)
            this.renderer.setStyle(this.errorElement, 'display', 'flex');
            this.renderer.setStyle(this.errorElement, 'flex-direction', 'column');
            this.renderer.setStyle(this.errorElement, 'gap', '4px');
            this.renderer.setStyle(this.errorElement, 'color', 'red');
            this.renderer.setStyle(this.errorElement, 'font-size', '0.75em');
            this.renderer.setStyle(this.errorElement, 'margin-top', '4px');

            this.errors.forEach(message => {

                const row = this.renderer.createElement('div');

                // row style (icon + text in one line)
                this.renderer.setStyle(row, 'display', 'flex');
                this.renderer.setStyle(row, 'align-items', 'flex-start');
                this.renderer.setStyle(row, 'gap', '6px');

                const svg = this.renderer.createElement('span');
                svg.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
              fill="currentColor"/>
          </svg>
        `;

                this.renderer.setStyle(svg, 'color', 'red');

                const text = this.renderer.createText(message);

                this.renderer.appendChild(row, svg);
                this.renderer.appendChild(row, text);

                this.renderer.appendChild(this.errorElement, row);
            });

            const parent = this.el.nativeElement.parentElement;
            const container = parent?.querySelector(`[errFieldContainer="${this.fieldName}"]`);

            if (container) {
                this.renderer.appendChild(container, this.errorElement);
                this.errorContainer = container;
            } else {
                this.renderer.appendChild(parent, this.errorElement);
                this.errorContainer = parent;
            }
        }
    }
}

export interface ErrorModel {
    [key: string]: Array<{ message: string }>;
}

export class ErrorEditorState {
    errors: ErrorModel[] = [];

    public getError(field: string): string[] {
        const found = this.errors.find(e => field in e);
        return found ? found[field].map(e => e.message) : [];
    }

    public getAllErrors(field?: string): string[] {
        if (field) {
            return this.errors
                .filter(e => field in e)
                .flatMap(e => e[field].map(err => err.message));
        }
        return this.errors.flatMap(obj =>
            Object.values(obj).flatMap(arr =>
                arr.map(e => e.message)
            )
        );
    }
    
    // public setError(field: string, message: string | string[]): void {
    //     this.clearError(field);

    //     const messages = Array.isArray(message)
    //         ? message.map(m => ({ message: m }))
    //         : [{ message }];

    //     this.errors.push({ [field]: messages });

    //     this.errors = [...this.errors]
    // }

    public setError(field: string, message: string | string[]): void {
        const messages = Array.isArray(message)
            ? message.map(m => ({ message: m }))
            : [{ message }];

        const existing = this.errors.find(e => field in e);

        if (existing) {
            // Only add messages that don't already exist
            const currentMessages = existing[field].map(m => m.message);
            messages.forEach(newM => {
                if (!currentMessages.includes(newM.message)) {
                    existing[field].push(newM);
                }
            });
        } else {
            this.errors.push({ [field]: messages });
        }

        this.errors = [...this.errors];
    }


    public clearError(field: string): void {
        this.errors = this.errors.filter(e => !(field in e));
        this.errors = [...this.errors]
    }



    public hasError(field: string): boolean {
        return this.errors.some(e => field in e);
    }

    public clearAllError(): void {
        this.errors = [];
    }
}


//EXAMPLE USAGE:
//   <div class="text-start" [fieldName]="attribute.fieldName" [errors]="commponentState.getError(attribute.fieldName)"
//     [attr.errFieldContainer]="attribute.fieldName">