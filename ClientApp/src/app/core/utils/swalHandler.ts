import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { Router } from "@angular/router";
import { ErrorEditorState } from "../../shared/directives/validate-error.directive";
import Swal, { SweetAlertIcon } from "sweetalert2";




export const alertError = (message: string, html: string = "", icon: SweetAlertIcon = "error", redirect: string = "", router: Router | null = null) => {

    const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        width: 500,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    })

    if (!!html) {
        Toast.fire({
            icon: icon,
            title: html
        }).then(() => {
            if (!!redirect && !!router) {
                router.navigate([redirect]);
            }
        });
    } else {
        Toast.fire({
            icon: icon,
            title: message
        }).then(() => {
            if (!!redirect && !!router) {
                router.navigate([redirect]);
            }
        });
    }
}

export const alertSuccess = (message: string = "Success!", icon: SweetAlertIcon = "success") => {
    const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    Toast.fire({
        icon: icon,
        title: message
    });
}

export const alertConfirm = (title: string = "Are you sure?", text: string = "You won't be able to revert this!", html: string = "", confirmText: string = "Confirm", icon: SweetAlertIcon = "warning") => {
    if (!!html) {
        return Swal.fire({
            title: title,
            html: html,
            icon: icon,
            heightAuto: false,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: confirmText,
            width: '800px',
        })
    } else {
        return Swal.fire({
            title: title,
            text: text,
            icon: icon,
            heightAuto: false,
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: confirmText
        })
    }
}

export const alertThankyou = (title: string = "Thank you.", text: string = "We’ve received your information successfully.", html: string = "", confirmText: string = "Confirm", icon: SweetAlertIcon = "success") => {
    if (!!html) {
        return Swal.fire({
            title: title,
            html: html,
            icon: icon,
            heightAuto: false,
            showCancelButton: false,
            showConfirmButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: confirmText,
            width: '800px',
        })
    } else {
        return Swal.fire({
            title: title,
            text: text,
            icon: icon,
            heightAuto: false,
            showCancelButton: false,
            showConfirmButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: confirmText
        })
    }
}
export const catchErrorHandler = ((httpErrorResponse: HttpErrorResponse, validateHelper?: ErrorEditorState) => {
    if (httpErrorResponse.status === 401 || httpErrorResponse.status === 403) {

    } else {
        if (typeof (httpErrorResponse.error) === 'string') {
            (httpErrorResponse.error)
        } else if (typeof (httpErrorResponse.error) === 'object') {

            // Show toast for errorMessage
            if (httpErrorResponse?.error?.errorMessage) {
                let messages: string[] = httpErrorResponse.error.errorMessage;
                let uniqueMessages = Array.from(new Set(messages));
                let concat = uniqueMessages.join("\n");
                alertError(concat);
            }

            // Set field-level errors from errorList (independent of errorMessage)
            if (httpErrorResponse.error.errorList && validateHelper) {
                let keys = Object.keys(httpErrorResponse.error.errorList);
                for (let index = 0; index < keys.length; index++) {
                    const key = keys[index];
                    if (httpErrorResponse.error.errorList[key] != null || httpErrorResponse.error.errorList[key] != undefined) {
                        var messages = httpErrorResponse.error.errorList[key];
                        if (typeof messages === 'string') {
                            validateHelper.setError(key, messages);
                        } else if (Array.isArray(messages)) {
                            if (messages.length > 0) {
                                if (typeof messages[0] === 'string') {
                                    validateHelper.setError(key, messages);
                                } else if (messages.every(x => x && typeof x.message === 'string')) {
                                    const messageList = messages.map((x: any) => x.message);
                                    validateHelper.setError(key, messageList);
                                }
                            }
                        }
                    }
                }
            }

            // Set field-level errors from errors array (common in login validation)
            if (Array.isArray(httpErrorResponse.error?.errors) && validateHelper) {
                httpErrorResponse.error.errors.forEach((item: any) => {
                    if (item && typeof item.field === 'string' && typeof item.message === 'string') {
                        const fieldName = item.field === 'Username' ? 'UserName' : item.field;
                        validateHelper.setError(fieldName, item.message);
                    }
                });
            }

            // Fallback: no errorMessage, no errorList, and no errors array
            if (!httpErrorResponse?.error?.errorMessage && !httpErrorResponse.error.errorList && !httpErrorResponse.error.errors) {
                alertError(`Http failure response`);
            }

        } else {
            alertError(`Http failure response`)
        }
    }

    return throwError(httpErrorResponse);
});

